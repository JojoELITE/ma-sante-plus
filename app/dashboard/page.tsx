"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/contexts/session-context"
import { UserProfile } from "@/components/UserProfile"

export default function Dashboard() {
  const { user, isLoading, isAuthenticated, logout } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login")
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Tableau de bord</h1>
          <button
            onClick={() => logout()}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Déconnexion
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Profil Utilisateur</h2>
          <UserProfile className="space-y-2" />
          
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h3 className="font-medium text-gray-700 mb-2">Détails du compte</h3>
            <p className="text-gray-600">
              <span className="font-medium">ID:</span> {user.id}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
