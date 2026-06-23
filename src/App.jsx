import { useState, useEffect } from "react"
import { ThemeProvider } from "./context/ThemeContext"
import Landing from "./pages/Landing"
import Home from "./pages/Home"
import { motion, AnimatePresence } from "framer-motion"

function AppContent() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem("animood_user")
    if (saved) {
      try {
        setUser(JSON.parse(saved))
      } catch (e) {
        localStorage.removeItem("animood_user")
      }
    }
    setLoading(false)
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.removeItem("animood_user")
    setUser(null)
  }

  if (loading) return (
    <div style={{
      position: "fixed", inset: 0,
      background: "#020818",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <motion.h1
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{
          fontFamily: "Georgia, serif",
          fontSize: "32px",
          color: "#c8a8e9",
        }}
      >
        ✦ AniMood
      </motion.h1>
    </div>
  )

  return (
    <AnimatePresence mode="wait">
      {!user ? (
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Landing onLogin={handleLogin} />
        </motion.div>
      ) : (
        <motion.div
          key="home"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Home user={user} onLogout={handleLogout} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}