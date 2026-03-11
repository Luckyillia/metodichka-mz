"use client"

import { QueryProvider } from "./QueryProvider"
import { BookmarkProvider } from "../common/Bookmarks"
import { HistoryProvider } from "../common/History"
import { ProgressProvider } from "../common/LearningProgress"
import { ToastProvider } from "../common/Toast"
import { Toaster } from "sonner"
import { ReactNode } from "react"

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryProvider>
      <BookmarkProvider>
        <HistoryProvider>
          <ProgressProvider>
            <ToastProvider>
              {children}
              <Toaster 
                position="bottom-right"
                toastOptions={{
                  style: {
                    background: 'hsl(var(--card))',
                    border: '2px solid hsl(var(--border))',
                    color: 'hsl(var(--foreground))',
                  },
                }}
              />
            </ToastProvider>
          </ProgressProvider>
        </HistoryProvider>
      </BookmarkProvider>
    </QueryProvider>
  )
}
