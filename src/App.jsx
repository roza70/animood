import { useState, useEffect } from "react"
import { ThemeProvider } from "./context/ThemeContext"
import Landing from "./pages/Landing"
import Home from "./pages/Home"
import { motion, AnimatePresence } from "framer-motion"

function AppContent() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem("animood_user")
    if (saved) setUser(JSON.parse(saved))
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.removeItem("animood_user")
    setUser(null)
  }

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