import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import Script from "next/script"
import Header from "@/components/layout/header"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/components/providers/language-provider"
import { adsConfig } from "@/lib/gtag"

export const metadata: Metadata = {
  title: "Avila System - Consultora de Desarrollo de Software",
  description: "Consultora especializada en desarrollo de software moderno y soluciones tecnológicas innovadoras",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const googleAdsId = adsConfig.googleAdsId

  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {googleAdsId ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${googleAdsId}`} strategy="lazyOnload" />
            <Script id="google-ads-gtag" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                window.gtag = gtag;
                gtag('js', new Date());
                gtag('config', '${googleAdsId}');
              `}
            </Script>
          </>
        ) : null}
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <LanguageProvider>
            <Header />
            <main>{children}</main>
          </LanguageProvider>
        </ThemeProvider>
        {/* v0 – built-with badge */}

      </body>
    </html>
  )
}
