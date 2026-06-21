import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import prince from "../../assets/prince.mp4"

const quotes = [
  "Petals fall like forgotten dreams...",
  "If I stay still enough, maybe time will stop too...",
  "The sky is just an ocean we haven't learned to swim in...",
  "Every flower that falls was once someone's wish...",
  "I think the cat understands me better than anyone...",
  "Warmth is just sunlight that decided to stay...",
  "What if clouds are just the sky's way of dreaming?",
  "Even the wind seems to whisper your name today...",
]

const random = (min, max) => Math.random() * (max - min) + min

// Wind effect petals
const windPetals = Array.from({ length: 25 }, (_, i) => ({
  id: i,
  x: random(0, 100),
  size: random(6, 14),
  delay: random(0, 5),
  duration: random(3, 7),
  drift: random(100, 300),
}))

export default function LightCharacter() {
  const [currentQuote, setCurrentQuote] = useState(0)
  const [showQuote, setShowQuote] = useState(true)
  const [windActive, setWindActive] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setShowQuote(false)
      setTimeout(() => {
        setCurrentQuote(prev => (prev + 1) % quotes.length)
        setShowQuote(true)
      }, 800)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  // Wind effect every 8 seconds
  useEffect(() => {
    const windInterval = setInterval(() => {
      setWindActive(true)
      setTimeout(() => setWindActive(false), 3000)
    }, 8000)
    return () => clearInterval(windInterval)
  }, [])

  return (
    <div className="fixed inset-0 z-10">
      {/* Full screen video */}
      <motion.video
        src={prince}
        autoPlay
        loop
        muted
        playsInline
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />

      {/* Light overlay */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(to top, rgba(255,240,245,0.3) 0%, rgba(255,240,245,0.02) 50%, rgba(255,240,245,0.1) 100%)"
      }} />

      {/* Wind effect — petals blowing horizontally */}
      <AnimatePresence>
        {windActive && windPetals.map(petal => (
          <motion.div
            key={petal.id}
            className="absolute rounded-full"
            style={{
              left: `${petal.x}%`,
              top: `${random(10, 90)}%`,
              width: petal.size,
              height: petal.size * 0.7,
              background: "radial-gradient(ellipse, #ffb7c5, #ff8fab)",
              borderRadius: "50% 50% 50% 0",
              pointerEvents: "none",
            }}
            initial={{ opacity: 0, x: 0, rotate: 0 }}
            animate={{
              opacity: [0, 0.9, 0.9, 0],
              x: petal.drift,
              y: [0, random(-40, 40)],
              rotate: [0, random(180, 540)],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: petal.duration,
              delay: petal.delay * 0.3,
              ease: "easeOut",
            }}
          />
        ))}
      </AnimatePresence>

      {/* Wind shimmer overlay */}
      <AnimatePresence>
        {windActive && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.15, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            style={{
              background: "linear-gradient(to right, transparent, rgba(255,220,240,0.4), transparent)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Quote bubble — beside prince head */}
      <div className="absolute z-20" style={{ top: "8%", left: "5%" }}>
        <AnimatePresence mode="wait">
          {showQuote && (
            <motion.div
              key={currentQuote}
              initial={{ opacity: 0, scale: 0.7, x: -20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.7, x: -20 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              style={{ position: "relative" }}
            >
              {/* Thought bubble tail dots */}
              <div style={{
                position: "absolute",
                bottom: -20,
                left: 24,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
              }}>
                {[10, 7, 4].map((size, i) => (
                  <motion.div
                    key={i}
                    className="rounded-full"
                    style={{ width: size, height: size, background: "rgba(244,167,185,0.7)" }}
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>

              {/* Main bubble */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  background: "rgba(255,240,245,0.92)",
                  border: "1.5px solid rgba(244,167,185,0.6)",
                  borderRadius: "20px 20px 20px 4px",
                  padding: "14px 18px",
                  maxWidth: "240px",
                  backdropFilter: "blur(12px)",
                  boxShadow: "0 0 30px rgba(244,167,185,0.3)",
                  position: "relative",
                }}
              >
                <p style={{
                  color: "#8b4a6b",
                  fontSize: "13px",
                  fontFamily: "Georgia, serif",
                  fontStyle: "italic",
                  lineHeight: "1.6",
                  margin: 0,
                }}>
                  "{quotes[currentQuote]}"
                </p>
                {[{ top: -10, left: 10 }, { top: -6, left: 40 }, { top: -12, left: 25 }].map((pos, i) => (
                  <motion.span
                    key={i}
                    style={{ position: "absolute", ...pos, color: "#f4a7b9", fontSize: 11 }}
                    animate={{ opacity: [0, 1, 0], rotate: [0, 180, 360], scale: [0.5, 1.2, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.6 }}
                  >
                    ✿
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}