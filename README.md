# CricTrack 🏏

> Built for the way real cricket is actually played.

<div align="center">

**[Live App](https://cricket-tracker-alpha.vercel.app/)** &nbsp;·&nbsp; **[GitHub](https://github.com/LawishBhatia2501/cricket-tracker)**


</div>

---

## What is CricTrack?

Every cricket scoring app assumes both teams are locked before the match starts, overs never change, and no player can appear in both sides. None of that is true in turf cricket, college cricket, or gully cricket.

CricTrack is a real-time match management platform built specifically for local cricket — where a player shows up late, overs get renegotiated mid-game, and one person genuinely plays for both teams. It handles the full match lifecycle from toss to career stats, syncing every delivery instantly across all connected devices via WebSockets.

---

## Screenshots

<table>
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/e9146ae9-13f6-491c-8063-c4c27590e970" alt="Live Scoring"/>
      <br/><sub><b>Live Scoring — Umpire View</b></sub>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/08efdf03-c586-45a9-97dc-891b924a52b6" alt="Over Break"/>
      <br/><sub><b>Over Break — Bowler Selection</b></sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/35649fdc-398d-41c6-8e58-50475da02a2b" alt="Match Setup"/>
      <br/><sub><b>Match Setup — Joker Player Selection</b></sub>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/e6dabdce-a0ad-4159-8641-1c70e078cea4" alt="Match Summary"/>
      <br/><sub><b>Match Summary — Top Performers</b></sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/db3f4b7a-f37c-46a1-9fd0-01f8550329c6" alt="The Dugout"/>
      <br/><sub><b>The Dugout — Career Stats Table</b></sub>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/261762da-9614-4753-b68a-693ae1b602d9" alt="Player Card"/>
      <br/><sub><b>Player Card — Flip for Batting / Bowling</b></sub>
    </td>
  </tr>
</table>

---

## Why CricTrack Exists

| What other apps assume | What actually happens in local cricket |
|---|---|
| Both squads locked before match | Players show up late — add them mid-game |
| Overs never change | "Let's make it 8 overs" after over 3 |
| No player on both teams | One strong player bats and bowls for both sides |
| Substitutions follow official rules | Bench a batter, bring them back later |

CricTrack is the only scoring platform built around these realities.

---

## Features

### 🔐 Auth & Groups
- Register, login, password reset, profile update with photo
- Create groups with auto-generated 6-character invite codes
- Admin and member roles — manage your regular playing group
- Per-group career statistics completely isolated across groups

### 🏟️ Match Lifecycle
- Full status pipeline — **Upcoming → Toss → Live → Innings Break → Completed**
- Coin flip animation with bat/bowl choice
- Create upcoming matches in advance or start immediately

### ⚡ Live Scoring
- Record every delivery — runs, wides, no-balls, byes, leg-byes, wickets
- Automatic strike rotation including end-of-over and odd-run edge cases
- **Bench a batter** mid-innings — retired not out, can return later
- **Bench and replace** — swap a batter atomically in a single socket event
- Undo last delivery with full state restoration including bench state

### 🃏 Joker Player *(no other app does this)*
- Designate one player to appear in **both teams** within a single match
- Joker bats for their primary team and bowls for the opposition
- Career statistics tracked separately per innings — no double-counting
- Set or dissolve joker status at any over break

### ⚙️ Mid-Match Flexibility *(no other app does this)*
- **Change total overs** at any over break — increase or decrease freely
- **Add players** to either team mid-game — late arrivals handled natively
- **Reshuffle players** between teams at over break
- All changes reflected instantly on every connected device

### 📺 Live Scoreboard
- Real-time score, batting pair, current bowler, overs, run rate
- Ball-by-ball over chip display
- Second innings target, required run rate, balls remaining
- Shareable viewer link — opens live match feed in any browser

### 🏆 The Dugout
- Per-group batting career stats — runs, balls, strike rate, fours, sixes, 30s/50s/100s
- Per-group bowling career stats — overs, wickets, economy, 3W/4W/5W hauls, best figures
- Flip card per player — batting side and bowling side in one card
- Search and filter across your entire group player pool

### 📊 Match Summary
- Full scorecard for both innings with fall of wickets
- Man of the Match scoring across batting and bowling contributions
- Top Performers — top scorer, top wickets, best economy, best strike rate

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 7, React Router DOM 7, Tailwind CSS 4 |
| Backend | Node.js, Express 4 |
| Real-time | Socket.IO 4 — WebSocket-only transport |
| Database | MongoDB Atlas via Mongoose 8 |
| Auth | JWT (15-day sessions), bcryptjs |
| Security | Helmet, express-rate-limit, Socket.IO JWT handshake auth |
| Deployment | Vercel (frontend) · Render (backend) |

---

## Architecture Decisions

**Why embedded player snapshots in Match documents?**
Avoids `populate()` on the hot scoring path. Every delivery handler reads and writes a single document — no joins, no risk of stale references mid-over.

**Why `GroupPlayerStats` separate from `Player`?**
The same player can have entirely different histories in different groups. A single global stats document would be meaningless — career stats are only useful within the context of a consistent group of players.

**Why atomic bench+replace in one socket event?**
Splitting bench and replace into two events creates a window where a delivery could be recorded between them, placing a ball with a vacant crease position. A single `benchAndReplace` event eliminates this race condition entirely.

**Why the Joker is tracked as two `playerStats` entries?**
One entry per team. Bowling stats route to the bowling-team entry, batting stats route to the batting-team entry. No special-casing needed downstream — all existing stat aggregation logic works without modification.

**Why VersionError retry with exponential backoff on Socket.IO handlers?**
Concurrent delivery events from multiple clients (umpire + scorer) can hit the same Mongoose document version. Three retries at 20ms, 50ms, 80ms intervals resolve conflicts without a distributed lock, keeping the handler stateless.

**Why deterministic stat recalculation at match end?**
Stats computed from the match record at completion, not accumulated live. Undos, corrections, and mid-match changes never produce drift — the final number is always exactly derivable from the timeline.

**Why WebSocket-only transport?**
Long-polling disabled to eliminate the HTTP upgrade round-trip on mobile networks. Players score from their phones on the field — every millisecond of latency is felt.

---

## Project Structure

```
cricket-tracker/
│
├── backend/
│   └── src/
│       ├── config/         # MongoDB Atlas connection
│       ├── controllers/    # Auth, match, player, group handlers
│       ├── middleware/     # JWT Bearer token verification
│       ├── models/
│       │   ├── Match.js            # Embedded player snapshots
│       │   ├── GroupPlayerStats.js # Per-group career stats
│       │   ├── Group.js            # Invite code, member roles
│       │   ├── Player.js
│       │   └── User.js
│       ├── routes/         # Express route definitions
│       ├── sockets/
│       │   └── matchSocket.js  # All live match event handlers
│       ├── utils/
│       │   └── statsUpdater.js # Deterministic stat recalculation
│       └── server.js       # Express + Socket.IO entry point
│
└── frontend/
    └── src/
        ├── components/     # BottomSheet, OverBreakDrawer, BottomNav
        ├── context/        # AuthContext, ActiveGroupContext
        ├── hooks/          # usePageCache
        ├── pages/          # UmpireScorerPage, ScoreboardPage,
        │                   # PlayerProfilesPage (Dugout), HomePage
        ├── routes/         # RequireAuth guard
        ├── services/       # API client, Socket.IO client
        └── utils/          # Match result calculation
```

---

## Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas cluster (free tier works)

### Clone

```bash
git clone https://github.com/LawishBhatia2501/cricket-tracker.git
cd cricket-tracker
```

### Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
JWT_SECRET=your_jwt_secret_here
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
MONGODB_URI=your_mongodb_atlas_connection_string
```

```bash
npm run dev
# Runs on http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```env
VITE_API_BASE_URL=http://localhost:5000
```

```bash
npm run dev
# Runs on http://localhost:5173
```

---

## Environment Variables

### Backend — `backend/.env`

| Variable | Purpose |
|---|---|
| `JWT_SECRET` | Secret key for signing JWTs |
| `PORT` | Server port (default: `5000`) |
| `CLIENT_ORIGIN` | CORS allowed origin |
| `MONGODB_URI` | MongoDB Atlas connection string |

### Frontend — `frontend/.env.local`

| Variable | Purpose |
|---|---|
| `VITE_API_BASE_URL` | Backend base URL |

---

## API Reference

### Auth — `/api/auth`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/register` | Register new user |
| POST | `/login` | Login |
| GET | `/me` | Get current user |
| PUT | `/profile` | Update name, email, photo |
| POST | `/reset-password` | Reset password |

### Groups — `/api/groups`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/` | Create group |
| GET | `/` | List user's groups |
| POST | `/join` | Join via invite code |
| POST | `/:groupId/leave` | Leave group |
| GET | `/:groupId/players` | List group players |
| POST | `/:groupId/players` | Add player to group |
| DELETE | `/:groupId/players/:id` | Remove player |

### Matches — `/api/match`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/` | Create match |
| GET | `/live` | List live matches |
| GET | `/upcoming` | List upcoming matches |
| GET | `/completed` | List completed matches |
| GET | `/:id` | Get match details |
| DELETE | `/:id` | Delete match |

### Players — `/api/players`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | List all players |
| POST | `/` | Create player |
| GET | `/by-group/:groupId` | Players with career stats |

---

## Socket.IO Events

### Client → Server

| Event | Purpose |
|---|---|
| `joinMatch` | Join match room, receive full state |
| `tossResult` | Finalize toss |
| `setOpeners` | Set opening lineup |
| `setNewBatter` | Bring in batter after wicket or bench return |
| `setNewBowler` | Select bowler for new over |
| `umpire_update` | Record a delivery |
| `benchBatter` | Bench a batter |
| `benchAndReplace` | Bench and replace atomically |
| `overBreakCommit` | Commit over break — bowler, overs, players, joker |
| `swapStriker` | Manually rotate strike |
| `undo_delivery` | Undo last ball |
| `complete_match` | Mark match completed |

### Server → Client

| Event | Purpose |
|---|---|
| `matchState` | Full match state broadcast |
| `overBreakStarted` | Over break begun |
| `inningsBreakStarted` | Second innings starting |
| `innings_complete` | First innings ended |
| `match_completed` | Final result and career stats updated |
| `groupMatchUpdate` | Group-level match status change |
| `matchError` | Error with message |

---

## Roadmap

- [ ] Scorecard sharing as image export
- [ ] Push notifications for live match updates
- [ ] Tournament bracket and points table
- [ ] Match highlights reel — auto-generated from wickets and big hits
- [ ] DLS method for rain-affected matches

## Known Limitations

- Password reset is name + email match only — no OTP email flow yet
- No offline delivery queue — balls recorded during disconnect are lost on that session
- Scoreboard viewer requires login — public shareable link planned

---

<div align="center">

Built with React · Node.js · Socket.IO · MongoDB Atlas  
Deployed on Render + Vercel

**[Play a match →](https://cricket-tracker-rosy.vercel.app/)**

</div>
