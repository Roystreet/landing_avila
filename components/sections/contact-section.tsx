"use client"

import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Rocket, Clock, Users, Award, MessageCircle } from "lucide-react"
import { useLanguage } from "@/components/providers/language-provider"

const WHATSAPP_DISPLAY = "+58 416 602 24 78"

const copy = {
  es: {
    heading: "Hablemos de tu proyecto",
    subheading:
      "Escríbenos y te respondemos en menos de 24 horas hábiles. Si prefieres, agendamos una llamada de descubrimiento sin compromiso.",
    contactHeading: "Canales de contacto",
    contactInfo: [
      { label: "Email", value: "soluciones@avilasystem.com" },
      { label: "WhatsApp", value: WHATSAPP_DISPLAY },
      { label: "Ubicación", value: "Caracas, Venezuela" },
    ],
    hoursTitle: "Horarios de atención",
    businessHours: [
      { day: "Lunes - Viernes", hours: "8:00 AM - 6:00 PM (VET)" },
      { day: "Sábados", hours: "9:00 AM - 2:00 PM (VET)" },
      { day: "Domingos", hours: "Cerrado" },
    ],
    consultTitle: "Llamada de descubrimiento gratuita",
    consultDesc:
      "Reunión inicial para entender tu caso y proponer un camino técnico realista. Sin compromiso y sin costo.",
    formHeading: "Cuéntanos tu proyecto",
    fullName: "Nombre completo",
    company: "Empresa",
    emailLabel: "Email",
    phoneLabel: "Teléfono (+58)",
    projectType: "Tipo de proyecto",
    projectTypes: [
      "Desarrollo Web",
      "App Móvil",
      "Sistema Empresarial",
      "E-commerce",
      "Migración Cloud",
      "Agente de IA",
      "Otro",
    ],
    budgetLabel: "Presupuesto estimado (USD)",
    budgets: [
      "Menos de $2,000",
      "$2,000 - $5,000",
      "$5,000 - $15,000",
      "$15,000 - $50,000",
      "$50,000 +",
      "Por definir",
    ],
    industry: "Industria o sector",
    projectDesc: "Cuéntanos tus objetivos, usuarios y desafíos actuales...",
    contactPref: "¿Cómo prefieres que te contactemos?",
    contactChannels: ["Email", "WhatsApp", "Llamada telefónica", "Reunión virtual"],
    submit: "Enviar mensaje",
    extra: [
      { title: "Respuesta en 24h", desc: "Te contactamos dentro de las próximas 24 horas hábiles" },
      { title: "Equipo dedicado", desc: "Un equipo asignado exclusivamente a tu proyecto" },
      { title: "Calidad garantizada", desc: "30 días de soporte post-entrega sin costo adicional" },
    ],
  },
  en: {
    heading: "Let's talk about your project",
    subheading:
      "Write to us and we'll reply within 24 business hours. If you prefer, we can schedule a discovery call — no commitment.",
    contactHeading: "Contact channels",
    contactInfo: [
      { label: "Email", value: "soluciones@avilasystem.com" },
      { label: "WhatsApp", value: WHATSAPP_DISPLAY },
      { label: "Location", value: "Caracas, Venezuela" },
    ],
    hoursTitle: "Business hours",
    businessHours: [
      { day: "Monday - Friday", hours: "8:00 AM - 6:00 PM (VET)" },
      { day: "Saturday", hours: "9:00 AM - 2:00 PM (VET)" },
      { day: "Sunday", hours: "Closed" },
    ],
    consultTitle: "Free discovery call",
    consultDesc:
      "Initial meeting to understand your case and propose a realistic technical path. No commitment, no cost.",
    formHeading: "Tell us about your project",
    fullName: "Full name",
    company: "Company",
    emailLabel: "Email",
    phoneLabel: "Phone (+58)",
    projectType: "Project type",
    projectTypes: [
      "Web Development",
      "Mobile App",
      "Enterprise System",
      "E-commerce",
      "Cloud Migration",
      "AI Agent",
      "Other",
    ],
    budgetLabel: "Estimated budget (USD)",
    budgets: [
      "Less than $2,000",
      "$2,000 - $5,000",
      "$5,000 - $15,000",
      "$15,000 - $50,000",
      "$50,000 +",
      "To be defined",
    ],
    industry: "Industry or sector",
    projectDesc: "Tell us your goals, users and current challenges...",
    contactPref: "How would you like us to contact you?",
    contactChannels: ["Email", "WhatsApp", "Phone call", "Virtual meeting"],
    submit: "Send message",
    extra: [
      { title: "24h reply", desc: "We'll reach out within the next 24 business hours" },
      { title: "Dedicated team", desc: "A team assigned exclusively to your project" },
      { title: "Quality guarantee", desc: "30 days of post-delivery support at no extra cost" },
    ],
  },
}

