// "use client"

// import type React from "react"
// import { useEffect, useState } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Separator } from "@/components/ui/separator"
// import { Mail, Lock, UserPlus, Users, CheckCircle, AlertCircle, Loader2, Pencil, Trash } from "lucide-react"
// import { UserIcon } from "lucide-react"
// import { Alert, AlertDescription } from "@/components/ui/alert"

// interface User {
//   id: string
//   fullName: string
//   email: string
//   password: string
// }

// export default function Page() {
//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     password: "",
//   })

//   const [users, setUsers] = useState<User[]>([])
//   const [message, setMessage] = useState("")
//   const [error, setError] = useState("")
//   const [isLoading, setIsLoading] = useState(false)
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [editingUserId, setEditingUserId] = useState<string | null>(null)

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     })
//   }

//   const fetchUsers = async () => {
//     setIsLoading(true)
//     try {
//       const response = await fetch("http://192.168.20.83:3333/users")
//       if (!response.ok) throw new Error(`Erreur ${response.status}`)
//       const data = await response.json()
//       setUsers(data)
//     } catch (err: any) {
//       setError(`Erreur lors de la récupération des utilisateurs: ${err.message}`)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchUsers()
//   }, [])

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setMessage("")
//     setError("")
//     setIsSubmitting(true)

//     try {
//       const url = editingUserId
//         ? `http://192.168.20.83:3333/users/${editingUserId}`
//         : "http://192.168.20.83:3333/users"

//       const method = editingUserId ? "PUT" : "POST"

//       const response = await fetch(url, {
//         method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       })

//       if (!response.ok) {
//         const errorText = await response.text()
//         throw new Error(`Erreur ${response.status} : ${errorText}`)
//       }

