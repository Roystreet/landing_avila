import MissionSection from "@/components/sections/mission-section"
import Footer from "@/components/layout/footer"
import { PageHero } from "@/components/layout/page-hero"

export default function MisionPage() {
  return (
    <div className="min-h-screen bg-background pt-16">
      <PageHero
        copy={{
          es: {
            titleA: "Nuestra",
            titleHighlight: "Misión",
            subtitle:
              "Construimos software que funciona, escala y se mantiene — con transparencia y criterio técnico.",
          },
          en: {
            titleA: "Our",
            titleHighlight: "Mission",
            subtitle:
              "We build software that works, scales and keeps running — with transparency and technical judgment.",
          },
        }}
      />
      <MissionSection />
      <Footer />
    </div>
  )
}
