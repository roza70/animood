import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "../context/ThemeContext"

export default function Landing({ onLogin }) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === "dark"
  const [tab, setTab] = useState("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")

  const handleLogin = (e) => {
    e.preventDefault()
    setError("")
    const users = JSON.parse(localStorage.getItem("animood_users") || "[]")
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim())
    if (!found) { setError("No account found with this email."); return }
    if (found.password !== password) { setError("Wrong password. Try again."); return }
    localStorage.setItem("animood_user", JSON.stringify(found))
    onLogin(found)
  }

  const handleSignup = (e) => {
    e.preventDefault()
    setError("")
    if (!name.trim()) { setError("Please enter your name."); return }
    if (!email.trim()) { setError("Please enter your email."); return }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return }
    const users = JSON.parse(localStorage.getItem("animood_users") || "[]")
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase().trim())) {
      setError("An account with this email already exists. Please login.")
      setTab("login")
      return
    }
    const user = { name: name.trim(), email: email.toLowerCase().trim(), password, createdAt: Date.now() }
    users.push(user)
    localStorage.setItem("animood_users", JSON.stringify(users))
    localStorage.setItem("animood_user", JSON.stringify(user))
    onLogin(user)
  }

  // Background styles
  const darkBg = {
    background: "linear-gradient(135deg, #0a0f2e 0%, #161033 40%, #2a1850 70%, #1a2f5c 100%)",
  }
  const lightBg = {
    background: "linear-gradient(135deg, #fff3e8 0%, #ffe4f0 40%, #f8d7e8 70%, #e8f5e0 100%)",
  }

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "14px",
    border: isDark ? "1px solid rgba(200,168,233,0.3)" : "1px solid rgba(180,120,150,0.3)",
    background: isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.7)",
    color: isDark ? "#e8d5f5" : "#5a3050",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", ...(isDark ? darkBg : lightBg) }}>

      {/* Animated stars for dark */}
      {isDark && Array.from({ length: 30 }).map((_, i) => (
        <motion.div key={i}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 2 + (i % 3), repeat: Infinity, delay: Math.random() * 3 }}
          style={{ position: "absolute", top: `${Math.random() * 80}%`, left: `${Math.random() * 100}%`, width: Math.random() > 0.7 ? 3 : 2, height: Math.random() > 0.7 ? 3 : 2, background: "#fff", borderRadius: "50%", pointerEvents: "none" }} />
      ))}

      {/* Floating petals for light */}
      {!isDark && Array.from({ length: 12 }).map((_, i) => (
        <motion.div key={i}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: "110vh", x: [0, 15, -10, 0], opacity: [0, 0.7, 0.7, 0], rotate: [0, 180, 360] }}
          transition={{ duration: 7 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 6, ease: "linear" }}
          style={{ position: "absolute", top: 0, left: `${Math.random() * 100}%`, width: 8, height: 6, borderRadius: "50% 50% 50% 0", background: "rgba(220,140,170,0.5)", pointerEvents: "none" }} />
      ))}

      {/* Moon for dark */}
      {isDark && (
        <div style={{ position: "absolute", top: "8%", right: "10%", width: 60, height: 60, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #fff8f0 0%, #d4b8e8 100%)", boxShadow: "0 0 30px 10px rgba(200,168,233,0.35)", pointerEvents: "none" }} />
      )}

      {/* Sun for light */}
      {!isDark && (
        <div style={{ position: "absolute", top: "8%", left: "8%", width: 54, height: 54, borderRadius: "50%", background: "radial-gradient(circle, #fff9c4 0%, #ffd54f 100%)", boxShadow: "0 0 40px 14px rgba(255,213,79,0.4)", pointerEvents: "none" }} />
      )}

      {/* Theme toggle */}
      <motion.button onClick={toggleTheme} whileHover={{ scale: 1.05 }}
        style={{ position: "absolute", top: 20, right: 20, padding: "8px 16px", borderRadius: "20px", border: isDark ? "1px solid rgba(200,168,233,0.3)" : "1px solid rgba(180,120,150,0.3)", background: isDark ? "rgba(200,168,233,0.1)" : "rgba(255,255,255,0.5)", color: isDark ? "#c8a8e9" : "#8a4060", cursor: "pointer", fontSize: "13px", backdropFilter: "blur(10px)" }}>
        {isDark ? "🌸 Sakura" : "🌙 Night"}
      </motion.button>

      {/* Card */}
      <motion.div initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.6 }}
        style={{ width: "100%", maxWidth: "420px", margin: "20px", padding: "clamp(24px, 5vw, 40px)", borderRadius: "28px", background: isDark ? "rgba(10,5,40,0.85)" : "rgba(255,255,255,0.75)", border: isDark ? "1px solid rgba(200,168,233,0.2)" : "1px solid rgba(180,120,150,0.2)", backdropFilter: "blur(20px)", boxShadow: isDark ? "0 0 60px rgba(200,168,233,0.15)" : "0 0 60px rgba(180,120,150,0.15)" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(24px, 5vw, 32px)", fontWeight: "bold", color: isDark ? "#e8d5f5" : "#8a4060", margin: "0 0 6px 0" }}>✦ AniMood</h1>
          <p style={{ color: isDark ? "#9b7fbf" : "#a06080", fontSize: "13px", margin: 0 }}>Your anime world is waiting...</p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", background: isDark ? "rgba(255,255,255,0.05)" : "rgba(180,120,150,0.1)", borderRadius: "14px", padding: 4, marginBottom: 24 }}>
          {["login", "signup"].map(t => (
            <motion.button key={t} onClick={() => { setTab(t); setError("") }} whileTap={{ scale: 0.97 }}
              style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: "600", transition: "all 0.3s", background: tab === t ? isDark ? "rgba(200,168,233,0.3)" : "rgba(180,120,150,0.25)" : "transparent", color: tab === t ? isDark ? "#e8d5f5" : "#8a4060" : isDark ? "#9b7fbf" : "#a06080" }}>
              {t === "login" ? "Login" : "Sign Up"}
            </motion.button>
          ))}
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ padding: "10px 14px", borderRadius: "12px", background: "rgba(239,83,80,0.15)", border: "1px solid rgba(239,83,80,0.3)", color: "#ef5350", fontSize: "13px", marginBottom: 16 }}>
              ⚠ {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Login form */}
        <AnimatePresence mode="wait">
          {tab === "login" && (
            <motion.form key="login" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ color: isDark ? "#9b7fbf" : "#a06080", fontSize: "12px", fontWeight: "600", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>Email</label>
                <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} />
              </div>
              <div>
                <label style={{ color: isDark ? "#9b7fbf" : "#a06080", fontSize: "12px", fontWeight: "600", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>Password</label>
                <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required style={inputStyle} />
              </div>
              <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                style={{ padding: "13px", borderRadius: "14px", border: "none", background: isDark ? "linear-gradient(135deg, #7b1fa2, #c8a8e9)" : "linear-gradient(135deg, #c06080, #e8a0b8)", color: "white", fontSize: "15px", fontWeight: "700", cursor: "pointer", marginTop: 4 }}>
                Enter the World ✦
              </motion.button>
              <p style={{ textAlign: "center", color: isDark ? "#9b7fbf" : "#a06080", fontSize: "13px", margin: "4px 0 0 0" }}>
                New here?{" "}
                <span onClick={() => { setTab("signup"); setError("") }} style={{ color: isDark ? "#c8a8e9" : "#c06080", cursor: "pointer", fontWeight: "600" }}>Create account</span>
              </p>
            </motion.form>
          )}

          {tab === "signup" && (
            <motion.form key="signup" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ color: isDark ? "#9b7fbf" : "#a06080", fontSize: "12px", fontWeight: "600", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>Your Name</label>
                <input type="text" placeholder="Sakura" value={name} onChange={e => setName(e.target.value)} required style={inputStyle} />
              </div>
              <div>
                <label style={{ color: isDark ? "#9b7fbf" : "#a06080", fontSize: "12px", fontWeight: "600", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>Email</label>
                <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} />
              </div>
              <div>
                <label style={{ color: isDark ? "#9b7fbf" : "#a06080", fontSize: "12px", fontWeight: "600", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>Password</label>
                <input type="password" placeholder="Min 6 characters" value={password} onChange={e => setPassword(e.target.value)} required style={inputStyle} />
              </div>
              <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                style={{ padding: "13px", borderRadius: "14px", border: "none", background: isDark ? "linear-gradient(135deg, #7b1fa2, #c8a8e9)" : "linear-gradient(135deg, #c06080, #e8a0b8)", color: "white", fontSize: "15px", fontWeight: "700", cursor: "pointer", marginTop: 4 }}>
                Join AniMood ✦
              </motion.button>
              <p style={{ textAlign: "center", color: isDark ? "#9b7fbf" : "#a06080", fontSize: "13px", margin: "4px 0 0 0" }}>
                Already have an account?{" "}
                <span onClick={() => { setTab("login"); setError("") }} style={{ color: isDark ? "#c8a8e9" : "#c06080", cursor: "pointer", fontWeight: "600" }}>Login</span>
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
