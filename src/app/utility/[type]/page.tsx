'use client';

import { use, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, CheckCircle2, Search, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';

type UtilityType = 'airtime' | 'data' | 'electricity' | 'tv' | 'education';

const networks = [
  { id: 'mtn', name: 'MTN', color: '#FFCC00', logo: 'M', logoUrl: '/brand-logos/mtn.jpg' },
  { id: 'airtel', name: 'Airtel', color: '#FF0000', logo: 'A', logoUrl: '/brand-logos/airtel.png' },
  { id: 'glo', name: 'Glo', color: '#008000', logo: 'G', logoUrl: '/brand-logos/glo.png' },
  { id: '9mobile', name: '9mobile', color: '#005739', logo: '9', logoUrl: '/brand-logos/9mobile.jpg' },
];

const cableProviders = [
  { id: 'dstv', name: 'DSTV', color: '#00AEEF', logo: 'D', logoUrl: '/brand-logos/dstv.png' },
  { id: 'gotv', name: 'GOTV', color: '#00A550', logo: 'G', logoUrl: '/brand-logos/gotv.png' },
  { id: 'startimes', name: 'StarTimes', color: '#ED1C24', logo: 'S', logoUrl: '/brand-logos/startimes.png' },
];

const discos = [
  { id: 'abuja-electric', name: 'AEDC (Abuja)', color: '#003366', logo: 'A', logoUrl: '/brand-logos/AEDC.png' },
  { id: 'eko-electric', name: 'EKEDC (Eko)', color: '#FF0000', logo: 'E', logoUrl: '/brand-logos/EKEDC.jpg' },
  { id: 'ikeja-electric', name: 'IKEDC (Ikeja)', color: '#FF6600', logo: 'I', logoUrl: '/brand-logos/IKEDC.png' },
  { id: 'ibadan-electric', name: 'IBEDC (Ibadan)', color: '#008000', logo: 'I', logoUrl: '/brand-logos/IBEDC.jpeg' },
];

const eduProducts = [
  { id: 'waec', name: 'WAEC Result PIN', color: '#003366', logo: 'W', logoUrl: '/brand-logos/waec.jpg' },
  { id: 'neco', name: 'NECO Token', color: '#FF0000', logo: 'N', logoUrl: '/brand-logos/neco.jpg' },
  { id: 'nabteb', name: 'NABTEB PIN', color: '#008000', logo: 'B', logoUrl: '/brand-logos/nabteb.jpeg' },
];

export default function UtilityPage({ params }: { params: Promise<{ type: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const type = resolvedParams.type as UtilityType;
  
  const [selectedProvider, setSelectedProvider] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [meterType, setMeterType] = useState<'prepaid' | 'postpaid'>('prepaid');
  const [quantity, setQuantity] = useState('1');
  const [step, setStep] = useState<'input' | 'confirm' | 'success'>('input');
  
  const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);

  // Determine which providers to show
  const activeProviders = 
    type === 'airtime' || type === 'data' ? networks :
    type === 'tv' ? cableProviders :
    type === 'electricity' ? discos :
    type === 'education' ? eduProducts : [];

  const handleNext = () => {
    if (selectedProvider && (type === 'education' ? true : phone) && (type === 'education' ? true : amount)) {
      setStep('confirm');
    }
  };

  const handlePay = () => {
    setTimeout(() => setStep('success'), 1500);
  };

  return (
    <main style={{ padding: '24px 16px', maxWidth: '500px', margin: '0 auto', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
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
            style={{ display: 'flex' as any, flexDirection: 'column', gap: '24px' }}
          >
            {/* Provider Selection */}
            <div>
              <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>Select Provider</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                {activeProviders.map((p) => (
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
                      overflow: 'hidden',
                      border: selectedProvider === p.id ? `2px solid ${p.color}` : 'none'
                    }}>
                      {/* Using letter as fallback if image fails or is missing */}
                      <span style={{ position: 'absolute' }}>{p.logo}</span>
                      <img 
                        src={p.logoUrl} 
                        alt={p.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'relative', zIndex: 1 }}
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                    </div>
                    <span style={{ fontSize: '10px', fontWeight: '600', textAlign: 'center' }}>{p.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Fields Based on Type */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {type === 'electricity' && (
                <div style={{ display: 'flex', gap: '12px', marginBottom: '8px' }}>
                  <button 
                    onClick={() => setMeterType('prepaid')}
                    style={{ ...tabStyle, backgroundColor: meterType === 'prepaid' ? 'var(--primary-blue)' : 'var(--card-bg)', color: meterType === 'prepaid' ? 'white' : 'var(--text-primary)' }}
                  >Prepaid</button>
                  <button 
                    onClick={() => setMeterType('postpaid')}
                    style={{ ...tabStyle, backgroundColor: meterType === 'postpaid' ? 'var(--primary-blue)' : 'var(--card-bg)', color: meterType === 'postpaid' ? 'white' : 'var(--text-primary)' }}
                  >Postpaid</button>
                </div>
              )}

              {type !== 'education' && (
                <div>
                  <label style={labelStyle}>{type === 'tv' ? 'Smart Card Number' : type === 'electricity' ? 'Meter Number' : 'Phone Number'}</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="tel" 
                      placeholder={type === 'tv' ? 'Enter IUC Number' : type === 'electricity' ? 'Enter Meter Number' : '080 1234 5678'} 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={inputStyle} 
                    />
                    {type === 'tv' && (
                       <Search size={18} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                    )}
                  </div>
                </div>
              )}

              {type === 'education' && (
                <div>
                    <label style={labelStyle}>Quantity</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {['1', '2', '5'].map(q => (
                            <button 
                                key={q}
                                onClick={() => setQuantity(q)}
                                style={{ ...tabStyle, flex: 1, backgroundColor: quantity === q ? 'var(--primary-blue)' : 'var(--card-bg)', color: quantity === q ? 'white' : 'var(--text-primary)' }}
                            >{q}</button>
                        ))}
                    </div>
                </div>
              )}

              {type !== 'education' && (
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
              )}
            </div>

            <button 
                className="btn-primary" 
                onClick={handleNext}
                disabled={!selectedProvider}
                style={{ marginTop: 'auto', width: '100%', opacity: !selectedProvider ? 0.5 : 1 }}
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
            style={{ display: 'flex' as any, flexDirection: 'column', gap: '20px' }}
          >
             <h3 style={{ textAlign: 'center' }}>Confirm Transaction</h3>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <ConfirmRow label="Service" value={`${typeLabel} Purchase`} />
                <ConfirmRow label="Provider" value={activeProviders.find(p => p.id === selectedProvider)?.name || ''} />
                {type !== 'education' && <ConfirmRow label="Recipient" value={phone} />}
                {type === 'education' && <ConfirmRow label="Quantity" value={quantity} />}
                {type === 'electricity' && <ConfirmRow label="Meter Type" value={meterType} />}
                <ConfirmRow label="Amount" value={type === 'education' ? 'Calculated at Checkout' : `₦${amount}`} />
                <hr style={{ opacity: 0.1 }} />
                <ConfirmRow label="Fee" value="₦0.00" />
                <ConfirmRow label="Total" value={type === 'education' ? '...' : `₦${amount}`} bold />
             </div>
             
             <button className="btn-primary" onClick={handlePay}>
                Pay Now
             </button>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center' as any, paddingTop: '40px' }}
          >
            <div style={{ marginBottom: '24px' }}>
               <CheckCircle2 size={80} color="var(--action-green)" style={{ margin: '0 auto' }} />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>Success!</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
                Your {typeLabel} request has been processed.
            </p>
            <button className="btn-primary" onClick={() => router.push('/')} style={{ width: '100%' }}>
                Back to Home
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

const tabStyle: React.CSSProperties = {
    padding: '10px 16px',
    borderRadius: '10px',
    border: 'none',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
};
