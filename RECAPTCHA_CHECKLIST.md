# reCAPTCHA Implementation Checklist

Usa este checklist para verificar que la implementación de reCAPTCHA esté completa y funcionando correctamente.

## ✅ Fase 1: Instalación y Configuración

### Dependencias

- [ ] `react-google-recaptcha-v3` instalado
- [ ] `react-google-recaptcha` instalado
- [ ] `@types/react-google-recaptcha` instalado (dev)
- [ ] Verificar en `package.json` que las versiones sean correctas

### Variables de Entorno

- [ ] Obtener Site Key v3 de Google reCAPTCHA Admin Console
- [ ] Obtener Secret Key v3 de Google reCAPTCHA Admin Console
- [ ] Obtener Site Key v2 de Google reCAPTCHA Admin Console
- [ ] Obtener Secret Key v2 de Google reCAPTCHA Admin Console
- [ ] Agregar `NEXT_PUBLIC_RECAPTCHA_V3_SITE_KEY` en `.env.local`
- [ ] Agregar `RECAPTCHA_V3_SECRET_KEY` en `.env.local`
- [ ] Agregar `NEXT_PUBLIC_RECAPTCHA_V2_SITE_KEY` en `.env.local`
- [ ] Agregar `RECAPTCHA_V2_SECRET_KEY` en `.env.local`
- [ ] Agregar `RECAPTCHA_SCORE_THRESHOLD="0.5"` en `.env.local` (opcional)

### Google reCAPTCHA Admin Console

- [ ] Crear site v3 en Google Admin Console
- [ ] Agregar `localhost` a dominios permitidos (v3)
- [ ] Agregar dominio de producción a dominios permitidos (v3)
- [ ] Crear site v2 en Google Admin Console
- [ ] Agregar `localhost` a dominios permitidos (v2)
- [ ] Agregar dominio de producción a dominios permitidos (v2)

---

## ✅ Fase 2: Archivos Creados

### Server Actions

- [ ] Existe `src/server/actions/recaptcha.ts`
- [ ] Función `verifyRecaptcha()` exportada
- [ ] Timeout configurado (5 segundos)
- [ ] Validación de hostname implementada
- [ ] Logs de consola implementados

- [ ] Existe `src/server/actions/auth.ts`
- [ ] Función `verifyLoginCaptcha()` exportada
- [ ] Rate limiting configurado (5/15min)
- [ ] Validación Zod implementada
- [ ] Manejo de fallback a v2 implementado

### TypeScript

- [ ] Existe `src/env.d.ts`
- [ ] Tipos de reCAPTCHA declarados
- [ ] Autocomplete funciona para env vars

---

## ✅ Fase 3: Archivos Modificados

### Frontend

- [ ] `src/app/layout.tsx` tiene `GoogleReCaptchaProvider`
- [ ] Provider configurado con site key v3
- [ ] Script se carga con `async: true, defer: true`

- [ ] `src/components/auth/LoginForm.tsx` importa `useGoogleReCaptcha`
- [ ] Hook `useGoogleReCaptcha()` llamado
- [ ] Dynamic import de `ReCAPTCHA` (v2) implementado
- [ ] Estados `showV2Fallback` y `recaptchaV2Token` agregados
- [ ] `handleSubmit()` modificado con flujo de verificación
- [ ] Componente v2 renderizado condicionalmente
- [ ] Disclaimer de privacidad agregado

### Configuración

- [ ] `.env.example` actualizado con variables de reCAPTCHA
- [ ] `CLAUDE.md` actualizado con sección de reCAPTCHA
- [ ] Changelog actualizado con v2.2.3

---

## ✅ Fase 4: Documentación

- [ ] Existe `docs/SECURITY.md`
- [ ] Arquitectura de reCAPTCHA documentada
- [ ] Flujo de autenticación explicado
- [ ] Troubleshooting incluido

- [ ] Existe `docs/RECAPTCHA_SETUP.md`
- [ ] Guía paso a paso completa
- [ ] Instrucciones para desarrollo y producción
- [ ] Casos de prueba documentados

- [ ] Existe `IMPLEMENTATION_SUMMARY.md`
- [ ] Resumen de cambios completo
- [ ] Próximos pasos claros

---

## ✅ Fase 5: Compilación

### TypeScript

- [ ] Ejecutar `npx tsc --noEmit --skipLibCheck`
- [ ] No hay errores en `src/server/actions/recaptcha.ts`
- [ ] No hay errores en `src/server/actions/auth.ts`
- [ ] No hay errores en `src/components/auth/LoginForm.tsx`
- [ ] No hay errores en `src/app/layout.tsx`

### Build (si tienes DB configurada)

- [ ] Ejecutar `pnpm build`
- [ ] Build exitoso sin errores de compilación

---

## ✅ Fase 6: Testing en Desarrollo

### Configuración Inicial

- [ ] Servidor de desarrollo corriendo (`pnpm dev`)
- [ ] No hay errores en consola del servidor
- [ ] No hay errores en DevTools del navegador

### Caso 1: Login Normal (Score Alto)

