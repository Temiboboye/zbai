#!/bin/bash
# ZeroBounce AI - Deployment Script
# Run this to deploy updates to your VPS

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

APP_DIR="/opt/zerobounce"

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}ZeroBounce AI - Deployment Script${NC}"
echo -e "${YELLOW}========================================${NC}"

cd $APP_DIR

# Pull latest code
echo -e "${YELLOW}Pulling latest code...${NC}"
git fetch origin
git reset --hard origin/main

# Build and restart containers
echo -e "${YELLOW}Building Docker images...${NC}"
docker compose -f docker-compose.prod.yml build --no-cache

echo -e "${YELLOW}Stopping old containers...${NC}"
docker compose -f docker-compose.prod.yml down

echo -e "${YELLOW}Starting new containers...${NC}"
docker compose -f docker-compose.prod.yml up -d

# Wait for backend to be healthy
echo -e "${YELLOW}Waiting for backend to be ready...${NC}"
sleep 10

# Run database migrations
echo -e "${YELLOW}Running database migrations...${NC}"
docker compose -f docker-compose.prod.yml exec -T backend alembic upgrade head

# Clean up old images
echo -e "${YELLOW}Cleaning up old Docker images...${NC}"
docker image prune -f

# Show status
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
docker compose -f docker-compose.prod.yml ps
echo ""

# Health check
echo -e "${YELLOW}Running health check...${NC}"
sleep 5
HEALTH=$(curl -s http://localhost:8000/health || echo "failed")
if [[ "$HEALTH" == *"healthy"* ]]; then
    echo -e "${GREEN}✓ Backend is healthy${NC}"
else
    echo -e "${RED}✗ Backend health check failed${NC}"
    echo "Check logs with: docker compose -f docker-compose.prod.yml logs backend"
fi

echo ""
echo -e "${GREEN}Deployment complete!${NC}"
