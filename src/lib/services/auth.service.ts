import { prisma } from '@/lib/prisma';
import { createHmac } from 'crypto';
import { UserService } from './user.service';

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
   * Synchronizes a Telegram user with the local database
   * @param initDataRaw The raw initialization string from Telegram
   * @returns The synchronized DB user object
   */
  static async syncUser(initDataRaw: string) {
    // 1. Validate the string and extract the user
    const telegramUser = this.validateInitData(initDataRaw);
    
    // 2. Delegate to UserService to handle the DB Upsert and Wallet creation
    const user = await UserService.getOrCreateUser(telegramUser);
    
    console.log(`[AUTH-SUCCESS] User Sync'd: ID=${user.telegramId}, Name=${user.firstName}`);
    
    return user;
  }

  /**
   * Validates the initDataRaw from Telegram using HMAC-SHA256
   * @param initDataRaw The raw string from Telegram.WebApp.initData
   * @returns The parsed user object if valid, throws error if invalid
   */
  static validateInitData(initDataRaw: string) {
    const botToken = process.env.NEXT_PUBLIC_BOT_TOKEN;
    
    if (!botToken) {
      throw new Error('BOT_TOKEN is not configured on the server.');
    }

    const urlParams = new URLSearchParams(initDataRaw);
    const hash = urlParams.get('hash');
    const authDate = parseInt(urlParams.get('auth_date') || '0', 10);

    // 1. Basic Expiry Check (48 Hours for stability during launch)
    const now = Math.floor(Date.now() / 1000);
    if (now - authDate > 172800) {
      console.error(`[Auth] Session Expired: authDate=${authDate}, now=${now}, diff=${now - authDate}`);
      throw new Error('Session expired. Please restart the app.');
    }

    if (!hash) {
      throw new Error('Unauthorized: Hash missing from initData.');
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

  /**
   * Validates user data from the Telegram Login Widget (Browser-based)
   * @param data The user data object from the widget
   * @returns The user object if valid, throws error if invalid
   */
  static validateWebLogin(data: any) {
    const botToken = process.env.NEXT_PUBLIC_BOT_TOKEN;
    if (!botToken) throw new Error('BOT_TOKEN is not configured.');

    const hash = data.hash;
    if (!hash) throw new Error('Authentication hash missing.');

    // 1. Prepare data_check_string
    const params: string[] = [];
    Object.keys(data).forEach(key => {
      if (key !== 'hash' && data[key] !== undefined) {
        params.push(`${key}=${data[key]}`);
      }
    });
    
    const dataCheckString = params.sort().join('\n');

    // 2. Secret Key = SHA256 of bot token (Standard Login Widget Algo)
    const crypto = require('crypto');
    const secretKeyWidget = crypto.createHash('sha256').update(botToken).digest();

    // 3. Calculate HMAC
    const calculatedHash = crypto.createHmac('sha256', secretKeyWidget)
      .update(dataCheckString)
      .digest('hex');

    if (calculatedHash !== hash) {
      throw new Error('Unauthorized: Invalid web login signature.');
    }

    return {
      id: Number(data.id),
      first_name: data.first_name,
      last_name: data.last_name,
      username: data.username,
      photo_url: data.photo_url,
      auth_date: Number(data.auth_date)
    } as TelegramUser;
  }
}
