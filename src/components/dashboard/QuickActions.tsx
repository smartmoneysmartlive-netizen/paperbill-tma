'use client';

import { Phone, Globe, Tv, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const actions = [
  { id: 'airtime', label: 'Airtime', icon: Phone, color: '#4F46E5', path: '/utility/airtime' },
  { id: 'data', label: 'Data', icon: Globe, color: '#10B981', path: '/utility/data' },
  { id: 'tv', label: 'TV', icon: Tv, color: '#F59E0B', path: '/utility/tv' },
  { id: 'electricity', label: 'Power', icon: Zap, color: '#EF4444', path: '/utility/electricity' },
];

export default function QuickActions() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
      {actions.map((action, index) => (
        <Link key={action.id} href={action.path} style={{ textDecoration: 'none' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 + 0.2 }}
            whileTap={{ scale: 0.9 }}
            style={{
              display: 'flex' as any,
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}
          >
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              backgroundColor: 'var(--card-bg)',
              boxShadow: 'var(--shadow-soft)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(0,0,0,0.02)'
            }}>
              <action.icon size={24} color={action.color} />
            </div>
            <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
              {action.label}
            </span>
          </motion.div>
        </Link>
      ))}
    </div>
  );
}
