import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code, Smartphone, Cloud, Database, Shield, Brain } from "lucide-react"

export default function ServicesSection() {
  const services = [
    {
      icon: Code,
      title: "Desarrollo Web Avanzado",
      description:
        "Aplicaciones web de próxima generación con React 18, Next.js 14, TypeScript, y arquitecturas serverless que escalan a millones de usuarios",
      tech: ["React 18", "Next.js 14", "TypeScript", "Serverless"],
    },
    {
      icon: Smartphone,
      title: "Apps Móviles Nativas",
      description:
        "Aplicaciones móviles nativas e híbridas con React Native, Flutter y Swift/Kotlin que dominan las tiendas de aplicaciones",
      tech: ["React Native", "Flutter", "Swift", "Kotlin"],
    },
    {
      icon: Cloud,
      title: "Arquitecturas Cloud",
      description:
        "Infraestructuras cloud-native escalables en AWS, Azure y GCP con microservicios, Kubernetes y DevOps automatizado",
      tech: ["AWS", "Kubernetes", "Docker", "Terraform"],
    },
    {
      icon: Database,
      title: "Sistemas Empresariales",
      description:
        "ERP, CRM y plataformas empresariales personalizadas con IA integrada que revolucionan procesos de negocio",
      tech: ["PostgreSQL", "MongoDB", "Redis", "GraphQL"],
    },
    {
      icon: Shield,
      title: "Ciberseguridad Avanzada",
      description:
        "Auditorías de seguridad penetration testing, implementación de Zero Trust y protección contra amenazas avanzadas",
      tech: ["Zero Trust", "OAuth 2.0", "JWT", "Encryption"],
    },
    {
      icon: Brain,
      title: "IA & Machine Learning",
      description:
        "Integración de inteligencia artificial, machine learning y automatización inteligente que transforman industrias",
      tech: ["TensorFlow", "PyTorch", "OpenAI", "LangChain"],
    },
  ]

  return (
    <section id="servicios" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Arsenal Tecnológico de Élite</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Servicios especializados que combinan las tecnologías más avanzadas con metodologías de desarrollo rockstar
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card
              key={index}
              className="bg-card border-border hover:shadow-2xl transition-all duration-500 hover:scale-105 group overflow-hidden"
            >
              <CardHeader>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                  <service.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-card-foreground group-hover:text-primary transition-colors duration-300">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground mb-4">{service.description}</CardDescription>
                <div className="flex flex-wrap gap-2">
                  {service.tech.map((tech, techIndex) => (
                    <Badge
                      key={techIndex}
                      variant="secondary"
                      className="text-xs bg-primary/10 text-primary border-primary/20"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
