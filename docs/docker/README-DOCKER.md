# Kristhy Medical - Docker Deployment Guide

Complete guide for deploying Kristhy Medical using Docker and Docker Compose.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Production](#production)
- [Database Migrations](#database-migrations)
- [Scripts Reference](#scripts-reference)
- [Architecture](#architecture)
- [Troubleshooting](#troubleshooting)
- [Cloud Deployment](#cloud-deployment)
- [Performance & Optimization](#performance--optimization)
- [Monitoring & Logs](#monitoring--logs)
- [Security Best Practices](#security-best-practices)

---

## Prerequisites

### Required Software

- **Docker:** 24.0 or higher
- **Docker Compose:** 2.0 or higher
- **Git:** For cloning the repository

### Installation

**macOS (using Homebrew):**
```bash
brew install docker docker-compose
```

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install docker.io docker-compose-plugin
```

**Windows:**
- Install [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Ensure WSL2 is enabled

### Verify Installation

```bash
docker --version
docker-compose --version
```

---

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd kristhy-medical
```

### 2. Create Environment File

```bash
cp .env.example .env.local
```

### 3. Configure Environment Variables

Edit `.env.local` with your configuration (see [Environment Variables](#environment-variables) section below).

### 4. Start Development Environment

```bash
./scripts/docker-dev.sh
```

The application will be available at: **http://localhost:3000**

### 5. Run Migrations and Seed (First Time Only)

```bash
# In a new terminal
./scripts/docker-migrate.sh
./scripts/docker-seed.sh
```

### 6. Login

Use the credentials from your `.env.local`:
- Email: `$SEED_DOCTOR_EMAIL`
- Password: `$SEED_DOCTOR_PASSWORD`

---

## Environment Variables

### Required Variables

Create `.env.local` with the following variables:

```bash
# Database (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres.xxxxx:[PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.xxxxx:[PASSWORD]@aws-0-us-west-1.pooler.supabase.com:5432/postgres"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Security - Encryption (AES-256-GCM)
# Generate with: openssl rand -hex 32
ENCRYPTION_KEY="your-64-character-hex-string-here"

# Better Auth
# Generate with: openssl rand -base64 32
BETTER_AUTH_SECRET="your-base64-secret-here"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"

# Email (Resend)
RESEND_API_KEY="re_xxxxxxxxxxxxx"
EMAIL_FROM="Dra. Kristhy <noreply@yourdomain.com>"

# Cron Jobs
# Generate with: openssl rand -hex 32
CRON_SECRET="your-cron-secret-here"

# Database Seed (Initial Doctor User)
SEED_DOCTOR_EMAIL="dra@example.com"
SEED_DOCTOR_PASSWORD="securepassword123"
SEED_DOCTOR_NAME="Dra. Kristhy"
```

### Optional Variables

```bash
# Rate Limiting (Upstash Redis) - Recommended for production
UPSTASH_REDIS_REST_URL="https://xxxxx.upstash.io"
UPSTASH_REDIS_REST_TOKEN="xxxxxxxxxxxxx"
```

### Generating Secrets

```bash
# Encryption key (64 hex characters)
openssl rand -hex 32

# Better Auth secret (Base64)
openssl rand -base64 32

# Cron secret
openssl rand -hex 32
```

---

## Development

### Start Development Environment

```bash
./scripts/docker-dev.sh
```

This will:
- Build the Docker image with development dependencies
- Start the Next.js application with hot-reload
- Optionally start a local PostgreSQL database
- Mount source code for live updates

### Development Features

- **Hot Reload:** Changes to `src/`, `public/`, and `prisma/` are reflected immediately
- **Debug Logs:** Full console output in terminal
- **Local Database:** Optional PostgreSQL container for offline development

### Accessing the Development Container

```bash
# Open a shell in the running container
docker-compose exec app sh

# Run pnpm commands
docker-compose exec app pnpm db:studio
docker-compose exec app pnpm prisma generate
```

### Stop Development Environment

```bash
./scripts/docker-stop.sh
```

Or press `Ctrl+C` in the terminal running `docker-dev.sh`

---

## Production

### Build Production Image

```bash
./scripts/docker-build.sh
```

This creates an optimized Docker image (~350-400MB) with:
- Standalone Next.js output
- Minimal Alpine Linux base
- Non-root user for security
- Health check endpoint

### Start Production Environment

```bash
./scripts/docker-prod.sh
```

This will:
- Build the production-optimized image
- Start containers with resource limits
- Enable logging with rotation
- Configure health checks

### Production Configuration

The production environment includes:
- **Resource Limits:** 2 CPU cores, 2GB RAM max
- **Restart Policy:** Always restart on failure
- **Health Checks:** Every 30 seconds
- **Log Rotation:** Max 10MB per file, 3 files retained

### Stop Production Environment

```bash
./scripts/docker-stop.sh --prod
```

---

## Database Migrations

### Run Migrations

```bash
./scripts/docker-migrate.sh
```

This executes `pnpm prisma migrate deploy` inside the container.

### Seed Database

```bash
./scripts/docker-seed.sh
```

This creates the initial doctor user with credentials from `.env.local`.

### Manual Migration Commands

```bash
# Create a new migration (development)
docker-compose exec app pnpm prisma migrate dev --name migration_name

# Deploy migrations (production)
docker-compose -f docker-compose.prod.yml exec app pnpm prisma migrate deploy

# Reset database (DESTRUCTIVE - development only)
docker-compose exec app pnpm prisma migrate reset
```

---

## Scripts Reference

All scripts are located in `scripts/` directory and are executable:

| Script | Description | Usage |
|--------|-------------|-------|
| `docker-build.sh` | Build production Docker image with version tags | `./scripts/docker-build.sh` |
| `docker-dev.sh` | Start development environment with hot-reload | `./scripts/docker-dev.sh` |
| `docker-prod.sh` | Start production environment with optimizations | `./scripts/docker-prod.sh` |
| `docker-migrate.sh` | Run Prisma migrations in container | `./scripts/docker-migrate.sh` |
| `docker-seed.sh` | Seed database with initial doctor user | `./scripts/docker-seed.sh` |
| `docker-stop.sh` | Stop running containers | `./scripts/docker-stop.sh [--prod]` |

---

## Architecture

### Multi-Stage Dockerfile

The Dockerfile uses 4 stages for optimal layer caching and minimal image size:

```
┌─────────────────────────────────────────┐
│ Stage 1: base                           │
│ - Node.js 18 Alpine                     │
│ - pnpm 10.17.1 via corepack             │
│ - OpenSSL for Prisma                    │
└─────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│ Stage 2: deps                           │
│ - Install all dependencies              │
│ - Uses frozen lockfile                  │
└─────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│ Stage 3: builder                        │
│ - Generate Prisma Client                │
│ - Build Next.js (standalone output)     │
│ - Optimization and minification         │
└─────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│ Stage 4: runner                         │
│ - Copy only necessary files             │
│ - Non-root user (nextjs:1001)           │
│ - Health check integrated               │
│ - Final size: ~350-400MB                │
└─────────────────────────────────────────┘
```

### Next.js Standalone Output

The `output: "standalone"` configuration in `next.config.ts` enables:
- **70% size reduction** compared to full build
- **Only required files** included in output
- **Minimal `node_modules`** with production dependencies only
- **Self-contained server** ready to run

### Health Check Endpoint

**Endpoint:** `/api/health`

**Response (Healthy):**
```json
{
  "status": "healthy",
  "timestamp": "2026-02-08T12:00:00.000Z",
  "service": "kristhy-medical",
  "database": "connected"
}
```

**Response (Unhealthy):**
```json
{
  "status": "unhealthy",
  "timestamp": "2026-02-08T12:00:00.000Z",
  "service": "kristhy-medical",
  "database": "disconnected",
  "error": "Connection timeout"
}
```

---

## Troubleshooting

### Container Won't Start

**Check logs:**
```bash
docker-compose logs app
```

**Common issues:**
- Missing `.env.local` file
- Invalid `DATABASE_URL`
- Port 3000 already in use

**Solution:**
```bash
# Check what's using port 3000
lsof -i :3000

# Use a different port
PORT=3001 docker-compose up
```

### Database Connection Failed

**Symptoms:**
- Health check returns 503
- Errors mentioning Prisma or database

**Solutions:**
1. Verify `DATABASE_URL` in `.env.local`
2. Check Supabase is accessible
3. Ensure pgBouncer URL is correct (port 6543)
4. Test connection manually:
```bash
docker-compose exec app pnpm prisma db push --skip-generate
```

### Prisma Generate Fails

**Error:** "Environment variable not found: DATABASE_URL"

**Solution:**
```bash
# Ensure DATABASE_URL is set in .env.local
echo $DATABASE_URL

# Rebuild with build arg
docker build --build-arg DATABASE_URL="$DATABASE_URL" .
```

### Hot Reload Not Working

**Issue:** Changes to source files not reflected in browser

**Solutions:**
1. Ensure volumes are mounted correctly in `docker-compose.yml`
2. Check file permissions
3. Restart containers:
```bash
docker-compose restart app
```

### Out of Memory

**Error:** Container killed due to OOM

**Solution:**
Increase Docker memory limit in Docker Desktop settings or adjust resource limits in `docker-compose.prod.yml`:

```yaml
deploy:
  resources:
    limits:
      memory: 4G  # Increase from 2G
```

### Permission Denied

**Error:** EACCES when running scripts

**Solution:**
```bash
chmod +x scripts/*.sh
```

---

## Cloud Deployment

### AWS ECS (Elastic Container Service)

1. **Push to ECR:**
```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
docker tag kristhy-medical:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/kristhy-medical:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/kristhy-medical:latest
```

2. **Create ECS Task Definition** with environment variables from AWS Secrets Manager

3. **Create ECS Service** with Application Load Balancer

### Google Cloud Run

```bash
# Build and push to GCR
gcloud builds submit --tag gcr.io/PROJECT_ID/kristhy-medical

# Deploy to Cloud Run
gcloud run deploy kristhy-medical \
  --image gcr.io/PROJECT_ID/kristhy-medical \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="DATABASE_URL=$DATABASE_URL,ENCRYPTION_KEY=$ENCRYPTION_KEY"
```

### DigitalOcean App Platform

1. Connect GitHub repository
2. Select Dockerfile deployment
3. Set environment variables in dashboard
4. Configure health check: `/api/health`

### Railway

```bash
railway up
```

Railway automatically detects Dockerfile and builds the image.

### Render

1. Create new Web Service
2. Connect GitHub repository
3. Select "Docker" as environment
4. Add environment variables
5. Set health check path: `/api/health`

---

## Performance & Optimization

### Image Size Optimization

| Stage | Size | Notes |
|-------|------|-------|
| Development (with deps) | ~1.2GB | Includes dev dependencies |
| Production (standalone) | ~350MB | Minimal runtime only |

### Build Time Optimization

**Layer Caching:**
- `package.json` copied before source code
- Dependencies cached between builds
- Rebuild time with cache: ~30 seconds

**GitHub Actions Cache:**
```yaml
cache-from: type=gha
cache-to: type=gha,mode=max
```

### Runtime Performance

**Memory Usage:**
- Idle: ~200-300MB
- Under load: ~500-800MB

**Startup Time:**
- Cold start: ~10 seconds
- With migrations: ~15-20 seconds

**Optimization Tips:**
1. Use `NEXT_PUBLIC_*` for client-side variables only
2. Enable Redis for rate limiting (Upstash)
3. Use CDN for static assets
4. Enable gzip compression (already configured)

---

## Monitoring & Logs

### View Logs

**Development:**
```bash
docker-compose logs -f app
```

**Production:**
```bash
docker-compose -f docker-compose.prod.yml logs -f app
```

**Last 100 lines:**
```bash
docker logs kristhy-medical-prod --tail 100
```

### Log Rotation

Production logs are automatically rotated:
- Max size: 10MB per file
- Max files: 3
- Total max: 30MB

### Health Monitoring

**Check health status:**
```bash
curl http://localhost:3000/api/health
```

**Continuous monitoring:**
```bash
watch -n 5 'curl -s http://localhost:3000/api/health | jq'
```

### Container Stats

```bash
docker stats kristhy-medical-prod
```

Shows real-time:
- CPU usage
- Memory usage
- Network I/O
- Disk I/O

### External Monitoring (Recommended)

**Uptime Monitoring:**
- [UptimeRobot](https://uptimerobot.com/)
- [Pingdom](https://www.pingdom.com/)

**Application Monitoring:**
- [Sentry](https://sentry.io/) - Error tracking
- [DataDog](https://www.datadoghq.com/) - Full observability
- [New Relic](https://newrelic.com/) - APM

---

## Security Best Practices

### 1. Environment Variables

✅ **DO:**
- Store secrets in `.env.local` (never commit)
- Use environment variables for all sensitive data
- Rotate secrets regularly
- Use different secrets for dev/staging/prod

❌ **DON'T:**
- Hardcode secrets in code
- Commit `.env` files to git
- Use same secrets across environments
- Include secrets in Docker image

### 2. Docker Security

✅ **DO:**
- Run as non-root user (already configured)
- Use official base images (Node.js Alpine)
- Scan images for vulnerabilities (Trivy in CI)
- Keep base images updated

❌ **DON'T:**
- Run containers as root
- Use `latest` tag in production
- Disable security features

### 3. Network Security

✅ **DO:**
- Use HTTPS in production (configure reverse proxy)
- Enable HSTS headers (already configured)
- Use CSP headers (already configured)
- Restrict CORS to specific domains

### 4. Database Security

✅ **DO:**
- Use connection pooling (pgBouncer)
- Enable Row Level Security (RLS) in Supabase
- Use SSL for database connections
- Rotate database credentials

### 5. Secret Management

**For Production, use:**
- AWS Secrets Manager
- Google Cloud Secret Manager
- Azure Key Vault
- HashiCorp Vault

**Example with AWS Secrets Manager:**
```bash
aws secretsmanager get-secret-value --secret-id kristhy-medical/prod --query SecretString --output text | jq -r 'to_entries|map("\(.key)=\(.value|tostring)")|.[]' > .env.local
```

---

## CI/CD Integration

### GitHub Actions

The included workflow (`.github/workflows/docker-build.yml`) automatically:
1. ✅ Builds Docker image on push to `main`/`develop`
2. ✅ Pushes to GitHub Container Registry (GHCR)
3. ✅ Scans for vulnerabilities with Trivy
4. ✅ Uploads security results to GitHub Security tab

**Pull the published image:**
```bash
docker pull ghcr.io/<username>/kristhy-medical:latest
```

### Manual Deployment

```bash
# 1. Build production image
./scripts/docker-build.sh

# 2. Tag for registry
docker tag kristhy-medical:latest registry.example.com/kristhy-medical:latest

# 3. Push to registry
docker push registry.example.com/kristhy-medical:latest

# 4. Deploy on server
ssh user@server 'docker pull registry.example.com/kristhy-medical:latest && docker-compose -f docker-compose.prod.yml up -d'
```

---

## Kubernetes Deployment

See `k8s/` directory for Kubernetes manifests (optional).

**Deploy to Kubernetes:**
```bash
# Create namespace
kubectl create namespace kristhy-medical

# Create secrets from .env.local
kubectl create secret generic kristhy-secrets \
  --from-env-file=.env.local \
  -n kristhy-medical

# Apply manifests
kubectl apply -f k8s/ -n kristhy-medical

# Check status
kubectl get pods -n kristhy-medical
```

---

## Support

For issues or questions:
- **GitHub Issues:** [Create an issue](https://github.com/your-org/kristhy-medical/issues)
- **Documentation:** See main [README.md](./README.md)
- **Docker Docs:** [https://docs.docker.com](https://docs.docker.com)

---

## License

See [LICENSE](./LICENSE) file for details.
