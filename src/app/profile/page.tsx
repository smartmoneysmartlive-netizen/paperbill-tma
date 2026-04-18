'use client';

import { useTheme } from '@/components/ThemeProvider';
import BottomNav from '@/components/dashboard/BottomNav';
import { Moon, Sun, Shield, HelpCircle, LogOut, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <main style={{ padding: '24px 16px 100px', maxWidth: '500px', margin: '0 auto' }}>
      <header style={{ marginBottom: '32px', textAlign: 'center' }}>
        <div style={{ 
          width: '80px', 
          height: '80px', 
          borderRadius: '50%', 
          backgroundColor: 'var(--primary-blue)', 
          margin: '0 auto 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          fontWeight: '700',
          color: 'white'
        }}>
          P
        </div>
        <h1 style={{ fontSize: '20px', fontWeight: '700' }}>Praise Durojaiye</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>@praise_paperbill</p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Theme Switcher */}
        <section className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ ...iconStyle, backgroundColor: 'rgba(79, 70, 229, 0.1)' }}>
              {theme === 'light' ? <Sun size={20} color="#4F46E5" /> : <Moon size={20} color="#4F46E5" />}
            </div>
            <span style={{ fontWeight: '600' }}>Dark Mode</span>
          </div>
          <motion.div 
            onClick={toggleTheme}
            style={{
              width: '48px',
              height: '24px',
              borderRadius: '12px',
              backgroundColor: theme === 'dark' ? 'var(--action-green)' : '#D1D5DB',
              position: 'relative',
              cursor: 'pointer',
              padding: '2px'
            }}
          >
            <motion.div 
              animate={{ x: theme === 'dark' ? 24 : 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: 'white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}
            />
          </motion.div>
        </section>

        {/* Other Menu Items */}
        <MenuItem icon={Shield} label="Security & PIN" color="#10B981" />
        <MenuItem icon={HelpCircle} label="Help & Support" color="#F59E0B" />
        <MenuItem icon={LogOut} label="Logout" color="#EF4444" hideArrow />
      </div>

      <BottomNav />
    </main>
  );
}

function MenuItem({ icon: Icon, label, color, hideArrow = false }: any) {
  return (
    <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ ...iconStyle, backgroundColor: `${color}15` }}>
          <Icon size={20} color={color} />
        </div>
        <span style={{ fontWeight: '600' }}>{label}</span>
      </div>
      {!hideArrow && <ChevronRight size={20} color="var(--text-secondary)" />}
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
