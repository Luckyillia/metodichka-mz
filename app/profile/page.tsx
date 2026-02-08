"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import Cropper, { type Area } from "react-easy-crop"
import { Loader2, Upload, Trash2, Save, ArrowLeft, Shield } from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"
import { AuthService } from "@/lib/auth/auth-service"
import { emitUserUpdated } from "@/lib/auth/user-events"
import { getCroppedImageBlob } from "@/lib/image/crop-image"
import { ImagePreviewModal } from "@/app/components/common/ImagePreviewModal"

type ToastType = "success" | "error" | "info"

function initialsFromNick(nick: string) {
  const parts = nick.split(/[_\s]+/).filter(Boolean)
  const a = parts[0]?.[0] || "U"
  const b = parts[1]?.[0] || ""
  return (a + b).toUpperCase()
}

function useToast() {
  const [msg, setMsg] = useState<string>("")
  const [type, setType] = useState<ToastType>("info")

  const show = (t: ToastType, m: string) => {
    setType(t)
    setMsg(m)
    window.setTimeout(() => setMsg(""), 3500)
  }

  return { msg, type, show }
}

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth()
  const { msg, type, show } = useToast()

  const [avatarPreviewOpen, setAvatarPreviewOpen] = useState(false)

  const [username, setUsername] = useState("")
  const [gameNick, setGameNick] = useState("")

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")

  const [isSavingProfile, setIsSavingProfile] = useState(false)

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isGif, setIsGif] = useState(false)

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (user) {
      setUsername(user.username)
      setGameNick(user.game_nick)
    }
  }, [user])

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const canView = isAuthenticated && user

  const avatarContent = useMemo(() => {
    if (!user) return null
    if (user.avatar_url) {
      return (
        <button
          type="button"
          onClick={() => setAvatarPreviewOpen(true)}
          className="hover:opacity-90 transition-opacity"
          title="Открыть аватар"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={user.avatar_url}
            alt="avatar"
            className="w-20 h-20 rounded-full object-cover border-2 border-border"
          />
        </button>
      )
    }
    return (
      <div className="w-20 h-20 rounded-full bg-secondary border-2 border-border flex items-center justify-center text-foreground font-semibold text-lg">
        {initialsFromNick(user.game_nick)}
      </div>
    )
  }, [user])

  const validateFile = (file: File) => {
    const max = 10 * 1024 * 1024
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"]

    if (file.size > max) {
      show("error", "Файл слишком большой (макс. 10MB)")
      return false
    }

    if (!allowed.includes(file.type)) {
      show("error", "Неподдерживаемый формат (jpg/png/webp/gif)")
      return false
    }

    return true
  }

  const onPickFile = (file: File | null) => {
    if (!file) return
    if (!validateFile(file)) return

    if (previewUrl) URL.revokeObjectURL(previewUrl)

    const fileIsGif = file.type === "image/gif"
    setIsGif(fileIsGif)
    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    setZoom(1)
    setCrop({ x: 0, y: 0 })
    setCroppedAreaPixels(null)
  }

  const uploadAvatar = async () => {
    if (!selectedFile || !previewUrl) {
      show("error", "Выберите файл")
      return
    }

    // GIF загружаем БЕЗ кадрирования
    if (isGif) {
      if (!selectedFile) {
        show("error", "Файл не найден")
        return
      }
    } else {
      // Для JPG/PNG/WebP требуется кадрирование
      if (!croppedAreaPixels) {
        show("error", "Кадрируйте изображение")
        return
      }
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      let fileToUpload: File

      if (isGif) {
        // GIF — загружаем как есть
        fileToUpload = selectedFile
      } else {
        // Остальное — кадрируем
        const blob = await getCroppedImageBlob(previewUrl, croppedAreaPixels!)
        fileToUpload = new File([blob], selectedFile.name, { type: blob.type })
      }

      const form = new FormData()
      form.append("file", fileToUpload)

      const token = AuthService.getAuthToken()
      if (!token) {
        show("error", "Нет токена авторизации")
        return
      }

      const xhr = new XMLHttpRequest()
      const promise = new Promise<any>((resolve, reject) => {
        xhr.upload.onprogress = (e) => {
          if (!e.lengthComputable) return
          setUploadProgress(Math.round((e.loaded / e.total) * 100))
        }

        xhr.onload = () => {
          try {
            const data = JSON.parse(xhr.responseText || "{}")
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve(data)
            } else {
              reject(new Error(data.error || "Ошибка загрузки"))
            }
          } catch (e) {
            reject(new Error("Невалидный ответ сервера"))
          }
        }

        xhr.onerror = () => reject(new Error("Ошибка сети"))
      })

      xhr.open("POST", "/api/user/avatar")
      xhr.setRequestHeader("Authorization", `Bearer ${token}`)
      xhr.send(form)

      const data = await promise

      if (data?.user) {
        const newToken = AuthService.createAuthToken(data.user)
        AuthService.saveEncryptedUser(newToken)
        emitUserUpdated()
      }

      setSelectedFile(null)
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
      setPreviewUrl(null)
      setUploadProgress(0)
      setIsGif(false)

      show("success", isGif ? "GIF аватар обновлён (анимация сохранена)" : "Аватар обновлён")
    } catch (e: any) {
      show("error", e?.message || "Не удалось загрузить аватар")
    } finally {
      setIsUploading(false)
    }
  }

  const deleteAvatar = async () => {
    setIsUploading(true)
    setUploadProgress(0)

    try {
      const response = await AuthService.fetchWithAuth("/api/user/avatar", {
        method: "DELETE",
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Не удалось удалить аватар")
      }

      if (data?.user) {
        const newToken = AuthService.createAuthToken(data.user)
        AuthService.saveEncryptedUser(newToken)
        emitUserUpdated()
      }

      show("success", "Аватар удалён")
    } catch (e: any) {
      show("error", e?.message || "Ошибка удаления")
    } finally {
      setIsUploading(false)
    }
  }

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentPassword) {
      show("error", "Введите текущий пароль")
      return
    }

    setIsSavingProfile(true)

    try {
      const response = await AuthService.fetchWithAuth("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          gameNick,
          currentPassword,
          newPassword: newPassword || undefined,
          confirmNewPassword: confirmNewPassword || undefined,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Не удалось обновить профиль")
      }

      if (data?.user) {
        const newToken = AuthService.createAuthToken(data.user)
        AuthService.saveEncryptedUser(newToken)
        emitUserUpdated()
      }

      setCurrentPassword("")
      setNewPassword("")
      setConfirmNewPassword("")

      show("success", "Профиль обновлён")
    } catch (e: any) {
      show("error", e?.message || "Ошибка")
    } finally {
      setIsSavingProfile(false)
    }
  }

  if (!canView) {
    return (
      <div className="min-h-screen bg-background">
        <main className="flex items-center justify-center px-6 py-12 min-h-screen">
          <div className="w-full max-w-md modern-card text-center">
            <Shield className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-semibold text-foreground mb-2">Нужна авторизация</h1>
            <p className="text-muted-foreground mb-6">Войдите в аккаунт, чтобы открыть личный кабинет.</p>
            <Link href="/login" className="modern-button inline-flex items-center justify-center">
              Войти
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="px-6 py-6 border-b border-border">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-semibold text-foreground">Личный кабинет</h1>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {msg && (
          <div
            className={`border-2 rounded-lg px-4 py-3 text-sm transition-all ${
              type === "success"
                ? "bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400"
                : type === "error"
                ? "bg-destructive/10 border-destructive/30 text-destructive"
                : "bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-300"
            }`}
          >
            {msg}
          </div>
        )}

        <section className="modern-card">
          <div className="flex items-center justify-between gap-6 flex-wrap py-4">
            <div className="flex items-center gap-5">
              {avatarContent}
              <div>
                <div className="text-lg font-semibold text-foreground">{user.game_nick}</div>
                <div className="text-sm text-muted-foreground">{user.username}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Форматы: JPG, PNG, WEBP, GIF. Максимум: 5MB.
                </div>
                {isGif && (
                  <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1 font-semibold">
                    ⚡ GIF загружается без кадрирования (анимация сохраняется)
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={(e) => onPickFile(e.target.files?.[0] || null)}
                disabled={isUploading}
              />
              <button
                type="button"
                className="px-5 py-2.5 bg-secondary text-secondary-foreground rounded-xl hover:bg-secondary/80 transition-all border-2 border-border inline-flex items-center gap-2"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                <Upload className="w-4 h-4" />
                Выбрать фото
              </button>

              <button
                type="button"
                className="px-5 py-2.5 bg-destructive text-destructive-foreground rounded-xl hover:opacity-90 transition-all border-2 border-destructive inline-flex items-center gap-2 disabled:opacity-50"
                onClick={deleteAvatar}
                disabled={isUploading || !user.avatar_url}
              >
                <Trash2 className="w-4 h-4" />
                Удалить
              </button>
            </div>
          </div>

          {previewUrl && !isGif && (
            <div className="mt-6">
              <div className="text-sm text-muted-foreground mb-3">
                Перетащи изображение и настрой зум, чтобы кадрировать 1:1.
              </div>
              <div className="relative w-full h-[320px] bg-muted rounded-xl overflow-hidden border-2 border-border">
                <Cropper
                  image={previewUrl}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={(_, areaPixels) => setCroppedAreaPixels(areaPixels)}
                />
              </div>

              <div className="mt-4 flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <label className="text-sm text-muted-foreground">Zoom</label>
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.01}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-56"
                  />
                </div>

                <button
                  type="button"
                  className="modern-button inline-flex items-center gap-2 disabled:opacity-50"
                  onClick={uploadAvatar}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Загрузка...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Сохранить аватар
                    </>
                  )}
                </button>
              </div>

              {isUploading && (
                <div className="mt-4">
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden border border-border">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{uploadProgress}%</div>
                </div>
              )}
            </div>
          )}

          {previewUrl && isGif && (
            <div className="mt-6">
              <div className="text-sm text-yellow-600 dark:text-yellow-400 mb-3 font-semibold">
                ⚡ GIF-анимация сохранится без изменений (кадрирование недоступно)
              </div>
              <div className="relative w-full max-w-md mx-auto">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="GIF preview"
                  className="w-full h-auto rounded-xl border-2 border-border"
                />
              </div>

              <div className="mt-4 flex items-center justify-center">
                <button
                  type="button"
                  className="modern-button inline-flex items-center gap-2 disabled:opacity-50"
                  onClick={uploadAvatar}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Загрузка...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Загрузить GIF аватар
                    </>
                  )}
                </button>
              </div>

              {isUploading && (
                <div className="mt-4">
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden border border-border">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 text-center">{uploadProgress}%</div>
                </div>
              )}
            </div>
          )}
        </section>

        <section className="modern-card">
          <h2 className="text-xl font-semibold text-foreground mb-6">Настройки профиля</h2>

          <form onSubmit={saveProfile} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Логин</label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-input border-2 border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                  disabled={isSavingProfile}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Никнейм</label>
                <input
                  value={gameNick}
                  onChange={(e) => setGameNick(e.target.value)}
                  className="w-full px-4 py-3 bg-input border-2 border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors font-mono"
                  disabled={isSavingProfile}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Текущий пароль</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-input border-2 border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                  disabled={isSavingProfile}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Новый пароль</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-input border-2 border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                  disabled={isSavingProfile}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Подтверждение</label>
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-input border-2 border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                  disabled={isSavingProfile}
                />
              </div>
            </div>

            <div className="flex items-center justify-end">
              <button
                type="submit"
                disabled={isSavingProfile}
                className="modern-button inline-flex items-center gap-2 disabled:opacity-50"
              >
                {isSavingProfile ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Сохранение...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Сохранить изменения
                  </>
                )}
              </button>
            </div>
          </form>
        </section>
      </main>

      <ImagePreviewModal
        isOpen={avatarPreviewOpen}
        src={user?.avatar_url || null}
        title={user?.game_nick || ""}
        onClose={() => setAvatarPreviewOpen(false)}
      />
    </div>
  )
}