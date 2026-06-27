import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "../context/ThemeContext"
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

const sleep = (ms) => new Promise(res => setTimeout(res, ms))

export default function Browse({ watchlist, onAdd, onRate, onNote, notes, onCardClick }) {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const [selectedGenre, setSelectedGenre] = useState(null)
  const [genreAnime, setGenreAnime] = useState([])
  const [genrePage, setGenrePage] = useState(1)
  const [hasMoreGenre, setHasMoreGenre] = useState(true)
  const [genreLoading, setGenreLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState(null)
  const [searching, setSearching] = useState(false)
  const [searchPage, setSearchPage] = useState(1)
  const [hasMoreSearch, setHasMoreSearch] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)

  const loadGenre = async (genre, page = 1) => {
    try {
      setError(null)
      page === 1 ? setGenreLoading(true) : setLoadingMore(true)
      await sleep(600)
      const res = await getByGenre(GENRES[genre.key], page)
      const newData = res.data.data || []
      if (page === 1) {
        setGenreAnime(newData)
      } else {
        setGenreAnime(prev => [...prev, ...newData])
      }
      setGenrePage(page)
      setHasMoreGenre(res.data.pagination?.has_next_page || false)
    } catch (err) {
      if (err.response?.status === 429 || err.response?.status === 504) {
        setError("API is busy, retrying in 3 seconds...")
        await sleep(3000)
        setError(null)
        loadGenre(genre, page)
        return
      }
      setError("Failed to load. Please try again.")
      console.error(err)
    } finally {
      setGenreLoading(false)
      setLoadingMore(false)
    }
  }

  const handleGenreSelect = (g) => {
    if (selectedGenre?.key === g.key) {
      setSelectedGenre(null)
      setGenreAnime([])
      return
    }
    setSelectedGenre(g)
    setSearchResults(null)
    setError(null)
    loadGenre(g, 1)
  }

  const handleSearch = async (e, page = 1) => {
    if (e) e.preventDefault()
    if (!searchQuery.trim()) return
    try {
      setError(null)
      page === 1 ? setSearching(true) : setLoadingMore(true)
      const res = await searchAnime(searchQuery, page)
      const newResults = res.data.data || []
      if (page === 1) {
        setSearchResults(newResults)
        setSelectedGenre(null)
        setGenreAnime([])
      } else {
        setSearchResults(prev => [...prev, ...newResults])
      }
      setSearchPage(page)
      setHasMoreSearch(res.data.pagination?.has_next_page || false)
    } catch (err) {
      setError("Search failed. Please try again.")
      console.error(err)
    } finally {
      setSearching(false)
      setLoadingMore(false)
    }
  }

  const AnimeGrid = ({ animeList }) => (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(clamp(130px, 14vw, 170px), 1fr))",
      gap: "clamp(12px, 2vw, 20px)",
    }}>
      {animeList.map((anime, i) => (
        <motion.div
          key={`${anime.mal_id}-${i}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: Math.min(i * 0.02, 0.4) }}
          whileHover={{ scale: 1.05, y: -4 }}
          onClick={() => onCardClick && onCardClick(anime)}
          style={{ cursor: "pointer" }}
        >
          <div style={{
            borderRadius: "14px", overflow: "hidden",
            boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.5)" : "0 4px 20px rgba(0,0,0,0.15)",
            position: "relative",
          }}>
            <img
              src={anime.images?.jpg?.large_image_url}
              alt={anime.title}
              style={{ width: "100%", aspectRatio: "2/3", objectFit: "cover", display: "block" }}
              loading="lazy"
            />
            {anime.score && (
              <div style={{
                position: "absolute", top: 8, right: 8,
                background: "rgba(0,0,0,0.75)",
                color: "#ffd700", fontSize: "11px", fontWeight: "700",
                padding: "3px 8px", borderRadius: "10px",
              }}>⭐ {anime.score}</div>
            )}
            {watchlist?.some(w => w.mal_id === anime.mal_id) && (
              <div style={{
                position: "absolute", top: 8, left: 8,
                background: isDark ? "rgba(200,168,233,0.9)" : "rgba(233,30,140,0.9)",
                color: "white", fontSize: "10px", fontWeight: "700",
                padding: "3px 8px", borderRadius: "10px",
              }}>✓</div>
            )}
          </div>
          <p style={{
            color: isDark ? "#e8d5f5" : "#c2185b",
            fontSize: "clamp(11px, 1.3vw, 13px)", fontWeight: "600",
            margin: "8px 0 2px 0",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {anime.title_english || anime.title}
          </p>
          {anime.genres?.length > 0 && (
            <p style={{ color: isDark ? "#9b7fbf" : "#f06292", fontSize: "10px", margin: 0 }}>
              {anime.genres.slice(0, 2).map(g => g.name).join(" · ")}
            </p>
          )}
        </motion.div>
      ))}
    </div>
  )

  return (
    <div style={{
      minHeight: "100vh",
      padding: "clamp(16px, 4vw, 48px)",
      paddingTop: "clamp(70px, 10vw, 100px)",
      paddingBottom: "60px",
    }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: "clamp(20px, 4vw, 32px)" }}>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(22px, 4vw, 40px)", fontWeight: "bold", color: isDark ? "#e8d5f5" : "#e91e8c", margin: "0 0 8px 0" }}>
          ✦ Browse Anime
        </h1>
        <p style={{ color: isDark ? "#9b7fbf" : "#f06292", fontSize: "14px", margin: 0 }}>
          Search by name or pick a genre — load more for 100+ anime
        </p>
      </motion.div>

      {/* Search */}
      <motion.form initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        onSubmit={handleSearch} style={{ marginBottom: 32, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Search any anime by name..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{
            flex: 1, minWidth: "200px",
            padding: "clamp(12px, 2vw, 16px) 24px",
            borderRadius: "24px",
            border: isDark ? "1px solid rgba(200,168,233,0.3)" : "1px solid rgba(233,30,140,0.3)",
            background: isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.8)",
            color: isDark ? "#e8d5f5" : "#c2185b",
            fontSize: "clamp(13px, 1.8vw, 15px)",
            outline: "none",
          }}
        />
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit"
          style={{
            padding: "clamp(12px, 2vw, 16px) clamp(20px, 3vw, 32px)", borderRadius: "24px", border: "none",
            background: isDark ? "linear-gradient(135deg, #7b1fa2, #c8a8e9)" : "linear-gradient(135deg, #e91e8c, #f48fb1)",
            color: "white", fontSize: "clamp(13px, 1.8vw, 15px)", fontWeight: "700", cursor: "pointer",
          }}
        >{searching ? "Searching..." : "🔍 Search"}</motion.button>
      </motion.form>

      {/* Error message */}
      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{
            padding: "12px 20px", borderRadius: "12px", marginBottom: 20,
            background: "rgba(255,100,100,0.15)", border: "1px solid rgba(255,100,100,0.3)",
            color: isDark ? "#ffb3b3" : "#c62828", fontSize: "14px",
          }}
        >⚠ {error}</motion.div>
      )}

      {/* Search results */}
      <AnimatePresence>
        {searchResults && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(16px, 2.5vw, 22px)", color: isDark ? "#e8d5f5" : "#e91e8c", margin: 0 }}>
                🔍 "{searchQuery}" — {searchResults.length} results
              </h2>
              <motion.button whileHover={{ scale: 1.05 }}
                onClick={() => { setSearchResults(null); setSearchQuery("") }}
                style={{ padding: "6px 16px", borderRadius: "20px", border: isDark ? "1px solid rgba(200,168,233,0.3)" : "1px solid rgba(233,30,140,0.3)", background: "transparent", color: isDark ? "#c8a8e9" : "#e91e8c", cursor: "pointer", fontSize: "13px" }}
              >Clear ✕</motion.button>
            </div>
            <AnimeGrid animeList={searchResults} />
            {hasMoreSearch && (
              <div style={{ textAlign: "center", marginTop: 32 }}>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => handleSearch(null, searchPage + 1)}
                  style={{ padding: "12px 32px", borderRadius: "24px", border: "none", background: isDark ? "linear-gradient(135deg, #7b1fa2, #c8a8e9)" : "linear-gradient(135deg, #e91e8c, #f48fb1)", color: "white", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}
                >{loadingMore ? "Loading..." : "Load More →"}</motion.button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Genre pills */}
      {!searchResults && (
        <>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ marginBottom: 28 }}>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(16px, 2.5vw, 22px)", color: isDark ? "#e8d5f5" : "#e91e8c", margin: "0 0 16px 0" }}>
              Browse by Genre
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {allGenres.map((g, i) => (
                <motion.button
                  key={g.key}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.02 }}
                  whileHover={{ scale: 1.08, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleGenreSelect(g)}
                  style={{
                    padding: "8px 18px", borderRadius: "20px", border: "none",
                    cursor: "pointer", fontSize: "clamp(12px, 1.5vw, 13px)", fontWeight: "600",
                    background: selectedGenre?.key === g.key
                      ? isDark ? "rgba(200,168,233,0.35)" : "rgba(233,30,140,0.25)"
                      : isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.6)",
                    color: selectedGenre?.key === g.key
                      ? isDark ? "#e8d5f5" : "#e91e8c"
                      : isDark ? "#c8a8e9" : "#c2185b",
                    border: selectedGenre?.key === g.key
                      ? isDark ? "1px solid rgba(200,168,233,0.5)" : "1px solid rgba(233,30,140,0.5)"
                      : isDark ? "1px solid rgba(200,168,233,0.15)" : "1px solid rgba(233,30,140,0.2)",
                    backdropFilter: "blur(10px)", transition: "all 0.3s",
                    boxShadow: selectedGenre?.key === g.key
                      ? isDark ? "0 0 20px rgba(200,168,233,0.25)" : "0 0 20px rgba(233,30,140,0.25)"
                      : "none",
                  }}
                >{g.emoji} {g.label}</motion.button>
              ))}
            </div>
          </motion.div>

          {/* Genre results */}
          <AnimatePresence>
            {selectedGenre && (
              <motion.div key={selectedGenre.key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(18px, 3vw, 26px)", color: isDark ? "#e8d5f5" : "#e91e8c", margin: "0 0 20px 0" }}>
                  {selectedGenre.emoji} {selectedGenre.label} — {genreAnime.length} anime
                </h2>

                {genreLoading ? (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(clamp(130px, 14vw, 170px), 1fr))", gap: "clamp(12px, 2vw, 20px)" }}>
                    {Array.from({ length: 25 }).map((_, i) => (
                      <motion.div key={i}
                        style={{ aspectRatio: "2/3", borderRadius: "14px", background: isDark ? "rgba(200,168,233,0.1)" : "rgba(233,30,140,0.08)" }}
                        animate={{ opacity: [0.4, 0.8, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.05 }}
                      />
                    ))}
                  </div>
                ) : (
                  <>
                    <AnimeGrid animeList={genreAnime} />
                    {hasMoreGenre && (
                      <div style={{ textAlign: "center", marginTop: 32 }}>
                        <motion.button
                          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          onClick={() => loadGenre(selectedGenre, genrePage + 1)}
                          style={{
                            padding: "14px 40px", borderRadius: "24px", border: "none",
                            background: isDark ? "linear-gradient(135deg, #7b1fa2, #c8a8e9)" : "linear-gradient(135deg, #e91e8c, #f48fb1)",
                            color: "white", fontSize: "15px", fontWeight: "700", cursor: "pointer",
                            boxShadow: isDark ? "0 4px 20px rgba(200,168,233,0.3)" : "0 4px 20px rgba(233,30,140,0.3)",
                          }}
                        >
                          {loadingMore ? "Loading..." : `Load More ${selectedGenre.emoji} (+25)`}
                        </motion.button>
                        <p style={{ color: isDark ? "#9b7fbf" : "#f06292", fontSize: "12px", marginTop: 8 }}>
                          Showing {genreAnime.length} anime — keep loading for more!
                        </p>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  )
}
