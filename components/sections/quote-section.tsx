"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Calculator,
  Clock,
  DollarSign,
  FileText,
  CheckCircle2,
  Send,
  Globe,
  Smartphone,
  LayoutDashboard,
  Cloud,
  Bot,
  Wrench,
} from "lucide-react"
import { useLanguage } from "@/components/providers/language-provider"
import TurnstileWidget from "@/components/ui/turnstile-widget"

const copy = {
  es: {
    badge: "Cotización personalizada",
    title: "Cuéntanos tu proyecto y te",
    titleHighlight: "preparamos una propuesta",
    intro:
      "Llena el formulario con los detalles de lo que necesitas. Mientras más claro seas sobre el alcance, más precisa será nuestra estimación.",
    perks: [
      {
        title: "Respuesta en 24h hábiles",
        description: "Revisamos tu caso y te devolvemos una propuesta inicial en el próximo día laboral.",
      },
      {
        title: "Propuesta detallada por escrito",
        description: "Alcance, entregables, tiempos, equipo asignado y presupuesto — todo documentado.",
      },
      {
        title: "Sin compromiso",
        description: "La cotización es gratuita. Si no seguimos adelante, no hay costos ocultos.",
      },
    ],
    step1Title: "¿Qué tipo de proyecto necesitas?",
    step1Hint: "(puedes seleccionar varios)",
    services: [
      { id: "web", label: "Desarrollo Web" },
      { id: "apps", label: "Aplicaciones" },
      { id: "sistemas", label: "Sistemas Web" },
      { id: "cloud", label: "Cloud / DevOps" },
      { id: "ia", label: "Agentes de IA" },
      { id: "otro", label: "Otro / A medida" },
    ],
    step2Title: "Describe tu proyecto",
    projectName: "Nombre del proyecto o producto",
    projectDesc:
      "Objetivos, usuarios, funcionalidades clave, integraciones necesarias, diseño existente o inspiración...",
    timelinePlaceholder: "Plazo estimado",
    budgetPlaceholder: "Presupuesto disponible (USD)",
    timelines: [
      "Urgente (menos de 1 mes)",
      "1 - 3 meses",
      "3 - 6 meses",
      "Más de 6 meses",
      "Flexible",
    ],
    budgetRanges: [
      "Menos de $2,000",
      "$2,000 - $5,000",
      "$5,000 - $15,000",
      "$15,000 - $50,000",
      "$50,000 +",
      "Por definir",
    ],
    step3Title: "¿Cómo te contactamos?",
    fullName: "Nombre completo",
    company: "Empresa (opcional)",
    email: "Email de contacto",
    phone: "Teléfono o WhatsApp",
    consent:
      "Al enviar, aceptas que nos pongamos en contacto contigo para discutir tu proyecto. Tu información no será compartida con terceros.",
    submit: "Enviar solicitud",
    sending: "Enviando...",
    successMessage: "Solicitud enviada. Te responderemos con una propuesta inicial.",
    errorMessage: "No pudimos enviar la solicitud. Verifica los datos e intenta de nuevo.",
    captchaMessage: "Completa el captcha para continuar.",
  },
  en: {
    badge: "Custom quote",
    title: "Tell us about your project and we'll",
    titleHighlight: "send you a proposal",
    intro:
      "Fill out the form with the details of what you need. The clearer you are about scope, the more precise our estimate will be.",
    perks: [
      {
        title: "Reply within 24 business hours",
        description: "We review your case and come back with an initial proposal the next business day.",
      },
      {
        title: "Detailed written proposal",
        description: "Scope, deliverables, timeline, assigned team and budget — all documented.",
      },
      {
        title: "No commitment",
        description: "The quote is free. If we don't move forward, there are no hidden costs.",
      },
    ],
    step1Title: "What type of project do you need?",
    step1Hint: "(you can select multiple)",
    services: [
      { id: "web", label: "Web Development" },
      { id: "apps", label: "Applications" },
      { id: "sistemas", label: "Web Systems" },
      { id: "cloud", label: "Cloud / DevOps" },
      { id: "ia", label: "AI Agents" },
      { id: "otro", label: "Other / Custom" },
    ],
    step2Title: "Describe your project",
    projectName: "Project or product name",
    projectDesc:
      "Goals, users, key features, required integrations, existing design or inspiration...",
    timelinePlaceholder: "Estimated timeline",
    budgetPlaceholder: "Available budget (USD)",
    timelines: [
      "Urgent (less than 1 month)",
      "1 - 3 months",
      "3 - 6 months",
      "More than 6 months",
      "Flexible",
    ],
    budgetRanges: [
      "Less than $2,000",
      "$2,000 - $5,000",
      "$5,000 - $15,000",
      "$15,000 - $50,000",
      "$50,000 +",
      "To be defined",
    ],
    step3Title: "How should we reach you?",
    fullName: "Full name",
    company: "Company (optional)",
    email: "Contact email",
    phone: "Phone or WhatsApp",
    consent:
      "By submitting, you agree that we may contact you to discuss your project. Your information will not be shared with third parties.",
    submit: "Send request",
    sending: "Sending...",
    successMessage: "Request sent. We will reply with an initial proposal.",
    errorMessage: "We could not send the request. Please review your data and try again.",
    captchaMessage: "Please complete the captcha to continue.",
  },
}

