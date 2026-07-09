import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "../context/ThemeContext"
import { useAuth } from "../context/AuthContext"

function NightBackground() {
  const stars = Array.from({ length: 35 }, (_, i) => ({
    id: i, top: Math.random() * 70, left: Math.random() * 100,
    delay: Math.random() * 4, size: Math.random() > 0.7 ? 3 : 2,
  }))
  return (
    <div className="fixed inset-0 overflow-hidden" style={{ background: "linear-gradient(180deg,#060d26 0%,#0f1540 40%,#1a1050 70%,#141e40 100%)", zIndex: 0 }}>
      <div style={{ position:"absolute", top:"8%", right:"12%", width:60, height:60, borderRadius:"50%", background:"radial-gradient(circle at 35% 30%,#fff8f0 0%,#d4b8e8 100%)", boxShadow:"0 0 0 3px rgba(200,168,233,0.4),0 0 30px 10px rgba(200,168,233,0.35)" }}>
        <div style={{ position:"absolute", top:"28%", left:"22%", width:8, height:8, borderRadius:"50%", background:"rgba(170,140,200,0.3)" }} />
        <div style={{ position:"absolute", top:"58%", left:"52%", width:5, height:5, borderRadius:"50%", background:"rgba(170,140,200,0.25)" }} />
      </div>
      {stars.map(s => (
        <motion.div key={s.id} animate={{ opacity:[0.2,1,0.2] }} transition={{ duration:2.5+(s.id%3), repeat:Infinity, delay:s.delay }}
          style={{ position:"absolute", top:`${s.top}%`, left:`${s.left}%`, width:s.size, height:s.size, background:"#fff" }} />
      ))}
      <motion.div initial={{ x:0, y:0, opacity:0 }} animate={{ x:"40vw", y:"20vh", opacity:[0,1,0] }}
        transition={{ duration:1.2, repeat:Infinity, repeatDelay:7, ease:"easeIn" }}
        style={{ position:"absolute", top:"5%", left:"10%", width:50, height:2, background:"linear-gradient(90deg,transparent,#fff,transparent)", transform:"rotate(20deg)" }} />
      <div style={{ position:"absolute", bottom:"30%", left:0, right:0, height:"14%", background:"#120a2e", clipPath:"polygon(0% 100%,0% 60%,10% 30%,20% 55%,32% 15%,45% 50%,58% 25%,70% 55%,82% 20%,92% 45%,100% 35%,100% 100%)", opacity:0.85 }} />
      <div style={{ position:"absolute", bottom:"20%", left:0, right:0, height:"16%", background:"#1c1240", clipPath:"polygon(0% 100%,0% 40%,20% 28%,40% 50%,60% 22%,80% 44%,100% 28%,100% 100%)" }} />
      {[5,16,30,70,84,93].map((left,i) => (
        <div key={i} style={{ position:"absolute", bottom:"28%", left:`${left}%`, width:20 }}>
          <div style={{ width:0, height:0, borderLeft:"9px solid transparent", borderRight:"9px solid transparent", borderBottom:"14px solid #0a0f25" }} />
          <div style={{ width:0, height:0, borderLeft:"11px solid transparent", borderRight:"11px solid transparent", borderBottom:"16px solid #0a0f25", marginLeft:-2, marginTop:-6 }} />
          <div style={{ width:0, height:0, borderLeft:"13px solid transparent", borderRight:"13px solid transparent", borderBottom:"18px solid #0a0f25", marginLeft:-4, marginTop:-8 }} />
          <div style={{ width:4, height:6, background:"#0a0f25", margin:"0 auto" }} />
        </div>
      ))}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"22%", background:"linear-gradient(180deg,#1a2f5c 0%,#0e1c38 100%)" }} />
      {[0,1,2].map(i => (
        <motion.div key={i} animate={{ opacity:[0.3,0.8,0.3] }} transition={{ duration:2+i, repeat:Infinity, delay:i*0.7 }}
          style={{ position:"absolute", bottom:`${5+i*5}%`, left:0, right:0, height:2, background:"linear-gradient(90deg,transparent,rgba(150,180,230,0.5),transparent)" }} />
      ))}
      <div style={{ position:"absolute", bottom:"4%", right:"14%", width:50, height:"15%", background:"linear-gradient(180deg,rgba(200,168,233,0.35),transparent)", clipPath:"polygon(40% 0%,60% 0%,80% 100%,20% 100%)" }} />
      {[15,35,55,75].map((left,i) => (
        <motion.div key={i} animate={{ y:[0,-14,0], opacity:[0,1,0.3,1,0] }} transition={{ duration:4.5, repeat:Infinity, delay:i*0.8 }}
          style={{ position:"absolute", bottom:`${6+i*3}%`, left:`${left}%`, width:4, height:4, borderRadius:"50%", background:"#ffe082", boxShadow:"0 0 7px 3px rgba(255,224,130,0.7)" }} />
      ))}
      {Array.from({length:8},(_,i)=>({left:Math.random()*100,delay:Math.random()*6,dur:6+Math.random()*4})).map((p,i) => (
        <motion.div key={i} initial={{ y:-10, opacity:0 }} animate={{ y:"100vh", x:[0,12,-8,0], opacity:[0,0.8,0.8,0], rotate:[0,180,360] }}
          transition={{ duration:p.dur, repeat:Infinity, delay:p.delay, ease:"linear" }}
          style={{ position:"absolute", top:0, left:`${p.left}%`, width:5, height:4, borderRadius:"50% 50% 50% 0", background:"radial-gradient(ellipse,#c8a8e9,#9575cd)" }} />
      ))}
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(2,8,24,0.5) 0%,transparent 40%)", zIndex:1 }} />
    </div>
  )
}

