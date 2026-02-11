# Diseño: Integración de WhatsApp en Formulario de Contacto

**Fecha:** 2026-02-10
**Estado:** ✅ Implementado
**Versión:** v2.2.2

---

## Contexto

El formulario de contacto original enviaba datos a `/api/v1/contact` pero solo registraba en console.log (no enviaba emails). Después de conversación con la Dra. Kristhy, se decidió integrar directamente con WhatsApp, ya que:

1. Ya existe botón flotante de WhatsApp en la landing
2. La doctora usa WhatsApp como canal principal de comunicación
3. No depende de servicios externos de email (Resend)
4. No expone la base de datos a requests públicos
5. Es el canal preferido en Venezuela/Latinoamérica

---

## Decisión de Diseño: Opción A (Cliente Directo)

### Arquitectura Seleccionada

**Flujo:**
```
Usuario → Formulario → Validación → Genera link WhatsApp → Abre wa.me → Resetea form
```

**Ventajas:**
- ✅ Sin backend necesario (todo del lado del cliente)
- ✅ Cero costo computacional
- ✅ Máxima privacidad (datos no pasan por el servidor)
- ✅ Usuario controla qué envía
- ✅ No requiere rate limiting (WhatsApp tiene el suyo)

**Desventajas aceptadas:**
- ⚠️ Usuario debe tener WhatsApp instalado
- ⚠️ Puede no enviar si el usuario cancela
- ⚠️ No hay registro de quién completó el formulario

---

## Formato del Mensaje

Basado en el mensaje estándar que la Dra. Kristhy ya usa:

```
Buen día Dra. Kristhy, estoy interesada en agendar una cita.

📋 Mis datos de contacto:
• Nombre: [nombre]
• Email: [email]
• Teléfono: [teléfono]
• Motivo de consulta: [razón]

💬 Información adicional:
[mensaje del formulario]

Muchas gracias!
```

### Mapeo de Razones

```typescript
{
  prenatal: "Control prenatal",
  highRisk: "Embarazo de alto riesgo",
  gynecology: "Consulta ginecológica",
  surgery: "Cirugía",
  ultrasound: "Ecografía",
  cervical: "Citología cervical",
  other: "Otra consulta"
}
```

---

## Implementación Técnica

### 1. Utilidad WhatsApp (`src/lib/utils/whatsapp.ts`)

**Funciones principales:**
- `normalizePhoneNumber(phone)` - Normaliza número a formato WhatsApp (solo dígitos)
- `getWhatsAppPhone()` - Lee de `NEXT_PUBLIC_WHATSAPP_PHONE` env var
- `formatWhatsAppMessage(data)` - Formatea datos del formulario
- `generateWhatsAppLink(data)` - Genera URL de `wa.me`
- `openWhatsApp(url)` - Abre en nueva pestaña con `noopener,noreferrer`

**Mejores prácticas aplicadas:**
- Type safety con TypeScript
- Funciones puras (testables)
- Validación de longitud máxima (4096 chars)
- URL encoding correcto con `encodeURIComponent`
- Documentación JSDoc completa
- Configuración desde environment variables

### 2. ContactForm (`src/components/shared/ContactForm.tsx`)

**Cambios:**
- Importa `generateWhatsAppLink` y `openWhatsApp`
- `onSubmit` genera link y abre WhatsApp (elimina llamada a API)
- Botón cambiado a "Enviar por WhatsApp" con ícono de WhatsApp
- Color verde WhatsApp (`bg-[#25D366]`)
- Toast actualizado con mensaje de redirección

### 3. WhatsAppButton (`src/components/layout/WhatsAppButton.tsx`)

**Actualizado para consistencia:**
- Usa `normalizePhoneNumber` de la utilidad
- Lee de `NEXT_PUBLIC_WHATSAPP_PHONE` env var
- Usa mensaje estándar: "Buen día, estoy interesada en agendar una cita, muchas gracias!"

### 4. Variables de Entorno

**Nueva variable en `.env.example`:**
```bash
NEXT_PUBLIC_WHATSAPP_PHONE="+58 412-073-5223"
```

Formato flexible: acepta +, espacios, guiones (se normaliza automáticamente)

### 5. Traducciones

**Español (`es.json`):**
- `form.submit_whatsapp`: "Enviar por WhatsApp"
- `toast.whatsapp_opened`: "Te redirigimos a WhatsApp para enviar tu mensaje."

