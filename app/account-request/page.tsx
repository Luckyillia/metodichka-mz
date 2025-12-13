// app/account-request/page.tsx
"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { UserPlus, Loader2, CheckCircle, AlertCircle, Eye, EyeOff, Gamepad, XCircle, AlertTriangle, Info } from "lucide-react"

type ErrorType = 'default' | 'duplicate' | 'deactivated' | 'validation' | 'server_error'

export default function AccountRequestPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: "",
    gameNick: "",
    password: "",
    confirmPassword: "",
    role: "user",
    city: "CGB-N" as "CGB-N" | "CGB-P" | "OKB-M",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [errorType, setErrorType] = useState<ErrorType>('default')
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setErrorType('default')
    setLoading(true)

    // Валидация на клиенте
    if (formData.password !== formData.confirmPassword) {
      setError("Пароли не совпадают")
      setErrorType('validation')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("Пароль должен содержать минимум 6 символов")
      setErrorType('validation')
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
          city: formData.city,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMessage = data.error || "Не удалось отправить запрос"
        
        // Определяем тип ошибки по содержимому сообщения
        if (errorMessage.includes("уже существует") || 
            errorMessage.includes("уже занят") || 
            errorMessage.includes("уже отправили") ||
            errorMessage.includes("уже создан")) {
          setErrorType('duplicate')
        } else if (errorMessage.includes("деактивирован")) {
          setErrorType('deactivated')
        } else if (errorMessage.includes("Ошибка") || errorMessage.includes("ошибка")) {
          setErrorType('server_error')
        } else {
          setErrorType('default')
        }
        
        setError(errorMessage)
        setLoading(false)
        return
      }

      setSuccess(true)
      setFormData({ username: "", gameNick: "", password: "", confirmPassword: "", role: "user", city: "CGB-N" })
    } catch (err: any) {
      setError(err.message || "Произошла ошибка при отправке запроса")
      setErrorType('server_error')
    } finally {
      setLoading(false)
    }
  }

  // Функция для получения стилей в зависимости от типа ошибки
  const getErrorStyles = () => {
    switch (errorType) {
      case 'duplicate':
        // Фиолетовый - данные уже существуют
        return {
          container: "bg-purple-500/15 border-2 border-purple-500/40",
          text: "text-purple-700 dark:text-purple-300",
          icon: <AlertCircle className="w-5 h-5 flex-shrink-0" />
        }
      case 'deactivated':
        // Синий - аккаунт деактивирован
        return {
          container: "bg-blue-500/15 border-2 border-blue-500/40",
          text: "text-blue-700 dark:text-blue-300",
          icon: <XCircle className="w-5 h-5 flex-shrink-0" />
        }
      case 'validation':
        // Желтый - ошибка валидации
        return {
          container: "bg-yellow-500/15 border-2 border-yellow-500/40",
          text: "text-yellow-700 dark:text-yellow-300",
          icon: <AlertTriangle className="w-5 h-5 flex-shrink-0" />
        }
      case 'server_error':
        // Оранжевый - ошибка сервера
        return {
          container: "bg-orange-500/15 border-2 border-orange-500/40",
          text: "text-orange-700 dark:text-orange-300",
          icon: <AlertCircle className="w-5 h-5 flex-shrink-0" />
        }
      default:
        // Красный по умолчанию
        return {
          container: "bg-red-500/15 border-2 border-red-500/40",
          text: "text-red-700 dark:text-red-300",
          icon: <Info className="w-5 h-5 flex-shrink-0" />
        }
    }
  }

  const errorStyles = getErrorStyles()

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
          <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 transition-all ${errorStyles.container}`}>
            <div className={errorStyles.text}>
              {errorStyles.icon}
            </div>
            <span className={`text-sm ${errorStyles.text}`}>{error}</span>
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

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Город
            </label>
            <select
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value as "CGB-N" | "CGB-P" | "OKB-M" })}
              className="w-full px-4 py-3 bg-input border-2 border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
              disabled={loading}
            >
              <option value="CGB-N">ЦГБ-Н (Центральная Городская Больница - Невский)</option>
              <option value="CGB-P">ЦГБ-П (Центральная Городская Больница - Приволжский)</option>
              <option value="OKB-M">ОКБ-М (Окружная Клиническая Больница - Мирный)</option>
            </select>
            <p className="text-xs text-muted-foreground mt-1">
              Выберите город, в котором хотите работать
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