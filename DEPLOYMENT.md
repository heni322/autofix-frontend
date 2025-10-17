# AutoFix Frontend - Deployment Guide

## 🚀 Quick Start

This repository contains a complete CI/CD pipeline for deploying the AutoFix frontend to your VPS.

### Prerequisites
- VPS with Ubuntu (37.59.98.144)
- Docker and Docker Compose installed on VPS
- Nginx installed on VPS
- Domain: autofix.prochainconsulting.com pointing to VPS
- SSH access to VPS

## 📦 Project Structure

```
frontend/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions CI/CD pipeline
├── src/
│   └── app/
│       └── api/
│           └── health/
│               └── route.ts    # Health check endpoint
├── Dockerfile                   # Production Docker image
├── docker-compose.prod.yml      # Docker Compose production config
├── .env.production              # Production environment variables
├── next.config.js               # Next.js configuration
├── nginx.conf                   # Nginx configuration (copy to VPS)
├── deploy.sh                    # Manual deployment script
└── .dockerignore                # Docker ignore file
```

## 🔐 Step 1: Configure GitHub Secrets

Go to **Settings → Secrets and variables → Actions** and add:

| Secret Name | Value |
|-------------|-------|
| `VPS_HOST` | `37.59.98.144` |
| `VPS_USERNAME` | `ubuntu` |
| `VPS_SSH_KEY` | Your SSH private key |
| `VPS_PORT` | `22` |
| `NEXT_PUBLIC_API_URL` | `https://backend.prochainconsulting.com/api` |
| `NEXT_PUBLIC_APP_NAME` | `AutoFix - Garage Platform` |
| `NEXT_PUBLIC_APP_URL` | `https://autofix.prochainconsulting.com` |

### Generate SSH Key
```bash
ssh-keygen -t ed25519 -C "github-actions-autofix" -f ~/.ssh/github_actions_autofix
ssh-copy-id -i ~/.ssh/github_actions_autofix.pub ubuntu@37.59.98.144
cat ~/.ssh/github_actions_autofix  # Copy this to VPS_SSH_KEY secret
```

## 🖥️ Step 2: VPS Setup

Connect to your VPS:
```bash
ssh ubuntu@37.59.98.144
```

### Install Prerequisites
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker (if not already installed)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo apt install docker-compose -y

# Install Nginx
sudo apt install nginx -y

# Install Certbot for SSL
sudo apt install certbot python3-certbot-nginx -y
```

### Create Deployment Directory
```bash
sudo mkdir -p /var/www/autofix-frontend
sudo chown ubuntu:ubuntu /var/www/autofix-frontend
```

## 🌐 Step 3: Configure Nginx

### Copy Nginx Configuration
```bash
# On VPS
sudo nano /etc/nginx/sites-available/autofix.prochainconsulting.com
```

Paste the content from `nginx.conf` file in this repository.

### Enable the Site
```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/autofix.prochainconsulting.com /etc/nginx/sites-enabled/

# Remove default site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

## 🔒 Step 4: Setup SSL Certificate

```bash
# Obtain SSL certificate
sudo certbot --nginx -d autofix.prochainconsulting.com

# Test auto-renewal
sudo certbot renew --dry-run
```

## 🚀 Step 5: Deploy

### Method A: Automatic Deployment (Recommended)

1. Commit and push to the `production` branch:
```bash
git add .
git commit -m "Setup CI/CD pipeline"
git checkout -b production
git push origin production
```

2. GitHub Actions will automatically:
   - Run tests and linting
   - Build Docker image
   - Deploy to VPS
   - Run health checks

Monitor the deployment in the **Actions** tab on GitHub.

### Method B: Manual Deployment

```bash
# Make the script executable (first time only)
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

## 📊 Post-Deployment

### Check Application Status
```bash
# View running containers
ssh ubuntu@37.59.98.144 "docker ps | grep autofix"

# View logs
ssh ubuntu@37.59.98.144 "docker logs -f autofix_frontend_prod"

