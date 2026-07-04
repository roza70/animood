import { motion } from "framer-motion"

export default function LightPixelBackground() {
  const petals = Array.from({ length: 16 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 6,
    duration: 5 + Math.random() * 4,
    size: 4 + Math.random() * 3,
  }))

  return (
    <div className="fixed inset-0 z-10 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #fff3d6 0%, #ffe6f0 35%, #ffd5e8 55%, #d8f0c8 78%, #b0d8a0 100%)" }}>

      {/* Sun glow */}
      <div style={{
        position: "absolute", top: "6%", left: "8%",
        width: 100, height: 100, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,220,80,0.5) 0%, transparent 70%)",
        filter: "blur(6px)",
      }} />

      {/* Round sun */}
      <div style={{
        position: "absolute", top: "9%", left: "11%",
        width: 54, height: 54, borderRadius: "50%",
        background: "radial-gradient(circle at 38% 32%, #fff9c4 0%, #ffd54f 70%, #ffb300 100%)",
        boxShadow: "0 0 0 3px rgba(255,193,7,0.4), 0 0 36px 12px rgba(255,213,79,0.5)",
      }} />

      {/* Cloud 1 */}
      <motion.div animate={{ x: [0, 8, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "absolute", top: "10%", left: "48%" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: 30, height: 14, borderRadius: "50% 50% 0 0", background: "#fff", marginBottom: -4 }} />
          <div style={{ width: 60, height: 16, borderRadius: "20px", background: "#fff" }} />
        </div>
      </motion.div>

      {/* Cloud 2 */}
      <motion.div animate={{ x: [0, -6, 0] }} transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "absolute", top: "20%", right: "10%", opacity: 0.85 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: 22, height: 12, borderRadius: "50% 50% 0 0", background: "#fff", marginBottom: -4 }} />
          <div style={{ width: 44, height: 14, borderRadius: "20px", background: "#fff" }} />
        </div>
      </motion.div>

      {/* Ground */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "28%",
        background: "linear-gradient(180deg, #7ec870 0%, #5aaa4a 100%)",
      }} />

      {/* Hill */}
      <div style={{
        position: "absolute", bottom: "24%", left: 0, right: 0, height: "16%",
        background: "#9fcf8e",
        clipPath: "polygon(0% 100%, 0% 40%, 22% 25%, 42% 55%, 60% 18%, 78% 48%, 100% 28%, 100% 100%)",
      }} />

      {/* Sakura trees — sitting ON the hill */}
      {[3, 22, 72, 88].map((left, i) => (
        <div key={i} style={{
          position: "absolute",
          bottom: "28%",
          left: `${left}%`,
          display: "flex", flexDirection: "column", alignItems: "center",
        }}>
          {/* blossom top */}
          <div style={{
            width: 36, height: 28, borderRadius: "50%",
            background: i % 2 === 0
              ? "radial-gradient(circle, #ffd6e3 0%, #ffb8cc 100%)"
              : "radial-gradient(circle, #ffe0ec 0%, #ffc4d6 100%)",
            boxShadow: "0 2px 8px rgba(255,180,200,0.3)",
          }} />
          {/* trunk */}
          <div style={{ width: 6, height: 16, background: "#7a5440", borderRadius: "0 0 2px 2px" }} />
        </div>
      ))}

      {/* Wildflowers */}
      {[12, 28, 46, 58, 74, 88].map((left, i) => (
        <div key={i} style={{ position: "absolute", bottom: `${2 + (i % 2) * 2}%`, left: `${left}%` }}>
          <div style={{ width: 2, height: 10, background: "#4d8a3f", margin: "0 auto" }} />
          <div style={{
            width: 8, height: 8, borderRadius: "50%", marginLeft: -3,
            background: i % 3 === 0 ? "#ffb3c6" : i % 3 === 1 ? "#fff176" : "#ce93d8",
            boxShadow: "0 0 4px rgba(255,255,255,0.4)",
          }} />
        </div>
      ))}

      {/* Falling sakura petals */}
      {petals.map(p => (
        <motion.div key={p.id}
          initial={{ y: -20, opacity: 0, rotate: 0 }}
          animate={{ y: "110vh", x: [0, 16, -10, 6, 0], opacity: [0, 1, 1, 0], rotate: [0, 180, 360] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "linear" }}
          style={{
            position: "absolute", top: 0, left: `${p.left}%`,
            width: p.size, height: p.size * 0.75, borderRadius: "50% 50% 50% 0",
            background: "radial-gradient(ellipse, #ffc4d6, #ff9eb8)",
          }} />
      ))}

      {/* Vignette */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to top, rgba(255,240,245,0.3) 0%, transparent 35%)",
      }} />
    </div>
  )
}
