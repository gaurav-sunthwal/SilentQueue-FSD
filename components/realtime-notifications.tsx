"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, X, Clock, Users, CheckCircle, AlertTriangle } from "lucide-react"

interface Notification {
  id: number
  type: "queue_update" | "queue_joined" | "queue_left" | "turn_soon" | "turn_now"
  message: string
  timestamp: number
}

interface RealtimeNotificationsProps {
  notifications: Notification[]
  onDismiss?: (id: number) => void
}

export function RealtimeNotifications({ notifications, onDismiss }: RealtimeNotificationsProps) {
  const [visibleNotifications, setVisibleNotifications] = useState<Notification[]>([])

  useEffect(() => {
    setVisibleNotifications(notifications.slice(0, 3)) // Show max 3 notifications
  }, [notifications])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "queue_joined":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "queue_update":
        return <Clock className="w-5 h-5 text-blue-600" />
      case "turn_soon":
        return <AlertTriangle className="w-5 h-5 text-orange-600" />
      case "turn_now":
        return <Bell className="w-5 h-5 text-red-600" />
      default:
        return <Users className="w-5 h-5 text-gray-600" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "queue_joined":
        return "border-green-200 bg-green-50"
      case "queue_update":
        return "border-blue-200 bg-blue-50"
      case "turn_soon":
        return "border-orange-200 bg-orange-50"
      case "turn_now":
        return "border-red-200 bg-red-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  const handleDismiss = (id: number) => {
    setVisibleNotifications((prev) => prev.filter((n) => n.id !== id))
    onDismiss?.(id)
  }

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      <AnimatePresence>
        {visibleNotifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Card className={`${getNotificationColor(notification.type)} border-2 shadow-lg`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        {new Date(notification.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDismiss(notification.id)}
                    className="h-6 w-6 p-0 hover:bg-white/50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
