import { prisma } from '../prisma';
import { LogLevel } from '@prisma/client';

export class AuditLogger {
  static async log(action: string, metadata: any = {}, level: LogLevel = 'INFO', userId?: string) {
    try {
      console.log(`[Audit] ${level}: ${action}`, JSON.stringify(metadata, null, 2));
      
      // Persist to database
      await prisma.auditLog.create({
        data: {
          action,
          metadata: metadata || {},
          level,
          userId: userId || 'system',
        }
      });
    } catch (err) {
      // Fail-silent on logging to avoid breaking main business flow
      // but log to console so developers can see the failure
      console.error('[CRITICAL] Audit logging failed:', err);
    }
  }

  static async info(action: string, metadata?: any, userId?: string) {
    return this.log(action, metadata, 'INFO', userId);
  }

  static async warn(action: string, metadata?: any, userId?: string) {
    return this.log(action, metadata, 'WARN', userId);
  }

  static async error(action: string, metadata?: any, userId?: string) {
    return this.log(action, metadata, 'ERROR', userId);
  }

  static async critical(action: string, metadata?: any, userId?: string) {
    return this.log(action, metadata, 'CRITICAL', userId);
  }
}
