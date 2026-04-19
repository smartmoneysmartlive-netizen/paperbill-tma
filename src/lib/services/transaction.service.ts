import { VTUService } from './vtu.service';

export type TransactionRecord = {
  type: 'airtime' | 'data' | 'electricity' | 'tv' | 'education';
  userId: string;
  amount: number;
  payload: any;
};

export class TransactionService {
  /**
   * Mock balance for DB-less phase
   */
  private static MOCK_BALANCE = 50000;

  static async process(record: TransactionRecord) {
    // 1. Check Maintenance (Mocked for now)
    
    // 2. Validate input (Zod would go here later)
    
    // 3. Balance Check
    if (this.MOCK_BALANCE < record.amount) {
      throw new Error("Insufficient funds in your Paperbill wallet.");
    }

    // 4. Create Pending Transaction Record (Ledger)
    console.log(`[Ledger] Creating PENDING transaction for User ${record.userId}`);
    
    // 5. Lock / Deduct Wallet
    this.MOCK_BALANCE -= record.amount;
    console.log(`[Wallet] Deducted ${record.amount}. New balance: ${this.MOCK_BALANCE}`);

    try {
      // 6. External API Call
      let result;
      if (record.type === 'airtime') {
        result = await VTUService.buyAirtime(1, record.payload.phone, record.amount);
      } else {
        // ... handle other types
        result = { success: true, message: 'Mock Success' };
      }

      // 7. Handle Result
      if (result.success) {
        // Update status to SUCCESS
        console.log(`[Ledger] Transaction SUCCESS. Ref: ${result.reference}`);
        return { success: true, message: result.message };
      } else {
        // Refund if error
        this.MOCK_BALANCE += record.amount;
        console.log(`[Wallet] REFUNDED ${record.amount}. New balance: ${this.MOCK_BALANCE}`);
        return { success: false, message: result.message };
      }
    } catch (err) {
      // Fail-safe rollback
      this.MOCK_BALANCE += record.amount;
      console.log(`[Wallet] ROLLBACK REFUND ${record.amount}. Error: ${err}`);
      throw err;
    }
  }
}
