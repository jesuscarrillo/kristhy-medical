# Docker para Desarrollo Local - Kristhy Medical

Guía rápida para usar Docker en desarrollo local con hot-reload.

## ✅ Estado Actual

- ✅ Docker configurado para desarrollo local
- ✅ Hot-reload funcionando (cambios en `src/`, `public/`, `prisma/`)
- ✅ Health check endpoint operativo
- ✅ Conexión a Supabase funcionando
- ✅ Next.js 16 en modo desarrollo

## 🚀 Uso Rápido

### Iniciar Desarrollo

```bash
docker-compose up
```

O en segundo plano:

```bash
docker-compose up -d
```

### Ver Logs

```bash
docker-compose logs -f app
```

### Detener

```bash
docker-compose down
```

## 📋 Requisitos

1. **Docker y Docker Compose instalados**
   ```bash
   docker --version  # Docker 24.0+
   docker-compose --version  # v2.0+
   ```

2. **Archivo `.env.local` configurado**
   - Debe existir en la raíz del proyecto
   - Contiene todas las variables de entorno de Supabase, Better Auth, etc.

## 🔍 Verificación

### 1. Check de Salud

```bash
curl http://localhost:3000/api/health
```

**Respuesta esperada:**
```json
{
  "status": "healthy",
  "timestamp": "2026-02-08T20:17:48.026Z",
  "service": "kristhy-medical",
  "database": "connected"
}
```

### 2. Acceder a la Aplicación

- **Landing:** http://localhost:3000
- **Dashboard:** http://localhost:3000/dashboard
- **Login:** http://localhost:3000/login

### 3. Estado del Contenedor

```bash
docker-compose ps
```

Debe mostrar: `STATUS: Up X seconds (healthy)`

## 📁 Archivos de Configuración

### `Dockerfile.dev`
- Dockerfile simplificado para desarrollo
- No hace build completo de Next.js
- Usa `pnpm dev` para hot-reload
- Tamaño: ~1.2GB (incluye dev dependencies)

### `docker-compose.yml`
- Configuración de desarrollo
- Monta código como volúmenes (hot-reload)
- Carga variables desde `.env.local`
- PostgreSQL local comentado (usa Supabase)

## 🔧 Hot Reload

Los siguientes directorios están montados como volúmenes:

- `./src` → Código fuente
- `./public` → Assets estáticos
- `./prisma` → Schema de base de datos
- `./next.config.ts` → Configuración de Next.js
- `./tailwind.config.ts` → Configuración de Tailwind
- `./tsconfig.json` → Configuración de TypeScript

**Cualquier cambio en estos archivos se refleja inmediatamente** sin necesidad de rebuild.

## 🗄️ Base de Datos

### Usando Supabase (Recomendado)

Por defecto, el ambiente usa Supabase como base de datos externa.

**Variables requeridas en `.env.local`:**
```bash
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
```

### Migraciones

```bash
# Aplicar migraciones
docker-compose exec app pnpm prisma migrate deploy

# Ver estado
docker-compose exec app pnpm prisma migrate status

# Prisma Studio
docker-compose exec app pnpm db:studio
```

### Seed

```bash
docker-compose exec app pnpm db:seed
```

## 🐛 Troubleshooting

### Puerto 3000 en uso

```bash
# Ver qué proceso usa el puerto
lsof -i :3000

# Usar otro puerto
PORT=3001 docker-compose up
```

### Contenedor no inicia

```bash
# Ver logs completos
docker-compose logs app

# Reconstruir imagen
docker-compose build --no-cache app
docker-compose up
```

### Cambios no se reflejan

```bash
# Reiniciar contenedor
docker-compose restart app

# Si persiste, rebuild
docker-compose down
docker-compose build app
docker-compose up
```

### Error de conexión a base de datos

1. Verificar `.env.local` existe y tiene `DATABASE_URL`
2. Verificar Supabase está accesible
3. Ver logs: `docker-compose logs app`

### Liberar espacio

```bash
# Detener y limpiar
docker-compose down

# Limpiar imágenes no usadas
docker system prune -a

# Limpiar todo (cuidado: borra TODAS las imágenes Docker)
docker system prune -a --volumes
```

## 📊 Comandos Útiles

```bash
# Entrar al contenedor
docker-compose exec app sh

# Ejecutar comandos pnpm
docker-compose exec app pnpm <comando>

# Ver uso de recursos
docker stats kristhy-medical-dev

# Reconstruir desde cero
docker-compose build --no-cache app

# Ver networks
docker network ls

# Inspeccionar contenedor
docker inspect kristhy-medical-dev
```

## 🚀 Workflows Comunes

### Desarrollo Normal

```bash
# 1. Iniciar ambiente
docker-compose up -d

# 2. Ver logs
docker-compose logs -f app

# 3. Desarrollar (los cambios se reflejan automáticamente)

# 4. Detener cuando termines
docker-compose down
```

### Después de Cambios en package.json

```bash
# Rebuild imagen
docker-compose build app

# Reiniciar
docker-compose up -d
```

### Después de Cambios en Prisma Schema

```bash
# Regenerar Prisma Client
docker-compose exec app pnpm prisma generate

# Aplicar migraciones
docker-compose exec app pnpm prisma migrate dev

# Reiniciar para asegurar
docker-compose restart app
```

## 📈 Performance

### Métricas Típicas

- **Startup time:** ~5-10 segundos
- **Hot reload:** <2 segundos
- **Memory:** ~500-800MB
- **CPU:** 10-20% en idle

### Optimización

Si el contenedor está lento:

1. Aumentar recursos de Docker Desktop
2. Excluir directorios grandes del mount
3. Usar `.dockerignore` agresivo

## 🔐 Seguridad

- ✅ `.env.local` nunca se incluye en la imagen (está en `.dockerignore`)
- ✅ Contenedor corre como non-root user
- ✅ Volúmenes montados como read-only cuando es posible

## 📚 Próximos Pasos

- Para **producción**, ver `README-DOCKER.md`
- Para **Kubernetes**, ver `k8s/README.md`
- Para **CI/CD**, ver `.github/workflows/docker-build.yml`

## 🆘 Soporte

¿Problemas? Revisa:

1. Logs: `docker-compose logs app`
2. Health check: `curl http://localhost:3000/api/health`
3. Variables: `docker-compose exec app env | grep DATABASE`

---

**¿Todo funcionando?** 🎉

Accede a: http://localhost:3000
