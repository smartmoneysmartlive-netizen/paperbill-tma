'use client';

import { Home, Grid, Wallet, Gift, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { id: 'home', label: 'Home', icon: Home, path: '/' },
  { id: 'services', label: 'Services', icon: Grid, path: '/services' },
  { id: 'wallet', label: 'Wallet', icon: Wallet, path: '/wallet' },
  { id: 'rewards', label: 'Rewards', icon: Gift, path: '/rewards' },
  { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    const currentTab = tabs.find(tab => tab.path === pathname);
    if (currentTab) setActiveTab(currentTab.id);
  }, [pathname]);

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'var(--card-bg)',
      borderTop: '1px solid rgba(0,0,0,0.05)',
      padding: '12px 16px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 100,
      boxShadow: '0 -4px 12px rgba(0,0,0,0.03)'
    }}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <Link key={tab.id} href={tab.path} style={{ textDecoration: 'none' }}>
            <motion.div
              whileTap={{ scale: 0.9 }}
              style={{
                display: 'flex' as any,
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
                position: 'relative'
              }}
            >
              <tab.icon 
                size={24} 
                color={isActive ? 'var(--action-green)' : 'var(--text-secondary)'} 
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span style={{ 
                fontSize: '10px', 
                fontWeight: isActive ? '700' : '500',
                color: isActive ? 'var(--action-green)' : 'var(--text-secondary)'
              }}>
                {tab.label}
              </span>
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  style={{
                    position: 'absolute',
                    top: -12,
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--action-green)'
                  }}
                />
              )}
            </motion.div>
          </Link>
        );
      })}
    </nav>
  );
}
