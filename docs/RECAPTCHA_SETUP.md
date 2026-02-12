# reCAPTCHA Setup Guide

Esta guía te ayudará a configurar Google reCAPTCHA v3 + v2 para el sistema de login.

## Paso 1: Obtener Keys de Google

### 1.1 Acceder a Google reCAPTCHA Admin Console

1. Ir a: https://www.google.com/recaptcha/admin
2. Iniciar sesión con tu cuenta de Google

### 1.2 Crear Site para reCAPTCHA v3

1. Click en el botón "+" (Create)
2. Completar el formulario:
   - **Label:** Kristhy Medical - v3
   - **reCAPTCHA type:** Score based (v3)
   - **Domains:**
     - `localhost` (para desarrollo)
     - Tu dominio de producción (ej: `kristhy-medical.vercel.app`)
   - **Owners:** Tu email
3. Aceptar términos de servicio
4. Click en "Submit"

5. **Guardar las keys:**
   - **Site Key:** Comienza con `6Le...` (pública)
   - **Secret Key:** Comienza con `6Le...` (privada)

### 1.3 Crear Site para reCAPTCHA v2

1. Click en el botón "+" nuevamente
2. Completar el formulario:
   - **Label:** Kristhy Medical - v2
   - **reCAPTCHA type:** Challenge (v2) → "I'm not a robot" Checkbox
   - **Domains:**
     - `localhost`
     - Tu dominio de producción
   - **Owners:** Tu email
3. Aceptar términos
4. Click en "Submit"

5. **Guardar las keys:**
   - **Site Key:** Diferente a la v3
   - **Secret Key:** Diferente a la v3

## Paso 2: Configurar Variables de Entorno

### 2.1 Desarrollo Local

1. Abrir `.env.local` en la raíz del proyecto
2. Agregar las siguientes variables:

```bash
# reCAPTCHA v3 (invisible)
NEXT_PUBLIC_RECAPTCHA_V3_SITE_KEY="TU_SITE_KEY_V3_AQUI"
RECAPTCHA_V3_SECRET_KEY="TU_SECRET_KEY_V3_AQUI"

# reCAPTCHA v2 (checkbox)
NEXT_PUBLIC_RECAPTCHA_V2_SITE_KEY="TU_SITE_KEY_V2_AQUI"
RECAPTCHA_V2_SECRET_KEY="TU_SECRET_KEY_V2_AQUI"

# Threshold (opcional, default 0.5)
RECAPTCHA_SCORE_THRESHOLD="0.5"
```

3. Guardar el archivo

### 2.2 Producción (Vercel)

1. Ir a Vercel Dashboard
2. Seleccionar tu proyecto
3. Ir a Settings → Environment Variables
4. Agregar las 5 variables una por una:

| Variable | Value | Environment |
|----------|-------|-------------|
| `NEXT_PUBLIC_RECAPTCHA_V3_SITE_KEY` | Tu site key v3 | Production, Preview, Development |
| `RECAPTCHA_V3_SECRET_KEY` | Tu secret key v3 | Production, Preview |
| `NEXT_PUBLIC_RECAPTCHA_V2_SITE_KEY` | Tu site key v2 | Production, Preview, Development |
| `RECAPTCHA_V2_SECRET_KEY` | Tu secret key v2 | Production, Preview |
| `RECAPTCHA_SCORE_THRESHOLD` | `0.5` | Production, Preview (opcional) |

5. Redeploy el proyecto

## Paso 3: Verificar Instalación

### 3.1 Iniciar el proyecto

```bash
pnpm dev
```

### 3.2 Probar el login

1. Abrir http://localhost:3000/login
2. Abrir DevTools (F12) → Console
3. Llenar email y password
4. Click en "Iniciar sesión"

### 3.3 Verificar logs en consola

Deberías ver algo como:

```
reCAPTCHA v3 score: 0.9 (action: login)
```

Si el score es alto (>0.5), el login procederá normalmente sin mostrar el checkbox.

### 3.4 Probar fallback a v2

Para forzar el fallback y verificar que v2 funciona:

1. Cambiar temporalmente el threshold a 0.9 en `.env.local`:
   ```bash
   RECAPTCHA_SCORE_THRESHOLD="0.9"
   ```
2. Reiniciar el servidor (`pnpm dev`)
3. Intentar login nuevamente
4. Deberías ver el checkbox "No soy un robot" aparecer
5. Completar el checkbox y verificar que el login funcione

