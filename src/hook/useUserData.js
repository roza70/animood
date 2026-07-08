import { useState, useEffect } from "react"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "../firebase"

// Syncs watchlist, ratings, notes, statuses to Firestore
// Falls back to localStorage if offline
export default function useUserData(uid) {
  const [watchlist, setWatchlistState] = useState([])
  const [ratings, setRatingsState] = useState({})
  const [notes, setNotesState] = useState({})
  const [statuses, setStatusesState] = useState({})
  const [loaded, setLoaded] = useState(false)

  // Load from Firestore on mount
  useEffect(() => {
    if (!uid) return
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, "userData", uid))
        if (snap.exists()) {
          const data = snap.data()
          setWatchlistState(data.watchlist || [])
          setRatingsState(data.ratings || {})
          setNotesState(data.notes || {})
          setStatusesState(data.statuses || {})
        }
      } catch (err) {
        // Offline — fall back to localStorage
        console.warn("Firestore offline, using localStorage", err)
        setWatchlistState(JSON.parse(localStorage.getItem(`animood_watchlist_${uid}`) || "[]"))
        setRatingsState(JSON.parse(localStorage.getItem(`animood_ratings_${uid}`) || "{}"))
        setNotesState(JSON.parse(localStorage.getItem(`animood_notes_${uid}`) || "{}"))
        setStatusesState(JSON.parse(localStorage.getItem(`animood_statuses_${uid}`) || "{}"))
      }
      setLoaded(true)
    }
    load()
  }, [uid])

  const save = async (data) => {
    if (!uid) return
    // Always save to localStorage as backup
    localStorage.setItem(`animood_watchlist_${uid}`, JSON.stringify(data.watchlist))
    localStorage.setItem(`animood_ratings_${uid}`, JSON.stringify(data.ratings))
    localStorage.setItem(`animood_notes_${uid}`, JSON.stringify(data.notes))
    localStorage.setItem(`animood_statuses_${uid}`, JSON.stringify(data.statuses))
    // Save to Firestore
    try {
      await setDoc(doc(db, "userData", uid), data, { merge: true })
    } catch (err) {
      console.warn("Firestore save failed, data saved locally", err)
    }
  }

  const setWatchlist = async (updated) => {
    setWatchlistState(updated)
    await save({ watchlist: updated, ratings, notes, statuses })
  }

  const setRatings = async (updated) => {
    setRatingsState(updated)
    await save({ watchlist, ratings: updated, notes, statuses })
  }

  const setNotes = async (updated) => {
    setNotesState(updated)
    await save({ watchlist, ratings, notes: updated, statuses })
  }

  const setStatuses = async (updated) => {
    setStatusesState(updated)
    await save({ watchlist, ratings, notes, statuses: updated })
  }

  return { watchlist, ratings, notes, statuses, setWatchlist, setRatings, setNotes, setStatuses, loaded }
}
