import { AuthProvider, useAuth } from "./context/AuthContext"
import { ThemeProvider } from "./context/ThemeContext"
import Landing from "./pages/Landing"
import Home from "./pages/Home"
import AmbientEffects from "./components/AmbientEffects"
import { motion, AnimatePresence } from "framer-motion"

function AppContent() {
  const { user, loading, logout } = useAuth()

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#020818" }}>
      <motion.h1
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ fontFamily: "Georgia, serif", fontSize: "32px", color: "#c8a8e9" }}>
        ✦ AniMood
      </motion.h1>
    </div>
  )

  return (
    <>
      <AmbientEffects />
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
    </>
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