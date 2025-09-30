# MenuDealMoco - Deployment Guide

Complete guide for deploying the MenuDealMoco application to AWS EC2.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [AWS Setup](#aws-setup)
3. [Initial Server Setup](#initial-server-setup)
4. [SSL Certificate Setup](#ssl-certificate-setup)
5. [Application Deployment](#application-deployment)
6. [Monitoring and Maintenance](#monitoring-and-maintenance)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Local Machine Requirements

- **AWS CLI** installed and configured
- **Docker** installed locally for building images
- **Git** for version control
- **SSH client** for server access
- **AWS Account** with appropriate permissions

### AWS Resources Needed

- EC2 instance (t3.micro recommended for Free Tier)
- ECR repositories for Docker images
- Secrets Manager for JWT secret
- Security Group with ports 80, 443, 22 open
- Elastic IP (optional but recommended)

---

## AWS Setup

### 1. Create EC2 Instance

```bash
# Launch t3.micro instance (Free Tier eligible)
aws ec2 run-instances \
  --image-id ami-0d71ea30463e0ff8d \
  --instance-type t3.micro \
  --key-name menudealmoco-key \
  --security-group-ids sg-xxxxxxxx \
  --subnet-id subnet-xxxxxxxx \
  --region eu-west-1 \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=menudealmoco-production}]'
```

### 2. Configure Security Group

```bash
# Allow HTTP
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxxxxx \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0

# Allow HTTPS
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxxxxx \
  --protocol tcp \
  --port 443 \
  --cidr 0.0.0.0/0

# Allow SSH (restrict to your IP)
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxxxxx \
  --protocol tcp \
  --port 22 \
  --cidr YOUR_IP/32
```

### 3. Create ECR Repositories

```bash
# Create backend repository
aws ecr create-repository \
  --repository-name menudealmoco-backend \
  --region eu-west-1

# Create frontend repository
aws ecr create-repository \
  --repository-name menudealmoco-frontend \
  --region eu-west-1
```

### 4. Create JWT Secret in Secrets Manager

```bash
# Generate secure random secret
SECRET_KEY=$(openssl rand -hex 32)

# Store in AWS Secrets Manager
aws secretsmanager create-secret \
  --name menudealmoco/jwt-secret \
  --secret-string "$SECRET_KEY" \
  --region eu-west-1
```

### 5. Create IAM Role for EC2

```bash
# Create trust policy
cat > trust-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {"Service": "ec2.amazonaws.com"},
    "Action": "sts:AssumeRole"
  }]
}
EOF

# Create role
aws iam create-role \
  --role-name EC2-MenuDealMoco-Role \
  --assume-role-policy-document file://trust-policy.json

# Create policy for ECR and Secrets Manager
cat > ec2-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken",
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue"
      ],
      "Resource": "arn:aws:secretsmanager:eu-west-1:*:secret:menudealmoco/*"
    }
  ]
}
EOF

# Attach policy
aws iam put-role-policy \
  --role-name EC2-MenuDealMoco-Role \
  --policy-name EC2-ECR-Secrets-Policy \
  --policy-document file://ec2-policy.json

# Create instance profile
aws iam create-instance-profile \
  --instance-profile-name EC2-ECR-Profile

# Add role to instance profile
aws iam add-role-to-instance-profile \
  --instance-profile-name EC2-ECR-Profile \
  --role-name EC2-MenuDealMoco-Role

# Attach to EC2 instance
aws ec2 associate-iam-instance-profile \
  --instance-id i-xxxxxxxxx \
  --iam-instance-profile Name=EC2-ECR-Profile
```

---

## Initial Server Setup

### 1. Connect to EC2 Instance

```bash
ssh -i menudealmoco-key.pem ubuntu@YOUR_EC2_IP
```

### 2. Install Required Software

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
sudo apt install -y docker.io
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
sudo apt install -y unzip
unzip awscliv2.zip
sudo ./aws/install

# Install Nginx
sudo apt install -y nginx

# Install Certbot for SSL
sudo apt install -y certbot python3-certbot-nginx

# Install UFW firewall
sudo apt install -y ufw
```

### 3. Configure Firewall

```bash
# Allow OpenSSH
sudo ufw allow OpenSSH

# Allow Nginx
sudo ufw allow 'Nginx Full'

# Enable firewall
sudo ufw --force enable

# Check status
sudo ufw status
```

### 4. Configure AWS CLI

```bash
# AWS CLI is configured via IAM role (no credentials needed)
aws configure set region eu-west-1
```

---

## SSL Certificate Setup

### 1. Configure Domain

Update your domain's DNS to point to your EC2 instance IP:
- **A Record:** `menudealmoco.duckdns.org` → `YOUR_EC2_IP`

### 2. Generate SSL Certificate

```bash
# Stop nginx temporarily
sudo systemctl stop nginx

# Generate certificate
sudo certbot certonly --standalone -d menudealmoco.duckdns.org

# Certificate will be at:
# /etc/letsencrypt/live/menudealmoco.duckdns.org/fullchain.pem
# /etc/letsencrypt/live/menudealmoco.duckdns.org/privkey.pem
```

### 3. Configure Nginx as Reverse Proxy

```bash
# Create nginx configuration
sudo nano /etc/nginx/sites-available/menudealmoco
```

**Nginx Configuration:**

```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name menudealmoco.duckdns.org menudealmoco.pt www.menudealmoco.pt;
    return 301 https://$server_name$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    server_name menudealmoco.duckdns.org menudealmoco.pt www.menudealmoco.pt;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/menudealmoco.duckdns.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/menudealmoco.duckdns.org/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Backend API proxy
    location /api/ {
        proxy_pass http://127.0.0.1:8000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Frontend proxy
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Enable configuration:**

```bash
# Create symlink
sudo ln -s /etc/nginx/sites-available/menudealmoco /etc/nginx/sites-enabled/

# Remove default
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx

# Enable auto-start
sudo systemctl enable nginx
```

### 4. Setup Auto-Renewal

```bash
# Test renewal
sudo certbot renew --dry-run

# Auto-renewal is configured via systemd timer (automatically enabled)
sudo systemctl status certbot.timer
```

---

## Application Deployment

### 1. Build and Push Docker Images (Local Machine)

```bash
# Navigate to project directory
cd /path/to/menudealmoco

# Login to ECR
aws ecr get-login-password --region eu-west-1 | docker login --username AWS --password-stdin 457393219772.dkr.ecr.eu-west-1.amazonaws.com

# Build and push backend
cd backend_jwt
docker build -t menudealmoco-backend:latest .
docker tag menudealmoco-backend:latest 457393219772.dkr.ecr.eu-west-1.amazonaws.com/menudealmoco-backend:latest
docker push 457393219772.dkr.ecr.eu-west-1.amazonaws.com/menudealmoco-backend:latest

# Build and push frontend
cd ../frontend_1
docker build --no-cache -f Dockerfile.prod -t menudealmoco-frontend:latest .
docker tag menudealmoco-frontend:latest 457393219772.dkr.ecr.eu-west-1.amazonaws.com/menudealmoco-frontend:latest
docker push 457393219772.dkr.ecr.eu-west-1.amazonaws.com/menudealmoco-frontend:latest
```

### 2. Deploy on EC2

```bash
# SSH to EC2
ssh -i menudealmoco-key.pem ubuntu@YOUR_EC2_IP

# Create app directory
mkdir -p ~/menudealmoco
cd ~/menudealmoco

# Create docker-compose.yml
nano docker-compose.yml
```

**docker-compose.yml:**

```yaml
version: "3.8"

services:
  backend:
    image: 457393219772.dkr.ecr.eu-west-1.amazonaws.com/menudealmoco-backend:latest
    ports:
      - "127.0.0.1:8000:8088"
    environment:
      - DATABASE_URL=sqlite:///./menudealmoco.db
      - ALLOWED_ORIGINS=https://menudealmoco.duckdns.org,https://menudealmoco.pt,https://www.menudealmoco.pt
      - ALLOWED_HOSTS=menudealmoco.duckdns.org,menudealmoco.pt,www.menudealmoco.pt,localhost,127.0.0.1,frontend,backend
      - AWS_REGION=eu-west-1
    volumes:
      - backend_data:/app/data
    networks:
      - app-network
    restart: always

  frontend:
    image: 457393219772.dkr.ecr.eu-west-1.amazonaws.com/menudealmoco-frontend:latest
    ports:
      - "127.0.0.1:3000:80"
    depends_on:
      - backend
    networks:
      - app-network
    restart: always

volumes:
  backend_data:

networks:
  app-network:
    driver: bridge
```

**Deploy:**

```bash
# Login to ECR
aws ecr get-login-password --region eu-west-1 | docker login --username AWS --password-stdin 457393219772.dkr.ecr.eu-west-1.amazonaws.com

# Pull and start containers
docker-compose pull
docker-compose up -d

# Check status
docker-compose ps
docker-compose logs -f
```

### 3. Secure Database File

```bash
# Set proper permissions
chmod 600 ~/menudealmoco/backend_data/menudealmoco.db
```

---

## Monitoring and Maintenance

### Check Application Status

```bash
# View running containers
docker-compose ps

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Check resource usage
docker stats
```

### Update Application

```bash
# On local machine - build and push new images
# (same commands as deployment step 1)

# On EC2 - pull and restart
cd ~/menudealmoco
docker-compose pull
docker-compose down
docker-compose up -d
```

### Backup Database

```bash
# Create backup
cp ~/menudealmoco/backend_data/menudealmoco.db ~/backups/menudealmoco-$(date +%Y%m%d).db

# Automate with cron
crontab -e
# Add: 0 2 * * * cp ~/menudealmoco/backend_data/menudealmoco.db ~/backups/menudealmoco-$(date +\%Y\%m\%d).db
```

### Monitor Costs

```bash
# Check current month costs
aws ce get-cost-and-usage \
  --time-period Start=$(date -d "$(date +%Y-%m-01)" +%Y-%m-%d),End=$(date +%Y-%m-%d) \
  --granularity MONTHLY \
  --metrics BlendedCost

# Check Free Tier usage
# Visit: https://console.aws.amazon.com/billing/home#/freetier
```

---

## Troubleshooting

### Application Not Accessible

```bash
# Check nginx status
sudo systemctl status nginx

# Check nginx configuration
sudo nginx -t

# Check firewall
sudo ufw status

# Check containers
docker-compose ps
docker-compose logs
```

### SSL Certificate Issues

```bash
# Check certificate expiry
sudo certbot certificates

# Manually renew
sudo certbot renew

# Check nginx SSL configuration
sudo nginx -t
```

### Container Fails to Start

```bash
# Check logs
docker-compose logs backend
docker-compose logs frontend

# Check if ports are available
sudo netstat -tulpn | grep -E '3000|8000'

# Restart containers
docker-compose restart
```

### Database Issues

```bash
# Check database file exists
ls -la ~/menudealmoco/backend_data/

# Check permissions
stat ~/menudealmoco/backend_data/menudealmoco.db

# Access container to check database
docker-compose exec backend bash
ls -la /app/data/
```

### JWT Secret Not Loading

```bash
# Check IAM role is attached
aws sts get-caller-identity

# Check Secrets Manager access
aws secretsmanager get-secret-value \
  --secret-id menudealmoco/jwt-secret \
  --region eu-west-1

# Check backend logs
docker-compose logs backend | grep -i "jwt\|secret"
```

### Out of Disk Space

```bash
# Check disk usage
df -h

# Clean up Docker
docker system prune -a

# Remove old images
docker image prune -a
```

---

## Emergency Procedures

### Complete Restart

```bash
# Stop everything
cd ~/menudealmoco
docker-compose down

# Pull latest images
docker-compose pull

# Start fresh
docker-compose up -d

# Monitor startup
docker-compose logs -f
```

### Rollback to Previous Version

```bash
# Tag previous version when deploying
docker tag menudealmoco-backend:latest menudealmoco-backend:previous

# Rollback
docker-compose down
docker tag menudealmoco-backend:previous menudealmoco-backend:latest
docker-compose up -d
```

### Critical Security Issue

```bash
# Immediately stop application
docker-compose down

# Block all incoming traffic except SSH
sudo ufw default deny incoming
sudo ufw allow OpenSSH
sudo ufw enable

# Investigate and fix issue
# Then gradually restore access
```

---

## Additional Resources

- **AWS Documentation:** https://docs.aws.amazon.com/
- **Docker Documentation:** https://docs.docker.com/
- **Nginx Documentation:** https://nginx.org/en/docs/
- **Let's Encrypt:** https://letsencrypt.org/docs/

---

## Support

For issues and questions:
1. Check logs: `docker-compose logs -f`
2. Review this guide's troubleshooting section
3. Check security audit report: `docs/SECURITY_AUDIT_REPORT.md`
4. Review cost estimates: `docs/AWS_COST_ESTIMATE.md`
