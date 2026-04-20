import { NextRequest } from 'next/server';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';

/**
 * Higher-order logic for securing Next.js API routes with Telegram Auth
 */
export async function getAuthenticatedUser(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Missing or malformed Authorization header');
  }

  const initDataRaw = authHeader.split(' ')[1];
  
  try {
    // 1. Verify cryptographic signature from Telegram
    const tgUser = AuthService.validateInitData(initDataRaw);
    
    // 2. Map to Database User (creating if it doesn't exist)
    const user = await UserService.getOrCreateUser(tgUser);
    
    return user;
  } catch (err: any) {
    console.error('[Auth] Verification failed:', err.message);
    throw new Error(err.message || 'Unauthorized');
  }
}
