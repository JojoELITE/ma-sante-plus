"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/contexts/session-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserPlus, Settings, BarChart3 } from "lucide-react"
import Link from "next/link"
import api from "../services/page"

interface DashboardData {
  stats: {
    users: number
    projects: number
    tasks: number
  }
}

export default function Dashboard() {
  const { user, isLoading, isAuthenticated, logout } = useSession()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [dataLoading, setDataLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login")
    }
  }, [isLoading, isAuthenticated, router])

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (isAuthenticated) {
        setDataLoading(true)
        try {
          // L'intercepteur ajoutera automatiquement le token d'authentification
          const response = await api.get("/dashboard/stats")

          if (response.ok) {
            const data = await response.json()
            setDashboardData(data)
          }
        } catch (error) {
          console.error("Erreur lors du chargement des données du tableau de bord:", error)
        } finally {
          setDataLoading(false)
        }
      }
    }

    fetchDashboardData()
  }, [isAuthenticated])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!user) {
    return null 
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Tableau de bord</h1>
          <button
            onClick={() => logout()}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Déconnexion
          </button>
        </div>

        {/* Actions rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/users">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="flex items-center p-6">
                <Users className="h-8 w-8 text-blue-600 mr-4" />
                <div>
                  <h3 className="font-semibold">Gérer les utilisateurs</h3>
                  <p className="text-sm text-gray-600">Voir et modifier les utilisateurs</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/register">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="flex items-center p-6">
                <UserPlus className="h-8 w-8 text-green-600 mr-4" />
                <div>
                  <h3 className="font-semibold">Ajouter un utilisateur</h3>
                  <p className="text-sm text-gray-600">Créer un nouvel utilisateur</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="flex items-center p-6">
              <Settings className="h-8 w-8 text-gray-600 mr-4" />
              <div>
                <h3 className="font-semibold">Paramètres</h3>
                <p className="text-sm text-gray-600">Configuration du système</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informations du compte */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Informations du compte
              </CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>

          {/* Statistiques */}
          <Card>
            <CardHeader>
              <CardTitle>Statistiques</CardTitle>
            </CardHeader>
            <CardContent>
              {dataLoading ? (
                <div className="flex justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : dashboardData ? (
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-blue-600">Utilisateurs</p>
                    <p className="text-2xl font-bold">{dashboardData.stats.users}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-green-600">Projets</p>
                    <p className="text-2xl font-bold">{dashboardData.stats.projects}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-purple-600">Tâches</p>
                    <p className="text-2xl font-bold">{dashboardData.stats.tasks}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center">Aucune donnée disponible</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
