import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "../context/ThemeContext"
import AnimeRow from "../components/AnimeRow"
import { getByGenre, searchAnime, GENRES } from "../api/jikan"

const allGenres = [
  { key: "action", label: "Action", emoji: "⚡" },
  { key: "adventure", label: "Adventure", emoji: "🗺️" },
  { key: "comedy", label: "Comedy", emoji: "😂" },
  { key: "drama", label: "Drama", emoji: "🎭" },
  { key: "fantasy", label: "Fantasy", emoji: "🔮" },
  { key: "horror", label: "Horror", emoji: "👻" },
  { key: "mystery", label: "Mystery", emoji: "🕵️" },
  { key: "romance", label: "Romance", emoji: "💕" },
  { key: "scifi", label: "Sci-Fi", emoji: "🚀" },
  { key: "sliceoflife", label: "Slice of Life", emoji: "☕" },
  { key: "supernatural", label: "Supernatural", emoji: "🌙" },
  { key: "thriller", label: "Thriller", emoji: "😰" },
  { key: "isekai", label: "Isekai", emoji: "🌀" },
  { key: "magic", label: "Magic", emoji: "✨" },
  { key: "mecha", label: "Mecha", emoji: "🤖" },
  { key: "sports", label: "Sports", emoji: "🏆" },
  { key: "historical", label: "Historical", emoji: "⚔️" },
  { key: "school", label: "School", emoji: "🏫" },
  { key: "shounen", label: "Shounen", emoji: "👊" },
  { key: "shoujo", label: "Shoujo", emoji: "🌸" },
  { key: "demons", label: "Demons", emoji: "😈" },
  { key: "psychological", label: "Psychological", emoji: "🧠" },
  { key: "vampire", label: "Vampire", emoji: "🧛" },
  { key: "game", label: "Game", emoji: "🎮" },
  { key: "music", label: "Music", emoji: "🎵" },
  { key: "space", label: "Space", emoji: "🌌" },
  { key: "military", label: "Military", emoji: "🪖" },
  { key: "samurai", label: "Samurai", emoji: "🗡️" },
]

