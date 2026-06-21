import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "../context/ThemeContext"

const moods = [
  { id: "happy", label: "Happy", emoji: "🌸", color: "#ff8fab", desc: "Feel-good & cheerful" },
  { id: "sad", label: "Sad", emoji: "🌧️", color: "#7986cb", desc: "Emotional & touching" },
  { id: "excited", label: "Excited", emoji: "⚡", color: "#ffa726", desc: "Hype & action-packed" },
  { id: "romantic", label: "Romantic", emoji: "💕", color: "#f06292", desc: "Love & heartwarming" },
  { id: "scared", label: "Scared", emoji: "👻", color: "#9575cd", desc: "Horror & thriller" },
  { id: "cozy", label: "Cozy", emoji: "☕", color: "#a1887f", desc: "Warm & relaxing" },
  { id: "epic", label: "Epic", emoji: "🔥", color: "#ef5350", desc: "Grand & legendary" },
  { id: "curious", label: "Curious", emoji: "🔮", color: "#26c6da", desc: "Mystery & mind-bending" },
  { id: "power", label: "Power", emoji: "👊", color: "#ff7043", desc: "Isekai & overpowered" },
  { id: "magical", label: "Magical", emoji: "✨", color: "#ec407a", desc: "Magic & fantasy" },
  { id: "dark", label: "Dark", emoji: "🌑", color: "#5c6bc0", desc: "Deep & psychological" },
  { id: "nostalgic", label: "Nostalgic", emoji: "🍂", color: "#8d6e63", desc: "Classic & school life" },
]

export default function MoodPicker({ onMoodSelect, selectedMood }) {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const [hoveredMood, setHoveredMood] = useState(null)

  return (
    <div style={{ padding: "0 clamp(16px, 4vw, 48px)", marginBottom: "clamp(24px, 4vw, 40px)" }}>
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: "clamp(16px, 3vw, 24px)" }}
      >
        <h2 style={{
          fontFamily: "Georgia, serif",
          fontSize: "clamp(18px, 3vw, 26px)",
          fontWeight: "700",
          color: isDark ? "#e8d5f5" : "#e91e8c",
          margin: "0 0 6px 0",
        }}>
          ✦ How are you feeling today?
        </h2>
        <p style={{
          color: isDark ? "#9b7fbf" : "#f06292",
          fontSize: "clamp(12px, 1.5vw, 14px)",
          margin: 0,
        }}>
          Pick a mood and we'll find your perfect anime
        </p>
      </motion.div>

      {/* Mood grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(clamp(80px, 10vw, 110px), 1fr))",
        gap: "clamp(8px, 1.5vw, 14px)",
      }}>
        {moods.map((mood, i) => (
          <motion.div
            key={mood.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.08, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onHoverStart={() => setHoveredMood(mood.id)}
            onHoverEnd={() => setHoveredMood(null)}
            onClick={() => onMoodSelect(mood)}
            style={{
              padding: "clamp(10px, 2vw, 16px) 8px",
              borderRadius: "16px",
              cursor: "pointer",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
              border: selectedMood?.id === mood.id
                ? `2px solid ${mood.color}`
                : isDark
                  ? "1px solid rgba(200,168,233,0.15)"
                  : "1px solid rgba(233,30,140,0.15)",
              background: selectedMood?.id === mood.id
                ? `${mood.color}25`
                : isDark
                  ? "rgba(255,255,255,0.04)"
                  : "rgba(255,255,255,0.5)",
              backdropFilter: "blur(10px)",
              boxShadow: selectedMood?.id === mood.id
                ? `0 0 20px ${mood.color}40`
                : "none",
              transition: "all 0.3s",
            }}
          >
            {/* Glow effect on hover */}
            <AnimatePresence>
              {hoveredMood === mood.id && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    position: "absolute", inset: 0,
                    background: `radial-gradient(circle at center, ${mood.color}20 0%, transparent 70%)`,
                    borderRadius: "16px",
                  }}
                />
              )}
            </AnimatePresence>

            {/* Emoji */}
            <motion.div
              animate={selectedMood?.id === mood.id ? { rotate: [0, -10, 10, 0], scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.5 }}
              style={{ fontSize: "clamp(20px, 3vw, 28px)", marginBottom: "6px" }}
            >
              {mood.emoji}
            </motion.div>

            {/* Label */}
            <p style={{
              color: selectedMood?.id === mood.id
                ? mood.color
                : isDark ? "#c8a8e9" : "#e91e8c",
              fontSize: "clamp(10px, 1.2vw, 12px)",
              fontWeight: "700",
              margin: "0 0 2px 0",
            }}>
              {mood.label}
            </p>

            {/* Desc */}
            <p style={{
              color: isDark ? "#9b7fbf" : "#f48fb1",
              fontSize: "clamp(8px, 1vw, 10px)",
              margin: 0,
              lineHeight: 1.3,
            }}>
              {mood.desc}
            </p>

            {/* Selected checkmark */}
            <AnimatePresence>
              {selectedMood?.id === mood.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  style={{
                    position: "absolute",
                    top: 6, right: 6,
                    width: 16, height: 16,
                    borderRadius: "50%",
                    background: mood.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "9px",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  ✓
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  )
}