function SakuraBackground() {
  const petals = Array.from({ length: 18 }, (_, i) => ({
    id: i, left: Math.random()*100, delay: Math.random()*6, dur: 5+Math.random()*4, size: 4+Math.random()*3,
  }))
  return (
    <div className="fixed inset-0 overflow-hidden" style={{ background:"linear-gradient(180deg,#fff3d6 0%,#ffe6f0 35%,#ffd5e8 55%,#d8f0c8 78%,#b0d8a0 100%)", zIndex:0 }}>
      <div style={{ position:"absolute", top:"9%", left:"11%", width:54, height:54, borderRadius:"50%", background:"radial-gradient(circle at 38% 32%,#fff9c4 0%,#ffd54f 70%,#ffb300 100%)", boxShadow:"0 0 0 3px rgba(255,193,7,0.4),0 0 36px 12px rgba(255,213,79,0.5)" }} />
      {[{top:10,left:"50%"},{top:20,right:"8%"}].map((c,i) => (
        <motion.div key={i} animate={{ x:[0,8,0] }} transition={{ duration:10+i*3, repeat:Infinity, ease:"easeInOut" }}
          style={{ position:"absolute", ...c, opacity:0.88 }}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
            <div style={{ width:30, height:14, borderRadius:"50% 50% 0 0", background:"#fff", marginBottom:-4 }} />
            <div style={{ width:60, height:16, borderRadius:"20px", background:"#fff" }} />
          </div>
        </motion.div>
      ))}
      <div style={{ position:"absolute", bottom:"24%", left:0, right:0, height:"16%", background:"#b8dca8", clipPath:"polygon(0% 100%,0% 50%,12% 30%,28% 55%,42% 20%,58% 48%,72% 28%,88% 52%,100% 30%,100% 100%)", opacity:0.7 }} />
      <div style={{ position:"absolute", bottom:"18%", left:0, right:0, height:"20%", background:"linear-gradient(180deg,#9fcf8e,#87c074)", clipPath:"polygon(0% 100%,0% 38%,18% 28%,36% 48%,52% 22%,68% 42%,84% 20%,100% 35%,100% 100%)" }} />
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"24%", background:"linear-gradient(180deg,#82c06f 0%,#6ba65a 60%,#5a9249 100%)" }} />
      {[6,18,32,48,62,76,90].map((left,i) => (
        <div key={i} style={{ position:"absolute", bottom:`${3+(i%3)*2}%`, left:`${left}%`, width:2, height:8, background:"#4d8a3f" }} />
      ))}
      {[{right:"4%",scale:1},{right:"30%",scale:0.7},{left:"2%",scale:0.78}].map((t,i) => (
        <div key={i} style={{ position:"absolute", bottom:"26%", ...(t.right?{right:t.right}:{left:t.left}), display:"flex", flexDirection:"column", alignItems:"center", transform:`scale(${t.scale})`, transformOrigin:"bottom center" }}>
          <div style={{ width:40, height:32, borderRadius:"50%", background:i%2===0?"radial-gradient(circle,#ffd6e3 0%,#ffb8cc 100%)":"radial-gradient(circle,#ffe0ec 0%,#ffc4d6 100%)" }} />
          <div style={{ width:6, height:18, background:"#7a5440", borderRadius:"0 0 2px 2px" }} />
        </div>
      ))}
      {[12,28,46,58,74,88].map((left,i) => (
        <div key={i} style={{ position:"absolute", bottom:`${2+(i%2)*2}%`, left:`${left}%` }}>
          <div style={{ width:2, height:10, background:"#4d8a3f", margin:"0 auto" }} />
          <div style={{ width:8, height:8, borderRadius:"50%", marginLeft:-3, background:i%3===0?"#ffb3c6":i%3===1?"#fff176":"#ce93d8" }} />
        </div>
      ))}
      {petals.map(p => (
        <motion.div key={p.id} initial={{ y:-20, opacity:0, rotate:0 }} animate={{ y:"110vh", x:[0,16,-10,6,0], opacity:[0,1,1,0], rotate:[0,180,360] }}
          transition={{ duration:p.dur, repeat:Infinity, delay:p.delay, ease:"linear" }}
          style={{ position:"absolute", top:0, left:`${p.left}%`, width:p.size, height:p.size*0.75, borderRadius:"50% 50% 50% 0", background:"radial-gradient(ellipse,#ffc4d6,#ff9eb8)" }} />
      ))}
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(255,240,245,0.25) 0%,transparent 35%)", zIndex:1 }} />
    </div>
  )
}

