import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Github, Linkedin, Instagram, Mail, MessageCircle, ShieldCheck, Star } from "lucide-react"

export default function Footer() {
  const footerSections = [
    {
      title: "Servicios",
      links: [
        { label: "Desarrollo Web", href: "/servicios" },
        { label: "Aplicaciones Móviles", href: "/servicios" },
        { label: "Sistemas Web", href: "/servicios" },
        { label: "Cloud & DevOps", href: "/servicios" },
        { label: "Agentes de IA", href: "/servicios" },
      ],
    },
    {
      title: "Empresa",
      links: [
        { label: "Nosotros", href: "/nosotros" },
        { label: "Nuestra Misión", href: "/mision" },
        { label: "Casos de Éxito", href: "/casos-de-exito" },
        { label: "Precios", href: "/precios" },
      ],
    },
    {
      title: "Contacto",
      links: [
        { label: "Cotiza tu proyecto", href: "/cotizacion" },
        { label: "Formulario de contacto", href: "/contacto" },
        { label: "soluciones@avilasystem.com", href: "mailto:soluciones@avilasystem.com" },
        { label: "WhatsApp directo", href: "https://wa.me/582125550123" },
      ],
    },
  ]

  const socials = [
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/company/avilasystem",
      icon: Linkedin,
      external: true,
    },
    {
      label: "Instagram",
      href: "https://www.instagram.com/avilasystem",
      icon: Instagram,
      external: true,
    },
    {
      label: "GitHub",
      href: "https://github.com/avilasystem",
      icon: Github,
      external: true,
    },
    {
      label: "WhatsApp",
      href: "https://wa.me/582125550123",
      icon: MessageCircle,
      external: true,
    },
    {
      label: "Correo",
      href: "mailto:soluciones@avilasystem.com",
      icon: Mail,
      external: false,
    },
  ]

  return (
    <footer className="bg-sidebar border-t border-sidebar-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-4 group">
              <div className="h-8 w-8 bg-sidebar-primary rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                <span className="text-sidebar-primary-foreground font-bold text-lg">A</span>
              </div>
              <span className="text-xl font-bold text-sidebar-foreground">Avila System</span>
            </Link>
            <p className="text-sidebar-foreground/70 mb-5 text-sm leading-relaxed">
              Consultora de software: construimos productos web, móviles y en la nube para empresas de la región.
            </p>
            <div className="flex flex-wrap gap-2">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  title={social.label}
                  {...(social.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="h-9 w-9 bg-sidebar-primary/10 border border-sidebar-primary/20 rounded-lg flex items-center justify-center text-sidebar-primary hover:bg-sidebar-primary hover:text-sidebar-primary-foreground hover:scale-110 transition-all duration-300"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold text-sidebar-foreground mb-4">{section.title}</h4>
              <ul className="space-y-2 text-sidebar-foreground/70 text-sm">
                {section.links.map((link) => {
                  const isExternal =
                    link.href.startsWith("http") ||
                    link.href.startsWith("mailto:") ||
                    link.href.startsWith("tel:")
                  const className =
                    "hover:text-sidebar-primary transition-colors duration-200"
                  return (
                    <li key={link.label}>
                      {isExternal ? (
                        <a
                          href={link.href}
                          className={className}
                          {...(link.href.startsWith("http")
                            ? { target: "_blank", rel: "noopener noreferrer" }
                            : {})}
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link href={link.href} className={className}>
                          {link.label}
                        </Link>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-sidebar-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sidebar-foreground/70 text-sm">
            © 2026 Avila System. Todos los derechos reservados.
          </p>
          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="border-sidebar-primary/30 text-sidebar-primary gap-1">
              <Star className="h-3 w-3" />
              4.9/5 satisfacción
            </Badge>
            <Badge variant="outline" className="border-sidebar-primary/30 text-sidebar-primary gap-1">
              <ShieldCheck className="h-3 w-3" />
              99.9% uptime
            </Badge>
          </div>
        </div>
      </div>
    </footer>
  )
}
