// app/account-recovery/page.tsx - Account Recovery Self-Service
"use client"

import React, { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { 
  KeyRound, 
  Upload, 
  Edit3, 
  CheckCircle, 
  AlertCircle, 
  AlertTriangle,
  Loader2,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  FileImage,
  X
} from "lucide-react"

type Step = "verify" | "upload" | "edit" | "success"
type ErrorType = 'default' | 'validation' | 'server_error'

export default function AccountRecoveryPage() {
  const router = useRouter()
  const docFileInputRef = useRef<HTMLInputElement>(null)
  
  // Step 1: Verification
  const [step, setStep] = useState<Step>("verify")
  const [verifyLoading, setVerifyLoading] = useState(false)
  const [verifyData, setVerifyData] = useState({ username: "", password: "" })
  const [recoveryToken, setRecoveryToken] = useState<string | null>(null)
  const [currentGameNick, setCurrentGameNick] = useState<string>("")
  const [showPassword, setShowPassword] = useState(false)
  
  // Step 2: Document Upload
  const [docFile, setDocFile] = useState<File | null>(null)
  const [docPreviewUrl, setDocPreviewUrl] = useState<string | null>(null)
  const [docUploadUrl, setDocUploadUrl] = useState<string | null>(null)
  const [docUploadPublicId, setDocUploadPublicId] = useState<string | null>(null)
  const [docUploading, setDocUploading] = useState(false)
  
  // Step 3: Optional Edits
  const [editData, setEditData] = useState({
    gameNick: "",
    city: "" as "" | "CGB-N" | "CGB-P" | "OKB-M",
    role: "" as "" | "user" | "cc" | "ld",
    password: "",
    confirmPassword: "",
  })
  const [showEditPassword, setShowEditPassword] = useState(false)
  const [showEditConfirmPassword, setShowEditConfirmPassword] = useState(false)
  
  // Global error
  const [error, setError] = useState("")
  const [errorType, setErrorType] = useState<ErrorType>('default')
  const [submitLoading, setSubmitLoading] = useState(false)

  const getErrorStyles = () => {
    switch (errorType) {
      case 'validation':
        return {
          container: "bg-yellow-500/15 border-2 border-yellow-500/40",
          text: "text-yellow-700 dark:text-yellow-300",
          icon: <AlertTriangle className="w-5 h-5 flex-shrink-0" />
        }
      case 'server_error':
        return {
          container: "bg-orange-500/15 border-2 border-orange-500/40",
          text: "text-orange-700 dark:text-orange-300",
          icon: <AlertCircle className="w-5 h-5 flex-shrink-0" />
        }
      default:
        return {
          container: "bg-red-500/15 border-2 border-red-500/40",
          text: "text-red-700 dark:text-red-300",
          icon: <AlertCircle className="w-5 h-5 flex-shrink-0" />
        }
    }
  }

  const errorStyles = getErrorStyles()

  // Step 1: Verify credentials
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setErrorType('default')
    setVerifyLoading(true)

    try {
      const res = await fetch("/api/account-recovery/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(verifyData),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Ошибка проверки")
        setErrorType('validation')
        return
      }

      setRecoveryToken(data.recoveryToken)
      setCurrentGameNick(data.gameNick || "")
      setEditData(prev => ({ ...prev, gameNick: data.gameNick || "" }))
      setStep("upload")
    } catch (err: any) {
      setError(err?.message || "Ошибка соединения")
      setErrorType('server_error')
    } finally {
      setVerifyLoading(false)
    }
  }

  // Step 2: Document validation and upload
  const validateDocFile = (file: File) => {
    const max = 5 * 1024 * 1024
    const allowed = new Set(["image/jpeg", "image/png", "image/webp"])
    if (file.size > max) return "Файл слишком большой (макс. 5MB)"
    if (!allowed.has(file.type)) return "Неподдерживаемый формат (JPG, PNG, WEBP)"
    return null
  }

  const deleteUploadedDoc = async (publicId: string) => {
    try {
      await fetch("/api/account-recovery/document", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId }),
      })
    } catch {
      // ignore cleanup errors
    }
  }

  const uploadDocFile = async (fileToUpload: File) => {
    setDocUploading(true)
    try {
      const form = new FormData()
      form.append("file", fileToUpload)

      const res = await fetch("/api/account-recovery/document", {
        method: "POST",
        body: form,
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error || "Не удалось загрузить документ")

      const url = data?.url as string | undefined
      const publicId = data?.publicId as string | undefined
      if (!url) throw new Error("Сервер не вернул ссылку")
      
      setDocUploadUrl(url)
      if (publicId) setDocUploadPublicId(publicId)
      return { url, publicId }
    } catch (e: any) {
      setError(e?.message || "Ошибка загрузки")
      setErrorType('server_error')
      return null
    } finally {
      setDocUploading(false)
    }
  }

  const onSelectDocFile = async (file: File | null) => {
    // Cleanup previous upload
    if (docUploadPublicId) {
      await deleteUploadedDoc(docUploadPublicId)
    }
    if (docPreviewUrl) URL.revokeObjectURL(docPreviewUrl)

    setDocPreviewUrl(null)
    setDocUploadUrl(null)
    setDocUploadPublicId(null)

    if (!file) {
      setDocFile(null)
      return
    }

    const err = validateDocFile(file)
    if (err) {
      setError(err)
      setErrorType('validation')
      setDocFile(null)
      return
    }

    setDocFile(file)
    const preview = URL.createObjectURL(file)
    setDocPreviewUrl(preview)

    // Auto upload immediately with the file we have
    const result = await uploadDocFile(file)
    if (!result) {
      // Reset on upload error
      setDocFile(null)
      URL.revokeObjectURL(preview)
      setDocPreviewUrl(null)
    }
  }

  const handleProceedToEdit = () => {
    if (!docUploadUrl) {
      setError("Загрузите документ для продолжения")
      setErrorType('validation')
      return
    }
    setStep("edit")
  }

  // Step 4: Submit recovery request
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setErrorType('default')
    setSubmitLoading(true)

    if (!recoveryToken || !docUploadUrl || !docUploadPublicId) {
      setError("Ошибка: отсутствуют данные для отправки")
      setErrorType('server_error')
      setSubmitLoading(false)
      return
    }

    // Validate password if provided
    if (editData.password && editData.password !== editData.confirmPassword) {
      setError("Пароли не совпадают")
      setErrorType('validation')
      setSubmitLoading(false)
      return
    }

    try {
      const payload: any = {
        recoveryToken,
        docUrl: docUploadUrl,
        docPublicId: docUploadPublicId,
      }

      if (editData.gameNick && editData.gameNick !== currentGameNick) {
        payload.gameNick = editData.gameNick
      }
      if (editData.city) {
        payload.city = editData.city
      }
      if (editData.role) {
        payload.role = editData.role
      }
      if (editData.password && editData.password.length >= 6) {
        payload.password = editData.password
      }

      const res = await fetch("/api/account-recovery/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Ошибка отправки")
        setErrorType('validation')
        return
      }

      setStep("success")
    } catch (err: any) {
      setError(err?.message || "Ошибка соединения")
      setErrorType('server_error')
    } finally {
      setSubmitLoading(false)
    }
  }

  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-4 mb-8">
      <div className={`flex items-center gap-2 ${step === "verify" ? "text-primary" : step === "success" ? "text-green-500" : "text-muted-foreground"}`}>
        <KeyRound className="w-5 h-5" />
        <span className="text-sm font-medium hidden sm:inline">Подтверждение</span>
      </div>
      <ArrowRight className="w-4 h-4 text-muted-foreground" />
      <div className={`flex items-center gap-2 ${step === "upload" ? "text-primary" : step === "edit" || step === "success" ? "text-green-500" : "text-muted-foreground"}`}>
        <Upload className="w-5 h-5" />
        <span className="text-sm font-medium hidden sm:inline">Документ</span>
      </div>
      <ArrowRight className="w-4 h-4 text-muted-foreground" />
      <div className={`flex items-center gap-2 ${step === "edit" ? "text-primary" : step === "success" ? "text-green-500" : "text-muted-foreground"}`}>
        <Edit3 className="w-5 h-5" />
        <span className="text-sm font-medium hidden sm:inline">Данные</span>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card border-2 border-border rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <KeyRound className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Восстановление аккаунта</h1>
          <p className="text-muted-foreground">
            Подтвердите владение аккаунтом и отправьте запрос на восстановление
          </p>
        </div>

        <StepIndicator />

        {error && (
          <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 transition-all ${errorStyles.container}`}>
            <div className={errorStyles.text}>{errorStyles.icon}</div>
            <span className={`text-sm ${errorStyles.text}`}>{error}</span>
          </div>
        )}

        {/* Step 1: Verify */}
        {step === "verify" && (
          <form onSubmit={handleVerify} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Логин
              </label>
              <input
                type="text"
                value={verifyData.username}
                onChange={(e) => setVerifyData({ ...verifyData, username: e.target.value })}
                className="w-full px-4 py-3 bg-input border-2 border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                placeholder="Введите логин"
                required
                disabled={verifyLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Пароль
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={verifyData.password}
                  onChange={(e) => setVerifyData({ ...verifyData, password: e.target.value })}
                  className="w-full px-4 py-3 bg-input border-2 border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors pr-12"
                  placeholder="Введите пароль"
                  required
                  disabled={verifyLoading}
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

            <button
              type="submit"
              disabled={verifyLoading}
              className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {verifyLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Проверка...
                </>
              ) : (
                <>
                  Продолжить
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <div className="text-center pt-4">
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Вернуться на вход
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Upload Document */}
        {step === "upload" && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Документ фракции <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-muted-foreground mb-3">
                Прикрепите скриншот удостоверения фракции из игры. Форматы: JPG/PNG/WEBP, до 5MB.
              </p>

              <input
                ref={docFileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => onSelectDocFile(e.target.files?.[0] || null)}
                disabled={docUploading}
                className="hidden"
              />

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => docFileInputRef.current?.click()}
                  disabled={docUploading}
                  className="px-4 py-3 rounded-lg border-2 border-border bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center gap-2">
                    <FileImage className="w-4 h-4" />
                    Выбрать файл
                  </div>
                </button>
                <div className="text-sm text-muted-foreground truncate flex-1">
                  {docFile ? docFile.name : "Файл не выбран"}
                </div>
              </div>

              {docPreviewUrl && (
                <div className="mt-3">
                  <img
                    src={docPreviewUrl}
                    alt="preview"
                    className="w-full max-h-56 object-contain rounded-lg border-2 border-border"
                  />
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={async () => {
                        if (docUploadPublicId) {
                          await deleteUploadedDoc(docUploadPublicId)
                        }
                        onSelectDocFile(null)
                      }}
                      disabled={docUploading}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                    >
                      <X className="w-4 h-4" />
                      Удалить
                    </button>
                    <div className="text-xs text-muted-foreground">
                      {docUploading ? "Загрузка..." : docUploadUrl ? "Загружено" : "Ожидает загрузки"}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep("verify")}
                disabled={docUploading}
                className="flex-1 px-6 py-3 border-2 border-border rounded-lg hover:bg-muted transition-all font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Назад
              </button>
              <button
                type="button"
                onClick={handleProceedToEdit}
                disabled={docUploading || !docUploadUrl}
                className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Продолжить
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Edit Data */}
        {step === "edit" && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="bg-muted/50 rounded-lg p-4 mb-4">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Текущий игровой ник:</strong> {currentGameNick}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Вы можете изменить данные ниже или оставить как есть
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Игровой ник (опционально)
              </label>
              <input
                type="text"
                value={editData.gameNick}
                onChange={(e) => setEditData({ ...editData, gameNick: e.target.value })}
                className="w-full px-4 py-3 bg-input border-2 border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                placeholder={currentGameNick}
                disabled={submitLoading}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Формат: Имя_Фамилия (только английские буквы)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Город (опционально)
              </label>
              <select
                value={editData.city}
                onChange={(e) => setEditData({ ...editData, city: e.target.value as any })}
                className="w-full px-4 py-3 bg-input border-2 border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                disabled={submitLoading}
              >
                <option value="">Не изменять</option>
                <option value="CGB-N">ЦГБ-Н (Невский)</option>
                <option value="CGB-P">ЦГБ-П (Приволжский)</option>
                <option value="OKB-M">ОКБ-М (Мирный)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Роль (опционально)
              </label>
              <select
                value={editData.role}
                onChange={(e) => setEditData({ ...editData, role: e.target.value as any })}
                className="w-full px-4 py-3 bg-input border-2 border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                disabled={submitLoading}
              >
                <option value="">Не изменять</option>
                <option value="user">User (Пользователь)</option>
                <option value="cc">CC (Command Center)</option>
                <option value="ld">LD (Лидер)</option>
              </select>
              <p className="text-xs text-muted-foreground mt-1">
                Только для изменения роли с участника на CC или LD
              </p>
            </div>

            <div className="border-t border-border pt-5">
              <p className="text-sm font-medium text-foreground mb-3">Смена пароля (опционально)</p>

              <div className="mb-3">
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Новый пароль
                </label>
                <div className="relative">
                  <input
                    type={showEditPassword ? "text" : "password"}
                    value={editData.password}
                    onChange={(e) => setEditData({ ...editData, password: e.target.value })}
                    className="w-full px-4 py-3 bg-input border-2 border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors pr-12"
                    placeholder="Минимум 6 символов"
                    minLength={6}
                    disabled={submitLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowEditPassword(!showEditPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showEditPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {editData.password && (
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Подтвердите новый пароль
                  </label>
                  <div className="relative">
                    <input
                      type={showEditConfirmPassword ? "text" : "password"}
                      value={editData.confirmPassword}
                      onChange={(e) => setEditData({ ...editData, confirmPassword: e.target.value })}
                      className="w-full px-4 py-3 bg-input border-2 border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors pr-12"
                      placeholder="Повторите пароль"
                      disabled={submitLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowEditConfirmPassword(!showEditConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showEditConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep("upload")}
                disabled={submitLoading}
                className="flex-1 px-6 py-3 border-2 border-border rounded-lg hover:bg-muted transition-all font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Назад
              </button>
              <button
                type="submit"
                disabled={submitLoading}
                className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Отправка...
                  </>
                ) : (
                  <>
                    Отправить
                    <CheckCircle className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Step 4: Success */}
        {step === "success" && (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="p-4 bg-green-500/20 rounded-full">
                <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Запрос отправлен!</h2>
              <p className="text-muted-foreground">
                Ваш запрос на восстановление аккаунта отправлен на рассмотрение администратору.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Вы получите доступ после одобрения запроса.
              </p>
            </div>
            <button
              onClick={() => router.push("/login")}
              className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all font-medium"
            >
              Вернуться на страницу входа
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
