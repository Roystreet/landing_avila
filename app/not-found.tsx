import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Ridge } from "@/components/brand/ridge"
import Footer from "@/components/layout/footer"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Página no encontrada (404)" }

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background pt-16">
      <section className="dark relative overflow-hidden bg-[linear-gradient(180deg,oklch(0.15_0.022_265)_0%,oklch(0.24_0.05_262)_100%)] text-foreground">
        <div className="relative z-10 mx-auto max-w-7xl px-4 pb-40 pt-24 sm:px-6 lg:px-8">
          <h1 className=" max-w-2xl text-4xl font-bold leading-tight md:text-6xl">Este sendero no lleva a ninguna parte.</h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">
            La página que buscas no existe o cambió de dirección. Volvamos al camino principal.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-[oklch(0.45_0.03_260)] px-7 py-3.5 font-semibold transition-colors hover:border-foreground"
            >
              Ir al inicio
            </Link>
            <Link
              href="/cotizacion"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 font-semibold text-primary-foreground transition-colors hover:bg-[var(--primary-hover)]"
            >
              Cotizar mi proyecto
              <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-0.5" />
            </Link>
          </div>
          <p className="mt-8 text-sm text-muted-foreground">
            Y ya que te perdiste,{" "}
            <Link href="/lab/sube-el-avila" className="font-semibold text-foreground underline decoration-primary decoration-2 underline-offset-4">
              mejor sube el Ávila
            </Link>
            .
          </p>
        </div>
        <Ridge draw className="absolute inset-x-0 bottom-0 h-28 [--ridge-fill:oklch(0.17_0.025_265)] md:h-36" />
      </section>
      <Footer />
    </div>
  )
}
