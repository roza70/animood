import { useState, useEffect, useRef } from "react"
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore"
import { db } from "../firebase"

export default function useUserData(uid) {
  const [watchlist, setWatchlistState] = useState([])
  const [ratings, setRatingsState] = useState({})
  const [notes, setNotesState] = useState({})
  const [statuses, setStatusesState] = useState({})
  const [loaded, setLoaded] = useState(false)
  const dataRef = useRef({ watchlist: [], ratings: {}, notes: {}, statuses: {} })

  useEffect(() => {
    if (!uid) return

    // Real-time listener — syncs instantly across all devices
    const unsub = onSnapshot(doc(db, "userData", uid), (snap) => {
      if (snap.exists()) {
        const data = snap.data()
        const wl = data.watchlist || []
        const rt = data.ratings || {}
        const nt = data.notes || {}
        const st = data.statuses || {}
        setWatchlistState(wl)
        setRatingsState(rt)
        setNotesState(nt)
        setStatusesState(st)
        dataRef.current = { watchlist: wl, ratings: rt, notes: nt, statuses: st }
        // Also cache locally
        try {
          localStorage.setItem(`animood_watchlist_${uid}`, JSON.stringify(wl))
          localStorage.setItem(`animood_ratings_${uid}`, JSON.stringify(rt))
          localStorage.setItem(`animood_notes_${uid}`, JSON.stringify(nt))
          localStorage.setItem(`animood_statuses_${uid}`, JSON.stringify(st))
        } catch (e) {}
      } else {
        // No Firestore doc yet — try localStorage
        try {
          const wl = JSON.parse(localStorage.getItem(`animood_watchlist_${uid}`) || "[]")
          const rt = JSON.parse(localStorage.getItem(`animood_ratings_${uid}`) || "{}")
          const nt = JSON.parse(localStorage.getItem(`animood_notes_${uid}`) || "{}")
          const st = JSON.parse(localStorage.getItem(`animood_statuses_${uid}`) || "{}")
          setWatchlistState(wl)
          setRatingsState(rt)
          setNotesState(nt)
          setStatusesState(st)
          dataRef.current = { watchlist: wl, ratings: rt, notes: nt, statuses: st }
          // Push local data to Firestore if any exists
          if (wl.length > 0 || Object.keys(rt).length > 0) {
            setDoc(doc(db, "userData", uid), { watchlist: wl, ratings: rt, notes: nt, statuses: st })
              .catch(e => console.warn("Failed to push local data to Firestore", e))
          }
        } catch (e) {}
      }
      setLoaded(true)
    }, (err) => {
      // Offline fallback
      console.warn("Firestore offline, using localStorage", err)
      try {
        const wl = JSON.parse(localStorage.getItem(`animood_watchlist_${uid}`) || "[]")
        const rt = JSON.parse(localStorage.getItem(`animood_ratings_${uid}`) || "{}")
        const nt = JSON.parse(localStorage.getItem(`animood_notes_${uid}`) || "{}")
        const st = JSON.parse(localStorage.getItem(`animood_statuses_${uid}`) || "{}")
        setWatchlistState(wl)
        setRatingsState(rt)
        setNotesState(nt)
        setStatusesState(st)
        dataRef.current = { watchlist: wl, ratings: rt, notes: nt, statuses: st }
      } catch (e) {}
      setLoaded(true)
    })

    return () => unsub()
  }, [uid])

  const save = async (newData) => {
    if (!uid) return
    dataRef.current = newData
    // Save to localStorage immediately
    try {
      localStorage.setItem(`animood_watchlist_${uid}`, JSON.stringify(newData.watchlist))
      localStorage.setItem(`animood_ratings_${uid}`, JSON.stringify(newData.ratings))
      localStorage.setItem(`animood_notes_${uid}`, JSON.stringify(newData.notes))
      localStorage.setItem(`animood_statuses_${uid}`, JSON.stringify(newData.statuses))
    } catch (e) {}
    // Save to Firestore
    try {
      await setDoc(doc(db, "userData", uid), newData, { merge: true })
    } catch (err) {
      console.warn("Firestore save failed, saved locally only", err)
    }
  }

  const setWatchlist = async (updated) => {
    setWatchlistState(updated)
    await save({ ...dataRef.current, watchlist: updated })
  }

  const setRatings = async (updated) => {
    setRatingsState(updated)
    await save({ ...dataRef.current, ratings: updated })
  }

  const setNotes = async (updated) => {
    setNotesState(updated)
    await save({ ...dataRef.current, notes: updated })
  }

  const setStatuses = async (updated) => {
    setStatusesState(updated)
    await save({ ...dataRef.current, statuses: updated })
  }

  return { watchlist, ratings, notes, statuses, setWatchlist, setRatings, setNotes, setStatuses, loaded }
}