const contactIcons = [Mail, MessageCircle, MapPin]
const extraIcons = [MessageCircle, Users, Award]

export default function ContactSection() {
  const { lang } = useLanguage()
  const t = copy[lang]

  return (
    <section id="contacto" className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t.heading}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t.subheading}</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1">
              <h3 className="text-xl font-semibold text-foreground mb-6">{t.contactHeading}</h3>
              <div className="space-y-4">
                {t.contactInfo.map((contact, index) => {
                  const Icon = contactIcons[index]
                  return (
                    <div
                      key={index}
                      className="flex items-center space-x-4 p-4 bg-background rounded-lg border border-border hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group"
                    >
                      <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm text-muted-foreground">{contact.label}</div>
                        <div className="font-semibold text-foreground break-all">{contact.value}</div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-8 p-6 bg-background rounded-lg border border-border">
                <div className="flex items-center space-x-2 mb-4">
                  <Clock className="h-5 w-5 text-primary" />
                  <h4 className="font-semibold text-foreground">{t.hoursTitle}</h4>
                </div>
                <div className="space-y-2">
                  {t.businessHours.map((schedule, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{schedule.day}</span>
                      <span className="font-medium text-foreground">{schedule.hours}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 p-6 bg-primary/5 rounded-lg border border-primary/20">
                <h4 className="font-semibold text-foreground mb-2 flex items-center">
                  <Rocket className="h-4 w-4 mr-2" />
                  {t.consultTitle}
                </h4>
                <p className="text-sm text-muted-foreground">{t.consultDesc}</p>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-background rounded-lg border border-border p-8">
                <h3 className="text-xl font-semibold text-foreground mb-6">{t.formHeading}</h3>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder={t.fullName}
                      className="px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground transition-all duration-300 hover:border-primary/50"
                    />
                    <input
                      type="text"
                      placeholder={t.company}
                      className="px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground transition-all duration-300 hover:border-primary/50"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="email"
                      placeholder={t.emailLabel}
                      className="px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground transition-all duration-300 hover:border-primary/50"
                    />
                    <input
                      type="tel"
                      placeholder={t.phoneLabel}
                      className="px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground transition-all duration-300 hover:border-primary/50"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select
                      defaultValue=""
                      className="px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground transition-all duration-300 hover:border-primary/50"
                    >
                      <option value="" disabled>
                        {t.projectType}
                      </option>
                      {t.projectTypes.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                    <select
                      defaultValue=""
                      className="px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground transition-all duration-300 hover:border-primary/50"
                    >
                      <option value="" disabled>
                        {t.budgetLabel}
                      </option>
                      {t.budgets.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                  <input
                    type="text"
                    placeholder={t.industry}
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground transition-all duration-300 hover:border-primary/50"
                  />
                  <textarea
                    placeholder={t.projectDesc}
                    rows={5}
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground resize-none transition-all duration-300 hover:border-primary/50"
                  />

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">{t.contactPref}</label>
                    <div className="flex flex-wrap gap-4">
                      {t.contactChannels.map((channel) => (
                        <label key={channel} className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded border-border text-primary focus:ring-primary" />
                          <span className="text-sm text-muted-foreground">{channel}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group">
                    {t.submit}
                    <Rocket className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </form>
              </div>
            </div>
          </div>

          <div className="mt-16 grid md:grid-cols-3 gap-6">
            {t.extra.map((item, index) => {
              const Icon = extraIcons[index]
              return (
                <div key={index} className="text-center p-6 bg-background rounded-lg border border-border">
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
