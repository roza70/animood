import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "../context/ThemeContext"
import AnimeCard from "../components/AnimeCard"

const RATING_TIERS = [
  { label: "Masterpiece", emoji: "👑", color: "#ffd700", desc: "Absolute perfection" },
  { label: "Best", emoji: "⭐", color: "#ff9800", desc: "Loved every second" },
  { label: "Good", emoji: "💚", color: "#4caf50", desc: "Really enjoyed it" },
  { label: "Average", emoji: "😐", color: "#9e9e9e", desc: "It was okay" },
  { label: "Worst", emoji: "💔", color: "#f44336", desc: "Not my thing" },
]

export default function MyList({ user, watchlist, ratings, onAdd, onRate }) {
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
          {watchlist.length} anime saved · {ratedAnime.length} rated
        </p>
      </motion.div>

      {/* Tabs */}
      <div style={{
        display: "flex", gap: 8, marginBottom: "clamp(20px, 4vw, 32px)",
        borderBottom: isDark ? "1px solid rgba(200,168,233,0.15)" : "1px solid rgba(233,30,140,0.15)",
        paddingBottom: 0,
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
              border: "none",
              cursor: "pointer",
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
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(clamp(120px, 12vw, 160px), 1fr))",
                gap: "clamp(10px, 2vw, 20px)",
              }}>
                {unwatched.map((anime, i) => (
                  <motion.div
                    key={anime.mal_id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <AnimeCard
                      anime={anime}
                      onAdd={onAdd}
                      onRate={onRate}
                      isInWatchlist={true}
                    />
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
              >
                All Rated
              </motion.button>
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
                <p style={{ color: isDark ? "#9b7fbf" : "#f06292", fontSize: 16 }}>
                  No anime rated yet in this tier!
                </p>
              </div>
            ) : (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(clamp(120px, 12vw, 160px), 1fr))",
                gap: "clamp(10px, 2vw, 20px)",
              }}>
                {filteredRated.map((anime, i) => (
                  <motion.div
                    key={anime.mal_id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.04 }}
                    style={{ position: "relative" }}
                  >
                    {/* Rating badge */}
                    <div style={{
                      position: "absolute",
                      top: -8, right: -4,
                      zIndex: 10,
                      padding: "3px 8px",
                      borderRadius: "10px",
                      background: RATING_TIERS.find(r => r.label === ratings[anime.mal_id])?.color || "#fff",
                      fontSize: "10px",
                      fontWeight: "700",
                      color: "white",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                    }}>
                      {RATING_TIERS.find(r => r.label === ratings[anime.mal_id])?.emoji} {ratings[anime.mal_id]}
                    </div>
                    <AnimeCard
                      anime={anime}
                      onAdd={onAdd}
                      onRate={onRate}
                      isInWatchlist={watchlist.some(w => w.mal_id === anime.mal_id)}
                    />
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
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}
          >
            {/* Total saved */}
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
                style={{
                  ...cardStyle,
                  padding: "clamp(16px, 3vw, 24px)",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 36, marginBottom: 8 }}>{stat.emoji}</div>
                <div style={{
                  fontSize: "clamp(28px, 4vw, 40px)",
                  fontWeight: "800",
                  color: stat.color,
                  fontFamily: "Georgia, serif",
                }}>
                  {stat.value}
                </div>
                <div style={{
                  color: isDark ? "#9b7fbf" : "#f06292",
                  fontSize: "clamp(11px, 1.5vw, 13px)",
                  fontWeight: "600",
                  marginTop: 4,
                }}>
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