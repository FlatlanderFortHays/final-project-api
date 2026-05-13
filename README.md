# US States REST API — INF653 Final Project

A Node.js / Express / MongoDB REST API serving data on the 50 US states, with persistent "fun facts" stored in MongoDB.

## Stack

- Node.js
- Express 4
- Mongoose / MongoDB Atlas
- dotenv, cors

## Setup

1. `npm install`
2. Create a `.env` file at the project root (see `.env.example`):
   ```
   DATABASE_URI=mongodb+srv://USER:PASS@cluster.mongodb.net/states?retryWrites=true&w=majority
   PORT=3500
   ```
3. `npm run seed` — seeds fun facts for Kansas, Missouri, Oklahoma, Nebraska, and Colorado.
4. `npm start` (production) or `npm run dev` (with nodemon).

## Endpoints

### GET

| Route | Description |
| --- | --- |
| `/states/` | All 50 states |
| `/states/?contig=true` | Contiguous states (excludes AK, HI) |
| `/states/?contig=false` | Non-contiguous states (AK, HI) |
| `/states/:state` | One state, including fun facts |
| `/states/:state/funfact` | Random fun fact |
| `/states/:state/capital` | `{ state, capital }` |
| `/states/:state/nickname` | `{ state, nickname }` |
| `/states/:state/population` | `{ state, population }` (comma-formatted) |
| `/states/:state/admission` | `{ state, admitted }` |

### POST `/states/:state/funfact`

Body: `{ "funfacts": ["fact one", "fact two"] }`

### PATCH `/states/:state/funfact`

Body: `{ "index": 1, "funfact": "replacement text" }` &mdash; `index` is **not** zero-based.

### DELETE `/states/:state/funfact`

Body: `{ "index": 1 }` &mdash; `index` is **not** zero-based.

The `:state` parameter is a two-letter state abbreviation (e.g. `KS`, `NE`, `TX`).

## Deployment

Deployed to Render. The free tier sleeps after 15 minutes of inactivity, so the first request after sleep can take ~30 seconds to wake the dyno.

Set `DATABASE_URI` in the Render dashboard under **Environment**. `PORT` is injected by Render automatically.
