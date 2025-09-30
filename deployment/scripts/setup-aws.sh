#!/bin/bash

# MenuDealMoco AWS Setup Script
# Automates AWS resource creation for MenuDealMoco deployment

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
AWS_REGION="${AWS_REGION:-eu-west-1}"
PROJECT_NAME="menudealmoco"
KEY_NAME="${KEY_NAME:-menudealmoco-key}"
INSTANCE_TYPE="${INSTANCE_TYPE:-t3.micro}"

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

check_aws_cli() {
    print_header "Checking Prerequisites"

    if ! command -v aws &> /dev/null; then
        print_error "AWS CLI not found. Please install it first."
        exit 1
    fi
    print_success "AWS CLI found"

    # Check AWS credentials
    if ! aws sts get-caller-identity &> /dev/null; then
        print_error "AWS credentials not configured. Run: aws configure"
        exit 1
    fi
    print_success "AWS credentials configured"

    ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    print_info "AWS Account ID: $ACCOUNT_ID"
}

create_ecr_repositories() {
    print_header "Creating ECR Repositories"

    # Create backend repository
    print_info "Creating backend ECR repository..."
    aws ecr create-repository \
        --repository-name "${PROJECT_NAME}-backend" \
        --region "$AWS_REGION" \
        --image-scanning-configuration scanOnPush=true \
        2>/dev/null || print_warning "Backend repository may already exist"

    # Create frontend repository
    print_info "Creating frontend ECR repository..."
    aws ecr create-repository \
        --repository-name "${PROJECT_NAME}-frontend" \
        --region "$AWS_REGION" \
        --image-scanning-configuration scanOnPush=true \
        2>/dev/null || print_warning "Frontend repository may already exist"

    print_success "ECR repositories ready"

    BACKEND_REPO_URI=$(aws ecr describe-repositories \
        --repository-names "${PROJECT_NAME}-backend" \
        --region "$AWS_REGION" \
        --query 'repositories[0].repositoryUri' \
        --output text)

    FRONTEND_REPO_URI=$(aws ecr describe-repositories \
        --repository-names "${PROJECT_NAME}-frontend" \
        --region "$AWS_REGION" \
        --query 'repositories[0].repositoryUri' \
        --output text)

    echo ""
    echo "Repository URIs:"
    echo "  Backend:  $BACKEND_REPO_URI"
    echo "  Frontend: $FRONTEND_REPO_URI"
}

create_jwt_secret() {
    print_header "Creating JWT Secret in Secrets Manager"

    # Generate secure secret
    print_info "Generating secure JWT secret..."
    SECRET_KEY=$(openssl rand -hex 32)

    # Create secret in Secrets Manager
    print_info "Storing secret in AWS Secrets Manager..."
    aws secretsmanager create-secret \
        --name "${PROJECT_NAME}/jwt-secret" \
        --secret-string "$SECRET_KEY" \
        --region "$AWS_REGION" \
        2>/dev/null || {
            print_warning "Secret may already exist. Updating..."
            aws secretsmanager update-secret \
                --secret-id "${PROJECT_NAME}/jwt-secret" \
                --secret-string "$SECRET_KEY" \
                --region "$AWS_REGION"
        }

    print_success "JWT secret stored in Secrets Manager"
    print_info "Secret ARN: arn:aws:secretsmanager:${AWS_REGION}:${ACCOUNT_ID}:secret:${PROJECT_NAME}/jwt-secret"
}

create_iam_role() {
    print_header "Creating IAM Role for EC2"

    # Create trust policy
    print_info "Creating trust policy..."
    cat > /tmp/trust-policy.json <<EOF
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
    print_info "Creating IAM role..."
    aws iam create-role \
        --role-name "EC2-${PROJECT_NAME}-Role" \
        --assume-role-policy-document file:///tmp/trust-policy.json \
        2>/dev/null || print_warning "Role may already exist"

    # Create policy
    print_info "Creating IAM policy..."
    cat > /tmp/ec2-policy.json <<EOF
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
      "Resource": "arn:aws:secretsmanager:${AWS_REGION}:${ACCOUNT_ID}:secret:${PROJECT_NAME}/*"
    }
  ]
}
EOF

    # Attach policy to role
    print_info "Attaching policy to role..."
    aws iam put-role-policy \
        --role-name "EC2-${PROJECT_NAME}-Role" \
        --policy-name "EC2-ECR-Secrets-Policy" \
        --policy-document file:///tmp/ec2-policy.json

    # Create instance profile
    print_info "Creating instance profile..."
    aws iam create-instance-profile \
        --instance-profile-name "EC2-ECR-Profile" \
        2>/dev/null || print_warning "Instance profile may already exist"

    # Add role to instance profile
    print_info "Adding role to instance profile..."
    aws iam add-role-to-instance-profile \
        --instance-profile-name "EC2-ECR-Profile" \
        --role-name "EC2-${PROJECT_NAME}-Role" \
        2>/dev/null || print_warning "Role may already be in profile"

    # Clean up temp files
    rm -f /tmp/trust-policy.json /tmp/ec2-policy.json

    print_success "IAM role and instance profile ready"
}

