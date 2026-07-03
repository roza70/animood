import { motion } from "framer-motion"

export default function DarkPixelBackground() {
  const stars = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    top: Math.random() * 60,
    left: Math.random() * 100,
    delay: Math.random() * 4,
    size: Math.random() > 0.8 ? 3 : 2,
  }))

  const petals = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 6,
    duration: 7 + Math.random() * 4,
  }))

  const fireflies = Array.from({ length: 5 }, (_, i) => ({
    id: i,
    left: 10 + i * 18,
    bottom: 6 + Math.random() * 10,
    delay: i * 0.8,
  }))

  return (
    <div className="fixed inset-0 z-10 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #060d26 0%, #0f1540 40%, #1a1050 70%, #141e40 100%)" }}>

      {/* Moon glow */}
      <div style={{
        position: "absolute", top: "8%", right: "12%",
        width: 100, height: 100, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(232,213,245,0.35) 0%, transparent 70%)",
        filter: "blur(6px)",
      }} />

      {/* Round moon */}
      <div style={{
        position: "absolute", top: "10%", right: "15%",
        width: 58, height: 58, borderRadius: "50%",
        background: "radial-gradient(circle at 35% 30%, #fff8f0 0%, #f0e0ff 50%, #d4b8e8 100%)",
        boxShadow: "0 0 0 3px rgba(200,168,233,0.4), 0 0 30px 10px rgba(200,168,233,0.35)",
      }}>
        <div style={{ position: "absolute", top: "28%", left: "22%", width: 8, height: 8, borderRadius: "50%", background: "rgba(170,140,200,0.3)" }} />
        <div style={{ position: "absolute", top: "58%", left: "52%", width: 5, height: 5, borderRadius: "50%", background: "rgba(170,140,200,0.25)" }} />
      </div>

      {/* Stars */}
      {stars.map(s => (
        <motion.div key={s.id}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 2.5 + (s.id % 3), repeat: Infinity, delay: s.delay }}
          style={{
            position: "absolute", top: `${s.top}%`, left: `${s.left}%`,
            width: s.size, height: s.size, background: "#fff",
            boxShadow: s.size > 2 ? "0 0 4px rgba(255,255,255,0.8)" : "none",
          }} />
      ))}

      {/* Shooting star */}
      <motion.div
        initial={{ x: 0, y: 0, opacity: 0 }}
        animate={{ x: "40vw", y: "20vh", opacity: [0, 1, 0] }}
        transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 7, ease: "easeIn" }}
        style={{
          position: "absolute", top: "5%", left: "10%",
          width: 50, height: 2,
          background: "linear-gradient(90deg, transparent, #fff, transparent)",
          transform: "rotate(20deg)",
        }} />

      {/* Ground */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "28%",
        background: "linear-gradient(180deg, #1a2f5c 0%, #111e40 100%)",
      }} />

      {/* Hills */}
      <div style={{
        position: "absolute", bottom: "24%", left: 0, right: 0, height: "14%",
        background: "#0e1530",
        clipPath: "polygon(0% 100%, 0% 55%, 20% 30%, 40% 58%, 60% 20%, 80% 50%, 100% 30%, 100% 100%)",
      }} />

      {/* Trees — 5 pine trees sitting ON the hill */}
      {[6, 18, 34, 68, 84].map((left, i) => (
        <div key={i} style={{
          position: "absolute",
          bottom: "30%",
          left: `${left}%`,
          width: 18,
        }}>
          <div style={{ width: 0, height: 0, borderLeft: "9px solid transparent", borderRight: "9px solid transparent", borderBottom: "14px solid #0a0f25" }} />
          <div style={{ width: 0, height: 0, borderLeft: "11px solid transparent", borderRight: "11px solid transparent", borderBottom: "16px solid #0a0f25", marginLeft: -2, marginTop: -6 }} />
          <div style={{ width: 0, height: 0, borderLeft: "13px solid transparent", borderRight: "13px solid transparent", borderBottom: "18px solid #0a0f25", marginLeft: -4, marginTop: -8 }} />
          <div style={{ width: 4, height: 6, background: "#0a0f25", margin: "0 auto" }} />
        </div>
      ))}

      {/* Purple petals drifting down */}
      {petals.map(p => (
        <motion.div key={p.id}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: "100vh", x: [0, 12, -8, 0], opacity: [0, 0.9, 0.9, 0], rotate: [0, 180, 360] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "linear" }}
          style={{
            position: "absolute", top: 0, left: `${p.left}%`,
            width: 5, height: 4, borderRadius: "50% 50% 50% 0",
            background: "radial-gradient(ellipse, #c8a8e9, #9575cd)",
          }} />
      ))}

      {/* Fireflies */}
      {fireflies.map(f => (
        <motion.div key={f.id}
          animate={{ y: [0, -14, 0], x: [0, 8, -4, 0], opacity: [0, 1, 0.3, 1, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, delay: f.delay }}
          style={{
            position: "absolute", bottom: `${f.bottom}%`, left: `${f.left}%`,
            width: 4, height: 4, borderRadius: "50%",
            background: "#ffe082",
            boxShadow: "0 0 7px 3px rgba(255,224,130,0.7)",
          }} />
      ))}

      {/* Vignette */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to top, rgba(2,8,24,0.65) 0%, transparent 40%)",
      }} />
    </div>
  )
}
