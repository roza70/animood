import MyList from "./MyList"
import Browse from "./Browse"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "../context/ThemeContext"
import Navbar from "../components/Navbar"
import AnimeRow from "../components/AnimeRow"
import MoodPicker from "../components/MoodPicker"
import AnimeCard from "../components/AnimeCard"
import AnimeDetail from "./AnimeDetail"
import DarkCharacter from "../components/Character/DarkCharacter"
import LightCharacter from "../components/Character/LightCharacter"
import DarkPixelBackground from "../components/Character/DarkPixelBackground"
import LightPixelBackground from "../components/Character/LightPixelBackground"
import useUserData from "../hooks/useUserData"
import {
  getTrending, getTopRated, getNewReleases,
  getByGenre, GENRES, MOOD_GENRES
} from "../api/jikan"

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false
    return window.innerWidth < breakpoint
  })
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
    const handler = (e) => setIsMobile(e.matches)
    setIsMobile(mq.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [breakpoint])
  return isMobile
}

export default function Home({ user, onLogout }) {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const isMobile = useIsMobile()

  const [selectedMood, setSelectedMood] = useState(null)
  const [moodAnime, setMoodAnime] = useState([])
  const [moodPage, setMoodPage] = useState(1)
  const [hasMoreMood, setHasMoreMood] = useState(true)
  const [moodLoading, setMoodLoading] = useState(false)
  const [moodLoadingMore, setMoodLoadingMore] = useState(false)
  const [searchResults, setSearchResults] = useState(null)
  const [showMyList, setShowMyList] = useState(false)
  const [showBrowse, setShowBrowse] = useState(false)
  const [selectedAnime, setSelectedAnime] = useState(null)

  const {
    watchlist, ratings, notes, statuses,
    setWatchlist, setRatings, setNotes, setStatuses,
  } = useUserData(user?.uid)
  const [toast, setToast] = useState(null)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }



  const resetAll = () => {
    setShowMyList(false)
    setShowBrowse(false)
    setSearchResults(null)
    setSelectedMood(null)
    setMoodAnime([])
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleMoodSelect = async (mood) => {
    setSelectedMood(mood)
    setMoodAnime([])
    setMoodPage(1)
    setHasMoreMood(true)
    setSearchResults(null)
    setShowMyList(false)
    setShowBrowse(false)
    setMoodLoading(true)
    try {
      const genreIds = MOOD_GENRES[mood.id]
      const res = await getByGenre(genreIds[0], 1)
      setMoodAnime(res.data.data || [])
      setHasMoreMood(res.data.pagination?.has_next_page || false)
      setMoodPage(1)
    } catch (err) { console.error(err) }
    finally { setMoodLoading(false) }
  }

  const loadMoreMood = async () => {
    if (!selectedMood || moodLoadingMore) return
    setMoodLoadingMore(true)
    try {
      const genreIds = MOOD_GENRES[selectedMood.id]
      const nextPage = moodPage + 1
      const res = await getByGenre(genreIds[0], nextPage)
      setMoodAnime(prev => [...prev, ...(res.data.data || [])])
      setHasMoreMood(res.data.pagination?.has_next_page || false)
      setMoodPage(nextPage)
    } catch (err) { console.error(err) }
    finally { setMoodLoadingMore(false) }
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
  }

  const handleRate = (anime, rating) => {
    const updated = { ...ratings, [anime.mal_id]: rating }
    setRatings(updated)
    showToast(`Rated "${anime.title_english || anime.title}" as ${rating}! ✦`)
  }

  const handleNote = (anime, note) => {
    const updated = { ...notes, [anime.mal_id]: note }
    setNotes(updated)
    showToast(`Note saved! 📝`)
  }

  const handleStatus = (anime, status) => {
    const updated = { ...statuses, [anime.mal_id]: status }
    setStatuses(updated)
    const labels = { watching: "Watching", completed: "Completed", onhold: "On Hold", dropped: "Dropped", plantowatch: "Plan to Watch" }
    showToast(`Marked as ${labels[status] || status}! ✦`)
  }

  const handleSearch = (results) => {
    setSearchResults(results)
    setSelectedMood(null)
    setMoodAnime([])
    setShowMyList(false)
    setShowBrowse(false)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleMyList = (show) => {
    setShowMyList(show)
    setShowBrowse(false)
    setSearchResults(null)
    setSelectedMood(null)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleBrowse = () => {
    setShowBrowse(true)
    setShowMyList(false)
    setSearchResults(null)
    setSelectedMood(null)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleCardClick = (anime) => setSelectedAnime(anime)

  const fullPageStyle = {
    position: "fixed", inset: 0, zIndex: 50,
    overflowY: "auto",
    background: isDark ? "#020818" : "#fff0f5",
  }

  const closeBtnStyle = {
    position: "fixed",
    top: "clamp(70px, 10vw, 90px)",
    right: "clamp(12px, 3vw, 32px)",
    zIndex: 200, width: 40, height: 40,
    borderRadius: "50%",
    border: isDark ? "1px solid rgba(200,168,233,0.3)" : "1px solid rgba(233,30,140,0.3)",
    background: isDark ? "rgba(10,5,40,0.95)" : "rgba(255,240,245,0.95)",
    color: isDark ? "#c8a8e9" : "#e91e8c",
    fontSize: "18px", cursor: "pointer",
    backdropFilter: "blur(10px)",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
  }

  const renderBackground = () => {
    if (showMyList || showBrowse || searchResults || selectedMood) return null
    if (isMobile) return isDark ? <DarkPixelBackground /> : <LightPixelBackground />
    return isDark ? <DarkCharacter /> : <LightCharacter />
  }

  return (
    <div style={{ minHeight: "100vh", position: "relative", background: isDark ? "#020818" : "#fff0f5" }}>

      {renderBackground()}

      {/* MY LIST */}
      <AnimatePresence>
        {showMyList && (
          <motion.div key="mylist" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={fullPageStyle}>
            <Navbar user={user} onLogout={onLogout} onSearch={handleSearch} onMyList={handleMyList} onBrowse={handleBrowse} onHome={resetAll} />
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setShowMyList(false)} style={closeBtnStyle}>✕</motion.button>
            <MyList user={user} watchlist={watchlist} ratings={ratings} statuses={statuses} onAdd={handleAdd} onRate={handleRate} onStatus={handleStatus} onCardClick={handleCardClick} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* BROWSE */}
      <AnimatePresence>
        {showBrowse && (
          <motion.div key="browse" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={fullPageStyle}>
            <Navbar user={user} onLogout={onLogout} onSearch={handleSearch} onMyList={handleMyList} onBrowse={handleBrowse} onHome={resetAll} />
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setShowBrowse(false)} style={closeBtnStyle}>✕</motion.button>
            <Browse watchlist={watchlist} onAdd={handleAdd} onRate={handleRate} onNote={handleNote} notes={notes} onCardClick={handleCardClick} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN HOME */}
      {!showMyList && !showBrowse && (
        <div style={{ position: "relative", zIndex: 20, minHeight: "100vh" }}>
          <Navbar user={user} onLogout={onLogout} onSearch={handleSearch} onMyList={handleMyList} onBrowse={handleBrowse} onHome={resetAll} />

          <div style={{ paddingTop: "clamp(70px, 10vw, 100px)" }}>

            {/* Search results */}
            <AnimatePresence>
              {searchResults && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ padding: "clamp(16px, 4vw, 48px)", background: isDark ? "#020818" : "#fff0f5", minHeight: "100vh" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                    <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(16px, 2.5vw, 22px)", color: isDark ? "#e8d5f5" : "#e91e8c", margin: 0 }}>🔍 Search Results</h2>
                    <motion.button whileHover={{ scale: 1.05 }} onClick={() => setSearchResults(null)}
                      style={{ padding: "6px 16px", borderRadius: "20px", border: isDark ? "1px solid rgba(200,168,233,0.3)" : "1px solid rgba(233,30,140,0.3)", background: "transparent", color: isDark ? "#c8a8e9" : "#e91e8c", cursor: "pointer", fontSize: "13px" }}>
                      Clear ✕
                    </motion.button>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(clamp(120px, 12vw, 160px), 1fr))", gap: "clamp(10px, 2vw, 20px)" }}>
                    {searchResults.map(anime => (
                      <div key={anime.mal_id} onClick={() => handleCardClick(anime)}>
                        <AnimeCard anime={anime} onAdd={handleAdd} onRate={handleRate} onNote={handleNote} isInWatchlist={watchlist.some(w => w.mal_id === anime.mal_id)} userNote={notes[anime.mal_id]} />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Hero */}
            {!searchResults && !selectedMood && (
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
                style={{ padding: "clamp(40px, 8vw, 100px) clamp(16px, 6vw, 80px)", minHeight: "70vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                  style={{ color: isDark ? "#c8a8e9" : "#ffb7c5", fontSize: "clamp(10px, 1.3vw, 13px)", fontWeight: "700", letterSpacing: "3px", textTransform: "uppercase", margin: "0 0 12px 0" }}>
                  ✦ Your Anime Universe
                </motion.p>
                <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                  style={{ fontFamily: "Georgia, serif", fontSize: "clamp(28px, 6vw, 72px)", fontWeight: "bold", color: "white", margin: "0 0 16px 0", lineHeight: 1.1, textShadow: "0 4px 20px rgba(0,0,0,0.5)", maxWidth: "700px" }}>
                  Discover Anime<br />
                  <span style={{ color: isDark ? "#c8a8e9" : "#ffb7c5" }}>By Your Mood</span>
                </motion.h1>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                  style={{ color: "rgba(255,255,255,0.8)", fontSize: "clamp(13px, 2vw, 17px)", margin: "0 0 32px 0", maxWidth: "500px", lineHeight: 1.6 }}>
                  Tell us how you feel and we'll find your perfect anime. Track, rate, and build your personal anime universe.
                </motion.p>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                  <motion.div whileHover={{ scale: 1.03, y: -4 }} whileTap={{ scale: 0.97 }}
                    onClick={() => window.scrollTo({ top: window.innerHeight * 0.9, behavior: "smooth" })}
                    style={{ padding: "clamp(12px, 2vw, 16px) clamp(20px, 3vw, 32px)", borderRadius: "16px", background: isDark ? "linear-gradient(135deg, #7b1fa2, #c8a8e9)" : "linear-gradient(135deg, #e91e8c, #f48fb1)", color: "white", fontSize: "clamp(13px, 1.8vw, 15px)", fontWeight: "700", cursor: "pointer", fontFamily: "Georgia, serif", boxShadow: isDark ? "0 8px 30px rgba(200,168,233,0.4)" : "0 8px 30px rgba(233,30,140,0.4)", display: "flex", alignItems: "center", gap: 10 }}>
                    ✦ Start Exploring Free →
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.03, y: -4 }} whileTap={{ scale: 0.97 }} onClick={handleBrowse}
                    style={{ padding: "clamp(12px, 2vw, 16px) clamp(20px, 3vw, 32px)", borderRadius: "16px", background: "rgba(255,255,255,0.12)", border: "2px solid rgba(255,255,255,0.3)", color: "white", fontSize: "clamp(13px, 1.8vw, 15px)", fontWeight: "700", cursor: "pointer", fontFamily: "Georgia, serif", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", gap: 10 }}>
                    🎭 Browse All Anime
                  </motion.div>
                </motion.div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} style={{ display: "flex", gap: "clamp(20px, 4vw, 40px)", marginTop: 40, flexWrap: "wrap" }}>
                  {[{ num: "1000+", label: "Anime" }, { num: "12", label: "Moods" }, { num: "Free", label: "Forever" }].map((stat, i) => (
                    <div key={i}>
                      <div style={{ fontFamily: "Georgia, serif", fontSize: "clamp(20px, 3vw, 28px)", fontWeight: "bold", color: isDark ? "#c8a8e9" : "#ffb7c5" }}>{stat.num}</div>
                      <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "clamp(11px, 1.3vw, 13px)", fontWeight: "600" }}>{stat.label}</div>
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            )}

            {/* Mood picker */}
            {!searchResults && (
              <div style={{ background: isDark ? "#020818" : "#fff0f5", padding: "clamp(20px, 4vw, 40px) 0" }}>
                <MoodPicker onMoodSelect={handleMoodSelect} selectedMood={selectedMood} />
              </div>
            )}

            {/* Mood results */}
            <AnimatePresence>
              {selectedMood && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ padding: "0 clamp(16px, 4vw, 48px)", background: isDark ? "#020818" : "#fff0f5", minHeight: "60vh" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 24, marginBottom: 20 }}>
                    <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(16px, 2.5vw, 22px)", color: isDark ? "#e8d5f5" : "#e91e8c", margin: 0 }}>
                      {selectedMood.emoji} {selectedMood.label} Picks — {moodAnime.length} anime
                    </h2>
                    <motion.button whileHover={{ scale: 1.05 }} onClick={() => { setSelectedMood(null); setMoodAnime([]) }}
                      style={{ padding: "6px 16px", borderRadius: "20px", border: isDark ? "1px solid rgba(200,168,233,0.3)" : "1px solid rgba(233,30,140,0.3)", background: "transparent", color: isDark ? "#c8a8e9" : "#e91e8c", cursor: "pointer", fontSize: "13px" }}>
                      Clear ✕
                    </motion.button>
                  </div>
                  {moodLoading ? (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(clamp(120px, 12vw, 160px), 1fr))", gap: 16 }}>
                      {Array.from({ length: 25 }).map((_, i) => (
                        <motion.div key={i} style={{ aspectRatio: "2/3", borderRadius: "12px", background: isDark ? "rgba(200,168,233,0.1)" : "rgba(233,30,140,0.08)" }}
                          animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.05 }} />
                      ))}
                    </div>
                  ) : (
                    <>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(clamp(120px, 12vw, 160px), 1fr))", gap: "clamp(10px, 2vw, 20px)", paddingBottom: 20 }}>
                        {moodAnime.map((anime, i) => (
                          <motion.div key={`${anime.mal_id}-${i}`} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: Math.min(i * 0.03, 0.4) }} onClick={() => handleCardClick(anime)}>
                            <AnimeCard anime={anime} onAdd={handleAdd} onRate={handleRate} onNote={handleNote} isInWatchlist={watchlist.some(w => w.mal_id === anime.mal_id)} userNote={notes[anime.mal_id]} />
                          </motion.div>
                        ))}
                      </div>
                      {hasMoreMood && (
                        <div style={{ textAlign: "center", paddingBottom: 40 }}>
                          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={loadMoreMood}
                            style={{ padding: "14px 40px", borderRadius: "24px", border: "none", background: isDark ? "linear-gradient(135deg, #7b1fa2, #c8a8e9)" : "linear-gradient(135deg, #e91e8c, #f48fb1)", color: "white", fontSize: "15px", fontWeight: "700", cursor: "pointer", boxShadow: isDark ? "0 4px 20px rgba(200,168,233,0.3)" : "0 4px 20px rgba(233,30,140,0.3)" }}>
                            {moodLoadingMore ? "Loading..." : `Load More ${selectedMood.emoji} (+25)`}
                          </motion.button>
                          <p style={{ color: isDark ? "#9b7fbf" : "#f06292", fontSize: "12px", marginTop: 8 }}>Showing {moodAnime.length} anime</p>
                        </div>
                      )}
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Netflix rows */}
            {!searchResults && (
              <div style={{ background: isDark ? "#020818" : "#fff0f5", paddingTop: "clamp(20px, 4vw, 40px)" }}>
                <AnimeRow title="Trending Now" emoji="🔥" fetchFn={getTrending} watchlist={watchlist} onAdd={handleAdd} onRate={handleRate} onNote={handleNote} notes={notes} onCardClick={handleCardClick} />
                <AnimeRow title="Top Rated" emoji="👑" fetchFn={getTopRated} watchlist={watchlist} onAdd={handleAdd} onRate={handleRate} onNote={handleNote} notes={notes} onCardClick={handleCardClick} />
                <AnimeRow title="New Releases" emoji="🌟" fetchFn={getNewReleases} watchlist={watchlist} onAdd={handleAdd} onRate={handleRate} onNote={handleNote} notes={notes} onCardClick={handleCardClick} />
                <AnimeRow title="Action & Adventure" emoji="⚡" fetchFn={(p) => getByGenre(GENRES.action, p)} watchlist={watchlist} onAdd={handleAdd} onRate={handleRate} onNote={handleNote} notes={notes} onCardClick={handleCardClick} />
                <AnimeRow title="Romance" emoji="💕" fetchFn={(p) => getByGenre(GENRES.romance, p)} watchlist={watchlist} onAdd={handleAdd} onRate={handleRate} onNote={handleNote} notes={notes} onCardClick={handleCardClick} />
                <AnimeRow title="Isekai" emoji="🌀" fetchFn={(p) => getByGenre(GENRES.isekai, p)} watchlist={watchlist} onAdd={handleAdd} onRate={handleRate} onNote={handleNote} notes={notes} onCardClick={handleCardClick} />
                <AnimeRow title="Fantasy" emoji="🔮" fetchFn={(p) => getByGenre(GENRES.fantasy, p)} watchlist={watchlist} onAdd={handleAdd} onRate={handleRate} onNote={handleNote} notes={notes} onCardClick={handleCardClick} />
                <AnimeRow title="Magic & Sorcery" emoji="✨" fetchFn={(p) => getByGenre(GENRES.magic, p)} watchlist={watchlist} onAdd={handleAdd} onRate={handleRate} onNote={handleNote} notes={notes} onCardClick={handleCardClick} />
                <AnimeRow title="Mystery & Psychological" emoji="🕵️" fetchFn={(p) => getByGenre(GENRES.mystery, p)} watchlist={watchlist} onAdd={handleAdd} onRate={handleRate} onNote={handleNote} notes={notes} onCardClick={handleCardClick} />
                <AnimeRow title="Horror" emoji="👻" fetchFn={(p) => getByGenre(GENRES.horror, p)} watchlist={watchlist} onAdd={handleAdd} onRate={handleRate} onNote={handleNote} notes={notes} onCardClick={handleCardClick} />
                <AnimeRow title="Slice of Life" emoji="☕" fetchFn={(p) => getByGenre(GENRES.sliceoflife, p)} watchlist={watchlist} onAdd={handleAdd} onRate={handleRate} onNote={handleNote} notes={notes} onCardClick={handleCardClick} />
                <AnimeRow title="Supernatural" emoji="🌙" fetchFn={(p) => getByGenre(GENRES.supernatural, p)} watchlist={watchlist} onAdd={handleAdd} onRate={handleRate} onNote={handleNote} notes={notes} onCardClick={handleCardClick} />
                <AnimeRow title="Shounen" emoji="👊" fetchFn={(p) => getByGenre(GENRES.shounen, p)} watchlist={watchlist} onAdd={handleAdd} onRate={handleRate} onNote={handleNote} notes={notes} onCardClick={handleCardClick} />
                <AnimeRow title="Demons & Dark Powers" emoji="😈" fetchFn={(p) => getByGenre(GENRES.demons, p)} watchlist={watchlist} onAdd={handleAdd} onRate={handleRate} onNote={handleNote} notes={notes} onCardClick={handleCardClick} />
                <AnimeRow title="Mecha" emoji="🤖" fetchFn={(p) => getByGenre(GENRES.mecha, p)} watchlist={watchlist} onAdd={handleAdd} onRate={handleRate} onNote={handleNote} notes={notes} onCardClick={handleCardClick} />
                <AnimeRow title="Sports" emoji="🏆" fetchFn={(p) => getByGenre(GENRES.sports, p)} watchlist={watchlist} onAdd={handleAdd} onRate={handleRate} onNote={handleNote} notes={notes} onCardClick={handleCardClick} />
                <AnimeRow title="Historical" emoji="⚔️" fetchFn={(p) => getByGenre(GENRES.historical, p)} watchlist={watchlist} onAdd={handleAdd} onRate={handleRate} onNote={handleNote} notes={notes} onCardClick={handleCardClick} />
                <AnimeRow title="School Life" emoji="🏫" fetchFn={(p) => getByGenre(GENRES.school, p)} watchlist={watchlist} onAdd={handleAdd} onRate={handleRate} onNote={handleNote} notes={notes} onCardClick={handleCardClick} />
                <AnimeRow title="Sci-Fi" emoji="🚀" fetchFn={(p) => getByGenre(GENRES.scifi, p)} watchlist={watchlist} onAdd={handleAdd} onRate={handleRate} onNote={handleNote} notes={notes} onCardClick={handleCardClick} />
                <AnimeRow title="Game" emoji="🎮" fetchFn={(p) => getByGenre(GENRES.game, p)} watchlist={watchlist} onAdd={handleAdd} onRate={handleRate} onNote={handleNote} notes={notes} onCardClick={handleCardClick} />
                <AnimeRow title="Comedy" emoji="😂" fetchFn={(p) => getByGenre(GENRES.comedy, p)} watchlist={watchlist} onAdd={handleAdd} onRate={handleRate} onNote={handleNote} notes={notes} onCardClick={handleCardClick} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 50, scale: 0.9 }}
            style={{ position: "fixed", bottom: "clamp(16px, 3vw, 32px)", left: "50%", transform: "translateX(-50%)", zIndex: 300, padding: "12px 24px", borderRadius: "20px", background: isDark ? "rgba(10,5,40,0.95)" : "rgba(255,240,245,0.95)", border: isDark ? "1px solid rgba(200,168,233,0.3)" : "1px solid rgba(233,30,140,0.3)", color: isDark ? "#e8d5f5" : "#e91e8c", fontSize: "14px", fontWeight: "600", backdropFilter: "blur(20px)", boxShadow: "0 8px 30px rgba(0,0,0,0.2)", whiteSpace: "nowrap" }}>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Anime Detail Modal */}
      <AnimatePresence>
        {selectedAnime && (
          <AnimeDetail
            anime={selectedAnime}
            onClose={() => setSelectedAnime(null)}
            onAdd={handleAdd}
            onRate={handleRate}
            onNote={handleNote}
            onCardClick={handleCardClick}
            isInWatchlist={watchlist.some(w => w.mal_id === selectedAnime.mal_id)}
            userNote={notes[selectedAnime.mal_id]}
            userRating={ratings[selectedAnime.mal_id]}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
