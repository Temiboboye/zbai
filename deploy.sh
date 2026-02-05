#!/bin/bash

# ZeroBounce AI - Quick Deployment Script
# Usage: ./deploy.sh [option]
# Options:
#   full     - Full deployment (rebuild all containers)
#   quick    - Quick deployment (code changes only)
#   restart  - Restart all services
#   logs     - View logs
#   status   - Check service status

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
SERVER="root@72.60.67.221"
PROJECT_DIR="/opt/zerobounce"
COMPOSE_FILE="docker-compose.prod.yml"

echo -e "${GREEN}🚀 ZeroBounce AI Deployment Script${NC}"
echo "=================================="

# Function to run command on server
run_remote() {
    ssh -i ~/.ssh/zerobounce_vps $SERVER "$1"
}

# Function: Full Deployment
full_deploy() {
    echo -e "${YELLOW}📦 Starting full deployment...${NC}"
    
    echo "1. Pulling latest code..."
    run_remote "cd $PROJECT_DIR && git pull origin main"
    
    echo "2. Building containers..."
    run_remote "cd $PROJECT_DIR && docker compose -f $COMPOSE_FILE build --no-cache"
    
    echo "3. Stopping old containers..."
    run_remote "cd $PROJECT_DIR && docker compose -f $COMPOSE_FILE down"
    
    echo "4. Starting new containers..."
    run_remote "cd $PROJECT_DIR && docker compose -f $COMPOSE_FILE up -d"
    
    echo "5. Waiting for services to start..."
    sleep 10
    
    echo "6. Checking service status..."
    run_remote "cd $PROJECT_DIR && docker compose -f $COMPOSE_FILE ps"
    
    echo -e "${GREEN}✅ Full deployment complete!${NC}"
}

# Function: Quick Deployment
quick_deploy() {
    echo -e "${YELLOW}⚡ Starting quick deployment...${NC}"
    
    echo "1. Pulling latest code..."
    run_remote "cd $PROJECT_DIR && git pull origin main"
    
    echo "2. Rebuilding frontend and backend..."
    run_remote "cd $PROJECT_DIR && docker compose -f $COMPOSE_FILE build frontend backend"
    
    echo "3. Restarting services..."
    run_remote "cd $PROJECT_DIR && docker compose -f $COMPOSE_FILE up -d frontend backend"
    run_remote "cd $PROJECT_DIR && docker compose -f $COMPOSE_FILE restart nginx"
    
    echo "4. Waiting for services..."
    sleep 5
    
    echo -e "${GREEN}✅ Quick deployment complete!${NC}"
}

# Function: Restart Services
restart_services() {
    echo -e "${YELLOW}🔄 Restarting all services...${NC}"
    run_remote "cd $PROJECT_DIR && docker compose -f $COMPOSE_FILE restart"
    echo -e "${GREEN}✅ Services restarted!${NC}"
}

# Function: View Logs
view_logs() {
    echo -e "${YELLOW}📋 Viewing logs (Ctrl+C to exit)...${NC}"
    ssh -i ~/.ssh/zerobounce_vps $SERVER "cd $PROJECT_DIR && docker compose -f $COMPOSE_FILE logs -f"
}

# Function: Check Status
check_status() {
    echo -e "${YELLOW}📊 Checking service status...${NC}"
    echo ""
    echo "Docker Containers:"
    run_remote "cd $PROJECT_DIR && docker compose -f $COMPOSE_FILE ps"
    echo ""
    echo "API Health Check:"
    curl -s https://zerobounceai.com/api/health | python3 -m json.tool || echo "API not responding"
    echo ""
    echo "Disk Usage:"
    run_remote "df -h | grep -E '(Filesystem|/dev/vda)'"
    echo ""
    echo "Memory Usage:"
    run_remote "free -h"
}

# Function: Test Email
test_email() {
    echo -e "${YELLOW}📧 Testing email service...${NC}"
    
    read -p "Enter test email address: " TEST_EMAIL
    
    run_remote "cd $PROJECT_DIR && docker exec zerobounce_backend python -c \"
from app.services.email_service import email_service
result = email_service.send_welcome_email(
    to='$TEST_EMAIL',
    name='Test User'
)
print('Success!' if result.get('success') else 'Failed: ' + str(result.get('error')))
\""
    
    echo -e "${GREEN}✅ Check your inbox at $TEST_EMAIL${NC}"
}

# Function: Database Backup
backup_database() {
    echo -e "${YELLOW}💾 Creating database backup...${NC}"
    
    BACKUP_FILE="zerobounce_backup_$(date +%Y%m%d_%H%M%S).sql"
    
    run_remote "cd $PROJECT_DIR && docker exec zerobounce_postgres pg_dump -U zerobounce zerobounce_db > /tmp/$BACKUP_FILE"
    
    echo "Downloading backup..."
    scp -i ~/.ssh/zerobounce_vps $SERVER:/tmp/$BACKUP_FILE ./backups/
    
    echo -e "${GREEN}✅ Backup saved to ./backups/$BACKUP_FILE${NC}"
}

# Main menu
case "$1" in
    full)
        full_deploy
        ;;
    quick)
        quick_deploy
        ;;
    restart)
        restart_services
        ;;
    logs)
        view_logs
        ;;
    status)
        check_status
        ;;
    email)
        test_email
        ;;
    backup)
        backup_database
        ;;
    *)
        echo "Usage: $0 {full|quick|restart|logs|status|email|backup}"
        echo ""
        echo "Options:"
        echo "  full     - Full deployment (rebuild all containers)"
        echo "  quick    - Quick deployment (code changes only)"
        echo "  restart  - Restart all services"
        echo "  logs     - View live logs"
        echo "  status   - Check service status"
        echo "  email    - Test email service"
        echo "  backup   - Backup database"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}🎉 Done!${NC}"
