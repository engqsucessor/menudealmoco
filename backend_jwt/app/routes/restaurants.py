from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from sqlalchemy.orm import Session
from typing import List, Optional
import json
from datetime import datetime
from zoneinfo import ZoneInfo
from app.models.restaurant import RestaurantResponse
from app.database.database import get_db
from app.database.models import Restaurant as DBRestaurant, User, MenuReview, ReviewVote, ReviewReport, RestaurantSubmission, EditSuggestion
from app.auth.middleware import get_current_user, get_current_reviewer, get_optional_current_user
from pydantic import BaseModel, Field

router = APIRouter()

def is_restaurant_open(hours: str) -> bool:
    """Check if restaurant is currently open based on hours string like '12:30-15:00'
    Uses Portugal timezone (Europe/Lisbon) for accurate time comparison."""
    if not hours:
        return True  # Default to open if no hours specified

    try:
        # Get current time in Portugal timezone
        portugal_tz = ZoneInfo("Europe/Lisbon")
        now = datetime.now(portugal_tz)
        current_time = now.time()

        # Parse hours string (format: "12:30-15:00")
        if '-' not in hours:
            return True

        parts = hours.split('-')
        if len(parts) != 2:
            return True

        # Parse start and end times
        start_str, end_str = parts[0].strip(), parts[1].strip()

        # Handle time formats
        start_parts = start_str.split(':')
        end_parts = end_str.split(':')

        if len(start_parts) != 2 or len(end_parts) != 2:
            return True

        start_hour, start_min = int(start_parts[0]), int(start_parts[1])
        end_hour, end_min = int(end_parts[0]), int(end_parts[1])

        # Create time objects
        from datetime import time
        start_time = time(start_hour, start_min)
        end_time = time(end_hour, end_min)

        # Check if current time is within range
        # Handle cases where restaurant is open past midnight (e.g., 19:00-01:00)
        if end_time < start_time:
            # Open past midnight: open if after start OR before end
            return current_time >= start_time or current_time < end_time
        else:
            # Normal hours: open if between start and before end (exclusive end)
            return start_time <= current_time < end_time
    except Exception as e:
        print(f"Error parsing hours '{hours}': {e}")
        return True  # Default to open on error

class SubmissionReviewRequest(BaseModel):
    action: str = Field(..., pattern="^(approved|rejected|needs_changes)$")
    comment: str = Field(default="", max_length=500)

def convert_db_to_response(db_restaurant: DBRestaurant, db: Session = None) -> dict:
    """Convert database restaurant to API response format matching mock backend"""

    # Calculate menu rating and review count if db session is provided
    menu_rating = 0.0
    menu_reviews_count = 0

    if db:
        # Get all menu reviews for this restaurant
        menu_reviews = db.query(MenuReview).filter(MenuReview.restaurant_id == db_restaurant.id).all()

        if menu_reviews:
            total_rating = sum(review.rating for review in menu_reviews)
            menu_rating = round(total_rating / len(menu_reviews), 1)
            menu_reviews_count = len(menu_reviews)

    return {
        "id": str(db_restaurant.id),
        "name": db_restaurant.name,
        "address": db_restaurant.address,
        "city": db_restaurant.city,
        "district": db_restaurant.district,
        "menuPrice": db_restaurant.menu_price,
        "priceRange": db_restaurant.price_range,
        "foodType": db_restaurant.food_type,
        "whatsIncluded": json.loads(db_restaurant.whats_included) if db_restaurant.whats_included else [],
        "practical": {
            "cardsAccepted": db_restaurant.cards_accepted,
            "quickService": db_restaurant.quick_service,
            "groupFriendly": db_restaurant.group_friendly,
            "parking": db_restaurant.parking
        },
        "googleRating": db_restaurant.google_rating,
        "googleReviews": db_restaurant.google_reviews,
        "description": db_restaurant.description,
        "dishes": json.loads(db_restaurant.dishes) if db_restaurant.dishes else [],
        "photos": json.loads(db_restaurant.photos) if db_restaurant.photos else [],
        "restaurantPhoto": db_restaurant.restaurant_photo,
        "menuPhoto": db_restaurant.menu_photo,
        "restaurantPhotos": json.loads(db_restaurant.restaurant_photo) if db_restaurant.restaurant_photo and db_restaurant.restaurant_photo.startswith('[') else ([db_restaurant.restaurant_photo] if db_restaurant.restaurant_photo else []),
        "menuPhotos": json.loads(db_restaurant.menu_photo) if db_restaurant.menu_photo and db_restaurant.menu_photo.startswith('[') else ([db_restaurant.menu_photo] if db_restaurant.menu_photo else []),
        "hours": db_restaurant.hours,
        "isOpenNow": is_restaurant_open(db_restaurant.hours),
        "status": db_restaurant.status,
        "submittedBy": db_restaurant.submitter.email if db_restaurant.submitter else None,
        "submittedAt": db_restaurant.submitted_at.isoformat() if db_restaurant.submitted_at else None,
        "approvedBy": db_restaurant.approver.email if db_restaurant.approver else None,
        "approvedAt": db_restaurant.approved_at.isoformat() if db_restaurant.approved_at else None,
        # Add menu rating fields
        "menuRating": menu_rating,
        "menuReviews": menu_reviews_count
    }

