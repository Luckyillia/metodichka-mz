"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const success = await login(username, password)

      if (success) {
        router.push("/")
      } else {
        setError("Неверное имя пользователя или пароль")
      }
    } catch (err: any) {
      // Проверяем, есть ли конкретная информация об ошибке
      if (err.message) {
        setError(err.message)
      } else {
        setError("Произошла ошибка при входе")
      }
    } finally {
      setIsLoading(false)
    }
  }

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
                <div className="flex items-center gap-2 p-4 bg-destructive/10 border-2 border-destructive/30 rounded-lg text-destructive">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium text-foreground">
                  Имя пользователя
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

            <div className="mt-6 pt-6 border-t-2 border-border">
              <p className="text-sm text-muted-foreground text-center mb-3">
                Нет аккаунта?
              </p>
              <button
                type="button"
                onClick={() => router.push("/account-request")}
                className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-all text-sm font-medium"
              >
                Отправить запрос на создание аккаунта
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
