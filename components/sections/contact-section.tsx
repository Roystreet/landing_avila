import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Rocket, Clock, Users, Award, MessageCircle } from "lucide-react"

export default function ContactSection() {
  const contactInfo = [
    { icon: Mail, label: "Email Directo", value: "soluciones@avilasystem.com" },
    { icon: Phone, label: "Línea Directa", value: "+58 (212) 555-0123" },
    { icon: MapPin, label: "Sede Principal", value: "Caracas, Venezuela" },
  ]

  const businessHours = [
    { day: "Lunes - Viernes", hours: "8:00 AM - 6:00 PM (VET)" },
    { day: "Sábados", hours: "9:00 AM - 2:00 PM (VET)" },
    { day: "Domingos", hours: "Cerrado" },
  ]

  const offices = [
    {
      city: "Caracas",
      address: "Av. Francisco de Miranda, Torre Parque Cristal, Piso 15",
      phone: "+58 (212) 555-0123",
    },
    { city: "Valencia", address: "Centro Comercial Sambil, Torre B, Oficina 801", phone: "+58 (241) 555-0456" },
    { city: "Maracaibo", address: "Av. 5 de Julio, Edificio Empresarial, Piso 12", phone: "+58 (261) 555-0789" },
  ]

  return (
    <section id="contacto" className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">¿Listo para la Revolución Digital?</h2>
            <p className="text-lg text-muted-foreground">
              Contáctanos hoy y recibe una consulta estratégica gratuita que podría cambiar el futuro de tu empresa
            </p>
          </div>

          <div className="mb-16">
            <h3 className="text-2xl font-bold text-center text-foreground mb-8">Nuestras Oficinas en Venezuela</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {offices.map((office, index) => (
                <div
                  key={index}
                  className="bg-background rounded-lg border border-border p-6 hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <h4 className="font-semibold text-foreground mb-2 text-lg">{office.city}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{office.address}</p>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">{office.phone}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1">
              <h3 className="text-xl font-semibold text-foreground mb-6">Conecta con los Expertos</h3>
              <div className="space-y-6">
                {contactInfo.map((contact, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 bg-background rounded-lg border border-border hover:shadow-lg transition-all duration-300 hover:scale-105 group"
                  >
                    <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                      <contact.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">{contact.label}</div>
                      <div className="font-semibold text-foreground">{contact.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-background rounded-lg border border-border">
                <div className="flex items-center space-x-2 mb-4">
                  <Clock className="h-5 w-5 text-primary" />
                  <h4 className="font-semibold text-foreground">Horarios de Atención</h4>
                </div>
                <div className="space-y-2">
                  {businessHours.map((schedule, index) => (
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
                  Consulta Estratégica Gratuita
                </h4>
                <p className="text-sm text-muted-foreground">
                  Análisis completo de tu proyecto, roadmap tecnológico y estimación detallada. Sin compromisos, solo
                  valor puro.
                </p>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-background rounded-lg border border-border p-8">
                <h3 className="text-xl font-semibold text-foreground mb-6">Cuéntanos tu Proyecto</h3>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Nombre completo"
                      className="px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground transition-all duration-300 hover:border-primary/50"
                    />
                    <input
                      type="text"
                      placeholder="Empresa"
                      className="px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground transition-all duration-300 hover:border-primary/50"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="email"
                      placeholder="Email corporativo"
                      className="px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground transition-all duration-300 hover:border-primary/50"
                    />
                    <input
                      type="tel"
                      placeholder="Teléfono (+58)"
                      className="px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground transition-all duration-300 hover:border-primary/50"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select className="px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground transition-all duration-300 hover:border-primary/50">
                      <option>Tipo de proyecto</option>
                      <option>Desarrollo Web</option>
                      <option>App Móvil</option>
                      <option>Sistema Empresarial</option>
                      <option>E-commerce</option>
                      <option>Migración Cloud</option>
                      <option>Consultoría IA</option>
                      <option>Transformación Digital</option>
                    </select>
                    <select className="px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground transition-all duration-300 hover:border-primary/50">
                      <option>Presupuesto estimado (USD)</option>
                      <option>$5,000 - $15,000</option>
                      <option>$15,000 - $50,000</option>
                      <option>$50,000 - $100,000</option>
                      <option>$100,000+</option>
                      <option>Por definir</option>
                    </select>
                  </div>
                  <input
                    type="text"
                    placeholder="Industria o sector"
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground transition-all duration-300 hover:border-primary/50"
                  />
                  <textarea
                    placeholder="Cuéntanos tu visión, objetivos y desafíos actuales..."
                    rows={5}
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground resize-none transition-all duration-300 hover:border-primary/50"
                  ></textarea>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      ¿Cómo prefieres que te contactemos?
                    </label>
                    <div className="flex flex-wrap gap-4">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded border-border text-primary focus:ring-primary" />
                        <span className="text-sm text-muted-foreground">Email</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded border-border text-primary focus:ring-primary" />
                        <span className="text-sm text-muted-foreground">WhatsApp</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded border-border text-primary focus:ring-primary" />
                        <span className="text-sm text-muted-foreground">Llamada telefónica</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded border-border text-primary focus:ring-primary" />
                        <span className="text-sm text-muted-foreground">Reunión presencial</span>
                      </label>
                    </div>
                  </div>

                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 hover:scale-105 hover:shadow-xl group">
                    Iniciar Transformación Digital
                    <Rocket className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </form>
              </div>
            </div>
          </div>

          <div className="mt-16 grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-background rounded-lg border border-border">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">Respuesta en 24h</h4>
              <p className="text-sm text-muted-foreground">Te contactamos dentro de las próximas 24 horas hábiles</p>
            </div>
            <div className="text-center p-6 bg-background rounded-lg border border-border">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">Equipo Dedicado</h4>
              <p className="text-sm text-muted-foreground">
                Un equipo especializado asignado exclusivamente a tu proyecto
              </p>
            </div>
            <div className="text-center p-6 bg-background rounded-lg border border-border">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">Garantía de Calidad</h4>
              <p className="text-sm text-muted-foreground">30 días de soporte post-entrega sin costo adicional</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
