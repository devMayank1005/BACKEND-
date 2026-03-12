import { RouterProvider } from "react-router"
import { router } from "./app.routes"
import { AuthProvider } from "./features/auth/auth.context"
import "./features/shared/global.scss"
import { PostContextProvider } from "./features/posts/post.context"
import UserProfileSidebar from "./features/shared/components/UserProfileSidebar"

function App() {

  return (
    <AuthProvider>
      <PostContextProvider>
        <RouterProvider router={router} />
        <UserProfileSidebar />
      </PostContextProvider>
    </AuthProvider>
  )
}

export default App