import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import princess from "../../assets/princess.mp4"

const quotes = [
  "The ocean remembers every secret told to it...",
  "Even the moon gets lonely sometimes...",
  "I wonder if the stars have names for each other...",
  "Some feelings are too deep for words...",
  "The night sky is just the universe's diary...",
  "Every wave carries a wish from someone far away...",
  "I could watch the moonlight dance forever...",
  "Even darkness blooms with hidden light...",
]

export default function DarkCharacter() {
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
        src={princess}
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
        style={{ background: "linear-gradient(to top, rgba(2,8,24,0.7) 0%, rgba(2,8,24,0.1) 50%, rgba(2,8,24,0.3) 100%)" }}
      />

      {/* Quote bubble — moved left away from princess face */}
      <div className="absolute z-20" style={{ top: "12%", right: "42%" }}>
        <AnimatePresence mode="wait">
          {showQuote && (
            <motion.div
              key={currentQuote}
              initial={{ opacity: 0, scale: 0.7, x: 30 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.7, x: 30 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              style={{ position: "relative" }}
            >
              <div style={{ position: "absolute", bottom: -18, right: 24, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                {[10, 7, 4].map((size, i) => (
                  <motion.div
                    key={i}
                    className="rounded-full"
                    style={{ width: size, height: size, background: "rgba(200, 168, 233, 0.7)" }}
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>

              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  background: "rgba(10, 5, 40, 0.82)",
                  border: "1.5px solid rgba(200, 168, 233, 0.5)",
                  borderRadius: "20px 20px 4px 20px",
                  padding: "14px 18px",
                  maxWidth: "240px",
                  backdropFilter: "blur(12px)",
                  boxShadow: "0 0 30px rgba(200, 168, 233, 0.25), 0 0 60px rgba(200, 168, 233, 0.1)",
                  position: "relative",
                }}
              >
                <p style={{
                  color: "#e8d5f5",
                  fontSize: "13px",
                  fontFamily: "Georgia, serif",
                  fontStyle: "italic",
                  lineHeight: "1.6",
                }}>
                  "{quotes[currentQuote]}"
                </p>
                {[
                  { top: -10, right: 10 },
                  { top: -6, right: 40 },
                  { top: -12, right: 25 },
                ].map((pos, i) => (
                  <motion.span
                    key={i}
                    style={{ position: "absolute", ...pos, color: "#ffd54f", fontSize: 11 }}
                    animate={{ opacity: [0, 1, 0], rotate: [0, 180, 360], scale: [0.5, 1.2, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.6 }}
                  >
                    ✦
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
