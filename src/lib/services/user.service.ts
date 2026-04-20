import { prisma } from '../prisma';
import { TelegramUser } from './auth.service';

export class UserService {
  /**
   * Fetches an existing user or creates a new one with a zero balance wallet.
   * This is called on every validated login.
   */
  static async getOrCreateUser(tgUser: TelegramUser) {
    const telegramId = BigInt(tgUser.id);

    // 1. Transaction to ensure Atomic User + Wallet creation
    return await prisma.$transaction(async (tx) => {
      let user = await tx.user.findUnique({
        where: { telegramId },
        include: { wallet: true }
      });

      if (!user) {
        console.log(`[User] Onboarding new user: ${tgUser.username || tgUser.first_name}`);
        
        user = await tx.user.create({
          data: {
            telegramId,
            username: tgUser.username,
            firstName: tgUser.first_name,
            lastName: tgUser.last_name,
            wallet: {
              create: {
                nairaBalance: 0, // Users start with 0 as requested
                paperBalance: 0
              }
            }
          },
          include: { wallet: true }
        });
      }

      return user;
    });
  }

  /**
   * Tracks deposits and awards PAPER rewards
   * Logic: When total deposit >= 3000, award 5 PAPER
   * (To be fully wired into Payment Webhook later)
   */
  static async handlePaperReward(userId: string, depositAmount: number) {
     // Placeholder for deposit reward logic
     // if (depositAmount >= 3000) award 5 PAPER
  }
}
