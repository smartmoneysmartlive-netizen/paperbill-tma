import { NextRequest, NextResponse } from 'next/server';
import { TransactionService } from '@/lib/services/transaction.service';
import { getAuthenticatedUser } from '@/lib/auth-utils';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  const resolvedParams = await params;
  const type = resolvedParams.type as any;

  try {
    // 1. Verify User Session (HMAC Check)
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ 
        status: 'error', 
        message: 'Unauthorized' 
      }, { status: 401 });
    }

    const body = await request.json();
    const { phone, phoneNumber, amount, provider, networkId, currency = 'NGN', planId, ...metadata } = body;

    const targetPhone = phone || phoneNumber;
    const targetNetwork = networkId || provider;

    // 2. Call the Transaction Engine with real ID
    const result = await TransactionService.process({
      type,
      userId: user.id, // Verified DB User ID
      amount: Number(amount),
      currency: currency as 'NGN' | 'PAPER',
      planId: planId || undefined,
      payload: { 
        phone: targetPhone, 
        networkId: targetNetwork, 
        provider: targetNetwork, 
        ...metadata 
      }
    });

    if (result.success) {
      return NextResponse.json({ 
        status: 'success', 
        message: result.message,
        reference: result.reference
      });
    } else {
      return NextResponse.json({ 
        status: 'failed', 
        message: result.message 
      }, { status: 400 });
    }

  } catch (err: any) {
    console.error('[Utility API Error]:', err.message);

    if (err.message.includes('Unauthorized') || err.message.includes('Authorization')) {
      return NextResponse.json({ 
        status: 'error', 
        message: err.message 
      }, { status: 401 });
    }

    return NextResponse.json({ 
      status: 'error', 
      message: err.message || 'An unexpected error occurred' 
    }, { status: 500 });
  }
}
