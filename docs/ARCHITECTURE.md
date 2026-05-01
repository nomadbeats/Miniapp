# Architecture Deep Dive

## System Design

### Data Flow

```
1. USER OPENS TELEGRAM
   └─ Clicks "Play Games" button
   └─ Opens WebApp (Next.js frontend)

2. FRONTEND INITIALIZATION
   └─ Telegram.WebApp.ready()
   └─ Extract initData
   └─ Send to backend for validation

3. AUTHENTICATION
   └─ Backend validates initData signature
   └─ Creates/updates user in DB
   └─ Returns JWT token

4. GAME LOADING
   └─ Frontend lazy-loads game component
   └─ Game runs in isolated container
   └─ User plays

5. SCORE SUBMISSION
   └─ Game finishes
   └─ Frontend sends score to API
   └─ Backend validates score (server-side rules)
   └─ Updates leaderboard
   └─ Frontend shows ranking
```

## Component Architecture

### Frontend (Next.js)

```
app/
├── layout.tsx              # Root layout with Telegram SDK
├── page.tsx                # Main game hub
├── games/
│   ├── 2048/
│   │   ├── page.tsx
│   │   └── GameComponent.tsx
│   ├── hextris/
│   ├── flappybird/
│   └── microgames/
├── leaderboard/
│   └── page.tsx
├── api/
│   ├── auth/
│   ├── scores/
│   └── users/
└── components/
    ├── GameTabs.tsx
    ├── ScoreDisplay.tsx
    ├── Leaderboard.tsx
    └── ui/
```

### Backend (Express)

```
src/
├── index.ts               # Server entry
├── middleware/
│   ├── auth.ts           # JWT verification
│   ├── validate.ts       # Score validation
│   └── rateLimit.ts      # Rate limiting
├── routes/
│   ├── auth.ts
│   ├── scores.ts
│   └── users.ts
├── controllers/
│   ├── authController.ts
│   ├── scoresController.ts
│   └── usersController.ts
├── models/
│   ├── User.ts
│   └── Score.ts
├── db/
│   ├── connection.ts
│   ├── migrations/
│   └── seeds/
└── utils/
    ├── telegramAuth.ts
    ├── scoreValidator.ts
    └── logger.ts
```

### Bot (Telegraf)

```
src/
├── index.ts               # Bot entry
├── commands/
│   ├── start.ts          # /start command
│   ├── play.ts           # /play command
│   └── leaderboard.ts    # /leaderboard command
├── handlers/
│   ├── webApp.ts         # WebApp button handler
│   └── callback.ts       # Callback queries
└── utils/
    └── buttons.ts        # Keyboard layouts
```

## Security Model

### 1. Authentication Layer

```typescript
// Frontend sends initData to backend
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  body: JSON.stringify({
    initData: window.Telegram.WebApp.initData
  })
});

// Backend validates signature
// Uses bot token as HMAC key
// Ensures request is from Telegram servers
```

### 2. Score Validation

```typescript
// Prevent score spoofing via:
// 1. Server-side game rules check
// 2. Timestamp validation (< 5min submit time)
// 3. Rate limiting per user per game
// 4. Impossible score detection (e.g., 999999 in 2048)
```

### 3. Token Management

```typescript
// JWT tokens:
// - Short-lived (15 min access token)
// - Refresh tokens stored in httpOnly cookies
// - Revocable on logout
```

## Game Integration Pattern

Each game follows this pattern:

```typescript
// Game Component receives:
// 1. onGameEnd(score: number) callback
// 2. gameState (resume capability)
// 3. userId (for animations)

function Game2048() {
  const handleGameEnd = async (finalScore: number) => {
    // 1. Validate score on frontend
    if (finalScore > MAX_POSSIBLE_SCORE) return;
    
    // 2. Send to backend
    const response = await submitScore({
      gameName: '2048',
      score: finalScore,
      duration: timeElapsed
    });
    
    // 3. Show result animation
    showScoreAnimation(response.newRank);
  };
  
  return <GameCanvas onEnd={handleGameEnd} />;
}
```

## Performance Optimizations

### Frontend
- ✅ Next.js Image optimization
- ✅ Code splitting per game
- ✅ Lazy loading game components
- ✅ Service worker for offline cache
- ✅ CSS-in-JS with zero runtime overhead

### Backend
- ✅ Connection pooling (PostgreSQL)
- ✅ Redis caching for leaderboards
- ✅ Materialized views for rankings
- ✅ Indexed queries on (user_id, game_name)
- ✅ API response caching (5 min)

### Database
- ✅ Partitioned scores table by date
- ✅ Denormalized leaderboard table
- ✅ Composite indexes on common queries
- ✅ Batch score inserts

## Scaling Strategy

### Current Setup (< 10k users)
- Single PostgreSQL instance
- Single Express server
- Redis for cache

### Growth (10k - 100k users)
- Read replicas for leaderboard queries
- Connection pooling with PgBouncer
- CDN for static assets
- Separate WebSocket server for real-time updates

### Enterprise (100k+ users)
- Sharded database (by user_id)
- Microservices: auth, scores, leaderboard
- Message queue for score processing
- Multi-region deployment
