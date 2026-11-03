import type { Metadata } from "next"
import Footer from "@/components/layout/footer"
import { LabHub } from "@/components/lab/lab-hub"

export const metadata: Metadata = {
  title: "Lab",
  description: "Tres juegos en 3D hechos por Avila System: Sube el Ávila, Sprint de entrega y Arma tu app.",
}

export default function LabPage() {
  return (
    <>
      <LabHub />
      <Footer />
    </>
  )
}
