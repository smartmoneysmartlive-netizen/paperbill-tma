import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SECRET_KEY = new TextEncoder().encode(
  process.env.SESSION_SECRET || 'paperbill_fallback_secret_32_chars_long'
);

export const SESSION_COOKIE_NAME = 'pb_session';

export class WebAuthService {
  /**
   * Creates a signed JWT for a user session
   */
  static async createSession(userId: string) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 Days
    
    const jwt = await new SignJWT({ userId })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(SECRET_KEY);

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt,
      path: '/',
    });

    return jwt;
  }

  /**
   * Verifies a session JWT and returns the userId
   */
  static async verifySession() {
    const cookieStore = await cookies();
    const session = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    
    if (!session) return null;

    try {
      const { payload } = await jwtVerify(session, SECRET_KEY, {
        algorithms: ['HS256'],
      });
      return payload.userId as string;
    } catch (err) {
      return null;
    }
  }

  /**
   * Destroys the session
   */
  static async logout() {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
  }
}
