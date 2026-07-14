import axios from "axios"

const BASE = "https://api.jikan.moe/v4"
const cache = {}
const sleep = (ms) => new Promise(res => setTimeout(res, ms))

const fetchWithRetry = async (url, retries = 4) => {
  if (cache[url]) return cache[url]
  for (let i = 0; i < retries; i++) {
    try {
      if (i > 0) await sleep(i * 1000)
      const res = await axios.get(url)
      if (res?.data) { cache[url] = res; return res }
    } catch (err) {
      const status = err.response?.status
      if (status === 429) { await sleep(2000 * (i + 1)); continue }
      if (status === 504) { await sleep(1500 * (i + 1)); continue }
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

// Theme IDs in Jikan v4 use themes= param, genre IDs use genres= param
const THEME_IDS = new Set([16, 17, 18, 19, 20, 21, 23, 31, 32, 35, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61])

export const getByGenre = async (genreId, page = 1) => {
  const param = THEME_IDS.has(Number(genreId)) ? "themes" : "genres"
  const url = `${BASE}/anime?${param}=${genreId}&order_by=score&sort=desc&limit=25&page=${page}&sfw=true`
  await sleep(350)
  for (let i = 0; i < 4; i++) {
    try {
      const res = await axios.get(url)
      return res
    } catch (err) {
      const status = err.response?.status
      if (status === 429 || status === 504) {
        await sleep(2000 * (i + 1))
        continue
      }
      throw err
    }
  }
}

export const GENRES = {
  action: 1,
  adventure: 2,
  comedy: 4,
  drama: 8,
  fantasy: 10,
  horror: 14,
  mystery: 7,
  romance: 22,
  scifi: 24,
  sliceoflife: 36,
  sports: 30,
  supernatural: 37,
  thriller: 41,
  isekai: 62,
  magic: 16,
  mecha: 18,
  music: 19,
  psychological: 40,
  vampire: 32,
  harem: 35,
  historical: 13,
  military: 38,
  demons: 6,
  game: 11,
  parody: 20,
  samurai: 21,
  school: 23,
  space: 29,
  shounen: 27,
  shoujo: 25,
}

export const MOOD_GENRES = {
  happy: [4, 36],
  sad: [8, 40],
  excited: [1, 2],
  romantic: [22, 8],
  scared: [14, 37],
  cozy: [36, 4],
  epic: [10, 24],
  nostalgic: [13, 23],
  curious: [7, 40],
  power: [1, 62],
  magical: [16, 10],
  dark: [40, 14],
}