import { createContext } from "react"
import type { User } from "@/types"

export interface AuthValue {
  user: User | null
  setUser: (u: User | null) => void
  ready: boolean
}

export const AuthCtx = createContext<AuthValue | null>(null)
