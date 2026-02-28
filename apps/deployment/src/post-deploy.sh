#!/bin/bash
# Post-deployment configuration script for Tombola application
# This script configures the deployed VMs (run after Terraform apply)

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}=== Post-Deployment Configuration ===${NC}"

# Get the outputs from Terraform
echo -e "${YELLOW}Retrieving infrastructure details...${NC}"
API_IP=$(terraform output -raw api_access_url | cut -d'/' -f3 | cut -d':' -f1)
FRONTEND_IP=$(terraform output -raw frontend_access_url | cut -d'/' -f3)

echo -e "${GREEN}API Server IP: ${API_IP}${NC}"
echo -e "${GREEN}Frontend Server IP: ${FRONTEND_IP}${NC}"

# Configure API Server
echo -e "${YELLOW}Configuring API Server...${NC}"
ssh -o StrictHostKeyChecking=no root@${API_IP} << 'EOF'
    # Update system
    apt-get update && apt-get upgrade -y
    
    # Install Docker
    apt-get install -y docker.io curl
    
    # Enable Docker service
    systemctl enable docker
    systemctl start docker
    
    # Add docker group
    usermod -aG docker root
    
    # Install Docker Compose
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    
    # Create app directories
    mkdir -p /app/api
    mkdir -p /app/data
    
    # Set environment variables
    cat > /etc/environment-api << 'ENV'
    HOST=0.0.0.0
    PORT=3333
    NODE_ENV=production
    DATABASE_URL=postgresql://user:password@db:5432/tombola
    STRIPE_API_KEY=your-stripe-key
    ENV
    
    echo "API Server configured"
EOF

echo -e "${GREEN}API Server configured${NC}"

# Configure Frontend Server
echo -e "${YELLOW}Configuring Frontend Server...${NC}"
ssh -o StrictHostKeyChecking=no root@${FRONTEND_IP} << 'EOF'
    # Update system
    apt-get update && apt-get upgrade -y
    
    # Install Docker
    apt-get install -y docker.io curl
    
    # Enable Docker service
    systemctl enable docker
    systemctl start docker
    
    # Add docker group
    usermod -aG docker root
    
    # Install Docker Compose
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    
    # Create app directories
    mkdir -p /app/frontend
    mkdir -p /app/nginx
    
    # Create nginx configuration
    cat > /app/nginx/nginx.conf << 'NGINX'
    server {
        listen 80;
        server_name _;
        
        root /app/frontend/browser;
        index index.html;
        
        # Enable gzip compression
        gzip on;
        gzip_types text/plain text/css text/javascript application/json application/javascript application/xml+rss;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|woff|woff2)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
        
        # SPA routing - all routes go to index.html
        location / {
            try_files $uri $uri/ /index.html;
        }
        
        # Proxy API requests
        location /api/ {
            proxy_pass http://api:3333/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
    NGINX
    
    echo "Frontend Server configured"
EOF

echo -e "${GREEN}Frontend Server configured${NC}"

echo -e "${GREEN}=== Post-Deployment Configuration Complete ===${NC}"
echo -e "${YELLOW}Next steps:${NC}"
echo "  1. Upload Docker images to registries"
echo "  2. Configure SSL certificates (Let's Encrypt recommended)"
echo "  3. Set up monitoring and logging"
echo "  4. Configure backups to S3"
echo "  5. Update DNS records"
echo "  6. Run health checks"
