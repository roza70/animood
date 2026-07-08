import { useEffect } from "react"
import { ThemeProvider } from "./context/ThemeContext"
import { AuthProvider, useAuth } from "./context/AuthContext"
import Landing from "./pages/Landing"
import Home from "./pages/Home"
import { motion, AnimatePresence } from "framer-motion"

function AppContent() {
  const { user, loading, logout } = useAuth()

  if (loading) return (
    <div style={{ position: "fixed", inset: 0, background: "#020818", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <motion.h1 animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }}
        style={{ fontFamily: "Georgia, serif", fontSize: "32px", color: "#c8a8e9" }}>
        ✦ AniMood
      </motion.h1>
    </div>
  )

  return (
    <AnimatePresence mode="wait">
      {!user ? (
        <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
          <Landing />
        </motion.div>
      ) : (
        <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
          <Home user={user} onLogout={logout} />
        </motion.div>
      )}
    </AnimatePresence>
  )
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
