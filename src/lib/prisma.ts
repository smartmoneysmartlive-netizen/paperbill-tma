import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

/**
 * BigInt JSON Serialization patch
 * Required because Prisma returns BigInt for telegramId, which JSON.stringify cannot handle.
 */
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};
