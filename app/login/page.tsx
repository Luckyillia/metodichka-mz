"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, Loader2, XCircle, AlertTriangle, Info } from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"

type ErrorType = 'default' | 'deactivated' | 'pending' | 'server_error'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [errorType, setErrorType] = useState<ErrorType>('default')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setErrorType('default')
    setIsLoading(true)

    try {
      const success = await login(username, password)

      if (success) {
        router.push("/")
      } else {
        setError("Неверное имя пользователя или пароль")
        setErrorType('default')
      }
    } catch (err: any) {
      const errorTypeFromApi = (err && err.errorType) as ErrorType | undefined
      const errorMessage = (err && err.message) || "Произошла ошибка при входе"

      if (errorTypeFromApi) {
        setErrorType(errorTypeFromApi)
      } else {
        // Fallback: определяем тип по сообщению
        if (errorMessage.includes("деактивирован")) {
          setErrorType('deactivated')
        } else if (errorMessage.includes("не одобрен") || errorMessage.includes("ожидает")) {
          setErrorType('pending')
        } else if (errorMessage.includes("Ошибка") || errorMessage.includes("ошибка")) {
          setErrorType('server_error')
        } else {
          setErrorType('default')
        }
      }

      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // Функция для получения стилей в зависимости от типа ошибки
  const getErrorStyles = () => {
    switch (errorType) {
      case 'deactivated':
        // Серый - аккаунт деактивирован (информационное сообщение)
        return {
          container: "bg-slate-500/10 dark:bg-slate-400/10 border-slate-500/30 dark:border-slate-400/30",
          text: "text-slate-700 dark:text-slate-300",
          icon: <XCircle className="w-5 h-5 flex-shrink-0" />
        }
      case 'pending':
        // Желтый - ожидание одобрения (требуется действие)
        return {
          container: "bg-yellow-500/10 border-yellow-500/30",
          text: "text-yellow-600 dark:text-yellow-400",
          icon: <AlertTriangle className="w-5 h-5 flex-shrink-0" />
        }
      case 'server_error':
        // Оранжевый - ошибка сервера
        return {
          container: "bg-orange-500/10 border-orange-500/30",
          text: "text-orange-600 dark:text-orange-400",
          icon: <AlertCircle className="w-5 h-5 flex-shrink-0" />
        }
      default:
        // Красный по умолчанию - неверные учетные данные
        return {
          container: "bg-destructive/10 border-destructive/30",
          text: "text-destructive",
          icon: <Info className="w-5 h-5 flex-shrink-0" />
        }
    }
  }

  const errorStyles = getErrorStyles()

  return (
    <div className="min-h-screen bg-background">
      <main className="flex items-center justify-center px-6 py-12 min-h-screen">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-4xl">🏥</span>
              <h1 className="text-3xl font-bold text-foreground">Министерство Здравоохранения</h1>
            </div>
            <h2 className="text-2xl font-semibold text-primary mb-2">Вход в систему</h2>
            <p className="text-muted-foreground">Введите учетные данные для доступа к документации</p>
          </div>

          <div className="modern-card">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className={`flex items-center gap-2 p-4 border-2 rounded-lg ${errorStyles.container} transition-all`}>
                  <div className={errorStyles.text}>
                    {errorStyles.icon}
                  </div>
                  <span className={`text-sm ${errorStyles.text}`}>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium text-foreground">
                  Логин
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-input border-2 border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                  placeholder="Введите имя пользователя"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-foreground">
                  Пароль
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-input border-2 border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                  placeholder="Введите пароль"
                  required
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="modern-button w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Вход...</span>
                  </>
                ) : (
                  <span>Войти</span>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t-2 border-border space-y-3">
              <p className="text-sm text-muted-foreground text-center mb-3">
                Нет аккаунта?
              </p>
              <button
                type="button"
                onClick={() => router.push("/account-request")}
                className="w-full px-4 py-2 border-2 border-border text-muted-foreground rounded-lg hover:bg-muted transition-all text-sm font-medium"
              >
                Отправить запрос на создание аккаунта
              </button>
              
              <p className="text-sm text-muted-foreground text-center mt-4 mb-2">
                Аккаунт деактивирован?
              </p>
              <button
                type="button"
                onClick={() => router.push("/account-recovery")}
                className="w-full px-4 py-2 border-2 border-border text-muted-foreground rounded-lg hover:bg-muted transition-all text-sm font-medium"
              >
                Восстановить доступ
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}