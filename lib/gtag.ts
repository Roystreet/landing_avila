declare global {
    interface Window {
        dataLayer: unknown[]
        gtag?: (...args: unknown[]) => void
    }
}

const googleAdsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || "AW-18090292927"
const quoteConversionLabel = process.env.NEXT_PUBLIC_GOOGLE_ADS_QUOTE_CONVERSION_LABEL || ""
const contactConversionLabel = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONTACT_CONVERSION_LABEL || ""

// GA4 opcional: con NEXT_PUBLIC_GA_ID los eventos del Lab también llegan a Analytics
const analyticsId = process.env.NEXT_PUBLIC_GA_ID || ""

export const adsConfig = {
    googleAdsId,
    analyticsId,
    quoteConversionLabel,
    contactConversionLabel,
}

function trackGoogleAdsConversion(sendTo: string) {
    if (typeof window === "undefined" || !window.gtag || !sendTo) {
        return
    }

    window.gtag("event", "conversion", {
        send_to: sendTo,
    })
}

export function trackQuoteLeadConversion() {
    trackGoogleAdsConversion(adsConfig.quoteConversionLabel)
}

export function trackContactLeadConversion() {
    trackGoogleAdsConversion(adsConfig.contactConversionLabel)
}

/** Eventos del Lab (inicio, final, cotizar, compartir) para medir si los juegos traen clientes. */
export function trackLabEvent(name: string, params: Record<string, string | number | boolean> = {}) {
    if (typeof window === "undefined" || !window.gtag) {
        return
    }

    window.gtag("event", name, { event_category: "lab", ...params })
}
