from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from sqlalchemy.orm import Session
from typing import List, Optional
import json
from datetime import datetime
from app.models.restaurant import RestaurantResponse
from app.database.database import get_db
from app.database.models import Restaurant as DBRestaurant, User, MenuReview, ReviewVote, ReviewReport, RestaurantSubmission
from app.auth.middleware import get_current_user, get_current_reviewer
from pydantic import BaseModel, Field

router = APIRouter()

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
    db: Session = Depends(get_db),
    query: Optional[str] = Query(None),
    location: Optional[str] = Query(None),
    foodTypes: Optional[str] = Query(None),
    minPrice: Optional[float] = Query(None),
    maxPrice: Optional[float] = Query(None),
    sortBy: Optional[str] = Query("rating"),
    sortOrder: Optional[str] = Query("desc"),
    page: Optional[int] = Query(1),
    limit: Optional[int] = Query(10)
):
    """Get restaurants with filtering and sorting - matches mock backend behavior"""

    # Get all approved restaurants
    restaurants_query = db.query(DBRestaurant).filter(DBRestaurant.status == "approved")
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

    # Apply location filter
    if location:
        location_lower = location.lower()
        restaurants = [r for r in restaurants if (
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
    current_user: User = Depends(get_current_user)
):
    """Submit a new restaurant for review - requires authentication"""

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
        submitted_by_id=current_user.id,
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