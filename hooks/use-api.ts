"use client"

import api from "@/app/services/page"
/**
 * Hook personnalisé pour utiliser l'API avec gestion d'état
 */

import { useState, useEffect, useCallback } from "react"

interface UseApiOptions<T> {
  url: string
  method?: "GET" | "POST" | "PUT" | "DELETE"
  body?: any
  initialData?: T
  autoFetch?: boolean
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
}

export function useApi<T = any>({
  url,
  method = "GET",
  body,
  initialData,
  autoFetch = true,
  onSuccess,
  onError,
}: UseApiOptions<T>) {
  const [data, setData] = useState<T | undefined>(initialData)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetchData = useCallback(
    async (customBody?: any) => {
      setIsLoading(true)
      setError(null)

      try {
        let response

        switch (method) {
          case "GET":
            response = await api.get(url)
            break
          case "POST":
            response = await api.post(url, customBody || body)
            break
          case "PUT":
            response = await api.put(url, customBody || body)
            break
          case "DELETE":
            response = await api.delete(url)
            break
          default:
            response = await api.get(url)
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || `Erreur ${response.status}`)
        }

        const responseData = await response.json()
        setData(responseData)

        if (onSuccess) {
          onSuccess(responseData)
        }

        return responseData
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Une erreur est survenue")
        setError(error)

        if (onError) {
          onError(error)
        }

        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [url, method, body, onSuccess, onError],
  )

  useEffect(() => {
    if (autoFetch && method === "GET") {
      fetchData()
    }
  }, [autoFetch, fetchData, method])

  return {
    data,
    error,
    isLoading,
    fetchData,
    setData,
  }
}
