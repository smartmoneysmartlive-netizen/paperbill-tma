import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) throw new Error('Unauthorized');

    const wallet = await prisma.wallet.findUnique({
      where: { userId: user.id }
    });

    if (!wallet) {
      return NextResponse.json({ 
        success: false, 
        message: 'Wallet not found' 
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      nairaBalance: wallet.nairaBalance / 100, // Convert Kobo to Naira for frontend
      paperBalance: wallet.paperBalance,
      walletAddress: wallet.walletAddress
    });

  } catch (err: any) {
    console.error('[Balance API Error]:', err.message);
    return NextResponse.json({ 
      success: false, 
      message: err.message || 'Internal Server Error' 
    }, { status: 500 });
  }
}
