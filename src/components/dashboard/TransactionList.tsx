'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useTelegramAuth } from '@/components/TelegramProvider';
import { Loader2 } from 'lucide-react';

export default function TransactionList() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { initDataRaw } = useTelegramAuth();

  useEffect(() => {
    async function fetchHistory() {
      try {
        const response = await fetch('/api/wallet/history', {
          headers: {
            'Authorization': `Bearer ${initDataRaw}`
          }
        });
        const data = await response.json();
        if (data.success) {
          setTransactions(data.transactions);
        }
      } catch (err) {
        console.error('Failed to fetch history:', err);
      } finally {
        setLoading(false);
      }
    }

    if (initDataRaw) fetchHistory();
  }, [initDataRaw]);

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <Loader2 className="animate-spin" size={32} color="var(--primary-blue)" style={{ margin: '0 auto' }} />
        <p style={{ marginTop: '12px', fontSize: '14px', color: 'var(--text-secondary)' }}>Loading history...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex' as any, flexDirection: 'column' as any, gap: '16px' }}>
      <div style={{ display: 'flex' as any, justifyContent: 'space-between' as any, alignItems: 'center' as any }}>
        <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Recent Activity</h3>
        <Link href="/wallet" style={{ fontSize: '14px', fontWeight: '600', color: 'var(--action-green)', textDecoration: 'none' }}>
           See all
        </Link>
      </div>

      <div style={{ display: 'flex' as any, flexDirection: 'column' as any, gap: '12px' }}>
        {transactions.length === 0 ? (
          <div className="card" style={{ padding: '30px', textAlign: 'center', opacity: 0.7 }}>
             <p style={{ fontSize: '14px' }}>No transactions yet.</p>
          </div>
        ) : (
          transactions.map((tx, index) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card"
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '12px 16px'
              } as any}
            >
              <div style={{ display: 'flex' as any, alignItems: 'center' as any, gap: '12px' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%', 
                  backgroundColor: 'var(--background)',
                  display: 'flex' as any,
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  border: '1px solid rgba(0,0,0,0.05)'
                }}>
                  {tx.logo ? (
                    <img src={tx.logo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '20px', height: '20px', backgroundColor: 'var(--primary-blue)', borderRadius: '4px' }} />
                  )}
                </div>
                <div style={{ display: 'flex' as any, flexDirection: 'column' as any, gap: '4px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>{tx.type}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{tx.date}</span>
                </div>
              </div>
              
              <div style={{ display: 'flex' as any, flexDirection: 'column' as any, alignItems: 'flex-end' as any, gap: '4px' }}>
                <span style={{ 
                  fontSize: '14px', 
                  fontWeight: '700',
                  color: tx.isCredit ? 'var(--status-success)' : 'var(--text-primary)'
                }}>
                  {tx.isCredit ? '+' : '-'}{tx.amountFormatted}
                </span>
                <span style={{ 
                  fontSize: '11px', 
                  fontWeight: '600',
                  color: tx.status === 'Success' ? 'var(--status-success)' : 'var(--status-failed)',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  backgroundColor: tx.status === 'Success' ? 'rgba(0, 200, 83, 0.1)' : 'rgba(239, 68, 68, 0.1)'
                }}>
                  {tx.status}
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
