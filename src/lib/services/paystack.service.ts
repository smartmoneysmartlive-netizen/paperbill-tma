import { createHmac } from 'crypto';
import { prisma } from '../prisma';

export interface PaystackInitializeResponse {
  status: boolean;
  message: string;
  data?: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export class PaystackService {
  private static SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || '';
  
  // Business Rules
  private static MIN_DEPOSIT_NGN = 1000;
  private static FLAT_FEE_NGN = 80;

  /**
   * Initializes a payment session for the user
   * @param amountNaira The amount the user wants to RECEIVE (e.g. 1000)
   */
  static async initializeDeposit(userId: string, email: string, amountNaira: number): Promise<PaystackInitializeResponse> {
    if (amountNaira < this.MIN_DEPOSIT_NGN) {
      throw new Error(`Minimum deposit is ₦${this.MIN_DEPOSIT_NGN}`);
    }

    // Amount to charge user: amount + fee
    const totalToCharge = amountNaira + this.FLAT_FEE_NGN;
    const amountInKobo = totalToCharge * 100;

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: amountInKobo,
        callback_url: `${process.env.NEXT_PUBLIC_WEBAPP_URL}/wallet`,
        metadata: {
          userId,
          amountToCredit: amountNaira // We store the net amount to credit in metadata
        }
      }),
    });

    return await response.json();
  }

  /**
   * Verifies the authenticity of a Paystack Webhook signature
   */
  static verifySignature(body: string, signature: string): boolean {
    const hash = createHmac('sha512', this.SECRET_KEY)
      .update(body)
      .digest('hex');
    return hash === signature;
  }

  /**
   * Credits the user's wallet after a successful payment
   * Includes PAPER token reward logic: ₦3,000 total deposit = 5 PAPER
   */
  static async finalizeDeposit(userId: string, amountToCreditNaira: number, reference: string) {
    const amountKobo = amountToCreditNaira * 100;

    return await prisma.$transaction(async (tx) => {
      // 1. Idempotency Check
      const existingTx = await tx.transaction.findUnique({
        where: { reference }
      });
      if (existingTx) return existingTx;

      // 2. Increment Naira Wallet
      await tx.wallet.update({
        where: { userId },
        data: {
          nairaBalance: { increment: amountKobo }
        }
      });

      // 3. Create Deposit Record
      const depositTx = await tx.transaction.create({
        data: {
          userId,
          type: 'CREDIT',
          amount: amountKobo,
          currency: 'NGN',
          status: 'SUCCESS',
          reference,
          provider: 'paystack',
          metadata: { deposit: true }
        }
      });

      // 4. PAPER Reward Logic (₦3,000 = 5 PAPER)
      try {
        // A. Sum lifetime deposits
        const totalDeposits = await tx.transaction.aggregate({
          where: { userId, type: 'CREDIT', status: 'SUCCESS', metadata: { path: ['deposit'], equals: true } },
          _sum: { amount: true }
        });

        // B. Sum lifetime rewards given
        const totalRewards = await tx.transaction.aggregate({
          where: { userId, type: 'REWARD', status: 'SUCCESS', metadata: { path: ['reward_type'], equals: 'deposit_bonus' } },
          _count: { id: true }
        });

        const lifetimeKobo = totalDeposits._sum.amount || 0;
        const rewardsGiven = totalRewards._count.id || 0;
        
        // C. Calculate how many rewards SHOULD have been given (1 for every 300,000 Kobo)
        const expectedRewards = Math.floor(lifetimeKobo / 300000);

        if (expectedRewards > rewardsGiven) {
          const rewardAmount = (expectedRewards - rewardsGiven) * 5; // Award 5 for each missing chunk
          
          await tx.wallet.update({
            where: { userId },
            data: { paperBalance: { increment: rewardAmount } }
          });

          await tx.transaction.create({
            data: {
              userId,
              type: 'REWARD',
              amount: rewardAmount,
              currency: 'PAPER',
              status: 'SUCCESS',
              reference: `REW_DEP_${userId}_${expectedRewards}`,
              provider: 'system',
              metadata: { reward_type: 'deposit_bonus', threshold_level: expectedRewards }
            }
          });
        }
      } catch (rewardErr) {
        // Fail-silent on reward to avoid blocking the user's hard-earned deposit
        console.error('[Reward Engine Error]:', rewardErr);
      }

      return depositTx;
    });
  }
}
