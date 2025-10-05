#!/bin/bash

# MenuDealMoco Deployment Script
# Builds and deploys the application to AWS EC2

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
AWS_REGION="${AWS_REGION:-eu-west-1}"
ECR_REGISTRY="${ECR_REGISTRY:-457393219772.dkr.ecr.eu-west-1.amazonaws.com}"
BACKEND_REPO="menudealmoco-backend"
FRONTEND_REPO="menudealmoco-frontend"
EC2_HOST="${EC2_HOST:-3.249.10.91}"
EC2_USER="${EC2_USER:-ubuntu}"
SSH_KEY="${SSH_KEY:-menudealmoco-key.pem}"

# Functions
print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

check_prerequisites() {
    print_header "Checking Prerequisites"

    # Check if AWS CLI is installed
    if ! command -v aws &> /dev/null; then
        print_error "AWS CLI not found. Please install it first."
        exit 1
    fi
    print_success "AWS CLI found"

    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        print_error "Docker not found. Please install it first."
        exit 1
    fi
    print_success "Docker found"

    # Check if SSH key exists
    if [ ! -f "$SSH_KEY" ]; then
        print_error "SSH key not found at $SSH_KEY"
        exit 1
    fi
    print_success "SSH key found"

    # Check if EC2_HOST is set
    if [ -z "$EC2_HOST" ]; then
        print_error "EC2_HOST environment variable not set"
        echo "Usage: EC2_HOST=your-ec2-ip ./deploy.sh"
        exit 1
    fi
    print_success "EC2 host configured: $EC2_HOST"
}

login_to_ecr() {
    print_header "Logging in to AWS ECR"

    aws ecr get-login-password --region "$AWS_REGION" | \
        docker login --username AWS --password-stdin "$ECR_REGISTRY"

    if [ $? -eq 0 ]; then
        print_success "Successfully logged in to ECR"
    else
        print_error "Failed to login to ECR"
        exit 1
    fi
}

build_and_push_backend() {
    print_header "Building Backend Image"

    # Navigate to project root first
    cd ../../
    cd backend_jwt

    print_info "Building Docker image..."
    docker build -t "$BACKEND_REPO:latest" .

    if [ $? -eq 0 ]; then
        print_success "Backend image built successfully"
    else
        print_error "Failed to build backend image"
        exit 1
    fi

    print_info "Tagging image..."
    docker tag "$BACKEND_REPO:latest" "$ECR_REGISTRY/$BACKEND_REPO:latest"

    print_info "Pushing to ECR..."
    docker push "$ECR_REGISTRY/$BACKEND_REPO:latest"

    if [ $? -eq 0 ]; then
        print_success "Backend image pushed to ECR"
    else
        print_error "Failed to push backend image"
        exit 1
    fi

    cd ..
}

build_and_push_frontend() {
    print_header "Building Frontend Image"

    # We should already be in project root after backend build
    cd frontend_1

    print_info "Building Docker image..."
    docker build --no-cache -f Dockerfile.prod -t "$FRONTEND_REPO:latest" .

    if [ $? -eq 0 ]; then
        print_success "Frontend image built successfully"
    else
        print_error "Failed to build frontend image"
        exit 1
    fi

    print_info "Tagging image..."
    docker tag "$FRONTEND_REPO:latest" "$ECR_REGISTRY/$FRONTEND_REPO:latest"

    print_info "Pushing to ECR..."
    docker push "$ECR_REGISTRY/$FRONTEND_REPO:latest"

    if [ $? -eq 0 ]; then
        print_success "Frontend image pushed to ECR"
    else
        print_error "Failed to push frontend image"
        exit 1
    fi

    cd ..
}

deploy_to_ec2() {
    print_header "Deploying to EC2"

    print_info "Copying docker-compose.prod.yml to EC2..."
    scp -i "deployment/scripts/$SSH_KEY" deployment/docker-compose.prod.yml "$EC2_USER@$EC2_HOST:~/menudealmoco/docker-compose.yml"

    if [ $? -eq 0 ]; then
        print_success "docker-compose.yml copied"
    else
        print_error "Failed to copy docker-compose.yml"
        exit 1
    fi

    print_info "Connecting to EC2 and deploying..."
    ssh -i "deployment/scripts/$SSH_KEY" "$EC2_USER@$EC2_HOST" << 'EOF'
        set -e
        cd ~/menudealmoco

        echo "Logging in to ECR..."
        aws ecr get-login-password --region eu-west-1 | \
            docker login --username AWS --password-stdin 457393219772.dkr.ecr.eu-west-1.amazonaws.com

        echo "Pulling latest images..."
        docker-compose pull

        echo "Stopping containers..."
        docker-compose down

        echo "Starting containers..."
        docker-compose up -d

        echo "Waiting for containers to start..."
        sleep 5

        echo "Checking container status..."
        docker-compose ps

        echo "Setting database permissions..."
        if [ -f data/menudealmoco.db ]; then
            chmod 600 data/menudealmoco.db
        fi

        echo "Deployment complete!"
EOF

    if [ $? -eq 0 ]; then
        print_success "Deployment successful!"
    else
        print_error "Deployment failed"
        exit 1
    fi
}

show_logs() {
    print_header "Fetching Application Logs"

    ssh -i "deployment/scripts/$SSH_KEY" "$EC2_USER@$EC2_HOST" << 'EOF'
        cd ~/menudealmoco
        docker-compose logs --tail=50
EOF
}

print_summary() {
    print_header "Deployment Summary"

    echo ""
    echo -e "${GREEN}🎉 Deployment Completed Successfully! 🎉${NC}"
    echo ""
    echo "Application URLs:"
    echo -e "  ${BLUE}Frontend:${NC} https://$EC2_HOST"
    echo -e "  ${BLUE}Backend API:${NC} https://$EC2_HOST/api"
    echo -e "  ${BLUE}API Docs:${NC} https://$EC2_HOST/api/docs"
    echo ""
    echo "Useful commands:"
    echo -e "  ${YELLOW}View logs:${NC} ssh -i $SSH_KEY $EC2_USER@$EC2_HOST 'cd ~/menudealmoco && docker-compose logs -f'"
    echo -e "  ${YELLOW}Check status:${NC} ssh -i $SSH_KEY $EC2_USER@$EC2_HOST 'cd ~/menudealmoco && docker-compose ps'"
    echo -e "  ${YELLOW}Restart:${NC} ssh -i $SSH_KEY $EC2_USER@$EC2_HOST 'cd ~/menudealmoco && docker-compose restart'"
    echo ""
}

# Main execution
main() {
    print_header "MenuDealMoco Deployment"
    echo ""

    check_prerequisites
    login_to_ecr
    build_and_push_backend
    build_and_push_frontend
    deploy_to_ec2
    show_logs
    print_summary
}

# Run main function
main

exit 0
