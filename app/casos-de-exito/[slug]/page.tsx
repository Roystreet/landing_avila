import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Footer from "@/components/layout/footer"
import { CaseDetail } from "@/components/cases/case-detail"
import { CASES, getCase } from "@/lib/cases"

export function generateStaticParams() {
  return CASES.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const study = getCase(slug)
  if (!study) return {}
  return {
    title: `${study.title.es} — Caso de éxito`,
    description: study.description.es,
    openGraph: { images: [{ url: study.photo.src, alt: study.photo.alt.es }] },
  }
}

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!getCase(slug)) notFound()
  return (
    <>
      <CaseDetail slug={slug} />
      <Footer />
    </>
  )
}
