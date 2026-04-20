import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) throw new Error('Unauthorized');

    const transactions = await prisma.transaction.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    // Format for frontend
    const formatted = transactions.map(tx => ({
      id: tx.id,
      type: tx.type.charAt(0) + tx.type.slice(1).toLowerCase().replace('_', ' '),
      amountFormatted: (tx.amount / 100).toLocaleString('en-NG', { style: 'currency', currency: 'NGN' }),
      amountRaw: tx.amount / 100,
      isCredit: tx.type === 'CREDIT',
      date: new Date(tx.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: tx.status.charAt(0) + tx.status.slice(1).toLowerCase(),
      logo: getServiceLogo(tx.type)
    }));

    return NextResponse.json({
      success: true,
      transactions: formatted
    });

  } catch (err: any) {
    console.error('[History API Error]:', err.message);
    return NextResponse.json({ 
      success: false, 
      message: err.message || 'Internal Server Error' 
    }, { status: 500 });
  }
}

function getServiceLogo(type: string) {
  if (type === 'DATA' || type === 'AIRTIME') return '/brand-logos/mtn.jpg'; // We can refine this later
  if (type === 'ELECTRICITY') return '/brand-logos/IKEDC.png';
  return '';
}
