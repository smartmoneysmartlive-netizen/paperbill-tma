'use client';

import WalletCard from '@/components/dashboard/WalletCard';
import TokenCard from '@/components/dashboard/TokenCard';
import QuickActions from '@/components/dashboard/QuickActions';
import TransactionList from '@/components/dashboard/TransactionList';
import BottomNav from '@/components/dashboard/BottomNav';
import { Bell, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ 
      minHeight: '100vh', 
      padding: '24px 16px 100px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      maxWidth: '500px',
      margin: '0 auto'
    }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: '500' }}>Welcome back,</span>
          <h1 style={{ fontSize: '20px', fontWeight: '700' }}>Praise 👋</h1>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={iconBtnStyle}>
            <Search size={20} color="var(--text-primary)" />
          </div>
          <div style={iconBtnStyle}>
            <Bell size={20} color="var(--text-primary)" />
            <div style={{ 
              position: 'absolute', 
              top: '8px', 
              right: '8px', 
              width: '8px', 
              height: '8px', 
              background: 'red', 
              borderRadius: '50%',
              border: '2px solid var(--background)'
            }} />
          </div>
        </div>
      </header>

      {/* Wallet Section */}
      <WalletCard />

      {/* Quick Actions */}
      <section>
        <QuickActions />
      </section>

      {/* Token Featured Card */}
      <TokenCard />

      <Link href="/services" style={{ textDecoration: 'none' }}>
        <motion.div 
          whileTap={{ scale: 0.98 }}
          className="card" 
          style={{ 
            backgroundColor: 'var(--primary-blue)', 
            color: 'white',
            display: 'flex' as any,
            justifyContent: 'space-between',
            alignItems: 'center',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: '700' }}>🔥 Pay with PAPER</h4>
            <p style={{ fontSize: '12px', opacity: 0.8 }}>Get instant 5% cashback on all data buys</p>
          </div>
          <div style={{ 
            background: 'rgba(255,255,255,0.2)', 
            padding: '6px 12px', 
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: '700'
          }}>
            Claim Now
          </div>
        </motion.div>
      </Link>

      {/* Transactions */}
      <TransactionList />

      {/* Navigation */}
      <BottomNav />
    </main>
  );
}

const iconBtnStyle: React.CSSProperties = {
  width: '40px',
  height: '40px',
  borderRadius: '12px',
  backgroundColor: 'var(--card-bg)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: 'var(--shadow-soft)',
  cursor: 'pointer',
  position: 'relative'
};
