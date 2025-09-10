import { Button, Card, CardBody, CardHeader } from "@heroui/react"
import { useAuth } from "@/store/auth"
import { api } from "@/lib/api"

export default function AppHome() {
  const { user, setUser } = useAuth()
  const logout = async () => { await api.signout(); setUser(null) }

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <Card className="w-full max-w-sm">
        <CardHeader className="justify-center">Application</CardHeader>
        <CardBody className="space-y-4">
          {user && <p className="text-sm">Signed in as: <span className="font-medium">{user.email}</span></p>}
          <Button color="danger" onPress={logout}>Logout</Button>
        </CardBody>
      </Card>
    </div>
  )
}
