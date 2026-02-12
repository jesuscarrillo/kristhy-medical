# Seguridad - Kristhy Medical

## Implementación de reCAPTCHA

### Resumen

El sistema de login utiliza Google reCAPTCHA v3 con fallback automático a v2 para proteger contra ataques automatizados.

### Arquitectura

1. **reCAPTCHA v3 (Invisible)**
   - Se ejecuta en background sin intervención del usuario
   - Genera un score de 0.0 (bot) a 1.0 (humano)
   - Threshold configurado: **0.5** (ajustable)

2. **reCAPTCHA v2 (Checkbox Fallback)**
   - Se activa automáticamente cuando score v3 < threshold
   - Requiere que el usuario complete el desafío "No soy un robot"
   - Solo se carga dinámicamente cuando es necesario

### Flujo de Autenticación

```
1. Usuario carga /login → reCAPTCHA v3 se inicializa
2. Usuario llena email + password
3. Submit → genera token v3 invisible
4. Server verifica token con Google API
5. Si score ≥ 0.5 → continúa con login de Better Auth
6. Si score < 0.5 → muestra checkbox v2
7. Usuario completa v2 → reenvía con token v2
8. Server verifica v2 → continúa con login
```

### Configuración

#### Variables de Entorno

```bash
# reCAPTCHA v3 (invisible)
NEXT_PUBLIC_RECAPTCHA_V3_SITE_KEY="6LeXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
RECAPTCHA_V3_SECRET_KEY="6LeXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"

# reCAPTCHA v2 (checkbox)
NEXT_PUBLIC_RECAPTCHA_V2_SITE_KEY="6LeYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY"
RECAPTCHA_V2_SECRET_KEY="6LeYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY"

# Threshold (opcional, default 0.5)
RECAPTCHA_SCORE_THRESHOLD="0.5"
```

#### Obtener Keys de Google

1. Ir a [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Crear **2 sites separados**:
   - **Site 1:** reCAPTCHA v3
   - **Site 2:** reCAPTCHA v2 Checkbox
3. Agregar dominios permitidos:
   - `localhost` (desarrollo)
   - Tu dominio de producción (ej: `kristhy-medical.vercel.app`)
4. Copiar las keys a `.env.local`

### Rate Limiting

El login tiene rate limiting adicional:

- **Límite:** 5 intentos
- **Ventana:** 15 minutos
- **Implementación:** In-memory (producción requiere Redis para multi-instancia)

### Monitoreo

Los siguientes eventos se registran en consola:

- Score v3 y action en cada verificación
- Score bajo (<0.5) con detalles del threshold
- Uso de fallback v2
- Errores de Google API (timeout, HTTP errors)
- Hostname inválidos (advertencias)

### Consideraciones de Seguridad

#### Protección contra Bypass

✅ **Validación server-side obligatoria** - Token siempre verificado en servidor
✅ **Hostname validation** - Previene tokens de otros dominios
✅ **Rate limiting** - Previene intentos masivos incluso con reCAPTCHA
✅ **Secrets server-side** - Secret keys nunca expuestas al cliente

#### Manejo de Errores de Google API

- **Timeout:** 5 segundos → Error al usuario
- **API caída:** Bloquea login (fail-closed)
- **Token expirado:** Usuario debe reintentar

### Performance

- **Bundle size:** ~5KB gzipped (react-google-recaptcha-v3 + v2)
- **Script loading:** Async/defer (no bloquea render inicial)
- **v2 lazy loading:** Solo se carga cuando sea necesario
- **Impact en TTI:** Mínimo (<100ms)

### Privacidad

Google reCAPTCHA recopila:
- Movimientos del mouse
- Interacciones con teclado
- Cookies de Google
- IP address

**Nota:** Para este proyecto (usuario único) el impacto de privacidad es mínimo. Si es una preocupación, considerar alternativas como Cloudflare Turnstile.

### Costos

- **Google reCAPTCHA:** Gratis hasta 1M assessments/mes
- **Proyección:** ~60 logins/mes = **$0**

### Troubleshooting

#### Error: "Sistema de seguridad no disponible"

**Causa:** Script de reCAPTCHA no cargó
**Solución:**
- Verificar que `NEXT_PUBLIC_RECAPTCHA_V3_SITE_KEY` esté configurada
- Revisar bloqueadores de ads/scripts
- Ver consola del navegador para errores de red

#### Error: "Servicio temporalmente no disponible"

**Causa:** Google API no responde en 5s
**Solución:** Reintentar después de unos minutos

#### Checkbox v2 aparece siempre

**Causa:** Score v3 consistentemente bajo
**Solución:**
- Revisar si hay VPN/proxy activo
- Verificar que el dominio esté registrado en Google Admin
- Considerar ajustar `RECAPTCHA_SCORE_THRESHOLD` a 0.4

#### "Verificación de seguridad fallida"

**Causas posibles:**
1. Secret key incorrecta → revisar `.env.local`
2. Token expirado → usuario tardó >2 minutos
3. Hostname no permitido → agregar dominio en Google Admin

### Mejoras Futuras

1. **Dashboard de métricas:**
   - Gráfico de scores en el tiempo
   - Cantidad de fallbacks a v2
   - Top IPs con scores bajos

2. **Configuración dinámica:**
   - UI para ajustar threshold sin redeployar
   - Stored en base de datos

3. **Múltiples actions:**
   - `login` - login form
   - `password_reset` - si se implementa
   - `contact_form` - formulario de contacto público

### Referencias

- [Google reCAPTCHA v3 Docs](https://developers.google.com/recaptcha/docs/v3)
- [reCAPTCHA v2 Docs](https://developers.google.com/recaptcha/docs/display)
- [react-google-recaptcha-v3](https://github.com/t49tran/react-google-recaptcha-v3)
- [react-google-recaptcha](https://github.com/dozoisch/react-google-recaptcha)

---

## Otras Medidas de Seguridad

### Encriptación

- **Algoritmo:** AES-256-GCM
- **Campos encriptados:** cedula, phone, email, address, emergencyContact, allergies, personalHistory, gynecologicHistory
- **Key management:** Variable de entorno `ENCRYPTION_KEY` (64 chars hex)

### Row Level Security (RLS)

- Políticas en todas las tablas de Supabase
- Solo acceso vía service role key
- Sin acceso directo desde cliente

### Content Security Policy (CSP)

```
default-src 'self';
script-src 'self' 'unsafe-inline' https://www.google.com https://www.gstatic.com;
style-src 'self' 'unsafe-inline';
img-src 'self' data: blob: https://*.supabase.co https://images.unsplash.com;
font-src 'self' data:;
connect-src 'self' https://*.supabase.co wss://*.supabase.co https://www.google.com;
frame-src 'self' https://www.google.com https://recaptcha.google.com;
frame-ancestors 'none';
base-uri 'self';
form-action 'self';
```

**Dominios de reCAPTCHA permitidos:**
- `https://www.google.com` - Script API y verificación
- `https://www.gstatic.com` - Assets estáticos de reCAPTCHA
- `https://recaptcha.google.com` - iframes de reCAPTCHA v2

### Middleware de Autenticación

- Protección de rutas `/dashboard/*`
- Verificación de sesión via cookie
- Redirect a `/login` si no autenticado

---

Última actualización: Febrero 2026
