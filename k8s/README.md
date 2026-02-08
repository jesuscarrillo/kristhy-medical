# Kubernetes Deployment Guide

This directory contains Kubernetes manifests for deploying Kristhy Medical to a Kubernetes cluster.

## Prerequisites

- Kubernetes cluster (v1.24+)
- `kubectl` CLI tool configured
- Docker image pushed to a container registry (GHCR, ECR, GCR, etc.)

## Quick Start

### 1. Create Namespace

```bash
kubectl create namespace kristhy-medical
```

### 2. Create Secrets

**Option A: From .env.local file**
```bash
kubectl create secret generic kristhy-medical-secrets \
  --from-env-file=../.env.local \
  -n kristhy-medical
```

**Option B: From individual values (recommended for production)**
```bash
kubectl create secret generic kristhy-medical-secrets \
  --from-literal=database-url="postgresql://..." \
  --from-literal=direct-url="postgresql://..." \
  --from-literal=supabase-service-role-key="eyJhbGc..." \
  --from-literal=encryption-key="your-64-hex-chars" \
  --from-literal=better-auth-secret="your-base64-secret" \
  --from-literal=resend-api-key="re_xxxxx" \
  --from-literal=cron-secret="your-cron-secret" \
  -n kristhy-medical
```

### 3. Update ConfigMap

Edit `configmap.yaml` with your actual values:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `BETTER_AUTH_URL` (your domain)
- `EMAIL_FROM`

### 4. Update Deployment Image

Edit `deployment.yaml` and replace:
```yaml
image: ghcr.io/your-org/kristhy-medical:latest
```

With your actual image URL.

### 5. Apply Manifests

```bash
kubectl apply -f configmap.yaml -n kristhy-medical
kubectl apply -f deployment.yaml -n kristhy-medical
kubectl apply -f service.yaml -n kristhy-medical
kubectl apply -f hpa.yaml -n kristhy-medical
```

### 6. Verify Deployment

```bash
# Check pods
kubectl get pods -n kristhy-medical

# Check service
kubectl get svc -n kristhy-medical

# Check HPA
kubectl get hpa -n kristhy-medical

# View logs
kubectl logs -f deployment/kristhy-medical -n kristhy-medical
```

### 7. Access Application

```bash
# Get external IP
kubectl get svc kristhy-medical -n kristhy-medical

# Wait for EXTERNAL-IP to be assigned
# Then access: http://<EXTERNAL-IP>
```

## Manifests Overview

| File | Description |
|------|-------------|
| `deployment.yaml` | Main application deployment with 3 replicas, health checks, and resource limits |
| `service.yaml` | LoadBalancer service exposing the application on port 80 |
| `configmap.yaml` | Non-sensitive configuration (public URLs, email config) |
| `secrets.yaml` | Template for sensitive data (use `kubectl create secret` instead) |
| `hpa.yaml` | Horizontal Pod Autoscaler for automatic scaling (3-10 replicas) |

## Configuration Details

### Deployment

**Replicas:** 3 (minimum for high availability)

**Resource Limits:**
- CPU: 500m (requests) to 2000m (limits)
- Memory: 512Mi (requests) to 2Gi (limits)

**Health Checks:**
- Liveness: Checks every 30s after 60s initial delay
- Readiness: Checks every 10s after 30s initial delay
- Startup: Checks every 10s for up to 120s

**Rolling Update Strategy:**
- Max surge: 1 pod
- Max unavailable: 0 pods (zero-downtime deployments)

### Service

**Type:** LoadBalancer (for cloud providers)

**Ports:**
- External: 80 (HTTP)
- Internal: 3000 (container port)

**Session Affinity:** ClientIP (3 hours)

### Horizontal Pod Autoscaler

**Scaling:**
- Min replicas: 3
- Max replicas: 10

**Metrics:**
- CPU threshold: 70%
- Memory threshold: 80%

**Behavior:**
- Scale up: Fast (100% or 4 pods per 30s)
- Scale down: Slow (50% or 2 pods per 60s, stabilization 5min)

## Advanced Configuration

### Using Ingress (Recommended for Production)

Create an Ingress resource for HTTPS and custom domain:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: kristhy-medical-ingress
  namespace: kristhy-medical
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - yourdomain.com
    secretName: kristhy-medical-tls
  rules:
  - host: yourdomain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: kristhy-medical
            port:
              number: 3000
```

Apply:
```bash
kubectl apply -f ingress.yaml -n kristhy-medical
```

### Using Private Registry

If using a private container registry, create an image pull secret:

```bash
kubectl create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username=<github-username> \
  --docker-password=<github-token> \
  --docker-email=<email> \
  -n kristhy-medical