//       setMessage(editingUserId ? "Utilisateur modifié avec succès !" : "Utilisateur créé avec succès !")
//       setFormData({ fullName: "", email: "", password: "" })
//       setEditingUserId(null)
//       fetchUsers()
//     } catch (err: any) {
//       setError(err.message)
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const handleEdit = (user: User) => {
//     setFormData({ fullName: user.fullName, email: user.email, password: user.password })
//     setEditingUserId(user.id)
//   }

//   const handleDelete = async (id: string) => {
//     if (!confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) return

//     try {
//       const response = await fetch(`http://192.168.20.83:3333/users/${id}`, {
//         method: "DELETE",
//       })
//       if (!response.ok) throw new Error(`Erreur ${response.status}`)
//       setMessage("Utilisateur supprimé avec succès.")
//       fetchUsers()
//     } catch (err: any) {
//       setError(`Erreur lors de la suppression : ${err.message}`)
//     }
//   }

//   return (
//     <div className="p-10">
//       <div className="text-center space-y-2">
//         <h1 className="text-3xl font-bold text-slate-900">Gestion des Utilisateurs</h1>
//         <p className="text-slate-600">Créez, modifiez et supprimez vos utilisateurs facilement</p>
//       </div>

//       <div className="space-y-8 flex gap-10 p-20 flex-col lg:flex-row">
//         {/* Formulaire */}
//         <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm w-full">
//           <CardHeader className="space-y-1">
//             <CardTitle className="flex items-center gap-2 text-xl">
//               <UserPlus className="h-5 w-5 text-blue-600" />
//               {editingUserId ? "Modifier un utilisateur" : "Créer un utilisateur"}
//             </CardTitle>
//             <CardDescription>
//               {editingUserId
//                 ? "Modifiez les informations de l'utilisateur sélectionné"
//                 : "Remplissez les informations pour créer un utilisateur"}
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             {message && (
//               <Alert className="border-green-200 bg-green-50">
//                 <CheckCircle className="h-4 w-4 text-green-600" />
//                 <AlertDescription className="text-green-800">{message}</AlertDescription>
//               </Alert>
//             )}

//             {error && (
//               <Alert className="border-red-200 bg-red-50">
//                 <AlertCircle className="h-4 w-4 text-red-600" />
//                 <AlertDescription className="text-red-800">{error}</AlertDescription>
//               </Alert>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="fullName" className="flex items-center gap-2 text-sm font-medium">
//                   <UserIcon className="h-4 w-4 text-slate-600" />
//                   Nom complet
//                 </Label>
//                 <Input
//                   id="fullName"
//                   type="text"
//                   name="fullName"
//                   value={formData.fullName}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
//                   <Mail className="h-4 w-4 text-slate-600" />
//                   Email
//                 </Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="password" className="flex items-center gap-2 text-sm font-medium">
//                   <Lock className="h-4 w-4 text-slate-600" />
//                   Mot de passe
//                 </Label>
//                 <Input
//                   id="password"
//                   type="password"
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   placeholder={editingUserId ? "Laisser vide pour ne pas modifier" : "Entrez un mot de passe"}
//                 />
//               </div>

//               <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700">
//                 {isSubmitting ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     {editingUserId ? "Mise à jour..." : "Création en cours..."}
//                   </>
//                 ) : (
//                   <>
//                     <UserPlus className="mr-2 h-4 w-4" />
//                     {editingUserId ? "Modifier l'utilisateur" : "Créer l'utilisateur"}
//                   </>
//                 )}
//               </Button>
//             </form>
//           </CardContent>
//         </Card>

//         {/* Liste */}
//         <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm w-full">
//           <CardHeader>
//             <CardTitle className="flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <Users className="h-5 w-5 text-slate-600" />
//                 Liste des utilisateurs
//               </div>
//               <Badge variant="secondary" className="bg-slate-100">
//                 {users.length} utilisateur{users.length !== 1 ? "s" : ""}
//               </Badge>
//             </CardTitle>
//             <CardDescription>Tous les utilisateurs enregistrés</CardDescription>
//           </CardHeader>
//           <CardContent>
//             {isLoading ? (
//               <div className="flex items-center justify-center py-8">
//                 <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
//                 <span className="ml-2 text-slate-600">Chargement...</span>
//               </div>
//             ) : users.length === 0 ? (
//               <div className="text-center py-8 text-slate-500">
//                 <Users className="h-12 w-12 mx-auto mb-3 text-slate-300" />
//                 <p>Aucun utilisateur trouvé</p>
//               </div>
//             ) : (
//               <div className="space-y-3">
//                 {users.map((user, index) => (
//                   <div key={user.id}>
//                     <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 hover:bg-slate-100">
//                       <div className="flex items-center gap-3">
//                         <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
//                           <UserIcon className="h-5 w-5 text-blue-600" />
//                         </div>
//                         <div>
//                           <p className="font-medium text-slate-900">{user.fullName}</p>
//                           <p className="text-sm text-slate-500 flex items-center gap-1">
//                             <Mail className="h-3 w-3" />
//                             {user.email}
//                           </p>
//                         </div>
//                       </div>
//                       <div className="flex gap-2">
//                         <Button variant="outline" size="sm" onClick={() => handleEdit(user)}>
//                           <Pencil className="h-4 w-4" />
//                         </Button>
//                         <Button variant="destructive" size="sm" onClick={() => handleDelete(user.id)}>
//                           <Trash className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     </div>
//                     {index < users.length - 1 && <Separator className="my-2" />}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }

"use client"

import type React from "react"
import { useEffect, useState } from "react"
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
} from "lucide-react"
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert"

interface User {
  id: string
  fullName: string
  email: string
  password: string
}

export default function Page() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  })

  const [users, setUsers] = useState<User[]>([])
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingUserId, setEditingUserId] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("http://192.168.20.83:3333/users")
      if (!response.ok) throw new Error(`Erreur ${response.status}`)
      const data: User[] = await response.json()
      setUsers(data)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(`Erreur lors de la récupération des utilisateurs: ${err.message}`)
      } else {
        setError("Erreur inconnue lors de la récupération des utilisateurs")
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")
    setError("")
    setIsSubmitting(true)

    try {
      const url = editingUserId
        ? `http://192.168.20.83:3333/users/${editingUserId}`
        : "http://192.168.20.83:3333/users"

      const method = editingUserId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Erreur ${response.status} : ${errorText}`)
      }

      setMessage(editingUserId ? "Utilisateur modifié avec succès !" : "Utilisateur créé avec succès !")
      setFormData({ fullName: "", email: "", password: "" })
      setEditingUserId(null)
      fetchUsers()
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Erreur inconnue lors de la soumission du formulaire")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (user: User) => {
    setFormData({ fullName: user.fullName, email: user.email, password: user.password })
    setEditingUserId(user.id)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) return

    try {
      const response = await fetch(`http://192.168.20.83:3333/users/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error(`Erreur ${response.status}`)
      setMessage("Utilisateur supprimé avec succès.")
      fetchUsers()
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(`Erreur lors de la suppression : ${err.message}`)
      } else {
        setError("Erreur inconnue lors de la suppression")
      }
    }
  }

  return (
    <div className="p-10">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">Gestion des Utilisateurs</h1>
        <p className="text-slate-600">Créez, modifiez et supprimez vos utilisateurs facilement</p>
      </div>

      <div className="space-y-8 flex gap-10 p-20 flex-col lg:flex-row">
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

            {/* Optional separator */}
            {/* <Separator /> */}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="flex items-center gap-2 text-sm font-medium">
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

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
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
                  placeholder={editingUserId ? "Laisser vide pour ne pas modifier" : "Entrez un mot de passe"}
                />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {editingUserId ? "Mise à jour..." : "Création en cours..."}
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    {editingUserId ? "Modifier l'utilisateur" : "Créer l'utilisateur"}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Liste */}
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
                  <div key={user.id} className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Pencil className="text-blue-500 cursor-pointer" onClick={() => handleEdit(user)} />
                      <span>{user.fullName}</span>
                    </div>
                    <Button
                      onClick={() => handleDelete(user.id)}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
