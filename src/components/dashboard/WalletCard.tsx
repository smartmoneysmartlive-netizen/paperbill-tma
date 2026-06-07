'use client';

import { Plus, ArrowLeftRight, Loader2, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useTelegramAuth } from '@/components/TelegramProvider';

export default function WalletCard() {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const { initDataRaw } = useTelegramAuth();
  const [showBalance, setShowBalance] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('paperbill-show-balance');
    if (saved !== null) {
      setShowBalance(saved === 'true');
    }

    const handleSync = () => {
      const updated = localStorage.getItem('paperbill-show-balance');
      if (updated !== null) {
        setShowBalance(updated === 'true');
      }
    };

    window.addEventListener('balance-visibility-changed', handleSync);
    return () => window.removeEventListener('balance-visibility-changed', handleSync);
  }, []);

  const toggleVisibility = () => {
    const newValue = !showBalance;
    setShowBalance(newValue);
    localStorage.setItem('paperbill-show-balance', String(newValue));
    window.dispatchEvent(new Event('balance-visibility-changed'));
  };

  useEffect(() => {
    async function fetchBalance() {
      try {
        const response = await fetch('/api/wallet/balance', {
          headers: {
            'Authorization': `Bearer ${initDataRaw}`
          }
        });
        const data = await response.json();
        if (data.success) {
          setBalance(data.nairaBalance);
        }
      } catch (err) {
        console.error('Failed to fetch balance:', err);
      } finally {
        setLoading(false);
      }
    }

    if (initDataRaw) fetchBalance();
  }, [initDataRaw]);

  const formattedBalance = balance !== null ? balance.toLocaleString() : '0';
  const [whole, decimal] = formattedBalance.split('.');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card gradient-wallet"
      style={{ display: 'flex', flexDirection: 'column', gap: '20px', minHeight: '160px', justifyContent: 'center' } as any}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '14px', opacity: 0.8 }}>Total Balance</span>
          <button 
            onClick={toggleVisibility}
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              opacity: 0.8,
              outline: 'none'
            }}
          >
            {showBalance ? <Eye size={16} color="white" /> : <EyeOff size={16} color="white" />}
          </button>
        </div>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
            <Loader2 className="animate-spin" size={24} />
          </div>
        ) : (
          <h2 style={{ fontSize: '32px', fontWeight: '700', marginTop: '4px' }}>
            {showBalance ? (
              <>
                ₦ {whole}.<span style={{ fontSize: '20px', opacity: 0.7 }}>{decimal || '00'}</span>
              </>
            ) : (
              <span>₦ ••••••</span>
            )}
          </h2>
        )}
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
