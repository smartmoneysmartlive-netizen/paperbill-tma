'use client';

import BottomNav from '@/components/dashboard/BottomNav';
import { Phone, Globe, Tv, Zap, Wifi, CreditCard, Building2, Ticket } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const services = [
  { id: 'airtime', label: 'Airtime', icon: Phone, color: '#4F46E5', desc: 'Top up any phone' },
  { id: 'data', label: 'Data', icon: Globe, color: '#10B981', desc: 'Cheap data bundles' },
  { id: 'tv', label: 'Cable TV', icon: Tv, color: '#F59E0B', desc: 'DSTV, GOTV & more' },
  { id: 'electricity', label: 'Electricity', icon: Zap, color: '#EF4444', desc: 'Buy power tokens' },
  { id: 'internet', label: 'Internet', icon: Wifi, color: '#06B6D4', desc: 'Smile, Spectranet' },
  { id: 'education', label: 'Education', icon: Ticket, color: '#8B5CF6', desc: 'WAEC & JAMB pins' },
  { id: 'betting', label: 'Betting', icon: CreditCard, color: '#EC4899', desc: 'Fund betting wallet' },
  { id: 'insurance', label: 'Insurance', icon: Building2, color: '#6366F1', desc: 'Health & Vehicle' },
];

export default function ServicesPage() {
  return (
    <main style={{ padding: '24px 16px 100px', maxWidth: '500px', margin: '0 auto' }}>
      <header style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700' }}>All Services</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Quality utility payments at your fingertips</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {services.map((service, index) => (
          <Link key={service.id} href={`/utility/${service.id}`} style={{ textDecoration: 'none' }}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileTap={{ scale: 0.95 }}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                height: '100%',
                cursor: 'pointer'
              }}
            >
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: `${service.color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <service.icon size={22} color={service.color} />
              </div>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '4px' }}>{service.label}</h3>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.3' }}>
                  {service.desc}
                </p>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      <BottomNav />
    </main>
  );
}
