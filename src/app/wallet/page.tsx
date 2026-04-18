'use client';

import BottomNav from '@/components/dashboard/BottomNav';
import WalletCard from '@/components/dashboard/WalletCard';
import TransactionList from '@/components/dashboard/TransactionList';
import { CreditCard, Landmark, History, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WalletPage() {
  return (
    <main style={{ padding: '24px 16px 100px', maxWidth: '500px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <header>
        <h1 style={{ fontSize: '24px', fontWeight: '700' }}>Wallet</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Manage your funds and history</p>
      </header>

      <WalletCard />

      <section>
        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Fund Wallet</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', cursor: 'pointer' }}>
            <div style={{ ...iconStyle, backgroundColor: '#4F46E515' }}>
              <CreditCard size={20} color="#4F46E5" />
            </div>
            <span style={{ fontSize: '13px', fontWeight: '600' }}>Pay with Card</span>
          </div>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', cursor: 'pointer' }}>
            <div style={{ ...iconStyle, backgroundColor: '#10B98115' }}>
              <Landmark size={20} color="#10B981" />
            </div>
            <span style={{ fontSize: '13px', fontWeight: '600' }}>Bank Transfer</span>
          </div>
        </div>
      </section>

      <section>
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Transaction History</h3>
            <Search size={18} color="var(--text-secondary)" />
         </div>
         <TransactionList />
      </section>

      <BottomNav />
    </main>
  );
}

const iconStyle = {
  width: '40px',
  height: '40px',
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};
