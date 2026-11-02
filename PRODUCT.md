# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Pymes de Latam**: dueños o gerentes (clínicas, logística, retail, inmobiliarias, hotelería) que necesitan sacar su operación de hojas de cálculo y procesos manuales.
- **Startups**: fundadores que necesitan construir su MVP o producto digital con un equipo técnico externo.
- **Empresas medianas y grandes**: equipos de TI o gerencia que tercerizan desarrollo, integraciones, cloud o IA.

Todos llegan a evaluar si Avila System es un socio técnico confiable y, si lo es, a pedir una cotización.

## Product Purpose

Avila System es una consultora de desarrollo de software a medida. El sitio (avilasystem.com) existe para que el visitante entienda qué construye Avila System, crea que lo hace bien y pida una cotización (`/cotizacion`) o escriba (`/contacto`). Éxito = leads de cotización calificados.

## Positioning

Equipo técnico senior que diseña, construye y opera software (web, móvil, sistemas empresariales, IA y automatización, cloud, integraciones) con entregas disciplinadas y acompañamiento después del lanzamiento. Tono explícito del sitio actual: "No prometemos revoluciones"; resultados medidos, no marketing.

## Operating Context

- Mercado: Venezuela y la región latinoamericana.
- Proceso de trabajo: Descubrimiento → Estrategia → Desarrollo → Lanzamiento → Escalamiento.
- Canales de conversión: formulario de cotización y de contacto (`app/api/leads`, Resend), WhatsApp directo (+58 416 602 24 78, `lib/contact.ts`) y Google Ads (`lib/gtag.ts`). El dueño pidió usar el logo oficial de WhatsApp en los accesos.

## Capabilities and Constraints

- Next.js 15 (App Router) + Tailwind CSS 4 + componentes shadcn/Radix; despliegue propio.
- Bilingüe ES/EN mediante `LanguageProvider` y objetos `copy = { es, en }` por sección; ES es el idioma por defecto.
- Páginas: inicio, servicios, precios, misión, nosotros, casos de éxito, cotización, contacto, privacidad, términos, thank-you.
- La lógica de formularios y envío de leads no cambia con el rediseño.

## Brand Commitments

- Nombre: Avila System. Email: soluciones@avilasystem.com. Dominio: avilasystem.com.
- Rebrand aprobado por el dueño (nov 2026): identidad azul marino + azul acento, tipografía Montserrat y logo "Á" de montaña, según la propuesta visual entregada (`.impeccable/mocks/reference.png`).
- Voz: español latino cercano y directo; sin buzzwords ni promesas infladas.

## Evidence on Hand

- Cifras confirmadas: **30+ proyectos entregados**, **4.9/5 satisfacción de clientes**, **8 años de desarrollo**. 99.9% uptime y 6 industrias aparecen en el sitio actual.
- Casos de éxito (con resultados medidos, algunos bajo NDA): clínica odontológica, tienda de moda, ERP logístico, app de delivery, dashboard BI inmobiliario, chatbot hotelero (`components/sections/success-cases-section.tsx`).
- Testimonios: solo anonimizados (cargo + tipo de empresa). Logos y nombres solo con autorización.
- **No usar** las cifras de la propuesta visual (+120 proyectos, +60 empresas, 98%) ni el testimonio de "Mariana Torres / Clínica Vitaldent": no son reales.
- Logo oficial y favicons: `public/brand/` y `app/icon.svg` (entregados por el dueño en `public/assets`).
- Fotos de proyectos: fotos de contexto de Unsplash (`public/projects/CREDITOS.md`), no son de los clientes.

## Product Principles

1. Mostrar, no prometer: resultados medidos y trabajo real antes que adjetivos.
2. Cada página empuja a una acción clara: cotizar o conversar.
3. Seriedad técnica con cercanía: un socio que acompaña después del lanzamiento.
4. Nada inventado: cifras, clientes y testimonios solo si están confirmados.
