import { NextRequest, NextResponse } from 'next/server';
import { PaystackService } from '@/lib/services/paystack.service';
import { AuditLogger } from '@/lib/services/logger.service';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('x-paystack-signature');

  if (!signature) {
    return NextResponse.json({ message: 'Missing signature' }, { status: 400 });
  }

  // 1. Verify that the request actually came from Paystack
  const isValid = PaystackService.verifySignature(body, signature);
  if (!isValid) {
    await AuditLogger.critical('SECURITY_ALERT', { origin: 'PAYSTACK_WEBHOOK', reason: 'Invalid Signature' });
    return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });
  }

  const event = JSON.parse(body);

  // 2. Handle successful payment
  if (event.event === 'charge.success') {
    const { data } = event;
    const userId = data.metadata?.userId;
    const amountToCreditNaira = data.metadata?.amountToCredit;
    const reference = data.reference;

    if (!userId || !amountToCreditNaira) {
      await AuditLogger.error('PAYSTACK_WEBHOOK_MALFORMED', { data }, userId);
      return NextResponse.json({ message: 'Metadata missing' }, { status: 400 });
    }

    try {
      await PaystackService.finalizeDeposit(userId, amountToCreditNaira, reference);
      await AuditLogger.info('PAYSTACK_DEPOSIT_COMPLETE', { amount: amountToCreditNaira, ref: reference }, userId);
    } catch (err: any) {
      await AuditLogger.error('PAYSTACK_FINALIZE_ERROR', { error: err.message }, userId);
      return NextResponse.json({ message: 'Internal Ledger Error' }, { status: 500 });
    }
  }

  // Paystack expects a 200 OK for every handled webhook
  return NextResponse.json({ status: 'success' });
}
