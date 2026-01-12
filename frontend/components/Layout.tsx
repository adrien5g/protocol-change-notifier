import { ReactNode } from "react"
import UsersCount from "./usersCount"

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-white pb-16">
      {children}
      <UsersCount />
    </div>
  )
}
