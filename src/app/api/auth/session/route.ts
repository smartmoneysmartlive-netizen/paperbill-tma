import { NextResponse } from 'next/server';
import { WebAuthService } from '@/lib/services/web-auth.service';

/**
 * Lightweight session check for the Landing Page
 * Returns only the authenticated status.
 */
export async function GET() {
  try {
    const userId = await WebAuthService.verifySession();
    return NextResponse.json({ 
      isAuthenticated: !!userId 
    });
  } catch (err) {
    return NextResponse.json({ 
      isAuthenticated: false 
    });
  }
}
