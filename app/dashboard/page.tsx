// app/dashboard/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface UserData {
  id: number
  email: string
  fullName: string
}

export default function Dashboard() {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Récupération de l'utilisateur à l'arrivée sur la page
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://192.168.20.83:3333/me", {
           method: "GET",
           credentials: 'include',
         
        })

        if (!response.ok) throw new Error("Non authentifié")

        setUser(await response.json())
      } catch (error) {
        console.error("Erreur d'authentification", error)
        router.push("/auth/login")
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router])

  // Déconnexion
  const handleLogout = async () => {
    try {
      await fetch("http://192.168.20.83:3333/logout", {
        method: "POST",
        credentials: 'include',
      })
      router.push("/auth/login")
    } catch (error) {
      console.error("Erreur lors de la déconnexion", error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Tableau de bord</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Déconnexion
          </button>
        </div>

        {user && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Informations du compte
            </h2>
            <div className="space-y-3">
              <p className="text-gray-600">
                <span className="font-medium">ID:</span> {user.id}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Email:</span> {user.email}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Nom complet:</span> {user.fullName}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
