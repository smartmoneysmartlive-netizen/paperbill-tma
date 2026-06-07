'use client';

import BottomNav from '@/components/dashboard/BottomNav';
import WalletCard from '@/components/dashboard/WalletCard';
import TransactionList from '@/components/dashboard/TransactionList';
import { CreditCard, Landmark, History, Loader2, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useTelegramAuth } from '@/components/TelegramProvider';

type PaymentStatus = 'idle' | 'verifying' | 'success';

export default function WalletPage() {
  const [depositAmount, setDepositAmount] = useState('1000');
  const [showPrompt, setShowPrompt] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const { initDataRaw } = useTelegramAuth();

  // Detect return from Paystack payment
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('reference') || params.get('trxref');
    if (ref) {
      setPaymentStatus('verifying');
      // Clean the URL so refreshing doesn't re-trigger
      window.history.replaceState({}, '', '/wallet');
      // Give the webhook a few seconds to process, then show success
      const timer = setTimeout(() => {
        setPaymentStatus('success');
      }, 4000);
      // Auto-dismiss after 10s total and refresh to pick up new balance
      const dismissTimer = setTimeout(() => {
        setPaymentStatus('idle');
        window.location.reload();
      }, 10000);
      return () => {
        clearTimeout(timer);
        clearTimeout(dismissTimer);
      };
    }
  }, []);

  const handleDeposit = async () => {
    const amountNum = Number(depositAmount);
    if (amountNum < 1000) {
      alert('Minimum deposit is ₦1,000');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/wallet/deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${initDataRaw}`
        },
        body: JSON.stringify({ amount: amountNum })
      });

      const result = await response.json();
      if (result.success && result.authorization_url) {
        window.location.href = result.authorization_url;
      } else {
        alert(result.message || 'Failed to initialize payment');
      }
    } catch (err) {
      console.error('Deposit Error:', err);
      alert('A connection error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <header>
        <h1 style={{ fontSize: '24px', fontWeight: '700' }}>Wallet</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Manage your funds and history</p>
      </header>

      {/* Payment status banner */}
      <AnimatePresence>
        {paymentStatus !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{
              padding: '16px',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: paymentStatus === 'verifying'
                ? 'rgba(251, 191, 36, 0.1)'
                : 'rgba(16, 185, 129, 0.1)',
              border: `1px solid ${paymentStatus === 'verifying' ? 'rgba(251, 191, 36, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
            }}
          >
            {paymentStatus === 'verifying' ? (
              <>
                <Clock size={20} color="#F59E0B" style={{ flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: '14px', fontWeight: '700', color: '#F59E0B' }}>Verifying Payment...</p>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Your payment is being confirmed. This usually takes a few seconds.
                  </p>
                </div>
              </>
            ) : (
              <>
                <CheckCircle2 size={20} color="#10B981" style={{ flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: '14px', fontWeight: '700', color: '#10B981' }}>Payment Successful!</p>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Your wallet will be updated shortly. Refreshing...
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <WalletCard />

      <section>
        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Fund Wallet</h3>
        
        <AnimatePresence>
          {showPrompt ? (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="card"
              style={{ marginBottom: '16px', border: '1px solid var(--primary-blue)', overflow: 'hidden' } as any}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>Amount to Credit (₦)</label>
                  <input 
                    type="number" 
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    style={{ ...inputStyle, width: '100%', marginTop: '4px' }}
                    placeholder="1000"
                  />
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', borderRadius: '12px', backgroundColor: 'rgba(79, 70, 229, 0.05)' }}>
                  <AlertCircle size={16} color="var(--primary-blue)" />
                  <p style={{ fontSize: '12px', color: 'var(--primary-blue)' }}>
                    Total charge: <strong>₦{Number(depositAmount) + 80}</strong> (incl. ₦80 fee)
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    onClick={() => setShowPrompt(false)} 
                    style={{ ...btnSecondary, flex: 1 }}
                  >Cancel</button>
                  <button 
                    onClick={handleDeposit} 
                    disabled={loading}
                    style={{ ...btnPrimary, flex: 2, display: 'flex', gap: '8px', justifyContent: 'center' }}
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : 'Pay Now'}
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div onClick={() => setShowPrompt(true)} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', cursor: 'pointer' }}>
                <div style={{ ...iconStyle, backgroundColor: '#4F46E515' }}>
                  <CreditCard size={20} color="#4F46E5" />
                </div>
                <span style={{ fontSize: '13px', fontWeight: '600' }}>Pay with Card</span>
              </div>
              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', cursor: 'not-allowed', opacity: 0.6 }}>
                <div style={{ ...iconStyle, backgroundColor: '#10B98115' }}>
                  <Landmark size={20} color="#10B981" />
                </div>
                <div>
                   <span style={{ fontSize: '13px', fontWeight: '600' }}>Bank Transfer</span>
                   <p style={{ fontSize: '10px', color: 'var(--primary-blue)' }}>Coming Soon</p>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </section>

      <section>
         <TransactionList />
      </section>
    </div>
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

const inputStyle = {
  padding: '12px 16px',
  borderRadius: '12px',
  border: '1px solid rgba(0,0,0,0.1)',
  fontSize: '16px',
  fontWeight: '600',
  outline: 'none',
  backgroundColor: 'var(--card-bg)',
  color: 'var(--text-primary)'
};

const btnPrimary = {
  padding: '12px',
  borderRadius: '12px',
  backgroundColor: 'var(--primary-blue)',
  color: 'white',
  fontWeight: '700',
  border: 'none',
  cursor: 'pointer'
};

const btnSecondary = {
  padding: '12px',
  borderRadius: '12px',
  backgroundColor: 'rgba(0,0,0,0.05)',
  color: 'var(--text-primary)',
  fontWeight: '600',
  border: 'none',
  cursor: 'pointer'
};
