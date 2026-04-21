import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/services/auth.service';
import { UserService } from '@/lib/services/user.service';
import { WebAuthService } from '@/lib/services/web-auth.service';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // 1. Verify Telegram Widget Data
    const tgUser = AuthService.validateWebLogin(data);
    
    // 2. Clear previous session if any
    await WebAuthService.logout();

    // 3. Sync User in DB
    const user = await UserService.getOrCreateUser(tgUser);
    
    // 4. Create New Session
    await WebAuthService.createSession(user.id);

    return NextResponse.json({ 
      success: true, 
      message: 'Login successful' 
    });
  } catch (err: any) {
    console.error('[Web Auth Error]:', err.message);
    return NextResponse.json({ 
      success: false, 
      message: err.message || 'Authentication failed' 
    }, { status: 401 });
  }
}
