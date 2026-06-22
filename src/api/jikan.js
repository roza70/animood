import axios from "axios"

const BASE = "https://api.jikan.moe/v4"

const delay = (ms) => new Promise(res => setTimeout(res, ms))

const cache = {}

const fetchWithCache = async (url) => {
  if (cache[url]) return cache[url]
  const res = await axios.get(url)
  cache[url] = res
  return res
}

export const getTrending = () => fetchWithCache(`${BASE}/top/anime?filter=airing&limit=25`)
export const getTopRated = () => fetchWithCache(`${BASE}/top/anime?filter=bypopularity&limit=25`)
export const getNewReleases = () => fetchWithCache(`${BASE}/seasons/now?limit=25`)
export const getAnimeById = (id) => fetchWithCache(`${BASE}/anime/${id}`)
export const searchAnime = (query) => axios.get(`${BASE}/anime?q=${query}&limit=25`)

export const getByGenre = async (genreId) => {
  await delay(500)
  return fetchWithCache(`${BASE}/anime?genres=${genreId}&order_by=score&sort=desc&limit=25&page=1`)
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