export default function Landing() {
  const { theme, toggleTheme } = useTheme()
  const { signup, login } = useAuth()
  const isDark = theme === "dark"
  const [tab, setTab] = useState("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await login(email.trim(), password)
    } catch (err) {
      if (err.code === "auth/user-not-found" || err.code === "auth/invalid-credential") {
        setError("No account found with this email.")
      } else if (err.code === "auth/wrong-password") {
        setError("Wrong password. Try again.")
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email address.")
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many attempts. Try again later.")
      } else {
        setError("Login failed. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setError("")
    if (!name.trim()) { setError("Please enter your name."); return }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return }
    setLoading(true)
    try {
      await signup(name.trim(), email.trim(), password)
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("Account already exists. Please login.")
        setTab("login")
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email address.")
      } else if (err.code === "auth/weak-password") {
        setError("Password is too weak.")
      } else {
        setError("Signup failed. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: "100%", padding: "12px 16px", borderRadius: "14px",
    border: isDark ? "1px solid rgba(200,168,233,0.3)" : "1px solid rgba(180,120,150,0.3)",
    background: isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.7)",
    color: isDark ? "#e8d5f5" : "#5a3050",
    fontSize: "14px", outline: "none", boxSizing: "border-box",
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
      {isDark ? <NightBackground /> : <SakuraBackground />}

      <motion.button onClick={toggleTheme} whileHover={{ scale: 1.05 }}
        style={{ position: "fixed", top: 20, right: 20, padding: "8px 16px", borderRadius: "20px", border: isDark ? "1px solid rgba(200,168,233,0.3)" : "1px solid rgba(180,120,150,0.3)", background: isDark ? "rgba(10,5,40,0.8)" : "rgba(255,255,255,0.6)", color: isDark ? "#c8a8e9" : "#8a4060", cursor: "pointer", fontSize: "13px", backdropFilter: "blur(10px)", zIndex: 10 }}>
        {isDark ? "🌸 Sakura" : "🌙 Night"}
      </motion.button>

      <motion.div initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.6 }}
        style={{ width: "100%", maxWidth: "420px", margin: "20px", padding: "clamp(24px, 5vw, 40px)", borderRadius: "28px", background: isDark ? "rgba(10,5,40,0.88)" : "rgba(255,255,255,0.78)", border: isDark ? "1px solid rgba(200,168,233,0.2)" : "1px solid rgba(180,120,150,0.2)", backdropFilter: "blur(20px)", boxShadow: isDark ? "0 0 60px rgba(200,168,233,0.15)" : "0 0 60px rgba(180,120,150,0.12)", position: "relative", zIndex: 5 }}>

        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(24px, 5vw, 32px)", fontWeight: "bold", color: isDark ? "#e8d5f5" : "#8a4060", margin: "0 0 6px 0" }}>✦ AniMood</h1>
          <p style={{ color: isDark ? "#9b7fbf" : "#a06080", fontSize: "13px", margin: 0 }}>Your anime world is waiting...</p>
        </div>

        <div style={{ display: "flex", background: isDark ? "rgba(255,255,255,0.05)" : "rgba(180,120,150,0.1)", borderRadius: "14px", padding: 4, marginBottom: 24 }}>
          {["login", "signup"].map(t => (
            <button key={t} onClick={() => { setTab(t); setError("") }}
              style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: "600", transition: "all 0.3s", background: tab === t ? isDark ? "rgba(200,168,233,0.3)" : "rgba(180,120,150,0.25)" : "transparent", color: tab === t ? isDark ? "#e8d5f5" : "#8a4060" : isDark ? "#9b7fbf" : "#a06080" }}>
              {t === "login" ? "Login" : "Sign Up"}
            </button>
          ))}
        </div>

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ padding: "10px 14px", borderRadius: "12px", background: "rgba(239,83,80,0.15)", border: "1px solid rgba(239,83,80,0.3)", color: "#ef5350", fontSize: "13px", marginBottom: 16 }}>
              ⚠ {error}
            </motion.div>
          )}
        </AnimatePresence>

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
              <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                style={{ padding: "13px", borderRadius: "14px", border: "none", background: isDark ? "linear-gradient(135deg,#7b1fa2,#c8a8e9)" : "linear-gradient(135deg,#c06080,#e8a0b8)", color: "white", fontSize: "15px", fontWeight: "700", cursor: "pointer", marginTop: 4, opacity: loading ? 0.7 : 1 }}>
                {loading ? "Entering..." : "Enter the World ✦"}
              </motion.button>
              <p style={{ textAlign: "center", color: isDark ? "#9b7fbf" : "#a06080", fontSize: "13px", margin: "4px 0 0 0" }}>
                New here? <span onClick={() => { setTab("signup"); setError("") }} style={{ color: isDark ? "#c8a8e9" : "#c06080", cursor: "pointer", fontWeight: "600" }}>Create account</span>
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
              <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                style={{ padding: "13px", borderRadius: "14px", border: "none", background: isDark ? "linear-gradient(135deg,#7b1fa2,#c8a8e9)" : "linear-gradient(135deg,#c06080,#e8a0b8)", color: "white", fontSize: "15px", fontWeight: "700", cursor: "pointer", marginTop: 4, opacity: loading ? 0.7 : 1 }}>
                {loading ? "Creating..." : "Join AniMood ✦"}
              </motion.button>
              <p style={{ textAlign: "center", color: isDark ? "#9b7fbf" : "#a06080", fontSize: "13px", margin: "4px 0 0 0" }}>
                Already have an account? <span onClick={() => { setTab("login"); setError("") }} style={{ color: isDark ? "#c8a8e9" : "#c06080", cursor: "pointer", fontWeight: "600" }}>Login</span>
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
