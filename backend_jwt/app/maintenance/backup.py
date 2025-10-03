"""
Database backup script.
Creates timestamped backups of the SQLite database.
"""
import sys
import shutil
import os
from datetime import datetime
from pathlib import Path
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def backup_database(
    db_path: str = "./data/menudealmoco.db",
    backup_dir: str = "./backups",
    keep_backups: int = 30
):
    """
    Create a backup of the database and clean up old backups.

    Args:
        db_path: Path to the database file
        backup_dir: Directory to store backups
        keep_backups: Number of recent backups to keep (default: 30)
    """
    try:
        # Ensure backup directory exists
        backup_path = Path(backup_dir)
        backup_path.mkdir(parents=True, exist_ok=True)

        # Check if database exists
        db_file = Path(db_path)
        if not db_file.exists():
            logger.error(f"Database file not found: {db_path}")
            return False

        # Create timestamped backup filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_filename = f"menudealmoco_{timestamp}.db"
        backup_file_path = backup_path / backup_filename

        # Copy database file
        logger.info(f"Creating backup: {backup_file_path}")
        shutil.copy2(db_file, backup_file_path)

        # Get file size
        size_mb = backup_file_path.stat().st_size / (1024 * 1024)
        logger.info(f"Backup created successfully! Size: {size_mb:.2f} MB")

        # Clean up old backups
        cleanup_old_backups(backup_path, keep_backups)

        return True

    except Exception as e:
        logger.error(f"Backup failed: {e}")
        return False


def cleanup_old_backups(backup_dir: Path, keep_count: int):
    """
    Remove old backup files, keeping only the most recent ones.

    Args:
        backup_dir: Directory containing backups
        keep_count: Number of recent backups to keep
    """
    try:
        # Get all backup files sorted by modification time (newest first)
        backup_files = sorted(
            backup_dir.glob("menudealmoco_*.db"),
            key=lambda p: p.stat().st_mtime,
            reverse=True
        )

        if len(backup_files) <= keep_count:
            logger.info(f"Currently have {len(backup_files)} backups (keeping {keep_count})")
            return

        # Delete old backups
        files_to_delete = backup_files[keep_count:]
        logger.info(f"Removing {len(files_to_delete)} old backup(s)...")

        for old_backup in files_to_delete:
            logger.info(f"  Deleting: {old_backup.name}")
            old_backup.unlink()

        logger.info(f"Cleanup complete. Kept {keep_count} most recent backups.")

    except Exception as e:
        logger.error(f"Error cleaning up old backups: {e}")


def list_backups(backup_dir: str = "./backups"):
    """
    List all available backups with their sizes and dates.
    """
    backup_path = Path(backup_dir)

    if not backup_path.exists():
        logger.info("No backup directory found.")
        return

    backup_files = sorted(
        backup_path.glob("menudealmoco_*.db"),
        key=lambda p: p.stat().st_mtime,
        reverse=True
    )

    if not backup_files:
        logger.info("No backups found.")
        return

    logger.info("=" * 70)
    logger.info("Available Backups:")
    logger.info("=" * 70)

    total_size = 0
    for backup in backup_files:
        size_mb = backup.stat().st_size / (1024 * 1024)
        mod_time = datetime.fromtimestamp(backup.stat().st_mtime)
        total_size += size_mb
        logger.info(f"{backup.name:40} | {size_mb:8.2f} MB | {mod_time}")

    logger.info("=" * 70)
    logger.info(f"Total: {len(backup_files)} backups, {total_size:.2f} MB")


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Backup database")
    parser.add_argument("--db-path", type=str, default="./data/menudealmoco.db",
                       help="Path to database file (default: ./data/menudealmoco.db)")
    parser.add_argument("--backup-dir", type=str, default="./backups",
                       help="Backup directory (default: ./backups)")
    parser.add_argument("--keep", type=int, default=30,
                       help="Number of backups to keep (default: 30)")
    parser.add_argument("--list", action="store_true",
                       help="List existing backups")

    args = parser.parse_args()

    if args.list:
        list_backups(args.backup_dir)
    else:
        logger.info("=" * 60)
        logger.info("Database Backup Script")
        logger.info("=" * 60)
        success = backup_database(
            db_path=args.db_path,
            backup_dir=args.backup_dir,
            keep_backups=args.keep
        )
        if success:
            logger.info("Backup completed successfully!")
        else:
            logger.error("Backup failed!")
            sys.exit(1)