6. **Importante:** Volver el threshold a 0.5 después de la prueba

## Paso 4: Monitoreo

### Logs de Consola (Server-side)

Los siguientes eventos se registran automáticamente:

- **Score alto:** `reCAPTCHA v3 score: 0.9 (action: login)`
- **Score bajo:** `reCAPTCHA v3 score bajo: 0.3 (threshold: 0.5, action: login)`
- **Fallback usado:** `reCAPTCHA v2 verificado correctamente (fallback usado)`
- **Error de timeout:** `Google reCAPTCHA timeout después de 5s (versión: v3)`
- **Error de API:** `Error en Google reCAPTCHA API: 500 (versión: v3)`

### Verificar en Google Admin Console

1. Ir a https://www.google.com/recaptcha/admin
2. Seleccionar tu site (v3 o v2)
3. Ver estadísticas de uso

## Troubleshooting

### Error: "Sistema de seguridad no disponible"

**Causa:** Las variables de entorno no están configuradas o el script de Google no cargó.

**Solución:**
1. Verificar que todas las env vars estén en `.env.local`
2. Reiniciar el servidor de desarrollo
3. Limpiar caché del navegador
4. Verificar en DevTools → Network que el script de Google se carga

### El checkbox v2 aparece siempre

**Causa:** El score v3 es consistentemente bajo.

**Posibles razones:**
- Usando VPN o proxy
- Navegador en modo incógnito
- Dominio no registrado en Google Admin
- Usando bloqueador de ads/scripts

**Solución:**
1. Desactivar VPN/proxy
2. Probar en navegador normal (no incógnito)
3. Verificar que el dominio esté en la lista de Google Admin
4. Desactivar bloqueadores temporalmente

### Error: "Verificación de seguridad fallida"

**Causas posibles:**

1. **Secret key incorrecta**
   - Verificar que la secret key en `.env.local` coincida con Google Admin
   - Verificar que no haya espacios extras al copiar/pegar

2. **Hostname no permitido**
   - Verificar que `localhost` o tu dominio esté en la lista de Google Admin
   - Agregar el dominio si falta

3. **Token expirado**
   - Los tokens expiran después de ~2 minutos
   - El usuario debe reintentar

4. **Mixed keys (v3 con v2)**
   - Verificar que estés usando el par correcto de keys (v3 site key con v3 secret key)

### No funciona en producción

**Checklist:**

1. ✅ Variables de entorno configuradas en Vercel
2. ✅ Dominio de producción agregado en Google Admin (ambos sites v3 y v2)
3. ✅ Proyecto redeployado después de agregar env vars
4. ✅ Site keys correctas (las que comienzan con `NEXT_PUBLIC_`)

## Seguridad

### ⚠️ NUNCA Commitear Secret Keys

- Las secret keys SOLO deben estar en `.env.local` (que está en `.gitignore`)
- En producción, solo en Vercel Environment Variables
- Nunca en el código ni en `.env.example`

### Rotar Keys si se exponen

Si accidentalmente commiteaste una secret key:

1. Ir a Google reCAPTCHA Admin Console
2. Regenerar la secret key del site afectado
3. Actualizar `.env.local` y Vercel con la nueva key
4. Revertir el commit que expuso la key

## Configuración Avanzada

### Ajustar el Threshold

El threshold determina qué tan estricta es la verificación v3:

- **0.3:** Muy permisivo (más bots pueden pasar)
- **0.5:** Balanceado (recomendado) ✅
- **0.7:** Estricto (más usuarios legítimos verán v2)
- **0.9:** Muy estricto (casi todos verán v2)

Para cambiar:

```bash
# .env.local
RECAPTCHA_SCORE_THRESHOLD="0.7"
```

### Monitorear Scores en Producción

Agregar logging personalizado en `src/server/actions/recaptcha.ts`:

```typescript
// Después de línea 132
console.log(`reCAPTCHA v3 score: ${score} (action: ${result.action})`);

// Agregar envío a servicio de analytics (opcional)
analytics.track('recaptcha_score', {
  score,
  action: result.action,
  timestamp: new Date().toISOString(),
});
```

## Recursos

- [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
- [reCAPTCHA v3 Docs](https://developers.google.com/recaptcha/docs/v3)
- [reCAPTCHA v2 Docs](https://developers.google.com/recaptcha/docs/display)
- [Documentación de Seguridad](./SECURITY.md)

---

**Última actualización:** Febrero 2026
