import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "../context/ThemeContext"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"

const STATUSES = [
  { key: "watching", label: "Watching", emoji: "▶️", color: "#4caf50" },
  { key: "completed", label: "Completed", emoji: "✅", color: "#26c6da" },
  { key: "onhold", label: "On Hold", emoji: "⏸️", color: "#ffb74d" },
  { key: "dropped", label: "Dropped", emoji: "❌", color: "#ef5350" },
  { key: "plantowatch", label: "Plan to Watch", emoji: "📌", color: "#9575cd" },
]

const RATING_TIERS = [
  { label: "Masterpiece", emoji: "👑", color: "#ffd700" },
  { label: "Best", emoji: "⭐", color: "#ff9800" },
  { label: "Good", emoji: "💚", color: "#4caf50" },
  { label: "Average", emoji: "😐", color: "#9e9e9e" },
  { label: "Worst", emoji: "💔", color: "#f44336" },
]

export default function MyList({ user, watchlist, ratings, statuses, onAdd, onRate, onStatus, onCardClick }) {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const [activeTab, setActiveTab] = useState("watching")
  const [activeTier, setActiveTier] = useState("all")
  const [statusMenuFor, setStatusMenuFor] = useState(null)

  const getStatus = (malId) => statuses?.[malId] || "plantowatch"

  const byStatus = (key) => watchlist.filter(a => getStatus(a.mal_id) === key)
  const ratedAnime = watchlist.filter(a => ratings[a.mal_id])

  const filteredRated = activeTier === "all"
    ? ratedAnime
    : ratedAnime.filter(a => ratings[a.mal_id] === activeTier)

  const cardStyle = {
    background: isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.6)",
    border: isDark ? "1px solid rgba(200,168,233,0.15)" : "1px solid rgba(233,30,140,0.15)",
    borderRadius: "20px",
    backdropFilter: "blur(10px)",
  }

  const statusBadge = (key) => STATUSES.find(s => s.key === key) || STATUSES[4]

  const AnimeListCard = ({ anime, showRating }) => {
    const st = statusBadge(getStatus(anime.mal_id))
    return (
      <div
        style={{
          display: "flex", gap: 14, alignItems: "center",
          padding: "12px 16px", borderRadius: "14px",
          background: isDark ? "rgba(200,168,233,0.06)" : "rgba(233,30,140,0.04)",
          border: isDark ? "1px solid rgba(200,168,233,0.1)" : "1px solid rgba(233,30,140,0.1)",
          position: "relative",
        }}
      >
        <img
          src={anime?.images?.jpg?.large_image_url || anime?.images?.jpg?.image_url}
          alt={anime?.title}
          onClick={() => onCardClick && onCardClick(anime)}
          style={{ width: 56, height: 80, borderRadius: "8px", objectFit: "cover", flexShrink: 0, boxShadow: "0 4px 12px rgba(0,0,0,0.3)", cursor: "pointer" }}
        />

        <div onClick={() => onCardClick && onCardClick(anime)} style={{ flex: 1, minWidth: 0, cursor: "pointer" }}>
          <p style={{
            color: isDark ? "#e8d5f5" : "#c2185b",
            fontSize: "clamp(12px, 1.5vw, 14px)", fontWeight: "700",
            margin: "0 0 4px 0",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {anime?.title_english || anime?.title}
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            {anime?.score && <span style={{ color: "#ffd700", fontSize: "11px", fontWeight: "600" }}>⭐ {anime.score}</span>}
            {anime?.episodes && <span style={{ color: isDark ? "#9b7fbf" : "#f06292", fontSize: "11px" }}>{anime.episodes} eps</span>}
            {showRating && ratings[anime.mal_id] && (
              <span style={{
                padding: "2px 10px", borderRadius: "10px",
                background: `${RATING_TIERS.find(r => r.label === ratings[anime.mal_id])?.color}25`,
                color: RATING_TIERS.find(r => r.label === ratings[anime.mal_id])?.color,
                fontSize: "11px", fontWeight: "700",
              }}>
                {RATING_TIERS.find(r => r.label === ratings[anime.mal_id])?.emoji} {ratings[anime.mal_id]}
              </span>
            )}
          </div>
        </div>

        {/* Status dropdown */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <button
            onClick={(e) => { e.stopPropagation(); setStatusMenuFor(statusMenuFor === anime.mal_id ? null : anime.mal_id) }}
            style={{
              padding: "6px 12px", borderRadius: "12px", border: "none",
              background: `${st.color}25`, color: st.color,
              fontSize: "11px", fontWeight: "700", cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {st.emoji} {st.label}
          </button>
          <AnimatePresence>
            {statusMenuFor === anime.mal_id && (
              <motion.div
                initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                style={{
                  position: "absolute", top: "110%", right: 0, zIndex: 50, minWidth: "160px",
                  background: isDark ? "rgba(10,5,40,0.98)" : "rgba(255,240,245,0.98)",
                  borderRadius: "12px", padding: "8px",
                  border: isDark ? "1px solid rgba(200,168,233,0.3)" : "1px solid rgba(233,30,140,0.2)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                }}
              >
                {STATUSES.map(s => (
                  <button
                    key={s.key}
                    onClick={() => { onStatus && onStatus(anime, s.key); setStatusMenuFor(null) }}
                    style={{
                      display: "flex", alignItems: "center", gap: 8,
                      width: "100%", padding: "8px 10px", borderRadius: "8px", border: "none",
                      background: "transparent", color: s.color,
                      fontSize: "13px", fontWeight: "600", cursor: "pointer", textAlign: "left",
                    }}
                  >{s.emoji} {s.label}</button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    )
  }

  const pieData = STATUSES.map(s => ({
    name: s.label,
    value: byStatus(s.key).length,
    color: s.color,
  })).filter(d => d.value > 0)

  const ratingBarData = RATING_TIERS.map(t => ({
    name: t.label,
    count: ratedAnime.filter(a => ratings[a.mal_id] === t.label).length,
    fill: t.color,
  }))

  return (
    <div style={{ padding: "clamp(16px, 4vw, 48px)", paddingTop: "clamp(80px, 10vw, 100px)" }}>

      <div style={{ marginBottom: "clamp(20px, 4vw, 36px)" }}>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(22px, 4vw, 36px)", fontWeight: "bold", color: isDark ? "#e8d5f5" : "#e91e8c", margin: "0 0 8px 0" }}>
          ✦ My Anime List
        </h1>
        <p style={{ color: isDark ? "#9b7fbf" : "#f06292", fontSize: "14px", margin: 0 }}>
          {watchlist.length} total · {ratedAnime.length} rated · click status badge to change
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: "flex", gap: 8, marginBottom: "clamp(20px, 4vw, 32px)",
        borderBottom: isDark ? "1px solid rgba(200,168,233,0.15)" : "1px solid rgba(233,30,140,0.15)",
        overflowX: "auto", scrollbarWidth: "none",
      }}>
        {[
          ...STATUSES.map(s => ({ id: s.key, label: `${s.emoji} ${s.label}`, count: byStatus(s.key).length })),
          { id: "ratings", label: "⭐ Ratings", count: ratedAnime.length },
          { id: "stats", label: "📊 Stats", count: null },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "10px clamp(10px, 2vw, 18px)",
              borderRadius: "12px 12px 0 0",
              border: "none", cursor: "pointer",
              fontSize: "clamp(11px, 1.4vw, 13px)", fontWeight: "600",
              background: activeTab === tab.id ? isDark ? "rgba(200,168,233,0.2)" : "rgba(233,30,140,0.1)" : "transparent",
              color: activeTab === tab.id ? isDark ? "#e8d5f5" : "#e91e8c" : isDark ? "#9b7fbf" : "#f06292",
              borderBottom: activeTab === tab.id ? `2px solid ${isDark ? "#c8a8e9" : "#e91e8c"}` : "2px solid transparent",
              transition: "background 0.2s", whiteSpace: "nowrap",
            }}
          >
            {tab.label} {tab.count !== null && (
              <span style={{ marginLeft: 6, padding: "2px 8px", borderRadius: "10px", fontSize: "11px", background: isDark ? "rgba(200,168,233,0.2)" : "rgba(233,30,140,0.15)", color: isDark ? "#c8a8e9" : "#e91e8c" }}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Status tabs */}
        {STATUSES.map(s => activeTab === s.key && (
          <motion.div key={s.key} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {byStatus(s.key).length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>{s.emoji}</div>
                <p style={{ color: isDark ? "#9b7fbf" : "#f06292", fontSize: 16 }}>No anime in "{s.label}" yet!</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {byStatus(s.key).map((anime) => (
                  <AnimeListCard key={anime.mal_id} anime={anime} showRating={true} />
                ))}
              </div>
            )}
          </motion.div>
        ))}

        {/* Ratings tab */}
        {activeTab === "ratings" && (
          <motion.div key="ratings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
              <button
                onClick={() => setActiveTier("all")}
                style={{
                  padding: "8px 16px", borderRadius: "20px",
                  background: activeTier === "all" ? isDark ? "rgba(200,168,233,0.3)" : "rgba(233,30,140,0.2)" : isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.5)",
                  color: isDark ? "#e8d5f5" : "#e91e8c",
                  fontSize: "13px", fontWeight: "600", cursor: "pointer",
                  border: isDark ? "1px solid rgba(200,168,233,0.2)" : "1px solid rgba(233,30,140,0.2)",
                }}
              >All Rated</button>
              {RATING_TIERS.map(tier => (
                <button
                  key={tier.label}
                  onClick={() => setActiveTier(tier.label)}
                  style={{
                    padding: "8px 16px", borderRadius: "20px", border: `1px solid ${tier.color}40`,
                    background: activeTier === tier.label ? `${tier.color}25` : isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.5)",
                    color: tier.color, fontSize: "13px", fontWeight: "600", cursor: "pointer",
                  }}
                >{tier.emoji} {tier.label}</button>
              ))}
            </div>

            {filteredRated.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>⭐</div>
                <p style={{ color: isDark ? "#9b7fbf" : "#f06292", fontSize: 16 }}>No anime rated in this tier!</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {filteredRated.map((anime) => (
                  <AnimeListCard key={anime.mal_id} anime={anime} showRating={true} />
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Stats tab with charts */}
        {activeTab === "stats" && (
          <motion.div key="stats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

            {/* Summary cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 14, marginBottom: 32 }}>
              {[
                { label: "Total Anime", value: watchlist.length, emoji: "📚", color: isDark ? "#c8a8e9" : "#e91e8c" },
                { label: "Total Rated", value: ratedAnime.length, emoji: "⭐", color: "#ffd700" },
                ...STATUSES.map(s => ({ label: s.label, value: byStatus(s.key).length, emoji: s.emoji, color: s.color })),
              ].map((stat) => (
                <div key={stat.label} style={{ ...cardStyle, padding: "clamp(14px, 2.5vw, 20px)", textAlign: "center" }}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>{stat.emoji}</div>
                  <div style={{ fontSize: "clamp(22px, 3vw, 30px)", fontWeight: "800", color: stat.color, fontFamily: "Georgia, serif" }}>{stat.value}</div>
                  <div style={{ color: isDark ? "#9b7fbf" : "#f06292", fontSize: "clamp(10px, 1.3vw, 12px)", fontWeight: "600", marginTop: 4 }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>

              {/* Pie chart - status breakdown */}
              <div style={{ ...cardStyle, padding: "clamp(16px, 3vw, 24px)" }}>
                <h3 style={{ fontFamily: "Georgia, serif", color: isDark ? "#e8d5f5" : "#c2185b", fontSize: "clamp(14px, 2vw, 18px)", margin: "0 0 16px 0" }}>
                  📊 Status Breakdown
                </h3>
                {pieData.length === 0 ? (
                  <p style={{ color: isDark ? "#9b7fbf" : "#f06292", fontSize: 13, textAlign: "center", padding: "40px 0" }}>No anime added yet!</p>
                ) : (
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={(entry) => `${entry.name}: ${entry.value}`}>
                        {pieData.map((entry, i) => (
                          <Cell key={`cell-${i}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ background: isDark ? "rgba(10,5,40,0.95)" : "rgba(255,255,255,0.95)", border: "none", borderRadius: "10px", color: isDark ? "#e8d5f5" : "#333" }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Bar chart - ratings */}
              <div style={{ ...cardStyle, padding: "clamp(16px, 3vw, 24px)" }}>
                <h3 style={{ fontFamily: "Georgia, serif", color: isDark ? "#e8d5f5" : "#c2185b", fontSize: "clamp(14px, 2vw, 18px)", margin: "0 0 16px 0" }}>
                  ⭐ Rating Distribution
                </h3>
                {ratedAnime.length === 0 ? (
                  <p style={{ color: isDark ? "#9b7fbf" : "#f06292", fontSize: 13, textAlign: "center", padding: "40px 0" }}>No anime rated yet!</p>
                ) : (
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={ratingBarData}>
                      <XAxis dataKey="name" tick={{ fontSize: 10, fill: isDark ? "#9b7fbf" : "#f06292" }} interval={0} angle={-20} textAnchor="end" height={60} />
                      <YAxis tick={{ fontSize: 11, fill: isDark ? "#9b7fbf" : "#f06292" }} allowDecimals={false} />
                      <Tooltip contentStyle={{ background: isDark ? "rgba(10,5,40,0.95)" : "rgba(255,255,255,0.95)", border: "none", borderRadius: "10px", color: isDark ? "#e8d5f5" : "#333" }} />
                      <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                        {ratingBarData.map((entry, i) => (
                          <Cell key={`bar-${i}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
