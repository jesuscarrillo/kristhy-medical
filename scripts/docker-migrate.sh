#!/bin/bash

# Kristhy Medical - Docker Migrate Script
# Runs Prisma migrations in Docker container
# Usage: ./scripts/docker-migrate.sh

set -e

echo "🔄 Running database migrations..."

# Check which compose file to use
if docker ps | grep -q "kristhy-medical-prod"; then
  COMPOSE_FILE="-f docker-compose.prod.yml"
  echo "Using production environment"
elif docker ps | grep -q "kristhy-medical-dev"; then
  COMPOSE_FILE=""
  echo "Using development environment"
else
  echo "❌ Error: No running Kristhy Medical containers found"
  echo "Please start the application first:"
  echo "  Development: ./scripts/docker-dev.sh"
  echo "  Production:  ./scripts/docker-prod.sh"
  exit 1
fi

# Run migrations
echo "Running: pnpm prisma migrate deploy"
docker-compose $COMPOSE_FILE exec app pnpm prisma migrate deploy

echo "✅ Migrations completed successfully!"
