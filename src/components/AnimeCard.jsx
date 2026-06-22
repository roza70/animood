import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "../context/ThemeContext"

export default function AnimeCard({ anime, onAdd, onRate, onNote, isInWatchlist, userNote }) {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const [hovered, setHovered] = useState(false)
  const [showRating, setShowRating] = useState(false)
  const [showNote, setShowNote] = useState(false)
  const [noteText, setNoteText] = useState(userNote || "")

  const ratings = [
    { label: "Masterpiece", emoji: "👑", color: "#ffd700" },
    { label: "Best", emoji: "⭐", color: "#ff9800" },
    { label: "Good", emoji: "💚", color: "#4caf50" },
    { label: "Average", emoji: "😐", color: "#9e9e9e" },
    { label: "Worst", emoji: "💔", color: "#f44336" },
  ]

  const image = anime?.images?.jpg?.large_image_url || anime?.images?.jpg?.image_url
  const title = anime?.title_english || anime?.title
  const score = anime?.score
  const episodes = anime?.episodes
  const genres = anime?.genres?.slice(0, 2).map(g => g.name).join(" · ")
  const synopsis = anime?.synopsis?.slice(0, 100) + "..."

  const handleSaveNote = (e) => {
    e.stopPropagation()
    onNote && onNote(anime, noteText)
    setShowNote(false)
  }

  return (
    <motion.div
      className="relative flex-shrink-0"
      style={{ width: "clamp(130px, 15vw, 180px)", cursor: "pointer" }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => { setHovered(false); setShowRating(false) }}
      whileHover={{ scale: 1.05, zIndex: 50 }}
      transition={{ duration: 0.2 }}
    >
      {/* Note indicator */}
      {userNote && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          style={{
            position: "absolute",
            top: -6, left: -6,
            zIndex: 10,
            width: 20, height: 20,
            borderRadius: "50%",
            background: isDark ? "#c8a8e9" : "#e91e8c",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          }}
        >
          📝
        </motion.div>
      )}

      {/* Card image */}
      <div style={{
        width: "100%",
        aspectRatio: "2/3",
        borderRadius: "12px",
        overflow: "hidden",
        position: "relative",
        boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.5)" : "0 4px 20px rgba(0,0,0,0.15)",
      }}>
        <img
          src={image}
          alt={title}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          loading="lazy"
        />

        {/* Hover overlay */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "absolute", inset: 0,
                background: isDark
                  ? "linear-gradient(to top, rgba(2,8,24,0.97) 0%, rgba(2,8,24,0.5) 60%, transparent 100%)"
                  : "linear-gradient(to top, rgba(255,230,240,0.97) 0%, rgba(255,200,220,0.5) 60%, transparent 100%)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                padding: "10px",
                gap: 5,
              }}
            >
              {/* Score */}
              {score && (
                <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#ffd700", fontSize: "11px", fontWeight: "700" }}>
                  ⭐ {score}
                  {episodes && <span style={{ color: isDark ? "#c8a8e9" : "#e91e8c", marginLeft: 4 }}>· {episodes} eps</span>}
                </div>
              )}

              {/* Synopsis */}
              <p style={{ color: isDark ? "#e8d5f5" : "#8b0040", fontSize: "10px", lineHeight: 1.4, margin: 0 }}>
                {synopsis}
              </p>

              {/* Genres */}
              {genres && (
                <p style={{ color: isDark ? "#c8a8e9" : "#e91e8c", fontSize: "10px", margin: 0, fontWeight: "600" }}>
                  {genres}
                </p>
              )}

              {/* Note preview */}
              {userNote && (
                <p style={{
                  color: isDark ? "#ffd54f" : "#ff6b9d",
                  fontSize: "10px", margin: 0,
                  fontStyle: "italic",
                  borderTop: isDark ? "1px solid rgba(200,168,233,0.2)" : "1px solid rgba(233,30,140,0.2)",
                  paddingTop: 4,
                }}>
                  📝 "{userNote.slice(0, 40)}{userNote.length > 40 ? "..." : ""}"
                </p>
              )}

              {/* Action buttons */}
              <div style={{ display: "flex", gap: 4, marginTop: 2 }}>
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={(e) => { e.stopPropagation(); onAdd && onAdd(anime) }}
                  style={{
                    flex: 1, padding: "5px 2px",
                    borderRadius: "8px", border: "none",
                    background: isInWatchlist
                      ? isDark ? "rgba(200,168,233,0.4)" : "rgba(233,30,140,0.3)"
                      : isDark ? "rgba(200,168,233,0.15)" : "rgba(233,30,140,0.1)",
                    color: isDark ? "#e8d5f5" : "#e91e8c",
                    fontSize: "10px", cursor: "pointer", fontWeight: "600",
                  }}
                >
                  {isInWatchlist ? "✓ Added" : "+ List"}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={(e) => { e.stopPropagation(); setShowRating(!showRating); setShowNote(false) }}
                  style={{
                    padding: "5px 6px", borderRadius: "8px", border: "none",
                    background: isDark ? "rgba(255,213,79,0.15)" : "rgba(255,152,0,0.15)",
                    color: "#ffd700", fontSize: "10px", cursor: "pointer", fontWeight: "600",
                  }}
                >
                  ★
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={(e) => { e.stopPropagation(); setShowNote(!showNote); setShowRating(false) }}
                  style={{
                    padding: "5px 6px", borderRadius: "8px", border: "none",
                    background: isDark ? "rgba(200,168,233,0.15)" : "rgba(233,30,140,0.1)",
                    color: isDark ? "#c8a8e9" : "#e91e8c",
                    fontSize: "10px", cursor: "pointer", fontWeight: "600",
                  }}
                >
                  📝
                </motion.button>
              </div>

              {/* Rating dropdown */}
              <AnimatePresence>
                {showRating && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    style={{
                      display: "flex", flexDirection: "column", gap: 3,
                      background: isDark ? "rgba(10,5,40,0.98)" : "rgba(255,240,245,0.98)",
                      borderRadius: "10px", padding: "6px",
                      border: isDark ? "1px solid rgba(200,168,233,0.3)" : "1px solid rgba(233,30,140,0.2)",
                    }}
                  >
                    {ratings.map(r => (
                      <motion.button
                        key={r.label}
                        whileHover={{ scale: 1.02, x: 3 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          onRate && onRate(anime, r.label)
                          setShowRating(false)
                        }}
                        style={{
                          padding: "4px 6px", borderRadius: "6px", border: "none",
                          background: "transparent", color: r.color,
                          fontSize: "10px", cursor: "pointer", fontWeight: "600",
                          textAlign: "left", display: "flex", alignItems: "center", gap: 4,
                        }}
                      >
                        {r.emoji} {r.label}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Note input */}
              <AnimatePresence>
                {showNote && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    onClick={e => e.stopPropagation()}
                    style={{
                      background: isDark ? "rgba(10,5,40,0.98)" : "rgba(255,240,245,0.98)",
                      borderRadius: "10px", padding: "8px",
                      border: isDark ? "1px solid rgba(200,168,233,0.3)" : "1px solid rgba(233,30,140,0.2)",
                    }}
                  >
                    <p style={{
                      color: isDark ? "#c8a8e9" : "#e91e8c",
                      fontSize: "10px", margin: "0 0 5px 0", fontWeight: "700",
                    }}>
                      📝 How did you feel?
                    </p>
                    <textarea
                      value={noteText}
                      onChange={e => setNoteText(e.target.value)}
                      placeholder="Write your thoughts..."
                      rows={3}
                      style={{
                        width: "100%",
                        padding: "6px",
                        borderRadius: "8px",
                        border: isDark ? "1px solid rgba(200,168,233,0.3)" : "1px solid rgba(233,30,140,0.3)",
                        background: isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.7)",
                        color: isDark ? "#e8d5f5" : "#8b0040",
                        fontSize: "10px",
                        resize: "none",
                        outline: "none",
                        boxSizing: "border-box",
                        fontFamily: "Georgia, serif",
                      }}
                    />
                    <div style={{ display: "flex", gap: 4, marginTop: 5 }}>
                      <motion.button
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={handleSaveNote}
                        style={{
                          flex: 1, padding: "5px",
                          borderRadius: "8px", border: "none",
                          background: isDark ? "rgba(200,168,233,0.3)" : "rgba(233,30,140,0.2)",
                          color: isDark ? "#e8d5f5" : "#e91e8c",
                          fontSize: "10px", cursor: "pointer", fontWeight: "700",
                        }}
                      >
                        Save ✦
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={(e) => { e.stopPropagation(); setShowNote(false) }}
                        style={{
                          padding: "5px 8px", borderRadius: "8px", border: "none",
                          background: "transparent",
                          color: isDark ? "#9b7fbf" : "#f06292",
                          fontSize: "10px", cursor: "pointer",
                        }}
                      >
                        ✕
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Title */}
      <p style={{
        color: isDark ? "#e8d5f5" : "#8b0040",
        fontSize: "clamp(10px, 1.2vw, 12px)",
        margin: "8px 0 0 0",
        fontWeight: "600",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}>
        {title}
      </p>
    </motion.div>
  )
}