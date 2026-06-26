import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "../context/ThemeContext"
import { getAnimeById, getAnimeCharacters, getAnimeEpisodes } from "../api/jikan"

export default function AnimeDetail({ anime: initialAnime, onClose, onAdd, onRate, onNote, isInWatchlist, userNote, userRating }) {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const [anime, setAnime] = useState(initialAnime)
  const [characters, setCharacters] = useState([])
  const [episodes, setEpisodes] = useState([])
  const [episodePage, setEpisodePage] = useState(1)
  const [hasMoreEps, setHasMoreEps] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [episodeRatings, setEpisodeRatings] = useState(() => {
    return JSON.parse(localStorage.getItem(`ep_ratings_${initialAnime?.mal_id}`) || "{}")
  })
  const [note, setNote] = useState(userNote || "")
  const [loadingEps, setLoadingEps] = useState(false)
  const [showTrailer, setShowTrailer] = useState(false)
  const [showRatingMenu, setShowRatingMenu] = useState(false)
  const [hoveredEp, setHoveredEp] = useState(null)

  const ratings = [
    { label: "Masterpiece", emoji: "👑", color: "#ffd700" },
    { label: "Best", emoji: "⭐", color: "#ff9800" },
    { label: "Good", emoji: "💚", color: "#4caf50" },
    { label: "Average", emoji: "😐", color: "#9e9e9e" },
    { label: "Worst", emoji: "💔", color: "#f44336" },
  ]

  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "unset" }
  }, [])

  useEffect(() => {
    const load = async () => {
      try {
        const [fullRes, charRes] = await Promise.all([
          getAnimeById(initialAnime.mal_id),
          getAnimeCharacters(initialAnime.mal_id),
        ])
        setAnime(fullRes.data.data)
        setCharacters(charRes.data.data?.slice(0, 24) || [])
      } catch (err) {
        console.error(err)
      }
    }
    load()
    loadEpisodes(1)
  }, [])

  const loadEpisodes = async (page) => {
    try {
      setLoadingEps(true)
      const res = await getAnimeEpisodes(initialAnime.mal_id, page)
      if (page === 1) {
        setEpisodes(res.data.data || [])
      } else {
        setEpisodes(prev => [...prev, ...(res.data.data || [])])
      }
      setHasMoreEps(res.data.pagination?.has_next_page || false)
      setEpisodePage(page)
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingEps(false)
    }
  }

  const rateEpisode = (epNum, rating) => {
    const updated = { ...episodeRatings, [epNum]: rating }
    setEpisodeRatings(updated)
    localStorage.setItem(`ep_ratings_${initialAnime?.mal_id}`, JSON.stringify(updated))
  }

  const saveNote = () => {
    onNote && onNote(anime, note)
  }

  const trailerUrl = anime?.trailer?.embed_url

  const bg = isDark
    ? "linear-gradient(135deg, #020818 0%, #0a0f2e 100%)"
    : "linear-gradient(135deg, #fff0f5 0%, #ffe4ed 100%)"

  const tabStyle = (active) => ({
    padding: "10px clamp(10px, 2vw, 18px)",
    borderRadius: "10px 10px 0 0",
    border: "none",
    cursor: "pointer",
    fontSize: "clamp(11px, 1.5vw, 13px)",
    fontWeight: "600",
    whiteSpace: "nowrap",
    background: active
      ? isDark ? "rgba(200,168,233,0.2)" : "rgba(233,30,140,0.1)"
      : "transparent",
    color: active
      ? isDark ? "#e8d5f5" : "#e91e8c"
      : isDark ? "#9b7fbf" : "#f06292",
    borderBottom: active
      ? `2px solid ${isDark ? "#c8a8e9" : "#e91e8c"}`
      : "2px solid transparent",
    transition: "all 0.3s",
  })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed", inset: 0,
        zIndex: 1000,
        background: "rgba(0,0,0,0.88)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        overflowY: "auto",
        padding: "clamp(12px, 3vw, 40px)",
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        onClick={e => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "920px",
          background: bg,
          borderRadius: "24px",
          overflow: "hidden",
          border: isDark ? "1px solid rgba(200,168,233,0.2)" : "1px solid rgba(233,30,140,0.2)",
          boxShadow: isDark ? "0 0 80px rgba(200,168,233,0.15)" : "0 0 80px rgba(233,30,140,0.1)",
          marginBottom: "40px",
        }}
      >
        {/* Hero */}
        <div style={{ position: "relative", height: "clamp(200px, 35vw, 360px)" }}>
          {showTrailer && trailerUrl ? (
            <iframe
              src={trailerUrl}
              style={{ width: "100%", height: "100%", border: "none" }}
              allowFullScreen
              title="Trailer"
            />
          ) : (
            <div style={{ width: "100%", height: "100%", position: "relative" }}>
              <img
                src={anime?.images?.jpg?.large_image_url}
                alt={anime?.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)"
              }} />

              {trailerUrl && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowTrailer(true)}
                  style={{
                    position: "absolute",
                    top: "50%", left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 64, height: 64,
                    borderRadius: "50%",
                    border: "none",
                    background: "rgba(255,255,255,0.92)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    fontSize: "22px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                  }}
                >
                  ▶
                </motion.button>
              )}

              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                padding: "clamp(12px, 3vw, 24px)",
              }}>
                <h1 style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "clamp(16px, 3vw, 30px)",
                  fontWeight: "bold",
                  color: "white",
                  margin: "0 0 8px 0",
                  textShadow: "0 2px 8px rgba(0,0,0,0.8)",
                }}>
                  {anime?.title_english || anime?.title}
                </h1>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                  {anime?.score && (
                    <span style={{ color: "#ffd700", fontWeight: "700", fontSize: "13px" }}>⭐ {anime.score}</span>
                  )}
                  {anime?.year && (
                    <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "12px" }}>📅 {anime.year}</span>
                  )}
                  {anime?.episodes && (
                    <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "12px" }}>🎬 {anime.episodes} eps</span>
                  )}
                  {anime?.duration && (
                    <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "12px" }}>⏱ {anime.duration}</span>
                  )}
                  {anime?.status && (
                    <span style={{
                      padding: "2px 10px", borderRadius: "12px",
                      background: anime.status === "Currently Airing" ? "rgba(76,175,80,0.5)" : "rgba(255,255,255,0.2)",
                      color: "white", fontSize: "11px", fontWeight: "600",
                    }}>
                      {anime.status}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Close */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            style={{
              position: "absolute", top: 12, right: 12,
              width: 36, height: 36, borderRadius: "50%",
              border: "none", background: "rgba(0,0,0,0.65)",
              color: "white", fontSize: "16px",
              cursor: "pointer", display: "flex",
              alignItems: "center", justifyContent: "center",
              backdropFilter: "blur(10px)", zIndex: 10,
            }}
          >
            ✕
          </motion.button>
        </div>

        {/* Action buttons */}
        <div style={{
          padding: "clamp(10px, 2vw, 16px) clamp(14px, 3vw, 24px)",
          display: "flex", gap: 8, flexWrap: "wrap",
          borderBottom: isDark ? "1px solid rgba(200,168,233,0.1)" : "1px solid rgba(233,30,140,0.1)",
          alignItems: "center",
        }}>
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => onAdd && onAdd(anime)}
            style={{
              padding: "8px 16px", borderRadius: "16px", border: "none",
              background: isInWatchlist
                ? isDark ? "rgba(200,168,233,0.35)" : "rgba(233,30,140,0.25)"
                : isDark ? "rgba(200,168,233,0.15)" : "rgba(233,30,140,0.1)",
              color: isDark ? "#e8d5f5" : "#e91e8c",
              fontSize: "12px", fontWeight: "700", cursor: "pointer",
            }}
          >
            {isInWatchlist ? "✓ In Watchlist" : "+ Watchlist"}
          </motion.button>

          {trailerUrl && !showTrailer && (
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setShowTrailer(true)}
              style={{
                padding: "8px 16px", borderRadius: "16px", border: "none",
                background: "rgba(255,213,79,0.2)",
                color: "#ffd700", fontSize: "12px", fontWeight: "700", cursor: "pointer",
              }}
            >
              ▶ Watch Trailer
            </motion.button>
          )}

          {showTrailer && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setShowTrailer(false)}
              style={{
                padding: "8px 16px", borderRadius: "16px", border: "none",
                background: "rgba(255,100,100,0.2)",
                color: "#ff6b6b", fontSize: "12px", fontWeight: "700", cursor: "pointer",
              }}
            >
              ✕ Close Trailer
            </motion.button>
          )}

          {/* Rate button */}
          <div style={{ position: "relative" }}>
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setShowRatingMenu(!showRatingMenu)}
              style={{
                padding: "8px 16px", borderRadius: "16px", border: "none",
                background: isDark ? "rgba(255,213,79,0.15)" : "rgba(255,152,0,0.15)",
                color: "#ffd700", fontSize: "12px", fontWeight: "700", cursor: "pointer",
              }}
            >
              {userRating ? `${ratings.find(r => r.label === userRating)?.emoji} ${userRating}` : "★ Rate"}
            </motion.button>
            <AnimatePresence>
              {showRatingMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  style={{
                    position: "absolute", top: "110%", left: 0,
                    zIndex: 50, minWidth: "160px",
                    background: isDark ? "rgba(10,5,40,0.98)" : "rgba(255,240,245,0.98)",
                    borderRadius: "12px", padding: "8px",
                    border: isDark ? "1px solid rgba(200,168,233,0.3)" : "1px solid rgba(233,30,140,0.2)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                  }}
                >
                  {ratings.map(r => (
                    <motion.button
                      key={r.label}
                      whileHover={{ x: 4 }}
                      onClick={() => { onRate && onRate(anime, r.label); setShowRatingMenu(false) }}
                      style={{
                        display: "flex", alignItems: "center", gap: 8,
                        width: "100%", padding: "8px 10px",
                        borderRadius: "8px", border: "none",
                        background: "transparent", color: r.color,
                        fontSize: "13px", fontWeight: "600", cursor: "pointer",
                        textAlign: "left",
                      }}
                    >
                      {r.emoji} {r.label}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Genres */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {anime?.genres?.map(g => (
              <span key={g.mal_id} style={{
                padding: "5px 12px", borderRadius: "12px",
                background: isDark ? "rgba(200,168,233,0.1)" : "rgba(233,30,140,0.08)",
                color: isDark ? "#c8a8e9" : "#e91e8c",
                fontSize: "11px", fontWeight: "600",
              }}>
                {g.name}
              </span>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex", gap: 2,
          padding: "0 clamp(14px, 3vw, 24px)",
          borderBottom: isDark ? "1px solid rgba(200,168,233,0.1)" : "1px solid rgba(233,30,140,0.1)",
          overflowX: "auto",
          scrollbarWidth: "none",
        }}>
          {["overview", "characters", "episodes", "my notes"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={tabStyle(activeTab === tab)}>
              {tab === "overview" && "📖 "}
              {tab === "characters" && "👥 "}
              {tab === "episodes" && "🎬 "}
              {tab === "my notes" && "📝 "}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ padding: "clamp(14px, 3vw, 24px)", minHeight: "300px" }}>
          <AnimatePresence mode="wait">

            {/* Overview tab */}
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <div style={{ display: "flex", gap: "clamp(14px, 3vw, 24px)", flexWrap: "wrap" }}>
                  <img
                    src={anime?.images?.jpg?.large_image_url}
                    alt={anime?.title}
                    style={{
                      width: "clamp(90px, 12vw, 140px)",
                      borderRadius: "12px", flexShrink: 0,
                      boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                      alignSelf: "flex-start",
                    }}
                  />
                  <div style={{ flex: 1, minWidth: "200px" }}>
                    {/* Stats */}
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
                      gap: 10, marginBottom: 16,
                    }}>
                      {[
                        { label: "Score", value: anime?.score || "N/A", emoji: "⭐" },
                        { label: "Ranked", value: anime?.rank ? `#${anime.rank}` : "N/A", emoji: "🏆" },
                        { label: "Popularity", value: anime?.popularity ? `#${anime.popularity}` : "N/A", emoji: "📊" },
                        { label: "Members", value: anime?.members ? `${(anime.members / 1000).toFixed(0)}K` : "N/A", emoji: "👥" },
                        { label: "Episodes", value: anime?.episodes || "?", emoji: "🎬" },
                        { label: "Type", value: anime?.type || "N/A", emoji: "📺" },
                        { label: "Season", value: anime?.season ? `${anime.season} ${anime.year}` : "N/A", emoji: "🗓️" },
                        { label: "Studio", value: anime?.studios?.[0]?.name || "N/A", emoji: "🏢" },
                      ].map((stat, i) => (
                        <div key={i} style={{
                          padding: "10px 12px", borderRadius: "12px",
                          background: isDark ? "rgba(200,168,233,0.08)" : "rgba(233,30,140,0.06)",
                          border: isDark ? "1px solid rgba(200,168,233,0.1)" : "1px solid rgba(233,30,140,0.1)",
                        }}>
                          <div style={{ fontSize: "16px", marginBottom: 3 }}>{stat.emoji}</div>
                          <div style={{
                            color: isDark ? "#e8d5f5" : "#c2185b",
                            fontSize: "clamp(11px, 1.5vw, 13px)",
                            fontWeight: "700",
                          }}>
                            {stat.value}
                          </div>
                          <div style={{
                            color: isDark ? "#9b7fbf" : "#f06292",
                            fontSize: "10px",
                          }}>
                            {stat.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Synopsis */}
                    <h3 style={{
                      fontFamily: "Georgia, serif",
                      color: isDark ? "#e8d5f5" : "#c2185b",
                      fontSize: "clamp(13px, 1.8vw, 16px)",
                      margin: "0 0 10px 0",
                    }}>
                      Synopsis
                    </h3>
                    <p style={{
                      color: isDark ? "rgba(232,213,245,0.85)" : "#8b0040",
                      fontSize: "clamp(12px, 1.5vw, 14px)",
                      lineHeight: 1.7,
                      margin: 0,
                    }}>
                      {anime?.synopsis || "No synopsis available."}
                    </p>

                    {/* Streaming */}
                    {anime?.streaming?.length > 0 && (
                      <div style={{ marginTop: 16 }}>
                        <h3 style={{
                          fontFamily: "Georgia, serif",
                          color: isDark ? "#e8d5f5" : "#c2185b",
                          fontSize: "clamp(13px, 1.8vw, 16px)",
                          margin: "0 0 10px 0",
                        }}>
                          📺 Where to Watch
                        </h3>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          {anime.streaming.map((s, i) => (
                            <a
                              key={i}
                              href={s.url}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                padding: "6px 14px", borderRadius: "12px",
                                background: isDark ? "rgba(200,168,233,0.15)" : "rgba(233,30,140,0.1)",
                                color: isDark ? "#c8a8e9" : "#e91e8c",
                                fontSize: "12px", fontWeight: "600",
                                textDecoration: "none",
                              }}
                            >
                              {s.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Characters tab */}
            {activeTab === "characters" && (
              <motion.div
                key="characters"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {characters.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px", color: isDark ? "#9b7fbf" : "#f06292" }}>
                    Loading characters...
                  </div>
                ) : (
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(clamp(100px, 12vw, 140px), 1fr))",
                    gap: "clamp(10px, 2vw, 16px)",
                  }}>
                    {characters.map((char, i) => (
                      <motion.div
                        key={char.character.mal_id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.04 }}
                        whileHover={{ scale: 1.05, y: -4 }}
                        style={{
                          borderRadius: "12px",
                          overflow: "hidden",
                          background: isDark ? "rgba(200,168,233,0.08)" : "rgba(233,30,140,0.06)",
                          border: isDark ? "1px solid rgba(200,168,233,0.12)" : "1px solid rgba(233,30,140,0.12)",
                        }}
                      >
                        <img
                          src={char.character.images?.jpg?.image_url}
                          alt={char.character.name}
                          style={{ width: "100%", aspectRatio: "3/4", objectFit: "cover" }}
                        />
                        <div style={{ padding: "8px" }}>
                          <p style={{
                            color: isDark ? "#e8d5f5" : "#c2185b",
                            fontSize: "clamp(10px, 1.2vw, 12px)",
                            fontWeight: "700", margin: "0 0 3px 0",
                            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                          }}>
                            {char.character.name}
                          </p>
                          <p style={{
                            color: isDark ? "#9b7fbf" : "#f06292",
                            fontSize: "10px", margin: 0,
                          }}>
                            {char.role}
                          </p>
                          {char.voice_actors?.[0] && (
                            <p style={{
                              color: isDark ? "#7b6090" : "#f48fb1",
                              fontSize: "9px", margin: "2px 0 0 0",
                            }}>
                              🎙 {char.voice_actors[0].person.name}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Episodes tab */}
            {activeTab === "episodes" && (
              <motion.div
                key="episodes"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {episodes.length === 0 && !loadingEps ? (
                  <div style={{ textAlign: "center", padding: "40px", color: isDark ? "#9b7fbf" : "#f06292" }}>
                    No episode data available for this anime.
                  </div>
                ) : (
                  <>
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(clamp(100px, 14vw, 160px), 1fr))",
                      gap: "clamp(8px, 1.5vw, 12px)",
                    }}>
                      {episodes.map((ep, i) => (
                        <motion.div
                          key={ep.mal_id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: Math.min(i * 0.02, 0.3) }}
                          onHoverStart={() => setHoveredEp(ep.mal_id)}
                          onHoverEnd={() => setHoveredEp(null)}
                          style={{
                            padding: "clamp(8px, 1.5vw, 12px)",
                            borderRadius: "12px",
                            border: episodeRatings[ep.mal_id]
                              ? `2px solid ${isDark ? "#c8a8e9" : "#e91e8c"}`
                              : isDark ? "1px solid rgba(200,168,233,0.12)" : "1px solid rgba(233,30,140,0.12)",
                            background: episodeRatings[ep.mal_id]
                              ? isDark ? "rgba(200,168,233,0.12)" : "rgba(233,30,140,0.08)"
                              : isDark ? "rgba(200,168,233,0.05)" : "rgba(233,30,140,0.04)",
                            cursor: "pointer",
                            position: "relative",
                            transition: "all 0.2s",
                          }}
                        >
                          <div style={{
                            color: isDark ? "#c8a8e9" : "#e91e8c",
                            fontSize: "10px", fontWeight: "700", marginBottom: 4,
                          }}>
                            EP {ep.mal_id}
                          </div>
                          <div style={{
                            color: isDark ? "#e8d5f5" : "#c2185b",
                            fontSize: "clamp(9px, 1.1vw, 11px)",
                            fontWeight: "600",
                            overflow: "hidden", textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            lineHeight: 1.4,
                            marginBottom: 6,
                          }}>
                            {ep.title || `Episode ${ep.mal_id}`}
                          </div>

                          {/* Episode score */}
                          {ep.score && (
                            <div style={{ color: "#ffd700", fontSize: "10px", marginBottom: 4 }}>
                              ⭐ {ep.score}
                            </div>
                          )}

                          {/* My rating */}
                          {episodeRatings[ep.mal_id] && (
                            <div style={{
                              color: isDark ? "#c8a8e9" : "#e91e8c",
                              fontSize: "10px", fontWeight: "700",
                            }}>
                              My: {episodeRatings[ep.mal_id]}/10
                            </div>
                          )}

                          {/* Rate on hover */}
                          <AnimatePresence>
                            {hoveredEp === ep.mal_id && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                style={{
                                  position: "absolute", inset: 0,
                                  borderRadius: "12px",
                                  background: isDark ? "rgba(10,5,40,0.95)" : "rgba(255,240,245,0.95)",
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  gap: 4,
                                  padding: "6px",
                                }}
                              >
                                <p style={{
                                  color: isDark ? "#c8a8e9" : "#e91e8c",
                                  fontSize: "9px", fontWeight: "700", margin: 0,
                                }}>
                                  Rate EP {ep.mal_id}
                                </p>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "center" }}>
                                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(r => (
                                    <motion.button
                                      key={r}
                                      whileHover={{ scale: 1.2 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => rateEpisode(ep.mal_id, r)}
                                      style={{
                                        width: 20, height: 20,
                                        borderRadius: "50%",
                                        border: "none",
                                        background: episodeRatings[ep.mal_id] === r
                                          ? isDark ? "#c8a8e9" : "#e91e8c"
                                          : isDark ? "rgba(200,168,233,0.2)" : "rgba(233,30,140,0.15)",
                                        color: episodeRatings[ep.mal_id] === r
                                          ? "white"
                                          : isDark ? "#c8a8e9" : "#e91e8c",
                                        fontSize: "9px",
                                        fontWeight: "700",
                                        cursor: "pointer",
                                      }}
                                    >
                                      {r}
                                    </motion.button>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      ))}

                      {/* Load more episodes */}
                      {hasMoreEps && (
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => loadEpisodes(episodePage + 1)}
                          style={{
                            padding: "clamp(8px, 1.5vw, 12px)",
                            borderRadius: "12px",
                            border: isDark ? "2px dashed rgba(200,168,233,0.3)" : "2px dashed rgba(233,30,140,0.3)",
                            background: "transparent",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            gap: 4,
                            minHeight: "80px",
                          }}
                        >
                          {loadingEps ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              style={{
                                width: 24, height: 24,
                                border: isDark ? "2px solid rgba(200,168,233,0.3)" : "2px solid rgba(233,30,140,0.3)",
                                borderTop: isDark ? "2px solid #c8a8e9" : "2px solid #e91e8c",
                                borderRadius: "50%",
                              }}
                            />
                          ) : (
                            <>
                              <span style={{ color: isDark ? "#c8a8e9" : "#e91e8c", fontSize: "20px" }}>+</span>
                              <span style={{ color: isDark ? "#c8a8e9" : "#e91e8c", fontSize: "10px", fontWeight: "700" }}>
                                More
                              </span>
                            </>
                          )}
                        </motion.div>
                      )}
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {/* My Notes tab */}
            {activeTab === "my notes" && (
              <motion.div
                key="notes"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <h3 style={{
                  fontFamily: "Georgia, serif",
                  color: isDark ? "#e8d5f5" : "#c2185b",
                  fontSize: "clamp(14px, 2vw, 18px)",
                  margin: "0 0 16px 0",
                }}>
                  📝 How did you feel about {anime?.title_english || anime?.title}?
                </h3>

                <textarea
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Write your thoughts, feelings, favorite moments, what moved you..."
                  rows={8}
                  style={{
                    width: "100%",
                    padding: "clamp(12px, 2vw, 16px)",
                    borderRadius: "16px",
                    border: isDark ? "1px solid rgba(200,168,233,0.3)" : "1px solid rgba(233,30,140,0.3)",
                    background: isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.6)",
                    color: isDark ? "#e8d5f5" : "#8b0040",
                    fontSize: "clamp(13px, 1.5vw, 15px)",
                    resize: "vertical",
                    outline: "none",
                    fontFamily: "Georgia, serif",
                    lineHeight: 1.7,
                    boxSizing: "border-box",
                  }}
                />

                <div style={{ display: "flex", gap: 10, marginTop: 12, justifyContent: "flex-end" }}>
                  <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={saveNote}
                    style={{
                      padding: "10px 24px", borderRadius: "14px", border: "none",
                      background: isDark
                        ? "linear-gradient(135deg, #7b1fa2, #c8a8e9)"
                        : "linear-gradient(135deg, #e91e8c, #f48fb1)",
                      color: "white", fontSize: "13px", fontWeight: "700",
                      cursor: "pointer", fontFamily: "Georgia, serif",
                    }}
                  >
                    Save Note ✦
                  </motion.button>
                </div>

                {userNote && (
                  <div style={{
                    marginTop: 20, padding: "clamp(12px, 2vw, 16px)",
                    borderRadius: "14px",
                    background: isDark ? "rgba(200,168,233,0.08)" : "rgba(233,30,140,0.06)",
                    border: isDark ? "1px solid rgba(200,168,233,0.15)" : "1px solid rgba(233,30,140,0.15)",
                  }}>
                    <p style={{
                      color: isDark ? "#9b7fbf" : "#f06292",
                      fontSize: "11px", fontWeight: "700",
                      margin: "0 0 8px 0", textTransform: "uppercase", letterSpacing: "1px",
                    }}>
                      Previously saved:
                    </p>
                    <p style={{
                      color: isDark ? "#e8d5f5" : "#8b0040",
                      fontSize: "clamp(12px, 1.5vw, 14px)",
                      fontStyle: "italic", lineHeight: 1.6, margin: 0,
                    }}>
                      "{userNote}"
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}
