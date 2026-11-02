import type { Metadata } from "next"
import MissionSection from "@/components/sections/mission-section"
import Footer from "@/components/layout/footer"
import ProcessBand from "@/components/sections/home/process-band"
import CtaBand from "@/components/sections/home/cta-band"
import { PageHero } from "@/components/layout/page-hero"

export const metadata: Metadata = { title: "Misión" }

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
      <ProcessBand />
      <div className="h-20 bg-background md:h-24" />
      <CtaBand />
      <Footer />
    </div>
  )
}
