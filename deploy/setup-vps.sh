#!/bin/bash
# ZeroBounce AI - VPS Setup Script
# Run this on a fresh Ubuntu 22.04 VPS

set -e

echo "=========================================="
echo "ZeroBounce AI - VPS Setup Script"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Please run as root (use sudo)${NC}"
    exit 1
fi

# Get domain name from user
read -p "Enter your domain name (e.g., zerobounce.example.com): " DOMAIN
read -p "Enter your email for SSL certificate: " EMAIL

echo -e "${GREEN}Setting up for domain: $DOMAIN${NC}"

# Update system
echo -e "${YELLOW}Updating system...${NC}"
apt update && apt upgrade -y

# Install Docker
echo -e "${YELLOW}Installing Docker...${NC}"
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    systemctl enable docker
    systemctl start docker
    echo -e "${GREEN}Docker installed successfully${NC}"
else
    echo -e "${GREEN}Docker already installed${NC}"
fi

# Install Docker Compose
echo -e "${YELLOW}Installing Docker Compose...${NC}"
if ! command -v docker-compose &> /dev/null; then
    apt install -y docker-compose-plugin
    echo -e "${GREEN}Docker Compose installed successfully${NC}"
else
    echo -e "${GREEN}Docker Compose already installed${NC}"
fi

# Install Certbot
echo -e "${YELLOW}Installing Certbot...${NC}"
apt install -y certbot

# Configure UFW Firewall
echo -e "${YELLOW}Configuring firewall...${NC}"
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
# Allow SMTP ports for email verification
ufw allow 25/tcp  # SMTP
ufw allow 587/tcp # SMTP Submission
ufw allow 465/tcp # SMTPS
echo "y" | ufw enable
echo -e "${GREEN}Firewall configured${NC}"

# Create application directory
APP_DIR="/opt/zerobounce"
echo -e "${YELLOW}Creating application directory: $APP_DIR${NC}"
mkdir -p $APP_DIR
mkdir -p $APP_DIR/certbot/www
mkdir -p $APP_DIR/certbot/conf
mkdir -p $APP_DIR/nginx/ssl

# Create initial Nginx config for SSL certificate generation
echo -e "${YELLOW}Creating initial Nginx config for SSL...${NC}"
cat > $APP_DIR/nginx/nginx-init.conf << 'NGINX_INIT'
events {
    worker_connections 1024;
}
http {
    server {
        listen 80;
        server_name DOMAIN_PLACEHOLDER;
        
        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }
        
        location / {
            return 200 'ZeroBounce AI - Setting up SSL...';
            add_header Content-Type text/plain;
        }
    }
}
NGINX_INIT
sed -i "s/DOMAIN_PLACEHOLDER/$DOMAIN/g" $APP_DIR/nginx/nginx-init.conf

# Start temporary Nginx for SSL certificate
echo -e "${YELLOW}Starting temporary Nginx for SSL certificate...${NC}"
docker run -d --name nginx-certbot \
    -p 80:80 \
    -v $APP_DIR/nginx/nginx-init.conf:/etc/nginx/nginx.conf:ro \
    -v $APP_DIR/certbot/www:/var/www/certbot \
    nginx:alpine

sleep 5

# Obtain SSL certificate
echo -e "${YELLOW}Obtaining SSL certificate...${NC}"
certbot certonly --webroot \
    -w $APP_DIR/certbot/www \
    -d $DOMAIN \
    -d www.$DOMAIN \
    --email $EMAIL \
    --agree-tos \
    --non-interactive

# Stop and remove temporary Nginx
docker stop nginx-certbot
docker rm nginx-certbot

# Copy certificates to app directory
echo -e "${YELLOW}Setting up SSL certificates...${NC}"
cp -L /etc/letsencrypt/live/$DOMAIN/fullchain.pem $APP_DIR/nginx/ssl/
cp -L /etc/letsencrypt/live/$DOMAIN/privkey.pem $APP_DIR/nginx/ssl/

# Create .env file
echo -e "${YELLOW}Creating environment file...${NC}"
DB_PASSWORD=$(openssl rand -base64 32 | tr -dc 'a-zA-Z0-9' | head -c 32)
SECRET_KEY=$(openssl rand -base64 48 | tr -dc 'a-zA-Z0-9' | head -c 48)

cat > $APP_DIR/.env << ENV_FILE
# ZeroBounce AI Environment Configuration
# Generated on $(date)

# Database
DB_PASSWORD=$DB_PASSWORD

# Application
SECRET_KEY=$SECRET_KEY
ALLOWED_ORIGINS=https://$DOMAIN,https://www.$DOMAIN
ENVIRONMENT=production

# Stripe (add your keys)
# STRIPE_SECRET_KEY=sk_live_...
# STRIPE_WEBHOOK_SECRET=whsec_...

# Sentry (optional)
# SENTRY_DSN=https://...@sentry.io/...
ENV_FILE

echo -e "${GREEN}Environment file created at $APP_DIR/.env${NC}"

# Set up auto-renewal cron job
echo -e "${YELLOW}Setting up SSL auto-renewal...${NC}"
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet && cp -L /etc/letsencrypt/live/$DOMAIN/*.pem $APP_DIR/nginx/ssl/ && docker exec zerobounce_nginx nginx -s reload") | crontab -

# Create deploy helper script
cat > $APP_DIR/deploy.sh << 'DEPLOY_SCRIPT'
#!/bin/bash
cd /opt/zerobounce
git pull origin main
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d
docker compose -f docker-compose.prod.yml exec backend alembic upgrade head
echo "Deployment complete!"
DEPLOY_SCRIPT
chmod +x $APP_DIR/deploy.sh

# Final instructions
echo ""
echo "=========================================="
echo -e "${GREEN}VPS Setup Complete!${NC}"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Clone your repository to $APP_DIR:"
echo "   cd $APP_DIR"
echo "   git clone https://github.com/yourusername/zerobounceai.git ."
echo ""
echo "2. Update Nginx config with your domain:"
echo "   sed -i 's/yourdomain.com/$DOMAIN/g' nginx/nginx.conf"
echo ""
echo "3. Edit .env file with your Stripe keys:"
echo "   nano $APP_DIR/.env"
echo ""
echo "4. Start the application:"
echo "   docker compose -f docker-compose.prod.yml up -d"
echo ""
echo "5. Run database migrations:"
echo "   docker compose -f docker-compose.prod.yml exec backend alembic upgrade head"
echo ""
echo -e "${GREEN}Your application will be available at: https://$DOMAIN${NC}"
echo ""
