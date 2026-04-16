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
    
    echo "7. Pinging search engines..."
    ping_search_engines
    
    echo -e "${GREEN}✅ Full deployment complete!${NC}"
}

# Function: Ping Search Engines (IndexNow + Google/Bing Sitemap)
ping_search_engines() {
    echo -e "${YELLOW}🔍 Notifying search engines of updates...${NC}"
    
    # Ping IndexNow (Bing/Yandex instant indexing)
    echo "  → Submitting to IndexNow..."
    INDEXNOW_RESULT=$(curl -s -X POST https://zerobounceai.com/api/indexnow \
        -H "Content-Type: application/json" \
        -H "x-indexnow-secret: zbai-indexnow-2026" 2>&1)
    echo "  IndexNow: $INDEXNOW_RESULT" | head -c 200
    echo ""
    
    # Ping Google & Bing sitemaps
    echo "  → Pinging Google & Bing sitemaps..."
    PING_RESULT=$(curl -s -X POST https://zerobounceai.com/api/ping-google \
        -H "x-indexnow-secret: zbai-indexnow-2026" 2>&1)
    echo "  Sitemap ping: $PING_RESULT" | head -c 200
    echo ""
    
    echo -e "${GREEN}  ✅ Search engines notified!${NC}"
}

# Function: Quick Deployment
quick_deploy() {
    echo -e "${YELLOW}⚡ Starting quick deployment...${NC}"
    
    echo "1. Pulling latest code..."
    run_remote "cd $PROJECT_DIR && git pull origin main"
    
    echo "2. Rebuilding frontend and backend..."
    run_remote "cd $PROJECT_DIR && docker compose -f $COMPOSE_FILE build frontend backend celery_worker"
    
    echo "3. Restarting services..."
    run_remote "cd $PROJECT_DIR && docker compose -f $COMPOSE_FILE up -d frontend backend celery_worker"
    run_remote "cd $PROJECT_DIR && docker compose -f $COMPOSE_FILE restart nginx"
    
    echo "4. Waiting for services..."
    sleep 5
    
    echo "5. Pinging search engines..."
    ping_search_engines
    
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

# Function: Promote Admin
promote_admin() {
    echo -e "${YELLOW}🔑 Promoting user to admin...${NC}"
    run_remote "cd $PROJECT_DIR && docker exec zerobounce_backend python -c \"
from app.core.database import SessionLocal
from app.models.models import User
from sqlalchemy import text
db = SessionLocal()
try:
    # 1. Add column if it doesn't exist (Postgres)
    db.execute(text('ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE'))
    db.commit()
    
    # 2. Promote specific admin user
    email = 'workwithtems@gmail.com'
    user = db.query(User).filter(User.email == email).first()
    if user:
        user.is_admin = True
        # Revoke test user if exists
        db.query(User).filter(User.email == 'test789@example.com').update({'is_admin': False})
        db.commit()
        print(f'Promoted {email} to Admin.')
    else:
        # Fallback to first user if primary doesn't exist yet
        user = db.query(User).order_by(User.id).first()
        if user:
            user.is_admin = True
            db.commit()
            print(f'Primary admin not found. Fallback promoted {user.email}.')
except Exception as e:
    print(f'Error: {e}')
finally:
    db.close()
\""
}

# Function: Send Onboarding Drip (Auto)
drip_auto() {
    echo -e "${YELLOW}📧 Sending onboarding drip emails (auto-detect)...${NC}"
    run_remote "cd $PROJECT_DIR && docker exec zerobounce_backend python send_onboarding_drip.py --auto"
    echo -e "${GREEN}✅ Drip emails sent!${NC}"
}

# Function: Drip Preview (Dry Run)
drip_preview() {
    echo -e "${YELLOW}📋 Previewing onboarding drip (dry run)...${NC}"
    run_remote "cd $PROJECT_DIR && docker exec zerobounce_backend python send_onboarding_drip.py --dry-run"
}

# Function: Drip Test (Send to admin)
drip_test() {
    echo -e "${YELLOW}📧 Sending all 5 test drip emails to admin...${NC}"
    run_remote "cd $PROJECT_DIR && docker exec zerobounce_backend python send_onboarding_drip.py --test-email workwithtems@gmail.com --all"
    echo -e "${GREEN}✅ Check your inbox at workwithtems@gmail.com${NC}"
}

# Function: Send specific drip number
drip_send() {
    if [ -z "$2" ]; then
        echo "Usage: $0 drip-send <1-5>"
        exit 1
    fi
    echo -e "${YELLOW}📧 Sending Drip #$2 to all free users...${NC}"
    run_remote "cd $PROJECT_DIR && docker exec zerobounce_backend python send_onboarding_drip.py --email-number $2"
    echo -e "${GREEN}✅ Drip #$2 sent!${NC}"
}

# Main menu
case "$1" in
    full)
        full_deploy
        promote_admin
        ;;
    quick)
        quick_deploy
        promote_admin
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
    drip)
        drip_auto
        ;;
    drip-preview)
        drip_preview
        ;;
    drip-test)
        drip_test
        ;;
    drip-send)
        drip_send "$@"
        ;;
    seo-ping)
        ping_search_engines
        ;;
    backup)
        backup_database
        ;;
    *)
        echo "Usage: $0 {full|quick|restart|logs|status|email|drip|drip-preview|drip-test|drip-send|seo-ping|backup}"
        echo ""
        echo "Options:"
        echo "  full          - Full deployment (rebuild all containers)"
        echo "  quick         - Quick deployment (code changes only)"
        echo "  restart       - Restart all services"
        echo "  logs          - View live logs"
        echo "  status        - Check service status"
        echo "  email         - Test email service"
        echo "  drip          - Send onboarding drip (auto-detect by signup date)"
        echo "  drip-preview  - Preview drip (dry run, no emails sent)"
        echo "  drip-test     - Send all 5 test emails to admin inbox"
        echo "  drip-send N   - Send specific drip #N (1-5) to all free users"
        echo "  seo-ping      - Ping Google, Bing & IndexNow with all URLs"
        echo "  backup        - Backup database"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}🎉 Done!${NC}"
