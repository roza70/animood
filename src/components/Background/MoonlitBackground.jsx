import { motion } from "framer-motion"

const NUM_STARS = 80
const NUM_SHOOTING_STARS = 5
const NUM_CLOUDS = 4

const random = (min, max) => Math.random() * (max - min) + min

const stars = Array.from({ length: NUM_STARS }, (_, i) => ({
  id: i,
  x: random(0, 100),
  y: random(0, 60),
  size: random(1, 3),
  delay: random(0, 4),
  duration: random(2, 5),
}))

const shootingStars = Array.from({ length: NUM_SHOOTING_STARS }, (_, i) => ({
  id: i,
  x: random(10, 80),
  y: random(5, 30),
  delay: random(0, 8),
}))

const clouds = Array.from({ length: NUM_CLOUDS }, (_, i) => ({
  id: i,
  y: random(10, 35),
  size: random(120, 220),
  duration: random(30, 50),
  delay: random(0, 10),
}))

const cats = [
  { id: 0, x: 12, y: 52, flip: false },
  { id: 1, x: 78, y: 48, flip: true },
  { id: 2, x: 50, y: 55, flip: false },
]

const CatSVG = ({ flip }) => (
  <svg width="48" height="48" viewBox="0 0 48 48"
    style={{ transform: flip ? "scaleX(-1)" : "none" }}>
    <ellipse cx="24" cy="34" rx="13" ry="10" fill="#1a1a3e" />
    <circle cx="24" cy="20" r="10" fill="#1a1a3e" />
    <polygon points="15,13 11,4 20,11" fill="#1a1a3e" />
    <polygon points="33,13 37,4 28,11" fill="#1a1a3e" />
    <polygon points="15,12 13,6 19,11" fill="#9b6fa5" />
    <polygon points="33,12 35,6 29,11" fill="#9b6fa5" />
    <ellipse cx="20" cy="20" rx="2.5" ry="3" fill="#c8a8e9" />
    <ellipse cx="28" cy="20" rx="2.5" ry="3" fill="#c8a8e9" />
    <ellipse cx="20" cy="21" rx="1" ry="2" fill="#0a0a1a" />
    <ellipse cx="28" cy="21" rx="1" ry="2" fill="#0a0a1a" />
    <polygon points="24,24 22.5,26 25.5,26" fill="#e8a0bf" />
    <line x1="10" y1="24" x2="20" y2="25" stroke="#c8a8e9" strokeWidth="0.7" />
    <line x1="10" y1="27" x2="20" y2="26" stroke="#c8a8e9" strokeWidth="0.7" />
    <line x1="38" y1="24" x2="28" y2="25" stroke="#c8a8e9" strokeWidth="0.7" />
    <line x1="38" y1="27" x2="28" y2="26" stroke="#c8a8e9" strokeWidth="0.7" />
    <path d="M37,38 Q48,30 45,20" stroke="#1a1a3e" strokeWidth="4" fill="none" strokeLinecap="round" />
  </svg>
)

