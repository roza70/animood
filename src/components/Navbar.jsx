import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "../context/ThemeContext"
import { searchAnime } from "../api/jikan"

export default function Navbar({ user, onLogout, onSearch, onMyList, onBrowse, onHome }) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === "dark"
  const [searchQuery, setSearchQuery] = useState("")
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    try {
      const res = await searchAnime(searchQuery)
      onSearch(res.data.data)
      setSearchQuery("")
      setMenuOpen(false)
    } catch (err) { console.error(err) }
  }

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      padding: "clamp(8px,2vw,14px) clamp(12px,4vw,48px)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: scrolled ? isDark ? "rgba(2,8,24,0.97)" : "rgba(255,240,245,0.97)" : "linear-gradient(to bottom,rgba(0,0,0,0.6),transparent)",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? isDark ? "1px solid rgba(200,168,233,0.1)" : "1px solid rgba(244,167,185,0.2)" : "none",
      transition: "all 0.4s", gap: 8,
    }}>
      {/* Logo */}
      <motion.div whileHover={{ scale: 1.05 }} onClick={() => onHome && onHome()} style={{ cursor: "pointer", flexShrink: 0 }}>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(16px,3vw,24px)", fontWeight: "bold", color: isDark ? "#e8d5f5" : "white", textShadow: "0 2px 8px rgba(0,0,0,0.5)", margin: 0, whiteSpace: "nowrap" }}>
          ✦ AniMood
        </h1>
      </motion.div>

      {/* Desktop nav links */}
      <div style={{ display: "flex", alignItems: "center", gap: "clamp(16px,3vw,28px)", flex: 1, justifyContent: "center" }}>
        {[
          { label: "Home", action: () => onHome && onHome() },
          { label: "Browse", action: () => onBrowse && onBrowse() },
          { label: "My List ♡", action: () => onMyList && onMyList(true) },
        ].map(item => (
          <motion.span key={item.label} onClick={item.action} whileHover={{ scale: 1.05 }}
            style={{ color: isDark ? "#c8a8e9" : "white", fontSize: "14px", fontWeight: "500", cursor: "pointer", whiteSpace: "nowrap", display: "none", textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}
            className="md:block">
            {item.label}
          </motion.span>
        ))}
      </div>

      {/* Right side */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        {/* Theme toggle */}
        <motion.button onClick={toggleTheme} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}
          style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: "20px", padding: "6px 12px", cursor: "pointer", color: "white", fontSize: "clamp(11px,1.3vw,13px)", backdropFilter: "blur(10px)", whiteSpace: "nowrap" }}>
          {isDark ? "🌸" : "🌙"}
        </motion.button>

        {/* Desktop logout */}
        <motion.button onClick={onLogout} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          style={{ padding: "6px 12px", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.1)", color: "white", fontSize: "clamp(11px,1.3vw,13px)", cursor: "pointer", backdropFilter: "blur(10px)", display: "none" }}
          className="md:block">
          Logout
        </motion.button>

        {/* Hamburger - mobile only, always visible */}
        <motion.button
          onClick={() => setMenuOpen(!menuOpen)}
          whileTap={{ scale: 0.9 }}
          style={{
            background: menuOpen ? "rgba(200,168,233,0.4)" : "rgba(255,255,255,0.2)",
            border: "2px solid rgba(255,255,255,0.6)",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "20px",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "6px 12px",
            backdropFilter: "blur(10px)",
            minWidth: 44,
            textShadow: "0 1px 4px rgba(0,0,0,0.5)",
          }}
        >
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
              display: "flex", flexDirection: "column", gap: 4,
              borderBottom: isDark ? "1px solid rgba(200,168,233,0.15)" : "1px solid rgba(233,30,140,0.15)",
              zIndex: 200,
            }}
          >
            {/* Search bar inside menu */}
            <form onSubmit={handleSearch} style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <input
                type="text"
                placeholder="Search anime..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  flex: 1, padding: "10px 14px", borderRadius: "12px",
                  border: isDark ? "1px solid rgba(200,168,233,0.3)" : "1px solid rgba(233,30,140,0.3)",
                  background: isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.8)",
                  color: isDark ? "#e8d5f5" : "#c2185b",
                  fontSize: "14px", outline: "none",
                }}
              />
              <button type="submit" style={{ padding: "10px 16px", borderRadius: "12px", border: "none", background: isDark ? "rgba(200,168,233,0.3)" : "rgba(233,30,140,0.2)", color: isDark ? "#e8d5f5" : "#e91e8c", cursor: "pointer", fontSize: "16px" }}>🔍</button>
            </form>

            {[
              { label: "🏠 Home", action: () => { onHome && onHome(); setMenuOpen(false) } },
              { label: "🎭 Browse", action: () => { onBrowse && onBrowse(); setMenuOpen(false) } },
              { label: "📋 My List", action: () => { onMyList && onMyList(true); setMenuOpen(false) } },
            ].map(item => (
              <motion.div key={item.label} onClick={item.action} whileTap={{ scale: 0.97 }}
                style={{ color: isDark ? "#c8a8e9" : "#e91e8c", fontSize: "16px", fontWeight: "600", cursor: "pointer", padding: "12px 8px", borderRadius: "10px", borderBottom: isDark ? "1px solid rgba(200,168,233,0.08)" : "1px solid rgba(233,30,140,0.08)" }}>
                {item.label}
              </motion.div>
            ))}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, paddingTop: 8 }}>
              <span style={{ color: isDark ? "#9b7fbf" : "#f06292", fontSize: "13px" }}>✦ {user?.name}</span>
              <motion.div onClick={() => { onLogout(); setMenuOpen(false) }} whileTap={{ scale: 0.97 }}
                style={{ color: "#ef5350", fontSize: "14px", fontWeight: "600", cursor: "pointer", padding: "6px 12px", borderRadius: "8px", background: "rgba(239,83,80,0.1)" }}>
                🚪 Logout
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
