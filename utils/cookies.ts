/**
 * Utilitaires pour la gestion des cookies
 */

// Définir le type pour les options de cookie avec une signature d'index
interface CookieOptions {
    path?: string
    sameSite?: "strict" | "lax" | "none"
    secure?: boolean
    maxAge?: number
    expires?: Date | string
    domain?: string
    httpOnly?: boolean
    [key: string]: any // Signature d'index pour permettre d'autres propriétés
  }
  
  // Définir un cookie avec des options
  export function setCookie(name: string, value: string, options: CookieOptions = {}) {
    const defaultOptions: CookieOptions = {
      path: "/",
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60, // 7 jours par défaut
    }
  
    const cookieOptions = { ...defaultOptions, ...options }
    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`
  
    for (const optionKey in cookieOptions) {
      const optionValue = cookieOptions[optionKey]
      if (optionValue === true) {
        cookieString += `; ${optionKey}`
      } else if (optionValue !== false && optionValue !== undefined && optionValue !== null) {
        cookieString += `; ${optionKey}=${optionValue}`
      }
    }
  
    document.cookie = cookieString
  }
  
  // Récupérer la valeur d'un cookie
  export function getCookie(name: string): string | null {
    if (typeof document === "undefined") return null
  
    const cookies = document.cookie.split("; ")
    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split("=")
      if (decodeURIComponent(cookieName) === name) {
        return decodeURIComponent(cookieValue)
      }
    }
    return null
  }
  
  // Supprimer un cookie
  export function removeCookie(name: string, options: CookieOptions = {}) {
    const defaultOptions: CookieOptions = {
      path: "/",
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    }
  
    const cookieOptions = { ...defaultOptions, ...options, maxAge: -1 }
    setCookie(name, "", cookieOptions)
  }
  