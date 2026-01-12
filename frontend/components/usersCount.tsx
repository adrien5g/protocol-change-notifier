import { useState } from "react"
import { onTotalConnections } from "../libs/socket"

export default function UsersCount() {
  const [usersOnline, setUsersOnline] = useState(0)

  const updateUsersOnline = (count: number) => {
    setUsersOnline(count)
  }

  onTotalConnections(updateUsersOnline)

  return (
    <span>
      Usuários online: {usersOnline}
    </span>
  )
}
