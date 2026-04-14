"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

export type Language = "es" | "en"

type LanguageContextValue = {
  lang: Language
  setLang: (l: Language) => void
  toggle: () => void
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined)

const STORAGE_KEY = "avila-lang"

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("es")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Language | null
      if (stored === "es" || stored === "en") {
        setLangState(stored)
      }
    } catch {
      // ignore
    }
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      // ignore
    }
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang
    }
  }, [lang, mounted])

  const setLang = (l: Language) => setLangState(l)
  const toggle = () => setLangState((prev) => (prev === "es" ? "en" : "es"))

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle }}>{children}</LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    // Fallback for non-wrapped usage (should not happen in app)
    return { lang: "es" as Language, setLang: () => {}, toggle: () => {} }
  }
  return ctx
}

export function pick<T>(lang: Language, dict: { es: T; en: T }): T {
  return dict[lang]
}
