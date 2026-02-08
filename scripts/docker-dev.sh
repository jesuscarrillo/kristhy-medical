#!/bin/bash

# Kristhy Medical - Docker Development Script
# Starts development environment with hot-reload
# Usage: ./scripts/docker-dev.sh

set -e

echo "🚀 Kristhy Medical - Desarrollo Local con Docker"
echo "================================================"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
  echo "❌ Error: archivo .env.local no encontrado"
  echo ""
  echo "Crea .env.local con tus variables de entorno:"
  echo "  cp .env.example .env.local"
  echo "  # Luego edita .env.local con tus credenciales"
  exit 1
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "❌ Error: Docker no está corriendo"
  echo "Por favor inicia Docker Desktop y vuelve a intentar"
  exit 1
fi

echo "✅ .env.local encontrado"
echo "✅ Docker está corriendo"
echo ""

# Check if container is already running
if docker ps | grep -q kristhy-medical-dev; then
  echo "⚠️  El contenedor ya está corriendo"
  echo ""
  read -p "¿Reiniciar? (s/n): " -n 1 -r
  echo ""
  if [[ $REPLY =~ ^[Ss]$ ]]; then
    echo "🔄 Reiniciando contenedor..."
    docker-compose restart app
  fi
else
  echo "📦 Iniciando contenedor..."
  docker-compose up -d app
fi

echo ""
echo "⏳ Esperando que la aplicación esté lista..."
sleep 5

# Check health
HEALTH_CHECK=$(curl -s http://localhost:3000/api/health || echo "failed")
if echo "$HEALTH_CHECK" | grep -q "healthy"; then
  echo "✅ Aplicación iniciada correctamente!"
  echo ""
  echo "🌐 Accede a la aplicación:"
  echo "   Landing:   http://localhost:3000"
  echo "   Dashboard: http://localhost:3000/dashboard"
  echo "   Login:     http://localhost:3000/login"
  echo ""
  echo "📊 Comandos útiles:"
  echo "   Ver logs:       docker-compose logs -f app"
  echo "   Detener:        docker-compose down"
  echo "   Reiniciar:      docker-compose restart app"
  echo "   Estado:         docker-compose ps"
  echo "   Entrar al shell: docker-compose exec app sh"
  echo ""
  echo "🔥 Hot-reload activado - los cambios se reflejan automáticamente"
else
  echo "⚠️  La aplicación está iniciando..."
  echo "Verifica los logs: docker-compose logs -f app"
  echo ""
fi

echo ""
echo "💡 Presiona Ctrl+C para salir (el contenedor seguirá corriendo)"
echo "   Para detener: docker-compose down"
echo ""

# Optional: Follow logs
read -p "¿Ver logs en tiempo real? (s/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Ss]$ ]]; then
  docker-compose logs -f app
fi
