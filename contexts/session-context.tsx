"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { setCookie, getCookie, removeCookie } from "@/utils/cookies"
import api from "@/app/services/page"

interface UserData {
  id: number
  email: string
  fullName: string
}

interface SessionContextType {
  user: UserData | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  setUserSession: (token: string, userData: UserData) => void
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

// Noms des cookies
const TOKEN_COOKIE = "auth_token"
const USER_DATA_COOKIE = "auth_user"

// Options des cookies avec le type correct
const cookieOptions = {
  path: "/",
  sameSite: "strict" as const,
  secure: process.env.NODE_ENV === "production",
  maxAge: 7 * 24 * 60 * 60, // 7 jours
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté au chargement
    if (typeof window !== "undefined") {
      const storedToken = getCookie(TOKEN_COOKIE)
      const userDataString = getCookie(USER_DATA_COOKIE)

      if (storedToken && userDataString) {
        try {
          const userData = JSON.parse(userDataString) as UserData
          setUser(userData)
          setToken(storedToken)
        } catch (err) {
          console.error("Erreur de parsing des données utilisateur:", err)
          removeCookie(TOKEN_COOKIE)
          removeCookie(USER_DATA_COOKIE)
        }
      }
    }

    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      // Utiliser notre service API avec intercepteurs
      const response = await api.post("/login", { email, password })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Échec de la connexion")
      }

      if (data.token && data.user) {
        const userData = {
          id: data.user.id,
          email: data.user.email,
          fullName: data.user.fullName,
        }

        // Stocker dans les cookies
        setCookie(TOKEN_COOKIE, data.token, cookieOptions)
        setCookie(USER_DATA_COOKIE, JSON.stringify(userData), cookieOptions)

        // Mettre à jour le contexte
        setUser(userData)
        setToken(data.token)

        // Attendre que l'état soit mis à jour avant de rediriger
        setTimeout(() => {
          router.push("/dashboard")
        }, 100)

        return true // Indique une connexion réussie
      }

      return false // Indique un échec de connexion
    } catch (err) {
      if (err instanceof Error) {
        throw err
      } else {
        throw new Error("Une erreur inattendue s'est produite")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      // Utiliser notre service API avec intercepteurs
      await api.post("/logout", {})
    } catch (err) {
      console.error("Erreur lors de la déconnexion:", err)
    } finally {
      // Nettoyage local quoi qu'il arrive
      setUser(null)
      setToken(null)
      removeCookie(TOKEN_COOKIE)
      removeCookie(USER_DATA_COOKIE)
      router.push("/auth/login")
    }
  }

  const setUserSession = (newToken: string, userData: UserData) => {
    setUser(userData)
    setToken(newToken)
    setCookie(TOKEN_COOKIE, newToken, cookieOptions)
    setCookie(USER_DATA_COOKIE, JSON.stringify(userData), cookieOptions)
  }

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    setUserSession,
  }

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession() {
  const context = useContext(SessionContext)
  if (context === undefined) {
    throw new Error("useSession doit être utilisé à l'intérieur d'un SessionProvider")
  }
  return context
}
