"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/contexts/session-context"

export default function LoginRedirect() {
  const { isAuthenticated, isLoading } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, isLoading, router])

  return null
}
