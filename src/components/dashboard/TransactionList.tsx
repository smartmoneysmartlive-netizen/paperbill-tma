'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const transactions = [
  { id: 1, type: 'MTN Airtime', amount: '-₦1,000', date: 'Apr 17 • 09:32 AM', status: 'Success', logo: '/brand-logos/mtn.jpg' },
  { id: 2, type: 'Wallet Funding', amount: '+₦5,000', date: 'Apr 16 • 02:21 PM', status: 'Success', logo: '' },
  { id: 3, type: 'Electricity Token', amount: '-₦2,500', date: 'Apr 15 • 11:10 AM', status: 'Failed', logo: '/brand-logos/IKEDC.png' },
  { id: 4, type: 'Airtel Data', amount: '-₦1,500', date: 'Apr 14 • 10:45 AM', status: 'Success', logo: '/brand-logos/airtel.png' },
];

export default function TransactionList() {
  return (
    <div style={{ display: 'flex' as any, flexDirection: 'column' as any, gap: '16px' }}>
      <div style={{ display: 'flex' as any, justifyContent: 'space-between' as any, alignItems: 'center' as any }}>
        <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Recent Activity</h3>
        <Link href="/wallet" style={{ fontSize: '14px', fontWeight: '600', color: 'var(--action-green)', textDecoration: 'none' }}>
           See all
        </Link>
      </div>

      <div style={{ display: 'flex' as any, flexDirection: 'column' as any, gap: '12px' }}>
        {transactions.map((tx, index) => (
          <motion.div
            key={tx.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 + 0.4 }}
            className="card"
            style={{ 
              display: 'flex' as any, 
              justifyContent: 'space-between' as any, 
              alignItems: 'center' as any,
              padding: '12px 16px'
            }}
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
