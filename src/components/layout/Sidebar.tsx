'use client';

import { Home, Wallet, Gift, User, Grid, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTelegramAuth } from '@/components/TelegramProvider';

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useTelegramAuth();

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Services', href: '/services', icon: Grid },
    { name: 'Wallet', href: '/wallet', icon: Wallet },
    { name: 'Rewards', href: '/rewards', icon: Gift },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      // For TMA, we might just want to redirect to a 'logged out' view 
      // or clear local state. For web, we clear social login data.
      localStorage.clear();
      window.location.href = '/login';
    }
  };

  return (
    <aside className="desktop-only" style={{
      width: 'var(--sidebar-width)',
      height: '100vh',
      backgroundColor: 'var(--primary-blue)',
      color: 'white',
      position: 'fixed',
      left: 0,
      top: 0,
      padding: '32px 24px',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 100
    } as any}>
      <div style={{ marginBottom: '48px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '800', letterSpacing: '-0.5px' }}>
          Paperbill<span style={{ color: 'var(--action-green)' }}>.</span>
        </h1>
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '12px',
                backgroundColor: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: isActive ? 'white' : 'rgba(255,255,255,0.6)',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}>
                <item.icon size={20} />
                <span style={{ fontSize: '15px', fontWeight: '600' }}>{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User Profile Summary & Logout */}
      <div style={{ 
        marginTop: 'auto', 
        paddingTop: '24px', 
        borderTop: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            backgroundColor: 'var(--action-green)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: '700',
            color: 'white'
          }}>
            {user?.first_name?.[0] || 'P'}
          </div>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <p style={{ fontSize: '14px', fontWeight: '700', margin: 0, whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
              {user?.first_name} {user?.last_name}
            </p>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
              {user?.username ? `@${user.username}` : 'Smart Wallet'}
            </p>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(239, 68, 68, 0.1)',
            color: '#EF4444',
            border: 'none',
            padding: '10px 16px',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '600',
            transition: 'all 0.2s ease'
          }}
        >
          <LogOut size={16} />
          Logout Account
        </button>
      </div>
    </aside>
  );
}
