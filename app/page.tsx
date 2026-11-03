import Hero from "@/components/sections/home/hero"
import ServicesGrid from "@/components/sections/home/services-grid"
import ProcessBand from "@/components/sections/home/process-band"
import Projects from "@/components/sections/home/projects"
import Trust from "@/components/sections/home/trust"
import CtaBand from "@/components/sections/home/cta-band"
import LabTeaser from "@/components/sections/home/lab-teaser"
import Footer from "@/components/layout/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background pt-16">
      <Hero />
      <ServicesGrid />
      <ProcessBand />
      <Projects />
      <Trust />
      <LabTeaser />
      <CtaBand />
      <Footer />
    </div>
  )
}
