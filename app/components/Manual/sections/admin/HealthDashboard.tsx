"use client"

import { useState, useEffect } from "react"
import { 
  Activity, 
  Database, 
  Server, 
  Users, 
  Clock, 
  AlertCircle, 
  CheckCircle,
  RefreshCw,
  HardDrive,
  Wifi,
  Cpu
} from "lucide-react"
import { motion } from "framer-motion"

interface HealthStatus {
  api: "healthy" | "warning" | "error"
  database: "healthy" | "warning" | "error"
  storage: "healthy" | "warning" | "error"
  responseTime: number
  lastChecked: Date
  activeUsers: number
  dbSize: string
  uptime: string
}

export function HealthDashboard() {
  const [status, setStatus] = useState<HealthStatus>({
    api: "healthy",
    database: "healthy",
    storage: "healthy",
    responseTime: 0,
    lastChecked: new Date(),
    activeUsers: 0,
    dbSize: "0 MB",
    uptime: "0d 0h"
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkHealth = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const start = performance.now()
      const response = await fetch("/api/health")
      const end = performance.now()
      
      if (!response.ok) {
        throw new Error("Health check failed")
      }
      
      const data = await response.json()
      
      setStatus({
        api: data.api || "healthy",
        database: data.database || "healthy",
        storage: data.storage || "healthy",
        responseTime: Math.round(end - start),
        lastChecked: new Date(),
        activeUsers: data.activeUsers || 0,
        dbSize: data.dbSize || "0 MB",
        uptime: data.uptime || "0d 0h"
      })
    } catch (err) {
      setError("Не удалось получить статус системы")
      setStatus(prev => ({
        ...prev,
        api: "error",
        database: "error",
        lastChecked: new Date()
      }))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkHealth()
    const interval = setInterval(checkHealth, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-500 bg-green-500/10 border-green-500/30"
      case "warning":
        return "text-yellow-500 bg-yellow-500/10 border-yellow-500/30"
      case "error":
        return "text-red-500 bg-red-500/10 border-red-500/30"
      default:
        return "text-gray-500 bg-gray-500/10 border-gray-500/30"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="w-5 h-5" />
      case "warning":
        return <AlertCircle className="w-5 h-5" />
      case "error":
        return <AlertCircle className="w-5 h-5" />
      default:
        return <Activity className="w-5 h-5" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Activity className="w-6 h-6 text-primary" />
          Состояние системы
        </h1>
        <button
          onClick={checkHealth}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          Обновить
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border-2 border-red-500/30 rounded-lg text-red-700 dark:text-red-300 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg border-2 ${getStatusColor(status.api)}`}
        >
          <div className="flex items-center gap-3 mb-2">
            <Server className="w-5 h-5" />
            <span className="font-medium">API</span>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(status.api)}
            <span className="text-sm capitalize">
              {status.api === "healthy" ? "Работает" : status.api === "warning" ? "Внимание" : "Ошибка"}
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`p-4 rounded-lg border-2 ${getStatusColor(status.database)}`}
        >
          <div className="flex items-center gap-3 mb-2">
            <Database className="w-5 h-5" />
            <span className="font-medium">База данных</span>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(status.database)}
            <span className="text-sm capitalize">
              {status.database === "healthy" ? "Работает" : status.database === "warning" ? "Внимание" : "Ошибка"}
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`p-4 rounded-lg border-2 ${getStatusColor(status.storage)}`}
        >
          <div className="flex items-center gap-3 mb-2">
            <HardDrive className="w-5 h-5" />
            <span className="font-medium">Хранилище</span>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(status.storage)}
            <span className="text-sm capitalize">
              {status.storage === "healthy" ? "Работает" : status.storage === "warning" ? "Внимание" : "Ошибка"}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border-2 border-border rounded-lg p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Wifi className="w-4 h-4" />
            <span className="text-sm">Время отклика</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {status.responseTime}ms
          </p>
        </div>

        <div className="bg-card border-2 border-border rounded-lg p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Users className="w-4 h-4" />
            <span className="text-sm">Активные пользователи</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {status.activeUsers}
          </p>
        </div>

        <div className="bg-card border-2 border-border rounded-lg p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <HardDrive className="w-4 h-4" />
            <span className="text-sm">Размер БД</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {status.dbSize}
          </p>
        </div>

        <div className="bg-card border-2 border-border rounded-lg p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Uptime</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {status.uptime}
          </p>
        </div>
      </div>

      {/* Last Checked */}
      <div className="text-center text-sm text-muted-foreground">
        Последняя проверка: {status.lastChecked.toLocaleString("ru-RU")}
      </div>

      {/* System Info */}
      <div className="bg-muted/50 rounded-lg p-4">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Cpu className="w-4 h-4" />
          Информация о системе
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Окружение:</span>
            <span className="ml-2 font-medium">{process.env.NODE_ENV || "development"}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Версия Next.js:</span>
            <span className="ml-2 font-medium">16.x</span>
          </div>
          <div>
            <span className="text-muted-foreground">React:</span>
            <span className="ml-2 font-medium">18.x</span>
          </div>
          <div>
            <span className="text-muted-foreground">TypeScript:</span>
            <span className="ml-2 font-medium">5.x</span>
          </div>
        </div>
      </div>
    </div>
  )
}
