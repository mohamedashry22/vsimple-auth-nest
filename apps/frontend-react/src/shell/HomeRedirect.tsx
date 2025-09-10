import { Navigate } from "react-router-dom"
import { useAuth } from "@/store/auth"

export default function HomeRedirect() {
  const { user, ready } = useAuth()
  if (!ready) return null;
  return <Navigate to={user ? "/app" : "/signin"} replace />
}
