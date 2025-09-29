from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from typing import List, Optional
import json
from app.database.database import get_db
from app.database.models import MenuReview, User, Restaurant, ReviewVote
from app.models.restaurant import MenuReviewCreate, MenuReviewResponse
from app.auth.middleware import get_current_user, get_optional_current_user
from pydantic import BaseModel, Field
from datetime import datetime

router = APIRouter()

class VoteRequest(BaseModel):
    vote_type: str = Field(..., pattern="^(up|down)$")

@router.get("/restaurants/{restaurant_id}/reviews")
async def get_menu_reviews(
    restaurant_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """Get all reviews for a restaurant in the format frontend expects"""
    try:
        restaurant_id_int = int(restaurant_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid restaurant ID"
        )

    reviews = db.query(MenuReview).filter(
        MenuReview.restaurant_id == restaurant_id_int,
        MenuReview.is_hidden == False
    ).all()

    result = []
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

        result.append({
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

    return result

@router.post("/restaurants/{restaurant_id}/reviews")
async def add_menu_review(
    restaurant_id: str,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Add a new review"""
    try:
        restaurant_id_int = int(restaurant_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid restaurant ID")

    # Get and parse the request body manually
    try:
        body = await request.body()
        body_str = body.decode('utf-8')
        
        # Parse JSON
        review_data_dict = json.loads(body_str)
        
        # Create review data object
        review_data = MenuReviewCreate(
            rating=float(review_data_dict.get('rating')),
            comment=review_data_dict.get('comment', '')
        )
        
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Error parsing request body: {str(e)}")

    # Validate rating
    if not (0 <= review_data.rating <= 5):
        raise HTTPException(status_code=422, detail="Rating must be between 0 and 5")

    # Create review using authenticated user
    new_review = MenuReview(
        user_id=current_user.id,
        restaurant_id=restaurant_id_int,
        rating=review_data.rating,
        comment=review_data.comment or "",
        upvotes=0,
        downvotes=0,
        created_at=datetime.now()
    )

    db.add(new_review)
    db.commit()
    db.refresh(new_review)

    return {
        "id": str(new_review.id),
        "userId": current_user.email,
        "restaurantId": str(new_review.restaurant_id),
        "rating": new_review.rating,
        "comment": new_review.comment,
        "displayName": current_user.display_name,
        "upvotes": new_review.upvotes,
        "downvotes": new_review.downvotes,
        "createdAt": new_review.created_at.isoformat(),
        "userVotes": {}
    }

@router.post("/reviews/{review_id}/vote")
async def vote_on_review(
    review_id: str,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Handle voting on reviews with proper vote tracking to prevent multiple votes"""
    try:
        review_id_int = int(review_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid review ID")

    # Get the request body
    try:
        body = await request.body()
        body_str = body.decode('utf-8')
        vote_data = json.loads(body_str)
        vote_type = vote_data.get('vote_type')
    except:
        raise HTTPException(status_code=422, detail="Invalid request body")

    if not vote_type or vote_type not in ['up', 'down']:
        raise HTTPException(status_code=400, detail="vote_type must be 'up' or 'down'")

    # Find the review
    review = db.query(MenuReview).filter(MenuReview.id == review_id_int).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")

    # Check if user has already voted on this review
    existing_vote = db.query(ReviewVote).filter(
        ReviewVote.user_id == current_user.id,
        ReviewVote.review_id == review_id_int
    ).first()

    # Handle the vote
    if existing_vote:
        if existing_vote.vote_type == vote_type:
            # User is trying to vote the same way again - remove their vote
            if vote_type == 'up':
                review.upvotes = max(0, review.upvotes - 1)
            else:
                review.downvotes = max(0, review.downvotes - 1)

            db.delete(existing_vote)
            new_vote_type = None
        else:
            # User is changing their vote (up -> down or down -> up)
            if existing_vote.vote_type == 'up':
                review.upvotes = max(0, review.upvotes - 1)
                review.downvotes += 1
            else:
                review.downvotes = max(0, review.downvotes - 1)
                review.upvotes += 1

            existing_vote.vote_type = vote_type
            new_vote_type = vote_type
    else:
        # New vote
        if vote_type == 'up':
            review.upvotes += 1
        else:
            review.downvotes += 1

        # Create new vote record
        new_vote = ReviewVote(
            user_id=current_user.id,
            review_id=review_id_int,
            vote_type=vote_type
        )
        db.add(new_vote)
        new_vote_type = vote_type

    db.commit()
    db.refresh(review)

    # Get the review author for response
    review_user = db.query(User).filter(User.id == review.user_id).first()

    return {
        "id": str(review.id),
        "userId": review_user.email if review_user else "unknown",
        "restaurantId": str(review.restaurant_id),
        "rating": review.rating,
        "comment": review.comment,
        "displayName": review_user.display_name if review_user else f"User{review.user_id}",
        "upvotes": review.upvotes,
        "downvotes": review.downvotes,
        "createdAt": review.created_at.isoformat(),
        "userVotes": {"currentUserVote": new_vote_type}
    }