#!/bin/bash
# Deploy script for Tombola application to Ionos Cloud
# This script builds the applications and deploys them to the infrastructure

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Tombola Deployment to Ionos Cloud ===${NC}"

# Check if terraform.tfvars exists
if [ ! -f "apps/deployment/src/terraform.tfvars" ]; then
    echo -e "${RED}Error: terraform.tfvars not found${NC}"
    echo "Please create terraform.tfvars from terraform.tfvars.example:"
    echo "  cp apps/deployment/src/terraform.tfvars.example apps/deployment/src/terraform.tfvars"
    exit 1
fi

# Step 1: Build API
echo -e "${YELLOW}Step 1: Building API...${NC}"
nx build api --configuration=production
echo -e "${GREEN}API built successfully${NC}"

# Step 2: Build Frontend
echo -e "${YELLOW}Step 2: Building Frontend...${NC}"
nx build frontend --configuration=production
echo -e "${GREEN}Frontend built successfully${NC}"

# Step 3: Initialize Terraform
echo -e "${YELLOW}Step 3: Initializing Terraform...${NC}"
nx initialize deployment
echo -e "${GREEN}Terraform initialized${NC}"

# Step 4: Plan infrastructure
echo -e "${YELLOW}Step 4: Planning infrastructure...${NC}"
nx plan deployment
echo -e "${GREEN}Terraform plan completed${NC}"

# Step 5: Apply infrastructure (requires manual approval)
echo -e "${YELLOW}Step 5: Applying infrastructure changes...${NC}"
echo -e "${RED}Please review the plan above and confirm to proceed${NC}"
read -p "Do you want to apply these changes? (yes/no): " -r
echo

if [[ $REPLY =~ ^yes$ ]]; then
    nx apply deployment
    echo -e "${GREEN}Infrastructure deployed successfully${NC}"
else
    echo -e "${YELLOW}Deployment canceled${NC}"
    exit 1
fi

echo -e "${GREEN}=== Deployment Complete ===${NC}"
echo -e "${YELLOW}Note: You'll need to configure the VMs with:${NC}"
echo "  1. Docker installation"
echo "  2. Database setup"
echo "  3. Application deployment scripts"
echo "  4. SSL certificates"
echo "  5. DNS configuration"
