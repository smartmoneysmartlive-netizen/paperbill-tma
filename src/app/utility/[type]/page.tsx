'use client';

import { use, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

const providers = [
  { id: 'mtn', name: 'MTN', color: '#FFCC00', logo: 'M' },
  { id: 'airtel', name: 'Airtel', color: '#FF0000', logo: 'A' },
  { id: 'glo', name: 'Glo', color: '#008000', logo: 'G' },
  { id: '9mobile', name: '9mobile', color: '#005739', logo: '9' },
];

export default function UtilityPage({ params }: { params: Promise<{ type: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [selectedProvider, setSelectedProvider] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<'input' | 'confirm' | 'success'>('input');

  const typeLabel = resolvedParams.type.charAt(0).toUpperCase() + resolvedParams.type.slice(1);

  const handleNext = () => {
    if (selectedProvider && phone && amount) {
      setStep('confirm');
    }
  };

  const handlePay = () => {
    // Simulating the check described by the user
    setTimeout(() => {
      setStep('success');
    }, 1500);
  };

  return (
    <main style={{ padding: '24px 16px', maxWidth: '500px', margin: '0 auto', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
       {/* Simple Browser back button since SDK might not be active in browser */}
      <header style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <button 
          onClick={() => step === 'input' ? router.back() : setStep('input')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
        >
          <ChevronLeft size={24} color="var(--text-primary)" />
        </button>
        <h1 style={{ fontSize: '20px', fontWeight: '700' }}>Buy {typeLabel}</h1>
      </header>

      <AnimatePresence mode="wait">
        {step === 'input' && (
          <motion.div 
            key="input"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
          >
            {/* Provider Selection */}
            <div>
              <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>Select Provider</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                {providers.map((p) => (
                  <div 
                    key={p.id}
                    onClick={() => setSelectedProvider(p.id)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      opacity: selectedProvider === p.id ? 1 : 0.5,
                      transform: selectedProvider === p.id ? 'scale(1.1)' : 'scale(1)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      backgroundColor: p.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: '700',
                      fontSize: '20px',
                      boxShadow: selectedProvider === p.id ? `0 0 15px ${p.color}50` : 'none'
                    }}>
                      {p.logo}
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: '600' }}>{p.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Phone Number</label>
                <input 
                  type="tel" 
                  placeholder="080 1234 5678" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={inputStyle} 
                />
              </div>
              <div>
                <label style={labelStyle}>Amount</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontWeight: '700' }}>₦</span>
                  <input 
                    type="number" 
                    placeholder="0.00" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    style={{ ...inputStyle, paddingLeft: '32px' }} 
                  />
                </div>
              </div>
            </div>

            <button 
                className="btn-primary" 
                onClick={handleNext}
                disabled={!selectedProvider || !phone || !amount}
                style={{ marginTop: 'auto', width: '100%', opacity: (!selectedProvider || !phone || !amount) ? 0.5 : 1 }}
            >
              Continue
            </button>
          </motion.div>
        )}

        {step === 'confirm' && (
          <motion.div 
            key="confirm"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="card"
            style={{ display: 'flex', flexDirection: 'column', gap: '20px', backgroundColor: 'var(--card-bg)' }}
          >
             <h3 style={{ textAlign: 'center' }}>Confirm Transaction</h3>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <ConfirmRow label="Service" value={`${typeLabel} Top-up`} />
                <ConfirmRow label="Provider" value={providers.find(p => p.id === selectedProvider)?.name || ''} />
                <ConfirmRow label="Recipient" value={phone} />
                <ConfirmRow label="Amount" value={`₦${amount}`} />
                <hr style={{ opacity: 0.1 }} />
                <ConfirmRow label="Fee" value="₦0.00" />
                <ConfirmRow label="Total" value={`₦${amount}`} bold />
             </div>
             
             <button className="btn-primary" onClick={handlePay}>
                Pay ₦{amount}
             </button>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center', paddingTop: '40px' }}
          >
            <div style={{ marginBottom: '24px' }}>
               <CheckCircle2 size={80} color="var(--action-green)" style={{ margin: '0 auto' }} />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>Payment Successful!</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
                Your {typeLabel} for {phone} has been processed successfully.
            </p>
            <button className="btn-primary" onClick={() => router.push('/')} style={{ width: '100%' }}>
                Back to Dashboard
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function ConfirmRow({ label, value, bold = false }: any) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
      <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
      <span style={{ fontWeight: bold ? '700' : '600' }}>{value}</span>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '13px',
  fontWeight: '600',
  marginBottom: '8px',
  color: 'var(--text-secondary)'
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  height: '52px',
  borderRadius: '12px',
  border: '1.5px solid rgba(0,0,0,0.1)',
  padding: '0 16px',
  fontSize: '16px',
  fontWeight: '600',
  backgroundColor: 'var(--card-bg)',
  color: 'var(--text-primary)',
  outline: 'none'
};
