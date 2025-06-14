"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useApi } from "@/hooks/use-api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, UserPlus, Trash, Pencil, ArrowLeft, CheckCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import DeleteUserModal from "@/components/delete-user-modal"
import api from "../services/page"

interface User {
  id: string
  fullName: string
  email: string
  avatar: string | null
}

export default function UsersPage() {
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const router = useRouter()

  // Utilisation du hook useApi pour récupérer la liste des utilisateurs
  const {
    data: users,
    isLoading,
    error,
    fetchData: refetchUsers,
  } = useApi<User[]>({
    url: "/users",
    autoFetch: true,
  })

  const handleEdit = (user: User) => {
    // Afficher l'ID de l'utilisateur pour le débogage
    console.log("Édition de l'utilisateur avec l'ID:", user.id, "Type:", typeof user.id)

    router.push(`/register?edit=${user.id}`)
  }

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user)
  }

  const handleDeleteConfirm = async (userId: string) => {
    setIsDeleting(true)
    setErrorMessage("")

    try {
      const response = await api.delete(`/users/${userId}`)

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}`)
      }

      setSuccessMessage("Utilisateur supprimé avec succès.")
      setUserToDelete(null)
      await refetchUsers()

      // Effacer le message de succès après 3 secondes
      setTimeout(() => {
        setSuccessMessage("")
      }, 3000)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(`Erreur lors de la suppression : ${err.message}`)
      } else {
        setErrorMessage("Erreur inconnue lors de la suppression")
      }
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setUserToDelete(null)
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft size={16} className="mr-2" />
              Retour au tableau de bord
            </Button>
          </Link>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestion des utilisateurs</h1>
          <Link href="/register">
            <Button className="flex items-center gap-2">
              <UserPlus size={16} />
              Ajouter un utilisateur
            </Button>
          </Link>
        </div>

        {/* Messages de succès et d'erreur */}
        {successMessage && (
          <Alert className="border-green-200 bg-green-50 mb-6">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
          </Alert>
        )}

        {(error || errorMessage) && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error?.message || errorMessage}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Liste des utilisateurs ({users?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            ) : !users || users.length === 0 ? (
              <div className="text-center p-8">
                <p className="text-gray-500 mb-4">Aucun utilisateur trouvé</p>
                <Link href="/register">
                  <Button>
                    <UserPlus size={16} className="mr-2" />
                    Créer le premier utilisateur
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-2 text-left">ID</th>
                      <th className="px-4 py-2 text-left">Avatar</th>
                      <th className="px-4 py-2 text-left">Nom</th>
                      <th className="px-4 py-2 text-left">Email</th>
                      <th className="px-4 py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-2 text-gray-500 text-sm">{user.id}</td>
                        <td className="px-4 py-2">
                          <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200">
                            {user.avatar ? (
                              <Image
                                src={user.avatar || "/placeholder.svg"}
                                alt={user.fullName}
                                width={40}
                                height={40}
                                className="object-cover w-full h-full"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.onerror = null
                                  target.src = "/placeholder.svg?height=40&width=40"
                                }}
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center bg-blue-100 text-blue-500 font-medium">
                                {user.fullName.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-2 font-medium">{user.fullName}</td>
                        <td className="px-4 py-2 text-gray-600">{user.email}</td>
                        <td className="px-4 py-2 text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(user)}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            >
                              <Pencil size={16} />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteClick(user)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash size={16} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <DeleteUserModal
          user={userToDelete}
          isOpen={!!userToDelete}
          isDeleting={isDeleting}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
        />
      </div>
    </div>
  )
}
