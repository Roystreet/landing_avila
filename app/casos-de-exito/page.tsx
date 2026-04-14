import SuccessCasesSection from "@/components/sections/success-cases-section"
import Footer from "@/components/layout/footer"

export default function CasosDeExitoPage() {
  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Casos de <span className="text-primary">Éxito</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Proyectos que han transformado negocios y generado resultados extraordinarios
          </p>
        </div>
      </div>
      <SuccessCasesSection />
      <Footer />
    </div>
  )
}
