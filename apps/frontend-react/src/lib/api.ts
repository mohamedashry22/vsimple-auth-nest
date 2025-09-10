import type { User } from "@/types"

const API_URL = import.meta.env.API_URL ?? "http://localhost:3000"

function getCookie(name: string): string | null {
  return document.cookie
    .split("; ")
    .find(s => s.startsWith(name + "="))
    ?.split("=")[1] ?? null
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init.headers ?? {}) },
    ...init
  })
  const ct = res.headers.get("content-type") ?? ""
  const body = ct.includes("application/json") ? await res.json() : await res.text()
  if (!res.ok) throw new Error(typeof body === "string" ? body : (body as { message?: string }).message ?? "Request failed")
  return body as T
}

export const api = {
  signup: (data: { email: string; name: string; password: string }) =>
    request<User>("/auth/signup", { method: "POST", body: JSON.stringify(data) }),

  signin: async (data: { email: string; password: string }) => {
    const out = await request<User & { csrfToken?: string }>("/auth/signin", {
      method: "POST",
      body: JSON.stringify(data)
    })
    if (out.csrfToken) document.cookie = `csrf_token=${out.csrfToken}; Path=/; SameSite=Lax`
    return out
  },

  me: () => request<User | null>("/auth/me"),

  signout: async () => {
    const csrf = getCookie("csrf_token")
    await request<void>("/auth/signout", {
      method: "POST",
      headers: csrf ? { "x-csrf-token": csrf } : {}
    })
    if (csrf) document.cookie = "csrf_token=; Max-Age=0; Path=/"
  }
}
