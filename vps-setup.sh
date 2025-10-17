#!/bin/bash

# AutoFix Frontend - VPS Initial Setup Script
# Run this script on your VPS for first-time setup

set -e

echo "======================================"
echo "AutoFix Frontend - VPS Setup"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
    echo -e "${RED}Please do not run as root. Run as ubuntu user.${NC}"
    exit 1
fi

echo -e "${YELLOW}Step 1: Updating system...${NC}"
sudo apt update && sudo apt upgrade -y

echo -e "${YELLOW}Step 2: Installing Docker...${NC}"
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    echo -e "${GREEN}✓ Docker installed${NC}"
else
    echo -e "${GREEN}✓ Docker already installed${NC}"
fi

echo -e "${YELLOW}Step 3: Installing Docker Compose...${NC}"
if ! command -v docker-compose &> /dev/null; then
    sudo apt install docker-compose -y
    echo -e "${GREEN}✓ Docker Compose installed${NC}"
else
    echo -e "${GREEN}✓ Docker Compose already installed${NC}"
fi

echo -e "${YELLOW}Step 4: Installing Nginx...${NC}"
if ! command -v nginx &> /dev/null; then
    sudo apt install nginx -y
    sudo systemctl enable nginx
    sudo systemctl start nginx
    echo -e "${GREEN}✓ Nginx installed${NC}"
else
    echo -e "${GREEN}✓ Nginx already installed${NC}"
fi

echo -e "${YELLOW}Step 5: Installing Certbot...${NC}"
if ! command -v certbot &> /dev/null; then
    sudo apt install certbot python3-certbot-nginx -y
    echo -e "${GREEN}✓ Certbot installed${NC}"
else
    echo -e "${GREEN}✓ Certbot already installed${NC}"
fi

echo -e "${YELLOW}Step 6: Creating deployment directory...${NC}"
sudo mkdir -p /var/www/autofix-frontend
sudo chown $USER:$USER /var/www/autofix-frontend
echo -e "${GREEN}✓ Deployment directory created${NC}"

echo -e "${YELLOW}Step 7: Configuring firewall...${NC}"
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw --force enable
echo -e "${GREEN}✓ Firewall configured${NC}"

echo ""
echo -e "${GREEN}======================================"
echo -e "✅ VPS Setup Complete!"
echo -e "======================================${NC}"
echo ""
echo "Next steps:"
echo "1. Configure Nginx:"
echo "   sudo nano /etc/nginx/sites-available/autofix.prochainconsulting.com"
echo ""
echo "2. Create symbolic link:"
echo "   sudo ln -s /etc/nginx/sites-available/autofix.prochainconsulting.com /etc/nginx/sites-enabled/"
echo ""
echo "3. Test Nginx:"
echo "   sudo nginx -t"
echo ""
echo "4. Obtain SSL certificate:"
echo "   sudo certbot --nginx -d autofix.prochainconsulting.com"
echo ""
echo "5. Reload Nginx:"
echo "   sudo systemctl reload nginx"
echo ""
echo -e "${YELLOW}Note: You may need to log out and back in for Docker group changes to take effect.${NC}"
