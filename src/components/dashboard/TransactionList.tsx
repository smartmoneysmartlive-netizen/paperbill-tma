'use client';

import { motion } from 'framer-motion';

const transactions = [
  { id: 1, type: 'MTN Airtime', amount: '-₦1,000', date: 'Apr 17 • 09:32 AM', status: 'Success' },
  { id: 2, type: 'Wallet Funding', amount: '+₦5,000', date: 'Apr 16 • 02:21 PM', status: 'Success' },
  { id: 3, type: 'Electricity Token', amount: '-₦2,500', date: 'Apr 15 • 11:10 AM', status: 'Failed' },
  { id: 4, type: 'Airtel Data', amount: '-₦1,500', date: 'Apr 14 • 10:45 AM', status: 'Success' },
];

export default function TransactionList() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Recent Activity</h3>
        <span style={{ fontSize: '13px', color: 'var(--action-green)', fontWeight: '600' }}>See all</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {transactions.map((tx, index) => (
          <motion.div
            key={tx.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 + 0.4 }}
            className="card"
            style={{ 
              display: 'flex' as any, 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '12px 16px'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '14px', fontWeight: '600' }}>{tx.type}</span>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{tx.date}</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
              <span style={{ 
                fontSize: '14px', 
                fontWeight: '700',
                color: tx.amount.startsWith('+') ? 'var(--status-success)' : 'var(--text-primary)'
              }}>
                {tx.amount}
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
        ))}
      </div>
    </div>
  );
}