@router.get("/restaurants")
async def get_restaurants(
    request: Request,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user),
    query: Optional[str] = Query(None),
    location: Optional[str] = Query(None),
    foodTypes: Optional[str] = Query(None),
    minPrice: Optional[float] = Query(None),
    maxPrice: Optional[float] = Query(None),
    sortBy: Optional[str] = Query("rating"),
    sortOrder: Optional[str] = Query("desc"),
    page: Optional[int] = Query(1),
    limit: Optional[int] = Query(10),
    # Additional frontend filter parameters
    maxDistance: Optional[float] = Query(None),
    priceRange: Optional[str] = Query(None),
    openNow: Optional[bool] = Query(None),
    minGoogleRating: Optional[float] = Query(None),
    overallRating: Optional[float] = Query(None),
    hasMenuReviews: Optional[bool] = Query(None),
    lastUpdatedDays: Optional[str] = Query(None),
    showOnlyFavorites: Optional[bool] = Query(None)
):
    """Get restaurants with filtering and sorting - matches mock backend behavior"""

    # Get query parameters for features and practicalFilters
    query_params = dict(request.query_params)

    # Debug: print received parameters
    print(f"🔍 Received query params: {query_params}")
    print(f"🔍 showOnlyFavorites: {showOnlyFavorites}, openNow: {openNow}")
    print(f"🔍 minGoogleRating: {minGoogleRating}, overallRating: {overallRating}")

    # Get all approved restaurants
    restaurants_query = db.query(DBRestaurant).filter(DBRestaurant.status == "approved")

    # Apply favorites filter if requested and user is authenticated
    if showOnlyFavorites and current_user:
        # Filter to only restaurants favorited by the current user
        restaurants_query = restaurants_query.join(DBRestaurant.favorited_by).filter(
            User.id == current_user.id
        )

    db_restaurants = restaurants_query.all()

    # Convert to response format with menu rating calculation
    restaurants = [convert_db_to_response(r, db) for r in db_restaurants]

    # Apply text search filter
    if query:
        query_lower = query.lower()
        restaurants = [r for r in restaurants if (
            query_lower in r["name"].lower() or
            (r["description"] and query_lower in r["description"].lower()) or
            any(query_lower in dish.lower() for dish in r["dishes"])
        )]

    # Apply location filter - also search restaurant names
    if location:
        location_lower = location.lower()
        restaurants = [r for r in restaurants if (
            location_lower in r["name"].lower() or
            location_lower in r["city"].lower() or
            location_lower in r["district"].lower() or
            location_lower in r["address"].lower()
        )]

    # Apply food type filter
    if foodTypes:
        food_types_list = [ft.strip() for ft in foodTypes.split(",")]
        restaurants = [r for r in restaurants if r["foodType"] in food_types_list]

    # Apply price filter
    if minPrice is not None or maxPrice is not None:
        min_p = minPrice if minPrice is not None else 0
        max_p = maxPrice if maxPrice is not None else float('inf')
        restaurants = [r for r in restaurants if min_p <= r["menuPrice"] <= max_p]

    # Apply Google rating filter
    if minGoogleRating is not None and minGoogleRating > 0:
        restaurants = [r for r in restaurants if r["googleRating"] and r["googleRating"] >= minGoogleRating]

    # Apply menu rating filter (overallRating)
    if overallRating is not None and overallRating > 0:
        restaurants = [r for r in restaurants if r["menuRating"] >= overallRating]

    # Apply menu reviews filter
    if hasMenuReviews:
        restaurants = [r for r in restaurants if r["menuReviews"] > 0]

    # Apply practical filters (cards, parking, quick service, group friendly)
    # Check for practicalFilters.takesCards, practicalFilters.hasParking, etc.
    for key, value in query_params.items():
        if key.startswith('practicalFilters[') and value.lower() == 'true':
            filter_name = key.split('[')[1].rstrip(']')
            if filter_name == 'takesCards':
                restaurants = [r for r in restaurants if r["practical"]["cardsAccepted"]]
            elif filter_name == 'hasParking':
                restaurants = [r for r in restaurants if r["practical"]["parking"]]
            elif filter_name == 'quickService':
                restaurants = [r for r in restaurants if r["practical"]["quickService"]]
            elif filter_name == 'groupFriendly':
                restaurants = [r for r in restaurants if r["practical"]["groupFriendly"]]

    # Apply features filters (coffee, dessert, wine, bread included)
    for key, value in query_params.items():
        if key.startswith('features[') and value.lower() == 'true':
            filter_name = key.split('[')[1].rstrip(']')
            # Map frontend feature names to backend whatsIncluded items (lowercase)
            feature_map = {
                'coffeeIncluded': 'coffee',
                'dessertIncluded': 'dessert',
                'wineAvailable': 'wine',
                'breadSoupIncluded': 'couvert'
                # TODO: Add vegetarianOptions mapping when implemented
            }
            if filter_name in feature_map:
                required_item = feature_map[filter_name]
                restaurants = [r for r in restaurants if required_item in r["whatsIncluded"]]

    # Apply openNow filter
    if openNow:
        restaurants = [r for r in restaurants if r.get("isOpenNow", False)]

    # TODO: Implement lastUpdatedDays filter - requires updated_at timestamp
    # if lastUpdatedDays:
    #     cutoff_date = datetime.now() - timedelta(days=int(lastUpdatedDays))
    #     restaurants = [r for r in restaurants if r["updatedAt"] >= cutoff_date]

    # TODO: Implement maxDistance filter - requires geolocation calculation
    # if maxDistance and userLocation:
    #     restaurants = [r for r in restaurants if calculate_distance(r, userLocation) <= maxDistance]

    # Apply sorting
    reverse = sortOrder == "desc"
    if sortBy == "price":
        restaurants.sort(key=lambda x: x["menuPrice"], reverse=reverse)
    elif sortBy == "rating":
        # Sort by menu rating first, fallback to Google rating if no menu reviews
        restaurants.sort(key=lambda x: x["menuRating"] if x["menuRating"] > 0 else (x["googleRating"] or 0), reverse=reverse)
    elif sortBy == "menuRating":
        restaurants.sort(key=lambda x: x["menuRating"], reverse=reverse)
    elif sortBy == "googleRating":
        restaurants.sort(key=lambda x: x["googleRating"] or 0, reverse=reverse)
    elif sortBy == "name":
        restaurants.sort(key=lambda x: x["name"], reverse=reverse)

    # Apply pagination
    total_count = len(restaurants)
    start_index = (page - 1) * limit
    end_index = start_index + limit
    paginated_restaurants = restaurants[start_index:end_index]

    return {
        "restaurants": paginated_restaurants,
        "total": total_count,
        "page": page,
        "limit": limit,
        "totalPages": (total_count + limit - 1) // limit
    }

