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
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const APP_KEY = process.env.NEXT_PUBLIC_SECRET_CODE ?? ""

  useEffect(() => {
    if (typeof window === 'undefined') return

    const token = sessionStorage.getItem('token')
    const userDataString = sessionStorage.getItem('userData')

    if (!token) {
      setError("Session expirée ou invalide")
      setLoading(false)
      router.push("/auth/login")
      return
    }

    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString) as UserData
        setUser(userData)
      } catch (err) {
        console.error("Erreur de parsing des données utilisateur:", err)
        setError("Données utilisateur corrompues")
      }
    } else {
      setError("Données utilisateur non disponibles")
    }

    setLoading(false)
  }, [router])

  const handleLogout = async () => {
    try {
      const token = sessionStorage.getItem('token')

      console.log("x-app-key envoyé:", APP_KEY)

      const response = await fetch("https://backendadonis.onrender.com/logout", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'x-app-key': APP_KEY,
        },
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error("Erreur serveur lors de la déconnexion.")
      }

      // Nettoyage session
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('userData')
      router.push("/auth/login")
    } catch (err) {
      console.error("Erreur lors de la déconnexion:", err)
      setError("Échec de la déconnexion. Veuillez réessayer.")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
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

        {user ? (
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
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">Aucune donnée utilisateur disponible</p>
          </div>
        )}
      </div>
    </div>
  )
}