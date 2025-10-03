# S3 Backup Setup Guide

## Why S3 for Backups?

✅ **Off-site storage** - Backups stored separately from production
✅ **Cheaper** - S3 costs ~$0.023/GB vs EC2 storage ~$0.10/GB
✅ **Unlimited** - No disk space concerns
✅ **Durable** - 99.999999999% durability (11 nines)
✅ **Automatic retention** - Keep 30 backups, auto-delete old ones

## Cost Comparison

**Current approach (EC2 storage):**
- 8 MB backup × 30 = 240 MB
- Cost: ~$0.024/month (EC2 storage)
- Risk: Single point of failure ❌

**S3 approach (recommended):**
- 8 MB backup × 30 = 240 MB
- Cost: ~$0.005/month (S3 Standard-IA)
- Risk: Off-site, 11 nines durability ✅

## Setup Instructions

### Step 1: Create S3 Bucket

```bash
# Create bucket for backups
aws s3 mb s3://menudealmoco-backups --region eu-west-1

# Enable versioning (extra protection)
aws s3api put-bucket-versioning \
  --bucket menudealmoco-backups \
  --versioning-configuration Status=Enabled \
  --region eu-west-1

# Block public access (security)
aws s3api put-public-access-block \
  --bucket menudealmoco-backups \
  --public-access-block-configuration \
    "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true" \
  --region eu-west-1

# Enable encryption
aws s3api put-bucket-encryption \
  --bucket menudealmoco-backups \
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "AES256"
      }
    }]
  }' \
  --region eu-west-1
```

### Step 2: Update IAM Role

Add S3 permissions to your EC2 instance role:

```bash
# Create policy document
cat > s3-backup-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::menudealmoco-backups",
        "arn:aws:s3:::menudealmoco-backups/*"
      ]
    }
  ]
}
EOF

# Attach to existing EC2 role
aws iam put-role-policy \
  --role-name EC2-MenuDealMoco-Role \
  --policy-name S3-Backup-Policy \
  --policy-document file://s3-backup-policy.json
```

### Step 3: Update Cron Job

SSH to EC2 and update the cron job:

```bash
# SSH to EC2
ssh -i menudealmoco-key.pem ubuntu@your-ec2-ip

# Update crontab
crontab -e

# Replace the backup line with:
0 2 * * * cd /home/ubuntu/menudealmoco && docker-compose exec -T backend uv run python app/maintenance/s3_backup.py --s3-bucket menudealmoco-backups >> /home/ubuntu/logs/s3_backup.log 2>&1
```

### Step 4: Test the Setup

```bash
# Test backup to S3
docker-compose exec backend uv run python app/maintenance/s3_backup.py \
  --s3-bucket menudealmoco-backups

# List S3 backups
docker-compose exec backend uv run python app/maintenance/s3_backup.py \
  --s3-bucket menudealmoco-backups \
  --list

# Or use AWS CLI directly
aws s3 ls s3://menudealmoco-backups/backups/ --human-readable
```

## Usage

### Create Backup

```bash
# Manual backup
docker-compose exec backend uv run python app/maintenance/s3_backup.py \
  --s3-bucket menudealmoco-backups

# Custom S3 prefix
docker-compose exec backend uv run python app/maintenance/s3_backup.py \
  --s3-bucket menudealmoco-backups \
  --s3-prefix "prod-backups/"
```

### List Backups

```bash
# List all S3 backups
docker-compose exec backend uv run python app/maintenance/s3_backup.py \
  --s3-bucket menudealmoco-backups \
  --list

# Or directly with AWS CLI
aws s3 ls s3://menudealmoco-backups/backups/ --human-readable --summarize
```

### Restore from S3 Backup

```bash
# 1. List backups to find the one you want
aws s3 ls s3://menudealmoco-backups/backups/

# 2. Download backup
aws s3 cp s3://menudealmoco-backups/backups/menudealmoco_YYYYMMDD_HHMMSS.db ./restore.db

# 3. Stop containers
docker-compose down

# 4. Replace database
docker run --rm -v menudealmoco_backend_data:/data -v $(pwd):/backup alpine \
  cp /backup/restore.db /data/menudealmoco.db

# 5. Restart
docker-compose up -d

# 6. Clean up
rm ./restore.db
```

## Lifecycle Policy (Optional - Auto-delete old backups)

Set up S3 lifecycle to automatically move old backups to cheaper storage:

```bash
cat > lifecycle-policy.json <<EOF
{
  "Rules": [
    {
      "Id": "Delete old backups after 90 days",
      "Status": "Enabled",
      "Filter": {
        "Prefix": "backups/"
      },
      "Expiration": {
        "Days": 90
      }
    }
  ]
}
EOF

aws s3api put-bucket-lifecycle-configuration \
  --bucket menudealmoco-backups \
  --lifecycle-configuration file://lifecycle-policy.json
```

This will:
- Keep backups for 90 days
- Automatically delete backups older than 90 days
- Save storage costs

## Migration from Local to S3

If you already have local backups and want to migrate:

```bash
# Upload existing local backups to S3
docker-compose exec backend bash -c '
  for backup in /app/backups/menudealmoco_*.db; do
    aws s3 cp "$backup" s3://menudealmoco-backups/backups/ --region eu-west-1
    echo "Uploaded: $backup"
  done
'

# Verify uploads
aws s3 ls s3://menudealmoco-backups/backups/ --human-readable

# Delete local backups (after verification)
docker-compose exec backend rm -f /app/backups/menudealmoco_*.db
```

## Monitoring

### Check Backup Logs

```bash
# View S3 backup logs
ssh -i menudealmoco-key.pem ubuntu@your-ec2-ip "tail -f /home/ubuntu/logs/s3_backup.log"
```

### S3 Storage Size

```bash
# Check total backup size in S3
aws s3 ls s3://menudealmoco-backups/backups/ --recursive --human-readable --summarize
```

## Cost Estimate

**Current DB size:** 8 MB
**Backups kept:** 30
**Total storage:** 240 MB

**Monthly cost:**
- S3 Standard-IA: $0.0125/GB × 0.24 GB = **$0.003/month**
- Requests: ~$0.001/month
- **Total: ~$0.004/month** (less than 1 cent!)

## Troubleshooting

### "Unable to locate credentials"

Your EC2 IAM role doesn't have S3 permissions. Check:
```bash
aws sts get-caller-identity
aws s3 ls s3://menudealmoco-backups/
```

### "Access Denied"

Update IAM role with S3 permissions (see Step 2 above).

### Backup takes too long

For larger databases, consider:
- Using `pigz` for parallel compression
- Uploading during off-peak hours
- Using multipart upload for files >100MB

## Best Practices

1. ✅ **Test restores regularly** - Backups are useless if you can't restore
2. ✅ **Monitor backup logs** - Check for failures
3. ✅ **Keep 30 days** - Good balance of safety vs cost
4. ✅ **Enable versioning** - Extra protection against accidental deletion
5. ✅ **Use encryption** - Protect sensitive data
6. ✅ **Off-site only** - Don't keep backups on same server as database
