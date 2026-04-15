"use client"

import { FormEvent, useMemo, useState } from "react"
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
    sending: "Enviando...",
    successMessage: "Mensaje enviado con exito. Te responderemos pronto.",
    errorMessage: "No pudimos enviar tu mensaje. Verifica los datos e intenta de nuevo.",
    missingFieldsIntro: "Completa estos campos para continuar:",
    projectDescriptionTooShort: "Describe mejor tu proyecto. Necesitamos al menos 10 caracteres.",
    fieldLabels: {
      fullName: "Nombre completo",
      email: "Email",
      phone: "Telefono",
      projectType: "Tipo de proyecto",
      budget: "Presupuesto estimado",
      projectDescription: "Descripcion del proyecto",
      contactPreferences: "Canal de contacto",
    },
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
    sending: "Sending...",
    successMessage: "Message sent successfully. We will get back to you soon.",
    errorMessage: "We could not send your message. Please review your data and try again.",
    missingFieldsIntro: "Please complete these fields to continue:",
    projectDescriptionTooShort: "Please add more detail about your project. We need at least 10 characters.",
    fieldLabels: {
      fullName: "Full name",
      email: "Email",
      phone: "Phone",
      projectType: "Project type",
      budget: "Estimated budget",
      projectDescription: "Project description",
      contactPreferences: "Contact channel",
    },
    extra: [
      { title: "24h reply", desc: "We'll reach out within the next 24 business hours" },
      { title: "Dedicated team", desc: "A team assigned exclusively to your project" },
      { title: "Quality guarantee", desc: "30 days of post-delivery support at no extra cost" },
    ],
  },
}

const contactIcons = [Mail, MessageCircle, MapPin]
const extraIcons = [MessageCircle, Users, Award]
const PROJECT_DESCRIPTION_MIN_LENGTH = 10

export default function ContactSection() {
  const { lang } = useLanguage()
  const t = copy[lang]
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<{ type: "idle" | "success" | "error"; message: string }>({
    type: "idle",
    message: "",
  })

  const statusClassName = useMemo(() => {
    if (status.type === "success") {
      return "text-green-700 bg-green-50 border border-green-200"
    }

    if (status.type === "error") {
      return "text-red-700 bg-red-50 border border-red-200"
    }

    return ""
  }, [status.type])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)

    const payload = {
      fullName: String(formData.get("fullName") || ""),
      company: String(formData.get("company") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      projectType: String(formData.get("projectType") || ""),
      budget: String(formData.get("budget") || ""),
      industry: String(formData.get("industry") || ""),
      projectDescription: String(formData.get("projectDescription") || ""),
      contactPreferences: formData.getAll("contactPreferences").map(String),
      hp: String(formData.get("hp") || ""),
    }

    const missingFields: Array<keyof typeof t.fieldLabels> = []

    if (!payload.fullName.trim()) missingFields.push("fullName")
    if (!payload.email.trim()) missingFields.push("email")
    if (!payload.phone.trim()) missingFields.push("phone")
    if (!payload.projectType.trim()) missingFields.push("projectType")
    if (!payload.budget.trim()) missingFields.push("budget")
    if (!payload.projectDescription.trim()) missingFields.push("projectDescription")
    if (payload.contactPreferences.length === 0) missingFields.push("contactPreferences")

    if (missingFields.length > 0) {
      const fieldsText = missingFields.map((field) => t.fieldLabels[field]).join(", ")
      setStatus({ type: "error", message: `${t.missingFieldsIntro} ${fieldsText}.` })
      return
    }

    if (payload.projectDescription.trim().length < PROJECT_DESCRIPTION_MIN_LENGTH) {
      setStatus({ type: "error", message: t.projectDescriptionTooShort })
      return
    }

    setIsSubmitting(true)
    setStatus({ type: "idle", message: "" })

    try {
      const response = await fetch("/api/leads/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const result = (await response.json().catch(() => null)) as {
        message?: string
        missingFields?: string[]
        fieldErrors?: Record<string, string[] | undefined>
      } | null

      if (!response.ok) {
        if (result?.missingFields?.length) {
          const fieldsText = result.missingFields
            .map((field) => t.fieldLabels[field as keyof typeof t.fieldLabels] || field)
            .join(", ")
          setStatus({ type: "error", message: `${t.missingFieldsIntro} ${fieldsText}.` })
          return
        }

        const projectDescriptionError = result?.fieldErrors?.projectDescription?.[0]

        if (projectDescriptionError) {
          setStatus({ type: "error", message: projectDescriptionError })
          return
        }

        const firstFieldError = Object.values(result?.fieldErrors || {}).flat().find(Boolean)

        if (firstFieldError) {
          setStatus({ type: "error", message: firstFieldError })
          return
        }

        setStatus({ type: "error", message: result?.message || t.errorMessage })
        return
      }

      form.reset()
      setStatus({ type: "success", message: result?.message || t.successMessage })
    } catch {
      setStatus({ type: "error", message: t.errorMessage })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contacto" className="py-20 bg-linear-to-br from-primary/5 to-accent/5">
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
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      name="fullName"
                      type="text"
                      placeholder={t.fullName}
                      required
                      className="px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground transition-all duration-300 hover:border-primary/50"
                    />
                    <input
                      name="company"
                      type="text"
                      placeholder={t.company}
                      className="px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground transition-all duration-300 hover:border-primary/50"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      name="email"
                      type="email"
                      placeholder={t.emailLabel}
                      required
                      className="px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground transition-all duration-300 hover:border-primary/50"
                    />
                    <input
                      name="phone"
                      type="tel"
                      placeholder={t.phoneLabel}
                      required
                      className="px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground transition-all duration-300 hover:border-primary/50"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select
                      name="projectType"
                      defaultValue=""
                      required
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
                      name="budget"
                      defaultValue=""
                      required
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
                    name="industry"
                    type="text"
                    placeholder={t.industry}
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground transition-all duration-300 hover:border-primary/50"
                  />
                  <textarea
                    name="projectDescription"
                    placeholder={t.projectDesc}
                    rows={5}
                    minLength={PROJECT_DESCRIPTION_MIN_LENGTH}
                    required
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground resize-none transition-all duration-300 hover:border-primary/50"
                  />

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">{t.contactPref}</label>
                    <div className="flex flex-wrap gap-4">
                      {t.contactChannels.map((channel) => (
                        <label key={channel} className="flex items-center space-x-2">
                          <input
                            name="contactPreferences"
                            value={channel}
                            type="checkbox"
                            className="rounded border-border text-primary focus:ring-primary"
                          />
                          <span className="text-sm text-muted-foreground">{channel}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <input
                    type="text"
                    name="hp"
                    tabIndex={-1}
                    autoComplete="off"
                    className="hidden"
                    aria-hidden="true"
                  />

                  {status.message ? <p className={`text-sm rounded-lg px-4 py-3 ${statusClassName}`}>{status.message}</p> : null}

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group"
                  >
                    {isSubmitting ? t.sending : t.submit}
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
