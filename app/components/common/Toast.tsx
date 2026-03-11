"use client"

import { useCallback } from "react"
import { toast } from "sonner"
import { CheckCircle, AlertCircle, Info, AlertTriangle, XCircle, Copy, Save, Trash2 } from "lucide-react"

// Custom toast styles matching the app theme
const toastStyles = {
  success: {
    icon: <CheckCircle className="w-5 h-5 text-green-500" />,
    className: "bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-300"
  },
  error: {
    icon: <XCircle className="w-5 h-5 text-red-500" />,
    className: "bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300"
  },
  warning: {
    icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
    className: "bg-yellow-500/10 border-yellow-500/30 text-yellow-700 dark:text-yellow-300"
  },
  info: {
    icon: <Info className="w-5 h-5 text-blue-500" />,
    className: "bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-300"
  }
}

export function useToast() {
  const showSuccess = useCallback((message: string, description?: string) => {
    toast.success(message, {
      description,
      icon: toastStyles.success.icon,
      className: toastStyles.success.className
    })
  }, [])

  const showError = useCallback((message: string, description?: string) => {
    toast.error(message, {
      description,
      icon: toastStyles.error.icon,
      className: toastStyles.error.className
    })
  }, [])

  const showWarning = useCallback((message: string, description?: string) => {
    toast.warning(message, {
      description,
      icon: toastStyles.warning.icon,
      className: toastStyles.warning.className
    })
  }, [])

  const showInfo = useCallback((message: string, description?: string) => {
    toast.info(message, {
      description,
      icon: toastStyles.info.icon,
      className: toastStyles.info.className
    })
  }, [])

  const showCopied = useCallback((text: string = "Текст скопирован") => {
    toast.success(text, {
      icon: <Copy className="w-5 h-5 text-green-500" />,
      duration: 2000,
      className: toastStyles.success.className
    })
  }, [])

  const showSaved = useCallback(() => {
    toast.success("Сохранено", {
      icon: <Save className="w-5 h-5 text-green-500" />,
      duration: 2000,
      className: toastStyles.success.className
    })
  }, [])

  const showDeleted = useCallback(() => {
    toast.success("Удалено", {
      icon: <Trash2 className="w-5 h-5 text-green-500" />,
      duration: 2000,
      className: toastStyles.success.className
    })
  }, [])

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showCopied,
    showSaved,
    showDeleted
  }
}

// Toast Provider wrapper component
export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
    </>
  )
}
