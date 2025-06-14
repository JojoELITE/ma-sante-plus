"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, Lock, UserPlus, CheckCircle, AlertCircle, Loader2, UserIcon, ImageIcon } from "lucide-react"
import Image from "next/image"
import api from "@/app/services/page"

interface EditUserFormProps {
  userId: string
}

export default function EditUserForm({ userId }: EditUserFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    avatar: "",
  })

  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [avatarPreview, setAvatarPreview] = useState("")
  const [userToEdit, setUserToEdit] = useState<any | null>(null)
  const [redirecting, setRedirecting] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const dataFetchedRef = useRef(false)

  // Récupérer directement l'utilisateur par son ID
  useEffect(() => {
    // Protection contre les appels multiples
    if (dataFetchedRef.current) return
    dataFetchedRef.current = true

    const fetchUser = async () => {
      setIsLoading(true)
      try {
        console.log("Tentative de récupération de l'utilisateur avec l'ID:", userId)

        // Essayer d'abord de récupérer directement l'utilisateur par son ID
        let response = await api.get(`/users/${userId}`)
        let user = null

        // Si la requête directe échoue, essayer de récupérer tous les utilisateurs
        if (!response.ok) {
          console.log(`La requête directe a échoué avec le statut ${response.status}, tentative avec la liste complète`)
          response = await api.get(`/users`)

          if (!response.ok) {
            throw new Error(`Erreur lors de la récupération des utilisateurs: ${response.status}`)
          }

          const users = await response.json()
          console.log(`${users.length} utilisateurs récupérés, recherche de l'ID ${userId}`)

          // Déboguer les IDs disponibles
          const userIds = users.map((u: any) => u.id)
          console.log("IDs disponibles:", userIds)

          // Stocker les informations de débogage
          setDebugInfo({
            totalUsers: users.length,
            availableIds: userIds,
            searchedId: userId,
            idType: typeof userId,
            firstUserIdType: users.length > 0 ? typeof users[0].id : "unknown",
          })

          // Essayer de trouver l'utilisateur avec l'ID exact
          user = users.find((u: any) => u.id === userId)

          // Si pas trouvé, essayer avec une conversion de type
          if (!user) {
            console.log("Tentative avec conversion de type...")
            user = users.find((u: any) => String(u.id) === String(userId))
          }
        } else {
          // Si la requête directe réussit, utiliser les données
          user = await response.json()
        }

        if (user) {
          console.log("Utilisateur trouvé:", user)
          setUserToEdit(user)
          setFormData({
            fullName: user.fullName || "",
            email: user.email || "",
            password: "", // Ne pas pré-remplir le mot de passe
            avatar: "",
          })

          if (user.avatar) {
            setAvatarPreview(user.avatar)
          }
        } else {
          console.error(`Utilisateur avec l'ID ${userId} non trouvé`)
          setError(`Utilisateur avec l'ID ${userId} non trouvé`)
        }
      } catch (err) {
        console.error("Erreur lors du chargement de l'utilisateur:", err)
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError("Erreur inconnue lors du chargement de l'utilisateur")
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [userId])

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
        setError("") // Effacer les erreurs précédentes
        setImageError(false)
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

      console.log("Soumission du formulaire d'édition:", {
        userId,
        formData: { ...formData, password: formData.password ? "[MASQUÉ]" : "" },
      })

      // Préparer les données à envoyer
      const updateData: any = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
      }

      // Ajouter le mot de passe seulement s'il est fourni
      if (formData.password.trim()) {
        updateData.password = formData.password
      }

      // Utilisation de notre service API avec intercepteurs
      const response = await api.put(`/users/${userId}`, updateData)

      console.log("Réponse API:", response.status, response.statusText)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Erreur API:", errorText)
        throw new Error(`Erreur ${response.status}: ${errorText}`)
      }

      const responseData = await response.json().catch(() => ({}))
      console.log("Données de réponse:", responseData)

      setMessage("Utilisateur modifié avec succès !")
      setRedirecting(true)

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

  // Gérer le bouton Annuler
  const handleCancel = () => {
    // Utiliser window.location.href pour une redirection complète
    window.location.href = "/users"
  }

  // Gérer les erreurs d'image
  const handleImageError = () => {
    console.log("Erreur de chargement de l'image d'avatar")
    setImageError(true)
  }

  // Affichage du loader pendant le chargement initial
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Chargement des données utilisateur...</p>
        </div>
      </div>
    )
  }

  // Affichage d'erreur si l'utilisateur à modifier n'existe pas
  if (!userToEdit && error) {
    return (
      <div className="p-4 space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>

        {/* Informations de débogage */}
        {debugInfo && (
          <Alert className="border-blue-200 bg-blue-50">
            <AlertDescription className="text-blue-800">
              <details>
                <summary className="cursor-pointer font-medium">Informations de débogage</summary>
                <div className="mt-2 text-xs font-mono whitespace-pre-wrap">
                  <p>Total utilisateurs: {debugInfo.totalUsers}</p>
                  <p>
                    ID recherché: {debugInfo.searchedId} (type: {debugInfo.idType})
                  </p>
                  <p>Type d'ID du premier utilisateur: {debugInfo.firstUserIdType}</p>
                  <p>IDs disponibles: {debugInfo.availableIds.join(", ")}</p>
                </div>
              </details>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-center">
          <Button onClick={() => (window.location.href = "/users")} variant="outline">
            Retour à la liste des utilisateurs
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-center gap-2 text-xl">
          <UserPlus className="h-5 w-5 text-blue-600" />
          Modifier l'utilisateur
        </CardTitle>
        <CardDescription>Modifiez les informations de l'utilisateur sélectionné</CardDescription>
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
                {imageError ? (
                  <div className="w-[100px] h-[100px] rounded-full bg-gray-200 flex items-center justify-center">
                    <UserIcon className="h-12 w-12 text-gray-400" />
                  </div>
                ) : (
                  <Image
                    src={avatarPreview || "/placeholder.svg?height=100&width=100"}
                    alt="avatar"
                    width={100}
                    height={100}
                    className="rounded-full object-cover border-2 border-slate-200"
                    onError={handleImageError}
                  />
                )}
              </div>
              <div className="flex-1">
                <Input id="avatarInput" name="avatar" type="file" accept="image/*" onChange={handleAvatarUpload} />
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
              Mot de passe
            </Label>
            <Input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Laisser vide pour ne pas modifier"
            />
            <p className="text-xs text-gray-500">Laissez vide si vous ne souhaitez pas changer le mot de passe</p>
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={isSubmitting || redirecting}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mise à jour...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Modifier l'utilisateur
                </>
              )}
            </Button>

            <Button type="button" variant="outline" onClick={handleCancel} disabled={redirecting}>
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
