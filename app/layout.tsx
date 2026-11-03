import type React from "react"
import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import Script from "next/script"
import Header from "@/components/layout/header"
import { WhatsAppButton } from "@/components/layout/whatsapp-button"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/components/providers/language-provider"
import { adsConfig } from "@/lib/gtag"

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://avilasystem.com"),
  title: {
    default: "Avila System — Software a medida para empresas de Latinoamérica",
    template: "%s · Avila System",
  },
  description:
    "Agendas en línea, ERPs, apps y automatizaciones con IA para pymes, startups y empresas de Latinoamérica. 30+ proyectos entregados en 8 años.",
  openGraph: {
    type: "website",
    siteName: "Avila System",
    locale: "es_VE",
    images: [{ url: "/brand/avila-system-og.png", width: 1200, height: 900, alt: "Ávila System" }],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const googleAdsId = adsConfig.googleAdsId

  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`font-sans ${montserrat.variable}`}>
        {googleAdsId ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${googleAdsId}`} strategy="lazyOnload" />
            <Script id="google-ads-gtag" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                window.gtag = gtag;
                gtag('js', new Date());
                gtag('config', '${googleAdsId}');${adsConfig.analyticsId ? `
                gtag('config', '${adsConfig.analyticsId}');` : ""}
              `}
            </Script>
          </>
        ) : null}
        <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light" enableSystem={false} disableTransitionOnChange>
          <LanguageProvider>
            <Header />
            <main>{children}</main>
            <WhatsAppButton />
          </LanguageProvider>
        </ThemeProvider>
        {/* v0 – built-with badge */}

      </body>
    </html>
  )
}
