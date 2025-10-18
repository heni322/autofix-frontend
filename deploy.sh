#!/bin/bash

# AutoFix Frontend Deployment Script
# This script handles manual deployment to VPS

set -e  # Exit on error

# Configuration
DEPLOY_PATH="/var/www/autofix-frontend"
CONTAINER_NAME="autofix_frontend_prod"
IMAGE_NAME="autofix-frontend:latest"
VPS_USER="ubuntu"
VPS_HOST="37.59.98.144"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting AutoFix Frontend Deployment${NC}"

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo -e "${RED}❌ Error: .env.production file not found${NC}"
    exit 1
fi

# Build Docker image
echo -e "${YELLOW}📦 Building Docker image...${NC}"
docker build \
    --build-arg NEXT_PUBLIC_API_URL="https://backend.prochainconsulting.com/api/v1" \
    --build-arg NEXT_PUBLIC_APP_NAME="AutoFix - Garage Platform" \
    --build-arg NEXT_PUBLIC_APP_URL="https://autofix.prochainconsulting.com" \
    --build-arg NODE_ENV="production" \
    -t ${IMAGE_NAME} \
    .

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Docker image built successfully${NC}"
else
    echo -e "${RED}❌ Docker build failed${NC}"
    exit 1
fi

# Save Docker image
echo -e "${YELLOW}💾 Saving Docker image...${NC}"
docker save ${IMAGE_NAME} | gzip > autofix-frontend.tar.gz

# Create deployment directory on VPS if it doesn't exist
echo -e "${YELLOW}📁 Creating deployment directory on VPS...${NC}"
ssh ${VPS_USER}@${VPS_HOST} "sudo mkdir -p ${DEPLOY_PATH} && sudo chown ${VPS_USER}:${VPS_USER} ${DEPLOY_PATH}"

# Copy files to VPS
echo -e "${YELLOW}📤 Copying files to VPS...${NC}"
scp autofix-frontend.tar.gz ${VPS_USER}@${VPS_HOST}:${DEPLOY_PATH}/
scp docker-compose.prod.yml ${VPS_USER}@${VPS_HOST}:${DEPLOY_PATH}/
scp .env.production ${VPS_USER}@${VPS_HOST}:${DEPLOY_PATH}/

# Deploy on VPS
echo -e "${YELLOW}🚢 Deploying on VPS...${NC}"
ssh ${VPS_USER}@${VPS_HOST} << 'ENDSSH'
    set -e
    cd /var/www/autofix-frontend
    
    # Load Docker image
    echo "Loading Docker image..."
    docker load < autofix-frontend.tar.gz
    
    # Stop and remove old container
    echo "Stopping old container..."
    docker stop autofix_frontend_prod 2>/dev/null || true
    docker rm autofix_frontend_prod 2>/dev/null || true
    
    # Start new container
    echo "Starting new container..."
    docker-compose -f docker-compose.prod.yml up -d
    
    # Clean up
    echo "Cleaning up..."
    rm autofix-frontend.tar.gz
    
    # Remove dangling images
    docker image prune -f
    
    # Check container status
    echo "Container status:"
    docker ps | grep autofix_frontend_prod
    
    echo "✅ Deployment completed on VPS!"
ENDSSH

# Clean up local files
echo -e "${YELLOW}🧹 Cleaning up local files...${NC}"
rm autofix-frontend.tar.gz

# Health check
echo -e "${YELLOW}🏥 Performing health check...${NC}"
sleep 10

for i in {1..5}; do
    if curl -f -s https://autofix.prochainconsulting.com > /dev/null; then
        echo -e "${GREEN}✅ Application is healthy!${NC}"
        echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
        echo -e "${GREEN}🌐 Application URL: https://autofix.prochainconsulting.com${NC}"
        exit 0
    fi
    echo -e "${YELLOW}⏳ Attempt $i failed, retrying...${NC}"
    sleep 10
done

echo -e "${RED}❌ Health check failed!${NC}"
echo -e "${YELLOW}ℹ️  Check logs with: ssh ${VPS_USER}@${VPS_HOST} 'docker logs ${CONTAINER_NAME}'${NC}"
exit 1
