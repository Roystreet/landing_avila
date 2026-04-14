import MissionSection from "@/components/sections/mission-section"
import Footer from "@/components/layout/footer"

export default function MisionPage() {
  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Nuestra <span className="text-primary">Misión</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transformamos ideas en soluciones tecnológicas que revolucionan industrias
          </p>
        </div>
      </div>
      <MissionSection />
      <Footer />
    </div>
  )
}
