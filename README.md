# ClickRush — 60-Second Click Challenge

A full-stack click-counting game: sign up, click as fast as you can for 60 seconds, and
compete on global/daily/weekly leaderboards.

> Work in progress — being built in stages. This README will fill out with setup
> instructions, database schema, and API docs as the project nears completion.

## Stack

- **Frontend:** React + Vite + TypeScript
- **Backend:** Node.js + Express + TypeScript
- **Database:** MongoDB + Mongoose
- **Real-time:** Socket.IO
- **Auth:** JWT via httpOnly cookie

## Local development

```bash
docker compose up -d      # starts MongoDB on localhost:27017

cd server && npm install && npm run dev    # API on :4000
cd client && npm install && npm run dev    # app on :5173
```

Each of `server/` and `client/` has a `.env.example` — copy to `.env` and fill in before
running.
