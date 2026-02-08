#!/bin/bash

# Kristhy Medical - Docker Stop Script
# Stops all running containers
# Usage: ./scripts/docker-stop.sh [--prod]

set -e

if [ "$1" == "--prod" ]; then
  echo "🛑 Stopping production containers..."
  docker-compose -f docker-compose.prod.yml down
  echo "✅ Production containers stopped!"
else
  echo "🛑 Stopping development containers..."
  docker-compose down
  echo "✅ Development containers stopped!"
fi

echo ""
echo "To remove all data (volumes):"
echo "  Development: docker-compose down -v"
echo "  Production:  docker-compose -f docker-compose.prod.yml down -v"
