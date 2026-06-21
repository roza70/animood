import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "../context/ThemeContext"

export default function AnimeCard({ anime, onAdd, onRate, isInWatchlist }) {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const [hovered, setHovered] = useState(false)
  const [showRating, setShowRating] = useState(false)

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

  return (
    <motion.div
      className="relative flex-shrink-0"
      style={{
        width: "clamp(130px, 15vw, 180px)",
        cursor: "pointer",
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => { setHovered(false); setShowRating(false) }}
      whileHover={{ scale: 1.05, zIndex: 50 }}
      transition={{ duration: 0.2 }}
    >
      {/* Card image */}
      <div style={{
        width: "100%",
        aspectRatio: "2/3",
        borderRadius: "12px",
        overflow: "hidden",
        position: "relative",
        boxShadow: isDark
          ? "0 4px 20px rgba(0,0,0,0.5)"
          : "0 4px 20px rgba(0,0,0,0.15)",
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
                  ? "linear-gradient(to top, rgba(2,8,24,0.95) 0%, rgba(2,8,24,0.5) 60%, transparent 100%)"
                  : "linear-gradient(to top, rgba(255,230,240,0.95) 0%, rgba(255,200,220,0.5) 60%, transparent 100%)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                padding: "12px",
                gap: 6,
              }}
            >
              {/* Score */}
              {score && (
                <div style={{
                  display: "flex", alignItems: "center", gap: 4,
                  color: "#ffd700", fontSize: "12px", fontWeight: "700",
                }}>
                  ⭐ {score}
                  {episodes && (
                    <span style={{ color: isDark ? "#c8a8e9" : "#e91e8c", marginLeft: 4 }}>
                      · {episodes} eps
                    </span>
                  )}
                </div>
              )}

              {/* Synopsis */}
              <p style={{
                color: isDark ? "#e8d5f5" : "#8b0040",
                fontSize: "10px",
                lineHeight: 1.4,
                margin: 0,
              }}>
                {synopsis}
              </p>

              {/* Genres */}
              {genres && (
                <p style={{
                  color: isDark ? "#c8a8e9" : "#e91e8c",
                  fontSize: "10px", margin: 0, fontWeight: "600",
                }}>
                  {genres}
                </p>
              )}

              {/* Buttons */}
              <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                {/* Add to watchlist */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => { e.stopPropagation(); onAdd && onAdd(anime) }}
                  style={{
                    flex: 1, padding: "6px 4px",
                    borderRadius: "8px", border: "none",
                    background: isInWatchlist
                      ? isDark ? "rgba(200,168,233,0.4)" : "rgba(233,30,140,0.3)"
                      : isDark ? "rgba(200,168,233,0.2)" : "rgba(233,30,140,0.15)",
                    color: isDark ? "#e8d5f5" : "#e91e8c",
                    fontSize: "11px", cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  {isInWatchlist ? "✓ Added" : "+ Watchlist"}
                </motion.button>

                {/* Rate */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => { e.stopPropagation(); setShowRating(!showRating) }}
                  style={{
                    padding: "6px 8px",
                    borderRadius: "8px", border: "none",
                    background: isDark ? "rgba(255,213,79,0.2)" : "rgba(255,152,0,0.2)",
                    color: "#ffd700",
                    fontSize: "11px", cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  ★ Rate
                </motion.button>
              </div>

              {/* Rating dropdown */}
              <AnimatePresence>
                {showRating && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    style={{
                      display: "flex", flexDirection: "column", gap: 4,
                      background: isDark ? "rgba(10,5,40,0.95)" : "rgba(255,240,245,0.98)",
                      borderRadius: "10px", padding: "8px",
                      border: isDark ? "1px solid rgba(200,168,233,0.3)" : "1px solid rgba(233,30,140,0.2)",
                    }}
                  >
                    {ratings.map(r => (
                      <motion.button
                        key={r.label}
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          onRate && onRate(anime, r.label)
                          setShowRating(false)
                        }}
                        style={{
                          padding: "5px 8px",
                          borderRadius: "6px", border: "none",
                          background: "transparent",
                          color: r.color,
                          fontSize: "11px", cursor: "pointer",
                          fontWeight: "600", textAlign: "left",
                          display: "flex", alignItems: "center", gap: 6,
                        }}
                      >
                        {r.emoji} {r.label}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Title below card */}
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