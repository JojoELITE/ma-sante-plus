"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Mail, Users, Loader2, Pencil, Trash, UserIcon } from "lucide-react"


export interface User {
  id: string
  fullName: string
  email: string
  password: string
}
interface UserListProps {
  users: User[]
  isLoading: boolean
  onEdit: (user: User) => void
  onDelete: (id: string) => void
}

export function UserList({ users, isLoading, onEdit, onDelete }: UserListProps) {
  return (
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
          <div className="space-y-3">
            {users.map((user, index) => (
              <div key={user.id}>
                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 hover:bg-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <UserIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{user.fullName}</p>
                      <p className="text-sm text-slate-500 flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => onEdit(user)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => onDelete(user.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {index < users.length - 1 && <Separator className="my-2" />}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}