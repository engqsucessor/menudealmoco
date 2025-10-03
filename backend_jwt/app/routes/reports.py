from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from typing import List
import json
from app.database.database import get_db
from app.database.models import ReviewReport, User, MenuReview
from app.auth.middleware import get_current_user, get_current_reviewer
from datetime import datetime

router = APIRouter()

class ReportReviewRequest(BaseModel):
    review_id: int = Field(..., description="ID of the review being reported")
    restaurant_id: int = Field(..., description="Restaurant ID for validation")
    reason: str = Field(..., min_length=3, max_length=500, description="Reason for reporting the review")

@router.post("/reports/reviews")
async def create_review_report(
    payload: ReportReviewRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Allow authenticated users to report a review for moderator follow-up."""
    review = db.query(MenuReview).filter(MenuReview.id == payload.review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    if review.restaurant_id != payload.restaurant_id:
        raise HTTPException(status_code=400, detail="Review does not belong to the specified restaurant")

    existing_report = db.query(ReviewReport).filter(
        ReviewReport.review_id == payload.review_id,
        ReviewReport.reporter_id == current_user.id,
        ReviewReport.status == "pending"
    ).first()
    if existing_report:
        raise HTTPException(status_code=400, detail="You have already reported this review")

    report = ReviewReport(
        review_id=payload.review_id,
        reporter_id=current_user.id,
        reason=payload.reason.strip(),
        status="pending"
    )

    db.add(report)
    try:
        db.commit()
        db.refresh(report)
    except Exception as exc:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to submit report") from exc

    return {"message": "Review reported successfully", "report_id": str(report.id)}

@router.get("/reports/reviews")
async def get_reported_reviews(db: Session = Depends(get_db)):
    """Get all reported reviews for review by admins"""

    # Get all pending reports with related review and user data
    reports = db.query(ReviewReport).filter(
        ReviewReport.status == "pending"
    ).all()

    result = []
    for report in reports:
        # Get the review being reported
        review = db.query(MenuReview).filter(MenuReview.id == report.review_id).first()
        if not review:
            continue

        # Get the user who made the review
        review_user = db.query(User).filter(User.id == review.user_id).first()

        # Get the user who made the report
        reporter = db.query(User).filter(User.id == report.reporter_id).first()

        result.append({
            "id": str(report.id),
            "reviewId": str(report.review_id),
            "reason": report.reason,
            "dateReported": report.date_reported.isoformat(),
            "status": report.status,
            "review": {
                "id": str(review.id),
                "comment": review.comment,
                "rating": review.rating,
                "createdAt": review.created_at.isoformat(),
                "upvotes": review.upvotes,
                "downvotes": review.downvotes,
                "isHidden": review.is_hidden,
                "user": {
                    "email": review_user.email if review_user else "unknown",
                    "displayName": review_user.display_name if review_user else f"User{review.user_id}"
                }
            },
            "reporter": {
                "email": reporter.email if reporter else "unknown",
                "displayName": reporter.display_name if reporter else f"User{report.reporter_id}"
            }
        })

    return result

@router.post("/reports/{report_id}/resolve")
async def resolve_report(
    report_id: str,
    request: Request,
    db: Session = Depends(get_db),
    current_reviewer: User = Depends(get_current_reviewer)
):
    """Resolve a reported review - only reviewers can do this"""
    try:
        report_id_int = int(report_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid report ID")

    # Get and parse the request body
    try:
        body = await request.body()
        body_str = body.decode('utf-8')
        data = json.loads(body_str)
        action = data.get('action')  # 'dismissed', 'review_hidden', etc.
    except:
        raise HTTPException(status_code=422, detail="Invalid request body")

    if not action:
        raise HTTPException(status_code=400, detail="Action is required")

    # Find reviewer and check permissions
    reviewer = db.query(User).filter(User.id == current_reviewer.id).first()
    if not reviewer:
        raise HTTPException(status_code=404, detail="Reviewer not found")

    if not reviewer.is_reviewer:
        raise HTTPException(status_code=403, detail="Only reviewers can resolve reports")

    # Find the report
    report = db.query(ReviewReport).filter(ReviewReport.id == report_id_int).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    # Update report status
    report.status = "resolved"
    report.resolved_by_id = reviewer.id
    report.resolved_at = datetime.now()
    report.action = action

    # If action is to hide the review, update the review
    if action == "review_hidden":
        review = db.query(MenuReview).filter(MenuReview.id == report.review_id).first()
        if review:
            review.is_hidden = True

    try:
        db.commit()
        return {"message": f"Report resolved with action: {action}"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error resolving report: {str(e)}")

