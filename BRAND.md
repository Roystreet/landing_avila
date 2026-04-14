# Avila System — Identidad de Marca

Documento de referencia con los valores oficiales de marca e identidad visual del landing de **Avila System**.
Fuente de verdad técnica para los colores: [app/globals.css](app/globals.css).

---

## 1. Identidad

| Campo             | Valor                                                 |
| ----------------- | ----------------------------------------------------- |
| **Nombre**        | Avila System                                          |
| **Tagline**       | Consultora de Desarrollo de Software                  |
| **Email oficial** | `soluciones@avilasystem.com`                          |
| **Dominio**       | `avilasystem.com`                                     |
| **Enfoque**       | Dark-first (fondo negro + acentos dorados)            |

---

## 2. Paleta de colores

Paleta derivada de la referencia visual (planes sobre fondo negro con acentos dorados).
Los valores se definen en OKLCH en [app/globals.css](app/globals.css) y los equivalentes HEX se listan aquí para diseño y comunicación.

### Colores base

| Rol                 | Token CSS              | HEX       | OKLCH                       | Uso                                          |
| ------------------- | ---------------------- | --------- | --------------------------- | -------------------------------------------- |
| Background          | `--background`         | `#0A0A0A` | `oklch(0.145 0 0)`          | Fondo principal de la página                 |
| Card / surface      | `--card`               | `#171717` | `oklch(0.205 0 0)`          | Tarjetas, secciones elevadas, popovers       |
| Card cálida         | *(referencia visual)*  | `#1F1810` | —                           | Card destacada con tinte cálido (Profesional) |
| Foreground          | `--foreground`         | `#FFFFFF` | `oklch(1 0 0)`              | Texto principal                              |
| Muted foreground    | `--muted-foreground`   | `#A1A1A1` | `oklch(0.7 0 0)`            | Texto secundario, descripciones              |
| Border              | `--border`             | `#262626` | `oklch(0.27 0 0)`           | Bordes, divisores, inputs                    |

### Acentos de marca

| Rol                   | Token CSS              | HEX       | OKLCH                       | Uso                                    |
| --------------------- | ---------------------- | --------- | --------------------------- | -------------------------------------- |
| Primary (dorado)      | `--primary`            | `#E0A419` | `oklch(0.75 0.15 75)`       | CTAs, botones principales, logo        |
| Primary hover         | *(variación)*          | `#F5B930` | —                           | Hover del dorado                       |
| Primary foreground    | `--primary-foreground` | `#0A0A0A` | `oklch(0.145 0 0)`          | Texto sobre fondo dorado               |
| Secondary (naranja)   | `--secondary`          | `#D97706` | `oklch(0.65 0.18 45)`       | Acentos secundarios, énfasis           |
| Accent (oro claro)    | `--accent`             | `#F5A623` | `oklch(0.78 0.15 65)`       | Realce, highlights, badges             |
| Ring                  | `--ring`               | `#E0A419` (50%) | `oklch(0.75 0.15 75 / 0.5)` | Focus ring de accesibilidad     |

### Estados

| Rol           | Token CSS       | HEX       | OKLCH                  | Uso                          |
| ------------- | --------------- | --------- | ---------------------- | ---------------------------- |
| Destructive   | `--destructive` | `#991B1B` | `oklch(0.45 0.18 27)`  | Errores, badges de oferta    |

### Gráficas / Charts

| Token         | HEX aproximado | Uso                      |
| ------------- | -------------- | ------------------------ |
| `--chart-1`   | `#E0A419`      | Serie principal (dorado) |
| `--chart-2`   | `#D97706`      | Serie secundaria (naranja) |
| `--chart-3`   | `#F5A623`      | Oro claro                |
| `--chart-4`   | `#991B1B`      | Rojo profundo            |
| `--chart-5`   | Oro pálido     | Variante suave           |

---

## 3. Tipografía

| Rol      | Fuente       | Variable CSS       |
| -------- | ------------ | ------------------ |
| Sans     | Geist Sans   | `--font-geist-sans` |
| Mono     | Geist Mono   | `--font-geist-mono` |

Cargadas vía `geist/font/sans` y `geist/font/mono` en [app/layout.tsx](app/layout.tsx).

---

## 4. Sistema de diseño

- **Radio base**: `--radius: 0.5rem` (8px)
  - `--radius-sm`: `calc(var(--radius) - 4px)` → 4px
  - `--radius-md`: `calc(var(--radius) - 2px)` → 6px
  - `--radius-lg`: `var(--radius)` → 8px
  - `--radius-xl`: `calc(var(--radius) + 4px)` → 12px
- **Framework CSS**: Tailwind CSS v4 con `@theme inline` + variables CSS (OKLCH).
- **Modo**: Dark-first. La paleta en `:root` es idéntica a la del bloque `.dark` para mantener coherencia independiente del `ThemeProvider`.

---

## 5. Notas de uso

- Toda pieza de comunicación que requiera valores de color debe citar el **HEX** de este documento para diseño, y el **token CSS** para implementación.
- Si un valor OKLCH de [app/globals.css](app/globals.css) cambia, **este archivo debe actualizarse en consecuencia**.
- Para texto sobre fondo dorado (`--primary`), usar siempre `--primary-foreground` (`#0A0A0A`) para mantener el contraste WCAG.
