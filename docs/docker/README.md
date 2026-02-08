# Documentación de Docker - Kristhy Medical

Esta carpeta contiene toda la documentación relacionada con Docker para el proyecto Kristhy Medical.

## 📚 Guías Disponibles

### 🚀 [DOCKER-LOCAL.md](./DOCKER-LOCAL.md)
**Guía de Desarrollo Local con Docker**

Guía completa para usar Docker en desarrollo local:
- Quick start para desarrollo
- Hot-reload configurado
- Troubleshooting común
- Comandos útiles del día a día

**👉 Empieza aquí si quieres desarrollar con Docker**

---

### 📖 [README-DOCKER.md](./README-DOCKER.md)
**Guía Completa de Docker**

Documentación exhaustiva que incluye:
- Desarrollo y producción
- Configuración de variables de entorno
- Deployment en cloud (AWS, GCP, DigitalOcean, etc.)
- Arquitectura multi-stage
- Performance y optimización
- Monitoring y logs
- Security best practices

**👉 Consulta esta guía para deployments en producción**

---

## 🎯 Quick Start

### Desarrollo Local

```bash
# 1. Asegúrate de tener .env.local configurado
cp .env.example .env.local
# Edita .env.local con tus credenciales

# 2. Inicia el ambiente de desarrollo
docker-compose up

# La aplicación estará disponible en http://localhost:3000
```

### Producción

```bash
# Build de imagen optimizada
./scripts/docker-build.sh

# Iniciar producción
./scripts/docker-prod.sh
```

---

## 📁 Estructura de Archivos

```
kristhy-medical/
├── Dockerfile              # Dockerfile de producción (multi-stage)
├── Dockerfile.dev          # Dockerfile de desarrollo (hot-reload)
├── .dockerignore          # Exclusiones de Docker build
├── docker-compose.yml      # Compose para desarrollo
├── docker-compose.prod.yml # Compose para producción
├── scripts/
│   ├── docker-dev.sh      # Iniciar desarrollo
│   ├── docker-build.sh    # Build de producción
│   ├── docker-prod.sh     # Iniciar producción
│   ├── docker-stop.sh     # Detener contenedores
│   ├── docker-migrate.sh  # Ejecutar migraciones
│   └── docker-seed.sh     # Seed de base de datos
├── k8s/                   # Manifiestos de Kubernetes
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── configmap.yaml
│   ├── secrets.yaml
│   ├── hpa.yaml
│   └── README.md
└── docs/docker/           # 📍 Estás aquí
    ├── README.md          # Este archivo
    ├── DOCKER-LOCAL.md    # Guía de desarrollo local
    └── README-DOCKER.md   # Guía completa
```

---

## 🔧 Scripts Disponibles

| Script | Descripción | Uso |
|--------|-------------|-----|
| `docker-dev.sh` | Inicia desarrollo con hot-reload | `./scripts/docker-dev.sh` |
| `docker-build.sh` | Build de imagen de producción | `./scripts/docker-build.sh` |
| `docker-prod.sh` | Inicia ambiente de producción | `./scripts/docker-prod.sh` |
| `docker-stop.sh` | Detiene contenedores | `./scripts/docker-stop.sh` |
| `docker-migrate.sh` | Ejecuta migraciones de Prisma | `./scripts/docker-migrate.sh` |
| `docker-seed.sh` | Seed de base de datos | `./scripts/docker-seed.sh` |

---

## 🌐 Deployments Soportados

- ✅ **Docker Compose** - Desarrollo y producción local
- ✅ **Kubernetes** - Ver `k8s/README.md`
- ✅ **AWS ECS/Fargate**
- ✅ **Google Cloud Run**
- ✅ **DigitalOcean App Platform**
- ✅ **Railway**
- ✅ **Render**

---

## 🔐 Variables de Entorno

Todas las variables de entorno deben configurarse en `.env.local` para desarrollo local.

**Variables críticas:**
- `DATABASE_URL` - PostgreSQL con pgBouncer
- `DIRECT_URL` - PostgreSQL directo
- `ENCRYPTION_KEY` - AES-256-GCM (64 hex chars)
- `BETTER_AUTH_SECRET` - Base64 secret
- `SUPABASE_*` - Credenciales de Supabase

Ver [README-DOCKER.md](./README-DOCKER.md#environment-variables) para la lista completa.

---

## 📊 Estado del Proyecto

- ✅ Dockerfile multi-stage optimizado
- ✅ Docker Compose para desarrollo
- ✅ Docker Compose para producción
- ✅ Scripts de gestión completos
- ✅ Kubernetes manifests
- ✅ CI/CD con GitHub Actions
- ✅ Health check endpoint
- ✅ Hot-reload funcionando
- ✅ Documentación completa

---

## 🆘 Necesitas Ayuda?

1. **Desarrollo Local**: Ver [DOCKER-LOCAL.md](./DOCKER-LOCAL.md)
2. **Producción**: Ver [README-DOCKER.md](./README-DOCKER.md)
3. **Kubernetes**: Ver `k8s/README.md`
4. **Issues**: Revisar la sección de Troubleshooting en cada guía

---

## 📝 Changelog

### v1.0.0 (Febrero 2026)
- ✅ Implementación inicial de Docker
- ✅ Dockerfile.dev para desarrollo con hot-reload
- ✅ Dockerfile multi-stage para producción
- ✅ Docker Compose para dev y prod
- ✅ Scripts de gestión
- ✅ Kubernetes manifests completos
- ✅ CI/CD con GitHub Actions
- ✅ Documentación completa
