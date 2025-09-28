from fastapi import APIRouter, Depends, HTTPException, Header, Request
from sqlalchemy.orm import Session
from typing import List
import json
from app.database.database import get_db
from app.database.models import MenuReview, User, Restaurant
from app.models.restaurant import MenuReviewCreate, MenuReviewResponse
from datetime import datetime

router = APIRouter()

@router.get("/restaurants/{restaurant_id}/reviews")
async def get_menu_reviews(restaurant_id: str, db: Session = Depends(get_db)):
    """Get all reviews for a restaurant in the format frontend expects"""
    try:
        restaurant_id_int = int(restaurant_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid restaurant ID")

    reviews = db.query(MenuReview).filter(
        MenuReview.restaurant_id == restaurant_id_int,
        MenuReview.is_hidden == False
    ).all()

    result = []
    for review in reviews:
        user = db.query(User).filter(User.id == review.user_id).first()
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
            "userVotes": {}  # TODO: Implement user votes tracking
        })

    return result

@router.post("/restaurants/{restaurant_id}/reviews")
async def add_menu_review(
    restaurant_id: str,
    request: Request,
    db: Session = Depends(get_db),
    user_email: str = Header(alias="X-User-Email"),
    display_name: str = Header(alias="X-Display-Name", default="Anonymous")
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

    # Find user by email
    user = db.query(User).filter(User.email == user_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Create review
    new_review = MenuReview(
        user_id=user.id,
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
        "userId": user.email,
        "restaurantId": str(new_review.restaurant_id),
        "rating": new_review.rating,
        "comment": new_review.comment,
        "displayName": user.display_name,
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
    user_email: str = Header(alias="X-User-Email")
):
    """Simple voting endpoint - just increment upvotes or downvotes"""
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

    # Find user
    user = db.query(User).filter(User.email == user_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Simple voting - just increment the count
    if vote_type == 'up':
        review.upvotes += 1
    elif vote_type == 'down':
        review.downvotes += 1

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
        "userVotes": {}
    }