# Check health endpoint
curl https://autofix.prochainconsulting.com/api/health
```

### Application URLs
- **Frontend**: https://autofix.prochainconsulting.com
- **Health Check**: https://autofix.prochainconsulting.com/api/health
- **Backend API**: https://backend.prochainconsulting.com/api

## 🔧 Useful Commands

### Container Management
```bash
# Restart container
ssh ubuntu@37.59.98.144 "docker restart autofix_frontend_prod"

# Stop container
ssh ubuntu@37.59.98.144 "docker stop autofix_frontend_prod"

# Remove container
ssh ubuntu@37.59.98.144 "docker rm autofix_frontend_prod"

# View container stats
ssh ubuntu@37.59.98.144 "docker stats autofix_frontend_prod"
```

### Nginx Management
```bash
# Check Nginx status
ssh ubuntu@37.59.98.144 "sudo systemctl status nginx"

# Reload Nginx
ssh ubuntu@37.59.98.144 "sudo systemctl reload nginx"

# View access logs
ssh ubuntu@37.59.98.144 "sudo tail -f /var/log/nginx/autofix_access.log"

# View error logs
ssh ubuntu@37.59.98.144 "sudo tail -f /var/log/nginx/autofix_error.log"
```

### Cleanup
```bash
# Remove unused Docker images
ssh ubuntu@37.59.98.144 "docker image prune -f"

# Remove all unused Docker resources
ssh ubuntu@37.59.98.144 "docker system prune -a -f"
```

## 🐛 Troubleshooting

### Issue: Port 3004 already in use
```bash
# Check what's using the port
ssh ubuntu@37.59.98.144 "sudo lsof -i :3004"

# Kill the process or change the port in docker-compose.prod.yml
```

### Issue: Container not starting
```bash
# Check logs
ssh ubuntu@37.59.98.144 "docker logs autofix_frontend_prod"

# Check if Docker is running
ssh ubuntu@37.59.98.144 "sudo systemctl status docker"
```

### Issue: 502 Bad Gateway
```bash
# Check if container is running
ssh ubuntu@37.59.98.144 "docker ps | grep autofix"

# Test connection to container
ssh ubuntu@37.59.98.144 "curl http://localhost:3004"

# Check Nginx error logs
ssh ubuntu@37.59.98.144 "sudo tail -50 /var/log/nginx/autofix_error.log"
```

### Issue: SSL Certificate Issues
```bash
# Check certificate status
ssh ubuntu@37.59.98.144 "sudo certbot certificates"

# Renew certificate
ssh ubuntu@37.59.98.144 "sudo certbot renew"
```

## 🔄 Rollback

If deployment fails:
```bash
ssh ubuntu@37.59.98.144
cd /var/www/autofix-frontend

# Stop current container
docker-compose -f docker-compose.prod.yml down

# Load previous backup (if available)
docker load < autofix-frontend-backup.tar.gz

# Start previous version
docker-compose -f docker-compose.prod.yml up -d
```

## 📝 Environment Variables

The following environment variables are configured in `.env.production`:

- `NEXT_PUBLIC_API_URL`: Backend API URL
- `NEXT_PUBLIC_APP_NAME`: Application name
- `NEXT_PUBLIC_APP_URL`: Frontend URL
- `NODE_ENV`: Environment (production)

## 🔍 Monitoring

### Health Check
The application includes a health check endpoint at `/api/health` that returns:
```json
{
  "status": "ok",
  "timestamp": "2025-10-17T...",
  "uptime": 123.45,
  "environment": "production",
  "version": "1.0.0"
}
```

### Container Health
Docker automatically monitors container health using the `HEALTHCHECK` directive in the Dockerfile.

## 📞 Support

For issues or questions:
1. Check the logs first
2. Review this troubleshooting guide
3. Verify all GitHub secrets are configured correctly
4. Ensure DNS is pointing to the correct IP

## ✅ Deployment Checklist

- [ ] GitHub Secrets configured
- [ ] VPS SSH access working
- [ ] Docker and Docker Compose installed
- [ ] Nginx installed and configured
- [ ] SSL certificate obtained
- [ ] Deployment directory created
- [ ] DNS pointing to VPS
- [ ] Port 3004 available
- [ ] Firewall allowing ports 80, 443
- [ ] First deployment successful
- [ ] Application accessible via HTTPS

## 🎯 Production URL

**https://autofix.prochainconsulting.com**
