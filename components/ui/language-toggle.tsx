"use client"

import { Languages } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/providers/language-provider"

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { lang, toggle } = useLanguage()
  const label = lang === "es" ? "Switch to English" : "Cambiar a Español"

  return (
    <Button
      variant="ghost"
      size="sm"
      aria-label={label}
      title={label}
      onClick={toggle}
      className={`h-9 px-2 gap-1.5 text-muted-foreground hover:text-foreground ${className}`}
    >
      <Languages className="h-4 w-4" />
      <span className="text-xs font-semibold uppercase tracking-wider">
        {lang === "es" ? "EN" : "ES"}
      </span>
    </Button>
  )
}
