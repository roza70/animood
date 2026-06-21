import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { useTheme } from "../context/ThemeContext"
import AnimeCard from "./AnimeCard"

export default function AnimeRow({ title, fetchFn, watchlist, onAdd, onRate, emoji }) {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const [anime, setAnime] = useState([])
  const [loading, setLoading] = useState(true)
  const rowRef = useRef(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const res = await fetchFn()
        setAnime(res.data.data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const scroll = (dir) => {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: dir * 400, behavior: "smooth" })
    }
  }

  const btnStyle = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 10,
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    background: isDark ? "rgba(10,5,40,0.9)" : "rgba(255,240,245,0.9)",
    color: isDark ? "#c8a8e9" : "#e91e8c",
    boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
    backdropFilter: "blur(10px)",
  }

  return (
    <div style={{ marginBottom: "clamp(24px, 4vw, 40px)" }}>
      {/* Row title */}
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        style={{
          fontFamily: "Georgia, serif",
          fontSize: "clamp(16px, 2.5vw, 22px)",
          fontWeight: "700",
          color: isDark ? "#e8d5f5" : "#e91e8c",
          margin: "0 0 16px clamp(16px, 4vw, 48px)",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        {emoji} {title}
      </motion.h2>

      {/* Scrollable row */}
      <div style={{ position: "relative" }}>
        {/* Left arrow */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => scroll(-1)}
          style={{ ...btnStyle, left: "clamp(4px, 1vw, 12px)" }}
        >
          ‹
        </motion.button>

        {/* Cards */}
        <div
          ref={rowRef}
          style={{
            display: "flex",
            gap: "clamp(8px, 1.5vw, 16px)",
            overflowX: "auto",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            padding: "8px clamp(40px, 5vw, 60px)",
          }}
        >
          {loading ? (
            // Skeleton loading cards
            Array.from({ length: 10 }).map((_, i) => (
              <motion.div
                key={i}
                className="flex-shrink-0"
                style={{
                  width: "clamp(130px, 15vw, 180px)",
                  aspectRatio: "2/3",
                  borderRadius: "12px",
                  background: isDark
                    ? "rgba(200,168,233,0.1)"
                    : "rgba(233,30,140,0.08)",
                }}
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
              />
            ))
          ) : (
            anime.map((item, i) => (
              <motion.div
                key={item.mal_id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <AnimeCard
                  anime={item}
                  onAdd={onAdd}
                  onRate={onRate}
                  isInWatchlist={watchlist?.some(w => w.mal_id === item.mal_id)}
                />
              </motion.div>
            ))
          )}
        </div>

        {/* Right arrow */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => scroll(1)}
          style={{ ...btnStyle, right: "clamp(4px, 1vw, 12px)" }}
        >
          ›
        </motion.button>
      </div>
    </div>
  )
}