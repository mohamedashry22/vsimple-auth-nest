import { useEffect, useMemo, useState, type ReactNode } from "react"
import type { User } from "@/types"
import { AuthCtx, type AuthValue } from "./auth-context"
import { api } from "@/lib/api"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let alive = true
    const cached = localStorage.getItem("auth:user")
    if (cached) {
      try { setUser(JSON.parse(cached)) } catch{
        console.log('error in settingLive');
      }
    }
    (async () => {
      try {
        const me = await api.me()
        if (alive && me) {
          setUser(me)
          localStorage.setItem("auth:user", JSON.stringify(me))
        } else if (alive) {
          setUser(null)
          localStorage.removeItem("auth:user")
        }
      } finally {
        if (alive) setReady(true)
      }
    })()
    return () => { alive = false }
  }, [])

  useEffect(() => {
    if (!ready) return
    if (user) localStorage.setItem("auth:user", JSON.stringify(user))
    else localStorage.removeItem("auth:user")
  }, [user, ready])

  const value = useMemo<AuthValue>(() => ({ user, setUser, ready }), [user, ready])
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}
