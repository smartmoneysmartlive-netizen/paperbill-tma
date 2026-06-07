import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) throw new Error('Unauthorized');

    const logs = await prisma.auditLog.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 40
    });

    const formatted = logs.map(log => {
      let metadata: any = {};
      try {
        if (log.metadata) {
          metadata = typeof log.metadata === 'string' ? JSON.parse(log.metadata) : log.metadata;
        }
      } catch (e) {
        console.error('Error parsing log metadata:', e);
      }

      return {
        id: log.id,
        action: log.action,
        level: log.level,
        date: new Date(log.createdAt).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit',
          second: '2-digit'
        }),
        message: getFriendlyMessage(log.action, metadata),
        rawMetadata: metadata
      };
    });

    return NextResponse.json({
      success: true,
      logs: formatted
    });

  } catch (err: any) {
    console.error('[Logs API Error]:', err.message);
    return NextResponse.json({ 
      success: false, 
      message: err.message || 'Internal Server Error' 
    }, { status: 500 });
  }
}

function getFriendlyMessage(action: string, metadata: any): string {
  switch (action) {
    case 'TRANSACTION_START': {
      const amount = metadata?.kobo ? (metadata.kobo / 100).toFixed(2) : '0.00';
      const type = (metadata?.type || 'utility').toLowerCase();
      return `Initiating purchase of ${type} for ₦${amount}. Checking wallet balance and locking funds...`;
    }
    case 'TRANSACTION_SUCCESS':
      return `Purchase successful! The requested service was delivered and wallet balance was successfully debited.`;
    case 'TRANSACTION_FAILED_REFUNDING': {
      const reason = metadata?.reason || 'Service provider connection failure';
      return `Purchase failed: "${reason}". Automatically rolling back transaction and refunding the amount back to your wallet.`;
    }
    case 'PAYSTACK_DEPOSIT_COMPLETE': {
      const amount = metadata?.amount ? Number(metadata.amount).toFixed(2) : '0.00';
      return `Successfully received deposit of ₦${amount} via Paystack. Wallet credited.`;
    }
    case 'PAYSTACK_FINALIZE_ERROR':
      return `Ledger error during deposit finalization: ${metadata?.error || 'Unknown ledger error'}. Please contact support.`;
    case 'PROVIDER_API_CRASH':
      return `Connection crash with external provider API. Initiating safety fallback and wallet refund.`;
    case 'SECURITY_ALERT':
      return `Security checkpoint flagged: ${metadata?.reason || 'Anomaly signature detected'}.`;
    default:
      // Return a clean fallback
      return action
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(/\b\w/g, c => c.toUpperCase());
  }
}
