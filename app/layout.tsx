import type React from "react"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Inter, Playfair_Display } from "next/font/google"
import "./styles/globals.css"
import { Suspense } from "react"
import { AuthProvider } from "@/lib/auth/auth-context"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" })


export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode
}) {
  return (
      <html lang="ru">
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              const theme = localStorage.getItem('theme') || 'dark';
              document.documentElement.className = theme;
            })();
          `
        }} />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
      <Suspense fallback={null}>
        <AuthProvider>
          {children}
          <Analytics />
            <SpeedInsights />
        </AuthProvider>
      </Suspense>
      </body>
      </html>
  )
}
