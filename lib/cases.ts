// Casos de éxito publicados. Todo el contenido sale de lo ya publicado en /casos-de-exito
// (descripción, resultados medidos, stack y testimonios anonimizados). No agregar cifras sin confirmar.

export type CaseScene = "agenda" | "routes" | "checkout" | "delivery" | "dashboard" | "chat"

export type CaseMetric = {
  /** Valor numérico para el contador animado; si falta, se muestra `text`. */
  value?: number
  decimals?: number
  prefix?: string
  suffix?: string
  text?: string
  label: { es: string; en: string }
}

export type CaseStudy = {
  slug: string
  scene: CaseScene
  photo: { src: string; alt: { es: string; en: string }; credit: string; url: string }
  stack: string[]
  sector: { es: string; en: string }
  title: { es: string; en: string }
  description: { es: string; en: string }
  built: { es: string[]; en: string[] }
  metrics: CaseMetric[]
  /** Resultados sin cifra; los cuantificables viven en `metrics`. */
  outcomes: { es: string[]; en: string[] }
  testimonial?: { quote: { es: string; en: string }; author: { es: string; en: string }; company: { es: string; en: string } }
}

export const CASES: CaseStudy[] = [
  {
    slug: "clinica-dental",
    scene: "agenda",
    photo: {
      src: "/projects/clinica-dental.webp",
      alt: { es: "Consultorio dental moderno con sillón y equipos", en: "Modern dental office with chair and equipment" },
      credit: "Benyamin Bohlouli",
      url: "https://unsplash.com/photos/e7MJLM5VGjY",
    },
    stack: ["Next.js", "Tailwind", "Supabase", "Resend"],
    sector: { es: "Clínica odontológica", en: "Dental clinic" },
    title: { es: "Portal y agenda online para clínica dental", en: "Website and online booking for a dental clinic" },
    description: {
      es: "Rediseñamos el sitio web y montamos un sistema de reservas en línea con recordatorios automáticos por correo y WhatsApp.",
      en: "We redesigned the website and built an online booking system with automated email and WhatsApp reminders.",
    },
    built: {
      es: ["Sitio web rediseñado", "Reservas en línea", "Recordatorios automáticos por correo", "Recordatorios automáticos por WhatsApp"],
      en: ["Redesigned website", "Online booking", "Automated email reminders", "Automated WhatsApp reminders"],
    },
    metrics: [
      { value: 35, prefix: "+", suffix: "%", label: { es: "reservas online en 3 meses", en: "online bookings in 3 months" } },
      { value: 50, prefix: "−", suffix: "%", label: { es: "ausencias", en: "no-shows" } },
      { value: 100, suffix: "/100", label: { es: "en Lighthouse mobile", en: "Lighthouse mobile score" } },
    ],
    outcomes: {
      es: [],
      en: [],
    },
    testimonial: {
      quote: {
        es: "Los recordatorios automáticos redujeron drásticamente las ausencias. La inversión se pagó sola en pocos meses.",
        en: "Automated reminders drastically cut no-shows. The investment paid for itself in just a few months.",
      },
      author: { es: "Dueño", en: "Owner" },
      company: { es: "Clínica odontológica", en: "Dental clinic" },
    },
  },
  {
    slug: "tienda-moda",
    scene: "checkout",
    photo: {
      src: "/projects/tienda-moda.webp",
      alt: { es: "Percheros con ropa en una tienda", en: "Clothing racks in a store" },
      credit: "Declan Sun",
      url: "https://unsplash.com/photos/6D_1ODPb7Os",
    },
    stack: ["Next.js", "Stripe", "PostgreSQL", "Vercel"],
    sector: { es: "Retail", en: "Retail" },
    title: { es: "Tienda online para marca de moda", en: "Online store for a fashion brand" },
    description: {
      es: "Migración desde una plantilla genérica a un e-commerce propio con checkout optimizado, pasarela local y panel de inventario.",
      en: "Migration from a generic template to a custom e-commerce with optimized checkout, local payment gateway and inventory panel.",
    },
    built: {
      es: ["E-commerce propio", "Checkout optimizado", "Pasarela de pago local", "Panel de inventario"],
      en: ["Custom e-commerce", "Optimized checkout", "Local payment gateway", "Inventory panel"],
    },
    metrics: [
      { value: 60, prefix: "+", suffix: "%", label: { es: "conversión en móvil", en: "mobile conversion" } },
      { value: 1.6, decimals: 1, suffix: "s", label: { es: "tiempo de carga (antes 4.8s)", en: "load time (was 4.8s)" } },
    ],
    outcomes: {
      es: ["Panel único para ventas físicas y online"],
      en: ["Single panel for in-store and online sales"],
    },
    testimonial: {
      quote: {
        es: "Entendieron nuestro negocio antes de proponer tecnología. Con el checkout nuevo, la conversión en móvil subió un 60%.",
        en: "They understood our business before proposing technology. With the new checkout, mobile conversion went up 60%.",
      },
      author: { es: "Fundadora", en: "Founder" },
      company: { es: "Marca de moda D2C", en: "D2C fashion brand" },
    },
  },
  {
    slug: "erp-logistica",
    scene: "routes",
    photo: {
      src: "/projects/logistica-almacen.webp",
      alt: { es: "Estanterías de almacén con cajas en paletas", en: "Warehouse shelving with boxes on pallets" },
      credit: "CHUTTERSNAP",
      url: "https://unsplash.com/photos/BNBA1h-NgdY",
    },
    stack: ["React", "Node.js", "PostgreSQL", "Docker"],
    sector: { es: "Logística", en: "Logistics" },
    title: { es: "ERP interno para operador logístico", en: "Internal ERP for a logistics operator" },
    description: {
      es: "Reemplazamos hojas de cálculo por un sistema web con control de rutas, facturación y reportes en tiempo real.",
      en: "We replaced spreadsheets with a web system that handles route management, billing and real-time reporting.",
    },
    built: {
      es: ["Sistema web que reemplaza las hojas de cálculo", "Control de rutas", "Facturación por ruta", "Reportes en tiempo real"],
      en: ["Web system replacing spreadsheets", "Route management", "Per-route billing", "Real-time reporting"],
    },
    metrics: [{ value: 40, prefix: "−", suffix: "%", label: { es: "tiempo en tareas administrativas", en: "time on admin tasks" } }],
    outcomes: {
      es: ["Facturación automatizada por ruta", "Trazabilidad completa por guía"],
      en: ["Automated billing per route", "Full traceability per waybill"],
    },
    testimonial: {
      quote: {
        es: "Pasamos de Excel a un sistema que todos usan a diario. La implementación fue gradual y el equipo se adaptó sin fricción.",
        en: "We went from Excel to a system everyone uses daily. The rollout was gradual and the team adapted without friction.",
      },
      author: { es: "Gerente de operaciones", en: "Operations manager" },
      company: { es: "Operador logístico", en: "Logistics operator" },
    },
  },
  {
    slug: "app-delivery",
    scene: "delivery",
    photo: {
      src: "/projects/delivery-moto.webp",
      alt: { es: "Repartidor en scooter de noche por la ciudad", en: "Delivery rider on a scooter at night in the city" },
      credit: "Rowan Freeman",
      url: "https://unsplash.com/photos/clYlmCaQbzY",
    },
    stack: ["React Native", "Node.js", "MongoDB", "Mapbox"],
    sector: { es: "Food-tech", en: "Food-tech" },
    title: { es: "App móvil para delivery regional", en: "Mobile app for regional delivery" },
    description: {
      es: "App nativa para clientes y repartidores con pedidos en vivo, tracking por GPS y pagos integrados.",
      en: "Native app for customers and drivers with live orders, GPS tracking and integrated payments.",
    },
    built: {
      es: ["App nativa para clientes", "App para repartidores", "Pedidos en vivo", "Tracking por GPS", "Pagos integrados"],
      en: ["Native customer app", "Driver app", "Live orders", "GPS tracking", "Integrated payments"],
    },
    metrics: [
      { value: 5000, prefix: "+", label: { es: "descargas en el primer trimestre", en: "downloads in the first quarter" } },
      { value: 28, suffix: " min", label: { es: "tiempo promedio de entrega", en: "average delivery time" } },
      { value: 4.7, decimals: 1, suffix: "★", label: { es: "calificación en tienda", en: "app store rating" } },
    ],
    outcomes: {
      es: [],
      en: [],
    },
  },
  {
    slug: "dashboard-inmobiliaria",
    scene: "dashboard",
    photo: {
      src: "/projects/inmobiliaria-edificio.webp",
      alt: { es: "Edificio residencial con balcones", en: "Residential building with balconies" },
      credit: "Aalo Lens",
      url: "https://unsplash.com/photos/otrBpvmVmNk",
    },
    stack: ["Next.js", "PostgreSQL", "Metabase", "AWS"],
    sector: { es: "Real estate", en: "Real estate" },
    title: { es: "Dashboard BI para inmobiliaria", en: "BI dashboard for a real estate firm" },
    description: {
      es: "Centralizamos datos de CRM, portal web y marketing en un tablero único para que el equipo comercial priorice leads calientes.",
      en: "We centralized CRM, web portal and marketing data into a single dashboard so the sales team could prioritize hot leads.",
    },
    built: {
      es: ["Datos del CRM, el portal web y marketing en un solo lugar", "Tablero único para el equipo comercial", "Priorización de leads calientes"],
      en: ["CRM, web portal and marketing data in one place", "Single dashboard for the sales team", "Hot-lead prioritization"],
    },
    metrics: [{ value: 30, prefix: "−", suffix: "%", label: { es: "tiempo de respuesta a prospectos", en: "prospect response time" } }],
    outcomes: {
      es: ["Decisiones comerciales con data de hoy, no del mes anterior", "Pipeline visible para toda la gerencia"],
      en: ["Business decisions on today's data, not last month's", "Pipeline visible to the entire leadership"],
    },
  },
  {
    slug: "chatbot-hotel",
    scene: "chat",
    photo: {
      src: "/projects/hotel-lobby.webp",
      alt: { es: "Lobby de hotel con sillones y paneles de madera", en: "Hotel lobby with armchairs and wood paneling" },
      credit: "Josh Hild",
      url: "https://unsplash.com/photos/clYssEhptao",
    },
    stack: ["OpenAI", "Node.js", "WhatsApp API", "Redis"],
    sector: { es: "Hospitalidad", en: "Hospitality" },
    title: { es: "Chatbot de atención para hotel boutique", en: "Customer support chatbot for a boutique hotel" },
    description: {
      es: "Asistente conversacional en WhatsApp que resuelve dudas frecuentes, confirma reservas y escala al equipo humano cuando hace falta.",
      en: "Conversational assistant on WhatsApp that handles FAQs, confirms reservations and escalates to humans when needed.",
    },
    built: {
      es: ["Asistente conversacional en WhatsApp", "Respuestas a dudas frecuentes", "Confirmación de reservas", "Escalamiento al equipo humano"],
      en: ["Conversational assistant on WhatsApp", "FAQ answers", "Reservation confirmations", "Escalation to the human team"],
    },
    metrics: [
      { value: 70, suffix: "%", label: { es: "consultas resueltas sin intervención humana", en: "inquiries resolved without human intervention" } },
      { text: "24/7", label: { es: "respuesta en español e inglés", en: "response in Spanish and English" } },
    ],
    outcomes: {
      es: ["Liberó a recepción para atención presencial"],
      en: ["Freed up the front desk for in-person guests"],
    },
  },
]

export function getCase(slug: string) {
  return CASES.find((c) => c.slug === slug)
}
