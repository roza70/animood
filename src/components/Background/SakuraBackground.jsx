import { motion } from "framer-motion"

const random = (min, max) => Math.random() * (max - min) + min

const petals = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  x: random(0, 100),
  duration: random(6, 14),
  delay: random(0, 10),
  size: random(8, 18),
  rotation: random(0, 360),
  drift: random(-150, 150),
}))

const sunRays = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  angle: i * 30,
  opacity: random(0.03, 0.08),
}))

export default function SakuraBackground() {
  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none z-0"
      style={{ background: "linear-gradient(to bottom, #fff0f5 0%, #ffe4ed 30%, #ffd6e7 60%, #ffcce3 100%)" }}
    >
      {/* Sun */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 120, height: 120,
          top: "6%", left: "15%",
          background: "radial-gradient(circle at 40% 40%, #fff9c4, #ffcc02)",
          boxShadow: "0 0 80px 40px rgba(255,204,2,0.2), 0 0 160px 80px rgba(255,204,2,0.1)",
        }}
        animate={{
          boxShadow: [
            "0 0 80px 40px rgba(255,204,2,0.2)",
            "0 0 100px 60px rgba(255,204,2,0.3)",
            "0 0 80px 40px rgba(255,204,2,0.2)",
          ],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* Sun rays */}
      {sunRays.map(ray => (
        <div
          key={ray.id}
          className="absolute"
          style={{
            top: "6%", left: "15%",
            width: "120vw", height: "4px",
            background: "linear-gradient(to right, rgba(255,204,2,0.3), transparent)",
            transformOrigin: "0 50%",
            transform: `rotate(${ray.angle}deg)`,
            opacity: ray.opacity,
          }}
        />
      ))}

      {/* Clouds */}
      {[
        { y: 12, width: 200, delay: 0, duration: 40 },
        { y: 20, width: 150, delay: 8, duration: 35 },
        { y: 8, width: 250, delay: 15, duration: 50 },
      ].map((cloud, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ top: `${cloud.y}%`, width: cloud.width }}
          animate={{ x: ["-20%", "120%"] }}
          transition={{ duration: cloud.duration, repeat: Infinity, delay: cloud.delay, ease: "linear" }}
        >
          <div style={{
            width: "100%", height: 50,
            background: "radial-gradient(ellipse, rgba(255,255,255,0.9) 0%, transparent 70%)",
            filter: "blur(8px)",
            borderRadius: "50%",
          }} />
        </motion.div>
      ))}

      {/* Sakura Trees */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 400" preserveAspectRatio="none" style={{ width: "100%", height: "400px" }}>
          {/* Ground */}
          <ellipse cx="720" cy="390" rx="800" ry="30" fill="#f8bbd9" opacity="0.3" />

          {/* Left tree trunk */}
          <rect x="180" y="200" width="24" height="200" rx="8" fill="#8d5524" />
          <rect x="160" y="280" width="16" height="120" rx="6" fill="#8d5524" transform="rotate(-15 160 280)" />
          <rect x="200" y="260" width="14" height="100" rx="6" fill="#8d5524" transform="rotate(20 200 260)" />

          {/* Left tree blossoms */}
          {[
            [192, 160, 90], [140, 190, 70], [240, 180, 75],
            [170, 140, 65], [215, 145, 80], [155, 210, 60],
          ].map(([cx, cy, r], i) => (
            <motion.ellipse key={i} cx={cx} cy={cy} rx={r} ry={r * 0.7}
              fill={i % 2 === 0 ? "#ffb7c5" : "#ff8fab"}
              opacity="0.85"
              animate={{ ry: [r * 0.7, r * 0.75, r * 0.7] }}
              transition={{ duration: 3 + i, repeat: Infinity }}
            />
          ))}

          {/* Right tree trunk */}
          <rect x="1236" y="180" width="24" height="220" rx="8" fill="#8d5524" />
          <rect x="1215" y="260" width="16" height="130" rx="6" fill="#8d5524" transform="rotate(-20 1215 260)" />
          <rect x="1258" y="240" width="14" height="110" rx="6" fill="#8d5524" transform="rotate(15 1258 240)" />

          {/* Right tree blossoms */}
          {[
            [1248, 140, 95], [1190, 170, 72], [1300, 165, 78],
            [1220, 125, 68], [1270, 130, 82], [1195, 195, 62],
          ].map(([cx, cy, r], i) => (
            <motion.ellipse key={i} cx={cx} cy={cy} rx={r} ry={r * 0.7}
              fill={i % 2 === 0 ? "#ffb7c5" : "#ff8fab"}
              opacity="0.85"
              animate={{ ry: [r * 0.7, r * 0.75, r * 0.7] }}
              transition={{ duration: 3 + i, repeat: Infinity }}
            />
          ))}

          {/* Rolling hills */}
          <ellipse cx="400" cy="400" rx="500" ry="80" fill="#f48fb1" opacity="0.3" />
          <ellipse cx="1100" cy="400" rx="500" ry="80" fill="#f48fb1" opacity="0.3" />
          <ellipse cx="720" cy="420" rx="800" ry="60" fill="#f8bbd9" opacity="0.5" />
        </svg>
      </div>

      {/* Falling petals */}
      {petals.map(petal => (
        <motion.div
          key={petal.id}
          className="absolute"
          style={{
            left: `${petal.x}%`,
            top: "-20px",
            width: petal.size,
            height: petal.size * 0.8,
            background: "radial-gradient(ellipse, #ffb7c5, #ff8fab)",
            borderRadius: "50% 50% 50% 0",
            opacity: 0.8,
          }}
          animate={{
            y: ["0vh", "110vh"],
            x: [0, petal.drift],
            rotate: [petal.rotation, petal.rotation + 360],
            opacity: [0, 0.8, 0.8, 0],
          }}
          transition={{
            duration: petal.duration,
            repeat: Infinity,
            delay: petal.delay,
            ease: "linear",
          }}
        />
      ))}

      {/* Golden sparkles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${random(10, 90)}%`,
            top: `${random(10, 80)}%`,
            width: random(3, 6),
            height: random(3, 6),
            background: "#ffd700",
            boxShadow: "0 0 6px 2px rgba(255,215,0,0.5)",
          }}
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }}
          transition={{ duration: random(2, 4), repeat: Infinity, delay: random(0, 6) }}
        />
      ))}

      {/* Warm overlay */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 15% 10%, rgba(255,204,2,0.08) 0%, transparent 60%)" }}
      />
    </div>
  )
}