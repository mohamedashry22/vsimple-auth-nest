import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "@/store/auth"
import { JSX } from "react"

export default function Protected({ children }: { children: JSX.Element }) {
  const { user, ready } = useAuth()
  const loc = useLocation()

  if (!ready) return null;

  if (!user) {
    return <Navigate to="/signin" replace state={{ from: loc }} />
  }
  return children
}
