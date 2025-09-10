import { useState } from "react"
import { Button, Input, Card, CardBody, CardHeader } from "@heroui/react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { api } from "@/lib/api"
import { useAuth } from "@/store/auth"

export default function SignIn() {
  const nav = useNavigate()
  const loc = useLocation()
  const { setUser } = useAuth()
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false); const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError(null)
    try {
      const res = await api.signin({ email, password })
      setUser(res)
      const to = (loc.state as { from?: Location } | null)?.from?.pathname ?? "/app"
      nav(to, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed")
    } finally { setLoading(false) }
  }

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <Card className="w-full max-w-sm">
        <CardHeader className="justify-center">Sign in</CardHeader>
        <CardBody>
          <form onSubmit={submit} className="flex flex-col gap-4">
            <Input type="email" label="Email" value={email} onChange={e=>setEmail(e.target.value)} isRequired />
            <Input type="password" label="Password" value={password} onChange={e=>setPassword(e.target.value)} isRequired />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" color="primary" isLoading={loading}>Sign in</Button>
            <p className="text-sm mt-2">No account? <Link to="/signup" className="text-blue-600">Sign up</Link></p>
          </form>
        </CardBody>
      </Card>
    </div>
  )
}
