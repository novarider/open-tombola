# Tombola Deployment - Quick Start Guide

Get your Tombola application deployed to Ionos Cloud in 5 minutes!

## Prerequisites

Before starting, ensure you have:

- ✅ Ionos Cloud account (https://www.ionos.com/hosting/cloud-hosting)
- ✅ Ionos API credentials (generated from dashboard)
- ✅ Terraform installed (v1.0+)
- ✅ Docker installed (for building images)
- ✅ Git and SSH keys configured
- ✅ Terminal access to this workspace

## 5-Minute Quick Start

### Step 1: Configure Terraform (2 min)

```bash
# Copy and configure
cp apps/deployment/src/terraform.tfvars.example apps/deployment/src/terraform.tfvars

# Edit with your Ionos credentials
nano apps/deployment/src/terraform.tfvars
```

Fill in:
```hcl
ionos_username = "your-ionos-email@example.com"
ionos_password = "your-ionos-password"
api_image_password = "secure-root-password-1"
frontend_image_password = "secure-root-password-2"
```

### Step 2: Deploy Infrastructure (2 min)

```bash
# Initialize Terraform
nx initialize deployment

# Plan the infrastructure
nx plan deployment

# Apply the configuration
nx apply deployment
```

### Step 3: Get Your IP Addresses (1 min)

```bash
# View deployment outputs
terraform -chdir=apps/deployment/src output deployment_info

# Note these IPs for next steps:
# - API Server IP (from api_server.public_ip)
# - Frontend Server IP (from frontend_server.public_ip)
```

## What's Next?

After deployment completes, follow these steps:

### 1. Build Your Applications

```bash
# Build API
nx build api --configuration=production

# Build Frontend  
nx build frontend --configuration=production

# Build Docker images
./build-docker-images.sh
```

### 2. Deploy to VMs

```bash
# Get the IPs from the terraform output
API_IP="xxx.xxx.xxx.xxx"
FRONTEND_IP="xxx.xxx.xxx.xxx"

# Deploy API
ssh root@${API_IP} << 'EOF'
apt-get update && apt-get install -y docker.io curl
mkdir -p /app/api
EOF

scp -r apps/api/dist/* root@${API_IP}:/app/api/
ssh root@${API_IP} "cd /app/api && npm install --production"

# Deploy Frontend
ssh root@${FRONTEND_IP} << 'EOF'
apt-get update && apt-get install -y docker.io curl nginx
EOF
```

### 3. Set Up SSL

```bash
# On frontend server
ssh root@${FRONTEND_IP}
bash /root/setup-ssl.sh your-domain.com admin@your-domain.com
```

### 4. Update DNS

Point your domain to the frontend server IP in your DNS provider.

## Useful Commands

```bash
# View all resources deployed
terraform -chdir=apps/deployment/src output -json

# SSH into API server
ssh root@<api-ip>

# SSH into Frontend server
ssh root@<frontend-ip>

# Monitor infrastructure
terraform -chdir=apps/deployment/src refresh

# Stop all resources (saves money)
terraform -chdir=apps/deployment/src apply -var-file="apps/deployment/src/terraform.tfvars" -target=ionoscloud_server.api -target=ionoscloud_server.frontend

# Destroy everything (warning: deletes all data!)
terraform -chdir=apps/deployment/src destroy -auto-approve
```

## Complete Documentation

For detailed information, see:

- 📖 [Full Deployment Guide](README.md) - Complete step-by-step instructions
- ✅ [Deployment Checklist](DEPLOYMENT_CHECKLIST.md) - Ensure you don't miss anything
- 🔧 [Troubleshooting](TROUBLESHOOTING.md) - Solutions for common issues
- 📝 [Environment Variables](.env.example) - Configuration reference

## Architecture

```
┌─────────────────────────────────────────┐
│         Your Domain                     │
│   (Points to Frontend Server IP)        │
└─────────────────────────────────────────┘
              ↓
    ┌─────────────────────┐
    │  Frontend Server    │
    │  - Angular Frontend │
    │  - Nginx            │
    └─────────────────────┘
              ↓
    ┌─────────────────────┐
    │   API Server        │
    │  - Node.js/Express  │
    │  - PostgreSQL       │
    └─────────────────────┘
              ↓
    ┌─────────────────────┐
    │   S3 Storage        │
    │   - Backups         │
    │   - Files           │
    └─────────────────────┘
```

## Estimating Costs

Using the default configuration:

```
2 VMs (2 vCPU, 2GB RAM each): €20-30/month
100GB Storage: ~€5/month
Bandwidth: ~€0.01/GB (usually minimal)
───────────────────────────
Estimated Monthly: €25-50
```

## Next Steps

1. ✅ Complete the Quick Start (above)
2. 📖 Read the [Full Deployment Guide](README.md)
3. ✅ Follow the [Deployment Checklist](DEPLOYMENT_CHECKLIST.md)
4. 🔒 Set up SSL with [setup-ssl.sh](src/setup-ssl.sh)
5. 📊 Configure monitoring and backups
6. 🚀 Launch to production!

## Support

Having issues? Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for common solutions.

Need more help?
- Ionos Cloud Docs: https://docs.ionos.com
- Terraform Docs: https://www.terraform.io/docs
- Project Repository: Check GitHub issues

---

**Happy Deploying! 🚀**

*Last Updated: 2026-02-28*
