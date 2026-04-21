import { NextRequest } from 'next/server';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';

/**
 * Higher-order logic for securing Next.js API routes with Telegram Auth
 */
import { WebAuthService } from './services/web-auth.service';
import { prisma } from './prisma';

/**
 * Higher-order logic for securing Next.js API routes with Hybrid Auth (TMA + Web)
 */
export async function getAuthenticatedUser(request: NextRequest) {
  // 1. Priority: TMA Header (Authorization: Bearer <initDataRaw>)
  const authHeader = request.headers.get('Authorization');
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const initDataRaw = authHeader.split(' ')[1];
    try {
      const tgUser = AuthService.validateInitData(initDataRaw);
      return await UserService.getOrCreateUser(tgUser);
    } catch (err: any) {
      console.error('[Auth-TMA] Verification failed:', err.message);
      // Don't throw yet, try browser session
    }
  }

  // 2. Fallback: Browser Session (JWT Cookie)
  try {
    const userId = await WebAuthService.verifySession();
    if (userId) {
      // In Prisma schema, User.id is a String (UUID)
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user) return user;
    }
  } catch (err: any) {
    console.error('[Auth-Web] Session verification failed:', err.message);
  }

  throw new Error('Unauthorized: No valid session found');
}
