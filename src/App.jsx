import { useState, useEffect } from "react"
import { ThemeProvider, useTheme } from "./context/ThemeContext"
import MoonlitBackground from "./components/Background/MoonlitBackground"
import SakuraBackground from "./components/Background/SakuraBackground"
import DarkCharacter from "./components/Character/DarkCharacter"
import LightCharacter from "./components/Character/LightCharacter"
import Landing from "./pages/Landing"
import { motion, AnimatePresence } from "framer-motion"

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed top-6 right-6 z-50 px-4 py-2 rounded-full text-sm font-medium"
      style={{
        background: theme === "dark" ? "rgba(200,168,233,0.2)" : "rgba(244,167,185,0.3)",
        border: theme === "dark" ? "1px solid rgba(200,168,233,0.4)" : "1px solid rgba(244,167,185,0.5)",
        color: theme === "dark" ? "#e8d5f5" : "#8b4a6b",
        backdropFilter: "blur(10px)",
        cursor: "pointer",
      }}
    >
      {theme === "dark" ? "🌸 Sakura World" : "🌙 Moonlit World"}
    </motion.button>
  )
}

function HomePage({ user, onLogout }) {
  const { theme } = useTheme()
  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        {theme === "dark" ? (
          <motion.div key="dark" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }}>
            <MoonlitBackground />
            <DarkCharacter />
          </motion.div>
        ) : (
          <motion.div key="light" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }}>
            <SakuraBackground />
            <LightCharacter />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logo */}
      <motion.div
        className="fixed top-6 left-6 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h1 style={{
          fontFamily: "Georgia, serif",
          fontSize: "28px",
          fontWeight: "bold",
          color: theme === "dark" ? "#e8d5f5" : "#8b4a6b",
          textShadow: theme === "dark" ? "0 0 20px rgba(200,168,233,0.5)" : "0 0 20px rgba(244,167,185,0.5)",
        }}>
          ✦ AniMood
        </h1>
      </motion.div>

      {/* User greeting + logout */}
      <motion.div
        className="fixed top-6 right-48 z-50 flex items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <span style={{ color: theme === "dark" ? "#c8a8e9" : "#c06b8a", fontSize: "14px" }}>
          ✦ Welcome, {user?.name}
        </span>
        <motion.button
          onClick={onLogout}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            padding: "6px 16px",
            borderRadius: "20px",
            border: theme === "dark" ? "1px solid rgba(200,168,233,0.3)" : "1px solid rgba(244,167,185,0.4)",
            background: "transparent",
            color: theme === "dark" ? "#c8a8e9" : "#c06b8a",
            fontSize: "13px",
            cursor: "pointer",
          }}
        >
          Logout
        </motion.button>
      </motion.div>

      <ThemeToggle />
    </div>
  )
}

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
        <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
          <Landing onLogin={handleLogin} />
        </motion.div>
      ) : (
        <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
          <HomePage user={user} onLogout={handleLogout} />
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