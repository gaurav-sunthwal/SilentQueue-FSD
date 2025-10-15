"use client"

import { useState, useEffect, useCallback } from "react"
import { useGeolocation } from "./use-geolocation"

interface ProximityAlert {
  id: string
  businessId: string
  businessName: string
  businessLat: number
  businessLon: number
  alertDistance: number // in kilometers
  isActive: boolean
}

interface UseProximityAlertsProps {
  alerts: ProximityAlert[]
  onProximityReached?: (alert: ProximityAlert, distance: number) => void
}

export function useProximityAlerts({ alerts, onProximityReached }: UseProximityAlertsProps) {
  const [triggeredAlerts, setTriggeredAlerts] = useState<Set<string>>(new Set())
  const [watchId, setWatchId] = useState<number | null>(null)
  const { latitude, longitude, watchPosition, clearWatch, calculateDistance } = useGeolocation()

  const checkProximity = useCallback(() => {
    if (!latitude || !longitude) return

    alerts.forEach((alert) => {
      if (!alert.isActive || triggeredAlerts.has(alert.id)) return

      const distance = calculateDistance(alert.businessLat, alert.businessLon)

      if (distance !== null && distance <= alert.alertDistance) {
        console.log("[v0] Proximity alert triggered for:", alert.businessName, "Distance:", distance.toFixed(2), "km")

        setTriggeredAlerts((prev) => new Set(prev).add(alert.id))
        onProximityReached?.(alert, distance)
      }
    })
  }, [latitude, longitude, alerts, triggeredAlerts, calculateDistance, onProximityReached])

  const startWatching = useCallback(() => {
    if (watchId) return // Already watching

    const id = watchPosition()
    if (id) {
      setWatchId(id)
      console.log("[v0] Started watching location for proximity alerts")
    }
  }, [watchPosition, watchId])

  const stopWatching = useCallback(() => {
    if (watchId) {
      clearWatch(watchId)
      setWatchId(null)
      console.log("[v0] Stopped watching location")
    }
  }, [watchId, clearWatch])

  const resetAlert = useCallback((alertId: string) => {
    setTriggeredAlerts((prev) => {
      const newSet = new Set(prev)
      newSet.delete(alertId)
      return newSet
    })
  }, [])

  const resetAllAlerts = useCallback(() => {
    setTriggeredAlerts(new Set())
  }, [])

  // Check proximity whenever location changes
  useEffect(() => {
    checkProximity()
  }, [checkProximity])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchId) {
        clearWatch(watchId)
      }
    }
  }, [watchId, clearWatch])

  return {
    startWatching,
    stopWatching,
    resetAlert,
    resetAllAlerts,
    isWatching: watchId !== null,
    triggeredAlerts: Array.from(triggeredAlerts),
  }
}
