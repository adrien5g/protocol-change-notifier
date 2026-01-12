import { useState, useEffect } from "react"
import { onTotalConnections } from "../libs/socket"

export default function UsersCount() {
  const [usersOnline, setUsersOnline] = useState(0)

  useEffect(() => {
    const unsubscribe = onTotalConnections((count) => {
      setUsersOnline(count)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black text-white py-3 px-6 border-t border-gray-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
        <span>Sistema de Notificação</span>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          <span>{usersOnline} online</span>
        </div>
      </div>
    </div>
  )
}
