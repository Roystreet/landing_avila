import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Footer from "@/components/layout/footer"
import { GamePage } from "@/components/lab/game-page"
import { LAB_GAMES, getLabGame } from "@/lib/lab-games"

export function generateStaticParams() {
  return LAB_GAMES.map((g) => ({ game: g.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ game: string }> }): Promise<Metadata> {
  const { game } = await params
  const meta = getLabGame(game)
  if (!meta) return {}
  return {
    title: `${meta.title.es} · Lab`,
    description: meta.pitch.es,
    openGraph: { title: `${meta.title.es} · Avila System Lab`, description: meta.pitch.es },
  }
}

export default async function LabGameRoute({ params }: { params: Promise<{ game: string }> }) {
  const { game } = await params
  const meta = getLabGame(game)
  if (!meta) notFound()
  return (
    <>
      <GamePage slug={meta.slug} />
      <Footer />
    </>
  )
}
