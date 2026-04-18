'use client';

import { Plus, ArrowLeftRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WalletCard() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card gradient-wallet"
      style={{ display: 'flex' as any, flexDirection: 'column', gap: '20px' }}
    >
      <div>
        <span style={{ fontSize: '14px', opacity: 0.8 }}>Total Balance</span>
        <h2 style={{ fontSize: '32px', fontWeight: '700', marginTop: '4px' }}>
          ₦ 45,000.<span style={{ fontSize: '20px', opacity: 0.7 }}>00</span>
        </h2>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button className="btn-primary" style={{ flex: 1, background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}>
          <Plus size={20} />
          Fund
        </button>
        <button className="btn-primary" style={{ flex: 1, background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}>
          <ArrowLeftRight size={20} />
          Swap
        </button>
      </div>
    </motion.div>
  );
}
