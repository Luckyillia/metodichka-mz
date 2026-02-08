import type React from "react"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Inter, Playfair_Display } from "next/font/google"
import "@/app/styles/globals.css"
import { Suspense } from "react"
import { AuthProvider } from "@/lib/auth/auth-context"
import type { Metadata } from "next"
import { AppFooter } from "@/app/components/common/AppFooter"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" })

export const metadata: Metadata = {
  title: "Методичка МЗ",
  description: "Методическая база Министерства Здравоохранения",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon_mo.ico",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                const theme = localStorage.getItem('theme') || 'dark';
                document.documentElement.className = theme;
              } catch (e) {
                // localStorage недоступен (SSR)
                document.documentElement.className = 'dark';
              }
            })();
          `
        }} />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        <Suspense fallback={null}>
          <AuthProvider>
            {children}
            <AppFooter />
            <Analytics />
            <SpeedInsights />
          </AuthProvider>
        </Suspense>
      </body>
    </html>
  )
}