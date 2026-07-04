import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "../context/ThemeContext"
import { searchAnime } from "../api/jikan"

export default function Navbar({ user, onLogout, onSearch, onMyList, onBrowse, onHome }) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === "dark"
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

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
      setSearchOpen(false)
      setSearchQuery("")
      setMenuOpen(false)
    } catch (err) { console.error(err) }
  }

  const navStyle = {
    position: "fixed",
    top: 0, left: 0, right: 0,
    zIndex: 100,
    padding: "clamp(8px, 2vw, 14px) clamp(12px, 4vw, 48px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    transition: "all 0.4s",
    background: scrolled
      ? isDark ? "rgba(2,8,24,0.97)" : "rgba(255,240,245,0.97)"
      : "linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)",
    backdropFilter: scrolled ? "blur(20px)" : "none",
    borderBottom: scrolled
      ? isDark ? "1px solid rgba(200,168,233,0.1)" : "1px solid rgba(244,167,185,0.2)"
      : "none",
    gap: 8,
  }

  return (
    <nav style={navStyle}>
      {/* Logo */}
      <motion.div whileHover={{ scale: 1.05 }} onClick={() => onHome && onHome()} style={{ cursor: "pointer", flexShrink: 0 }}>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(16px, 3vw, 24px)", fontWeight: "bold", color: isDark ? "#e8d5f5" : "#e91e8c", textShadow: isDark ? "0 0 20px rgba(200,168,233,0.5)" : "0 0 20px rgba(233,30,140,0.3)", margin: 0, whiteSpace: "nowrap" }}>
          ✦ AniMood
        </h1>
      </motion.div>

      {/* Desktop nav links — hidden on mobile */}
      <div style={{ display: "flex", alignItems: "center", gap: "clamp(16px, 3vw, 28px)", flex: 1, justifyContent: "center" }}
        className="hidden md:flex">
        {[
          { label: "Home", action: () => onHome && onHome() },
          { label: "Browse", action: () => onBrowse && onBrowse() },
          { label: "My List ♡", action: () => onMyList && onMyList(true) },
        ].map(item => (
          <motion.span key={item.label} onClick={item.action} whileHover={{ scale: 1.05 }}
            style={{ color: isDark ? "#c8a8e9" : "#e91e8c", fontSize: "14px", fontWeight: "500", cursor: "pointer", whiteSpace: "nowrap" }}>
            {item.label}
          </motion.span>
        ))}
      </div>

      {/* Right controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>

        {/* Search */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <AnimatePresence>
            {searchOpen && (
              <motion.form
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "clamp(130px, 20vw, 220px)", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSearch}
                style={{ overflow: "hidden" }}
              >
                <input autoFocus type="text" placeholder="Search anime..."
                  value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  style={{ width: "100%", padding: "7px 12px", borderRadius: "20px", border: isDark ? "1px solid rgba(200,168,233,0.3)" : "1px solid rgba(233,30,140,0.3)", background: isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.8)", color: isDark ? "#e8d5f5" : "#c2185b", fontSize: "13px", outline: "none" }} />
              </motion.form>
            )}
          </AnimatePresence>
          <motion.button onClick={() => setSearchOpen(!searchOpen)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "18px", color: isDark ? "#c8a8e9" : "#e91e8c", padding: 4 }}>
            🔍
          </motion.button>
        </div>

        {/* Theme toggle */}
        <motion.button onClick={toggleTheme} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}
          style={{ background: isDark ? "rgba(200,168,233,0.15)" : "rgba(233,30,140,0.1)", border: isDark ? "1px solid rgba(200,168,233,0.3)" : "1px solid rgba(233,30,140,0.3)", borderRadius: "20px", padding: "5px 10px", cursor: "pointer", color: isDark ? "#c8a8e9" : "#e91e8c", fontSize: "clamp(10px, 1.3vw, 12px)", whiteSpace: "nowrap" }}>
          {isDark ? "🌸" : "🌙"}
        </motion.button>

        {/* Logout — desktop only */}
        <motion.button onClick={onLogout} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          className="hidden md:block"
          style={{ padding: "6px 12px", borderRadius: "20px", border: isDark ? "1px solid rgba(200,168,233,0.3)" : "1px solid rgba(233,30,140,0.3)", background: "transparent", color: isDark ? "#c8a8e9" : "#e91e8c", fontSize: "clamp(10px, 1.3vw, 12px)", cursor: "pointer" }}>
          Logout
        </motion.button>

        {/* Hamburger — mobile only */}
        <motion.button onClick={() => setMenuOpen(!menuOpen)} whileTap={{ scale: 0.9 }}
          style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "22px", color: isDark ? "#c8a8e9" : "#e91e8c", display: "flex", alignItems: "center", padding: 4 }}
          className="md:hidden">
          {menuOpen ? "✕" : "☰"}
        </motion.button>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              position: "absolute", top: "100%", left: 0, right: 0,
              background: isDark ? "rgba(2,8,24,0.99)" : "rgba(255,240,245,0.99)",
              backdropFilter: "blur(20px)",
              padding: "16px 20px",
              display: "flex", flexDirection: "column", gap: 14,
              borderBottom: isDark ? "1px solid rgba(200,168,233,0.15)" : "1px solid rgba(233,30,140,0.15)",
              zIndex: 200,
            }}
          >
            {[
              { label: "🏠 Home", action: () => { onHome && onHome(); setMenuOpen(false) } },
              { label: "🔍 Browse", action: () => { onBrowse && onBrowse(); setMenuOpen(false) } },
              { label: "📋 My List", action: () => { onMyList && onMyList(true); setMenuOpen(false) } },
            ].map(item => (
              <motion.span key={item.label} onClick={item.action} whileTap={{ scale: 0.97 }}
                style={{ color: isDark ? "#c8a8e9" : "#e91e8c", fontSize: "16px", fontWeight: "600", cursor: "pointer", padding: "4px 0" }}>
                {item.label}
              </motion.span>
            ))}
            <span style={{ color: isDark ? "#9b7fbf" : "#f06292", fontSize: "13px" }}>✦ {user?.name}</span>
            <motion.span onClick={() => { onLogout(); setMenuOpen(false) }} whileTap={{ scale: 0.97 }}
              style={{ color: "#ef5350", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
              🚪 Logout
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
