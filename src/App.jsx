import { AuthProvider, useAuth } from "./context/AuthContext"
import { ThemeProvider } from "./context/ThemeContext"
import Landing from "./pages/Landing"
import Home from "./pages/Home"

function AppContent() {
  const { user, loading, logout } = useAuth()

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#020818",
          color: "#c8a8e9",
          fontFamily: "Georgia, serif",
          fontSize: "16px",
        }}
      >
        ✦ Loading...
      </div>
    )
  }

  return user ? <Home user={user} onLogout={logout} /> : <Landing />
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  )
}
//loading