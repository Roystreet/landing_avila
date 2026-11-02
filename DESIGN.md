---
name: Avila System
description: Consultoría y desarrollo de software; la cresta del Ávila de noche sobre planos claros.
colors:
  signal-blue: "oklch(0.546 0.215 263)"
  signal-blue-deep: "oklch(0.49 0.21 263)"
  summit-blue: "oklch(0.68 0.17 258)"
  summit-light: "oklch(0.92 0.06 240)"
  night: "oklch(0.17 0.025 265)"
  night-sky-deep: "oklch(0.15 0.022 265)"
  night-horizon: "oklch(0.24 0.05 262)"
  ridge-shadow: "oklch(0.12 0.02 265)"
  night-raised: "oklch(0.215 0.03 265)"
  night-bubble: "oklch(0.27 0.04 264)"
  night-line: "oklch(0.3 0.035 265)"
  trail-dashed: "oklch(0.36 0.04 262)"
  ridge-outline: "oklch(0.45 0.03 260)"
  night-mist: "oklch(0.78 0.03 257)"
  snow: "oklch(0.985 0.003 248)"
  cold-paper: "oklch(0.984 0.003 248)"
  surface-white: "oklch(1 0 0)"
  frost: "oklch(0.955 0.01 255)"
  hairline: "oklch(0.929 0.013 255)"
  slate: "oklch(0.711 0.035 257)"
  ink-slate: "oklch(0.446 0.037 257)"
  whatsapp-green: "#25D366"
  whatsapp-green-deep: "#1EBE5A"
typography:
  display:
    fontFamily: "Montserrat, ui-sans-serif, system-ui, sans-serif"
    fontSize: "4rem"
    fontWeight: 700
    lineHeight: 1.04
    letterSpacing: "-0.025em"
  display-sm:
    fontFamily: "Montserrat, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.5rem"
    fontWeight: 700
    lineHeight: 1.04
    letterSpacing: "-0.025em"
  page-title:
    fontFamily: "Montserrat, ui-sans-serif, system-ui, sans-serif"
    fontSize: "3.75rem"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.025em"
  page-title-sm:
    fontFamily: "Montserrat, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Montserrat, ui-sans-serif, system-ui, sans-serif"
    fontSize: "3rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.025em"
  headline-sm:
    fontFamily: "Montserrat, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.025em"
  metric:
    fontFamily: "Montserrat, ui-sans-serif, system-ui, sans-serif"
    fontSize: "3.75rem"
    fontWeight: 700
    lineHeight: 1
    fontFeature: "tnum"
  metric-sm:
    fontFamily: "Montserrat, ui-sans-serif, system-ui, sans-serif"
    fontSize: "3rem"
    fontWeight: 700
    lineHeight: 1
    fontFeature: "tnum"
  stat:
    fontFamily: "Montserrat, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.2
    fontFeature: "tnum"
  title-lg:
    fontFamily: "Montserrat, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.33
    letterSpacing: "-0.025em"
  quote:
    fontFamily: "Montserrat, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 500
    lineHeight: 1.375
  quote-sm:
    fontFamily: "Montserrat, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 500
    lineHeight: 1.625
  title:
    fontFamily: "Montserrat, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.5
  lead:
    fontFamily: "Montserrat, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.625
  body:
    fontFamily: "Montserrat, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
  body-sm:
    fontFamily: "Montserrat, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.625
  label-lg:
    fontFamily: "Montserrat, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.5
  label:
    fontFamily: "Montserrat, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.43
  caption:
    fontFamily: "Montserrat, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.33
rounded:
  control: "12px"
  card: "14px"
  panel: "18px"
  band: "20px"
  pill: "9999px"
spacing:
  gutter-sm: "16px"
  gutter-md: "24px"
  gutter-lg: "32px"
  grid-gap: "20px"
  card-pad: "24px"
  card-pad-lg: "32px"
  band-y: "48px"
  band-y-lg: "56px"
  section: "80px"
  section-lg: "112px"
  container: "1280px"
