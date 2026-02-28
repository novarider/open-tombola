#!/bin/bash
# SSL Certificate Setup Script for Tombola Application
# Sets up Let's Encrypt SSL certificates using Certbot

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
DOMAIN="${1:-your-domain.com}"
EMAIL="${2:-admin@your-domain.com}"
CERT_PATH="/etc/letsencrypt/live/${DOMAIN}"

echo -e "${YELLOW}=== SSL Certificate Setup ===${NC}"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}Error: This script must be run as root${NC}"
    exit 1
fi

# Install certbot if not already installed
echo -e "${YELLOW}Installing Certbot...${NC}"
apt-get update
apt-get install -y certbot python3-certbot-nginx python3-certbot-dns-ionos

echo -e "${GREEN}Certbot installed${NC}"

# Obtain certificate
echo -e "${YELLOW}Obtaining SSL certificate for ${DOMAIN}...${NC}"

if command -v nginx &> /dev/null; then
    echo "Using Nginx for verification..."
    certbot certonly --nginx \
        -d "${DOMAIN}" \
        -d "www.${DOMAIN}" \
        --non-interactive \
        --agree-tos \
        --email "${EMAIL}" \
        --redirect
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}SSL certificate obtained successfully${NC}"
    else
        echo -e "${RED}Failed to obtain certificate${NC}"
        exit 1
    fi
else
    echo "Using standalone mode for verification..."
    certbot certonly --standalone \
        -d "${DOMAIN}" \
        -d "www.${DOMAIN}" \
        --non-interactive \
        --agree-tos \
        --email "${EMAIL}"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}SSL certificate obtained successfully${NC}"
    else
        echo -e "${RED}Failed to obtain certificate${NC}"
        exit 1
    fi
fi

# Display certificate information
echo ""
echo -e "${GREEN}=== Certificate Information ===${NC}"
ls -la "${CERT_PATH}/"

# Test certificate validity
echo ""
echo -e "${YELLOW}Testing certificate...${NC}"
openssl x509 -in "${CERT_PATH}/fullchain.pem" -noout -text | head -20

# Set up auto-renewal
echo ""
echo -e "${YELLOW}Setting up auto-renewal...${NC}"
systemctl enable certbot.timer
systemctl start certbot.timer

# Test renewal in dry-run mode
echo -e "${YELLOW}Testing renewal (dry-run)...${NC}"
certbot renew --dry-run

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Auto-renewal test passed${NC}"
else
    echo -e "${YELLOW}Warning: Auto-renewal test failed, manual review may be needed${NC}"
fi

# Update Nginx configuration if using Nginx
if [ -f "/etc/nginx/conf.d/default.conf" ]; then
    echo ""
    echo -e "${YELLOW}Updating Nginx configuration...${NC}"
    
    # Backup original
    cp /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf.backup
    
    # Create updated config
    cat > /etc/nginx/conf.d/default.conf << 'NGINX'
# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name _;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name _;
    client_max_body_size 20M;

    # SSL Certificate
    ssl_certificate /etc/letsencrypt/live/${DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${DOMAIN}/privkey.pem;

    # SSL Configuration (A+ rating)
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # HSTS (HTTP Strict Transport Security)
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Enable gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API proxy
    location /api/ {
        proxy_pass http://api:3333/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Frontend (SPA routing)
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }

    # Health check
    location /health {
        access_log off;
        return 200 "ok\n";
    }
}
NGINX

    # Test Nginx configuration
    nginx -t
    
    if [ $? -eq 0 ]; then
        # Reload Nginx
        systemctl reload nginx
        echo -e "${GREEN}Nginx configuration updated and reloaded${NC}"
    else
        # Restore backup
        cp /etc/nginx/conf.d/default.conf.backup /etc/nginx/conf.d/default.conf
        echo -e "${RED}Nginx configuration test failed, original restored${NC}"
        exit 1
    fi
fi

echo ""
echo -e "${GREEN}=== SSL Setup Complete ===${NC}"
echo ""
echo "Certificate locations:"
echo "  Full chain: ${CERT_PATH}/fullchain.pem"
echo "  Private key: ${CERT_PATH}/privkey.pem"
echo ""
echo "Next steps:"
echo "1. Update your application configuration to use HTTPS"
echo "2. Update DNS records if needed"
echo "3. Test certificate validity: curl https://${DOMAIN}"
echo "4. Monitor certificate renewal: certbot renew --dry-run"
echo ""
echo "Certificate renewal will occur automatically 30 days before expiration."
