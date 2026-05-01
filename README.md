# 🎮 Telegram Mini Roblox - Production Gaming Platform

A clean, scalable Telegram Mini App gaming platform featuring multiple HTML5 games with real-time leaderboards, user authentication via Telegram, and a modular architecture.

## 🏗️ Architecture

```
Telegram User
   ↓
Telegram Bot (Telegraf)
   ↓
Mini App (Next.js frontend)
   ↓
Backend API (Express.js)
   ↓
Database (PostgreSQL)
```

## 🎮 Games Included

- **2048** - Classic number puzzle game
- **Hextris** - Fast-paced hex matching
- **Flappy Bird Clone** - Classic bird arcade
- **Microgames** - Quick mini-games collection

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Telegram Bot Token (from @BotFather)

### Installation

```bash
# Clone and install
git clone https://github.com/nomadbeats/Miniapp.git
cd Miniapp
npm install

# Setup environment
cp .env.example .env
# Edit .env with your values

# Setup database
cd backend
npm run db:migrate

# Run all services
npm run dev
```

### Deployment

**Frontend (Vercel):**
```bash
cd frontend
vercel deploy
```

**Backend (Railway/Render):**
```bash
cd backend
# Push to Git → Railway auto-deploys
```

**Bot (Any VPS):**
```bash
cd bot
npm run start
```

## 📁 Project Structure

```
.
├── frontend/          # Next.js React app
├── backend/           # Express.js API
├── bot/              # Telegraf bot
├── shared/           # Shared types
└── docs/             # Documentation
```

## 🔑 Key Features

✅ **Telegram Auth** - Instant login via Telegram ID  
✅ **Multi-Game** - Seamless tab switching  
✅ **Leaderboards** - Global & per-game rankings  
✅ **Score Validation** - Cheat prevention  
✅ **Mobile-First** - Optimized for Telegram browser  
✅ **Zero Signup** - Auto-login for users  

## 🛠️ Tech Stack

| Layer | Tech | Why |
|-------|------|-----|
| Frontend | Next.js + Tailwind | Fast, SSR-ready, Telegram SDK native |
| Backend | Express.js + PostgreSQL | Lightweight, structured data |
| Bot | Telegraf | Official Telegram framework |
| Deployment | Vercel + Railway | Scalable, serverless-ready |

## 📖 Documentation

- [Backend Setup](./docs/BACKEND.md)
- [Frontend Setup](./docs/FRONTEND.md)
- [Bot Setup](./docs/BOT.md)
- [API Reference](./docs/API.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)

## 🔒 Security

- ✅ Telegram initData validation
- ✅ Score verification on backend
- ✅ Rate limiting on API
- ✅ HTTPS only
- ✅ Environment variable isolation

## 📊 Database Schema

```sql
-- Users
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  telegram_id BIGINT UNIQUE NOT NULL,
  username VARCHAR(255),
  first_name VARCHAR(255),
  total_score INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Scores
CREATE TABLE scores (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id),
  game_name VARCHAR(50),
  score INT,
  submitted_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, game_name)
);

-- Leaderboard (cached materialized view)
CREATE MATERIALIZED VIEW leaderboard AS
SELECT u.telegram_id, u.username, u.total_score,
       ROW_NUMBER() OVER (ORDER BY u.total_score DESC) as rank
FROM users u;
```

## 🎯 API Endpoints

### Auth
- `POST /api/auth/login` - Validate Telegram initData

### Scores
- `POST /api/scores/submit` - Submit game score
- `GET /api/scores/user/:id` - Get user stats
- `GET /api/scores/leaderboard` - Global leaderboard
- `GET /api/scores/game/:name` - Per-game leaderboard

### Users
- `GET /api/users/:id` - User profile

## 🤝 Contributing

Pull requests welcome! Please follow the modular structure.

## 📄 License

MIT

## 🎪 Support

Questions? Open an issue or check the docs folder.