components:
  button-primary:
    backgroundColor: "{colors.signal-blue}"
    textColor: "{colors.surface-white}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.pill}"
    padding: "14px 28px"
  button-primary-hover:
    backgroundColor: "{colors.signal-blue-deep}"
    textColor: "{colors.surface-white}"
  button-header:
    backgroundColor: "{colors.signal-blue}"
    textColor: "{colors.surface-white}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "10px 20px"
  button-whatsapp-night:
    textColor: "{colors.snow}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.pill}"
    padding: "14px 28px"
  whatsapp-float:
    backgroundColor: "{colors.whatsapp-green}"
    textColor: "{colors.surface-white}"
    rounded: "{rounded.pill}"
    size: "56px"
  whatsapp-float-hover:
    backgroundColor: "{colors.whatsapp-green-deep}"
  service-row:
    textColor: "{colors.night}"
    rounded: "{rounded.panel}"
    padding: "14px 12px"
  service-row-hover:
    backgroundColor: "{colors.surface-white}"
  chip-stack:
    backgroundColor: "{colors.surface-white}"
    textColor: "{colors.night}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.pill}"
    padding: "4px 12px"
  card-project:
    backgroundColor: "{colors.surface-white}"
    textColor: "{colors.night}"
    rounded: "{rounded.card}"
    padding: "{spacing.card-pad}"
  sprint-panel:
    backgroundColor: "{colors.surface-white}"
    textColor: "{colors.night}"
    rounded: "{rounded.panel}"
    padding: "{spacing.card-pad}"
  band-night:
    backgroundColor: "{colors.night}"
    textColor: "{colors.snow}"
    rounded: "{rounded.band}"
    padding: "48px 24px"
  header:
    backgroundColor: "{colors.night}"
    textColor: "{colors.snow}"
    height: "64px"
  nav-link:
    textColor: "{colors.night-mist}"
    typography: "{typography.label}"
  nav-link-active:
    textColor: "{colors.snow}"
---

# Design System: Avila System

## Overview

**Creative North Star: "La Cumbre de Noche"**

Avila System se presenta como ingeniería seria con alcance: la marca es una cumbre, el Ávila, vista de noche desde Caracas. El sitio alterna superficies de azul noche con planos claros, como un producto real alterna su consola y su documentación. Lo oscuro enmarca los momentos de identidad y decisión (cabecera, hero, proceso, cierre, pie, 404); lo claro carga el contenido que se lee y se compara (servicios, proyectos, testimonios).

El elemento firma es la cresta del Ávila (`components/brand/ridge.tsx`): una silueta real de oeste a este, con la Silla y el Naiguatá como cumbre más alta. Recorre el sitio como un ascenso: en el hero se traza y se enciende la luz de la cumbre; en los heros internos se traza y su relleno es el papel claro de la página que sigue; en la banda de proceso se convierte en un perfil de subida con cinco paradas que avanza con el scroll; en el cierre vuelve con la cumbre encendida; en el 404 es el sendero que no lleva a ninguna parte. La densidad es media y ordenada: contenedor de 1280px, columnas asimétricas, un único acento saturado (azul señal) y piezas de interfaz ilustrativas que se mueven solo cuando hay algo que contar.

Rechazos confirmados por la marca: nada de gradientes de texto, blobs ni glass; nada de etiquetas eyebrow sobre los títulos.

**Key Characteristics:**
- Ritmo: cielo nocturno con cresta → servicios en claro → banda de ascenso → proyectos en claro → testimonios → banda de cierre con cumbre → pie noche.
- La cresta del Ávila como único recurso decorativo, siempre anclada al borde inferior de una superficie oscura.
- Un solo acento saturado (azul señal) para acciones y cifras; azul cumbre solo como luz (trazo de la cresta, recorrido, halos).
- Montserrat en 700 para titulares con tracking negativo y sin palabra resaltada; 400 para el cuerpo.
- Un único verbo de conversión, "Cotizar mi proyecto", con WhatsApp (glifo oficial) como segunda vía.
- Interfaces ilustrativas que cuentan el resultado: panel de sprint que se inclina con el cursor, escenas de proyecto que se reproducen al entrar en pantalla.

