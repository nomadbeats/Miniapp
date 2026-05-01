import { Router, Response } from 'express';
import { verifyToken, AuthRequest } from '../middleware/auth';
import { pool } from '../db/connection';
import { validateScore } from '../utils/scoreValidator';
import { logger } from '../utils/logger';

const router = Router();

// Submit score
router.post('/submit', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const { gameName, score, duration } = req.body;
    const userId = req.userId!;

    if (!gameName || score === undefined) {
      return res.status(400).json({ error: 'gameName and score required' });
    }

    // Validate score
    const validation = validateScore(gameName, score, duration);
    if (!validation.isValid) {
      logger.warn(`Invalid score submission: ${validation.reason}`);
      return res.status(400).json({ error: validation.reason });
    }

    // Update or insert score
    const scoreResult = await pool.query(
      `INSERT INTO scores (user_id, game_name, score, duration)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, game_name) DO UPDATE 
       SET score = CASE WHEN $3 > scores.score THEN $3 ELSE scores.score END,
           submitted_at = NOW()
       RETURNING score`,
      [userId, gameName, score, duration]
    );

    const highScore = scoreResult.rows[0].score;

    // Update total score
    const userScores = await pool.query(
      `SELECT SUM(score) as total FROM scores WHERE user_id = $1`,
      [userId]
    );

    const totalScore = userScores.rows[0].total || 0;

    await pool.query(
      `UPDATE users SET total_score = $1 WHERE id = $2`,
      [totalScore, userId]
    );

    // Get user's rank
    const rankResult = await pool.query(
      `SELECT rank FROM leaderboard WHERE id = $1`,
      [userId]
    );

    const rank = rankResult.rows[0]?.rank || 0;

    logger.info(`Score submitted: ${gameName} - ${highScore} (user: ${userId})`);

    res.json({
      success: true,
      highScore,
      totalScore,
      rank,
      isNewHighScore: highScore === score
    });
  } catch (error) {
    logger.error('Score submission error', error);
    res.status(500).json({ error: 'Failed to submit score' });
  }
});

// Get user stats
router.get('/user/:userId', async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(
      `SELECT u.id, u.telegram_id, u.username, u.first_name, u.total_score, u.games_played
       FROM users u WHERE u.id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    // Get game scores
    const scoresResult = await pool.query(
      `SELECT game_name, score FROM scores WHERE user_id = $1 ORDER BY score DESC`,
      [userId]
    );

    res.json({
      user: {
        id: user.id,
        telegramId: user.telegram_id,
        username: user.username,
        firstName: user.first_name,
        totalScore: user.total_score,
        gamesPlayed: user.games_played
      },
      scores: scoresResult.rows
    });
  } catch (error) {
    logger.error('Get user stats error', error);
    res.status(500).json({ error: 'Failed to fetch user stats' });
  }
});

// Get global leaderboard
router.get('/leaderboard', async (req: AuthRequest, res: Response) => {
  try {
    const { limit = 100, offset = 0 } = req.query;

    const result = await pool.query(
      `SELECT id, telegram_id, username, first_name, total_score, rank
       FROM leaderboard
       LIMIT $1 OFFSET $2`,
      [Math.min(Number(limit), 100), Number(offset)]
    );

    res.json({
      leaderboard: result.rows,
      total: result.rows.length
    });
  } catch (error) {
    logger.error('Get leaderboard error', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Get per-game leaderboard
router.get('/leaderboard/:gameName', async (req: AuthRequest, res: Response) => {
  try {
    const { gameName } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const result = await pool.query(
      `SELECT id, telegram_id, username, first_name, score, rank
       FROM game_leaderboards
       WHERE game_name = $1
       LIMIT $2 OFFSET $3`,
      [gameName, Math.min(Number(limit), 100), Number(offset)]
    );

    res.json({
      game: gameName,
      leaderboard: result.rows,
      total: result.rows.length
    });
  } catch (error) {
    logger.error('Get game leaderboard error', error);
    res.status(500).json({ error: 'Failed to fetch game leaderboard' });
  }
});

export default router;
