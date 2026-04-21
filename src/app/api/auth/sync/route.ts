import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/services/auth.service';

/**
 * TMA Sync Endpoint
 * This is called by the Telegram Mini App on first load to 
 * register/sync the user with the database.
 */
export async function POST(request: NextRequest) {
  try {
    const { initDataRaw } = await request.json();

    if (!initDataRaw) {
      return NextResponse.json({ error: 'Missing initDataRaw' }, { status: 400 });
    }

    // Sync the user (Upsert + Wallet creation)
    const user = await AuthService.syncUser(initDataRaw);

    return NextResponse.json({ 
      success: true, 
      user: {
        id: user.id,
        firstName: user.firstName,
        username: user.username
      }
    });
  } catch (err: any) {
    console.error('[AuthSync] Sync failed:', err.message);
    return NextResponse.json({ 
      success: false, 
      message: err.message || 'Synchronization failed' 
    }, { status: 401 });
  }
}
