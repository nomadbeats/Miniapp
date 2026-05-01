import crypto from 'crypto';
import { logger } from './logger';

interface InitData {
  user?: {
    id: number;
    is_bot: boolean;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
    is_premium?: boolean;
    added_to_attachment_menu?: boolean;
    allows_write_to_pm?: boolean;
    photo_url?: string;
  };
  auth_date: number;
  hash: string;
  [key: string]: any;
}

export const validateTelegramInitData = (initData: string): InitData | null => {
  try {
    const BOT_TOKEN = process.env.BOT_TOKEN;
    if (!BOT_TOKEN) {
      logger.error('BOT_TOKEN not set');
      return null;
    }

    const data = new URLSearchParams(initData);
    const hash = data.get('hash');
    data.delete('hash');

    // Sort by keys
    const entries = Array.from(data.entries()).sort((a, b) => a[0].localeCompare(b[0]));
    const dataCheckString = entries.map(([key, value]) => `${key}=${value}`).join('\n');

    // Create HMAC
    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(BOT_TOKEN).digest();
    const calculatedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

    // Validate hash
    if (calculatedHash !== hash) {
      logger.warn('Invalid Telegram initData hash');
      return null;
    }

    // Validate auth_date (not older than 1 day)
    const authDate = parseInt(data.get('auth_date') || '0');
    const now = Math.floor(Date.now() / 1000);
    if (now - authDate > 86400) {
      logger.warn('Telegram initData expired');
      return null;
    }

    // Parse user data
    const userJson = data.get('user');
    const user = userJson ? JSON.parse(userJson) : undefined;

    return {
      user,
      auth_date: authDate,
      hash: hash || ''
    };
  } catch (error) {
    logger.error('Error validating Telegram initData', error);
    return null;
  }
};
