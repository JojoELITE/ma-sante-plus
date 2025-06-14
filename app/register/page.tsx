"use client"

import type React from "react"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, Lock, UserPlus, CheckCircle, AlertCircle, Loader2, UserIcon, ImageIcon, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import EditUserForm from "@/components/edit-user-form"
import api from "../services/page"

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    avatar: "",
  })

  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState("")
  const [redirecting, setRedirecting] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const editUserId = searchParams.get("edit")
  const isEditing = !!editUserId

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Vérifier la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("L'image ne doit pas dépasser 5MB")
        return
      }

      // Vérifier le type de fichier
      if (!file.type.startsWith("image/")) {
        setError("Veuillez sélectionner un fichier image valide")
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setAvatarPreview(base64String)
        setFormData({
          ...formData,
          avatar: base64String,
        })
        setError("")
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")
    setError("")
    setIsSubmitting(true)

    try {
      // Validation côté client
      if (!formData.fullName.trim()) {
        throw new Error("Le nom complet est requis")
      }
      if (!formData.email.trim()) {
        throw new Error("L'email est requis")
      }
      if (!formData.password.trim()) {
        throw new Error("Le mot de passe est requis pour la création")
      }

      console.log("Soumission du formulaire de création:", {
        formData: { ...formData, password: formData.password ? "[MASQUÉ]" : "" },
      })

      // Pour la création, utiliser FormData
      const form = new FormData()
      form.append("fullName", formData.fullName.trim())
      form.append("email", formData.email.trim())
      form.append("password", formData.password)

      // Récupère le fichier depuis l'input
      const fileInput = document.getElementById("avatarInput") as HTMLInputElement
      if (fileInput?.files?.[0]) {
        form.append("avatar", fileInput.files[0])
      }

      // Utilisation de notre service API avec intercepteurs
      const response = await api.fetch("/register", {
        method: "POST",
        body: form,
      })

      console.log("Réponse API:", response.status, response.statusText)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Erreur API:", errorText)
        throw new Error(`Erreur ${response.status}: ${errorText}`)
      }

      const responseData = await response.json().catch(() => ({}))
      console.log("Données de réponse:", responseData)

      setMessage("Utilisateur créé avec succès !")
      setRedirecting(true)

      // Réinitialiser le formulaire après création
      setFormData({ fullName: "", email: "", password: "", avatar: "" })
      setAvatarPreview("")
      // Effacer l'input file
      const avatarInput = document.getElementById("avatarInput") as HTMLInputElement
      if (avatarInput) {
        avatarInput.value = ""
      }

      // Rediriger vers la liste des utilisateurs après 2 secondes
      setTimeout(() => {
        // Utiliser window.location.href pour une redirection complète
        window.location.href = "/users"
      }, 2000)
    } catch (err: unknown) {
      console.error("Erreur lors de la soumission:", err)
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Erreur inconnue lors de la soumission du formulaire")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/users">
            <Button variant="outline" size="sm">
              <ArrowLeft size={16} className="mr-2" />
              Retour à la liste
            </Button>
          </Link>
        </div>

        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            {isEditing ? "Modifier l'utilisateur" : "Créer un utilisateur"}
          </h1>
          <p className="text-slate-600">
            {isEditing
              ? "Modifiez les informations de l'utilisateur sélectionné"
              : "Remplissez les informations pour créer un nouvel utilisateur"}
          </p>
        </div>

        {isEditing && editUserId ? (
          <EditUserForm userId={editUserId} />
        ) : (
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-xl">
                <UserPlus className="h-5 w-5 text-blue-600" />
                Créer un utilisateur
              </CardTitle>
              <CardDescription>Remplissez les informations pour créer un utilisateur</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {message && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    {message}
                    {redirecting && " Redirection vers la liste des utilisateurs..."}
                  </AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="avatar" className="flex items-center gap-2 text-sm font-medium">
                    <ImageIcon className="h-4 w-4 text-slate-600" />
                    Avatar
                  </Label>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Image
                        src={avatarPreview || "/placeholder.svg?height=100&width=100"}
                        alt="avatar"
                        width={100}
                        height={100}
                        className="rounded-full object-cover border-2 border-slate-200"
                      />
                    </div>
                    <div className="flex-1">
                      <Input
                        id="avatarInput"
                        name="avatar"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                      />
                      <p className="text-xs text-gray-500 mt-1">Formats acceptés: JPG, PNG, GIF (max 5MB)</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullName" className="flex items-center gap-2 text-sm font-medium">
                    <UserIcon className="h-4 w-4 text-slate-600" />
                    Nom complet *
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    placeholder="Entrez le nom complet"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                    <Mail className="h-4 w-4 text-slate-600" />
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="exemple@email.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-2 text-sm font-medium">
                    <Lock className="h-4 w-4 text-slate-600" />
                    Mot de passe *
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Entrez un mot de passe"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || redirecting}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Création en cours...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Créer l'utilisateur
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
