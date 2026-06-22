import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "../context/ThemeContext"
import { searchAnime } from "../api/jikan"

export default function Navbar({ user, onLogout, onSearch, onMyList }) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === "dark"
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [scrolled, setScrolled] = useState(false)

  useState(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  })

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    try {
      const res = await searchAnime(searchQuery)
      onSearch(res.data.data)
    } catch (err) {
      console.error(err)
    }
  }

  const navStyle = {
    position: "fixed",
    top: 0, left: 0, right: 0,
    zIndex: 100,
    padding: "clamp(10px, 2vw, 16px) clamp(16px, 4vw, 48px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    transition: "all 0.4s",
    background: scrolled
      ? isDark ? "rgba(2,8,24,0.95)" : "rgba(255,240,245,0.95)"
      : "linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)",
    backdropFilter: scrolled ? "blur(20px)" : "none",
    borderBottom: scrolled
      ? isDark ? "1px solid rgba(200,168,233,0.1)" : "1px solid rgba(244,167,185,0.2)"
      : "none",
  }

  return (
    <nav style={navStyle}>
      {/* Logo */}
      <motion.div whileHover={{ scale: 1.05 }} style={{ cursor: "pointer" }}>
        <h1 style={{
          fontFamily: "Georgia, serif",
          fontSize: "clamp(18px, 3vw, 26px)",
          fontWeight: "bold",
          color: isDark ? "#e8d5f5" : "#e91e8c",
          textShadow: isDark ? "0 0 20px rgba(200,168,233,0.5)" : "0 0 20px rgba(233,30,140,0.3)",
          margin: 0,
        }}>
          ✦ AniMood
        </h1>
      </motion.div>

      {/* Nav links */}
      <div className="hidden md:flex items-center gap-6">
        {[
          { label: "Home", action: () => onMyList && onMyList(false) },
          { label: "Browse", action: () => {} },
          { label: "My List ♡", action: () => onMyList && onMyList(true) },
        ].map((item) => (
          <motion.span
            key={item.label}
            onClick={item.action}
            whileHover={{ scale: 1.05 }}
            style={{
              color: isDark ? "#c8a8e9" : "#e91e8c",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
              opacity: 0.85,
            }}
          >
            {item.label}
          </motion.span>
        ))}
      </div>

      {/* Right side */}
      <div style={{ display: "flex", alignItems: "center", gap: "clamp(8px, 2vw, 16px)" }}>

        {/* Search */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <AnimatePresence>
            {searchOpen && (
              <motion.form
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "clamp(150px, 20vw, 240px)", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSearch}
                style={{ overflow: "hidden" }}
              >
                <input
                  autoFocus
                  type="text"
                  placeholder="Search anime..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 14px",
                    borderRadius: "20px",
                    border: isDark ? "1px solid rgba(200,168,233,0.3)" : "1px solid rgba(233,30,140,0.3)",
                    background: isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.6)",
                    color: isDark ? "#e8d5f5" : "#c2185b",
                    fontSize: "13px",
                    outline: "none",
                    backdropFilter: "blur(10px)",
                  }}
                />
              </motion.form>
            )}
          </AnimatePresence>

          <motion.button
            onClick={() => setSearchOpen(!searchOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "18px",
              color: isDark ? "#c8a8e9" : "#e91e8c",
            }}
          >
            🔍
          </motion.button>
        </div>

        {/* Theme toggle */}
        <motion.button
          onClick={toggleTheme}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{
            background: isDark ? "rgba(200,168,233,0.15)" : "rgba(233,30,140,0.1)",
            border: isDark ? "1px solid rgba(200,168,233,0.3)" : "1px solid rgba(233,30,140,0.3)",
            borderRadius: "20px",
            padding: "6px 14px",
            cursor: "pointer",
            color: isDark ? "#c8a8e9" : "#e91e8c",
            fontSize: "clamp(11px, 1.5vw, 13px)",
            backdropFilter: "blur(10px)",
            whiteSpace: "nowrap",
          }}
        >
          {isDark ? "🌸 Sakura" : "🌙 Night"}
        </motion.button>

        {/* My List button mobile */}
        <motion.button
          onClick={() => onMyList && onMyList(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="md:hidden"
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: "18px",
            color: isDark ? "#c8a8e9" : "#e91e8c",
          }}
        >
          📋
        </motion.button>

        {/* User + logout */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            className="md:block"
            style={{
              color: isDark ? "#c8a8e9" : "#e91e8c",
              fontSize: "clamp(11px, 1.5vw, 13px)",
              display: "none",
            }}
          >
            ✦ {user?.name}
          </span>
          <motion.button
            onClick={onLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: "6px 14px",
              borderRadius: "20px",
              border: isDark ? "1px solid rgba(200,168,233,0.3)" : "1px solid rgba(233,30,140,0.3)",
              background: "transparent",
              color: isDark ? "#c8a8e9" : "#e91e8c",
              fontSize: "clamp(11px, 1.5vw, 13px)",
              cursor: "pointer",
            }}
          >
            Logout
          </motion.button>
        </div>
      </div>
    </nav>
  )
}