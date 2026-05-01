import { Router, Response } from 'express';
import { verifyToken, AuthRequest } from '../middleware/auth';
import { pool } from '../db/connection';
import { logger } from '../utils/logger';

const router = Router();

// Get current user profile
router.get('/me', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const result = await pool.query(
      `SELECT id, telegram_id, username, first_name, last_name, total_score, 
              games_played, created_at, updated_at
       FROM users WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    // Get rank
    const rankResult = await pool.query(
      `SELECT rank FROM leaderboard WHERE id = $1`,
      [userId]
    );

    res.json({
      user: {
        id: user.id,
        telegramId: user.telegram_id,
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        totalScore: user.total_score,
        gamesPlayed: user.games_played,
        rank: rankResult.rows[0]?.rank || 0,
        joinedAt: user.created_at
      }
    });
  } catch (error) {
    logger.error('Get user profile error', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Get user by ID (public)
router.get('/:userId', async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(
      `SELECT id, telegram_id, username, first_name, total_score, games_played, created_at
       FROM users WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    // Get rank
    const rankResult = await pool.query(
      `SELECT rank FROM leaderboard WHERE id = $1`,
      [userId]
    );

    res.json({
      user: {
        id: user.id,
        telegramId: user.telegram_id,
        username: user.username,
        firstName: user.first_name,
        totalScore: user.total_score,
        gamesPlayed: user.games_played,
        rank: rankResult.rows[0]?.rank || 0,
        joinedAt: user.created_at
      }
    });
  } catch (error) {
    logger.error('Get user error', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

export default router;