create_security_group() {
    print_header "Creating Security Group"

    # Get default VPC
    print_info "Finding default VPC..."
    VPC_ID=$(aws ec2 describe-vpcs \
        --filters "Name=isDefault,Values=true" \
        --query 'Vpcs[0].VpcId' \
        --output text \
        --region "$AWS_REGION")

    if [ -z "$VPC_ID" ] || [ "$VPC_ID" == "None" ]; then
        print_error "No default VPC found"
        exit 1
    fi
    print_info "Using VPC: $VPC_ID"

    # Create security group
    print_info "Creating security group..."
    SG_ID=$(aws ec2 create-security-group \
        --group-name "${PROJECT_NAME}-sg" \
        --description "Security group for MenuDealMoco" \
        --vpc-id "$VPC_ID" \
        --region "$AWS_REGION" \
        --query 'GroupId' \
        --output text 2>/dev/null || {
            print_warning "Security group may already exist. Finding it..."
            aws ec2 describe-security-groups \
                --filters "Name=group-name,Values=${PROJECT_NAME}-sg" \
                --query 'SecurityGroups[0].GroupId' \
                --output text \
                --region "$AWS_REGION"
        })

    print_info "Security Group ID: $SG_ID"

    # Add ingress rules
    print_info "Adding ingress rules..."

    # HTTP
    aws ec2 authorize-security-group-ingress \
        --group-id "$SG_ID" \
        --protocol tcp \
        --port 80 \
        --cidr 0.0.0.0/0 \
        --region "$AWS_REGION" \
        2>/dev/null || print_warning "HTTP rule may already exist"

    # HTTPS
    aws ec2 authorize-security-group-ingress \
        --group-id "$SG_ID" \
        --protocol tcp \
        --port 443 \
        --cidr 0.0.0.0/0 \
        --region "$AWS_REGION" \
        2>/dev/null || print_warning "HTTPS rule may already exist"

    # SSH (restrict to your IP)
    MY_IP=$(curl -s https://checkip.amazonaws.com)
    aws ec2 authorize-security-group-ingress \
        --group-id "$SG_ID" \
        --protocol tcp \
        --port 22 \
        --cidr "${MY_IP}/32" \
        --region "$AWS_REGION" \
        2>/dev/null || print_warning "SSH rule may already exist"

    print_success "Security group configured"
    echo ""
    echo "Security Group Details:"
    echo "  ID: $SG_ID"
    echo "  Ports: 22 (SSH from $MY_IP), 80 (HTTP), 443 (HTTPS)"
}

create_key_pair() {
    print_header "Creating SSH Key Pair"

    if [ -f "${KEY_NAME}.pem" ]; then
        print_warning "Key pair file already exists locally"
        print_info "Using existing key: ${KEY_NAME}.pem"
        return
    fi

    print_info "Creating key pair..."
    aws ec2 create-key-pair \
        --key-name "$KEY_NAME" \
        --query 'KeyMaterial' \
        --output text \
        --region "$AWS_REGION" > "${KEY_NAME}.pem" \
        2>/dev/null || {
            print_warning "Key pair may already exist in AWS"
            print_error "But local key file not found. Please download or delete AWS key and re-run."
            return 1
        }

    chmod 400 "${KEY_NAME}.pem"
    print_success "Key pair created: ${KEY_NAME}.pem"
    print_warning "IMPORTANT: Keep this file safe! You cannot download it again."
}

print_summary() {
    print_header "Setup Summary"

    echo ""
    echo -e "${GREEN}🎉 AWS Setup Completed Successfully! 🎉${NC}"
    echo ""
    echo "Created Resources:"
    echo -e "  ${BLUE}✓${NC} ECR Repositories (backend, frontend)"
    echo -e "  ${BLUE}✓${NC} JWT Secret in Secrets Manager"
    echo -e "  ${BLUE}✓${NC} IAM Role and Instance Profile"
    echo -e "  ${BLUE}✓${NC} Security Group"
    echo -e "  ${BLUE}✓${NC} SSH Key Pair"
    echo ""
    echo "Next Steps:"
    echo -e "  ${YELLOW}1.${NC} Launch EC2 instance manually or use:"
    echo "     aws ec2 run-instances \\"
    echo "       --image-id ami-0d71ea30463e0ff8d \\"
    echo "       --instance-type $INSTANCE_TYPE \\"
    echo "       --key-name $KEY_NAME \\"
    echo "       --security-group-ids $SG_ID \\"
    echo "       --iam-instance-profile Name=EC2-ECR-Profile \\"
    echo "       --region $AWS_REGION"
    echo ""
    echo -e "  ${YELLOW}2.${NC} Wait for instance to start and note its public IP"
    echo ""
    echo -e "  ${YELLOW}3.${NC} SSH to instance and run initial setup:"
    echo "     ssh -i ${KEY_NAME}.pem ubuntu@YOUR_INSTANCE_IP"
    echo ""
    echo -e "  ${YELLOW}4.${NC} Follow deployment guide: docs/DEPLOYMENT.md"
    echo ""
    echo -e "  ${YELLOW}5.${NC} Deploy application:"
    echo "     EC2_HOST=YOUR_INSTANCE_IP ./deployment/scripts/deploy.sh"
    echo ""
}

# Main execution
main() {
    print_header "MenuDealMoco AWS Setup"
    echo ""

    check_aws_cli
    create_ecr_repositories
    create_jwt_secret
    create_iam_role
    create_security_group
    create_key_pair
    print_summary
}

# Run main function
main

exit 0