```

Then uncomment in `deployment.yaml`:
```yaml
imagePullSecrets:
- name: ghcr-secret
```

### Database Migrations

Run migrations as a Kubernetes Job:

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: kristhy-medical-migrate
  namespace: kristhy-medical
spec:
  template:
    spec:
      containers:
      - name: migrate
        image: ghcr.io/your-org/kristhy-medical:latest
        command: ["pnpm", "prisma", "migrate", "deploy"]
        envFrom:
        - configMapRef:
            name: kristhy-medical-config
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: kristhy-medical-secrets
              key: database-url
      restartPolicy: OnFailure
```

Apply:
```bash
kubectl apply -f migrate-job.yaml -n kristhy-medical
kubectl logs -f job/kristhy-medical-migrate -n kristhy-medical
```

## Monitoring

### View Pod Status

```bash
kubectl get pods -n kristhy-medical -w
```

### View Logs

```bash
# All pods
kubectl logs -f deployment/kristhy-medical -n kristhy-medical

# Specific pod
kubectl logs -f <pod-name> -n kristhy-medical

# Previous container (if crashed)
kubectl logs <pod-name> -n kristhy-medical --previous
```

### Describe Resources

```bash
kubectl describe deployment kristhy-medical -n kristhy-medical
kubectl describe service kristhy-medical -n kristhy-medical
kubectl describe hpa kristhy-medical-hpa -n kristhy-medical
```

### Execute Commands in Pod

```bash
kubectl exec -it deployment/kristhy-medical -n kristhy-medical -- sh
```

## Scaling

### Manual Scaling

```bash
# Scale to 5 replicas
kubectl scale deployment kristhy-medical --replicas=5 -n kristhy-medical
```

### Autoscaling Status

```bash
kubectl get hpa kristhy-medical-hpa -n kristhy-medical --watch
```

## Updates and Rollbacks

### Update Image

```bash
kubectl set image deployment/kristhy-medical \
  kristhy-medical=ghcr.io/your-org/kristhy-medical:v2.0.0 \
  -n kristhy-medical
```

### Check Rollout Status

```bash
kubectl rollout status deployment/kristhy-medical -n kristhy-medical
```

### Rollback

```bash
# Rollback to previous version
kubectl rollout undo deployment/kristhy-medical -n kristhy-medical

# Rollback to specific revision
kubectl rollout undo deployment/kristhy-medical --to-revision=2 -n kristhy-medical
```

### View Rollout History

```bash
kubectl rollout history deployment/kristhy-medical -n kristhy-medical
```

## Cleanup

### Delete All Resources

```bash
kubectl delete namespace kristhy-medical
```

### Delete Specific Resources

```bash
kubectl delete -f . -n kristhy-medical
```

## Troubleshooting

### Pods Not Starting

```bash
# Check pod events
kubectl describe pod <pod-name> -n kristhy-medical

# Check logs
kubectl logs <pod-name> -n kristhy-medical

# Common issues:
# - Image pull errors: Check imagePullSecrets
# - CrashLoopBackOff: Check logs and environment variables
# - Pending: Check resource availability
```

### Service Not Accessible

```bash
# Check service endpoints
kubectl get endpoints kristhy-medical -n kristhy-medical

# Check if pods are ready
kubectl get pods -n kristhy-medical

# Test from within cluster
kubectl run -it --rm debug --image=curlimages/curl --restart=Never -n kristhy-medical -- curl http://kristhy-medical-internal:3000/api/health
```

### Database Connection Issues

```bash
# Verify secrets exist
kubectl get secret kristhy-medical-secrets -n kristhy-medical

# Check environment variables in pod
kubectl exec deployment/kristhy-medical -n kristhy-medical -- env | grep DATABASE
```

## Cloud Provider Specific Notes

### AWS EKS

```bash
# Install AWS Load Balancer Controller first
# https://docs.aws.amazon.com/eks/latest/userguide/aws-load-balancer-controller.html

# Service will create an Application Load Balancer (ALB)
```

### Google GKE

```bash
# Service will create a Google Cloud Load Balancer
# Consider using Google Cloud Armor for DDoS protection
```

### Azure AKS

```bash
# Service will create an Azure Load Balancer
# Consider using Azure Application Gateway for advanced routing
```

## Security Best Practices

1. **Always use secrets for sensitive data**
2. **Enable RBAC** and create service accounts with minimal permissions
3. **Use Network Policies** to restrict pod-to-pod communication
4. **Scan images** for vulnerabilities before deployment
5. **Enable Pod Security Standards** (restricted profile)
6. **Use TLS/HTTPS** via Ingress with cert-manager
7. **Regularly update** base images and dependencies

## Support

For issues or questions:
- See main documentation: [README-DOCKER.md](../README-DOCKER.md)
- Kubernetes docs: https://kubernetes.io/docs/
