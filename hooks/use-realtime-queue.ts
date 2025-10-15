"use client"

import { useState, useEffect, useCallback } from "react"
import useSWR from "swr"

interface QueueUpdate {
  type: "position_change" | "queue_status" | "notification" | "business_update"
  data: any
  timestamp: number
}

interface UseRealtimeQueueProps {
  businessId?: string
  userId?: string
}

export function useRealtimeQueue({ businessId, userId }: UseRealtimeQueueProps = {}) {
  const [isConnected, setIsConnected] = useState(false)
  const [queuePosition, setQueuePosition] = useState<number | null>(null)
  const [estimatedWait, setEstimatedWait] = useState<string | null>(null)
  const [notifications, setNotifications] = useState<any[]>([])
  const [queueData, setQueueData] = useState<any[]>([])
  const [entryId, setEntryId] = useState<number | null>(null)

  const fetcher = (url: string) => fetch(url).then((r) => r.json())
  const { data: statusData } = useSWR(entryId ? `/api/queue/status?entryId=${entryId}` : null, fetcher, {
    refreshInterval: 4000,
  })

  useEffect(() => {
    console.log("[v0] Establishing real-time connection...")
    setIsConnected(true)

    return () => {
      setIsConnected(false)
      console.log("[v0] Real-time connection closed")
    }
  }, [])

  useEffect(() => {
    if (statusData?.position != null) {
      setQueuePosition(statusData.position)
      const minutes = statusData.estimatedWaitMinutes ?? 0
      setEstimatedWait(`${minutes} min`)
    }
  }, [statusData])

  const sendUpdate = useCallback((update: QueueUpdate) => {
    console.log("[v0] Sending update:", update)
    // In a real app, this would send to WebSocket server
  }, [])

  const joinQueue = useCallback(async (bizId: string, opts?: { name?: string; phone?: string }) => {
    console.log("[v0] Joining queue for business:", bizId)
    try {
      const res = await fetch("/api/queue/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId: Number(bizId), name: opts?.name, phone: opts?.phone }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || "Failed to join")
      setEntryId(json.entryId)
      setQueuePosition(json.position)
      setEstimatedWait(`${json.estimatedWaitMinutes} min`)
      const notification = {
        id: Date.now(),
        type: "queue_joined",
        message: "You've successfully joined the queue!",
        timestamp: Date.now(),
      }
      setNotifications((prev) => [notification, ...prev])
    } catch (e: any) {
      console.error("[v0] joinQueue error:", e?.message)
    }
  }, [])

  const leaveQueue = useCallback(async () => {
    console.log("[v0] Leaving queue")
    try {
      if (entryId) {
        await fetch("/api/queue/leave", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ entryId }),
        })
      }
    } catch {}
    setEntryId(null)
    setQueuePosition(null)
    setEstimatedWait(null)
    const notification = {
      id: Date.now(),
      type: "queue_left",
      message: "You've left the queue",
      timestamp: Date.now(),
    }
    setNotifications((prev) => [notification, ...prev])
  }, [entryId])

  return {
    isConnected,
    queuePosition,
    estimatedWait,
    notifications,
    queueData,
    sendUpdate,
    joinQueue,
    leaveQueue,
  }
}