## Colors

Paleta fría de dos polos (azul noche y blanco frío) con un único azul saturado que señala la acción. Los valores canónicos son OKLCH en `app/globals.css`; la clase `.dark` redefine los tokens dentro de una sección para que los componentes funcionen igual sobre noche.

### Primary
- **Azul Señal** (≈ #2563EB): CTAs en píldora, flechas de las filas de servicio, enlaces de acción, métricas de proyectos, comilla de testimonios, estado activo de la navegación, barras del panel de sprint y paradas alcanzadas del proceso. Es el mismo valor en claro y en noche.
- **Azul Señal Profundo** (`--primary-hover`): solo el hover del botón primario.

### Secondary
- **Azul Cumbre** (≈ #4F8CFF): la luz del sistema. Trazo de la cresta, recorrido de ascenso, borde de las paradas alcanzadas, halos de la cumbre y de las paradas, ruta de la escena logística; es el `--accent` y la base del anillo de foco dentro de `.dark`. No se usa en texto de titulares.
- **Luz de Cumbre**: el punto encendido sobre el Naiguatá en el hero y el cierre. Nada más lleva este color.

### Neutral
- **Azul Noche** (≈ #0B0F1A): fondo de cabecera, bandas de proceso y cierre, pie; tinta del texto sobre planos claros y fondo del escenario de las escenas de proyecto.
- **Noche Profunda** y **Horizonte**: los extremos del degradado vertical de cielo nocturno del hero, los heros internos, el 404 y la banda de cierre (de arriba hacia abajo se aclara hacia el horizonte).
- **Sombra de Cresta**: relleno de la montaña bajo la cresta en el hero y el cierre, más oscuro que el cielo.
- **Noche Elevada** (≈ #131A2A): relleno del perfil de ascenso y franja de los pasos del proceso; fondo de la escena logística.
- **Burbuja Nocturna**: el mensaje flotante del panel de sprint y las etiquetas de la escena logística.
- **Línea de Noche** (≈ #232C40): bordes y divisores sobre noche (cabecera, fila de cifras del hero, pie).
- **Sendero Punteado**: el trazo discontinuo del recorrido aún no alcanzado.
- **Contorno de Cresta**: borde del botón secundario sobre noche y de las paradas no alcanzadas.
- **Bruma Nocturna**: texto secundario legible sobre noche (bajadas, etiquetas de cifras, navegación en reposo).
- **Nieve**: texto principal sobre noche.
- **Papel Frío** (≈ #F8FAFC): fondo de las secciones claras y relleno de la cresta en los heros internos, que funde el hero con la página.
- **Blanco de Superficie** (#FFFFFF): tarjetas de proyecto, panel de sprint, escenas claras, hover de las filas de servicio y chips de stack.
- **Escarcha** (≈ #EEF2F7): superficies `secondary`/`muted` sobre claro.
- **Línea Fina** (≈ #E2E8F0): bordes de tarjetas, divisores entre grupos y filas, pistas de progreso.
- **Pizarra** (≈ #94A3B8): barra de desplazamiento y detalles secundarios.
- **Pizarra Tinta** (≈ #475569): descripciones y textos secundarios sobre claro.

### Externo
- **Verde WhatsApp** (#25D366) y su hover (#1EBE5A): exclusivos del glifo oficial de WhatsApp y del botón flotante. Es un color prestado de la marca de WhatsApp, no parte de la paleta de acción.

### Named Rules
**La Regla de la Señal Única.** El azul señal es el único color saturado propio del sistema y significa "acción" o "dato confirmado". No se usa como fondo de sección ni como decoración.

**La Regla del Verde Prestado.** El verde WhatsApp solo aparece en el glifo oficial (`WhatsAppIcon`) y en el botón flotante. Nunca como acento, estado de éxito de la UI ni fondo.

**La Regla de la Banda Oscura.** Las superficies oscuras se crean con `className="dark"` sobre la sección, nunca pintando colores de noche a mano; así los tokens cambian juntos.

## Typography

**Display Font:** Montserrat (con ui-sans-serif, system-ui, sans-serif)
**Body Font:** Montserrat (misma familia)

**Character:** Una sola geométrica en cuatro pesos (400, 500, 600, 700) vía `next/font`. Los titulares en 700 con tracking −0.025em y `text-wrap: balance` dan firmeza técnica; el cuerpo en 400 con interlineado amplio mantiene la cercanía.

### Hierarchy
- **Display** (700, 2.5rem → 3.75rem → 4rem, interlineado 1.04, máx. 15ch): solo el titular del hero de la home.
- **Page Title** (700, 2.25rem → 3.75rem, 1.08): heros internos y 404.
- **Headline** (700, 1.875rem → 3rem, 1.25): títulos de sección y de bandas (servicios, proceso, proyectos, cierre).
- **Title Large** (700, 1.5rem): necesidad de cada grupo de servicios, nombre de servicio en `/servicios`; el titular de testimonios usa 1.5rem → 1.875rem.
- **Metric** (700, 3rem; 3.75rem en el caso destacado; interlineado 1; cifras tabulares): la métrica de cada proyecto, en azul señal.
- **Stat** (700, 1.875rem, cifras tabulares): las tres cifras confirmadas del hero, con su etiqueta debajo en 0.875rem bruma nocturna.
- **Quote** (500, 1.25rem → 1.5rem): testimonios grandes.
- **Title** (600, 1rem): nombre de servicio en las filas, paso del proceso.
- **Lead** (400, 1.125rem, 1.625, máx. ~36rem): bajada del hero y de heros internos (1.25rem desde 768px en heros internos).
- **Body** (400, 1rem / 0.875rem, 1.625): introducciones de sección y descripciones.
- **Label** (600, 0.875rem; 1rem en CTAs grandes): botones, enlaces de acción; la navegación usa 500.
- **Caption** (400, 0.75rem): pie de figura del panel de sprint y nota de créditos de proyectos.

### Named Rules
**La Regla del Titular Firme.** Todo h1–h3 lleva 700 (o 600 en títulos de fila), tracking −0.025em y balance de líneas. Nada de titulares en peso ligero.

**La Regla del Titular Sin Destacado.** Los titulares van en un solo color. Ninguna palabra se pinta en azul cumbre ni en azul señal; el énfasis lo pone la cresta, no el texto.

**La Regla de las Cifras Tabulares.** Métricas, cifras del hero, numerales del proceso y horas de las escenas usan `tabular-nums`.

## Layout

Contenedor centrado de 1280px con márgenes laterales de 16px, 24px (≥640px) y 32px (≥1024px). Las secciones claras respiran con 80px verticales (112px desde 768px). Las bandas de proceso y cierre se insertan dentro de una sección clara con los mismos márgenes y quedan como bloques redondeados de 48px (56px desde 768px) de padding superior; el hero, los heros internos, la cabecera y el pie ocupan todo el ancho. Toda superficie con cresta reserva padding inferior generoso (hero 128 → 160 → 176px; cierre 112 → 128px) para que la montaña no pise el contenido.

- **Hero:** dos columnas desde 1024px (1.05fr / 1fr): titular, bajada, CTAs y fila de tres cifras sobre línea de noche; a la derecha el panel de sprint con su pie de figura. En móvil se apilan.
- **Servicios (home):** encabezado a dos columnas (titular / introducción alineada al final), luego tres grupos por necesidad bajo una regla superior en tinta al 80%, separados por líneas finas verticales desde 768px. Cada grupo lista filas con flecha, no tarjetas.
- **Servicios (`/servicios`):** filas a ancho completo entre líneas finas, en tres columnas desde 768px (icono y nombre / descripción / chips de stack).
- **Proceso:** en escritorio, perfil de ascenso a todo el ancho de la banda con cinco paradas y los pasos en cinco columnas debajo; en móvil, riel vertical que se llena con el scroll.
- **Proyectos:** encabezado con "Ver todos los casos" a la derecha; desde 1024px, caso destacado ocupando dos filas a la izquierda y dos casos horizontales apilados a la derecha (separación 20px).
- **Testimonios:** dos citas grandes en columnas desde 768px, bajo una línea fina.
- **Cierre:** titular y bajada a la izquierda, CTAs a la derecha desde 768px.

La cabecera es fija de 64px; la página compensa con 64px de padding superior. El botón flotante de WhatsApp vive a 16px (24px desde 640px) de la esquina inferior derecha.

## Elevation & Depth

Plano por defecto. La profundidad se comunica por tono (cielo nocturno contra papel frío, noche elevada contra noche, cresta oscura contra horizonte) y por la propia montaña. Las tarjetas y filas de contenido no tienen sombra en reposo: solo responden al hover. Los objetos de interfaz ilustrativa (panel de sprint, escenas de proyecto) sí descansan con una sombra de escenario, porque están puestos sobre noche como un producto en una vitrina.

### Shadow Vocabulary
- **Brillo de Tarjeta** (`box-shadow: 0 18px 40px -20px oklch(0.546 0.215 263 / 0.45)`): hover de la tarjeta de proyecto, junto con el borde a azul señal al 40%.
- **Elevación de Fila** (`box-shadow: 0 8px 24px -16px oklch(0.17 0.025 265 / 0.35)`): hover de las filas de servicio, junto con el fondo blanco.
- **Escenario** (`box-shadow: 0 30px 60px -24px oklch(0.05 0.03 265 / 0.8)`): panel de sprint; las escenas usan la variante `0 24px 48px -20px`.
- **Luz de Cumbre** (`box-shadow: 0 0 0 6px oklch(0.68 0.17 258 / 0.25), 0 0 24px 4px oklch(0.68 0.17 258 / 0.5)`): halo del punto del Naiguatá; las paradas alcanzadas del proceso usan solo el anillo de 6px al 18%.
- **Flotante** (`box-shadow: 0 12px 32px -12px oklch(0.1 0.03 265 / 0.6)`): botón de WhatsApp.

### Named Rules
**La Regla de la Elevación Única.** Una tarjeta o fila de contenido tiene exactamente un nivel de elevación y solo aparece como respuesta al hover. Nunca sombra en reposo ni sombras apiladas; la excepción son los objetos de interfaz ilustrativa sobre noche.

## Shapes

Dos lenguajes conviven a propósito. Las piezas de interfaz son suaves: controles de 12px, tarjetas de proyecto y escenas de 14px, panel de sprint y hover de filas de 18px, bandas oscuras de 20px; todo lo accionable (botones, chips, paradas del proceso, iconos sociales, botón flotante) es circular o en píldora. La decoración es una sola: la cresta del Ávila, una silueta poligonal con trazo de 1.5px en azul cumbre y relleno sólido debajo, anclada al borde inferior y estirada a todo el ancho (`preserveAspectRatio="none"`, trazo sin escalar). El recorrido de ascenso del proceso es su versión curva.

El logo es oficial (`components/brand/logo.tsx`, desde `public/brand/*.svg`): isotipo de montaña con cara plateada y arista en azul señal a cian, más "ÁVILA / SYSTEM". `Logo` es la versión horizontal de la cabecera y el pie, `LogoMark` el isotipo (con variante `mono` en `currentColor` para fondos claros) y `LogoStacked` la versión apilada para piezas grandes. Los favicons son `app/icon.svg` y `app/apple-icon.png`.

**La Regla de la Cresta Única.** La única geometría decorativa es la cresta del Ávila (`Ridge`), siempre en el borde inferior de una superficie oscura. Nada de círculos decorativos, blobs, mallas ni planos de montaña inventados; la luz de la cumbre solo marca el Naiguatá en el hero y el cierre.

**La Regla del Cielo Nocturno.** El único degradado de fondo es el vertical de cielo nocturno (de noche profunda a horizonte) en hero, heros internos, 404 y cierre, más el velo nocturno sobre las fotos de proyectos. Ningún otro degradado de color, radial ni de texto.

## Components

### Buttons
Directos y con dirección: una píldora azul que siempre apunta hacia adelante, con un solo verbo.
- **Shape:** píldora completa (9999px).
- **Primary:** azul señal con texto blanco, 600, padding 14px × 28px, seguido de una flecha de 16px. Siempre dice "Cotizar mi proyecto" y lleva a `/cotizacion`. En la cabecera, versión compacta de 10px × 20px a 0.875rem.
- **Hover / Focus:** el fondo pasa a azul señal profundo (`--primary-hover`) y la flecha avanza 2px (300ms, ease-out). Foco: contorno de 2px en azul señal con 3px de separación.
- **WhatsApp (sobre noche):** píldora transparente con borde de contorno de cresta, texto nieve y glifo oficial de 18px en verde WhatsApp delante; en hover el borde pasa a nieve y gana un velo blanco del 5%. Lleva `data-wa-inline` para que el botón flotante se oculte mientras está visible. Dice "Escribir por WhatsApp".
- **Enlace de acción:** texto azul señal en 600 con flecha, sin fondo ("Ver todos los casos", "Ver el caso").

### Botón flotante de WhatsApp
Círculo de 56px en verde WhatsApp con el glifo blanco de 28px y sombra flotante. Aparece después del 70% del primer viewport y se oculta (opacidad 0, baja 16px, sin foco) mientras cualquier `[data-wa-inline]` está en pantalla. Hover a #1EBE5A. Los datos de contacto salen de `lib/contact.ts`.

### Chips
- **Style:** píldora blanca con borde de línea fina, 0.875rem, padding 4px × 12px.
- **Uso:** solo el stack tecnológico de cada fila en `/servicios`. Son informativos, sin estado.

### Filas de servicio
Grupos por necesidad ("Lanzar un producto", "Ordenar tu operación", "Automatizar y crecer") con su público debajo y dos filas cada uno. La fila completa es el enlace: nombre en Title, descripción en Body pequeño, flecha diagonal de 20px en azul señal a la derecha. En hover la fila gana fondo blanco, radio de 18px y elevación de fila, y la flecha sube y avanza 2px.

### Cards / Containers
- **Corner Style:** 14px.
- **Background:** blanco de superficie sobre papel frío.
- **Shadow Strategy:** ver Elevation & Depth; solo Brillo de Tarjeta en hover (300ms).
- **Border:** 1px de línea fina.
- **Internal Padding:** 24px (32px desde 768px en el caso destacado).
- **Proyecto:** escenario superior (o lateral en los casos secundarios desde 640px) con foto de contexto de Unsplash bajo velo nocturno, sobre la que se reproduce la escena de interfaz; debajo, métrica grande en azul señal, su etiqueta en 600, sector, descripción y "Ver el caso →". En hover la foto se acerca a 1.04 (700ms) y la escena se repite.

### Navigation
- **Cabecera:** banda noche fija y opaca de 64px con borde inferior de línea de noche; logo oficial a la izquierda, enlaces al centro (Servicios, Proyectos, Precios, Misión, Nosotros, Contacto), selector de idioma y "Cotizar mi proyecto →" a la derecha.
- **Enlaces:** 0.875rem en 500, bruma nocturna en reposo, nieve en hover. El activo pasa a nieve con una barra de 2px en azul señal pegada al borde inferior.
- **Móvil:** botón de menú de 44px; el panel desplegado lista enlaces en bloques de 14px de radio con fondo `muted` para el activo, y cierra con el CTA en píldora de ancho completo junto al selector de idioma.

### Cresta del Ávila (signature)
`Ridge` dibuja la silueta en un lienzo de 1440 × 200; se configura con `--ridge-fill` y `--ridge-line`, y con `draw` traza la línea al cargar.
- **Hero:** relleno sombra de cresta, línea en azul cumbre que se traza (2.4s) y luz de cumbre que aparece sobre el Naiguatá al terminar (2.3s de retardo).
- **Heros internos (`PageHero`):** se traza con relleno de papel frío y línea al 60%, para que el cielo desemboque en la página clara.
- **Banda de proceso:** perfil de ascenso curvo con sendero punteado debajo y trazo azul cumbre que avanza con el scroll; cinco paradas numeradas que se encienden (azul señal, halo) al ser alcanzadas, y los pasos pasan de 55% a 100% de opacidad.
- **Cierre:** cresta estática con la luz de cumbre encendida.
- **404:** cresta que se traza con relleno de noche: "Este sendero no lleva a ninguna parte."

### Panel de sprint (hero)
Tarjeta blanca de 18px con el avance ilustrativo de un proyecto: nombre y "Sprint 4 de 6" en azul señal, cuatro tramos con barras de progreso (la tercera se llena al cargar), tres entregables con check verde que entran escalonados y la próxima demo. Un mensaje de WhatsApp en burbuja nocturna aparece debajo. Todo el panel se inclina con el puntero (hasta ±4° en X y ±5° en Y, 500ms) solo con puntero fino y sin "reducir movimiento". Lleva pie de figura que lo declara ilustrativo.

### Escenas de proyecto
Tres interfaces ilustrativas (`scenes.tsx`): agenda de la clínica, rutas del operador logístico y checkout móvil de la tienda. Sin JS se ve el estado final; con JS esperan a entrar en pantalla (`useInView`, umbral 35%) y se reproducen una vez; el hover las repite. El pie de la sección declara que son ilustrativas y acredita las fotos.

### Testimonios
Dos citas grandes (Quote) con la comilla de apertura en azul señal 700, autor en 600 y empresa en pizarra tinta, bajo una nota que declara el anonimato.

## Do's and Don'ts

### Do:
- **Do** crear las superficies oscuras con `className="dark"` sobre la sección para que los tokens cambien en bloque.
- **Do** cerrar toda superficie oscura de identidad (hero, heros internos, cierre, 404) con la cresta del Ávila en su borde inferior.
- **Do** usar "Cotizar mi proyecto" con flecha como único CTA primario, y WhatsApp con su glifo oficial como segunda vía.
- **Do** marcar cada botón de WhatsApp en línea con `data-wa-inline`.
- **Do** declarar como ilustrativas las interfaces y acreditar las fotos de contexto.
- **Do** mostrar cifras con `tabular-nums` y solo las confirmadas en PRODUCT.md.
- **Do** respetar `prefers-reduced-motion`: toda animación y transición se reduce a ~0, el ascenso queda completo y el panel no se inclina.
- **Do** dejar que las animaciones de carga funcionen desde CSS, sin depender de la hidratación.

### Don't:
- **Don't** usar gradientes de texto, blobs, glass ni degradados de fondo distintos del cielo nocturno.
- **Don't** poner etiquetas eyebrow sobre los títulos.
- **Don't** resaltar palabras de un titular en otro color.
- **Don't** dar sombra en reposo a tarjetas o filas de contenido ni apilar más de un nivel de elevación.
- **Don't** introducir un segundo color saturado propio: el azul señal es la única voz de acción y el verde WhatsApp solo vive en su glifo.
- **Don't** usar círculos, curvas o montañas decorativas distintas de la cresta del Ávila.
- **Don't** usar titulares en peso ligero ni tracking positivo fuera del logotipo.
