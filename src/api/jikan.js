import axios from "axios"

const BASE = "https://api.jikan.moe/v4"

export const getTrending = () => axios.get(`${BASE}/top/anime?filter=airing&limit=20`)
export const getTopRated = () => axios.get(`${BASE}/top/anime?filter=bypopularity&limit=20`)
export const getNewReleases = () => axios.get(`${BASE}/seasons/now?limit=20`)
export const getByGenre = (genreId) => axios.get(`${BASE}/anime?genres=${genreId}&order_by=score&limit=20`)
export const searchAnime = (query) => axios.get(`${BASE}/anime?q=${query}&limit=20`)
export const getAnimeById = (id) => axios.get(`${BASE}/anime/${id}`)

// All Genre IDs from MyAnimeList
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
  mahou: 16,      // magical girls
  mecha: 18,
  music: 19,
  psychological: 40,
  vampire: 32,
  ecchi: 9,
  harem: 35,
  historical: 13,
  military: 38,
  demons: 6,
  game: 11,
  parody: 20,
  samurai: 21,
  school: 23,
  space: 29,
}

// Mood to genre mapping
export const MOOD_GENRES = {
  happy: [4, 36],         // comedy, slice of life
  sad: [8, 40],           // drama, psychological
  excited: [1, 2],        // action, adventure
  romantic: [22, 8],      // romance, drama
  scared: [14, 37],       // horror, supernatural
  cozy: [36, 4],          // slice of life, comedy
  epic: [10, 24],         // fantasy, sci-fi
  nostalgic: [13, 23],    // historical, school
  curious: [7, 40],       // mystery, psychological
  power: [1, 62],         // action, isekai
  magical: [16, 10],      // mahou shoujo, fantasy
  dark: [40, 14],         // psychological, horror
}