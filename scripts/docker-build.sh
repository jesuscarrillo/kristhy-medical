#!/bin/bash

# Kristhy Medical - Docker Build Script
# Builds production-optimized Docker image with version tags
# Usage: ./scripts/docker-build.sh

set -e

echo "🔨 Building Kristhy Medical Docker Image..."

# Check if .env.local exists
if [ ! -f .env.local ]; then
  echo "❌ Error: .env.local file not found"
  echo "Please create .env.local with required environment variables"
  exit 1
fi

# Load DATABASE_URL for build (required by Prisma)
source .env.local

if [ -z "$DATABASE_URL" ]; then
  echo "❌ Error: DATABASE_URL not found in .env.local"
  exit 1
fi

# Generate version tag
VERSION_TAG=$(date +%Y%m%d-%H%M%S)
IMAGE_NAME="kristhy-medical"

echo "📦 Building image: $IMAGE_NAME:$VERSION_TAG"
echo "📦 Building image: $IMAGE_NAME:latest"

# Build Docker image
docker build \
  --build-arg DATABASE_URL="$DATABASE_URL" \
  --target runner \
  --tag "$IMAGE_NAME:latest" \
  --tag "$IMAGE_NAME:$VERSION_TAG" \
  .

echo "✅ Build complete!"
echo ""
echo "Image tags:"
echo "  - $IMAGE_NAME:latest"
echo "  - $IMAGE_NAME:$VERSION_TAG"
echo ""
echo "To run the image:"
echo "  docker run -p 3000:3000 --env-file .env.local $IMAGE_NAME:latest"
