"use client"

import { useEffect, useState, type ComponentType } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Check, ChevronRight } from "lucide-react"
import { useLanguage, type Language } from "@/components/providers/language-provider"
import { Ridge } from "@/components/brand/ridge"
import { useInView } from "@/hooks/use-in-view"
import { CASES, type CaseScene, type CaseStudy } from "@/lib/cases"
import {
  AgendaScene,
  ChatScene,
  CheckoutScene,
  DashboardScene,
  DeliveryScene,
  RoutesScene,
} from "@/components/sections/home/scenes"
import CtaBand from "@/components/sections/home/cta-band"
import { CountUp } from "./count-up"
import { cn } from "@/lib/utils"

type SceneComponent = ComponentType<{ play?: boolean; lang: Language; className?: string }>

const SCENES: Record<CaseScene, { Scene: SceneComponent; className: string }> = {
  agenda: { Scene: AgendaScene, className: "w-full max-w-[420px]" },
  routes: { Scene: RoutesScene, className: "w-full max-w-[360px]" },
  checkout: { Scene: CheckoutScene, className: "!w-[190px]" },
  delivery: { Scene: DeliveryScene, className: "w-full max-w-[360px]" },
  dashboard: { Scene: DashboardScene, className: "w-full max-w-[380px]" },
  chat: { Scene: ChatScene, className: "w-full max-w-[340px]" },
}

const copy = {
  es: {
    breadcrumb: "Casos de éxito",
    built: "Qué construimos",
    results: "Resultados medidos",
    stack: "Stack",
    replay: "Ver de nuevo",
    illustrative: "Interfaz ilustrativa: recrea lo que construimos sin exponer datos del cliente.",
    photo: "Imagen de referencia del sector",
    prev: "Caso anterior",
    next: "Siguiente caso",
    all: "Todos los casos",
  },
  en: {
    breadcrumb: "Success stories",
    built: "What we built",
    results: "Measured results",
    stack: "Stack",
    replay: "Play again",
    illustrative: "Illustrative interface: it recreates what we built without exposing client data.",
    photo: "Industry reference image",
    prev: "Previous case",
    next: "Next case",
    all: "All cases",
  },
}

