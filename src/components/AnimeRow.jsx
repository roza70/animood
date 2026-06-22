import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { useTheme } from "../context/ThemeContext"
import AnimeCard from "./AnimeCard"

export default function AnimeRow({ title, fetchFn, watchlist, onAdd, onRate, onNote, notes, emoji, onCardClick }) {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const [anime, setAnime] = useState([])
  const [loading, setLoading] = useState(true)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [visible, setVisible] = useState(false)
  const rowRef = useRef(null)
  const containerRef = useRef(null)

  // Intersection observer — only load when row is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !visible) setVisible(true)
      },
      { threshold: 0.1 }
    )
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  // Fetch only when visible
  useEffect(() => {
    if (!visible) return
    let cancelled = false
    const load = async () => {
      try {
        setLoading(true)
        const res = await fetchFn()
        if (!cancelled) setAnime(res.data.data || [])
      } catch (err) {
        console.error(err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [visible])

  const checkScroll = () => {
    if (!rowRef.current) return
    setCanScrollLeft(rowRef.current.scrollLeft > 0)
    setCanScrollRight(
      rowRef.current.scrollLeft < rowRef.current.scrollWidth - rowRef.current.clientWidth - 10
    )
  }

  const scroll = (dir) => {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: dir * 500, behavior: "smooth" })
      setTimeout(checkScroll, 400)
    }
  }

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight") scroll(1)
      if (e.key === "ArrowLeft") scroll(-1)
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [])

  const btnStyle = (isVisible) => ({
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 10,
    width: "clamp(32px, 4vw, 44px)",
    height: "clamp(32px, 4vw, 44px)",
    borderRadius: "50%",
    border: "none",
    cursor: isVisible ? "pointer" : "default",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    background: isDark ? "rgba(10,5,40,0.92)" : "rgba(255,240,245,0.92)",
    color: isDark ? "#c8a8e9" : "#e91e8c",
    boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
    backdropFilter: "blur(10px)",
    opacity: isVisible ? 1 : 0,
    transition: "opacity 0.3s",
    pointerEvents: isVisible ? "auto" : "none",
  })

  return (
    <div ref={containerRef} style={{ marginBottom: "clamp(24px, 4vw, 40px)" }}>
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
          style={{ ...btnStyle(canScrollLeft), left: "clamp(4px, 1vw, 8px)" }}
        >
          ‹
        </motion.button>

        {/* Cards */}
        <div
          ref={rowRef}
          onScroll={checkScroll}
          style={{
            display: "flex",
            gap: "clamp(8px, 1.5vw, 14px)",
            overflowX: "auto",
            overflowY: "visible",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            padding: "12px clamp(40px, 5vw, 60px) 20px",
            scrollSnapType: "x mandatory",
          }}
        >
          <style>{`div::-webkit-scrollbar { display: none; }`}</style>

          {loading ? (
            Array.from({ length: 10 }).map((_, i) => (
              <motion.div
                key={i}
                style={{
                  width: "clamp(130px, 15vw, 180px)",
                  aspectRatio: "2/3",
                  borderRadius: "12px",
                  flexShrink: 0,
                  scrollSnapAlign: "start",
                  background: isDark ? "rgba(200,168,233,0.1)" : "rgba(233,30,140,0.08)",
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
                transition={{ delay: i * 0.03 }}
                style={{ flexShrink: 0, scrollSnapAlign: "start" }}
                onClick={() => onCardClick && onCardClick(item)}
              >
                <AnimeCard
                  anime={item}
                  onAdd={onAdd}
                  onRate={onRate}
                  onNote={onNote}
                  isInWatchlist={watchlist?.some(w => w.mal_id === item.mal_id)}
                  userNote={notes?.[item.mal_id]}
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
          style={{ ...btnStyle(canScrollRight), right: "clamp(4px, 1vw, 8px)" }}
        >
          ›
        </motion.button>
      </div>

      {/* Scroll indicator dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 8 }}>
        {[canScrollLeft, (!canScrollLeft && canScrollRight), !canScrollRight].map((active, i) => (
          <motion.div
            key={i}
            style={{
              height: 3, borderRadius: 2,
              background: isDark ? "#c8a8e9" : "#e91e8c",
              transition: "all 0.3s",
              width: active ? 40 : 20,
              opacity: active ? 0.9 : 0.3,
            }}
          />
        ))}
      </div>
    </div>
  )
}