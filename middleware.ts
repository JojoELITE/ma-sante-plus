import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Ce middleware vérifie si l'utilisateur est authentifié pour certaines routes protégées
export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value || ""
  const path = request.nextUrl.pathname

  // Liste des routes protégées qui nécessitent une authentification
  const protectedRoutes = ["/dashboard", "/profile", "/settings"]

  // Liste des routes publiques accessibles uniquement aux utilisateurs non authentifiés
  const authRoutes = ["/auth/login", "/auth/register"]

  // Si l'utilisateur tente d'accéder à une route protégée sans être authentifié
  if (protectedRoutes.some((route) => path.startsWith(route)) && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  // Si l'utilisateur est déjà authentifié et tente d'accéder aux pages de connexion/inscription
  if (authRoutes.some((route) => path === route) && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

// Configurer les chemins sur lesquels le middleware doit s'exécuter
export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/settings/:path*", "/auth/:path*"],
}
