# Deployment Guide for Tombola Application to Ionos Cloud

This guide provides step-by-step instructions for deploying the Tombola application to Ionos Cloud using Terraform and Docker.

## Prerequisites

1. **Ionos Cloud Account**: Create an account at https://www.ionos.com/hosting/cloud-hosting
2. **Ionos API Credentials**: Generate API credentials from your Ionos Cloud dashboard
3. **Terraform**: Version 1.0 or higher installed locally
4. **Docker**: For local testing and building images
5. **Git**: For version control
6. **SSH Keys**: For accessing deployed VMs

## Architecture Overview

The deployment creates the following infrastructure on Ionos Cloud:

```
┌─────────────────────────────────────────┐
│       Public Internet                   │
├─────────────────────────────────────────┤
│   Frontend Server (Ubuntu VM)           │
│   - Angular Frontend                    │
│   - Nginx Reverse Proxy                 │
│   - Static File Serving                 │
├─────────────────────────────────────────┤
│   Private LAN (tombola-lan)             │
├─────────────────────────────────────────┤
│   API Server (Ubuntu VM)                │
│   - Node.js/Express API                 │
│   - Docker Container                    │
│   - Database Client                     │
├─────────────────────────────────────────┤
│   S3 Object Storage                     │
│   - Backup Storage                      │
│   - Static Assets                       │
│   - File Storage                        │
└─────────────────────────────────────────┘
```

## Quick Start

### 1. Configure Terraform

```bash
cd apps/deployment/src
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your Ionos Cloud credentials
```

### 2. Initialize Infrastructure

```bash
nx initialize deployment
nx plan deployment
```

### 3. Deploy Infrastructure

```bash
nx apply deployment
```

### 4. Build Applications

```bash
nx build api --configuration=production
nx build frontend --configuration=production
```

### 5. Deploy to VMs

```bash
# Use the provided scripts
bash apps/deployment/src/post-deploy.sh
```

## Detailed Documentation

See the inline comments in:
- `main.tf` - Infrastructure definition
- `variables.tf` - Configuration variables
- `outputs.tf` - Output values
- `deploy.sh` - Deployment automation
- `post-deploy.sh` - Post-deployment configuration

## Terraform Targets

```bash
# Initialize Terraform
nx initialize deployment

# Check formatting
nx fmt deployment

# Plan changes
nx plan deployment

# Apply changes
nx apply deployment

# Destroy infrastructure (be careful!)
nx destroy deployment
```

## Common Tasks

```bash
# View deployment outputs
terraform output

# Refresh state from cloud
terraform refresh

# See full output details
terraform output -json | jq

# SSH into servers
ssh root@<api-ip>
ssh root@<frontend-ip>
```

## Environment Variables

Set these on your deployed servers:

**API Server** (`.env` or via systemd):
```
HOST=0.0.0.0
PORT=3333
NODE_ENV=production
DATABASE_URL=postgresql://user:password@localhost:5432/tombola
STRIPE_API_KEY=your-stripe-key
```

**Frontend Server**:
```
API_URL=http://api.your-domain.com:3333
```

## Security Notes

⚠️ **Important Security Considerations**:

1. **Never commit** `terraform.tfvars` - it contains credentials
2. **Rotate** Ionos Cloud credentials regularly
3. **Use** strong root passwords for VMs
4. **Enable** SSL/TLS with Let's Encrypt
5. **Configure** firewall rules appropriately
6. **Use** SSH keys instead of password authentication
7. **Monitor** all deployed resources
8. **Backup** database regularly to S3

## Versioning

- Terraform: >= 1.0
- Ionos Cloud Provider: ~> 7.0
- Ubuntu: 22.04 LTS

## Support

For issues:
1. Check Ionos Cloud Dashboard for resource status
2. Review Terraform state: `terraform state list`
3. Check VM logs via SSH
4. Review application logs in `/var/log/` or Docker logs

---

**Setup**: First-time deployment to Ionos Cloud via Terraform
**Last Updated**: 2026-02-28