export default function Browse({ watchlist, onAdd, onRate, onNote, notes, onCardClick }) {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const [selectedGenre, setSelectedGenre] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState(null)
  const [searching, setSearching] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    try {
      setSearching(true)
      const res = await searchAnime(searchQuery)
      setSearchResults(res.data.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setSearching(false)
    }
  }

  return (
    <div style={{
      padding: "clamp(80px, 12vw, 120px) clamp(16px, 4vw, 48px) 40px",
      minHeight: "100vh",
    }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: "clamp(20px, 4vw, 32px)" }}
      >
        <h1 style={{
          fontFamily: "Georgia, serif",
          fontSize: "clamp(22px, 4vw, 36px)",
          fontWeight: "bold",
          color: isDark ? "#e8d5f5" : "#e91e8c",
          margin: "0 0 8px 0",
        }}>
          ✦ Browse Anime
        </h1>
        <p style={{ color: isDark ? "#9b7fbf" : "#f06292", fontSize: "14px", margin: 0 }}>
          Explore by genre or search for anything
        </p>
      </motion.div>

      {/* Search */}
      <form onSubmit={handleSearch} style={{ marginBottom: 28, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Search any anime..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{
            flex: 1, minWidth: "200px",
            padding: "clamp(10px, 2vw, 14px) 20px",
            borderRadius: "20px",
            border: isDark ? "1px solid rgba(200,168,233,0.3)" : "1px solid rgba(233,30,140,0.3)",
            background: isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.6)",
            color: isDark ? "#e8d5f5" : "#c2185b",
            fontSize: "clamp(13px, 1.8vw, 15px)",
            outline: "none",
            backdropFilter: "blur(10px)",
            maxWidth: "500px",
          }}
        />
        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          type="submit"
          style={{
            padding: "clamp(10px, 2vw, 14px) clamp(16px, 3vw, 24px)",
            borderRadius: "20px", border: "none",
            background: isDark
              ? "linear-gradient(135deg, #7b1fa2, #c8a8e9)"
              : "linear-gradient(135deg, #e91e8c, #f48fb1)",
            color: "white",
            fontSize: "clamp(13px, 1.8vw, 15px)",
            fontWeight: "700", cursor: "pointer",
          }}
        >
          {searching ? "..." : "🔍 Search"}
        </motion.button>
      </form>

      {/* Search results */}
      <AnimatePresence>
        {searchResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ marginBottom: 40 }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h2 style={{
                fontFamily: "Georgia, serif",
                fontSize: "clamp(16px, 2.5vw, 22px)",
                color: isDark ? "#e8d5f5" : "#e91e8c",
                margin: 0,
              }}>
                🔍 Results for "{searchQuery}"
              </h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setSearchResults(null)}
                style={{
                  padding: "6px 16px", borderRadius: "20px",
                  border: isDark ? "1px solid rgba(200,168,233,0.3)" : "1px solid rgba(233,30,140,0.3)",
                  background: "transparent",
                  color: isDark ? "#c8a8e9" : "#e91e8c",
                  cursor: "pointer", fontSize: "13px",
                }}
              >
                Clear ✕
              </motion.button>
            </div>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(clamp(120px, 12vw, 160px), 1fr))",
              gap: "clamp(10px, 2vw, 20px)",
            }}>
              {searchResults.map(anime => (
                <motion.div
                  key={anime.mal_id}
                  whileHover={{ scale: 1.05, y: -4 }}
                  onClick={() => onCardClick && onCardClick(anime)}
                  style={{ cursor: "pointer" }}
                >
                  <div style={{ borderRadius: "12px", overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.3)" }}>
                    <img
                      src={anime.images?.jpg?.large_image_url}
                      alt={anime.title}
                      style={{ width: "100%", aspectRatio: "2/3", objectFit: "cover", display: "block" }}
                    />
                  </div>
                  <p style={{
                    color: isDark ? "#e8d5f5" : "#c2185b",
                    fontSize: "12px", fontWeight: "600",
                    margin: "6px 0 0 0",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {anime.title_english || anime.title}
                  </p>
                  {anime.score && (
                    <p style={{ color: "#ffd700", fontSize: "11px", margin: "2px 0 0 0" }}>⭐ {anime.score}</p>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Genre pills */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{
          fontFamily: "Georgia, serif",
          fontSize: "clamp(16px, 2.5vw, 20px)",
          color: isDark ? "#e8d5f5" : "#e91e8c",
          margin: "0 0 16px 0",
        }}>
          Browse by Genre
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {allGenres.map(g => (
            <motion.button
              key={g.key}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedGenre(selectedGenre?.key === g.key ? null : g)}
              style={{
                padding: "7px 14px", borderRadius: "20px", border: "none",
                cursor: "pointer", fontSize: "12px", fontWeight: "600",
                background: selectedGenre?.key === g.key
                  ? isDark ? "rgba(200,168,233,0.35)" : "rgba(233,30,140,0.25)"
                  : isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.5)",
                color: selectedGenre?.key === g.key
                  ? isDark ? "#e8d5f5" : "#e91e8c"
                  : isDark ? "#c8a8e9" : "#c2185b",
                border: selectedGenre?.key === g.key
                  ? isDark ? "1px solid rgba(200,168,233,0.5)" : "1px solid rgba(233,30,140,0.5)"
                  : isDark ? "1px solid rgba(200,168,233,0.15)" : "1px solid rgba(233,30,140,0.15)",
                backdropFilter: "blur(10px)",
                transition: "all 0.3s",
                boxShadow: selectedGenre?.key === g.key
                  ? isDark ? "0 0 15px rgba(200,168,233,0.2)" : "0 0 15px rgba(233,30,140,0.2)"
                  : "none",
              }}
            >
              {g.emoji} {g.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Selected genre row */}
      <AnimatePresence>
        {selectedGenre && (
          <motion.div
            key={selectedGenre.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <AnimeRow
              title={selectedGenre.label}
              emoji={selectedGenre.emoji}
              fetchFn={(p) => getByGenre(GENRES[selectedGenre.key], p)}
              watchlist={watchlist}
              onAdd={onAdd}
              onRate={onRate}
              onNote={onNote}
              notes={notes}
              onCardClick={onCardClick}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Default rows when nothing selected */}
      {!selectedGenre && !searchResults && allGenres.slice(0, 6).map(g => (
        <AnimeRow
          key={g.key}
          title={g.label}
          emoji={g.emoji}
          fetchFn={(p) => getByGenre(GENRES[g.key], p)}
          watchlist={watchlist}
          onAdd={onAdd}
          onRate={onRate}
          onNote={onNote}
          notes={notes}
          onCardClick={onCardClick}
        />
      ))}
    </div>
  )
}
