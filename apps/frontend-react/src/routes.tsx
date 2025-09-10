import { createBrowserRouter } from "react-router-dom"
import Layout from "@/shell/Layout"
import SignIn from "@/pages/SignIn"
import SignUp from "@/pages/SignUp"
import AppHome from "@/pages/AppHome"
import NotFound from "@/shell/NotFound"
import Protected from "@/shell/Protected"
import HomeRedirect from "./shell/HomeRedirect"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomeRedirect /> },
      { path: "signin", element: <SignIn /> },
      { path: "signup", element: <SignUp /> },
      {
        path: "app",
        element: (
          <Protected>
            <AppHome />
          </Protected>
        )
      },
      { path: "*", element: <NotFound /> }
    ]
  }
])

