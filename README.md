# ✦ AniMood

A Netflix-style anime discovery app that recommends anime based on your mood. Built as a full-stack portfolio project.

![AniMood Banner]

## Features

- **Dual animated worlds** — switch between a moonlit ocean princess theme (dark mode) and a sakura field prince theme (light mode), each with looping video backgrounds and ambient quote bubbles
- **Mood-based discovery** — pick from 12 moods (Happy, Sad, Excited, Romantic, Scared, Cozy, Epic, Nostalgic, Curious, Power, Magical, Dark) to get tailored anime recommendations
- **Browse** — search by name or explore 28 genres, with unlimited "Load More" pagination
- **Netflix-style rows** — 21 curated rows (Trending, Top Rated, New Releases, and genre-specific rows) with horizontal scroll and lazy loading
- **Anime detail pages** — trailer playback, synopsis, stats, character list with voice actors, full episode list with personal 1–10 ratings, and a personal notes section
- **My Anime List** — MAL-style status tracking (Watching / Completed / On Hold / Dropped / Plan to Watch), a 5-tier rating system (Masterpiece → Worst), and a Stats tab with pie and bar charts
- **Persistent data** — watchlist, ratings, statuses, episode ratings, and notes are all saved per-user in localStorage

## Tech Stack

- **Frontend:** React + Vite, Tailwind CSS, Framer Motion
- **Routing:** React Router DOM
- **Data:** Jikan API (MyAnimeList), Axios
- **Charts:** Recharts
- **Storage:** localStorage (per-user keys)

## Screenshots

| Dark Mode (Princess) | Light Mode (Prince) |
|---|---|
| ![Dark hero](./screenshots/hero-dark.png) | ![Light hero](./screenshots/hero-light.png) |

| Browse | Anime Detail |
|---|---|
| ![Browse](./screenshots/browse.png) | ![Detail](./screenshots/detail.png) |

| My List | Stats |
|---|---|
| ![My List](./screenshots/mylist.png) | ![Stats](./screenshots/stats.png) |

## Getting Started

```bash
git clone https://github.com/roza70/animood.git
cd animood
npm install
npm run dev
```

The app runs on `http://localhost:5173` by default.

## Project Structure

```
src/
├── api/jikan.js              # Jikan API client with caching + retry logic
├── components/
│   ├── AnimeCard.jsx
│   ├── AnimeRow.jsx
│   ├── MoodPicker.jsx
│   ├── Navbar.jsx
│   ├── Background/           # Dual world video backgrounds
│   └── Character/             # DarkCharacter / LightCharacter components
├── context/                   # Theme, Auth, Watchlist contexts
├── pages/
│   ├── Landing.jsx
│   ├── Home.jsx
│   ├── Browse.jsx
│   ├── AnimeDetail.jsx
│   └── MyList.jsx
└── App.jsx
```

## Author

Built by Tahsin Akter Roza 

## License

This project is for portfolio/educational purposes. Anime data is provided by [Jikan API](https://jikan.moe) (unofficial MyAnimeList API).
