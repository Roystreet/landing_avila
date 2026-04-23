declare global {
    interface Window {
        dataLayer: unknown[]
        gtag?: (...args: unknown[]) => void
    }
}

const googleAdsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || "AW-18090292927"
const quoteConversionLabel = process.env.NEXT_PUBLIC_GOOGLE_ADS_QUOTE_CONVERSION_LABEL || ""
const contactConversionLabel = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONTACT_CONVERSION_LABEL || ""

export const adsConfig = {
    googleAdsId,
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
