"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

import {
  Mail,
  Lock,
  UserPlus,
  Users,
  CheckCircle,
  AlertCircle,
  Loader2,
  Pencil,
  Trash,
  UserIcon,
  ImageIcon,
} from "lucide-react"

interface User {
  id: string
  fullName: string
  email: string
  password: string
  avatar: string | null
}

export default function Page() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    avatar: "",
  })

  const [users, setUsers] = useState<User[]>([])
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [avatarPreview, setAvatarPreview] = useState("")

  // Gère le changement dans les inputs texte
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Gère l'upload d'avatar et conversion en base64 pour preview
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result as string
      setAvatarPreview(base64)
      setFormData((prev) => ({ ...prev, avatar: base64 }))
    }
    reader.readAsDataURL(file)
  }

  // Récupère la liste des utilisateurs
  const fetchUsers = async () => {
    setIsLoading(true)
    setError("")
    try {
      const res = await fetch("https://backendadonis.onrender.com/users")
      if (!res.ok) throw new Error(`Erreur ${res.status}`)
      const data: User[] = await res.json()
      setUsers(data)
    } catch (err) {
      setError(
        err instanceof Error
          ? `Erreur lors de la récupération des utilisateurs: ${err.message}`
          : "Erreur inconnue lors de la récupération des utilisateurs"
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // Soumission du formulaire (création ou modification)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")
    setError("")
    setIsSubmitting(true)

    try {
      const form = new FormData()
      form.append("fullName", formData.fullName)
      form.append("email", formData.email)
      if (formData.password) form.append("password", formData.password)

      const fileInput = document.getElementById("avatarInput") as HTMLInputElement | null
      if (fileInput?.files?.[0]) {
        form.append("avatar", fileInput.files[0])
      }

      const url = editingUserId
        ? `https://backendadonis.onrender.com/users/${editingUserId}`
        : "https://backendadonis.onrender.com/register"

      const method = editingUserId ? "PUT" : "POST"

      const res = await fetch(url, { method, body: form })

      if (!res.ok) {
        const errText = await res.text()
        throw new Error(`Erreur ${res.status} : ${errText}`)
      }

      setMessage(editingUserId ? "Utilisateur modifié avec succès !" : "Utilisateur créé avec succès !")
      resetForm()
      fetchUsers()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur inconnue lors de la soumission du formulaire"
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  // Initialise le formulaire avec les données d'un utilisateur pour édition
  const handleEdit = (user: User) => {
    setFormData({
      fullName: user.fullName,
      email: user.email,
      password: "",
      avatar: user.avatar || "",
    })
    setAvatarPreview(user.avatar || "")
    setEditingUserId(user.id)
  }

  // Supprime un utilisateur
  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) return

    try {
      const res = await fetch(`https://backendadonis.onrender.com/users/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error(`Erreur ${res.status}`)
      setMessage("Utilisateur supprimé avec succès.")
      fetchUsers()
    } catch (err) {
      setError(
        err instanceof Error
          ? `Erreur lors de la suppression : ${err.message}`
          : "Erreur inconnue lors de la suppression"
      )
    }
  }

  // Réinitialise le formulaire et les états liés
  const resetForm = () => {
    setFormData({ fullName: "", email: "", password: "", avatar: "" })
    setAvatarPreview("")
    setEditingUserId(null)
  }

  return (
    <div className="p-10">
      <header className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">Gestion des Utilisateurs</h1>
        <p className="text-slate-600">
          Créez, modifiez et supprimez vos utilisateurs facilement
        </p>
      </header>

      <main className="space-y-8 flex flex-col lg:flex-row gap-10 p-20">
        {/* Formulaire */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-xl">
              <UserPlus className="h-5 w-5 text-blue-600" />
              {editingUserId ? "Modifier un utilisateur" : "Créer un utilisateur"}
            </CardTitle>
            <CardDescription>
              {editingUserId
                ? "Modifiez les informations de l'utilisateur sélectionné"
                : "Remplissez les informations pour créer un utilisateur"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {message && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">{message}</AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Avatar */}
              <div className="space-y-2">
                <Label
                  htmlFor="avatar"
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  <ImageIcon className="h-4 w-4 text-slate-600" />
                  Avatar
                </Label>

                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Image
                      src={avatarPreview || "/default-avatar.png"}
                      alt="avatar"
                      width={100}
                      height={100}
                      className="rounded-full object-cover border-2 border-slate-200 bg-amber-600"
                      unoptimized // utile si base64
                    />
                  </div>
                  <Input
                    id="avatarInput"
                    name="avatar"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                  />
                </div>
              </div>

              {/* Nom complet */}
              <div className="space-y-2">
                <Label
                  htmlFor="fullName"
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  <UserIcon className="h-4 w-4 text-slate-600" />
                  Nom complet
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  <Mail className="h-4 w-4 text-slate-600" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Mot de passe */}
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  <Lock className="h-4 w-4 text-slate-600" />
                  Mot de passe
                </Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={
                    editingUserId
                      ? "Laisser vide pour ne pas modifier"
                      : "Entrez un mot de passe"
                  }
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {editingUserId ? "Mise à jour..." : "Création en cours..."}
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    {editingUserId
                      ? "Modifier l'utilisateur"
                      : "Créer l'utilisateur"}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Liste des utilisateurs */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm w-full">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-slate-600" />
                Liste des utilisateurs
              </div>
              <Badge variant="secondary" className="bg-slate-100">
                {users.length} utilisateur{users.length !== 1 ? "s" : ""}
              </Badge>
            </CardTitle>
            <CardDescription>Tous les utilisateurs enregistrés</CardDescription>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                <span className="ml-2 text-slate-600">Chargement...</span>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <Users className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                <p>Aucun utilisateur trouvé</p>
              </div>
            ) : (
              <div className="space-y-6">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <Image
                        src={
                          user.avatar 
                        }
                        alt={user.fullName}
                        width={60}
                        height={60}
                        className="rounded-full object-cover"
                        unoptimized // Si url externe ou base64
                      />
                      <div>
                        <p className="font-medium">{user.fullName}</p>
                        <p className="text-sm text-slate-500">{user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(user)}
                        className="text-blue-500 hover:bg-blue-50"
                        aria-label={`Modifier ${user.fullName}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(user.id)}
                        className="text-red-500 hover:bg-red-50"
                        aria-label={`Supprimer ${user.fullName}`}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
