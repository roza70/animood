import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "../context/ThemeContext"
import { getAnimeById, getAnimeCharacters, getAnimeEpisodes, getAnimeRelations } from "../api/jikan"

export default function AnimeDetail({ anime: initialAnime, onClose, onAdd, onRate, onNote, onCardClick, isInWatchlist, userNote, userRating }) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  // Current anime being viewed (can switch seasons)
  const [anime, setAnime] = useState(initialAnime)
  const [currentId, setCurrentId] = useState(initialAnime?.mal_id)

  // All seasons list
  const [seasons, setSeasons] = useState([])
  const [loadingSeasons, setLoadingSeasons] = useState(true)

  // Tabs content
  const [characters, setCharacters] = useState([])
  const [episodes, setEpisodes] = useState([])
  const [episodePage, setEpisodePage] = useState(1)
  const [hasMoreEps, setHasMoreEps] = useState(false)
  const [loadingEps, setLoadingEps] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  // Episode ratings per anime
  const [episodeRatings, setEpisodeRatings] = useState({})
  const [editingEp, setEditingEp] = useState(null)
  const [editRatingValue, setEditRatingValue] = useState("")

  // Trailer / rating UI
  const [showTrailer, setShowTrailer] = useState(false)
  const [showRatingMenu, setShowRatingMenu] = useState(false)
  const [note, setNote] = useState(userNote || "")

  const RATINGS = [
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

  // On first open — load full info + all seasons
  useEffect(() => {
    loadAnimeData(initialAnime.mal_id)
    loadAllSeasons(initialAnime.mal_id)
  }, [initialAnime.mal_id])

  // Reload when user switches season
  useEffect(() => {
    if (currentId === initialAnime.mal_id) return
    loadAnimeData(currentId)
  }, [currentId])

  const loadAnimeData = async (id) => {
    setActiveTab("overview")
    setShowTrailer(false)
    setCharacters([])
    setEpisodes([])
    setEpisodePage(1)
    setEpisodeRatings(() => {
      try { return JSON.parse(localStorage.getItem(`ep_ratings_${id}`) || "{}") }
      catch { return {} }
    })
    try {
      const [fullRes, charRes] = await Promise.all([
        getAnimeById(id),
        getAnimeCharacters(id),
      ])
      setAnime(fullRes.data.data)
      setCharacters(charRes.data.data?.slice(0, 24) || [])
    } catch (err) { console.error(err) }
    loadEps(id, 1)
  }

  // Build full seasons list from relations
  const loadAllSeasons = async (rootId) => {
    setLoadingSeasons(true)
    try {
      const relRes = await getAnimeRelations(rootId)
      const related = relRes.data.data || []

      // Get sequel/prequel entries
      const sequels = related
        .filter(r => ["Sequel", "Prequel"].includes(r.relation))
        .flatMap(r => r.entry.filter(e => e.type === "anime").map(e => ({ ...e, relation: r.relation })))

      // Also get side stories and alternatives
      const others = related
        .filter(r => ["Side story", "Alternative version", "Other", "Summary"].includes(r.relation))
        .flatMap(r => r.entry.filter(e => e.type === "anime").map(e => ({ ...e, relation: r.relation })))

      // Current anime is always first
      const rootRes = await getAnimeById(rootId)
      const rootAnime = rootRes.data.data

      // Build ordered list: prequels first, then current, then sequels
      const prequels = sequels.filter(s => s.relation === "Prequel").reverse()
      const sequeList = sequels.filter(s => s.relation === "Sequel")

      const allSeasons = [
        ...prequels.map((s, i) => ({ mal_id: s.mal_id, name: s.name, label: `Season ${i + 1}` })),
        { mal_id: rootId, name: rootAnime.title_english || rootAnime.title, label: `Season ${prequels.length + 1}` },
        ...sequeList.map((s, i) => ({ mal_id: s.mal_id, name: s.name, label: `Season ${prequels.length + 2 + i}` })),
        ...others.map(s => ({ mal_id: s.mal_id, name: s.name, label: s.relation })),
      ]

      setSeasons(allSeasons)
    } catch (err) {
      console.error(err)
      setSeasons([{ mal_id: rootId, name: initialAnime.title, label: "Season 1" }])
    }
    setLoadingSeasons(false)
  }

  const loadEps = async (id, page) => {
    try {
      setLoadingEps(true)
      const res = await getAnimeEpisodes(id, page)
      if (page === 1) setEpisodes(res.data.data || [])
      else setEpisodes(prev => [...prev, ...(res.data.data || [])])
      setHasMoreEps(res.data.pagination?.has_next_page || false)
      setEpisodePage(page)
    } catch (err) { console.error(err) }
    finally { setLoadingEps(false) }
  }

  const switchSeason = (season) => {
    if (season.mal_id === currentId) return
    setCurrentId(season.mal_id)
  }

  const saveEpRating = (epNum, val) => {
    const num = parseInt(val)
    if (isNaN(num) || num < 1 || num > 10) return
    const updated = { ...episodeRatings, [epNum]: num }
    setEpisodeRatings(updated)
    try { localStorage.setItem(`ep_ratings_${currentId}`, JSON.stringify(updated)) }
    catch (e) { console.error(e) }
    setEditingEp(null)
    setEditRatingValue("")
  }

  const saveNote = () => { onNote && onNote(anime, note) }

  const rawTrailer = anime?.trailer?.embed_url
  const trailerUrl = rawTrailer
    ? rawTrailer.replace(/\?.*/, "") + "?autoplay=1&rel=0&modestbranding=1"
    : null

  const bg = isDark ? "#020818" : "#f5ede8"

  const tabStyle = (active) => ({
    padding: "10px clamp(10px, 2vw, 18px)",
    borderRadius: "10px 10px 0 0",
    border: "none", cursor: "pointer",
    fontSize: "clamp(11px, 1.5vw, 13px)", fontWeight: "600",
    whiteSpace: "nowrap",
    background: active ? isDark ? "rgba(200,168,233,0.2)" : "rgba(160,100,120,0.1)" : "transparent",
    color: active ? isDark ? "#e8d5f5" : "#8a4060" : isDark ? "#9b7fbf" : "#a06080",
    borderBottom: active ? `2px solid ${isDark ? "#c8a8e9" : "#c06080"}` : "2px solid transparent",
    transition: "all 0.3s",
  })

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.88)", backdropFilter: "blur(8px)", display: "flex", alignItems: "flex-start", justifyContent: "center", overflowY: "auto", padding: "clamp(12px, 3vw, 40px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        onClick={e => e.stopPropagation()}
        style={{ width: "100%", maxWidth: "940px", background: bg, borderRadius: "24px", overflow: "hidden", border: isDark ? "1px solid rgba(200,168,233,0.2)" : "1px solid rgba(180,120,140,0.2)", boxShadow: isDark ? "0 0 80px rgba(200,168,233,0.15)" : "0 0 80px rgba(180,120,140,0.15)", marginBottom: "40px" }}
      >
        {/* ── SEASONS SELECTOR ── */}
        {seasons.length > 1 && (
          <div style={{ padding: "12px 20px", borderBottom: isDark ? "1px solid rgba(200,168,233,0.1)" : "1px solid rgba(180,120,140,0.12)", background: isDark ? "rgba(255,255,255,0.02)" : "rgba(160,100,120,0.03)" }}>
            <p style={{ color: isDark ? "#9b7fbf" : "#a06080", fontSize: "11px", fontWeight: "700", margin: "0 0 10px 0", textTransform: "uppercase", letterSpacing: "1px" }}>
              📺 All Seasons & Entries
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {seasons.map(s => (
                <motion.button
                  key={s.mal_id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => switchSeason(s)}
                  style={{
                    padding: "7px 16px", borderRadius: "20px", border: "none",
                    cursor: "pointer", fontSize: "12px", fontWeight: "700",
                    background: currentId === s.mal_id
                      ? isDark ? "linear-gradient(135deg,#7b1fa2,#c8a8e9)" : "linear-gradient(135deg,#c06080,#e8a0b8)"
                      : isDark ? "rgba(200,168,233,0.1)" : "rgba(160,100,120,0.08)",
                    color: currentId === s.mal_id ? "white" : isDark ? "#c8a8e9" : "#8a4060",
                    boxShadow: currentId === s.mal_id ? isDark ? "0 4px 14px rgba(200,168,233,0.35)" : "0 4px 14px rgba(192,96,128,0.35)" : "none",
                    transition: "all 0.2s",
                  }}
                >
                  {s.label}
                </motion.button>
              ))}
              {loadingSeasons && (
                <div style={{ color: isDark ? "#9b7fbf" : "#a06080", fontSize: "12px", display: "flex", alignItems: "center" }}>Loading seasons...</div>
              )}
            </div>
          </div>
        )}

        {/* ── HERO ── */}
        <div style={{ position: "relative", height: "clamp(200px, 35vw, 340px)", background: "#000", overflow: "hidden" }}>
          {trailerUrl && (
            <div style={{ position: "absolute", inset: 0, opacity: showTrailer ? 1 : 0, pointerEvents: showTrailer ? "all" : "none", transition: "opacity 0.3s", zIndex: 2 }}>
              <iframe src={showTrailer ? trailerUrl : "about:blank"} style={{ width: "100%", height: "100%", border: "none" }} allowFullScreen allow="autoplay; encrypted-media; picture-in-picture" title="Trailer" />
            </div>
          )}
          <div style={{ position: "absolute", inset: 0, opacity: showTrailer ? 0 : 1, transition: "opacity 0.3s", zIndex: 1 }}>
            <img src={anime?.images?.jpg?.large_image_url} alt={anime?.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(0,0,0,0.92) 0%,rgba(0,0,0,0.3) 50%,transparent 100%)" }} />
            {trailerUrl && !showTrailer && (
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setShowTrailer(true)}
                style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 60, height: 60, borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.9)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "20px", boxShadow: "0 4px 20px rgba(0,0,0,0.5)", zIndex: 3 }}>▶</motion.button>
            )}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "clamp(12px,3vw,24px)", zIndex: 3 }}>
              <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(14px,3vw,28px)", fontWeight: "bold", color: "white", margin: "0 0 8px 0", textShadow: "0 2px 8px rgba(0,0,0,0.8)", lineHeight: 1.2, wordBreak: "break-word" }}>
                {anime?.title_english || anime?.title}
              </h1>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                {anime?.score && <span style={{ color: "#ffd700", fontWeight: "700", fontSize: "13px" }}>⭐ {anime.score}</span>}
                {anime?.year && <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "12px" }}>📅 {anime.year}</span>}
                {anime?.episodes && <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "12px" }}>🎬 {anime.episodes} eps</span>}
                {anime?.status && <span style={{ padding: "2px 10px", borderRadius: "12px", background: anime.status === "Currently Airing" ? "rgba(76,175,80,0.5)" : "rgba(255,255,255,0.2)", color: "white", fontSize: "11px", fontWeight: "600" }}>{anime.status}</span>}
              </div>
            </div>
          </div>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onClose}
            style={{ position: "absolute", top: 12, right: 12, width: 36, height: 36, borderRadius: "50%", border: "none", background: "rgba(0,0,0,0.7)", color: "white", fontSize: "16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}>✕</motion.button>
        </div>

        {/* ── ACTION BUTTONS ── */}
        <div style={{ padding: "clamp(10px,2vw,16px) clamp(14px,3vw,24px)", display: "flex", gap: 8, flexWrap: "wrap", borderBottom: isDark ? "1px solid rgba(200,168,233,0.1)" : "1px solid rgba(180,120,140,0.15)", alignItems: "center" }}>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => onAdd && onAdd(anime)}
            style={{ padding: "8px 16px", borderRadius: "16px", border: "none", background: isInWatchlist ? isDark ? "rgba(200,168,233,0.35)" : "rgba(160,100,120,0.25)" : isDark ? "rgba(200,168,233,0.15)" : "rgba(160,100,120,0.1)", color: isDark ? "#e8d5f5" : "#8a4060", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}>
            {isInWatchlist ? "✓ In Watchlist" : "+ Watchlist"}
          </motion.button>

          {trailerUrl && (
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowTrailer(v => !v)}
              style={{ padding: "8px 16px", borderRadius: "16px", border: "none", background: showTrailer ? "rgba(255,100,100,0.2)" : "rgba(255,213,79,0.2)", color: showTrailer ? "#ff6b6b" : "#ffd700", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}>
              {showTrailer ? "✕ Close Trailer" : "▶ Watch Trailer"}
            </motion.button>
          )}

          <div style={{ position: "relative" }}>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowRatingMenu(!showRatingMenu)}
              style={{ padding: "8px 16px", borderRadius: "16px", border: "none", background: isDark ? "rgba(255,213,79,0.15)" : "rgba(255,152,0,0.12)", color: "#ffd700", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}>
              {userRating ? `${RATINGS.find(r => r.label === userRating)?.emoji} ${userRating}` : "★ Rate"}
            </motion.button>
            <AnimatePresence>
              {showRatingMenu && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                  style={{ position: "absolute", top: "110%", left: 0, zIndex: 50, minWidth: "160px", background: isDark ? "rgba(10,5,40,0.98)" : "rgba(255,245,248,0.98)", borderRadius: "12px", padding: "8px", border: isDark ? "1px solid rgba(200,168,233,0.3)" : "1px solid rgba(180,120,140,0.2)", boxShadow: "0 8px 24px rgba(0,0,0,0.3)" }}>
                  {RATINGS.map(r => (
                    <button key={r.label} onClick={() => { onRate && onRate(anime, r.label); setShowRatingMenu(false) }}
                      style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 10px", borderRadius: "8px", border: "none", background: "transparent", color: r.color, fontSize: "13px", fontWeight: "600", cursor: "pointer", textAlign: "left" }}>
                      {r.emoji} {r.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {anime?.genres?.map(g => (
              <span key={g.mal_id} style={{ padding: "5px 12px", borderRadius: "12px", background: isDark ? "rgba(200,168,233,0.1)" : "rgba(160,100,120,0.08)", color: isDark ? "#c8a8e9" : "#8a4060", fontSize: "11px", fontWeight: "600" }}>{g.name}</span>
            ))}
          </div>
        </div>

        {/* ── TABS ── */}
        <div style={{ display: "flex", gap: 2, padding: "0 clamp(14px,3vw,24px)", borderBottom: isDark ? "1px solid rgba(200,168,233,0.1)" : "1px solid rgba(180,120,140,0.15)", overflowX: "auto", scrollbarWidth: "none" }}>
          {["overview", "characters", "episodes", "my notes"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={tabStyle(activeTab === tab)}>
              {tab === "overview" && "📖 "}{tab === "characters" && "👥 "}{tab === "episodes" && "🎬 "}{tab === "my notes" && "📝 "}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* ── TAB CONTENT ── */}
        <div style={{ padding: "clamp(14px,3vw,24px)", minHeight: "300px" }}>
          <AnimatePresence mode="wait">

            {/* Overview */}
            {activeTab === "overview" && (
              <motion.div key={`overview-${currentId}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div style={{ display: "flex", gap: "clamp(14px,3vw,24px)", flexWrap: "wrap" }}>
                  <img src={anime?.images?.jpg?.large_image_url} alt={anime?.title} style={{ width: "clamp(90px,12vw,140px)", borderRadius: "12px", flexShrink: 0, boxShadow: "0 8px 24px rgba(0,0,0,0.3)", alignSelf: "flex-start" }} />
                  <div style={{ flex: 1, minWidth: "200px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(110px,1fr))", gap: 10, marginBottom: 16 }}>
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
                        <div key={i} style={{ padding: "10px 12px", borderRadius: "12px", background: isDark ? "rgba(200,168,233,0.08)" : "rgba(160,100,120,0.06)", border: isDark ? "1px solid rgba(200,168,233,0.1)" : "1px solid rgba(180,120,140,0.12)" }}>
                          <div style={{ fontSize: "16px", marginBottom: 3 }}>{stat.emoji}</div>
                          <div style={{ color: isDark ? "#e8d5f5" : "#6a3050", fontSize: "clamp(11px,1.5vw,13px)", fontWeight: "700" }}>{stat.value}</div>
                          <div style={{ color: isDark ? "#9b7fbf" : "#a06080", fontSize: "10px" }}>{stat.label}</div>
                        </div>
                      ))}
                    </div>
                    <h3 style={{ fontFamily: "Georgia,serif", color: isDark ? "#e8d5f5" : "#6a3050", fontSize: "clamp(13px,1.8vw,16px)", margin: "0 0 10px 0" }}>Synopsis</h3>
                    <p style={{ color: isDark ? "rgba(232,213,245,0.85)" : "#5a3050", fontSize: "clamp(12px,1.5vw,14px)", lineHeight: 1.7, margin: 0 }}>{anime?.synopsis || "No synopsis available."}</p>
                    {anime?.streaming?.length > 0 && (
                      <div style={{ marginTop: 16 }}>
                        <h3 style={{ fontFamily: "Georgia,serif", color: isDark ? "#e8d5f5" : "#6a3050", fontSize: "clamp(13px,1.8vw,16px)", margin: "0 0 10px 0" }}>📺 Where to Watch</h3>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          {anime.streaming.map((s, i) => (
                            <a key={i} href={s.url} target="_blank" rel="noreferrer" style={{ padding: "6px 14px", borderRadius: "12px", background: isDark ? "rgba(200,168,233,0.15)" : "rgba(160,100,120,0.1)", color: isDark ? "#c8a8e9" : "#8a4060", fontSize: "12px", fontWeight: "600", textDecoration: "none" }}>{s.name}</a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Characters */}
            {activeTab === "characters" && (
              <motion.div key={`chars-${currentId}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {characters.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px", color: isDark ? "#9b7fbf" : "#a06080" }}>Loading characters...</div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {characters.map((char, i) => (
                      <motion.div key={char.character.mal_id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                        style={{ display: "flex", gap: 14, alignItems: "center", padding: "12px 16px", borderRadius: "14px", background: isDark ? "rgba(200,168,233,0.06)" : "rgba(160,100,120,0.04)", border: isDark ? "1px solid rgba(200,168,233,0.1)" : "1px solid rgba(180,120,140,0.12)" }}>
                        <img src={char.character.images?.jpg?.image_url} alt={char.character.name} style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: isDark ? "2px solid rgba(200,168,233,0.3)" : "2px solid rgba(180,120,140,0.3)" }} />
                        <div style={{ flex: 1 }}>
                          <p style={{ color: isDark ? "#e8d5f5" : "#6a3050", fontSize: "clamp(12px,1.5vw,14px)", fontWeight: "700", margin: "0 0 3px 0" }}>{char.character.name}</p>
                          <p style={{ color: isDark ? "#9b7fbf" : "#a06080", fontSize: "11px", margin: "0 0 3px 0" }}>{char.role}</p>
                          {char.voice_actors?.[0] && <p style={{ color: isDark ? "#7b6090" : "#b08090", fontSize: "11px", margin: 0 }}>🎙 {char.voice_actors[0].person.name} ({char.voice_actors[0].language})</p>}
                        </div>
                        {char.favorites > 0 && <div style={{ color: "#ffd700", fontSize: "11px", fontWeight: "700", flexShrink: 0 }}>♥ {char.favorites?.toLocaleString()}</div>}
                        {char.voice_actors?.[0]?.person?.images?.jpg?.image_url && (
                          <img src={char.voice_actors[0].person.images.jpg.image_url} alt={char.voice_actors[0].person.name} style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", flexShrink: 0, opacity: 0.7 }} />
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Episodes */}
            {activeTab === "episodes" && (
              <motion.div key={`eps-${currentId}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {episodes.length === 0 && !loadingEps ? (
                  <div style={{ textAlign: "center", padding: "40px", color: isDark ? "#9b7fbf" : "#a06080" }}>No episode data available.</div>
                ) : (
                  <>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {episodes.map((ep, i) => (
                        <motion.div key={ep.mal_id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: Math.min(i * 0.02, 0.3) }}
                          style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", borderRadius: "12px", background: episodeRatings[ep.mal_id] ? isDark ? "rgba(200,168,233,0.1)" : "rgba(160,100,120,0.07)" : isDark ? "rgba(200,168,233,0.04)" : "rgba(160,100,120,0.03)", border: episodeRatings[ep.mal_id] ? isDark ? "1px solid rgba(200,168,233,0.25)" : "1px solid rgba(180,120,140,0.3)" : isDark ? "1px solid rgba(200,168,233,0.07)" : "1px solid rgba(180,120,140,0.1)" }}>
                          <div style={{ color: isDark ? "#c8a8e9" : "#8a4060", fontSize: "11px", fontWeight: "800", flexShrink: 0, minWidth: 36 }}>EP {ep.mal_id}</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ color: isDark ? "#e8d5f5" : "#5a3050", fontSize: "clamp(12px,1.5vw,13px)", fontWeight: "600", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ep.title || `Episode ${ep.mal_id}`}</div>
                            {ep.score && <div style={{ color: "#ffd700", fontSize: "10px", marginTop: 2 }}>⭐ {ep.score}</div>}
                          </div>
                          {editingEp === ep.mal_id ? (
                            <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                              <input autoFocus type="number" min="1" max="10" value={editRatingValue}
                                onChange={e => setEditRatingValue(e.target.value)}
                                onKeyDown={e => { if (e.key === "Enter") saveEpRating(ep.mal_id, editRatingValue); if (e.key === "Escape") { setEditingEp(null); setEditRatingValue("") } }}
                                placeholder="1-10"
                                style={{ width: 54, padding: "5px 8px", borderRadius: "8px", border: isDark ? "1px solid rgba(200,168,233,0.4)" : "1px solid rgba(180,120,140,0.4)", background: isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.9)", color: isDark ? "#e8d5f5" : "#5a3050", fontSize: "14px", outline: "none", textAlign: "center" }} />
                              <button onClick={() => saveEpRating(ep.mal_id, editRatingValue)}
                                style={{ padding: "5px 10px", borderRadius: "8px", border: "none", background: isDark ? "rgba(200,168,233,0.3)" : "rgba(160,100,120,0.2)", color: isDark ? "#e8d5f5" : "#8a4060", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}>✓</button>
                              <button onClick={() => { setEditingEp(null); setEditRatingValue("") }}
                                style={{ padding: "5px 8px", borderRadius: "8px", border: "none", background: "transparent", color: isDark ? "#9b7fbf" : "#a06080", fontSize: "12px", cursor: "pointer" }}>✕</button>
                            </div>
                          ) : (
                            <button onClick={() => { setEditingEp(ep.mal_id); setEditRatingValue(episodeRatings[ep.mal_id]?.toString() || "") }}
                              style={{ padding: "5px 14px", borderRadius: "10px", border: "none", flexShrink: 0, background: episodeRatings[ep.mal_id] ? isDark ? "rgba(200,168,233,0.2)" : "rgba(160,100,120,0.15)" : isDark ? "rgba(200,168,233,0.07)" : "rgba(160,100,120,0.06)", color: episodeRatings[ep.mal_id] ? isDark ? "#e8d5f5" : "#8a4060" : isDark ? "#9b7fbf" : "#a06080", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}>
                              {episodeRatings[ep.mal_id] ? `${episodeRatings[ep.mal_id]}/10` : "Rate"}
                            </button>
                          )}
                        </motion.div>
                      ))}
                    </div>
                    {hasMoreEps && (
                      <div style={{ textAlign: "center", marginTop: 20 }}>
                        <button onClick={() => loadEps(currentId, episodePage + 1)}
                          style={{ padding: "10px 28px", borderRadius: "20px", border: isDark ? "2px solid rgba(200,168,233,0.3)" : "2px solid rgba(180,120,140,0.3)", background: "transparent", color: isDark ? "#c8a8e9" : "#8a4060", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>
                          {loadingEps ? "Loading..." : "+ Load More Episodes"}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            )}

            {/* Notes */}
            {activeTab === "my notes" && (
              <motion.div key="notes" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <h3 style={{ fontFamily: "Georgia,serif", color: isDark ? "#e8d5f5" : "#6a3050", fontSize: "clamp(14px,2vw,18px)", margin: "0 0 16px 0" }}>
                  📝 How did you feel about {anime?.title_english || anime?.title}?
                </h3>
                <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Write your thoughts, feelings, favorite moments..." rows={8}
                  style={{ width: "100%", padding: "clamp(12px,2vw,16px)", borderRadius: "16px", border: isDark ? "1px solid rgba(200,168,233,0.3)" : "1px solid rgba(180,120,140,0.25)", background: isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.7)", color: isDark ? "#e8d5f5" : "#5a3050", fontSize: "clamp(13px,1.5vw,15px)", resize: "vertical", outline: "none", fontFamily: "Georgia,serif", lineHeight: 1.7, boxSizing: "border-box" }} />
                <div style={{ display: "flex", gap: 10, marginTop: 12, justifyContent: "flex-end" }}>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={saveNote}
                    style={{ padding: "10px 24px", borderRadius: "14px", border: "none", background: isDark ? "linear-gradient(135deg,#7b1fa2,#c8a8e9)" : "linear-gradient(135deg,#c06080,#e8a0b8)", color: "white", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "Georgia,serif" }}>
                    Save Note ✦
                  </motion.button>
                </div>
                {userNote && (
                  <div style={{ marginTop: 20, padding: "clamp(12px,2vw,16px)", borderRadius: "14px", background: isDark ? "rgba(200,168,233,0.08)" : "rgba(160,100,120,0.06)", border: isDark ? "1px solid rgba(200,168,233,0.15)" : "1px solid rgba(180,120,140,0.15)" }}>
                    <p style={{ color: isDark ? "#9b7fbf" : "#a06080", fontSize: "11px", fontWeight: "700", margin: "0 0 8px 0", textTransform: "uppercase", letterSpacing: "1px" }}>Previously saved:</p>
                    <p style={{ color: isDark ? "#e8d5f5" : "#5a3050", fontSize: "clamp(12px,1.5vw,14px)", fontStyle: "italic", lineHeight: 1.6, margin: 0 }}>"{userNote}"</p>
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