@router.post("/restaurants/submit")
async def submit_restaurant(
    request: Request,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """Submit a new restaurant for review - authentication optional"""

    # Get the request body
    try:
        body = await request.body()
        body_str = body.decode('utf-8')
        restaurant_data = json.loads(body_str)
    except:
        raise HTTPException(status_code=422, detail="Invalid request body")

    # Create submission
    submission = RestaurantSubmission(
        restaurant_name=restaurant_data.get('name', 'Unknown'),
        submitted_by_id=current_user.id if current_user else None,
        data=body_str
    )

    db.add(submission)

    try:
        db.commit()
        db.refresh(submission)
        return {
            "id": str(submission.id),
            "restaurant_name": submission.restaurant_name,
            "status": submission.status,
            "submitted_at": submission.submitted_at.isoformat()
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error submitting restaurant: {str(e)}")

@router.get("/restaurants/submissions")
async def get_submissions(
    status: str = Query("all"),
    db: Session = Depends(get_db)
):
    """Get restaurant submissions - optionally filter by status"""

    # Build query
    query = db.query(RestaurantSubmission)

    if status != "all":
        query = query.filter(RestaurantSubmission.status == status)

    submissions = query.all()

    result = []
    for submission in submissions:
        # Get submitter info
        submitter = db.query(User).filter(User.id == submission.submitted_by_id).first()

        # Get approver info if approved
        approver = None
        if submission.approved_by_id:
            approver = db.query(User).filter(User.id == submission.approved_by_id).first()

        # Parse the restaurant data
        try:
            restaurant_data = json.loads(submission.data)
        except:
            restaurant_data = {}

        result.append({
            "id": str(submission.id),
            "restaurant_name": submission.restaurant_name,
            "status": submission.status,
            "submitted_at": submission.submitted_at.isoformat(),
            "reviewed_at": submission.reviewed_at.isoformat() if submission.reviewed_at else None,
            "submitter": {
                "email": submitter.email if submitter else "unknown",
                "displayName": submitter.display_name if submitter else f"User{submission.submitted_by_id}"
            },
            "approver": {
                "email": approver.email if approver else None,
                "displayName": approver.display_name if approver else None
            } if approver else None,
            "data": restaurant_data,
            "reviewer_comments": json.loads(submission.reviewer_comments) if submission.reviewer_comments else None
        })

    return result

@router.post("/restaurants/submissions/{submission_id}/review")
async def review_submission(
    submission_id: str,
    review_data: SubmissionReviewRequest,
    db: Session = Depends(get_db),
    reviewer: User = Depends(get_current_reviewer)
):
    """Review a restaurant submission - only reviewers can do this"""
    try:
        submission_id_int = int(submission_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid submission ID"
        )

    # Find the submission
    submission = db.query(RestaurantSubmission).filter(RestaurantSubmission.id == submission_id_int).first()
    if not submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Submission not found"
        )

    # Update submission
    submission.status = review_data.action
    submission.approved_by_id = reviewer.id
    submission.reviewed_at = datetime.now()
    submission.reviewer_comments = json.dumps({"comment": review_data.comment})

    try:
        db.commit()
        return {
            "id": str(submission.id),
            "status": submission.status,
            "action": review_data.action,
            "message": f"Submission {review_data.action} successfully"
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error reviewing submission: {str(e)}")

@router.get("/restaurants/{restaurant_id}")
async def get_restaurant(restaurant_id: str, db: Session = Depends(get_db)):
    """Get single restaurant by ID"""
    try:
        restaurant_id_int = int(restaurant_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid restaurant ID")

    db_restaurant = db.query(DBRestaurant).filter(DBRestaurant.id == restaurant_id_int).first()
    if not db_restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")

    return convert_db_to_response(db_restaurant, db)

@router.get("/restaurants/{restaurant_id}/details")
async def get_restaurant_details(
    restaurant_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """Get restaurant with reviews and edit suggestions in one call - optimized for detail page"""
    try:
        restaurant_id_int = int(restaurant_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid restaurant ID")

    # Get restaurant
    db_restaurant = db.query(DBRestaurant).filter(DBRestaurant.id == restaurant_id_int).first()
    if not db_restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")

    restaurant_data = convert_db_to_response(db_restaurant, db)

    # Get reviews
    reviews = db.query(MenuReview).filter(
        MenuReview.restaurant_id == restaurant_id_int,
        MenuReview.is_hidden == False
    ).all()

    reviews_data = []
    for review in reviews:
        user = db.query(User).filter(User.id == review.user_id).first()

        # Get user's vote on this review if user is logged in
        user_vote = None
        if current_user:
            vote = db.query(ReviewVote).filter(
                ReviewVote.user_id == current_user.id,
                ReviewVote.review_id == review.id
            ).first()
            if vote:
                user_vote = vote.vote_type

        reviews_data.append({
            "id": str(review.id),
            "userId": user.email if user else "unknown",
            "restaurantId": str(review.restaurant_id),
            "rating": review.rating,
            "comment": review.comment,
            "displayName": user.display_name if user else f"User{review.user_id}",
            "upvotes": review.upvotes,
            "downvotes": review.downvotes,
            "createdAt": review.created_at.isoformat(),
            "userVotes": {"currentUserVote": user_vote} if current_user else {}
        })

    # Get pending edit suggestions
    edit_suggestions = db.query(EditSuggestion).filter(
        EditSuggestion.restaurant_id == restaurant_id_int,
        EditSuggestion.status == "pending"
    ).all()

    suggestions_data = []
    for suggestion in edit_suggestions:
        user = db.query(User).filter(User.id == suggestion.user_id).first()
        suggestions_data.append({
            "id": str(suggestion.id),
            "restaurant_id": str(suggestion.restaurant_id),
            "user_email": user.email if user else "anonymous",
            "display_name": user.display_name if user else "Anonymous",
            "suggested_changes": json.loads(suggestion.suggested_changes),
            "reason": suggestion.reason,
            "status": suggestion.status,
            "created_at": suggestion.created_at.isoformat(),
            "upvotes": suggestion.upvotes,
            "downvotes": suggestion.downvotes
        })

    return {
        "restaurant": restaurant_data,
        "reviews": reviews_data,
        "editSuggestions": suggestions_data
    }

@router.delete("/restaurants/{restaurant_id}")
async def delete_restaurant(
    restaurant_id: str,
    db: Session = Depends(get_db),
    reviewer: User = Depends(get_current_reviewer)
):
    """Delete a restaurant - only reviewers/admins can do this"""
    try:
        restaurant_id_int = int(restaurant_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid restaurant ID"
        )

    # Find the restaurant
    restaurant = db.query(DBRestaurant).filter(DBRestaurant.id == restaurant_id_int).first()
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")

    # Delete related data in correct order to avoid foreign key constraints

    # 1. Delete review reports first (they reference reviews)
    review_reports = db.query(ReviewReport).join(MenuReview).filter(
        MenuReview.restaurant_id == restaurant_id_int
    ).all()
    for report in review_reports:
        db.delete(report)

    # 2. Delete review votes (they reference reviews)
    review_votes = db.query(ReviewVote).join(MenuReview).filter(
        MenuReview.restaurant_id == restaurant_id_int
    ).all()
    for vote in review_votes:
        db.delete(vote)

    # 3. Delete reviews
    reviews = db.query(MenuReview).filter(MenuReview.restaurant_id == restaurant_id_int).all()
    for review in reviews:
        db.delete(review)

    # 4. Clear favorite relationships (many-to-many table)
    restaurant.favorited_by.clear()

    # 5. Finally delete the restaurant
    db.delete(restaurant)

    try:
        db.commit()
        return {"message": f"Restaurant '{restaurant.name}' and all related data deleted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error deleting restaurant: {str(e)}")

# ==================== FAVORITES ENDPOINTS ====================

@router.get("/favorites")
async def get_user_favorites(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all favorite restaurant IDs for the current user"""
    favorite_ids = [str(restaurant.id) for restaurant in current_user.favorite_restaurants]
    return {"favorites": favorite_ids}

@router.get("/favorites/restaurants")
async def get_favorite_restaurants(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get full restaurant data for all favorited restaurants"""
    favorite_restaurants = current_user.favorite_restaurants
    restaurants = [convert_db_to_response(r, db) for r in favorite_restaurants]
    return {"restaurants": restaurants}

@router.post("/favorites/{restaurant_id}")
async def add_favorite(
    restaurant_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Add a restaurant to user's favorites"""
    try:
        restaurant_id_int = int(restaurant_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid restaurant ID")

    # Check if restaurant exists
    restaurant = db.query(DBRestaurant).filter(DBRestaurant.id == restaurant_id_int).first()
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")

    # Check if already favorited
    if restaurant in current_user.favorite_restaurants:
        return {"message": "Restaurant already in favorites", "favorited": True}

    # Add to favorites
    current_user.favorite_restaurants.append(restaurant)

    try:
        db.commit()
        return {"message": "Restaurant added to favorites", "favorited": True}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error adding favorite: {str(e)}")

@router.delete("/favorites/{restaurant_id}")
async def remove_favorite(
    restaurant_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Remove a restaurant from user's favorites"""
    try:
        restaurant_id_int = int(restaurant_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid restaurant ID")

    # Check if restaurant exists
    restaurant = db.query(DBRestaurant).filter(DBRestaurant.id == restaurant_id_int).first()
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")

    # Remove from favorites if present
    if restaurant in current_user.favorite_restaurants:
        current_user.favorite_restaurants.remove(restaurant)
        try:
            db.commit()
            return {"message": "Restaurant removed from favorites", "favorited": False}
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=f"Error removing favorite: {str(e)}")

    return {"message": "Restaurant was not in favorites", "favorited": False}