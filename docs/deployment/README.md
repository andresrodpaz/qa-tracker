# QTrack Deployment Guide

This guide covers various deployment options for QTrack, from development to production environments.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Configuration](#environment-configuration)
3. [Docker Deployment](#docker-deployment)
4. [Kubernetes Deployment](#kubernetes-deployment)
5. [Cloud Platform Deployment](#cloud-platform-deployment)
6. [Database Setup](#database-setup)
7. [SSL/TLS Configuration](#ssltls-configuration)
8. [Monitoring and Logging](#monitoring-and-logging)
9. [Backup and Recovery](#backup-and-recovery)
10. [Performance Optimization](#performance-optimization)

## Prerequisites

### System Requirements
- **CPU**: 2+ cores (4+ recommended for production)
- **RAM**: 4GB minimum (8GB+ recommended for production)
- **Storage**: 20GB minimum (SSD recommended)
- **Network**: Stable internet connection for AI features

### Software Requirements
- **Node.js**: 18.0 or higher
- **PostgreSQL**: 13.0 or higher
- **Redis**: 6.0 or higher
- **Docker**: 20.10+ (optional but recommended)

## Environment Configuration

### 1. Copy Environment Template
\`\`\`bash
cp .env.example .env
\`\`\`

### 2. Configure Required Variables
\`\`\`bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/qtrack"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT Configuration
JWT_SECRET="your-super-secure-jwt-secret-key-here"
JWT_EXPIRES_IN="7d"

# AI Integration (Optional)
OPENAI_API_KEY="your-openai-api-key"
AI_ENABLED="true"

# Email Configuration (Optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
\`\`\`

### 3. Security Configuration
\`\`\`bash
# Generate secure secrets
openssl rand -base64 32  # For JWT_SECRET
openssl rand -base64 32  # For SESSION_SECRET
openssl rand -base64 32  # For ENCRYPTION_KEY
\`\`\`

## Docker Deployment

### Quick Start with Docker Compose
\`\`\`bash
# Clone the repository
git clone https://github.com/your-org/qtrack.git
cd qtrack

# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
\`\`\`

### Production Docker Setup
\`\`\`bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy with production configuration
docker-compose -f docker-compose.prod.yml up -d

# Scale services
docker-compose -f docker-compose.prod.yml up -d --scale backend=3
\`\`\`

## Kubernetes Deployment

### 1. Create Namespace
\`\`\`bash
kubectl create namespace qtrack
\`\`\`

### 2. Configure Secrets
\`\`\`bash
# Create database secret
kubectl create secret generic qtrack-db-secret \
  --from-literal=username=qtrack \
  --from-literal=password=your-secure-password \
  -n qtrack

# Create app secrets
kubectl create secret generic qtrack-app-secret \
  --from-literal=jwt-secret=your-jwt-secret \
  --from-literal=openai-api-key=your-openai-key \
  -n qtrack
\`\`\`

### 3. Deploy Application
\`\`\`bash
# Apply all configurations
kubectl apply -f k8s/ -n qtrack

# Check deployment status
kubectl get pods -n qtrack
kubectl get services -n qtrack
\`\`\`

### 4. Configure Ingress
\`\`\`yaml
# k8s/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: qtrack-ingress
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  tls:
  - hosts:
    - qtrack.yourdomain.com
    secretName: qtrack-tls
  rules:
  - host: qtrack.yourdomain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: qtrack-frontend
            port:
              number: 80
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: qtrack-backend
            port:
              number: 3001
\`\`\`

## Cloud Platform Deployment

### Vercel Deployment (Frontend)
\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd frontend
vercel --prod

# Configure environment variables in Vercel dashboard
\`\`\`

### Railway Deployment (Full Stack)
\`\`\`bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
\`\`\`

### AWS ECS Deployment
\`\`\`bash
# Build and push images to ECR
aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.us-west-2.amazonaws.com

docker build -t qtrack-backend .
docker tag qtrack-backend:latest 123456789012.dkr.ecr.us-west-2.amazonaws.com/qtrack-backend:latest
docker push 123456789012.dkr.ecr.us-west-2.amazonaws.com/qtrack-backend:latest

# Deploy using ECS CLI or AWS Console
\`\`\`

## Database Setup

### PostgreSQL Setup
\`\`\`bash
# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Create database and user
sudo -u postgres psql
CREATE DATABASE qtrack;
CREATE USER qtrack_user WITH ENCRYPTED PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE qtrack TO qtrack_user;
\q

# Run migrations
npm run db:migrate
npm run db:seed
\`\`\`

### Redis Setup
\`\`\`bash
# Install Redis
sudo apt-get install redis-server

# Configure Redis
sudo nano /etc/redis/redis.conf
# Set: requirepass your_redis_password

# Restart Redis
sudo systemctl restart redis-server
\`\`\`

## SSL/TLS Configuration

### Let's Encrypt with Certbot
\`\`\`bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d qtrack.yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
\`\`\`

### Nginx Configuration
\`\`\`nginx
# /etc/nginx/sites-available/qtrack
server {
    listen 80;
    server_name qtrack.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name qtrack.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/qtrack.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/qtrack.yourdomain.com/privkey.pem;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket support
    location /socket.io/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
\`\`\`

## Monitoring and Logging

### Prometheus + Grafana Setup
\`\`\`yaml
# docker-compose.monitoring.yml
version: '3.8'
services:
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana-storage:/var/lib/grafana

volumes:
  grafana-storage:
\`\`\`

### Application Logging
\`\`\`javascript
// Configure Winston logger
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});
\`\`\`

## Backup and Recovery

### Database Backup
\`\`\`bash
#!/bin/bash
# backup-db.sh
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/qtrack"
DB_NAME="qtrack"

mkdir -p $BACKUP_DIR

# Create backup
pg_dump $DB_NAME > $BACKUP_DIR/qtrack_backup_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/qtrack_backup_$DATE.sql

# Remove backups older than 30 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

echo "Backup completed: qtrack_backup_$DATE.sql.gz"
\`\`\`

### Automated Backup with Cron
\`\`\`bash
# Add to crontab
0 2 * * * /path/to/backup-db.sh >> /var/log/qtrack-backup.log 2>&1
\`\`\`

### Recovery Process
\`\`\`bash
# Restore from backup
gunzip qtrack_backup_20231201_020000.sql.gz
psql qtrack < qtrack_backup_20231201_020000.sql
\`\`\`

## Performance Optimization

### Frontend Optimization
\`\`\`javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['example.com'],
    formats: ['image/webp', 'image/avif'],
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  httpAgentOptions: {
    keepAlive: true,
  },
}

module.exports = nextConfig
\`\`\`

### Backend Optimization
\`\`\`javascript
// Enable compression
app.use(compression());

// Connection pooling
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Redis caching
const redis = new Redis(process.env.REDIS_URL);
app.use(session({
  store: new RedisStore({ client: redis }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));
\`\`\`

### Database Optimization
\`\`\`sql
-- Create indexes for better performance
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_priority ON tickets(priority);
CREATE INDEX idx_tickets_assignee ON tickets(assignee_id);
CREATE INDEX idx_tickets_created_at ON tickets(created_at);
CREATE INDEX idx_comments_ticket_id ON comments(ticket_id);

-- Analyze tables
ANALYZE tickets;
ANALYZE comments;
ANALYZE users;
\`\`\`

## Troubleshooting

### Common Issues

#### 1. Database Connection Issues
\`\`\`bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check connection
psql -h localhost -U qtrack_user -d qtrack

# Check logs
sudo tail -f /var/log/postgresql/postgresql-13-main.log
\`\`\`

#### 2. Redis Connection Issues
\`\`\`bash
# Check Redis status
sudo systemctl status redis-server

# Test connection
redis-cli ping

# Check logs
sudo tail -f /var/log/redis/redis-server.log
\`\`\`

#### 3. Application Logs
\`\`\`bash
# Check application logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Check system logs
journalctl -u qtrack -f
\`\`\`

#### 4. Performance Issues
\`\`\`bash
# Monitor system resources
htop
iotop
nethogs

# Check database performance
SELECT * FROM pg_stat_activity;
SELECT * FROM pg_stat_user_tables;
\`\`\`

### Health Checks
\`\`\`bash
# Application health
curl http://localhost:3001/health

# Database health
curl http://localhost:3001/health/db

# Redis health
curl http://localhost:3001/health/redis
\`\`\`

## Security Checklist

- [ ] Environment variables properly configured
- [ ] Database credentials secured
- [ ] SSL/TLS certificates installed
- [ ] Firewall rules configured
- [ ] Regular security updates applied
- [ ] Backup strategy implemented
- [ ] Monitoring and alerting configured
- [ ] Rate limiting enabled
- [ ] Input validation implemented
- [ ] CORS properly configured

## Support

For deployment issues or questions:
- Check the [troubleshooting guide](../troubleshooting/README.md)
- Review application logs
- Contact the development team
- Create an issue on GitHub

---

**Next Steps**: After successful deployment, configure monitoring, set up automated backups, and review the [maintenance guide](../maintenance/README.md).
