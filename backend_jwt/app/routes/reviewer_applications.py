from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database.database import get_db
from app.database.models import User, ReviewerApplication
from app.models.restaurant import (
    ReviewerApplicationCreate,
    ReviewerApplicationResponse,
    ReviewerApplicationReview
)
from app.auth.middleware import get_current_user
from typing import List
from datetime import datetime

router = APIRouter()


def is_admin(current_user: User) -> bool:
    """Check if current user is an admin"""
    return current_user.is_admin


@router.post("/reviewer-applications", response_model=ReviewerApplicationResponse)
async def apply_for_reviewer(
    application_data: ReviewerApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Apply to become a reviewer"""

    # Check if user is already a reviewer
    if current_user.is_reviewer:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You are already a reviewer"
        )

    # Check if user already has a pending application
    existing_application = db.query(ReviewerApplication).filter(
        ReviewerApplication.user_id == current_user.id,
        ReviewerApplication.status == "pending"
    ).first()

    if existing_application:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You already have a pending application"
        )

    # Create new application
    new_application = ReviewerApplication(
        user_id=current_user.id,
        motivation=application_data.motivation,
        experience=application_data.experience if application_data.experience else None
    )

    db.add(new_application)
    db.commit()
    db.refresh(new_application)

    return ReviewerApplicationResponse(
        id=new_application.id,
        userId=current_user.id,
        userName=current_user.name,
        userEmail=current_user.email,
        motivation=new_application.motivation,
        experience=new_application.experience,
        status=new_application.status,
        appliedAt=new_application.applied_at,
        reviewedById=None,
        reviewedAt=None,
        adminNotes=None
    )


@router.get("/reviewer-applications", response_model=List[ReviewerApplicationResponse])
async def get_reviewer_applications(
    status_filter: str = "all",  # all, pending, approved, rejected
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all reviewer applications (admin only)"""

    if not is_admin(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can view all applications"
        )

    query = db.query(ReviewerApplication).join(User, ReviewerApplication.user_id == User.id)

    if status_filter != "all":
        query = query.filter(ReviewerApplication.status == status_filter)

    applications = query.order_by(ReviewerApplication.applied_at.desc()).all()

    result = []
    for app in applications:
        result.append(ReviewerApplicationResponse(
            id=app.id,
            userId=app.user_id,
            userName=app.user.name,
            userEmail=app.user.email,
            motivation=app.motivation,
            experience=app.experience,
            status=app.status,
            appliedAt=app.applied_at,
            reviewedById=app.reviewed_by_id,
            reviewedAt=app.reviewed_at,
            adminNotes=app.admin_notes
        ))

    return result


@router.get("/reviewer-applications/my", response_model=ReviewerApplicationResponse)
async def get_my_application(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get current user's reviewer application (if exists)"""

    application = db.query(ReviewerApplication).filter(
        ReviewerApplication.user_id == current_user.id
    ).order_by(ReviewerApplication.applied_at.desc()).first()

    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No application found"
        )

    return ReviewerApplicationResponse(
        id=application.id,
        userId=current_user.id,
        userName=current_user.name,
        userEmail=current_user.email,
        motivation=application.motivation,
        experience=application.experience,
        status=application.status,
        appliedAt=application.applied_at,
        reviewedById=application.reviewed_by_id,
        reviewedAt=application.reviewed_at,
        adminNotes=application.admin_notes
    )


@router.post("/reviewer-applications/{application_id}/review", response_model=ReviewerApplicationResponse)
async def review_application(
    application_id: int,
    review_data: ReviewerApplicationReview,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Review a reviewer application (admin only)"""

    if not is_admin(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can review applications"
        )

    application = db.query(ReviewerApplication).filter(
        ReviewerApplication.id == application_id
    ).first()

    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )

    if application.status != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Application has already been reviewed"
        )

    # Update application
    application.status = review_data.status
    application.admin_notes = review_data.adminNotes
    application.reviewed_by_id = current_user.id
    application.reviewed_at = datetime.utcnow()

    # If approved, make user a reviewer
    if review_data.status == "approved":
        user = db.query(User).filter(User.id == application.user_id).first()
        if user:
            user.is_reviewer = True

    db.commit()
    db.refresh(application)

    return ReviewerApplicationResponse(
        id=application.id,
        userId=application.user_id,
        userName=application.user.name,
        userEmail=application.user.email,
        motivation=application.motivation,
        experience=application.experience,
        status=application.status,
        appliedAt=application.applied_at,
        reviewedById=application.reviewed_by_id,
        reviewedAt=application.reviewed_at,
        adminNotes=application.admin_notes
    )


@router.get("/reviewer-applications/stats")
async def get_application_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get reviewer application statistics (admin only)"""

    if not is_admin(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can view statistics"
        )

    total = db.query(func.count(ReviewerApplication.id)).scalar()
    pending = db.query(func.count(ReviewerApplication.id)).filter(
        ReviewerApplication.status == "pending"
    ).scalar()
    approved = db.query(func.count(ReviewerApplication.id)).filter(
        ReviewerApplication.status == "approved"
    ).scalar()
    rejected = db.query(func.count(ReviewerApplication.id)).filter(
        ReviewerApplication.status == "rejected"
    ).scalar()

    return {
        "total": total,
        "pending": pending,
        "approved": approved,
        "rejected": rejected
    }