export default function MoonlitBackground() {
  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none z-0"
      style={{ background: "linear-gradient(to bottom, #020818 0%, #0a0f2e 40%, #1a1040 70%, #0d1f3c 100%)" }}
    >
      {/* Stars */}
      {stars.map(star => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{ left: `${star.x}%`, top: `${star.y}%`, width: star.size, height: star.size }}
          animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.4, 1] }}
          transition={{ duration: star.duration, repeat: Infinity, delay: star.delay }}
        />
      ))}

      {/* Shooting Stars */}
      {shootingStars.map(s => (
        <motion.div
          key={s.id}
          className="absolute h-px rounded-full"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: "120px",
            background: "linear-gradient(to right, transparent, white)",
            rotate: "20deg",
          }}
          animate={{ x: [0, 300], opacity: [0, 1, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: s.delay, repeatDelay: random(4, 10) }}
        />
      ))}

      {/* Moon */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 110, height: 110,
          top: "8%", left: "70%",
          background: "radial-gradient(circle at 35% 35%, #fffde7, #ffd54f)",
          boxShadow: "0 0 60px 20px rgba(255,213,79,0.25), 0 0 120px 40px rgba(255,213,79,0.1)",
        }}
        animate={{
          boxShadow: [
            "0 0 60px 20px rgba(255,213,79,0.25)",
            "0 0 80px 30px rgba(255,213,79,0.4)",
            "0 0 60px 20px rgba(255,213,79,0.25)",
          ],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* Clouds */}
      {clouds.map(cloud => (
        <motion.div
          key={cloud.id}
          className="absolute rounded-full opacity-20"
          style={{
            top: `${cloud.y}%`,
            width: cloud.size,
            height: cloud.size / 2.5,
            background: "radial-gradient(ellipse, #c8a8e9 0%, transparent 70%)",
            filter: "blur(18px)",
          }}
          animate={{ x: ["-10%", "110%"] }}
          transition={{ duration: cloud.duration, repeat: Infinity, delay: cloud.delay, ease: "linear" }}
        />
      ))}

      {/* Castle Silhouette */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ width: "100%", height: "320px" }}>
          <rect x="0" y="260" width="1440" height="60" fill="#0d1f3c" opacity="0.9" />
          <ellipse cx="720" cy="265" rx="300" ry="12" fill="#c8a8e9" opacity="0.15" />
          <rect x="560" y="120" width="320" height="150" fill="#070d24" />
          <rect x="660" y="60" width="120" height="170" fill="#070d24" />
          <polygon points="660,60 720,10 780,60" fill="#0a1030" />
          <rect x="580" y="100" width="70" height="130" fill="#070d24" />
          <polygon points="580,100 615,60 650,100" fill="#0a1030" />
          <rect x="790" y="100" width="70" height="130" fill="#070d24" />
          <polygon points="790,100 825,60 860,100" fill="#0a1030" />
          {[560, 580, 600, 620, 640, 660, 700, 740, 780, 820, 840, 860].map((x, i) => (
            <rect key={i} x={x} y="118" width="14" height="16" fill="#070d24" />
          ))}
          <motion.rect x="700" y="100" width="20" height="28" rx="10" fill="#ffd54f"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.rect x="620" y="130" width="16" height="22" rx="8" fill="#c8a8e9"
            animate={{ opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
          />
          <motion.rect x="804" y="130" width="16" height="22" rx="8" fill="#c8a8e9"
            animate={{ opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
          />
          <rect x="695" y="200" width="50" height="70" rx="25" fill="#020818" />
          <ellipse cx="480" cy="220" rx="35" ry="55" fill="#050c20" />
          <ellipse cx="960" cy="220" rx="35" ry="55" fill="#050c20" />
          <ellipse cx="430" cy="240" rx="25" ry="40" fill="#070d24" />
          <ellipse cx="1010" cy="240" rx="25" ry="40" fill="#070d24" />
        </svg>
      </div>

      {/* Moon reflection — div instead of SVG ellipse */}
      <motion.div
        className="absolute rounded-full"
        style={{
          bottom: "8%",
          left: "70%",
          width: 60,
          height: 12,
          background: "#ffd54f",
          filter: "blur(4px)",
        }}
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Sparkling water */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            bottom: `${random(2, 8)}%`,
            left: `${random(10, 90)}%`,
            width: random(2, 5),
            height: random(2, 5),
            background: "#c8a8e9",
          }}
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }}
          transition={{ duration: random(1.5, 3), repeat: Infinity, delay: random(0, 4) }}
        />
      ))}

      {/* Fireflies */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${random(5, 95)}%`,
            top: `${random(40, 75)}%`,
            width: 4, height: 4,
            background: "#ffd54f",
            boxShadow: "0 0 6px 2px rgba(255,213,79,0.6)",
          }}
          animate={{
            x: [0, random(-30, 30), 0],
            y: [0, random(-20, 20), 0],
            opacity: [0, 1, 0],
          }}
          transition={{ duration: random(2, 5), repeat: Infinity, delay: random(0, 6) }}
        />
      ))}

      {/* Cats */}
      {cats.map(cat => (
        <motion.div
          key={cat.id}
          className="absolute"
          style={{ left: `${cat.x}%`, top: `${cat.y}%` }}
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: cat.id * 1.2 }}
        >
          <CatSVG flip={cat.flip} />
        </motion.div>
      ))}

      {/* Fog layer */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32"
        style={{ background: "linear-gradient(to top, rgba(10,15,46,0.8), transparent)" }}
      />
    </div>
  )
}