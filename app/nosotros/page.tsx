import AboutSection from "@/components/sections/about-section"
import Footer from "@/components/layout/footer"
import { PageHero } from "@/components/layout/page-hero"

export default function NosotrosPage() {
  return (
    <div className="min-h-screen bg-background pt-16">
      <PageHero
        copy={{
          es: {
            titleA: "Sobre",
            titleHighlight: "Nosotros",
            subtitle:
              "Un equipo técnico enfocado en entregar software útil, con documentación clara y acompañamiento post-lanzamiento.",
          },
          en: {
            titleA: "About",
            titleHighlight: "Us",
            subtitle:
              "A technical team focused on delivering useful software, with clear documentation and post-launch support.",
          },
        }}
      />
      <AboutSection />
      <Footer />
    </div>
  )
}
