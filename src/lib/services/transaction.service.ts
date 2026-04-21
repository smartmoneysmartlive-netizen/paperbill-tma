import { prisma } from '../prisma';
import { VTUService } from './vtu.service';
import { DATA_PLANS, CABLE_PLANS } from '../vtu-data';
import { AuditLogger } from './logger.service';

export type TransactionRecord = {
  type: 'airtime' | 'data' | 'electricity' | 'tv' | 'education';
  userId: string; // This is the Prisma User ID
  amount: number; // Input amount in Naira
  planId?: string | number;
  currency: 'NGN' | 'PAPER';
  payload: any;
};

export class TransactionService {
  /**
   * Processes a financial transaction through the Paperbill engine.
   * Ensures Atomicity: Funds are locked, API is called, and status is updated.
   */
  static async process(record: TransactionRecord) {
    const startTime = Date.now();
    
    // 1. Convert to Kobo for precision (1 Naira = 100 Kobo)
    const amountInKobo = Math.round(record.amount * 100);
    let finalAmountKobo = amountInKobo;
    let apiCostKobo = 0;

    // 2. Apply PAPER Token Discount (4%)
    if (record.currency === 'PAPER') {
      finalAmountKobo = Math.round(amountInKobo * 0.96);
    }

    // 3. Extract API Cost for profit tracking
    if (record.type === 'data' && record.planId) {
      const allDataPlans = Object.values(DATA_PLANS).flat();
      const plan = allDataPlans.find(p => p.id === record.planId);
      apiCostKobo = (plan?.cost || 0) * 100;
    } else if (record.type === 'tv' && record.planId) {
      const allCablePlans = Object.values(CABLE_PLANS).flat();
      const plan = allCablePlans.find(p => p.id === record.planId);
      apiCostKobo = (plan?.cost || 0) * 100;
    }

    await AuditLogger.info('TRANSACTION_START', { type: record.type, kobo: finalAmountKobo }, record.userId);

    // 4. Primary Transaction: Lock & Deduct
    let dbTransactionId: string;
    try {
      const result = await prisma.$transaction(async (tx) => {
        // A. Fetch Wallet
        const wallet = await tx.wallet.findUnique({
          where: { userId: record.userId }
        });

        if (!wallet) throw new Error('User wallet not found. Please contact support.');

        // B. Check Balance
        const balance = record.currency === 'PAPER' ? wallet.paperBalance : wallet.nairaBalance;
        if (balance < finalAmountKobo) {
          throw new Error(`Insufficient ${record.currency} balance.`);
        }

        // C. Deduct Funds
        await tx.wallet.update({
          where: { userId: record.userId },
          data: {
            [record.currency === 'PAPER' ? 'paperBalance' : 'nairaBalance']: {
              decrement: finalAmountKobo
            }
          }
        });

        // D. Create Processing Record
        const transaction = await tx.transaction.create({
          data: {
            userId: record.userId,
            type: record.type.toUpperCase() as any,
            amount: finalAmountKobo,
            apiCost: apiCostKobo,
            currency: record.currency,
            status: 'PROCESSING',
            reference: `PB_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            provider: 'pending',
            metadata: record.payload
          }
        });

        return transaction;
      });
      
      dbTransactionId = result.id;
    } catch (err: any) {
      await AuditLogger.error('TRANSACTION_LOCK_FAILED', { error: err.message }, record.userId);
      throw err;
    }

    // 5. External API Call (Outside initial DB transaction to prevent long locks)
    let vtuResult;
    try {
      if (record.type === 'data') {
        vtuResult = await VTUService.buyData(record.payload.networkId, record.payload.phone, record.planId!, record.amount);
      } else if (record.type === 'airtime') {
        vtuResult = await VTUService.buyAirtime(record.payload.networkId, record.payload.phone, record.amount);
      } else if (record.type === 'tv') {
        vtuResult = await VTUService.buyCableTV(record.payload.provider, record.payload.phone, record.payload.smartcard, record.amount, String(record.planId), record.payload.planName);
      } else if (record.type === 'electricity') {
        vtuResult = await VTUService.buyElectricity(record.payload.disco, record.payload.meterNo, record.payload.phone, record.amount);
      } else {
        vtuResult = { success: true, message: 'Utility request queued', reference: 'MOCK_' + Date.now(), provider: 'system' };
      }
    } catch (apiErr) {
      await AuditLogger.error('PROVIDER_API_CRASH', { error: String(apiErr), txId: dbTransactionId }, record.userId);
      vtuResult = { success: false, message: 'Provider connection error' };
    }

    // 6. Handle Final State & Auto-Refund
    if (vtuResult.success) {
      const profitKobo = finalAmountKobo - apiCostKobo;
      await prisma.transaction.update({
        where: { id: dbTransactionId },
        data: {
          status: 'SUCCESS',
          provider: vtuResult.provider, 
          apiResponse: vtuResult as any,
          profit: record.currency === 'NGN' ? profitKobo : 0
        }
      });
      await AuditLogger.info('TRANSACTION_SUCCESS', { txId: dbTransactionId }, record.userId);
      return { success: true, message: vtuResult.message, reference: vtuResult.reference };
    } else {
      // ROLLBACK / REFUND
      await AuditLogger.warn('TRANSACTION_FAILED_REFUNDING', { reason: vtuResult.message, txId: dbTransactionId }, record.userId);
      
      await prisma.$transaction([
        prisma.wallet.update({
          where: { userId: record.userId },
          data: {
            [record.currency === 'PAPER' ? 'paperBalance' : 'nairaBalance']: {
              increment: finalAmountKobo
            }
          }
        }),
        prisma.transaction.update({
          where: { id: dbTransactionId },
          data: {
            status: 'REFUNDED',
            apiResponse: vtuResult as any
          }
        })
      ]);

      return { success: false, message: 'Apologies, the service is temporarily unavailable. Your wallet has been refunded.' };
    }
  }
}