- [ ] Ir a http://localhost:3000/login
- [ ] Abrir DevTools → Console
- [ ] Abrir DevTools → Network tab
- [ ] Llenar email y password válidos
- [ ] Click en "Iniciar sesión"
- [ ] Verificar request a `https://www.google.com/recaptcha/api.js`
- [ ] Verificar log en servidor: `reCAPTCHA v3 score: 0.X (action: login)`
- [ ] Score debe ser ≥ 0.5
- [ ] No aparece checkbox v2
- [ ] Login exitoso → redirect a `/dashboard`

### Caso 2: Fallback a v2 (Score Bajo)

- [ ] Cambiar threshold a 0.9 en `.env.local`
- [ ] Reiniciar servidor (`pnpm dev`)
- [ ] Intentar login
- [ ] Verificar log en servidor: `reCAPTCHA v3 score bajo: 0.X`
- [ ] Checkbox v2 aparece
- [ ] Completar checkbox "No soy un robot"
- [ ] Reenviar formulario
- [ ] Verificar log: `reCAPTCHA v2 verificado correctamente (fallback usado)`
- [ ] Login exitoso
- [ ] **Importante:** Volver threshold a 0.5

### Caso 3: Credenciales Inválidas

- [ ] Intentar login con email/password incorrectos
- [ ] reCAPTCHA verifica OK (score alto)
- [ ] Better Auth rechaza credenciales
- [ ] Mensaje de error: "Credenciales inválidas"
- [ ] No hay redirect

### Caso 4: Rate Limiting

- [ ] Intentar login 6 veces en <15 minutos
- [ ] Mensaje de error: "Demasiados intentos. Por favor, espera unos minutos."
- [ ] Login bloqueado
- [ ] Esperar 15 minutos o reiniciar servidor para limpiar store

### Caso 5: Keys Inválidas

- [ ] Cambiar temporalmente una secret key a valor inválido
- [ ] Intentar login
- [ ] Verificar error: "Verificación de seguridad fallida"
- [ ] Verificar log de error en servidor
- [ ] **Importante:** Restaurar key correcta

---

## ✅ Fase 7: Testing en Producción

### Configuración Vercel

- [ ] Variables de entorno configuradas en Vercel Dashboard
- [ ] `NEXT_PUBLIC_RECAPTCHA_V3_SITE_KEY` agregada
- [ ] `RECAPTCHA_V3_SECRET_KEY` agregada
- [ ] `NEXT_PUBLIC_RECAPTCHA_V2_SITE_KEY` agregada
- [ ] `RECAPTCHA_V2_SECRET_KEY` agregada
- [ ] `RECAPTCHA_SCORE_THRESHOLD` agregada (opcional)
- [ ] Todas configuradas para Production + Preview
- [ ] Proyecto redeployado después de agregar env vars

### Google Admin Console

- [ ] Dominio de producción agregado en site v3
- [ ] Dominio de producción agregado en site v2
- [ ] Sin subdominios extra o wildcards innecesarios

### Pruebas en Producción

- [ ] Ir a URL de producción `/login`
- [ ] Login normal funciona (score alto)
- [ ] Fallback a v2 funciona (si se fuerza con threshold alto)
- [ ] Rate limiting funciona
- [ ] No hay errores en Vercel Function Logs
- [ ] reCAPTCHA funciona desde diferentes dispositivos:
  - [ ] Desktop Chrome
  - [ ] Desktop Firefox
  - [ ] Mobile Safari
  - [ ] Mobile Chrome

---

## ✅ Fase 8: Monitoreo

### Logs de Servidor

- [ ] Scores de v3 se logean correctamente
- [ ] Scores bajos se advierten con warning
- [ ] Uso de v2 fallback se registra
- [ ] Errores de Google API se capturan

### Google Admin Console

- [ ] Ver estadísticas de uso en site v3
- [ ] Ver estadísticas de uso en site v2
- [ ] Verificar que los requests coincidan con el tráfico esperado

---

## ✅ Fase 9: Seguridad

### Variables de Entorno

- [ ] Secret keys SOLO en `.env.local` (nunca commiteadas)
- [ ] `.env.local` está en `.gitignore`
- [ ] `.env.example` NO contiene valores reales
- [ ] Vercel env vars configuradas solo para Production/Preview (no Development si no es necesario)

### Validaciones

- [ ] Hostname validation implementada
- [ ] Timeout en requests a Google API
- [ ] Rate limiting activo
- [ ] Error handling robusto
- [ ] No hay logs de información sensible

---

## ✅ Fase 10: Documentación Final

### Commits

- [ ] Commits claros y descriptivos
- [ ] No hay secret keys en historial de git
- [ ] README actualizado si es necesario

### Team Handoff

- [ ] Compartir `docs/RECAPTCHA_SETUP.md` con equipo
- [ ] Documentar procedimiento para obtener keys
- [ ] Documentar threshold recomendado (0.5)
- [ ] Documentar cómo monitorear scores

---

## 🎉 Implementación Completa

Si todos los checkboxes están marcados, la implementación de reCAPTCHA está completa y lista para producción.

### Próximos Pasos Opcionales

- [ ] Configurar dashboard de métricas para monitorear scores
- [ ] Implementar alertas si score promedio baja de threshold
- [ ] Agregar reCAPTCHA a otros formularios públicos (contacto, etc.)
- [ ] Migrar a Upstash Redis para rate limiting en producción multi-instancia
- [ ] Implementar audit logging para eventos de reCAPTCHA

---

**Última actualización:** Febrero 2026
