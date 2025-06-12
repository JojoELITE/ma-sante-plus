"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Mail, Lock, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
  
    try {
      const response = await fetch("https://backendadonis.onrender.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-app-key": process.env.NEXT_PUBLIC_SECRET_CODE ?? "2a10D6ZKGGzMXxNMFvFJv2.qUeEr1Bi8d/tskhmY5YyE8Au8kmrAqE", // ← ICI
        },
        body: JSON.stringify(formData),
        credentials: "include",
      })
  
      const data = await response.json()
  
      if (!response.ok) {
        if (typeof sessionStorage !== "undefined") {
          sessionStorage.removeItem("token")
          sessionStorage.removeItem("userData")
        }
        throw new Error(data.error || "Échec de la connexion")
      }
  
      // Stockage des données utilisateur dans sessionStorage
      if (data.token && data.user) {
        sessionStorage.setItem('token', data.token)
        const userData = {
          id: data.user.id,
          email: data.user.email,
          fullName: data.user.fullName
        }
        sessionStorage.setItem('userData', JSON.stringify(userData))
      }
  
      router.push("/dashboard")
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Une erreur inattendue s'est produite")
      }
    } finally {
      setIsLoading(false)
    }
  }
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-slate-800">
            Connexion à votre compte
          </CardTitle>
          <p className="text-sm text-slate-600">
            Entrez vos identifiants pour accéder à votre espace
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive" className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800 flex items-center gap-2">
                <Lock className="h-4 w-4" />
                {error}
              </AlertDescription>
            </Alert>
          )}

         <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700">
                Email
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="email@exemple.com"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-slate-700">
                  Mot de passe
                </Label>
                <a
                  href="#"
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  Mot de passe oublié?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="pl-10"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                "Se connecter"
              )}
            </Button>
          </form>

          <div className="text-center text-sm text-slate-600 mt-4">
            Pas encore de compte?{" "}
            <Link
              href="/auth/register"
              className="font-medium text-blue-600 hover:underline"
            >
              Créer un compte
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}