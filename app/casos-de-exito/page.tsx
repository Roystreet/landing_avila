import SuccessCasesSection from "@/components/sections/success-cases-section"
import Footer from "@/components/layout/footer"
import { PageHero } from "@/components/layout/page-hero"

export default function CasosDeExitoPage() {
  return (
    <div className="min-h-screen bg-background pt-16">
      <PageHero
        copy={{
          es: {
            titleA: "Casos de",
            titleHighlight: "Éxito",
            subtitle:
              "Proyectos reales con resultados medidos. Algunos clientes bajo NDA; todos con métricas verificables.",
          },
          en: {
            titleA: "Success",
            titleHighlight: "Stories",
            subtitle:
              "Real projects with measured outcomes. Some clients are under NDA; all results are verifiable.",
          },
        }}
      />
      <SuccessCasesSection />
      <Footer />
    </div>
  )
}
