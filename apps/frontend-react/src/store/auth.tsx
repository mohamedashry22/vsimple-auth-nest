import { useContext } from "react"
import { AuthCtx, type AuthValue } from "./auth-context"
export function useAuth(): AuthValue {
  const ctx = useContext(AuthCtx)
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>")
  return ctx
}
