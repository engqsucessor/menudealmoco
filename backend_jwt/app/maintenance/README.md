# Database Maintenance Scripts

Automated scripts for database backup and cleanup.

## ⚠️ Important: Use S3 for Production Backups

**For production, use `s3_backup.py` instead of `backup.py`**

- ✅ **Off-site storage** - Backups stored separately from production
- ✅ **Cheaper** - S3 costs ~$0.005/month vs EC2 storage
- ✅ **No disk space issues** - Unlimited storage
- ✅ **More durable** - 99.999999999% durability

See **[S3_SETUP.md](./S3_SETUP.md)** for setup instructions.

## Scripts

### 1. Backup Script (`backup.py`)

Creates timestamped backups of the SQLite database and manages old backups.

**Usage:**

```bash
# Create a backup (from backend_jwt directory)
uv run python app/maintenance/backup.py

# Specify custom paths
uv run python app/maintenance/backup.py --db-path ./data/menudealmoco.db --backup-dir ./backups

# Keep only 7 most recent backups
uv run python app/maintenance/backup.py --keep 7

# List existing backups
uv run python app/maintenance/backup.py --list
```

**In Docker:**

```bash
# From host machine
docker-compose exec backend uv run python app/maintenance/backup.py

# List backups
docker-compose exec backend uv run python app/maintenance/backup.py --list
```

**Features:**
- Creates timestamped backups (format: `menudealmoco_YYYYMMDD_HHMMSS.db`)
- Automatically cleans up old backups (keeps last 30 by default)
- Shows backup size and statistics

### 2. Cleanup Script (`cleanup.py`)

Removes old rejected submissions from the database to keep it lean.

**Usage:**

```bash
# Dry run (shows what would be deleted)
uv run python app/maintenance/cleanup.py --days 30

# Actually delete old submissions
uv run python app/maintenance/cleanup.py --days 30 --execute

# Also cleanup old approved submissions (90+ days)
uv run python app/maintenance/cleanup.py --cleanup-approved --execute
```

**In Docker:**

```bash
# Dry run
docker-compose exec backend uv run python app/maintenance/cleanup.py --days 30

# Execute cleanup
docker-compose exec backend uv run python app/maintenance/cleanup.py --days 30 --execute
```

**What it cleans:**
- Rejected submissions older than specified days (default: 30)
- Submissions marked as "needs_changes" older than specified days
- Optionally: Approved submissions older than 90 days (already in restaurants table)

**Safety:**
- Dry-run by default (use `--execute` to actually delete)
- Shows detailed list of what will be deleted
- Logs all operations

## Automated Scheduling (Production)

### Setup on EC2

Run the setup script to configure automated maintenance:

```bash
# SSH to EC2
ssh -i menudealmoco-key.pem ubuntu@your-ec2-ip

# Run setup script
cd ~/menudealmoco/backend_jwt
chmod +x scripts/setup_cron.sh
./scripts/setup_cron.sh
```

This configures:
- **Daily backup** at 2 AM (keeps 30 days)
- **Weekly cleanup** at 3 AM every Sunday (removes 30+ day old rejected submissions)

### Manual Cron Setup

If you prefer manual setup, add these to crontab (`crontab -e`):

```bash
# Daily backup at 2 AM
0 2 * * * cd /home/ubuntu/menudealmoco && docker-compose exec -T backend uv run python app/maintenance/backup.py --keep 30 >> /home/ubuntu/logs/backup.log 2>&1

# Weekly cleanup at 3 AM on Sundays
0 3 * * 0 cd /home/ubuntu/menudealmoco && docker-compose exec -T backend uv run python app/maintenance/cleanup.py --days 30 --execute >> /home/ubuntu/logs/cleanup.log 2>&1
```

### View Logs

```bash
# Backup logs
tail -f /home/ubuntu/logs/backup.log

# Cleanup logs
tail -f /home/ubuntu/logs/cleanup.log
```

## Manual Maintenance

### Create immediate backup

```bash
docker-compose exec backend uv run python app/maintenance/backup.py
```

### Check current backups

```bash
docker-compose exec backend uv run python app/maintenance/backup.py --list
```

### Run cleanup (dry-run first!)

```bash
# See what would be deleted
docker-compose exec backend uv run python app/maintenance/cleanup.py --days 30

# Actually delete
docker-compose exec backend uv run python app/maintenance/cleanup.py --days 30 --execute
```

## Backup Location

- **Development:** `backend_jwt/backups/`
- **Production (Docker):** Stored in Docker volume `backend_data`
- **EC2 Host Access:** `/var/lib/docker/volumes/menudealmoco_backend_data/_data/backups/`

## Restore from Backup

If you need to restore a backup:

```bash
# Stop containers
docker-compose down

# Copy backup over current database
docker run --rm -v menudealmoco_backend_data:/data alpine cp /data/backups/menudealmoco_YYYYMMDD_HHMMSS.db /data/menudealmoco.db

# Restart containers
docker-compose up -d
```

## Best Practices

1. **Test in development first** - Always test maintenance scripts locally before running in production
2. **Monitor logs** - Check logs regularly to ensure scripts run successfully
3. **Keep backups offsite** - Consider copying backups to S3 or another location
4. **Adjust retention** - Modify `--days` and `--keep` parameters based on your needs
5. **Run cleanup carefully** - Always do a dry-run first to verify what will be deleted

## Troubleshooting

### Backup fails with "Database file not found"

Check database path matches your setup:
```bash
docker-compose exec backend ls -la /app/data/
```

### Cleanup doesn't find any submissions

Check that reviewed_at timestamp is set when submissions are rejected:
```bash
docker-compose exec backend uv run python -c "from app.database.database import SessionLocal; from app.database.models import RestaurantSubmission; db = SessionLocal(); print([s.status for s in db.query(RestaurantSubmission).all()])"
```

### Cron jobs not running

1. Check crontab: `crontab -l`
2. Check logs: `tail -f /home/ubuntu/logs/*.log`
3. Check cron service: `sudo systemctl status cron`
4. Verify Docker is running: `docker ps`
