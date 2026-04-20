'use client';

import { use, useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, CheckCircle2, Search, Info, Coins } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DATA_PLANS, CABLE_PLANS, ELECTRICITY_DISCOS, UtilityPlan } from '@/lib/vtu-data';
import { useTelegramAuth } from '@/components/TelegramProvider';

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
  const [selectedPlan, setSelectedPlan] = useState<UtilityPlan | null>(null);
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [meterType, setMeterType] = useState<'prepaid' | 'postpaid'>('prepaid');
  const [quantity, setQuantity] = useState('1');
  const [step, setStep] = useState<'input' | 'confirm' | 'success'>('input');
  const [usePaper, setUsePaper] = useState(false);
  const [activeTab, setActiveTab] = useState('Quick Data');
  const [loading, setLoading] = useState(false);
  
  const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);

  const activeProviders = useMemo(() => {
    if (type === 'airtime' || type === 'data') return networks;
    if (type === 'tv') return cableProviders;
    if (type === 'electricity') return ELECTRICITY_DISCOS.map(d => ({ 
        id: d.id.toString(), 
        name: d.name, 
        color: '#0A1F44', 
        logo: d.name.charAt(0), 
        logoUrl: `/brand-logos/${d.name.split(' ')[0]}.png` 
    }));
    if (type === 'education') return eduProducts;
    return [];
  }, [type]);

  const availablePlans = useMemo(() => {
    if (type === 'data') return DATA_PLANS[selectedProvider] || [];
    if (type === 'tv') return CABLE_PLANS[selectedProvider] || [];
    return [];
  }, [type, selectedProvider]);

  const filteredPlans = useMemo(() => {
    if (type === 'data') return availablePlans.filter(p => p.category === activeTab);
    return availablePlans;
  }, [type, availablePlans, activeTab]);

  const categories = ['Quick Data', 'Weekly Plans', 'Monthly Plans', 'Mega Plans'];

  const finalAmount = useMemo(() => {
    const base = selectedPlan ? selectedPlan.price : Number(amount);
    return usePaper ? Math.round(base * 0.96) : base;
  }, [selectedPlan, amount, usePaper]);

  const handleNext = () => {
    const hasProvider = !!selectedProvider;
    const hasAmount = type === 'data' || type === 'tv' ? !!selectedPlan : !!amount;
    const hasRecipient = type === 'education' ? true : !!phone;

    if (hasProvider && hasAmount && hasRecipient) {
      setStep('confirm');
    }
  };

  const { initDataRaw } = useTelegramAuth();

  const handlePay = async () => {
    if (!selectedProvider || (!selectedPlan && (type === 'data' || type === 'tv'))) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/utility/${type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${initDataRaw}`
        },
        body: JSON.stringify({
          amount: selectedPlan?.price || amount,
          planId: selectedPlan?.id,
          currency: usePaper ? 'PAPER' : 'NGN',
          payload: {
            phone,
            networkId: selectedProvider,
            meterType
          }
        })
      });

      const result = await response.json();

      if (response.ok) {
        setStep('success');
      } else {
        alert(result.message || 'Transaction failed. Please try again.');
      }
    } catch (err) {
      console.error('Payment Error:', err);
      alert('A network error occurred. Please check your connection.');
    } finally {
      setLoading(false);
    }
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
            <div>
              <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>Select Provider</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                {activeProviders.map((p) => (
                  <div 
                    key={p.id}
                    onClick={() => { setSelectedProvider(p.id); setSelectedPlan(null); }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      opacity: selectedProvider === p.id ? 1 : 0.5,
                      transform: selectedProvider === p.id ? 'scale(1.05)' : 'scale(1)',
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
                      border: selectedProvider === p.id ? `2px solid var(--primary-blue)` : '1px solid rgba(0,0,0,0.05)'
                    }}>
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {type !== 'education' && (
                <div>
                  <label style={labelStyle}>{type === 'tv' ? 'Smart Card Number' : type === 'electricity' ? 'Meter Number' : 'Phone Number'}</label>
                  <input 
                    type="tel" 
                    placeholder="Enter details..." 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={inputStyle} 
                  />
                </div>
              )}

              {type === 'electricity' && (
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={() => setMeterType('prepaid')} style={{ ...tabStyle, flex: 1, backgroundColor: meterType === 'prepaid' ? 'var(--primary-blue)' : 'var(--card-bg)', color: meterType === 'prepaid' ? 'white' : 'var(--text-primary)' }}>Prepaid</button>
                  <button onClick={() => setMeterType('postpaid')} style={{ ...tabStyle, flex: 1, backgroundColor: meterType === 'postpaid' ? 'var(--primary-blue)' : 'var(--card-bg)', color: meterType === 'postpaid' ? 'white' : 'var(--text-primary)' }}>Postpaid</button>
                </div>
              )}

              {(type === 'data' || type === 'tv') && selectedProvider && (
                <div style={{ marginTop: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <p style={{ fontSize: '14px', fontWeight: '600' }}>Select Plan</p>
                  </div>
                  
                  {type === 'data' && (
                    <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '12px' }}>
                       {categories.map(cat => (
                         <button 
                            key={cat} 
                            onClick={() => setActiveTab(cat)}
                            style={{ 
                                ...tabStyle, 
                                whiteSpace: 'nowrap',
                                backgroundColor: activeTab === cat ? 'var(--primary-blue)' : 'rgba(0,0,0,0.05)',
                                color: activeTab === cat ? 'white' : 'var(--text-primary)'
                            }}
                         >{cat}</button>
                       ))}
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
                    {filteredPlans.map(plan => (
                      <div 
                        key={plan.id}
                        onClick={() => setSelectedPlan(plan)}
                        style={{
                          padding: '16px',
                          borderRadius: '12px',
                          border: selectedPlan?.id === plan.id ? '2px solid var(--primary-blue)' : '1px solid rgba(0,0,0,0.1)',
                          backgroundColor: 'var(--card-bg)',
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <div>
                          <p style={{ fontWeight: '700', fontSize: '15px' }}>{plan.label}</p>
                          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{plan.duration || 'Standard'}</p>
                        </div>
                        <p style={{ fontWeight: '700', color: 'var(--primary-blue)' }}>₦{plan.price}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(type === 'airtime' || type === 'electricity') && (
                <div>
                  <label style={labelStyle}>Amount</label>
                  <input 
                    type="number" 
                    placeholder="0.00" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    style={inputStyle} 
                  />
                </div>
              )}

              {(selectedPlan || amount) && (
                <div 
                  style={{ 
                    padding: '16px', 
                    borderRadius: '16px', 
                    backgroundColor: 'rgba(0, 0, 0, 0.05)', 
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'not-allowed',
                    opacity: 0.6
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #9E9E9E, #616161)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Coins size={18} color="white" />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <p style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>Pay with PAPER</p>
                        <span style={{ fontSize: '9px', fontWeight: '800', backgroundColor: 'var(--primary-blue)', color: 'white', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>Coming Soon</span>
                      </div>
                      <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Save 4% on this transaction</p>
                    </div>
                  </div>
                  <div style={{ 
                    width: '20px', 
                    height: '20px', 
                    borderRadius: '50%', 
                    border: '2px solid #9E9E9E',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {/* Locked state */}
                  </div>
                </div>
              )}
            </div>

            <button 
                className="btn-primary" 
                onClick={handleNext}
                disabled={!selectedProvider || (type === 'data' && !selectedPlan)}
                style={{ marginTop: 'auto', width: '100%' }}
            >
              Continue to NGN {finalAmount}
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
             <h3 style={{ textAlign: 'center', fontWeight: '700' }}>Confirm Transaction</h3>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <ConfirmRow label="Service" value={`${typeLabel} Purchase`} />
                <ConfirmRow label="Provider" value={activeProviders.find(p => p.id === selectedProvider)?.name || ''} />
                {selectedPlan && <ConfirmRow label="Plan" value={selectedPlan.label} />}
                {phone && <ConfirmRow label="Recipient" value={phone} />}
                <hr style={{ opacity: 0.1 }} />
                <ConfirmRow label="Price" value={`₦${selectedPlan?.price || amount}`} />
                {usePaper && <ConfirmRow label="PAPER Discount (4%)" value={`-₦${Math.round((selectedPlan?.price || Number(amount)) * 0.04)}`} color="#00C853" />}
                <ConfirmRow label="Total" value={`₦${finalAmount}`} bold />
                <ConfirmRow label="Payment Method" value={usePaper ? 'PAPER Wallet' : 'NGN Wallet'} />
             </div>
             
             <button className="btn-primary" onClick={handlePay}>
                Confirm Payment
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
                Your {typeLabel} request has been processed successfully.
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

function ConfirmRow({ label, value, bold = false, color }: any) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
      <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
      <span style={{ fontWeight: bold ? '700' : '600', color: color || 'var(--text-primary)' }}>{value}</span>
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
