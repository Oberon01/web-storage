#!/bin/bash

# Web Storage - VPS Deployment Script
# This script helps you deploy the application on a VPS

set -e

echo "🚀 Web Storage - VPS Deployment Script"
echo "======================================="
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "⚠️  This script should be run as root (use sudo)"
    exit 1
fi

# Install Node.js if not present
if ! command -v node &> /dev/null; then
    echo "📦 Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
fi

# Install nginx if not present
if ! command -v nginx &> /dev/null; then
    echo "📦 Installing nginx..."
    apt-get update
    apt-get install -y nginx
fi

# Install PM2 if not present
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2..."
    npm install -g pm2
fi

# Create application directory
APP_DIR="/var/www/web-storage"
mkdir -p $APP_DIR

echo ""
echo "📁 Application will be installed in: $APP_DIR"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
fi

# Copy files (assuming running from app directory)
echo "📋 Copying application files..."
cp -r ./* $APP_DIR/
cd $APP_DIR

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production

# Build application
echo "🔨 Building application..."
npm run build

# Setup environment
if [ ! -f ".env.local" ]; then
    echo "🔐 Setting up environment variables..."
    cp .env.example .env.local
    
    echo ""
    echo "⚠️  Please edit .env.local with your credentials:"
    echo "   nano $APP_DIR/.env.local"
    echo ""
    read -p "Press enter to continue after editing .env.local..."
fi

# Setup PM2
echo "🚀 Starting application with PM2..."
pm2 delete web-storage 2>/dev/null || true
pm2 start npm --name "web-storage" -- start
pm2 save
pm2 startup systemd -u root --hp /root

# Setup nginx
echo "🌐 Configuring nginx..."
read -p "Enter your domain name (e.g., storage.example.com): " DOMAIN

cat > /etc/nginx/sites-available/web-storage << EOF
server {
    listen 80;
    server_name $DOMAIN;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    client_max_body_size 50M;
}
EOF

ln -sf /etc/nginx/sites-available/web-storage /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Point your domain ($DOMAIN) to this server's IP"
echo "   2. Install SSL certificate:"
echo "      apt-get install certbot python3-certbot-nginx"
echo "      certbot --nginx -d $DOMAIN"
echo ""
echo "🌐 Your application should be accessible at: http://$DOMAIN"
echo "🔐 Don't forget to change credentials in: $APP_DIR/.env.local"
echo ""
echo "📊 Useful commands:"
echo "   pm2 status          - Check app status"
echo "   pm2 logs web-storage - View logs"
echo "   pm2 restart web-storage - Restart app"
echo "   pm2 stop web-storage - Stop app"
echo ""
