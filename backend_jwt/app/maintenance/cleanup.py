"""
Database cleanup script for removing old rejected submissions.
Run this periodically to keep the database clean.
"""
import sys
from datetime import datetime, timedelta
from pathlib import Path

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent.parent))

from sqlalchemy.orm import Session
from app.database.database import SessionLocal, engine
from app.database.models import RestaurantSubmission, Base
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def cleanup_old_rejected_submissions(days: int = 30, dry_run: bool = True):
    """
    Delete rejected and needs_changes submissions older than specified days.

    Args:
        days: Number of days to keep rejected submissions (default: 30)
        dry_run: If True, only show what would be deleted without deleting
    """
    db: Session = SessionLocal()
    try:
        cutoff_date = datetime.utcnow() - timedelta(days=days)

        # Find old rejected and needs_changes submissions
        old_submissions = db.query(RestaurantSubmission).filter(
            RestaurantSubmission.status.in_(['rejected', 'needs_changes']),
            RestaurantSubmission.reviewed_at < cutoff_date
        ).all()

        if not old_submissions:
            logger.info(f"No submissions older than {days} days found for cleanup.")
            return 0

        logger.info(f"Found {len(old_submissions)} submissions to clean up:")
        for submission in old_submissions:
            logger.info(f"  - ID: {submission.id}, Name: {submission.restaurant_name}, "
                       f"Status: {submission.status}, Reviewed: {submission.reviewed_at}")

        if dry_run:
            logger.info(f"DRY RUN: Would delete {len(old_submissions)} submissions.")
            logger.info("Run with dry_run=False to actually delete.")
            return 0

        # Delete the submissions
        count = 0
        for submission in old_submissions:
            db.delete(submission)
            count += 1

        db.commit()
        logger.info(f"Successfully deleted {count} old submissions.")
        return count

    except Exception as e:
        logger.error(f"Error during cleanup: {e}")
        db.rollback()
        raise
    finally:
        db.close()


def cleanup_old_approved_submissions(days: int = 90):
    """
    Clean up approved submissions older than specified days (they're already in restaurants table).

    Args:
        days: Number of days to keep approved submissions (default: 90)
    """
    db: Session = SessionLocal()
    try:
        cutoff_date = datetime.utcnow() - timedelta(days=days)

        # Find old approved submissions
        old_approved = db.query(RestaurantSubmission).filter(
            RestaurantSubmission.status == 'approved',
            RestaurantSubmission.reviewed_at < cutoff_date
        ).all()

        if not old_approved:
            logger.info(f"No approved submissions older than {days} days found.")
            return 0

        logger.info(f"Found {len(old_approved)} old approved submissions to archive.")

        # Delete them (they're already in the restaurants table)
        count = 0
        for submission in old_approved:
            db.delete(submission)
            count += 1

        db.commit()
        logger.info(f"Successfully archived {count} old approved submissions.")
        return count

    except Exception as e:
        logger.error(f"Error during cleanup: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Clean up old database submissions")
    parser.add_argument("--days", type=int, default=30,
                       help="Delete rejected submissions older than this many days (default: 30)")
    parser.add_argument("--execute", action="store_true",
                       help="Actually delete submissions (default is dry-run)")
    parser.add_argument("--cleanup-approved", action="store_true",
                       help="Also cleanup old approved submissions (90+ days)")

    args = parser.parse_args()

    logger.info("=" * 60)
    logger.info("Database Cleanup Script")
    logger.info("=" * 60)

    # Cleanup rejected/needs_changes submissions
    deleted_rejected = cleanup_old_rejected_submissions(
        days=args.days,
        dry_run=not args.execute
    )

    # Optionally cleanup old approved submissions
    if args.cleanup_approved and args.execute:
        deleted_approved = cleanup_old_approved_submissions(days=90)
        logger.info(f"Total deleted: {deleted_rejected + deleted_approved}")
    else:
        logger.info(f"Total deleted: {deleted_rejected}")

    logger.info("Cleanup complete!")
