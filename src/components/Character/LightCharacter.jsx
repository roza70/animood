import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import boy from "../../assets/prince.mp4"

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

export default function LightCharacter() {
  const [currentQuote, setCurrentQuote] = useState(0)
  const [showQuote, setShowQuote] = useState(true)

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

  return (
    <div className="fixed inset-0 z-10">
      <motion.video
        src={boy}
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

      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to top, rgba(255,240,245,0.5) 0%, rgba(255,240,245,0.05) 50%, rgba(255,240,245,0.2) 100%)" }}
      />

      {/* Quote bubble — moved higher up beside prince head */}
      <div className="absolute z-20" style={{ top: "18%", left: "22%" }}>
        <AnimatePresence mode="wait">
          {showQuote && (
            <motion.div
              key={currentQuote}
              initial={{ opacity: 0, scale: 0.7, x: -30 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.7, x: -30 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              style={{ position: "relative" }}
            >
              <div style={{ position: "absolute", bottom: -18, left: 24, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                {[10, 7, 4].map((size, i) => (
                  <motion.div
                    key={i}
                    className="rounded-full"
                    style={{ width: size, height: size, background: "rgba(244, 167, 185, 0.7)" }}
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>

              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  background: "rgba(255, 240, 245, 0.92)",
                  border: "1.5px solid rgba(244, 167, 185, 0.6)",
                  borderRadius: "20px 20px 20px 4px",
                  padding: "14px 18px",
                  maxWidth: "240px",
                  backdropFilter: "blur(12px)",
                  boxShadow: "0 0 30px rgba(244, 167, 185, 0.3), 0 0 60px rgba(244, 167, 185, 0.1)",
                  position: "relative",
                }}
              >
                <p style={{
                  color: "#8b4a6b",
                  fontSize: "13px",
                  fontFamily: "Georgia, serif",
                  fontStyle: "italic",
                  lineHeight: "1.6",
                }}>
                  "{quotes[currentQuote]}"
                </p>
                {[
                  { top: -10, left: 10 },
                  { top: -6, left: 40 },
                  { top: -12, left: 25 },
                ].map((pos, i) => (
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
