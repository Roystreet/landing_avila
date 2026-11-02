# Avila System — Identidad de Marca

Valores oficiales de marca del sitio **Avila System** tras el rebrand azul (noviembre 2026).
Fuente de verdad técnica: [app/globals.css](app/globals.css). Contexto de producto: [PRODUCT.md](PRODUCT.md).

---

## 1. Identidad

| Campo             | Valor                                         |
| ----------------- | --------------------------------------------- |
| **Nombre**        | Avila System                                  |
| **Tagline**       | Consultoría y desarrollo de software          |
| **Email oficial** | `soluciones@avilasystem.com`                  |
| **Dominio**       | `avilasystem.com`                             |
| **Enfoque**       | Planos claros alternados con bandas azul noche |

---

## 2. Paleta

| Rol                | Token CSS            | HEX       | Uso                                                |
| ------------------ | -------------------- | --------- | -------------------------------------------------- |
| Azul noche         | `--night`            | `#0B0F1A` | Header, hero, bandas de proceso y cierre, footer   |
| Azul señal         | `--primary`          | `#2563EB` | CTAs, enlaces, estados activos                     |
| Azul destacado     | `--accent` (en `.dark`) | `#4F8CFF` | Palabra destacada de titulares sobre azul noche |
| Pizarra            | `--slate`            | `#94A3B8` | Texto secundario sobre azul noche, detalles        |
| Fondo claro        | `--background`       | `#F8FAFC` | Fondo de secciones claras                          |
| Superficie         | `--card`             | `#FFFFFF` | Tarjetas                                           |
| Texto secundario   | `--muted-foreground` | `#475569` | Descripciones sobre fondo claro                    |
| Borde              | `--border`           | `#E2E8F0` | Bordes de tarjetas y divisores                     |

**Bandas oscuras:** agregar `className="dark"` a la sección. La clase redefine los tokens dentro de ese bloque, así los componentes shadcn funcionan igual sobre azul noche.

---

## 3. Tipografía

**Montserrat** (400, 500, 600, 700) vía `next/font/google`, variable `--font-montserrat`.
Titulares en 700 con tracking −0.025em; cuerpo en 400.

---

## 4. Sistema de diseño

- Radio base: `--radius: 0.875rem` (14px). Bandas oscuras con 20px.
- Botones principales: píldora azul con flecha (`ArrowRight`).
- Una sola elevación por tarjeta: borde suave + sombra azul tenue solo en hover.
- Elemento propio: la cresta del Ávila ([components/brand/ridge.tsx](components/brand/ridge.tsx)) en hero, encabezados, proceso, cierre y 404. Único degradado permitido: el cielo nocturno vertical. Nada de gradientes de texto, blobs ni glass.
- Sin etiquetas "eyebrow" sobre los títulos.

---

## 5. Recursos

- Logo oficial: [public/brand/](public/brand/) y [components/brand/logo.tsx](components/brand/logo.tsx) (`Logo`, `LogoMark`, `LogoStacked`).
- Favicons: [app/icon.svg](app/icon.svg), `app/apple-icon.png`, `app/favicon.ico`.
- WhatsApp: logo oficial en [components/brand/whatsapp-icon.tsx](components/brand/whatsapp-icon.tsx), verde `#25D366` solo para ese glifo.
- Fotos de proyectos: [public/projects/CREDITOS.md](public/projects/CREDITOS.md) (Unsplash, imágenes de referencia).
- Sistema completo documentado en [DESIGN.md](DESIGN.md).
