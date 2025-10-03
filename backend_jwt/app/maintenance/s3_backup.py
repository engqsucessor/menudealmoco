"""
Database backup script with S3 upload.
Creates local backup, uploads to S3, then deletes local copy.
"""
import sys
import os
import shutil
import subprocess
from datetime import datetime
from pathlib import Path
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def backup_to_s3(
    db_path: str = "./data/menudealmoco.db",
    s3_bucket: str = None,
    s3_prefix: str = "backups/",
    keep_local: int = 3,  # Only keep last 3 backups locally
    aws_region: str = "eu-west-1"
):
    """
    Create database backup and upload to S3.

    Args:
        db_path: Path to the database file
        s3_bucket: S3 bucket name (required)
        s3_prefix: Prefix/folder in S3 bucket
        keep_local: Number of local backups to keep (default: 3)
        aws_region: AWS region
    """
    if not s3_bucket:
        logger.error("S3 bucket name is required!")
        return False

    try:
        # Check if database exists
        db_file = Path(db_path)
        if not db_file.exists():
            logger.error(f"Database file not found: {db_path}")
            return False

        # Create temp directory for backup
        temp_dir = Path("./temp_backup")
        temp_dir.mkdir(exist_ok=True)

        # Create timestamped backup filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_filename = f"menudealmoco_{timestamp}.db"
        temp_backup_path = temp_dir / backup_filename

        # Copy database file
        logger.info(f"Creating backup: {backup_filename}")
        shutil.copy2(db_file, temp_backup_path)

        size_mb = temp_backup_path.stat().st_size / (1024 * 1024)
        logger.info(f"Backup created: {size_mb:.2f} MB")

        # Upload to S3
        s3_key = f"{s3_prefix}{backup_filename}"
        logger.info(f"Uploading to S3: s3://{s3_bucket}/{s3_key}")

        # Use AWS CLI to upload
        upload_cmd = [
            "aws", "s3", "cp",
            str(temp_backup_path),
            f"s3://{s3_bucket}/{s3_key}",
            "--region", aws_region,
            "--storage-class", "STANDARD_IA"  # Infrequent Access - cheaper for backups
        ]

        result = subprocess.run(upload_cmd, capture_output=True, text=True)

        if result.returncode != 0:
            logger.error(f"S3 upload failed: {result.stderr}")
            return False

        logger.info("✓ Successfully uploaded to S3")

        # Delete temp backup
        temp_backup_path.unlink()
        logger.info("✓ Deleted local temp backup")

        # Clean up old S3 backups (keep last 30)
        cleanup_old_s3_backups(s3_bucket, s3_prefix, keep_count=30, aws_region=aws_region)

        return True

    except Exception as e:
        logger.error(f"Backup failed: {e}")
        return False
    finally:
        # Clean up temp directory
        if temp_dir.exists():
            shutil.rmtree(temp_dir, ignore_errors=True)


def cleanup_old_s3_backups(s3_bucket: str, s3_prefix: str, keep_count: int, aws_region: str):
    """
    Remove old backups from S3, keeping only the most recent ones.
    """
    try:
        logger.info(f"Checking for old S3 backups to clean up (keeping {keep_count})...")

        # List all backups in S3
        list_cmd = [
            "aws", "s3api", "list-objects-v2",
            "--bucket", s3_bucket,
            "--prefix", s3_prefix,
            "--query", "Contents[?contains(Key, 'menudealmoco_')].{Key:Key,LastModified:LastModified}",
            "--region", aws_region,
            "--output", "json"
        ]

        result = subprocess.run(list_cmd, capture_output=True, text=True)

        if result.returncode != 0:
            logger.warning(f"Could not list S3 objects: {result.stderr}")
            return

        import json
        backups = json.loads(result.stdout or "[]")

        if not backups or len(backups) <= keep_count:
            logger.info(f"Currently have {len(backups)} S3 backups (keeping {keep_count})")
            return

        # Sort by LastModified (oldest first)
        backups.sort(key=lambda x: x['LastModified'])

        # Delete oldest backups
        backups_to_delete = backups[:-keep_count]  # Keep last 'keep_count'
        logger.info(f"Deleting {len(backups_to_delete)} old S3 backup(s)...")

        for backup in backups_to_delete:
            delete_cmd = [
                "aws", "s3", "rm",
                f"s3://{s3_bucket}/{backup['Key']}",
                "--region", aws_region
            ]
            result = subprocess.run(delete_cmd, capture_output=True, text=True)
            if result.returncode == 0:
                logger.info(f"  ✓ Deleted: {backup['Key']}")
            else:
                logger.warning(f"  ✗ Failed to delete: {backup['Key']}")

        logger.info(f"Cleanup complete. Kept {keep_count} most recent S3 backups.")

    except Exception as e:
        logger.error(f"Error cleaning up old S3 backups: {e}")


def list_s3_backups(s3_bucket: str, s3_prefix: str = "backups/", aws_region: str = "eu-west-1"):
    """
    List all backups stored in S3.
    """
    try:
        logger.info("=" * 70)
        logger.info(f"S3 Backups in s3://{s3_bucket}/{s3_prefix}")
        logger.info("=" * 70)

        list_cmd = [
            "aws", "s3", "ls",
            f"s3://{s3_bucket}/{s3_prefix}",
            "--region", aws_region,
            "--human-readable",
            "--summarize"
        ]

        result = subprocess.run(list_cmd, capture_output=True, text=True)

        if result.returncode != 0:
            logger.error(f"Failed to list S3 backups: {result.stderr}")
            return

        print(result.stdout)

    except Exception as e:
        logger.error(f"Error listing S3 backups: {e}")


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Backup database to S3")
    parser.add_argument("--db-path", type=str, default="./data/menudealmoco.db",
                       help="Path to database file")
    parser.add_argument("--s3-bucket", type=str, required=True,
                       help="S3 bucket name (e.g., menudealmoco-backups)")
    parser.add_argument("--s3-prefix", type=str, default="backups/",
                       help="S3 prefix/folder (default: backups/)")
    parser.add_argument("--region", type=str, default="eu-west-1",
                       help="AWS region (default: eu-west-1)")
    parser.add_argument("--keep-local", type=int, default=3,
                       help="Number of local backups to keep (default: 3)")
    parser.add_argument("--list", action="store_true",
                       help="List existing S3 backups")

    args = parser.parse_args()

    if args.list:
        list_s3_backups(args.s3_bucket, args.s3_prefix, args.region)
    else:
        logger.info("=" * 60)
        logger.info("S3 Database Backup Script")
        logger.info("=" * 60)
        success = backup_to_s3(
            db_path=args.db_path,
            s3_bucket=args.s3_bucket,
            s3_prefix=args.s3_prefix,
            keep_local=args.keep_local,
            aws_region=args.region
        )
        if success:
            logger.info("=" * 60)
            logger.info("✓ Backup to S3 completed successfully!")
            logger.info("=" * 60)
        else:
            logger.error("✗ Backup to S3 failed!")
            sys.exit(1)