**Inglés (`en.json`):**
- `form.submit_whatsapp`: "Send via WhatsApp"
- `toast.whatsapp_opened`: "We're redirecting you to WhatsApp to send your message."

---

## Backward Compatibility

### Endpoint API Deprecated

**`POST /api/v1/contact`:**
- Marcado como `@deprecated` en JSDoc
- Headers de deprecación:
  - `X-Deprecated: true`
  - `X-Deprecation-Message: "This endpoint is deprecated. Use WhatsApp integration instead."`
- Funcionalidad mantenida para compatibilidad
- Documentado en `docs/API.md`

---

## Seguridad

### Mejoras de Seguridad

✅ **Sin exposición de base de datos** - Los datos no tocan el servidor
✅ **Sin rate limiting necesario** - WhatsApp tiene sus propios límites
✅ **window.open seguro** - Usa `noopener,noreferrer`
✅ **Validación del lado del cliente** - Zod schema antes de enviar
✅ **URL encoding** - Previene inyección en URL

### Consideraciones

- ⚠️ El número de WhatsApp es público (ya estaba en el botón flotante)
- ⚠️ No hay logging de contactos (decisión de diseño por privacidad)

---

## UX/UI

### Experiencia del Usuario

1. Usuario completa formulario (igual que antes)
2. Click en "Enviar por WhatsApp" (botón verde con ícono)
3. Se abre WhatsApp en nueva pestaña con mensaje pre-llenado
4. Usuario ve el mensaje completo antes de enviar
5. Usuario decide si envía o no
6. Formulario se resetea (mensaje y privacy checkbox limpios)

### Feedback Visual

- ✅ Botón verde WhatsApp (`#25D366`)
- ✅ Ícono de WhatsApp (MessageCircle)
- ✅ Toast de éxito: "¡Perfecto! Te redirigimos a WhatsApp..."
- ✅ Toast de error si falla generación del link

---

## Testing

### Casos de Prueba

**Funcionales:**
- [ ] Formulario válido genera link correcto
- [ ] Emojis se encodean correctamente
- [ ] Acentos y caracteres especiales funcionan
- [ ] Mensaje largo (>1000 chars) funciona
- [ ] Normalización de número de teléfono

**Edge Cases:**
- [ ] `NEXT_PUBLIC_WHATSAPP_PHONE` no definido → error claro
- [ ] Mensaje excede 4096 chars → error de validación
- [ ] Popup blocker activo → manejo graceful

**Dispositivos:**
- [ ] Desktop → abre WhatsApp Web
- [ ] Mobile → abre app de WhatsApp
- [ ] iOS Safari → funciona correctamente
- [ ] Android Chrome → funciona correctamente

---

## Métricas de Éxito

No hay métricas automatizadas (por diseño). Éxito medido por:
- Feedback de la Dra. Kristhy sobre cantidad de mensajes recibidos
- Usuarios reportan facilidad de uso
- Reducción de tickets de "no recibí respuesta"

---

## Futuras Mejorías (Opcionales)

### Posibles Extensiones

1. **Analytics básico (sin datos personales):**
   - Contar clicks en botón (sin guardar datos del formulario)
   - Usar localStorage para evitar spam

2. **Prefill automático con query params:**
   - Ej: `/contacto?reason=prenatal` → pre-selecciona razón

3. **WhatsApp Business API (si escala):**
   - Envío automático de mensajes
   - Templates aprobados por Meta
   - Costo: ~$0.005-0.09 por mensaje

4. **Botón "Vista previa del mensaje":**
   - Mostrar modal con mensaje formateado antes de enviar

---

## Referencias

- WhatsApp URL Scheme: https://faq.whatsapp.com/5913398998672934
- URL Encoding: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
- window.open security: https://developer.mozilla.org/en-US/docs/Web/API/Window/open#noopener

---

## Changelog

**v2.2.2 (2026-02-10):**
- ✅ Implementación completa de integración WhatsApp
- ✅ Utilidad `whatsapp.ts` con funciones puras
- ✅ ContactForm actualizado
- ✅ WhatsAppButton refactorizado para usar env vars
- ✅ Endpoint API marcado como deprecated
- ✅ Documentación actualizada
- ✅ Traducciones ES/EN
