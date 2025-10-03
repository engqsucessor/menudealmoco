#!/bin/bash
# Setup automated database maintenance tasks on EC2

echo "Setting up automated database maintenance..."

# Create cron jobs for:
# 1. Daily backup at 2 AM
# 2. Weekly cleanup at 3 AM on Sundays

CRON_BACKUP="0 2 * * * cd /home/ubuntu/menudealmoco && docker-compose exec -T backend uv run python app/maintenance/backup.py --keep 30 >> /home/ubuntu/logs/backup.log 2>&1"
CRON_CLEANUP="0 3 * * 0 cd /home/ubuntu/menudealmoco && docker-compose exec -T backend uv run python app/maintenance/cleanup.py --days 30 --execute >> /home/ubuntu/logs/cleanup.log 2>&1"

# Create logs directory
mkdir -p /home/ubuntu/logs

# Add to crontab (check if already exists first)
(crontab -l 2>/dev/null | grep -v "backup.py"; echo "$CRON_BACKUP") | crontab -
(crontab -l 2>/dev/null | grep -v "cleanup.py"; echo "$CRON_CLEANUP") | crontab -

echo "Cron jobs installed successfully!"
echo ""
echo "Scheduled tasks:"
echo "  - Daily backup at 2 AM (keeps 30 days)"
echo "  - Weekly cleanup at 3 AM on Sundays (removes submissions 30+ days old)"
echo ""
echo "View logs at:"
echo "  /home/ubuntu/logs/backup.log"
echo "  /home/ubuntu/logs/cleanup.log"
echo ""
echo "To view current cron jobs: crontab -l"
