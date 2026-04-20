import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import { PaystackService } from '@/lib/services/paystack.service';

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) throw new Error('Unauthorized');

    const { amount } = await request.json(); // Amount in Naira
    
    // Initialize with Paystack (Wait for the URL)
    const result = await PaystackService.initializeDeposit(user.id, user.username + '@paperbill.tma', amount);

    if (result.status && result.data) {
      return NextResponse.json({ 
        success: true, 
        authorization_url: result.data.authorization_url,
        reference: result.data.reference 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: result.message || 'Could not initialize payment with Paystack' 
      }, { status: 400 });
    }

  } catch (err: any) {
    console.error('[Deposit Init Error]:', err.message);
    return NextResponse.json({ 
      success: false, 
      message: err.message || 'Payment service is temporarily unavailable' 
    }, { status: 500 });
  }
}
