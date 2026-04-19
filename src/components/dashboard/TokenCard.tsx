'use client';

import { Coins, TrendingUp, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function TokenCard() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="card gradient-gold"
      style={{ position: 'relative' as any, overflow: 'hidden' as any }}
    >
      <div className="shimmer" style={{ position: 'absolute' as any, inset: 0 as any, opacity: 0.3 }} />
      
      <div style={{ position: 'relative' as any, zIndex: 1 }}>
        <div style={{ display: 'flex' as any, justifyContent: 'space-between' as any, alignItems: 'flex-start' as any }}>
          <div>
            <div style={{ display: 'flex' as any, alignItems: 'center' as any, gap: '6px', opacity: 0.9 }}>
              <Coins size={16} color="#0A1F44" />
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#0A1F44' }}>PAPER BALANCE</span>
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#0A1F44', marginTop: '4px' }}>
              120 PAPER
            </h2>
            <p style={{ fontSize: '13px', fontWeight: '500', color: '#0A1F44', opacity: 0.7 }}>
              ≈ ₦ 18,000.00
            </p>
          </div>
          <div style={{ background: 'rgba(10, 31, 68, 0.1)', padding: '8px', borderRadius: '12px' }}>
             <TrendingUp size={24} color="#0A1F44" />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
          <button style={actionStyle}>Stake</button>
          <button style={actionStyle}>Send</button>
          <button style={{ ...actionStyle, background: '#0A1F44', color: 'white' }}>Buy</button>
        </div>
      </div>
    </motion.div>
  );
}

const actionStyle: React.CSSProperties = {
  flex: 1,
  height: '36px',
  borderRadius: '10px',
  border: 'none',
  background: 'rgba(10, 31, 68, 0.08)',
  fontSize: '12px',
  fontWeight: '600',
  color: '#0A1F44',
  cursor: 'pointer',
};
