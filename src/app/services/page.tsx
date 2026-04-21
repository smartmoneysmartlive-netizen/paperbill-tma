'use client';

import BottomNav from '@/components/dashboard/BottomNav';
import { Phone, Globe, Tv, Zap, Wifi, CreditCard, Building2, Ticket } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const services = [
  { id: 'airtime', label: 'Airtime', icon: Phone, color: '#4F46E5', desc: 'Top up any phone', active: true },
  { id: 'data', label: 'Data', icon: Globe, color: '#10B981', desc: 'Cheap data bundles', active: true },
  { id: 'tv', label: 'Cable TV', icon: Tv, color: '#F59E0B', desc: 'DSTV, GOTV & more', active: true },
  { id: 'electricity', label: 'Electricity', icon: Zap, color: '#EF4444', desc: 'Buy power tokens', active: true },
  { id: 'education', label: 'Education', icon: Ticket, color: '#8B5CF6', desc: 'WAEC & JAMB pins', active: true },
  { id: 'internet', label: 'Internet', icon: Wifi, color: '#06B6D4', desc: 'Coming Soon', active: false },
  { id: 'insurance', label: 'Insurance', icon: Building2, color: '#6366F1', desc: 'Coming Soon', active: false },
];

export default function ServicesPage() {
  return (
    <div className="page-container">
      <header style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700' }}>All Services</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Quality utility payments at your fingertips</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px' }}>
        {services.map((service, index) => {
          const content = (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileTap={service.active ? { scale: 0.95 } : {}}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                height: '100%',
                cursor: service.active ? 'pointer' : 'default',
                opacity: service.active ? 1 : 0.6,
                filter: service.active ? 'none' : 'grayscale(0.5)'
              } as any}
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
          );

          return service.active ? (
            <Link key={service.id} href={`/utility/${service.id}`} style={{ textDecoration: 'none' }}>
              {content}
            </Link>
          ) : (
            <div key={service.id}>{content}</div>
          );
        })}
      </div>
    </div>
  );
}
