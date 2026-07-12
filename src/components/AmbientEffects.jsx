import { motion } from "framer-motion"
import { useTheme } from "../context/ThemeContext"
import { useMemo } from "react"

// Floating stars for dark/night mode
function NightAmbient() {
  const stars = useMemo(() => Array.from({ length: 50 }, (_, i) => ({
    id: i,
    top: Math.random() * 100,
    left: Math.random() * 100,
    size: Math.random() > 0.85 ? 3 : Math.random() > 0.6 ? 2 : 1,
    delay: Math.random() * 5,
    duration: 2 + Math.random() * 3,
  })), [])

  const shootingStars = useMemo(() => Array.from({ length: 3 }, (_, i) => ({
    id: i,
    top: 5 + Math.random() * 30,
    delay: i * 8 + Math.random() * 5,
  })), [])

  const floatingPetals = useMemo(() => Array.from({ length: 12 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 8,
    duration: 8 + Math.random() * 6,
    size: 4 + Math.random() * 3,
  })), [])

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 5, pointerEvents: "none", overflow: "hidden" }}>
      {/* Twinkling stars scattered everywhere */}
      {stars.map(s => (
        <motion.div
          key={s.id}
          animate={{ opacity: [0.1, 0.9, 0.1], scale: [0.8, 1.4, 0.8] }}
          transition={{ duration: s.duration, repeat: Infinity, delay: s.delay }}
          style={{
            position: "absolute",
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            background: "#fff",
            borderRadius: "50%",
            boxShadow: s.size > 2 ? "0 0 4px 1px rgba(255,255,255,0.8)" : "none",
          }}
        />
      ))}

      {/* Shooting stars */}
      {shootingStars.map(s => (
        <motion.div
          key={s.id}
          initial={{ x: "-5vw", y: 0, opacity: 0 }}
          animate={{ x: "60vw", y: "20vh", opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.3, repeat: Infinity, repeatDelay: s.delay, ease: "easeIn" }}
          style={{
            position: "absolute",
            top: `${s.top}%`,
            left: "5%",
            width: 60,
            height: 2,
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)",
            transform: "rotate(20deg)",
            borderRadius: 2,
          }}
        />
      ))}

      {/* Purple/lavender floating petals */}
      {floatingPetals.map(p => (
        <motion.div
          key={p.id}
          initial={{ y: "-5vh", opacity: 0, rotate: 0 }}
          animate={{
            y: "110vh",
            x: [0, 20, -15, 10, 0],
            opacity: [0, 0.7, 0.7, 0.7, 0],
            rotate: [0, 120, 240, 360],
          }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "linear" }}
          style={{
            position: "absolute",
            top: 0,
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 0.75,
            borderRadius: "50% 50% 50% 0",
            background: "radial-gradient(ellipse, rgba(200,168,233,0.8), rgba(149,117,205,0.6))",
          }}
        />
      ))}

      {/* Soft star clusters — subtle glow orbs */}
      {[15, 35, 55, 75, 90].map((left, i) => (
        <motion.div
          key={`glow-${i}`}
          animate={{ opacity: [0.03, 0.08, 0.03] }}
          transition={{ duration: 4 + i, repeat: Infinity, delay: i * 1.2 }}
          style={{
            position: "absolute",
            top: `${10 + i * 18}%`,
            left: `${left}%`,
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(200,168,233,0.4), transparent)",
          }}
        />
      ))}
    </div>
  )
}

// Floating sakura petals + gentle wind for light/sakura mode
function SakuraAmbient() {
  const petals = useMemo(() => Array.from({ length: 25 }, (_, i) => ({
    id: i,
    left: Math.random() * 110 - 5,
    delay: Math.random() * 10,
    duration: 6 + Math.random() * 8,
    size: 5 + Math.random() * 5,
    drift: (Math.random() - 0.5) * 120,
    color: i % 4 === 0 ? "rgba(255,182,193,0.75)"
      : i % 4 === 1 ? "rgba(255,204,213,0.7)"
      : i % 4 === 2 ? "rgba(240,170,185,0.65)"
      : "rgba(255,218,224,0.7)",
  })), [])

  const windGusts = useMemo(() => Array.from({ length: 4 }, (_, i) => ({
    id: i,
    top: 10 + i * 22,
    delay: i * 3.5,
  })), [])

  const floatingOrbs = useMemo(() => Array.from({ length: 6 }, (_, i) => ({
    id: i,
    top: 10 + Math.random() * 80,
    left: 5 + Math.random() * 90,
    delay: Math.random() * 5,
  })), [])

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 5, pointerEvents: "none", overflow: "hidden" }}>
      {/* Falling sakura petals - everywhere */}
      {petals.map(p => (
        <motion.div
          key={p.id}
          initial={{ y: "-8vh", x: 0, opacity: 0, rotate: 0 }}
          animate={{
            y: "112vh",
            x: [0, p.drift * 0.3, p.drift * 0.7, p.drift, p.drift * 0.8],
            opacity: [0, 0.9, 0.9, 0.9, 0],
            rotate: [0, 90, 180, 270, 360],
          }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "linear" }}
          style={{
            position: "absolute",
            top: 0,
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 0.8,
            borderRadius: "50% 0 50% 0",
            background: p.color,
            filter: "blur(0.3px)",
          }}
        />
      ))}

      {/* Horizontal wind streaks */}
      {windGusts.map(w => (
        <motion.div
          key={w.id}
          initial={{ x: "-10vw", opacity: 0 }}
          animate={{ x: "110vw", opacity: [0, 0.12, 0.08, 0] }}
          transition={{ duration: 4, repeat: Infinity, repeatDelay: w.delay + 6, ease: "easeOut" }}
          style={{
            position: "absolute",
            top: `${w.top}%`,
            left: 0,
            width: "30vw",
            height: 1.5,
            background: "linear-gradient(90deg, transparent, rgba(200,160,170,0.6), transparent)",
            borderRadius: 2,
          }}
        />
      ))}

      {/* Soft floating light orbs */}
      {floatingOrbs.map(o => (
        <motion.div
          key={o.id}
          animate={{
            y: [0, -20, 0, -10, 0],
            opacity: [0.04, 0.1, 0.04],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 6 + o.id, repeat: Infinity, delay: o.delay }}
          style={{
            position: "absolute",
            top: `${o.top}%`,
            left: `${o.left}%`,
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,182,193,0.5), transparent)",
          }}
        />
      ))}

      {/* Tiny sparkles */}
      {Array.from({ length: 15 }, (_, i) => ({
        top: Math.random() * 100,
        left: Math.random() * 100,
        delay: Math.random() * 6,
      })).map((s, i) => (
        <motion.div
          key={`sparkle-${i}`}
          animate={{ opacity: [0, 0.8, 0], scale: [0.5, 1.5, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: s.delay }}
          style={{
            position: "absolute",
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: 3,
            height: 3,
            borderRadius: "50%",
            background: "rgba(255,182,193,0.9)",
            boxShadow: "0 0 4px rgba(255,182,193,0.8)",
          }}
        />
      ))}
    </div>
  )
}

export default function AmbientEffects() {
  const { theme } = useTheme()
  return theme === "dark" ? <NightAmbient /> : <SakuraAmbient />
}