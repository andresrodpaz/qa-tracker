#!/bin/bash
# QTrack Production Backup Script

set -e

# Configuration
BACKUP_DIR="/backups/qtrack"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30
S3_BUCKET="qtrack-backups"

# Database backup
echo "Starting database backup..."
kubectl exec -n qtrack-production deployment/postgres -- pg_dump -U qtrack qtrack > "$BACKUP_DIR/db_backup_$DATE.sql"

# Compress backup
gzip "$BACKUP_DIR/db_backup_$DATE.sql"

# Upload to S3
aws s3 cp "$BACKUP_DIR/db_backup_$DATE.sql.gz" "s3://$S3_BUCKET/database/"

# Application data backup
echo "Backing up application data..."
kubectl exec -n qtrack-production deployment/qtrack-app -- tar -czf - /app/uploads | aws s3 cp - "s3://$S3_BUCKET/uploads/uploads_backup_$DATE.tar.gz"

# Cleanup old backups
find "$BACKUP_DIR" -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete

# Verify backup integrity
echo "Verifying backup integrity..."
gunzip -t "$BACKUP_DIR/db_backup_$DATE.sql.gz"

echo "Backup completed successfully: $DATE"

# Send notification
curl -X POST "$SLACK_WEBHOOK_URL" \
  -H 'Content-type: application/json' \
  --data "{\"text\":\"✅ QTrack backup completed successfully: $DATE\"}"
