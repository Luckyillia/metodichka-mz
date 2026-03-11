"use client"

import React, { Component, ErrorInfo, ReactNode } from "react"
import { AlertCircle, RefreshCw, Home, Bug } from "lucide-react"
import { motion } from "framer-motion"

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  sectionName?: string
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo)
    this.setState({ errorInfo })
    this.props.onError?.(error, errorInfo)
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
    window.location.reload()
  }

  private handleGoHome = () => {
    window.location.href = "/"
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="min-h-[400px] flex items-center justify-center p-6"
        >
          <div className="max-w-md w-full bg-card border-2 border-destructive/30 rounded-xl p-8 text-center shadow-lg">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            
            <h2 className="text-xl font-bold text-foreground mb-2">
              Что-то пошло не так
            </h2>
            
            <p className="text-muted-foreground mb-6">
              Произошла ошибка при загрузке {this.props.sectionName ? `раздела "${this.props.sectionName}"` : "этого раздела"}. Попробуйте обновить страницу или вернуться на главную.
            </p>

            {this.state.error && (
              <div className="bg-muted rounded-lg p-4 mb-6 text-left">
                <div className="flex items-center gap-2 mb-2">
                  <Bug className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-semibold text-muted-foreground uppercase">
                    Технические детали
                  </span>
                </div>
                <p className="text-xs text-destructive font-mono break-all">
                  {this.state.error.message}
                </p>
                {this.state.errorInfo && (
                  <details className="mt-2">
                    <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                      Показать стек вызовов
                    </summary>
                    <pre className="mt-2 text-[10px] text-muted-foreground overflow-auto max-h-32 p-2 bg-background rounded">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                Обновить
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex items-center gap-2 px-4 py-2 border-2 border-border rounded-lg hover:bg-muted transition-all"
              >
                <Home className="w-4 h-4" />
                На главную
              </button>
            </div>
          </div>
        </motion.div>
      )
    }

    return this.props.children
  }
}

// Section-specific error boundary with simpler UI
export function SectionErrorBoundary({ children, sectionName }: { children: ReactNode; sectionName?: string }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="p-8 text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Ошибка загрузки {sectionName || "раздела"}
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            Не удалось загрузить содержимое. Попробуйте позже.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:opacity-90"
          >
            Попробовать снова
          </button>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  )
}

// Hook for async error handling
export function useErrorHandler() {
  const handleError = React.useCallback((error: Error, context?: string) => {
    console.error(context ? `[${context}]` : "Error:", error)
    // Here you could send to error tracking service
  }, [])

  return { handleError }
}
