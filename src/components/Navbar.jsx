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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener("scroll", handleScroll)
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleResize)
    }
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

  const navBg = scrolled
    ? isDark ? "rgba(2,8,24,0.97)" : "rgba(250,246,242,0.97)"
    : "linear-gradient(to bottom, rgba(0,0,0,0.55), transparent)"

  const linkColor = scrolled
    ? isDark ? "#c8a8e9" : "#7a4050"
    : "white"

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "clamp(10px,2vw,16px) clamp(16px,4vw,48px)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: navBg,
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? isDark ? "1px solid rgba(200,168,233,0.1)" : "1px solid rgba(180,130,130,0.15)" : "none",
        transition: "all 0.4s", gap: 12,
      }}>
        {/* Logo */}
        <motion.div whileHover={{ scale: 1.05 }} onClick={() => onHome && onHome()} style={{ cursor: "pointer", flexShrink: 0 }}>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(18px,3vw,26px)", fontWeight: "bold", color: scrolled ? isDark ? "#e8d5f5" : "#7a4050" : "white", textShadow: scrolled ? "none" : "0 2px 8px rgba(0,0,0,0.6)", margin: 0, whiteSpace: "nowrap" }}>
            ✦ AniMood
          </h1>
        </motion.div>

        {/* Desktop center links — only on desktop */}
        {!isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: "clamp(20px,3vw,36px)", flex: 1, justifyContent: "center" }}>
            {[
              { label: "Home", action: () => onHome && onHome() },
              { label: "Browse", action: () => onBrowse && onBrowse() },
              { label: "My List ♡", action: () => onMyList && onMyList(true) },
            ].map(item => (
              <motion.span key={item.label} onClick={item.action} whileHover={{ scale: 1.05 }}
                style={{ color: linkColor, fontSize: "clamp(13px,1.5vw,15px)", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap", textShadow: scrolled ? "none" : "0 1px 4px rgba(0,0,0,0.5)" }}>
                {item.label}
              </motion.span>
            ))}
          </div>
        )}

        {/* Right controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          {/* Theme toggle */}
          <motion.button onClick={toggleTheme} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}
            style={{ background: scrolled ? isDark ? "rgba(200,168,233,0.15)" : "rgba(180,100,110,0.12)" : "rgba(255,255,255,0.2)", border: scrolled ? isDark ? "1px solid rgba(200,168,233,0.3)" : "1px solid rgba(180,100,110,0.25)" : "1px solid rgba(255,255,255,0.4)", borderRadius: "20px", padding: "6px 12px", cursor: "pointer", color: scrolled ? isDark ? "#c8a8e9" : "#7a4050" : "white", fontSize: "13px", backdropFilter: "blur(10px)", whiteSpace: "nowrap" }}>
            {isDark ? "🌸" : "🌙"}
          </motion.button>

          {/* Desktop logout */}
          {!isMobile && (
            <motion.button onClick={onLogout} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              style={{ padding: "6px 14px", borderRadius: "20px", border: scrolled ? isDark ? "1px solid rgba(200,168,233,0.3)" : "1px solid rgba(180,100,110,0.25)" : "1px solid rgba(255,255,255,0.4)", background: "transparent", color: scrolled ? isDark ? "#c8a8e9" : "#7a4050" : "white", fontSize: "13px", cursor: "pointer", backdropFilter: "blur(10px)" }}>
              Logout
            </motion.button>
          )}

          {/* Hamburger - mobile only */}
          {isMobile && (
            <motion.button
              onClick={() => setMenuOpen(!menuOpen)}
              whileTap={{ scale: 0.9 }}
              style={{
                background: menuOpen ? isDark ? "rgba(200,168,233,0.3)" : "rgba(180,100,110,0.2)" : "rgba(255,255,255,0.25)",
                border: "2px solid rgba(255,255,255,0.7)",
                borderRadius: "12px",
                cursor: "pointer",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "8px 14px",
                backdropFilter: "blur(10px)",
                fontSize: "18px",
                fontWeight: "bold",
                minWidth: 48,
                boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                textShadow: "0 1px 4px rgba(0,0,0,0.5)",
              }}>
              {menuOpen ? "✕" : "☰"}
            </motion.button>
          )}
        </div>
      </nav>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              position: "fixed",
              top: "clamp(52px,10vw,72px)",
              left: 0, right: 0,
              zIndex: 99,
              background: isDark ? "rgba(2,8,24,0.99)" : "rgba(250,246,242,0.99)",
              backdropFilter: "blur(24px)",
              padding: "20px",
              display: "flex", flexDirection: "column", gap: 8,
              borderBottom: isDark ? "1px solid rgba(200,168,233,0.15)" : "1px solid rgba(180,130,130,0.15)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
            }}
          >
            {/* Search bar */}
            <form onSubmit={handleSearch} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <input
                type="text"
                placeholder="Search any anime..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  flex: 1, padding: "12px 16px", borderRadius: "14px",
                  border: isDark ? "1px solid rgba(200,168,233,0.3)" : "1px solid rgba(180,130,130,0.25)",
                  background: isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.9)",
                  color: isDark ? "#e8d5f5" : "#5a3040",
                  fontSize: "14px", outline: "none",
                }}
              />
              <button type="submit" style={{
                padding: "12px 18px", borderRadius: "14px", border: "none",
                background: isDark ? "linear-gradient(135deg,#7b1fa2,#c8a8e9)" : "linear-gradient(135deg,#b06070,#d4a0a8)",
                color: "white", cursor: "pointer", fontSize: "16px",
              }}>🔍</button>
            </form>

            {/* Nav links */}
            {[
              { label: "🏠 Home", action: () => { onHome && onHome(); setMenuOpen(false) } },
              { label: "🎭 Browse All Anime", action: () => { onBrowse && onBrowse(); setMenuOpen(false) } },
              { label: "📋 My List", action: () => { onMyList && onMyList(true); setMenuOpen(false) } },
            ].map(item => (
              <motion.div key={item.label} onClick={item.action} whileTap={{ scale: 0.97 }}
                style={{
                  color: isDark ? "#c8a8e9" : "#7a4050",
                  fontSize: "16px", fontWeight: "600", cursor: "pointer",
                  padding: "14px 16px", borderRadius: "12px",
                  background: isDark ? "rgba(200,168,233,0.06)" : "rgba(180,100,110,0.06)",
                  border: isDark ? "1px solid rgba(200,168,233,0.1)" : "1px solid rgba(180,100,110,0.1)",
                }}>
                {item.label}
              </motion.div>
            ))}

            {/* User + logout */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4, paddingTop: 12, borderTop: isDark ? "1px solid rgba(200,168,233,0.1)" : "1px solid rgba(180,100,110,0.1)" }}>
              <span style={{ color: isDark ? "#9b7fbf" : "#9a7080", fontSize: "13px" }}>✦ {user?.name}</span>
              <motion.div onClick={() => { onLogout(); setMenuOpen(false) }} whileTap={{ scale: 0.97 }}
                style={{ color: "#ef5350", fontSize: "14px", fontWeight: "600", cursor: "pointer", padding: "8px 16px", borderRadius: "10px", background: "rgba(239,83,80,0.1)", border: "1px solid rgba(239,83,80,0.2)" }}>
                🚪 Logout
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}