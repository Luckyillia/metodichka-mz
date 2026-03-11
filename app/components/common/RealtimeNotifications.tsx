"use client"

import { useEffect, useState, useCallback } from "react"
import { createClient } from "@supabase/supabase-js"
import { Bell, X, CheckCircle, AlertCircle, Info } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  timestamp: number
  read: boolean
  link?: string
}

export function RealtimeNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [supabase, setSupabase] = useState<any>(null)

  // Initialize Supabase client
  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (supabaseUrl && supabaseKey) {
      setSupabase(createClient(supabaseUrl, supabaseKey))
    }
  }, [])

  // Subscribe to real-time changes
  useEffect(() => {
    if (!supabase) return

    const subscription = supabase
      .channel("system-notifications")
      .on("postgres_changes", { 
        event: "INSERT", 
        schema: "public", 
        table: "notifications" 
      }, (payload: any) => {
        const newNotification: Notification = {
          id: payload.new.id,
          title: payload.new.title,
          message: payload.new.message,
          type: payload.new.type || "info",
          timestamp: new Date(payload.new.created_at).getTime(),
          read: false,
          link: payload.new.link
        }
        
        setNotifications(prev => [newNotification, ...prev])
        setUnreadCount(prev => prev + 1)
        
        // Show browser notification if permitted
        if (Notification.permission === "granted") {
          new Notification(newNotification.title, {
            body: newNotification.message,
            icon: "/favicon.png"
          })
        }
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  // Request notification permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }
  }, [])

  // Load stored notifications
  useEffect(() => {
    const stored = localStorage.getItem("mz-notifications")
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setNotifications(parsed)
        setUnreadCount(parsed.filter((n: Notification) => !n.read).length)
      } catch {
        console.error("Failed to parse notifications")
      }
    }
  }, [])

  // Save notifications
  useEffect(() => {
    localStorage.setItem("mz-notifications", JSON.stringify(notifications))
  }, [notifications])

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
    const wasUnread = notifications.find(n => n.id === id)?.read === false
    if (wasUnread) {
      setUnreadCount(prev => Math.max(0, prev - 1))
    }
  }, [notifications])

  const clearAll = useCallback(() => {
    setNotifications([])
    setUnreadCount(0)
  }, [])

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />
      default:
        return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  const getBgColor = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "bg-green-500/10 border-green-500/30"
      case "warning":
        return "bg-yellow-500/10 border-yellow-500/30"
      case "error":
        return "bg-red-500/10 border-red-500/30"
      default:
        return "bg-blue-500/10 border-blue-500/30"
    }
  }

  return (
    <>
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 hover:bg-muted rounded-lg transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-80 bg-card border-l-2 border-border z-50 shadow-2xl"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b-2 border-border">
                  <div className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-primary" />
                    <h2 className="font-semibold text-foreground">Уведомления</h2>
                    {unreadCount > 0 && (
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-muted rounded transition-colors"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>

                {/* Actions */}
                {notifications.length > 0 && (
                  <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-muted/30">
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-primary hover:underline"
                      disabled={unreadCount === 0}
                    >
                      Отметить все прочитанными
                    </button>
                    <span className="text-muted-foreground">|</span>
                    <button
                      onClick={clearAll}
                      className="text-xs text-destructive hover:underline"
                    >
                      Очистить все
                    </button>
                  </div>
                )}

                {/* Notifications List */}
                <div className="flex-1 overflow-y-auto p-4">
                  {notifications.length === 0 ? (
                    <div className="text-center py-8">
                      <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                      <p className="text-muted-foreground text-sm">
                        Нет уведомлений
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Здесь будут появляться важные сообщения
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {notifications.map((notification) => (
                        <motion.div
                          key={notification.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -100 }}
                          className={`relative p-3 rounded-lg border-2 transition-all ${
                            notification.read
                              ? "bg-muted/30 border-border"
                              : getBgColor(notification.type)
                          }`}
                          onClick={() => {
                            markAsRead(notification.id)
                            if (notification.link) {
                              window.open(notification.link, "_blank")
                            }
                          }}
                        >
                          <div className="flex items-start gap-3">
                            {getIcon(notification.type)}
                            <div className="flex-1 min-w-0">
                              <p className={`font-medium text-sm ${
                                notification.read ? "text-muted-foreground" : "text-foreground"
                              }`}>
                                {notification.title}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {notification.message}
                              </p>
                              <p className="text-[10px] text-muted-foreground mt-2">
                                {new Date(notification.timestamp).toLocaleString("ru-RU")}
                              </p>
                            </div>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                            )}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              removeNotification(notification.id)
                            }}
                            className="absolute top-2 right-2 p-1 hover:bg-background/50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
