# Videoselz — Video Analytics Dashboard

A dashboard for e-commerce merchants to track how their shoppable videos are
performing — views, clicks, and add-to-cart conversions, aggregated per
video and visualized as a proportional funnel bar.

## Tech stack

| Layer     | Choice                                                        |
| --------- | -------------------------------------------------------------- |
| Backend   | Node.js, Express, TypeScript, TypeORM, PostgreSQL              |
| Frontend  | React, TypeScript, Vite, CSS Modules (no utility CSS framework) |
| Database  | PostgreSQL                                                      |

The assignment allowed any SQL database — Postgres + TypeORM was chosen over
a lighter option like SQLite for a schema closer to what a production
analytics service would actually run on, with proper foreign keys and an
enum column for event types.

## Project structure

```
videoselz-dashboard/
├── server/          # Express + TypeORM API
│   ├── src/
│   │   ├── entities/       # Product, Video, EngagementEvent
│   │   ├── routes/         # analytics.ts, events.ts
│   │   ├── seed/            # seed script for sample data
│   │   ├── data-source.ts  # TypeORM connection config
│   │   └── index.ts         # app entry point
│   └── .env.example
├── client/          # React + Vite dashboard
│   ├── src/
│   │   ├── components/      # VideoTable, FunnelBar, Pagination, SimulateTrafficButton
│   │   ├── api/              # fetch wrapper for the backend
│   │   └── App.tsx
│   └── .env.example
└── AI_PROMPTING.md   # log of AI-assisted development
└── README.md
```

## Prerequisites

- Node.js 18+
- A running local PostgreSQL instance
- npm

## Setup — Backend

1. Create a database for the project:

   ```bash
   createdb videoselz
   ```

   (Or create it through `psql`, pgAdmin, or whatever client you use — the
   database just needs to exist before the app connects.)

2. Install dependencies and configure environment variables:

   ```bash
   cd server
   npm install
   cp .env.example .env
   ```

   Open `.env` and set `DB_USERNAME` / `DB_PASSWORD` / `DB_NAME` to match
   your local Postgres setup. Defaults assume a standard local install on
   port 5432.

3. Seed the database with sample products, videos, and a realistic spread
   of engagement events (more views than clicks, more clicks than
   conversions — like a real funnel):

   ```bash
   npm run seed
   ```

   This truncates and re-seeds the three tables, so it's safe to re-run
   whenever you want a fresh dataset.

4. Start the API:

   ```bash
   npm run dev
   ```

   The server runs at `http://localhost:4000`. TypeORM's `synchronize`
   option is enabled for this project, so the schema is created
   automatically on first connect — no separate migration step needed for
   local setup. (A production version of this app would swap that for
   proper versioned migrations.)

5. Confirm it's alive:

   ```bash
   curl http://localhost:4000/health
   # {"status":"ok"}
   ```

### API endpoints

**`POST /api/events`**
Ingests a single engagement event.

```json
{ "videoId": "<uuid>", "eventType": "view" }
```

`eventType` must be one of `view`, `click`, `add_to_cart`. Returns `404` if
the video doesn't exist and `400` on a missing or invalid field.

**`GET /api/analytics/videos?page=1&limit=10`**
Returns videos with aggregated views, clicks, and add-to-cart counts, plus
pagination metadata:

```json
{
  "data": [
    {
      "id": "…",
      "title": "Classic Denim Jacket - Shoppable Demo",
      "videoUrl": "…",
      "productName": "Classic Denim Jacket",
      "views": 41,
      "clicks": 12,
      "conversions": 5
    }
  ],
  "pagination": { "page": 1, "limit": 10, "total": 5, "totalPages": 1 }
}
```

## Setup — Frontend

1. Install dependencies and configure environment variables:

   ```bash
   cd client
   npm install
   cp .env.example .env
   ```

   `VITE_API_URL` defaults to `http://localhost:4000` — only change it if
   your backend is running somewhere else.

2. Start the dev server:

   ```bash
   npm run dev
   ```

   The dashboard runs at `http://localhost:5173`. Make sure the backend is
   running first, since the table fetches from it on load.

3. To build for production:

   ```bash
   npm run build
   npm run preview
   ```

## Using the dashboard

- The table lists every video with its aggregated metrics and a **funnel
  bar** — a single proportional bar showing the views → clicks → add-to-cart
  split, so you can spot a video that gets views but doesn't convert at a
  glance.
- **Conversion rate** is calculated client-side as `add_to_cart / views`,
  shown as a dash when a video has no views yet.
- **Simulate traffic** fires a random engagement event against a random
  video on the current page, then refreshes the table — the affected row's
  funnel bar briefly highlights so you can see the update land.
- Pagination controls at the bottom move between pages of results, backed
  by the API's `page`/`limit` query params.

## Design notes

Styling constraint from the brief: no Tailwind or other utility-class
framework — this uses CSS Modules throughout, scoped per component.

The one visual idea this project leans on is the funnel bar: instead of
three separate numeric columns doing all the communicating, the bar turns
the funnel shape into something you can read in a glance across a whole
page of videos.

## Other public projects

- GitHub: [github.com/kundan761](https://github.com/kundan761)
- Portfolio: [kundan761.github.io](https://kundan761.github.io)
- Trendsetter: [Link](https://github.com/kundan761/Trendsetter)
- Pingify: [Link](https://github.com/kundan761/Pingify)
- Please refer my portfolio for more projects and details.


## Video links

- **Candidate pitch (YouTube):**  [Link](https://www.loom.com/share/d01b4a2018b4499ba9b7299b8b51e8ef)
- **Technical walkthrough (Loom):** [Link](https://www.loom.com/share/d01b4a2018b4499ba9b7299b8b51e8ef)

## AI collaboration

See [`AI_PROMPTING.md`](./AI_PROMPTING.md) for the running log of AI tool
usage during this project — tasks, prompts, and what was adjusted
afterward.
