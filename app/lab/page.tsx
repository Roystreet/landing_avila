import type { Metadata } from "next"
import Footer from "@/components/layout/footer"
import { LabHub } from "@/components/lab/lab-hub"

export const metadata: Metadata = {
  title: "Lab",
  description: "Tres juegos en 3D hechos por Avila System: Sube el Ávila, Sprint de entrega y Arma tu app.",
  openGraph: {
    title: "Avila Lab · Juegos en 3D de Avila System",
    description: "Sube el Ávila, Sprint de entrega y Arma tu app: juega en tu navegador.",
    images: [{ url: "/lab/thumbs/sube-el-avila-og.jpg", width: 1200, height: 630, alt: "Sube el Ávila" }],
  },
}

export default function LabPage() {
  return (
    <>
      <LabHub />
      <Footer />
    </>
  )
}
