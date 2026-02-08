#!/bin/bash

# Kristhy Medical - Docker Production Script
# Starts production environment with optimized image
# Usage: ./scripts/docker-prod.sh

set -e

echo "🚀 Starting Kristhy Medical (Production Mode)..."

# Check if .env.local exists
if [ ! -f .env.local ]; then
  echo "❌ Error: .env.local file not found"
  echo "Please create .env.local with required environment variables"
  exit 1
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "❌ Error: Docker is not running"
  echo "Please start Docker and try again"
  exit 1
fi

echo "📦 Building production image..."
docker-compose -f docker-compose.prod.yml build

echo "🚀 Starting production containers..."
docker-compose -f docker-compose.prod.yml up -d

echo "✅ Production containers started!"
echo ""
echo "Waiting for health check..."
sleep 10

# Check health
HEALTH_STATUS=$(docker inspect --format='{{.State.Health.Status}}' kristhy-medical-prod 2>/dev/null || echo "unknown")
echo "Health status: $HEALTH_STATUS"

echo ""
echo "📊 Container status:"
docker-compose -f docker-compose.prod.yml ps

echo ""
echo "🌐 Application available at: http://localhost:3000"
echo ""
echo "Useful commands:"
echo "  View logs:    docker-compose -f docker-compose.prod.yml logs -f app"
echo "  Stop:         ./scripts/docker-stop.sh"
echo "  Restart:      docker-compose -f docker-compose.prod.yml restart app"
