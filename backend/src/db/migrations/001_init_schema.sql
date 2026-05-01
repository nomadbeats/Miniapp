-- Users table
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  telegram_id BIGINT UNIQUE NOT NULL,
  username VARCHAR(255),
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  avatar_url TEXT,
  total_score INT DEFAULT 0,
  games_played INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Scores table
CREATE TABLE IF NOT EXISTS scores (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  game_name VARCHAR(50) NOT NULL,
  score INT NOT NULL,
  duration INT,
  submitted_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, game_name)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_telegram_id ON users(telegram_id);
CREATE INDEX IF NOT EXISTS idx_scores_user_id ON scores(user_id);
CREATE INDEX IF NOT EXISTS idx_scores_game_name ON scores(game_name);
CREATE INDEX IF NOT EXISTS idx_scores_submitted_at ON scores(submitted_at DESC);

-- Leaderboard materialized view
CREATE MATERIALIZED VIEW IF NOT EXISTS leaderboard AS
SELECT 
  u.id,
  u.telegram_id,
  u.username,
  u.first_name,
  u.total_score,
  ROW_NUMBER() OVER (ORDER BY u.total_score DESC) as rank
FROM users u
ORDER BY u.total_score DESC;

-- Per-game leaderboard view
CREATE MATERIALIZED VIEW IF NOT EXISTS game_leaderboards AS
SELECT 
  s.game_name,
  u.id,
  u.telegram_id,
  u.username,
  u.first_name,
  s.score,
  ROW_NUMBER() OVER (PARTITION BY s.game_name ORDER BY s.score DESC) as rank
FROM scores s
JOIN users u ON s.user_id = u.id;
