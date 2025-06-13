import { useSession } from "@/contexts/session-context"

interface UserProfileProps {
  className?: string;
}

export function UserProfile({ className = "" }: UserProfileProps) {
  const { user } = useSession()

  if (!user) return null

  return (
    <div className={`flex flex-col ${className}`}>
      {user.fullName && (
        <h2 className="text-xl font-semibold text-gray-800">{user.fullName}</h2>
      )}
      <p className="text-gray-600">{user.email}</p>
      <img src={user.avatar} height={200} width={200}  alt={"bb"} />
    </div>
  )
}
