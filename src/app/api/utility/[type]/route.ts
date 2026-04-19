import { NextRequest, NextResponse } from 'next/server';
import { TransactionService } from '@/lib/services/transaction.service';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  const resolvedParams = await params;
  const type = resolvedParams.type as any;

  try {
    const body = await request.json();
    const { phone, amount, provider, ...metadata } = body;

    // Call the Transaction Engine
    const result = await TransactionService.process({
      type,
      userId: 'praise_123', // Hardcoded until Auth is ready
      amount: Number(amount),
      payload: { phone, provider, ...metadata }
    });

    if (result.success) {
      return NextResponse.json({ 
        status: 'success', 
        message: result.message 
      });
    } else {
      return NextResponse.json({ 
        status: 'failed', 
        message: result.message 
      }, { status: 400 });
    }

  } catch (err: any) {
    return NextResponse.json({ 
      status: 'error', 
      message: err.message || 'An unexpected error occurred' 
    }, { status: 500 });
  }
}
