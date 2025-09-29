from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from typing import List, Optional
import json
from app.database.database import get_db
from app.database.models import EditSuggestion, User, Restaurant, EditSuggestionVote
from app.auth.middleware import get_current_user, get_current_reviewer, get_optional_current_user
from datetime import datetime

router = APIRouter()

@router.get("/edit-suggestions/all")
async def get_all_edit_suggestions(
    db: Session = Depends(get_db),
    status: str = "all",
    current_user: User = Depends(get_current_reviewer)
):
    """Get all edit suggestions across all restaurants for reviewers - JWT protected"""

    # Build query
    query = db.query(EditSuggestion)

    if status != "all":
        query = query.filter(EditSuggestion.status == status)

    suggestions = query.order_by(EditSuggestion.created_at.desc()).all()

    result = []
    for suggestion in suggestions:
        # Get suggestion author
        author = db.query(User).filter(User.id == suggestion.user_id).first()

        # Get restaurant name
        restaurant = db.query(Restaurant).filter(Restaurant.id == suggestion.restaurant_id).first()

        # Parse suggested changes
        try:
            suggested_changes = json.loads(suggestion.suggested_changes)
        except:
            suggested_changes = {}

        result.append({
            "id": str(suggestion.id),
            "restaurant_id": str(suggestion.restaurant_id),
            "restaurant_name": restaurant.name if restaurant else f"Restaurant {suggestion.restaurant_id}",
            "user_email": author.email if author else "unknown",
            "display_name": author.display_name if author else f"User{suggestion.user_id}",
            "suggested_changes": suggested_changes,
            "reason": suggestion.reason,
            "status": suggestion.status,
            "created_at": suggestion.created_at.isoformat(),
            "upvotes": suggestion.upvotes,
            "downvotes": suggestion.downvotes
        })

    return result

