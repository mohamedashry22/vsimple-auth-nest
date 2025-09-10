import { Outlet, Link, useLocation } from "react-router-dom"
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button } from "@heroui/react"
import { useAuth } from "@/store/auth"
import { api } from "@/lib/api"

export default function Layout() {
  const { user, setUser, ready } = useAuth()
  const { pathname } = useLocation()

  const logout = async () => {
    await api.signout()
    setUser(null)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar>
        <NavbarBrand><Link to="/" className="font-semibold">EG-MA-APP</Link></NavbarBrand>
        <NavbarContent justify="end">
          {!ready ? null : !user ? (
            <>
              <NavbarItem><Link to="/signin" className={pathname === "/signin" ? "font-medium" : ""}>Sign in</Link></NavbarItem>
              <NavbarItem><Link to="/signup" className={pathname === "/signup" ? "font-medium" : ""}>Sign up</Link></NavbarItem>
            </>
          ) : (
            <>
              <NavbarItem><Link to="/app" className={pathname === "/app" ? "font-medium" : ""}>App</Link></NavbarItem>
              <NavbarItem><Button size="sm" color="danger" variant="flat" onPress={logout}>Logout</Button></NavbarItem>
            </>
          )}
        </NavbarContent>
      </Navbar>
      <main className="flex-1 p-6"><Outlet /></main>
    </div>
  )
}
