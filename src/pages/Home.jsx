import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "../context/ThemeContext"
import Navbar from "../components/Navbar"
import AnimeRow from "../components/AnimeRow"
import MoodPicker from "../components/MoodPicker"
import AnimeCard from "../components/AnimeCard"
import {
  getTrending, getTopRated, getNewReleases,
  getByGenre, searchAnime, GENRES, MOOD_GENRES
} from "../api/jikan"

export default function Home({ user, onLogout }) {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const [selectedMood, setSelectedMood] = useState(null)
  const [moodAnime, setMoodAnime] = useState([])
  const [moodLoading, setMoodLoading] = useState(false)
  const [searchResults, setSearchResults] = useState(null)
  const [watchlist, setWatchlist] = useState(() => {
    return JSON.parse(localStorage.getItem(`animood_watchlist_${user?.email}`) || "[]")
  })
  const [ratings, setRatings] = useState(() => {
    return JSON.parse(localStorage.getItem(`animood_ratings_${user?.email}`) || "{}")
  })
  const [toast, setToast] = useState(null)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const handleMoodSelect = async (mood) => {
    setSelectedMood(mood)
    setSearchResults(null)
    setMoodLoading(true)
    try {
      const genreIds = MOOD_GENRES[mood.id]
      const res = await getByGenre(genreIds[0])
      setMoodAnime(res.data.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setMoodLoading(false)
    }
  }

  const handleAdd = (anime) => {
    const exists = watchlist.some(w => w.mal_id === anime.mal_id)
    let updated
    if (exists) {
      updated = watchlist.filter(w => w.mal_id !== anime.mal_id)
      showToast(`Removed "${anime.title_english || anime.title}" from watchlist`)
    } else {
      updated = [...watchlist, anime]
      showToast(`Added "${anime.title_english || anime.title}" to watchlist ✦`)
    }
    setWatchlist(updated)
    localStorage.setItem(`animood_watchlist_${user?.email}`, JSON.stringify(updated))
  }

  const handleRate = (anime, rating) => {
    const updated = { ...ratings, [anime.mal_id]: rating }
    setRatings(updated)
    localStorage.setItem(`animood_ratings_${user?.email}`, JSON.stringify(updated))
    showToast(`Rated "${anime.title_english || anime.title}" as ${rating}! ✦`)
  }

  const handleSearch = (results) => {
    setSearchResults(results)
    setSelectedMood(null)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: isDark
        ? "linear-gradient(to bottom, #020818 0%, #0a0f2e 100%)"
        : "linear-gradient(to bottom, #fff0f5 0%, #ffe4ed 100%)",
    }}>
      {/* Navbar */}
      <Navbar user={user} onLogout={onLogout} onSearch={handleSearch} />

      {/* Main content */}
      <div style={{ paddingTop: "clamp(70px, 10vw, 100px)" }}>

        {/* Search results */}
        <AnimatePresence>
          {searchResults && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ padding: "0 clamp(16px, 4vw, 48px)", marginBottom: 40 }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <h2 style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "clamp(16px, 2.5vw, 22px)",
                  color: isDark ? "#e8d5f5" : "#e91e8c",
                  margin: 0,
                }}>
                  🔍 Search Results
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
                  <AnimeCard
                    key={anime.mal_id}
                    anime={anime}
                    onAdd={handleAdd}
                    onRate={handleRate}
                    isInWatchlist={watchlist.some(w => w.mal_id === anime.mal_id)}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mood picker */}
        {!searchResults && (
          <MoodPicker onMoodSelect={handleMoodSelect} selectedMood={selectedMood} />
        )}

        {/* Mood results */}
        <AnimatePresence>
          {selectedMood && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ padding: "0 clamp(16px, 4vw, 48px)", marginBottom: 40 }}
            >
              <h2 style={{
                fontFamily: "Georgia, serif",
                fontSize: "clamp(16px, 2.5vw, 22px)",
                color: isDark ? "#e8d5f5" : "#e91e8c",
                margin: "0 0 20px 0",
              }}>
                {selectedMood.emoji} {selectedMood.label} Picks — just for you
              </h2>

              {moodLoading ? (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(clamp(120px, 12vw, 160px), 1fr))",
                  gap: 16,
                }}>
                  {Array.from({ length: 10 }).map((_, i) => (
                    <motion.div
                      key={i}
                      style={{
                        aspectRatio: "2/3", borderRadius: "12px",
                        background: isDark ? "rgba(200,168,233,0.1)" : "rgba(233,30,140,0.08)",
                      }}
                      animate={{ opacity: [0.4, 0.8, 0.4] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                    />
                  ))}
                </div>
              ) : (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(clamp(120px, 12vw, 160px), 1fr))",
                  gap: "clamp(10px, 2vw, 20px)",
                }}>
                  {moodAnime.map((anime, i) => (
                    <motion.div
                      key={anime.mal_id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <AnimeCard
                        anime={anime}
                        onAdd={handleAdd}
                        onRate={handleRate}
                        isInWatchlist={watchlist.some(w => w.mal_id === anime.mal_id)}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Netflix rows */}
        {!searchResults && (
          <>
            <AnimeRow
              title="Trending Now"
              emoji="🔥"
              fetchFn={getTrending}
              watchlist={watchlist}
              onAdd={handleAdd}
              onRate={handleRate}
            />
            <AnimeRow
              title="Top Rated"
              emoji="👑"
              fetchFn={getTopRated}
              watchlist={watchlist}
              onAdd={handleAdd}
              onRate={handleRate}
            />
            <AnimeRow
              title="New Releases"
              emoji="🌟"
              fetchFn={getNewReleases}
              watchlist={watchlist}
              onAdd={handleAdd}
              onRate={handleRate}
            />
            <AnimeRow
              title="Action & Adventure"
              emoji="⚡"
              fetchFn={() => getByGenre(GENRES.action)}
              watchlist={watchlist}
              onAdd={handleAdd}
              onRate={handleRate}
            />
            <AnimeRow
              title="Romance"
              emoji="💕"
              fetchFn={() => getByGenre(GENRES.romance)}
              watchlist={watchlist}
              onAdd={handleAdd}
              onRate={handleRate}
            />
            <AnimeRow
              title="Isekai"
              emoji="🌀"
              fetchFn={() => getByGenre(GENRES.isekai)}
              watchlist={watchlist}
              onAdd={handleAdd}
              onRate={handleRate}
            />
            <AnimeRow
              title="Fantasy"
              emoji="🔮"
              fetchFn={() => getByGenre(GENRES.fantasy)}
              watchlist={watchlist}
              onAdd={handleAdd}
              onRate={handleRate}
            />
            <AnimeRow
              title="Mystery & Psychological"
              emoji="🕵️"
              fetchFn={() => getByGenre(GENRES.mystery)}
              watchlist={watchlist}
              onAdd={handleAdd}
              onRate={handleRate}
            />
            <AnimeRow
              title="Horror"
              emoji="👻"
              fetchFn={() => getByGenre(GENRES.horror)}
              watchlist={watchlist}
              onAdd={handleAdd}
              onRate={handleRate}
            />
            <AnimeRow
              title="Slice of Life"
              emoji="☕"
              fetchFn={() => getByGenre(GENRES.sliceoflife)}
              watchlist={watchlist}
              onAdd={handleAdd}
              onRate={handleRate}
            />
            <AnimeRow
              title="Supernatural"
              emoji="🌙"
              fetchFn={() => getByGenre(GENRES.supernatural)}
              watchlist={watchlist}
              onAdd={handleAdd}
              onRate={handleRate}
            />
            <AnimeRow
              title="Magical Girls"
              emoji="✨"
              fetchFn={() => getByGenre(GENRES.mahou)}
              watchlist={watchlist}
              onAdd={handleAdd}
              onRate={handleRate}
            />
            <AnimeRow
              title="Game"
              emoji="🎮"
              fetchFn={() => getByGenre(GENRES.game)}
              watchlist={watchlist}
              onAdd={handleAdd}
              onRate={handleRate}
            />
            <AnimeRow
              title="Sci-Fi"
              emoji="🚀"
              fetchFn={() => getByGenre(GENRES.scifi)}
              watchlist={watchlist}
              onAdd={handleAdd}
              onRate={handleRate}
            />
            <AnimeRow
              title="Comedy"
              emoji="😂"
              fetchFn={() => getByGenre(GENRES.comedy)}
              watchlist={watchlist}
              onAdd={handleAdd}
              onRate={handleRate}
            />
          </>
        )}
      </div>

      {/* Toast notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            style={{
              position: "fixed",
              bottom: "clamp(16px, 3vw, 32px)",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 200,
              padding: "12px 24px",
              borderRadius: "20px",
              background: isDark ? "rgba(10,5,40,0.95)" : "rgba(255,240,245,0.95)",
              border: isDark ? "1px solid rgba(200,168,233,0.3)" : "1px solid rgba(233,30,140,0.3)",
              color: isDark ? "#e8d5f5" : "#e91e8c",
              fontSize: "14px",
              fontWeight: "600",
              backdropFilter: "blur(20px)",
              boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
              whiteSpace: "nowrap",
            }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}