@router.post("/restaurants/{restaurant_id}/edit-suggestions")
async def submit_edit_suggestion(
    restaurant_id: str,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Submit an edit suggestion for a restaurant - JWT protected"""
    print(f"📝 Submit edit suggestion called for restaurant {restaurant_id} by user {current_user.email}")
    try:
        restaurant_id_int = int(restaurant_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid restaurant ID")

    # Get request body
    try:
        body = await request.body()
        body_str = body.decode('utf-8')
        data = json.loads(body_str)
        suggested_changes = data.get('changes', {})
        reason = data.get('reason', '')
    except:
        raise HTTPException(status_code=422, detail="Invalid request body")

    # Verify restaurant exists
    restaurant = db.query(Restaurant).filter(Restaurant.id == restaurant_id_int).first()
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")

    # Create edit suggestion
    suggestion = EditSuggestion(
        restaurant_id=restaurant_id_int,
        user_id=current_user.id,
        suggested_changes=json.dumps(suggested_changes),
        reason=reason,
        upvotes=0,
        downvotes=0
    )

    db.add(suggestion)

    try:
        db.commit()
        db.refresh(suggestion)
        return {
            "id": str(suggestion.id),
            "restaurant_id": str(suggestion.restaurant_id),
            "user_email": current_user.email,
            "display_name": current_user.display_name,
            "suggested_changes": suggested_changes,
            "reason": suggestion.reason,
            "status": suggestion.status,
            "created_at": suggestion.created_at.isoformat(),
            "upvotes": suggestion.upvotes,
            "downvotes": suggestion.downvotes
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error creating edit suggestion: {str(e)}")

@router.get("/restaurants/{restaurant_id}/edit-suggestions")
async def get_edit_suggestions(
    restaurant_id: str,
    db: Session = Depends(get_db),
    status: str = "all",
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """Get edit suggestions for a restaurant - optionally authenticated"""
    try:
        restaurant_id_int = int(restaurant_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid restaurant ID")

    # Build query
    query = db.query(EditSuggestion).filter(EditSuggestion.restaurant_id == restaurant_id_int)

    if status != "all":
        query = query.filter(EditSuggestion.status == status)

    suggestions = query.all()

    result = []
    for suggestion in suggestions:
        # Get suggestion author
        author = db.query(User).filter(User.id == suggestion.user_id).first()

        # Get current user's vote if logged in
        user_vote = None
        if current_user:
            vote = db.query(EditSuggestionVote).filter(
                EditSuggestionVote.user_id == current_user.id,
                EditSuggestionVote.suggestion_id == suggestion.id
            ).first()
            if vote:
                user_vote = vote.vote_type

        # Parse suggested changes
        try:
            suggested_changes = json.loads(suggestion.suggested_changes)
        except:
            suggested_changes = {}

        result.append({
            "id": str(suggestion.id),
            "restaurant_id": str(suggestion.restaurant_id),
            "user_email": author.email if author else "unknown",
            "display_name": author.display_name if author else f"User{suggestion.user_id}",
            "suggested_changes": suggested_changes,
            "reason": suggestion.reason,
            "status": suggestion.status,
            "created_at": suggestion.created_at.isoformat(),
            "upvotes": suggestion.upvotes,
            "downvotes": suggestion.downvotes,
            "user_vote": user_vote
        })

    return result

@router.post("/edit-suggestions/{suggestion_id}/vote")
async def vote_on_edit_suggestion(
    suggestion_id: str,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Vote on an edit suggestion"""
    try:
        suggestion_id_int = int(suggestion_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid suggestion ID")

    # Get request body
    try:
        body = await request.body()
        body_str = body.decode('utf-8')
        data = json.loads(body_str)
        vote_type = data.get('vote_type')  # 'upvote', 'downvote'
    except:
        raise HTTPException(status_code=422, detail="Invalid request body")

    if not vote_type or vote_type not in ['upvote', 'downvote']:
        raise HTTPException(status_code=400, detail="vote_type must be 'upvote' or 'downvote'")

    # Find suggestion
    suggestion = db.query(EditSuggestion).filter(EditSuggestion.id == suggestion_id_int).first()
    if not suggestion:
        raise HTTPException(status_code=404, detail="Suggestion not found")

    # Check for existing vote
    existing_vote = db.query(EditSuggestionVote).filter(
        EditSuggestionVote.user_id == current_user.id,
        EditSuggestionVote.suggestion_id == suggestion_id_int
    ).first()

    # Convert vote_type to database format
    vote_db_type = 'up' if vote_type == 'upvote' else 'down'

    if existing_vote:
        if existing_vote.vote_type == vote_db_type:
            # Remove vote (toggle off)
            if vote_db_type == 'up':
                suggestion.upvotes = max(0, suggestion.upvotes - 1)
            else:
                suggestion.downvotes = max(0, suggestion.downvotes - 1)
            db.delete(existing_vote)
            new_vote = None
        else:
            # Change vote
            if existing_vote.vote_type == 'up':
                suggestion.upvotes = max(0, suggestion.upvotes - 1)
                suggestion.downvotes += 1
            else:
                suggestion.downvotes = max(0, suggestion.downvotes - 1)
                suggestion.upvotes += 1
            existing_vote.vote_type = vote_db_type
            new_vote = vote_type
    else:
        # New vote
        if vote_db_type == 'up':
            suggestion.upvotes += 1
        else:
            suggestion.downvotes += 1

        new_vote_record = EditSuggestionVote(
            user_id=current_user.id,
            suggestion_id=suggestion_id_int,
            vote_type=vote_db_type
        )
        db.add(new_vote_record)
        new_vote = vote_type

    try:
        db.commit()
        db.refresh(suggestion)

        return {
            "id": str(suggestion.id),
            "upvotes": suggestion.upvotes,
            "downvotes": suggestion.downvotes,
            "user_vote": new_vote
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error voting on suggestion: {str(e)}")

@router.post("/edit-suggestions/{suggestion_id}/approve")
async def approve_edit_suggestion(
    suggestion_id: str,
    request: Request,
    db: Session = Depends(get_db),
    current_reviewer: User = Depends(get_current_reviewer)
):
    """Approve an edit suggestion - only reviewers can do this"""
    try:
        suggestion_id_int = int(suggestion_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid suggestion ID")

    # JWT authentication ensures current_reviewer is valid and is a reviewer
    # Find suggestion
    suggestion = db.query(EditSuggestion).filter(EditSuggestion.id == suggestion_id_int).first()
    if not suggestion:
        raise HTTPException(status_code=404, detail="Suggestion not found")

    # Find the restaurant to apply changes to
    restaurant = db.query(Restaurant).filter(Restaurant.id == suggestion.restaurant_id).first()
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")

    # Parse the suggested changes
    try:
        suggested_changes = json.loads(suggestion.suggested_changes)
    except:
        raise HTTPException(status_code=400, detail="Invalid suggested changes format")

    # Apply the changes to the restaurant
    try:
        for field, change_data in suggested_changes.items():
            # Handle the git-style diff format: { from: oldValue, to: newValue }
            if isinstance(change_data, dict) and 'to' in change_data:
                new_value = change_data['to']
            else:
                # Fallback for old format
                new_value = change_data

            # Apply changes based on field type
            if field == 'name':
                restaurant.name = new_value
            elif field == 'address':
                restaurant.address = new_value
            elif field == 'district':
                restaurant.district = new_value
            elif field == 'city':
                restaurant.city = new_value
            elif field == 'menuPrice':
                restaurant.menu_price = float(new_value) if new_value is not None else None
            elif field == 'priceRange':
                restaurant.price_range = new_value
            elif field == 'foodType':
                restaurant.food_type = new_value
            elif field == 'googleRating':
                restaurant.google_rating = float(new_value) if new_value is not None else None
            elif field == 'googleReviews':
                restaurant.google_reviews = int(new_value) if new_value is not None else None
            elif field == 'description':
                restaurant.description = new_value
            elif field == 'numberOfDishes':
                # This will be handled by the dishes field
                pass
            elif field == 'dishes':
                if isinstance(new_value, list):
                    restaurant.dishes = json.dumps(new_value)
                else:
                    restaurant.dishes = json.dumps([])
            elif field == 'whatsIncluded':
                if isinstance(new_value, list):
                    restaurant.whats_included = json.dumps(new_value)
                else:
                    restaurant.whats_included = json.dumps([])
            elif field in ['cardsAccepted', 'quickService', 'groupFriendly', 'parking']:
                # Handle practical fields by mapping to individual database fields
                field_mapping = {
                    'cardsAccepted': 'cards_accepted',
                    'quickService': 'quick_service', 
                    'groupFriendly': 'group_friendly',
                    'parking': 'parking'
                }
                
                db_field = field_mapping.get(field)
                if db_field and hasattr(restaurant, db_field):
                    setattr(restaurant, db_field, bool(new_value))
            elif field == 'restaurantPhoto':
                restaurant.restaurant_photo = new_value
            elif field == 'menuPhoto':
                restaurant.menu_photo = new_value
            elif field == 'distance':
                # Distance is not stored in the restaurant model - it's calculated
                pass

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error applying changes to restaurant: {str(e)}")

    # Update suggestion status
    suggestion.status = "approved"
    suggestion.reviewed_by_id = current_reviewer.id
    suggestion.reviewed_at = datetime.now()

    try:
        db.commit()
        return {
            "id": str(suggestion.id),
            "status": suggestion.status,
            "message": "Edit suggestion approved and changes applied to restaurant successfully"
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error approving suggestion: {str(e)}")

@router.post("/edit-suggestions/{suggestion_id}/reject")
async def reject_edit_suggestion(
    suggestion_id: str,
    request: Request,
    db: Session = Depends(get_db),
    current_reviewer: User = Depends(get_current_reviewer)
):
    """Reject an edit suggestion - only reviewers can do this"""
    try:
        suggestion_id_int = int(suggestion_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid suggestion ID")

    # Get request body
    try:
        body = await request.body()
        body_str = body.decode('utf-8')
        data = json.loads(body_str)
        reason = data.get('reason', '')
    except:
        raise HTTPException(status_code=422, detail="Invalid request body")

    # JWT authentication ensures current_reviewer is valid and is a reviewer
    # Find suggestion
    suggestion = db.query(EditSuggestion).filter(EditSuggestion.id == suggestion_id_int).first()
    if not suggestion:
        raise HTTPException(status_code=404, detail="Suggestion not found")

    # Update suggestion
    suggestion.status = "rejected"
    suggestion.reviewed_by_id = current_reviewer.id
    suggestion.reviewed_at = datetime.now()
    suggestion.rejection_reason = reason

    try:
        db.commit()
        return {
            "id": str(suggestion.id),
            "status": suggestion.status,
            "message": "Edit suggestion rejected successfully"
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error rejecting suggestion: {str(e)}")