const serviceIcons = [Globe, Smartphone, LayoutDashboard, Cloud, Bot, Wrench]
const perkIcons = [Clock, FileText, CheckCircle2]

export default function QuoteSection() {
  const { lang } = useLanguage()
  const t = copy[lang]
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<{ type: "idle" | "success" | "error"; message: string }>({
    type: "idle",
    message: "",
  })
  const [captchaToken, setCaptchaToken] = useState("")
  const [captchaResetTrigger, setCaptchaResetTrigger] = useState(0)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const statusClassName = useMemo(() => {
    if (status.type === "success") {
      return "text-green-600"
    }

    if (status.type === "error") {
      return "text-red-600"
    }

    return ""
  }, [status.type])

  const toggleService = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!captchaToken) {
      setStatus({ type: "error", message: t.captchaMessage })
      return
    }

    setIsSubmitting(true)
    setStatus({ type: "idle", message: "" })
    setCaptchaResetTrigger((value) => value + 1)

    const form = event.currentTarget
    const formData = new FormData(form)

    const payload = {
      services: selectedServices,
      projectName: String(formData.get("projectName") || ""),
      projectDescription: String(formData.get("projectDescription") || ""),
      timeline: String(formData.get("timeline") || ""),
      budget: String(formData.get("budget") || ""),
      fullName: String(formData.get("fullName") || ""),
      company: String(formData.get("company") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      captchaToken,
      hp: String(formData.get("hp") || ""),
    }

    try {
      const response = await fetch("/api/leads/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const result = (await response.json().catch(() => null)) as { message?: string } | null

      if (!response.ok) {
        setStatus({ type: "error", message: result?.message || t.errorMessage })
        setCaptchaToken("")
        return
      }

      form.reset()
      setSelectedServices([])
      setCaptchaToken("")
      setStatus({ type: "success", message: t.successMessage })
    } catch {
      setStatus({ type: "error", message: t.errorMessage })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="cotizacion" className="py-20 bg-gradient-to-br from-background via-muted/20 to-primary/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Calculator className="h-3 w-3 mr-1" />
              {t.badge}
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              {t.title} <span className="text-primary">{t.titleHighlight}</span>
            </h2>
            <p className="text-lg text-muted-foreground text-pretty">{t.intro}</p>
          </div>

          {/* Perks */}
          <div className="grid md:grid-cols-3 gap-4 mb-12">
            {t.perks.map((p, i) => {
              const Icon = perkIcons[i]
              return (
                <Card key={i} className="bg-card border-border">
                  <CardContent className="p-6">
                    <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-card-foreground mb-1">{p.title}</h3>
                    <p className="text-sm text-muted-foreground">{p.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Quote form */}
          <Card className="bg-card border-border shadow-2xl">
            <CardContent className="p-6 md:p-10">
              <form className="space-y-8" onSubmit={handleSubmit}>
                {/* Step 1: Service type */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-7 w-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                      1
                    </div>
                    <h3 className="text-lg font-semibold text-card-foreground">{t.step1Title}</h3>
                    <span className="text-xs text-muted-foreground">{t.step1Hint}</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {t.services.map((service, i) => {
                      const Icon = serviceIcons[i]
                      const isActive = selectedServices.includes(service.id)
                      return (
                        <button
                          key={service.id}
                          type="button"
                          onClick={() => toggleService(service.id)}
                          className={`flex items-center gap-3 p-4 rounded-lg border transition-all duration-300 ${isActive
                            ? "bg-primary/10 border-primary text-primary shadow-md shadow-primary/10"
                            : "bg-background border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
                            }`}
                        >
                          <Icon className="h-5 w-5 flex-shrink-0" />
                          <span className="text-sm font-medium text-left">{service.label}</span>
                          {isActive && (
                            <CheckCircle2 className="h-4 w-4 ml-auto text-primary flex-shrink-0" />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Step 2: Scope */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-7 w-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                      2
                    </div>
                    <h3 className="text-lg font-semibold text-card-foreground">{t.step2Title}</h3>
                  </div>
                  <div className="space-y-4">
                    <input
                      name="projectName"
                      type="text"
                      placeholder={t.projectName}
                      required
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-foreground transition-all duration-300"
                    />
                    <textarea
                      name="projectDescription"
                      placeholder={t.projectDesc}
                      rows={5}
                      required
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-foreground resize-none transition-all duration-300"
                    />
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <select
                          name="timeline"
                          required
                          className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-foreground transition-all duration-300 appearance-none"
                        >
                          <option value="">{t.timelinePlaceholder}</option>
                          {t.timelines.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <select
                          name="budget"
                          required
                          className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-foreground transition-all duration-300 appearance-none"
                        >
                          <option value="">{t.budgetPlaceholder}</option>
                          {t.budgetRanges.map((b) => (
                            <option key={b} value={b}>
                              {b}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 3: Contact */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-7 w-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                      3
                    </div>
                    <h3 className="text-lg font-semibold text-card-foreground">{t.step3Title}</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      name="fullName"
                      type="text"
                      placeholder={t.fullName}
                      required
                      className="px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-foreground transition-all duration-300"
                    />
                    <input
                      name="company"
                      type="text"
                      placeholder={t.company}
                      className="px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-foreground transition-all duration-300"
                    />
                    <input
                      name="email"
                      type="email"
                      placeholder={t.email}
                      required
                      className="px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-foreground transition-all duration-300"
                    />
                    <input
                      name="phone"
                      type="tel"
                      placeholder={t.phone}
                      required
                      className="px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-foreground transition-all duration-300"
                    />
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

                {!isMounted ? null : siteKey ? (
                  <TurnstileWidget
                    siteKey={siteKey}
                    action="quote"
                    resetTrigger={captchaResetTrigger}
                    onSuccess={(token) => setCaptchaToken(token)}
                    onExpire={() => setCaptchaToken("")}
                    onError={() => setCaptchaToken("")}
                  />
                ) : (
                  <p className="text-sm text-red-600">Captcha no configurado. Falta NEXT_PUBLIC_TURNSTILE_SITE_KEY.</p>
                )}

                {status.message ? <p className={`text-sm ${statusClassName}`}>{status.message}</p> : null}

                <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-xs text-muted-foreground text-center sm:text-left">{t.consent}</p>
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting || !siteKey || !isMounted}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto transition-all duration-300 hover:scale-105 hover:shadow-xl group whitespace-nowrap"
                  >
                    {isSubmitting ? t.sending : t.submit}
                    <Send className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
