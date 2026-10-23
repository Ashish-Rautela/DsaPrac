#!/usr/bin/env bash
# ==============================================================================
# AWS EC2 Initial Setup Script for Visa OA Backend
# Supports Ubuntu 22.04 / 24.04 LTS and Amazon Linux 2023
# ==============================================================================

set -euo pipefail

echo "=========================================="
echo " Starting EC2 Instance Initialization"
echo "=========================================="

# 1. Update OS packages
echo "==> Updating package repository..."
if command -v apt-get &> /dev/null; then
    sudo apt-get update -y
    sudo apt-get upgrade -y
    sudo apt-get install -y curl git nginx ufw certbot python3-certbot-nginx
elif command -v dnf &> /dev/null; then
    sudo dnf update -y
    sudo dnf install -y curl git nginx
fi

# 2. Install Node.js 20 LTS
echo "==> Installing Node.js 20 LTS..."
if ! command -v node &> /dev/null || [[ $(node -v) != v20* ]]; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs || sudo dnf install -y nodejs
fi

echo "Node.js version: $(node -v)"
echo "NPM version: $(npm -v)"

# 3. Install PM2 Process Manager globally
echo "==> Installing PM2 process manager..."
sudo npm install -g pm2

# Configure PM2 to restart on server reboot
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp $HOME || true

# 4. Prepare Application Directory
APP_DIR="/var/www/visa-server"
echo "==> Creating application directory at $APP_DIR..."
sudo mkdir -p "$APP_DIR"
sudo chown -R $USER:$USER "$APP_DIR"

# 5. Configure Nginx Reverse Proxy
echo "==> Setting up Nginx reverse proxy configuration..."
NGINX_CONF="/etc/nginx/sites-available/visa-api"

sudo tee "$NGINX_CONF" > /dev/null << 'EOF'
server {
    listen 80;
    server_name _;

    client_max_body_size 15M;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Enable site in Nginx if on Debian/Ubuntu
if [ -d "/etc/nginx/sites-enabled" ]; then
    sudo rm -f /etc/nginx/sites-enabled/default || true
    sudo ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/visa-api
fi

# Test and start Nginx
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx

echo "=========================================="
echo " EC2 Instance Setup Completed Successfully!"
echo " Next Steps:"
echo " 1. Configure GitHub Secrets: EC2_HOST, EC2_USER, EC2_SSH_KEY"
echo " 2. Assign IAM role to EC2 for DynamoDB and S3 access"
echo " 3. Point your domain DNS to this EC2 public IP"
echo " 4. (Optional) Run: sudo certbot --nginx -d api.yourdomain.com"
echo "=========================================="
