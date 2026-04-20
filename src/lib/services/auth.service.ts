import { createHmac } from 'crypto';

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}

export class AuthService {
  /**
   * Validates the initDataRaw from Telegram using HMAC-SHA256
   * @param initDataRaw The raw string from Telegram.WebApp.initData
   * @returns The parsed user object if valid, throws error if invalid
   */
  static validateInitData(initDataRaw: string) {
    const botToken = process.env.NEXT_PUBLIC_BOT_TOKEN; // Recommendation: Rename to BOT_TOKEN in .env for safety
    
    if (!botToken) {
      throw new Error('BOT_TOKEN is not configured on the server.');
    }

    const urlParams = new URLSearchParams(initDataRaw);
    const hash = urlParams.get('hash');
    const authDate = parseInt(urlParams.get('auth_date') || '0', 10);

    // 1. Basic Expiry Check (24 Hours)
    const now = Math.floor(Date.now() / 1000);
    if (now - authDate > 86400) {
      throw new Error('Session expired. Please restart the app.');
    }

    // 2. Prepare data_check_string
    const params: string[] = [];
    urlParams.forEach((value, key) => {
      if (key !== 'hash') {
        params.push(`${key}=${value}`);
      }
    });
    
    // Sort parameters alphabetically
    const dataCheckString = params.sort().join('\n');

    // 3. Calculate HMAC signature
    const secretKey = createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest();
      
    const calculatedHash = createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    // 4. Verification
    if (calculatedHash !== hash) {
      console.error('[Auth] Hash mismatch! Potential tampering detected.');
      throw new Error('Unauthorized: Invalid signature.');
    }

    // 5. Return user info
    const userJson = urlParams.get('user');
    if (!userJson) {
      throw new Error('Unauthorized: User data missing.');
    }

    return JSON.parse(userJson) as TelegramUser;
  }
}
