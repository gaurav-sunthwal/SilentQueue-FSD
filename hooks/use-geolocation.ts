"use client"

import { useState, useCallback } from "react"

interface GeolocationState {
  latitude: number | null
  longitude: number | null
  accuracy: number | null
  error: string | null
  loading: boolean
}

interface UseGeolocationOptions {
  enableHighAccuracy?: boolean
  timeout?: number
  maximumAge?: number
}

export function useGeolocation(options: UseGeolocationOptions = {}) {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    error: null,
    loading: false,
  })

  const getCurrentPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: "Geolocation is not supported by this browser",
        loading: false,
      }))
      return
    }

    setState((prev) => ({ ...prev, loading: true, error: null }))

    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000, // 5 minutes
      ...options,
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("[v0] Location obtained:", position.coords)
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          error: null,
          loading: false,
        })
      },
      (error) => {
        console.log("[v0] Geolocation error:", error.message)
        setState((prev) => ({
          ...prev,
          error: error.message,
          loading: false,
        }))
      },
      defaultOptions,
    )
  }, [options])

  const watchPosition = useCallback(() => {
    if (!navigator.geolocation) return null

    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000, // 1 minute for watch
      ...options,
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        console.log("[v0] Location updated:", position.coords)
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          error: null,
          loading: false,
        })
      },
      (error) => {
        console.log("[v0] Watch position error:", error.message)
        setState((prev) => ({
          ...prev,
          error: error.message,
          loading: false,
        }))
      },
      defaultOptions,
    )

    return watchId
  }, [options])

  const clearWatch = useCallback((watchId: number) => {
    navigator.geolocation.clearWatch(watchId)
  }, [])

  // Calculate distance between two points using Haversine formula
  const calculateDistance = useCallback(
    (lat2: number, lon2: number): number | null => {
      if (!state.latitude || !state.longitude) return null

      const R = 6371 // Earth's radius in kilometers
      const dLat = ((lat2 - state.latitude) * Math.PI) / 180
      const dLon = ((lon2 - state.longitude) * Math.PI) / 180
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((state.latitude * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      return R * c
    },
    [state.latitude, state.longitude],
  )

  return {
    ...state,
    getCurrentPosition,
    watchPosition,
    clearWatch,
    calculateDistance,
  }
}