export function CaseDetail({ slug }: { slug: string }) {
  const { lang } = useLanguage()
  const t = copy[lang]
  const index = CASES.findIndex((c) => c.slug === slug)
  const study = CASES[index]
  const prev = CASES[(index - 1 + CASES.length) % CASES.length]
  const next = CASES[(index + 1) % CASES.length]

  return (
    <article className="min-h-screen bg-background pt-16">
      <CaseHero study={study} lang={lang} t={t} />

      <section className="bg-background py-20 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.4fr] lg:gap-16 lg:px-8">
          <div>
            <h2 className="text-3xl font-bold leading-tight md:text-5xl">{t.built}</h2>
            <h3 className="mt-8 text-sm font-semibold text-muted-foreground">{t.stack}</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {study.stack.map((tech) => (
                <li key={tech} className="rounded-full border border-border bg-card px-3 py-1 text-sm">
                  {tech}
                </li>
              ))}
            </ul>
          </div>
          <BuiltList items={study.built[lang]} />
        </div>
      </section>

      <section className="bg-background px-4 sm:px-6 lg:px-8">
        <div className="dark mx-auto max-w-7xl rounded-[20px] bg-background px-6 py-12 text-foreground md:px-12 md:py-14">
          <h2 className="text-3xl font-bold leading-tight md:text-5xl">{t.results}</h2>
          <dl className={cn("mt-10 grid gap-8", study.metrics.length > 2 ? "md:grid-cols-3" : "md:grid-cols-2")}>
            {study.metrics.map((metric, i) => (
              <div key={i} className="flex flex-col border-t border-border pt-6">
                <dt className="order-2 mt-2 text-base text-muted-foreground">{metric.label[lang]}</dt>
                <dd className="order-1">
                  <CountUp metric={metric} lang={lang} className="text-5xl font-bold tabular-nums text-accent md:text-6xl" />
                </dd>
              </div>
            ))}
          </dl>
          {study.outcomes[lang].length > 0 && (
          <ul className="mt-10 grid gap-3 border-t border-border pt-8 md:grid-cols-3">
            {study.outcomes[lang].map((o) => (
              <li key={o} className="flex items-start gap-2.5 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                {o}
              </li>
            ))}
          </ul>
          )}
        </div>
      </section>

      <section className="bg-background py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <figure>
            <div className="relative aspect-[21/9] min-h-[240px] overflow-hidden rounded-[20px]">
              <Image
                src={study.photo.src}
                alt={study.photo.alt[lang]}
                fill
                sizes="(min-width: 1280px) 1216px, 100vw"
                className="case-photo object-cover"
              />
            </div>
            <figcaption className="mt-3 text-xs text-muted-foreground">
              {t.photo}:{" "}
              <a href={study.photo.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
                {study.photo.credit} · Unsplash
              </a>
            </figcaption>
          </figure>

          {study.testimonial && (
            <figure className="mx-auto mt-20 max-w-3xl text-center">
              <blockquote className="text-2xl font-medium leading-snug md:text-3xl">
                <span aria-hidden="true" className="font-bold text-primary">“</span>
                {study.testimonial.quote[lang]}”
              </blockquote>
              <figcaption className="mt-6 text-sm">
                <span className="font-semibold">{study.testimonial.author[lang]}</span>
                <span className="text-muted-foreground"> · {study.testimonial.company[lang]}</span>
              </figcaption>
            </figure>
          )}

          <nav aria-label={t.all} className="mt-20 grid gap-4 border-t border-border pt-8 sm:grid-cols-2">
            <Link href={`/casos-de-exito/${prev.slug}`} className="group rounded-[14px] p-4 transition-colors hover:bg-card">
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" aria-hidden="true" />
                {t.prev}
              </span>
              <span className="mt-1 block font-semibold">{prev.title[lang]}</span>
            </Link>
            <Link href={`/casos-de-exito/${next.slug}`} className="group rounded-[14px] p-4 text-right transition-colors hover:bg-card">
              <span className="flex items-center justify-end gap-1.5 text-sm text-muted-foreground">
                {t.next}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
              <span className="mt-1 block font-semibold">{next.title[lang]}</span>
            </Link>
          </nav>
        </div>
      </section>

      <CtaBand />
    </article>
  )
}

function CaseHero({ study, lang, t }: { study: CaseStudy; lang: Language; t: (typeof copy)["es"] }) {
  const { Scene, className } = SCENES[study.scene]
  // La escena se monta en el cliente y anima su entrada (sin parpadeo de un estado servido)
  const [mounted, setMounted] = useState(false)
  const [replay, setReplay] = useState(0)
  useEffect(() => setMounted(true), [])

  return (
    <section className="dark relative overflow-hidden bg-[linear-gradient(180deg,oklch(0.15_0.022_265)_0%,oklch(0.17_0.025_265)_50%,oklch(0.24_0.05_262)_100%)] text-foreground">
      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-4 pb-32 pt-10 sm:px-6 md:pb-40 lg:grid-cols-[1fr_1.05fr] lg:px-8">
        <div>
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <li>
                <Link href="/casos-de-exito" className="hover:text-foreground">
                  {t.breadcrumb}
                </Link>
              </li>
              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
              <li aria-current="page" className="text-foreground">
                {study.sector[lang]}
              </li>
            </ol>
          </nav>
          <h1 className="mt-6 text-4xl font-bold leading-[1.06] md:text-6xl">{study.title[lang]}</h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">{study.description[lang]}</p>
          <p className="mt-8 flex items-baseline gap-3">
            <CountUp metric={study.metrics[0]} lang={lang} className="text-5xl font-bold tabular-nums text-accent" />
            <span className="text-base text-muted-foreground">{study.metrics[0].label[lang]}</span>
          </p>
        </div>

        <figure>
          <div
            className="group relative flex min-h-[340px] items-center justify-center overflow-hidden rounded-[20px] p-6 md:min-h-[420px] md:p-10"
            onPointerEnter={() => setReplay((n) => n + 1)}
          >
            <Image
              src={study.photo.src}
              alt={study.photo.alt[lang]}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
            <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,oklch(0.17_0.025_265/0.3)_0%,oklch(0.17_0.025_265/0.65)_100%)]" />
            {mounted && <Scene key={replay} play lang={lang} className={cn("relative", className)} />}
          </div>
          <figcaption className="mt-3 text-xs text-muted-foreground">{t.illustrative}</figcaption>
        </figure>
      </div>
      <Ridge draw className="absolute inset-x-0 bottom-0 h-20 [--ridge-fill:oklch(0.984_0.003_248)] [--ridge-line:oklch(0.68_0.17_258/0.6)] md:h-28" />
    </section>
  )
}

function BuiltList({ items }: { items: string[] }) {
  const { ref, inView } = useInView<HTMLUListElement>(0.3)
  return (
    <ul ref={ref} data-play={inView} className="scene divide-y divide-border border-y border-border">
      {items.map((item, i) => (
        <li key={item} className="scene-slide flex items-center gap-4 py-5 text-lg font-semibold md:text-xl" style={{ animationDelay: `${i * 0.12}s` }}>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm tabular-nums text-primary">
            {i + 1}
          </span>
          {item}
        </li>
      ))}
    </ul>
  )
}
