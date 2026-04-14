"use client"

import { useEffect, useRef } from "react"

declare global {
    interface Window {
        turnstile?: {
            render: (
                container: HTMLElement,
                options: {
                    sitekey: string
                    callback?: (token: string) => void
                    "expired-callback"?: () => void
                    "error-callback"?: () => void
                    theme?: "light" | "dark" | "auto"
                }
            ) => string
            remove: (widgetId: string) => void
        }
    }
}

type TurnstileWidgetProps = {
    siteKey: string
    theme?: "light" | "dark" | "auto"
    onSuccess: (token: string) => void
    onExpire?: () => void
    onError?: () => void
}

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"

let scriptPromise: Promise<void> | null = null

const ensureScript = () => {
    if (typeof window === "undefined") {
        return Promise.resolve()
    }

    if (window.turnstile) {
        return Promise.resolve()
    }

    if (!scriptPromise) {
        scriptPromise = new Promise<void>((resolve, reject) => {
            const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`)
            if (existing) {
                existing.addEventListener("load", () => resolve(), { once: true })
                existing.addEventListener("error", () => reject(new Error("captcha_script_error")), { once: true })
                return
            }

            const script = document.createElement("script")
            script.src = SCRIPT_SRC
            script.async = true
            script.defer = true
            script.onload = () => resolve()
            script.onerror = () => reject(new Error("captcha_script_error"))
            document.head.appendChild(script)
        })
    }

    return scriptPromise
}

export default function TurnstileWidget({ siteKey, theme = "light", onSuccess, onExpire, onError }: TurnstileWidgetProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const widgetIdRef = useRef<string | null>(null)

    useEffect(() => {
        let mounted = true

        const renderWidget = async () => {
            if (!siteKey || !containerRef.current) {
                return
            }

            try {
                await ensureScript()
                if (!mounted || !containerRef.current || !window.turnstile) {
                    return
                }

                widgetIdRef.current = window.turnstile.render(containerRef.current, {
                    sitekey: siteKey,
                    callback: onSuccess,
                    "expired-callback": onExpire,
                    "error-callback": onError,
                    theme,
                })
            } catch {
                onError?.()
            }
        }

        void renderWidget()

        return () => {
            mounted = false
            if (widgetIdRef.current && window.turnstile) {
                window.turnstile.remove(widgetIdRef.current)
            }
        }
    }, [onError, onExpire, onSuccess, siteKey, theme])

    return <div ref={containerRef} />
}