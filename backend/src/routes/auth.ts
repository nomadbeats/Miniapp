import { Router, Response } from 'express';
import jwt from 'jsonwebtoken';
import { validateTelegramInitData } from '../utils/telegramAuth';
import { pool } from '../db/connection';
import { logger } from '../utils/logger';
import { AuthRequest } from '../middleware/auth';

const router = Router();

router.post('/login', async (req: AuthRequest, res: Response) => {
  try {
    const { initData } = req.body;

    if (!initData) {
      return res.status(400).json({ error: 'initData required' });
    }

    // Validate Telegram data
    const validData = validateTelegramInitData(initData);
    if (!validData || !validData.user) {
      logger.warn('Invalid Telegram initData received');
      return res.status(401).json({ error: 'Invalid Telegram data' });
    }

    const { id: telegramId, username, first_name, last_name } = validData.user;

    // Upsert user in database
    const result = await pool.query(
      `INSERT INTO users (telegram_id, username, first_name, last_name, updated_at)
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT (telegram_id) DO UPDATE 
       SET username = $2, first_name = $3, last_name = $4, updated_at = NOW()
       RETURNING id, telegram_id, username, first_name, total_score`,
      [telegramId, username, first_name, last_name]
    );

    const user = result.rows[0];

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, telegramId: user.telegram_id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    logger.info(`User logged in: ${user.telegram_id}`);

    res.json({
      token,
      user: {
        id: user.id,
        telegramId: user.telegram_id,
        username: user.username,
        firstName: user.first_name,
        totalScore: user.total_score
      }
    });
  } catch (error) {
    logger.error('Login error', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/verify', (req: AuthRequest, res: Response) => {
  if (!req.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  res.json({ valid: true, userId: req.userId });
});

export default router;
