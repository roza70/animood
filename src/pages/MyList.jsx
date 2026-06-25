import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "../context/ThemeContext"

const RATING_TIERS = [
  { label: "Masterpiece", emoji: "👑", color: "#ffd700", desc: "Absolute perfection" },
  { label: "Best", emoji: "⭐", color: "#ff9800", desc: "Loved every second" },
  { label: "Good", emoji: "💚", color: "#4caf50", desc: "Really enjoyed it" },
  { label: "Average", emoji: "😐", color: "#9e9e9e", desc: "It was okay" },
  { label: "Worst", emoji: "💔", color: "#f44336", desc: "Not my thing" },
]

export default function MyList({ user, watchlist, ratings, onAdd, onRate, onCardClick }) {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const [activeTab, setActiveTab] = useState("watchlist")
  const [activeTier, setActiveTier] = useState("all")

  const ratedAnime = watchlist.filter(a => ratings[a.mal_id])
  const unwatched = watchlist.filter(a => !ratings[a.mal_id])

  const filteredRated = activeTier === "all"
    ? ratedAnime
    : ratedAnime.filter(a => ratings[a.mal_id] === activeTier)

  const cardStyle = {
    background: isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.6)",
    border: isDark ? "1px solid rgba(200,168,233,0.15)" : "1px solid rgba(233,30,140,0.15)",
    borderRadius: "20px",
    backdropFilter: "blur(10px)",
  }

  const AnimeListCard = ({ anime, showRating }) => (
    <motion.div
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onCardClick && onCardClick(anime)}
      style={{
        display: "flex", gap: 14, alignItems: "center",
        padding: "12px 16px", borderRadius: "14px",
        cursor: "pointer",
        background: isDark ? "rgba(200,168,233,0.06)" : "rgba(233,30,140,0.04)",
        border: isDark ? "1px solid rgba(200,168,233,0.1)" : "1px solid rgba(233,30,140,0.1)",
        transition: "all 0.2s",
        position: "relative",
      }}
    >
      {/* Poster */}
      <img
        src={anime?.images?.jpg?.large_image_url || anime?.images?.jpg?.image_url}
        alt={anime?.title}
        style={{
          width: 56, height: 80,
          borderRadius: "8px",
          objectFit: "cover",
          flexShrink: 0,
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        }}
      />

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          color: isDark ? "#e8d5f5" : "#c2185b",
          fontSize: "clamp(12px, 1.5vw, 14px)",
          fontWeight: "700",
          margin: "0 0 4px 0",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {anime?.title_english || anime?.title}
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          {anime?.score && (
            <span style={{ color: "#ffd700", fontSize: "11px", fontWeight: "600" }}>⭐ {anime.score}</span>
          )}
          {anime?.episodes && (
            <span style={{ color: isDark ? "#9b7fbf" : "#f06292", fontSize: "11px" }}>{anime.episodes} eps</span>
          )}
          {anime?.genres?.slice(0, 2).map(g => (
            <span key={g.mal_id} style={{
              padding: "2px 8px", borderRadius: "8px",
              background: isDark ? "rgba(200,168,233,0.1)" : "rgba(233,30,140,0.08)",
              color: isDark ? "#c8a8e9" : "#e91e8c",
              fontSize: "10px", fontWeight: "600",
            }}>{g.name}</span>
          ))}
        </div>
        {showRating && ratings[anime.mal_id] && (
          <div style={{ marginTop: 4 }}>
            <span style={{
              padding: "2px 10px", borderRadius: "10px",
              background: `${RATING_TIERS.find(r => r.label === ratings[anime.mal_id])?.color}25`,
              color: RATING_TIERS.find(r => r.label === ratings[anime.mal_id])?.color,
              fontSize: "11px", fontWeight: "700",
            }}>
              {RATING_TIERS.find(r => r.label === ratings[anime.mal_id])?.emoji} {ratings[anime.mal_id]}
            </span>
          </div>
        )}
      </div>

      {/* Click indicator */}
      <div style={{ color: isDark ? "#9b7fbf" : "#f06292", fontSize: "16px", flexShrink: 0 }}>›</div>
    </motion.div>
  )

  return (
    <div style={{ padding: "clamp(16px, 4vw, 48px)", paddingTop: "clamp(80px, 10vw, 100px)" }}>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: "clamp(20px, 4vw, 36px)" }}
      >
        <h1 style={{
          fontFamily: "Georgia, serif",
          fontSize: "clamp(22px, 4vw, 36px)",
          fontWeight: "bold",
          color: isDark ? "#e8d5f5" : "#e91e8c",
          margin: "0 0 8px 0",
        }}>
          ✦ My Anime List
        </h1>
        <p style={{ color: isDark ? "#9b7fbf" : "#f06292", fontSize: "14px", margin: 0 }}>
          {watchlist.length} anime saved · {ratedAnime.length} rated · click any to see details
        </p>
      </motion.div>

      {/* Tabs */}
      <div style={{
        display: "flex", gap: 8, marginBottom: "clamp(20px, 4vw, 32px)",
        borderBottom: isDark ? "1px solid rgba(200,168,233,0.15)" : "1px solid rgba(233,30,140,0.15)",
        paddingBottom: 0, overflowX: "auto", scrollbarWidth: "none",
      }}>
        {[
          { id: "watchlist", label: "📋 Watchlist", count: unwatched.length },
          { id: "ratings", label: "⭐ Ratings", count: ratedAnime.length },
          { id: "stats", label: "📊 Stats", count: null },
        ].map(tab => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              padding: "10px clamp(12px, 2vw, 20px)",
              borderRadius: "12px 12px 0 0",
              border: "none", cursor: "pointer",
              fontSize: "clamp(12px, 1.5vw, 14px)",
              fontWeight: "600",
              background: activeTab === tab.id
                ? isDark ? "rgba(200,168,233,0.2)" : "rgba(233,30,140,0.1)"
                : "transparent",
              color: activeTab === tab.id
                ? isDark ? "#e8d5f5" : "#e91e8c"
                : isDark ? "#9b7fbf" : "#f06292",
              borderBottom: activeTab === tab.id
                ? `2px solid ${isDark ? "#c8a8e9" : "#e91e8c"}`
                : "2px solid transparent",
              transition: "all 0.3s",
              whiteSpace: "nowrap",
            }}
          >
            {tab.label} {tab.count !== null && (
              <span style={{
                marginLeft: 6, padding: "2px 8px",
                borderRadius: "10px", fontSize: "11px",
                background: isDark ? "rgba(200,168,233,0.2)" : "rgba(233,30,140,0.15)",
                color: isDark ? "#c8a8e9" : "#e91e8c",
              }}>
                {tab.count}
              </span>
            )}
          </motion.button>
        ))}
      </div>

      {/* Watchlist tab */}
      <AnimatePresence mode="wait">
        {activeTab === "watchlist" && (
          <motion.div
            key="watchlist"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {unwatched.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
                <p style={{ color: isDark ? "#9b7fbf" : "#f06292", fontSize: 16 }}>
                  Your watchlist is empty! Add some anime to get started.
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {unwatched.map((anime, i) => (
                  <motion.div
                    key={anime.mal_id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <AnimeListCard anime={anime} showRating={false} />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Ratings tab */}
        {activeTab === "ratings" && (
          <motion.div
            key="ratings"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* Tier filter */}
            <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTier("all")}
                style={{
                  padding: "8px 16px", borderRadius: "20px", border: "none",
                  background: activeTier === "all"
                    ? isDark ? "rgba(200,168,233,0.3)" : "rgba(233,30,140,0.2)"
                    : isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.5)",
                  color: isDark ? "#e8d5f5" : "#e91e8c",
                  fontSize: "13px", fontWeight: "600", cursor: "pointer",
                  border: isDark ? "1px solid rgba(200,168,233,0.2)" : "1px solid rgba(233,30,140,0.2)",
                }}
              >All Rated</motion.button>
              {RATING_TIERS.map(tier => (
                <motion.button
                  key={tier.label}
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTier(tier.label)}
                  style={{
                    padding: "8px 16px", borderRadius: "20px", border: "none",
                    background: activeTier === tier.label ? `${tier.color}25` : isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.5)",
                    color: tier.color,
                    fontSize: "13px", fontWeight: "600", cursor: "pointer",
                    border: `1px solid ${tier.color}40`,
                    boxShadow: activeTier === tier.label ? `0 0 12px ${tier.color}30` : "none",
                  }}
                >
                  {tier.emoji} {tier.label}
                </motion.button>
              ))}
            </div>

            {filteredRated.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>⭐</div>
                <p style={{ color: isDark ? "#9b7fbf" : "#f06292", fontSize: 16 }}>No anime rated in this tier!</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {filteredRated.map((anime, i) => (
                  <motion.div
                    key={anime.mal_id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <AnimeListCard anime={anime} showRating={true} />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Stats tab */}
        {activeTab === "stats" && (
          <motion.div
            key="stats"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16 }}
          >
            {[
              { label: "Total Saved", value: watchlist.length, emoji: "📚", color: "#c8a8e9" },
              { label: "Total Rated", value: ratedAnime.length, emoji: "⭐", color: "#ffd700" },
              { label: "Masterpieces", value: ratedAnime.filter(a => ratings[a.mal_id] === "Masterpiece").length, emoji: "👑", color: "#ffd700" },
              { label: "Best Picks", value: ratedAnime.filter(a => ratings[a.mal_id] === "Best").length, emoji: "⭐", color: "#ff9800" },
              { label: "Good Watches", value: ratedAnime.filter(a => ratings[a.mal_id] === "Good").length, emoji: "💚", color: "#4caf50" },
              { label: "Average", value: ratedAnime.filter(a => ratings[a.mal_id] === "Average").length, emoji: "😐", color: "#9e9e9e" },
              { label: "Worst", value: ratedAnime.filter(a => ratings[a.mal_id] === "Worst").length, emoji: "💔", color: "#f44336" },
              { label: "Yet to Watch", value: unwatched.length, emoji: "🎯", color: "#26c6da" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.08 }}
                style={{ ...cardStyle, padding: "clamp(16px, 3vw, 24px)", textAlign: "center" }}
              >
                <div style={{ fontSize: 36, marginBottom: 8 }}>{stat.emoji}</div>
                <div style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: "800", color: stat.color, fontFamily: "Georgia, serif" }}>
                  {stat.value}
                </div>
                <div style={{ color: isDark ? "#9b7fbf" : "#f06292", fontSize: "clamp(11px, 1.5vw, 13px)", fontWeight: "600", marginTop: 4 }}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
