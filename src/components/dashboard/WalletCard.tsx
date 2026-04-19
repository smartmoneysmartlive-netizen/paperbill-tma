'use client';

import { Plus, ArrowLeftRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

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

        <div style={{ display: 'flex' as any, gap: '12px' }}>
          <Link href="/wallet" style={{ flex: 1 }}>
            <button className="btn-primary" style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Plus size={18} />
              <span>Fund</span>
            </button>
          </Link>
          <Link href="/rewards" style={{ flex: 1 }}>
            <button className="btn-primary" style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <ArrowLeftRight size={18} />
              <span>Swap</span>
            </button>
          </Link>
        </div>
    </motion.div>
  );
}
