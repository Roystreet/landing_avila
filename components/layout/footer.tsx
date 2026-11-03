"use client"

import Link from "next/link"
import { Github, Linkedin, Instagram, Mail } from "lucide-react"
import { useLanguage } from "@/components/providers/language-provider"
import { Logo } from "@/components/brand/logo"
import { CONTACT_EMAIL, WHATSAPP_URL } from "@/lib/contact"
import { WhatsAppIcon } from "@/components/brand/whatsapp-icon"


const copy = {
  es: {
    tagline:
      "Consultora de software: construimos productos web, móviles y en la nube para empresas de la región.",
    sections: [
      {
        title: "Servicios",
        links: [
          { label: "Desarrollo web", href: "/servicios#web" },
          { label: "Apps móviles", href: "/servicios#movil" },
          { label: "Sistemas empresariales", href: "/servicios#sistemas" },
          { label: "IA y automatización", href: "/servicios#ia" },
          { label: "Cloud y DevOps", href: "/servicios#cloud" },
        ],
      },
      {
        title: "Empresa",
        links: [
          { label: "Nosotros", href: "/nosotros" },
          { label: "Nuestra Misión", href: "/mision" },
          { label: "Casos de Éxito", href: "/casos-de-exito" },
          { label: "Precios", href: "/precios" },
          { label: "Lab: juegos", href: "/lab" },
        ],
      },
      {
        title: "Contacto",
        links: [
          { label: "Cotiza tu proyecto", href: "/cotizacion" },
          { label: "Formulario de contacto", href: "/contacto" },
          { label: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
          { label: "WhatsApp directo", href: WHATSAPP_URL },
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
          { label: "Web development", href: "/servicios#web" },
          { label: "Mobile apps", href: "/servicios#movil" },
          { label: "Enterprise systems", href: "/servicios#sistemas" },
          { label: "AI & automation", href: "/servicios#ia" },
          { label: "Cloud & DevOps", href: "/servicios#cloud" },
        ],
      },
      {
        title: "Company",
        links: [
          { label: "About us", href: "/nosotros" },
          { label: "Our Mission", href: "/mision" },
          { label: "Success Stories", href: "/casos-de-exito" },
          { label: "Pricing", href: "/precios" },
          { label: "Lab: games", href: "/lab" },
        ],
      },
      {
        title: "Contact",
        links: [
          { label: "Request a quote", href: "/cotizacion" },
          { label: "Contact form", href: "/contacto" },
          { label: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
          { label: "WhatsApp direct", href: WHATSAPP_URL },
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
      href: WHATSAPP_URL,
      icon: WhatsAppIcon,
      external: true,
    },
    {
      label: "Email",
      href: `mailto:${CONTACT_EMAIL}`,
      icon: Mail,
      external: false,
    },
  ]

  return (
    <footer className="dark bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(3,1fr)] lg:gap-8">
          <div className="max-w-xs">
            <Link href="/" aria-label="Avila System, inicio" className="inline-block rounded-md">
              <Logo />
            </Link>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{t.tagline}</p>
            <div className="mt-6 flex flex-wrap gap-1">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  title={social.label}
                  {...(social.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <social.icon className="h-[18px] w-[18px]" />
                </a>
              ))}
            </div>
          </div>
          {t.sections.map((section) => (
            <div key={section.title}>
              <h2 className="text-sm font-semibold text-foreground">{section.title}</h2>
              <ul className="mt-3 text-sm text-muted-foreground">
                {section.links.map((link) => {
                  const isExternal =
                    link.href.startsWith("http") || link.href.startsWith("mailto:") || link.href.startsWith("tel:")
                  const className = "inline-block break-all py-2 transition-colors hover:text-foreground"
                  return (
                    <li key={link.label}>
                      {isExternal ? (
                        <a
                          href={link.href}
                          className={className}
                          {...(link.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
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
        <div className="mt-14 flex flex-col gap-4 border-t border-border pt-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>{t.rights}</p>
          <nav aria-label={t.legalLinksLabel} className="flex items-center gap-2">
            {t.legalLinks.map((link) => (
              <Link key={link.href} href={link.href} className="px-2 py-2 transition-colors hover:text-foreground">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}
