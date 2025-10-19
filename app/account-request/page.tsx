// app/account-request/page.tsx
"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { UserPlus, Loader2, CheckCircle, AlertCircle, Eye, EyeOff, Gamepad } from "lucide-react"

export default function AccountRequestPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: "",
    gameNick: "",
    password: "",
    confirmPassword: "",
    role: "user",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Валидация
    if (formData.password !== formData.confirmPassword) {
      setError("Пароли не совпадают")
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("Пароль должен содержать минимум 6 символов")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/account-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          gameNick: formData.gameNick,
          password: formData.password,
          role: formData.role,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Не удалось отправить запрос")
      }

      setSuccess(true)
      setFormData({ username: "", gameNick: "", password: "", confirmPassword: "", role: "user" })
    } catch (err: any) {
      setError(err.message || "Произошла ошибка при отправке запроса")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card border-2 border-border rounded-2xl shadow-2xl p-8 text-center">
          <div className="mb-6 flex justify-center">
            <div className="p-4 bg-green-500/20 rounded-full">
              <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">Запрос отправлен!</h1>
          <p className="text-muted-foreground mb-6">
            Ваш запрос на создание аккаунта успешно отправлен. Администратор рассмотрит его в ближайшее время.
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            Вы получите доступ к системе после одобрения запроса администратором.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all font-medium"
          >
            Вернуться на страницу входа
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card border-2 border-border rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <UserPlus className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Запрос на аккаунт</h1>
          <p className="text-muted-foreground">
            Заполните форму для создания запроса на аккаунт
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border-2 border-destructive/30 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <span className="text-destructive text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              <div className="flex items-center gap-2">
                <Gamepad className="w-4 h-4" />
                Игровой ник
              </div>
            </label>
            <input
              type="text"
              value={formData.gameNick}
              onChange={(e) => setFormData({ ...formData, gameNick: e.target.value })}
              className="w-full px-4 py-3 bg-input border-2 border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors font-mono"
              placeholder="Polter_Sokirovskiy"
              required
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Формат: Имя_Фамилия (только английские буквы)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Логин
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-3 bg-input border-2 border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
              placeholder="Введите логин"
              required
              minLength={3}
              maxLength={50}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Пароль
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 bg-input border-2 border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors pr-12"
                placeholder="Минимум 6 символов"
                required
                minLength={6}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Подтвердите пароль
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-4 py-3 bg-input border-2 border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors pr-12"
                placeholder="Повторите пароль"
                required
                minLength={6}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Желаемая роль
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-3 bg-input border-2 border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
              disabled={loading}
            >
              <option value="user">Пользователь</option>
              <option value="cc">СС (Старший Состав)</option>
              <option value="ld">Лидер</option>
            </select>
            <p className="text-xs text-muted-foreground mt-1">
              Выберите роль, которую хотите получить
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Отправка...
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                Отправить запрос
              </>
            )}
          </button>

          <div className="text-center pt-4">
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              disabled={loading}
            >
              Уже есть аккаунт? Войти
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
