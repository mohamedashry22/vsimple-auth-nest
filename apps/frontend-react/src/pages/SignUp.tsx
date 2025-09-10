import { useState } from "react"
import { Button, Input, Card, CardBody, CardHeader } from "@heroui/react"
import { useNavigate, Link } from "react-router-dom"
import { api } from "@/lib/api"

export default function SignUp() {
  const nav = useNavigate()
  const [email, setEmail] = useState(""); const [name, setName] = useState(""); const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false); const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError(null)
    try {
      await api.signup({ email, name, password })
      nav("/signin", { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed")
    } finally { setLoading(false) }
  }

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <Card className="w-full max-w-sm">
        <CardHeader className="justify-center">Sign up</CardHeader>
        <CardBody>
          <form onSubmit={submit} className="flex flex-col gap-4">
            <Input label="Name" value={name} onChange={e=>setName(e.target.value)} isRequired />
            <Input type="email" label="Email" value={email} onChange={e=>setEmail(e.target.value)} isRequired />
            <Input type="password" label="Password" value={password} onChange={e=>setPassword(e.target.value)} isRequired />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" color="primary" isLoading={loading}>Sign up</Button>
            <p className="text-sm mt-2">Already registered? <Link to="/signin" className="text-blue-600">Sign in</Link></p>
          </form>
        </CardBody>
      </Card>
    </div>
  )
}
