# Sistema de Gestión Médica - Landing

Landing page para la Dra. Kristhy (Obstetricia y Ginecología) con Next.js 16, App Router, Tailwind v4, shadcn/ui y next-intl (es/en).

## Ejecutar
```bash
pnpm install
pnpm dev
```
> Si necesitas usar npm: `npm install && npm run dev` (pero el lockfile oficial es `pnpm-lock.yaml`).

## Estructura clave
- `src/app/[locale]/*`: páginas por idioma + layout con header/footer.
- `src/components/sections/*`: Hero, Servicios, Sobre mí, Testimonios, Contacto.
- `src/components/shared/ContactForm.tsx`: formulario con Zod + RHF.
- `src/app/api/contact/route.ts`: endpoint para envíos (stub).
- Branding: logo en `public/images/logo.png` y usado en el header.
- `src/messages/*.json`: textos es/en.

## Pendiente por realizar (Fase 1)
- Sustituir imágenes y biografía por contenido real.
- Conectar `/api/contact` a un proveedor de email (Resend/SendGrid) y manejar errores/recaptcha.
- Añadir política de privacidad y enlazar desde el formulario.
- Configurar analytics (GA4/umami) y, si aplica, dominio personalizado.
- Ajustar mapas/dirección/teléfono reales y validarlos.

## Notas
- Paleta médica: primario celeste, secundario menta, acento rosa suave; tipografía Manrope.
- La página es responsive (mobile-first) e incluye selector de idioma.
