import { getCookie } from "@/utils/cookies"

// Configuration par défaut
const API_URL = "https://backendadonis.onrender.com"
const TOKEN_COOKIE = "auth_token"
const APP_KEY = process.env.NEXT_PUBLIC_SECRET_CODE ?? ""

// Types pour les intercepteurs
type RequestInterceptor = (config: RequestInit) => RequestInit
type ResponseInterceptor = (response: Response, requestOptions: RequestInit) => Promise<Response>
type ErrorInterceptor = (error: any, requestOptions: RequestInit) => Promise<Response | void>

// Classe API avec intercepteurs
class ApiService {
  private baseUrl: string
  private requestInterceptors: RequestInterceptor[] = []
  private responseInterceptors: ResponseInterceptor[] = []
  private errorInterceptors: ErrorInterceptor[] = []

  constructor(baseUrl: string = API_URL) {
    this.baseUrl = baseUrl
  }

  // Ajouter un intercepteur de requête
  addRequestInterceptor(interceptor: RequestInterceptor) {
    this.requestInterceptors.push(interceptor)
    return () => {
      const index = this.requestInterceptors.indexOf(interceptor)
      if (index !== -1) {
        this.requestInterceptors.splice(index, 1)
      }
    }
  }

  // Ajouter un intercepteur de réponse
  addResponseInterceptor(interceptor: ResponseInterceptor) {
    this.responseInterceptors.push(interceptor)
    return () => {
      const index = this.responseInterceptors.indexOf(interceptor)
      if (index !== -1) {
        this.responseInterceptors.splice(index, 1)
      }
    }
  }

  // Ajouter un intercepteur d'erreur
  addErrorInterceptor(interceptor: ErrorInterceptor) {
    this.errorInterceptors.push(interceptor)
    return () => {
      const index = this.errorInterceptors.indexOf(interceptor)
      if (index !== -1) {
        this.errorInterceptors.splice(index, 1)
      }
    }
  }

  // Méthode fetch avec intercepteurs
  async fetch(url: string, options: RequestInit = {}): Promise<Response> {
    // Construire l'URL complète
    const fullUrl = url.startsWith("http") ? url : `${this.baseUrl}${url}`

    // Appliquer les intercepteurs de requête
    let requestOptions = { ...options }
    for (const interceptor of this.requestInterceptors) {
      requestOptions = interceptor(requestOptions)
    }

    try {
      // Effectuer la requête
      let response = await fetch(fullUrl, requestOptions)

      // Appliquer les intercepteurs de réponse
      for (const interceptor of this.responseInterceptors) {
        response = await interceptor(response, requestOptions)
      }

      return response
    } catch (error) {
      // Appliquer les intercepteurs d'erreur
      for (const interceptor of this.errorInterceptors) {
        const result = await interceptor(error, requestOptions)
        if (result) return result
      }
      throw error
    }
  }

  // Méthodes d'aide pour les requêtes HTTP courantes
  async get(url: string, options: RequestInit = {}) {
    return this.fetch(url, { ...options, method: "GET" })
  }

  async post(url: string, data: any, options: RequestInit = {}) {
    return this.fetch(url, {
      ...options,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      body: JSON.stringify(data),
    })
  }

  async put(url: string, data: any, options: RequestInit = {}) {
    return this.fetch(url, {
      ...options,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      body: JSON.stringify(data),
    })
  }

  async delete(url: string, options: RequestInit = {}) {
    return this.fetch(url, { ...options, method: "DELETE" })
  }
}

// Créer une instance de l'API
const api = new ApiService()

// Intercepteur pour ajouter automatiquement le token d'authentification
api.addRequestInterceptor((config) => {
  const token = getCookie(TOKEN_COOKIE)
  const headers = new Headers(config.headers || {})

  // Ajouter la clé d'API à toutes les requêtes
  headers.set("x-app-key", APP_KEY)

  // Ajouter le token d'authentification s'il existe
  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  return {
    ...config,
    headers,
    credentials: "include", // Inclure les cookies dans les requêtes
  }
})

// Intercepteur pour gérer les erreurs d'authentification (401)
api.addResponseInterceptor(async (response, requestOptions) => {
  // Si la réponse est 401 Unauthorized, rediriger vers la page de connexion
  if (response.status === 401) {
    // Si nous ne sommes pas déjà sur la page de connexion
    if (typeof window !== "undefined" && !window.location.pathname.includes("/auth/login")) {
      console.log("Session expirée, redirection vers la page de connexion")
      window.location.href = "/auth/login"
    }
  }
  return response
})

// Intercepteur pour gérer les erreurs réseau
api.addErrorInterceptor(async (error) => {
  console.error("Erreur réseau:", error)
  // On pourrait implémenter une logique de retry ici
  throw error
})

export default api
