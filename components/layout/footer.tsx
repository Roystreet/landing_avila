"use client"

import Link from "next/link"
import { Github, Linkedin, Instagram, Mail, MessageCircle } from "lucide-react"
import { useLanguage } from "@/components/providers/language-provider"

const WHATSAPP_NUMBER = "584166022478" // +58 416 602 24 78

const copy = {
  es: {
    tagline:
      "Consultora de software: construimos productos web, móviles y en la nube para empresas de la región.",
    sections: [
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
        title: "Legal",
        links: [
          { label: "Privacidad", href: "/privacidad" },
          { label: "Términos", href: "/terminos" },
        ],
      },
      {
        title: "Contacto",
        links: [
          { label: "Cotiza tu proyecto", href: "/cotizacion" },
          { label: "Formulario de contacto", href: "/contacto" },
          { label: "soluciones@avilasystem.com", href: "mailto:soluciones@avilasystem.com" },
          { label: "WhatsApp directo", href: `https://wa.me/${WHATSAPP_NUMBER}` },
        ],
      },
    ],
    rights: "© 2026 Avila System. Todos los derechos reservados.",
    legalLinksLabel: "Accesos legales",
    legalLinks: [
      { label: "Privacidad", href: "/privacidad" },
      { label: "Términos", href: "/terminos" },
    ],
  },
  en: {
    tagline:
      "Software consultancy: we build web, mobile and cloud products for companies across the region.",
    sections: [
      {
        title: "Services",
        links: [
          { label: "Web Development", href: "/servicios" },
          { label: "Mobile Applications", href: "/servicios" },
          { label: "Web Systems", href: "/servicios" },
          { label: "Cloud & DevOps", href: "/servicios" },
          { label: "AI Agents", href: "/servicios" },
        ],
      },
      {
        title: "Company",
        links: [
          { label: "About us", href: "/nosotros" },
          { label: "Our Mission", href: "/mision" },
          { label: "Success Stories", href: "/casos-de-exito" },
          { label: "Pricing", href: "/precios" },
        ],
      },
      {
        title: "Legal",
        links: [
          { label: "Privacy", href: "/privacidad" },
          { label: "Terms", href: "/terminos" },
        ],
      },
      {
        title: "Contact",
        links: [
          { label: "Request a quote", href: "/cotizacion" },
          { label: "Contact form", href: "/contacto" },
          { label: "soluciones@avilasystem.com", href: "mailto:soluciones@avilasystem.com" },
          { label: "WhatsApp direct", href: `https://wa.me/${WHATSAPP_NUMBER}` },
        ],
      },
    ],
    rights: "© 2026 Avila System. All rights reserved.",
    legalLinksLabel: "Legal shortcuts",
    legalLinks: [
      { label: "Privacy", href: "/privacidad" },
      { label: "Terms", href: "/terminos" },
    ],
  },
}

export default function Footer() {
  const { lang } = useLanguage()
  const t = copy[lang]

  const socials = [
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/company/avilasystem",
      icon: Linkedin,
      external: true,
    },
    {
      label: "Instagram",
      href: "https://www.instagram.com/avilasystem.ve",
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
      href: `https://wa.me/${WHATSAPP_NUMBER}`,
      icon: MessageCircle,
      external: true,
    },
    {
      label: "Email",
      href: "mailto:soluciones@avilasystem.com",
      icon: Mail,
      external: false,
    },
  ]

  return (
    <footer className="bg-sidebar border-t border-sidebar-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-5 gap-8">
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-4 group">
              <div className="h-8 w-8 bg-sidebar-primary rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                <span className="text-sidebar-primary-foreground font-bold text-lg">A</span>
              </div>
              <span className="text-xl font-bold text-sidebar-foreground">Avila System</span>
            </Link>
            <p className="text-sidebar-foreground/70 mb-5 text-sm leading-relaxed">{t.tagline}</p>
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
          {t.sections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold text-sidebar-foreground mb-4">{section.title}</h4>
              <ul className="space-y-2 text-sidebar-foreground/70 text-sm">
                {section.links.map((link) => {
                  const isExternal =
                    link.href.startsWith("http") ||
                    link.href.startsWith("mailto:") ||
                    link.href.startsWith("tel:")
                  const className = "hover:text-sidebar-primary transition-colors duration-200"
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
          <p className="text-sidebar-foreground/70 text-sm">{t.rights}</p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-sidebar-foreground/70 md:justify-end">
            <span className="text-sidebar-foreground/55">{t.legalLinksLabel}</span>
            {t.legalLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-sidebar-primary transition-colors duration-200">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
