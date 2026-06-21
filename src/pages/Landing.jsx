import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const random = (min, max) => Math.random() * (max - min) + min

const stars = Array.from({ length: 120 }, (_, i) => ({
  id: i,
  x: random(0, 100),
  y: random(0, 85),
  size: random(1, 3.5),
  delay: random(0, 6),
  duration: random(2, 5),
}))

const petals = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  x: random(0, 100),
  duration: random(6, 14),
  delay: random(0, 12),
  size: random(8, 18),
  drift: random(-150, 150),
  rotation: random(0, 360),
}))

// Petals that fall ON the form
const formPetals = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  x: random(0, 100),
  duration: random(4, 8),
  delay: random(0, 8),
  size: random(6, 12),
  drift: random(-60, 60),
  rotation: random(0, 360),
}))

function DarkBackground() {
  return (
    <div className="fixed inset-0 z-0" style={{
      background: "linear-gradient(to bottom, #010814 0%, #020f2e 40%, #051840 70%, #0a2a5e 100%)"
    }}>
      {stars.map(star => (
        <motion.div
          key={star.id}
          className="absolute rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            background: star.size > 2.5 ? "#ffd54f" : "#ffffff",
            boxShadow: star.size > 2.5 ? `0 0 ${star.size * 3}px rgba(255,213,79,0.8)` : "none",
          }}
          animate={{ opacity: [0.1, 1, 0.1], scale: [1, 1.5, 1] }}
          transition={{ duration: star.duration, repeat: Infinity, delay: star.delay }}
        />
      ))}

      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${random(5, 70)}%`,
            top: `${random(3, 35)}%`,
            width: "120px",
            height: "1.5px",
            background: "linear-gradient(to right, transparent, #ffffff, #ffd54f)",
            rotate: "25deg",
          }}
          animate={{ x: [0, 300], opacity: [0, 1, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 2.5, repeatDelay: random(5, 12) }}
        />
      ))}

      {/* Moon */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 70, height: 70,
          top: "7%", right: "10%",
          background: "radial-gradient(circle at 35% 35%, #fffde7, #ffd54f)",
          boxShadow: "0 0 40px 15px rgba(255,213,79,0.2)",
        }}
        animate={{ boxShadow: ["0 0 40px 15px rgba(255,213,79,0.2)", "0 0 60px 25px rgba(255,213,79,0.35)", "0 0 40px 15px rgba(255,213,79,0.2)"] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* Waves */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden" style={{ height: "150px" }}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: `${60 + i * 25}px`,
              background: `rgba(10, 40, 120, ${0.25 + i * 0.15})`,
              borderRadius: "60% 60% 0 0 / 30px 30px 0 0",
            }}
            animate={{ x: ["-5%", "5%", "-5%"], scaleY: [1, 1.08, 1] }}
            transition={{ duration: 3 + i * 0.8, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
          />
        ))}
        {[...Array(14)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              bottom: `${random(10, 100)}px`,
              left: `${random(5, 95)}%`,
              width: random(2, 5), height: random(2, 5),
              background: "#7ecef4",
              boxShadow: "0 0 4px 2px rgba(126,206,244,0.6)",
            }}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }}
            transition={{ duration: random(1.5, 3), repeat: Infinity, delay: random(0, 4) }}
          />
        ))}
      </div>
    </div>
  )
}

function LightBackground() {
  return (
    <div className="fixed inset-0 z-0" style={{
      background: "linear-gradient(to bottom, #fff0f5 0%, #ffe4ed 40%, #ffd6e7 70%, #ffcce3 100%)"
    }}>
      {/* Sun */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 80, height: 80,
          top: "7%", left: "12%",
          background: "radial-gradient(circle at 40% 40%, #fff9c4, #ffcc02)",
          boxShadow: "0 0 60px 30px rgba(255,204,2,0.15)",
        }}
        animate={{ boxShadow: ["0 0 60px 30px rgba(255,204,2,0.15)", "0 0 80px 40px rgba(255,204,2,0.25)", "0 0 60px 30px rgba(255,204,2,0.15)"] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* Clouds */}
      {[
        { y: 10, w: 180, dur: 40, delay: 0 },
        { y: 18, w: 130, dur: 32, delay: 8 },
        { y: 7, w: 220, dur: 50, delay: 18 },
      ].map((c, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ top: `${c.y}%`, width: c.w, height: 50 }}
          animate={{ x: ["-15%", "115%"] }}
          transition={{ duration: c.dur, repeat: Infinity, delay: c.delay, ease: "linear" }}
        >
          <div style={{
            width: "100%", height: "100%",
            background: "radial-gradient(ellipse, rgba(255,255,255,0.95) 0%, transparent 70%)",
            filter: "blur(10px)", borderRadius: "50%",
          }} />
        </motion.div>
      ))}

      {/* Full screen petals */}
      {petals.map(petal => (
        <motion.div
          key={petal.id}
          className="absolute"
          style={{
            left: `${petal.x}%`, top: "-20px",
            width: petal.size, height: petal.size * 0.8,
            background: "radial-gradient(ellipse, #ffb7c5, #ff8fab)",
            borderRadius: "50% 50% 50% 0", opacity: 0.85,
          }}
          animate={{
            y: ["0vh", "110vh"],
            x: [0, petal.drift],
            rotate: [petal.rotation, petal.rotation + 360],
            opacity: [0, 0.85, 0.85, 0],
          }}
          transition={{ duration: petal.duration, repeat: Infinity, delay: petal.delay, ease: "linear" }}
        />
      ))}

      {/* Sakura trees bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 200" preserveAspectRatio="none" style={{ width: "100%", height: "200px" }}>
          <ellipse cx="200" cy="180" rx="180" ry="60" fill="#ffb7c5" opacity="0.4" />
          <ellipse cx="200" cy="160" rx="140" ry="50" fill="#ff8fab" opacity="0.35" />
          <rect x="192" y="160" width="16" height="40" fill="#8d5524" />
          <ellipse cx="1240" cy="180" rx="180" ry="60" fill="#ffb7c5" opacity="0.4" />
          <ellipse cx="1240" cy="160" rx="140" ry="50" fill="#ff8fab" opacity="0.35" />
          <rect x="1232" y="160" width="16" height="40" fill="#8d5524" />
        </svg>
      </div>
    </div>
  )
}

export default function Landing({ onLogin }) {
  const [theme, setTheme] = useState("light")
  const [isLogin, setIsLogin] = useState(true)
  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const [error, setError] = useState("")
  const isDark = theme === "dark"

  const handleSubmit = () => {
    setError("")
    if (!form.email || !form.password) { setError("Please fill in all fields!"); return }
    if (!isLogin && !form.name) { setError("Please enter your name!"); return }

    if (isLogin) {
      const users = JSON.parse(localStorage.getItem("animood_users") || "[]")
      const user = users.find(u => u.email === form.email && u.password === form.password)
      if (!user) { setError("Invalid email or password!"); return }
      localStorage.setItem("animood_user", JSON.stringify(user))
      onLogin(user)
    } else {
      const users = JSON.parse(localStorage.getItem("animood_users") || "[]")
      if (users.find(u => u.email === form.email)) { setError("Email already exists!"); return }
      const newUser = { name: form.name, email: form.email, password: form.password }
      users.push(newUser)
      localStorage.setItem("animood_users", JSON.stringify(users))
      localStorage.setItem("animood_user", JSON.stringify(newUser))
      onLogin(newUser)
    }
  }

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "12px",
    border: isDark
      ? "1px solid rgba(180,210,255,0.2)"
      : "1px solid rgba(255,143,175,0.3)",
    background: isDark
      ? "rgba(255,255,255,0.06)"
      : "rgba(255,255,255,0.45)",
    color: isDark ? "#cce8ff" : "#c2185b",
    fontSize: "14px",
    outline: "none",
    backdropFilter: "blur(8px)",
    boxSizing: "border-box",
    transition: "all 0.3s",
  }

  const labelStyle = {
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "1px",
    textTransform: "uppercase",
    color: isDark ? "#90caf9" : "#e91e8c",
    marginBottom: "6px",
    display: "block",
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      {/* Background */}
      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.div key="dark" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
            <DarkBackground />
          </motion.div>
        ) : (
          <motion.div key="light" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
            <LightBackground />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logo */}
      <div className="fixed top-6 left-8 z-50">
        <h1 style={{
          fontFamily: "Georgia, serif",
          fontSize: "clamp(18px, 3vw, 24px)",
          fontWeight: "bold",
          color: isDark ? "#90caf9" : "#e91e8c",
          textShadow: isDark ? "0 0 20px rgba(144,202,249,0.6)" : "0 0 20px rgba(233,30,140,0.4)",
          margin: 0,
        }}>
          ✦ AniMood
        </h1>
      </div>

      {/* Theme toggle */}
      <motion.button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed top-6 right-8 z-50"
        style={{
          padding: "8px 18px",
          borderRadius: "20px",
          border: isDark ? "1px solid rgba(144,202,249,0.3)" : "1px solid rgba(233,30,140,0.3)",
          background: isDark ? "rgba(144,202,249,0.1)" : "rgba(255,255,255,0.4)",
          color: isDark ? "#90caf9" : "#e91e8c",
          fontSize: "13px",
          cursor: "pointer",
          backdropFilter: "blur(10px)",
        }}
      >
        {isDark ? "🌸 Sakura Mode" : "🌙 Night Mode"}
      </motion.button>

      {/* FORM CARD */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: "min(420px, 90vw)",
          margin: "0 16px",
          borderRadius: "28px",
          overflow: "hidden",
        }}
      >
        {/* Petals falling ON the form (light mode only) */}
        {!isDark && formPetals.map(petal => (
          <motion.div
            key={petal.id}
            style={{
              position: "absolute",
              left: `${petal.x}%`,
              top: "-20px",
              width: petal.size,
              height: petal.size * 0.8,
              background: "radial-gradient(ellipse, #ffb7c5, #ff8fab)",
              borderRadius: "50% 50% 50% 0",
              opacity: 0.7,
              zIndex: 20,
              pointerEvents: "none",
            }}
            animate={{
              y: ["0px", "600px"],
              x: [0, petal.drift],
              rotate: [petal.rotation, petal.rotation + 360],
              opacity: [0, 0.7, 0.7, 0],
            }}
            transition={{ duration: petal.duration, repeat: Infinity, delay: petal.delay, ease: "linear" }}
          />
        ))}

        {/* Card background — glassy */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: isDark
            ? "linear-gradient(to bottom, rgba(5,20,60,0.75) 0%, rgba(5,15,45,0.6) 60%, rgba(10,40,100,0.4) 100%)"
            : "linear-gradient(to bottom, rgba(255,230,240,0.85) 0%, rgba(255,210,230,0.7) 50%, rgba(255,180,210,0.3) 100%)",
          backdropFilter: "blur(20px)",
          borderRadius: "28px",
          border: isDark
            ? "1px solid rgba(144,202,249,0.15)"
            : "1px solid rgba(255,143,175,0.3)",
          boxShadow: isDark
            ? "0 8px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)"
            : "0 8px 60px rgba(255,100,150,0.15), inset 0 1px 0 rgba(255,255,255,0.6)",
        }} />

        {/* Card content */}
        <div style={{ position: "relative", zIndex: 15, padding: "clamp(24px, 5vw, 40px)" }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <AnimatePresence mode="wait">
              <motion.h2
                key={isLogin ? "l" : "s"}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "clamp(18px, 4vw, 26px)",
                  fontWeight: "bold",
                  color: isDark ? "#cce8ff" : "#e91e8c",
                  margin: "0 0 8px 0",
                  textShadow: isDark ? "0 0 20px rgba(144,202,249,0.3)" : "0 0 20px rgba(233,30,140,0.2)",
                }}
              >
                {isLogin ? "✦ Welcome Back" : "✦ Join AniMood"}
              </motion.h2>
            </AnimatePresence>
            <p style={{ color: isDark ? "#90caf9" : "#f06292", fontSize: "13px", margin: 0 }}>
              {isLogin ? "Your anime world is waiting..." : "Begin your anime journey..."}
            </p>
          </div>

          {/* Tab toggle */}
          <div style={{
            display: "flex",
            marginBottom: "24px",
            borderRadius: "14px",
            overflow: "hidden",
            border: isDark ? "1px solid rgba(144,202,249,0.15)" : "1px solid rgba(255,143,175,0.25)",
            background: isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.3)",
          }}>
            {["Login", "Sign Up"].map((tab, i) => (
              <motion.button
                key={tab}
                onClick={() => { setIsLogin(i === 0); setError(""); setForm({ name: "", email: "", password: "" }) }}
                whileTap={{ scale: 0.97 }}
                style={{
                  flex: 1, padding: "10px",
                  fontSize: "13px", fontWeight: "600",
                  border: "none", cursor: "pointer",
                  borderRadius: "12px", transition: "all 0.3s",
                  background: (isLogin ? i === 0 : i === 1)
                    ? isDark ? "rgba(144,202,249,0.2)" : "rgba(233,30,140,0.15)"
                    : "transparent",
                  color: isDark ? "#cce8ff" : "#e91e8c",
                }}
              >
                {tab}
              </motion.button>
            ))}
          </div>

          {/* Fields */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <AnimatePresence>
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ overflow: "hidden" }}
                >
                  <label style={labelStyle}>Name</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    style={inputStyle}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{ color: "#ef5350", fontSize: "13px", marginTop: "10px", textAlign: "center" }}
              >
                ⚠ {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Submit */}
          <motion.button
            onClick={handleSubmit}
            whileHover={{ scale: 1.02, boxShadow: isDark ? "0 6px 30px rgba(144,202,249,0.4)" : "0 6px 30px rgba(233,30,140,0.4)" }}
            whileTap={{ scale: 0.97 }}
            style={{
              width: "100%",
              padding: "14px",
              marginTop: "22px",
              borderRadius: "14px",
              border: "none",
              background: isDark
                ? "linear-gradient(135deg, #1565c0, #42a5f5)"
                : "linear-gradient(135deg, #e91e8c, #f48fb1)",
              color: "white",
              fontSize: "15px",
              fontWeight: "700",
              cursor: "pointer",
              fontFamily: "Georgia, serif",
              letterSpacing: "0.5px",
              boxShadow: isDark ? "0 4px 20px rgba(66,165,245,0.3)" : "0 4px 20px rgba(233,30,140,0.3)",
              transition: "all 0.3s",
            }}
          >
            {isLogin ? "✦ Enter the World" : "✦ Begin Journey"}
          </motion.button>

          {/* Switch */}
          <p style={{ textAlign: "center", marginTop: "18px", fontSize: "13px", color: isDark ? "#90caf9" : "#f06292" }}>
            {isLogin ? "New here? " : "Already have an account? "}
            <span
              onClick={() => { setIsLogin(!isLogin); setError(""); setForm({ name: "", email: "", password: "" }) }}
              style={{ color: isDark ? "#cce8ff" : "#e91e8c", cursor: "pointer", textDecoration: "underline", fontWeight: "600" }}
            >
              {isLogin ? "Create account" : "Login"}
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
