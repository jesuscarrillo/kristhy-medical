#!/bin/bash

# Kristhy Medical - Docker Seed Script
# Seeds database with initial doctor user
# Usage: ./scripts/docker-seed.sh

set -e

echo "🌱 Seeding database..."

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

# Run seed
echo "Running: pnpm db:seed"
docker-compose $COMPOSE_FILE exec app pnpm db:seed

echo "✅ Database seeded successfully!"
echo ""
echo "You can now login with:"
echo "  Email:    \$SEED_DOCTOR_EMAIL"
echo "  Password: \$SEED_DOCTOR_PASSWORD"
