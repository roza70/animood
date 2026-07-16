import axios from "axios"

const BASE = "https://api.jikan.moe/v4"
const cache = {}
const sleep = (ms) => new Promise(res => setTimeout(res, ms))

const fetchWithRetry = async (url, retries = 5) => {
  if (cache[url]) return cache[url]
  for (let i = 0; i < retries; i++) {
    try {
      if (i > 0) await sleep(i * 800)
      const res = await axios.get(url)
      if (res?.data?.data) { cache[url] = res; return res }
    } catch (err) {
      const s = err.response?.status
      if (s === 429 || s === 504 || s === 503) { await sleep(2500 * (i + 1)); continue }
      if (i === retries - 1) throw err
    }
  }
}

export const getTrending = (page = 1) =>
  fetchWithRetry(`${BASE}/top/anime?filter=airing&limit=25&page=${page}`)
export const getTopRated = (page = 1) =>
  fetchWithRetry(`${BASE}/top/anime?filter=bypopularity&limit=25&page=${page}`)
export const getNewReleases = (page = 1) =>
  fetchWithRetry(`${BASE}/seasons/now?limit=25&page=${page}`)
export const getAnimeById = (id) =>
  fetchWithRetry(`${BASE}/anime/${id}/full`)
export const getAnimeCharacters = (id) =>
  fetchWithRetry(`${BASE}/anime/${id}/characters`)
export const getAnimeEpisodes = (id, page = 1) =>
  fetchWithRetry(`${BASE}/anime/${id}/episodes?page=${page}`)
export const getAnimeRelations = (id) =>
  fetchWithRetry(`${BASE}/anime/${id}/relations`)
export const searchAnime = (query, page = 1) =>
  axios.get(`${BASE}/anime?q=${encodeURIComponent(query)}&limit=25&page=${page}`)

// Jikan v4: IDs 1-20 are genres, some are themes
// Magic=16, Mecha=18, Music=19, School=23, etc are THEMES in v4
const THEME_IDS = new Set([16, 17, 18, 19, 20, 21, 23, 31, 32, 35, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61])

export const getByGenre = async (genreId, page = 1) => {
  const isTheme = THEME_IDS.has(Number(genreId))
  const param = isTheme ? "themes" : "genres"
  const url = `${BASE}/anime?${param}=${genreId}&order_by=score&sort=desc&limit=25&page=${page}&sfw=true`
  await sleep(400)
  for (let i = 0; i < 5; i++) {
    try {
      const res = await axios.get(url)
      if (res?.data?.data) return res
      await sleep(1000)
    } catch (err) {
      const s = err.response?.status
      if (s === 429 || s === 504 || s === 503) { await sleep(2500 * (i + 1)); continue }
      throw err
    }
  }
}

export const GENRES = {
  action: 1, adventure: 2, comedy: 4, drama: 8,
  fantasy: 10, horror: 14, mystery: 7, romance: 22,
  scifi: 24, sliceoflife: 36, sports: 30, supernatural: 37,
  thriller: 41, isekai: 62, magic: 16, mecha: 18,
  music: 19, psychological: 40, vampire: 32, harem: 35,
  historical: 13, military: 38, demons: 6, game: 11,
  parody: 20, samurai: 21, school: 23, space: 29,
  shounen: 27, shoujo: 25,
}

export const MOOD_GENRES = {
  happy: [4, 36], sad: [8, 40], excited: [1, 2],
  romantic: [22, 8], scared: [14, 37], cozy: [36, 4],
  epic: [10, 24], nostalgic: [13, 23], curious: [7, 40],
  power: [1, 62], magical: [16, 10], dark: [40, 14],
}