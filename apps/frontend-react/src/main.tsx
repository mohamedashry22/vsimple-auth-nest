import React from "react"
import ReactDOM from "react-dom/client"
import { RouterProvider } from "react-router-dom"
import { HeroUIProvider } from "@heroui/react"
import { AuthProvider } from "./store/AuthProvider"
import { router } from "./routes"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HeroUIProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </HeroUIProvider>
  </React.StrictMode>
)
