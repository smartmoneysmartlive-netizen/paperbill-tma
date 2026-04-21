'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const widgetContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 0. TMA Super-Detection: Bypass login if already in Telegram (Object + Hash check)
    const isInsideTelegram = 
      (typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.initData) ||
      (typeof window !== 'undefined' && window.location.hash.includes('tgWebAppData'));

    if (isInsideTelegram) {
      router.replace('/');
      return;
    }

    // 1. Define the callback for the Telegram widget
    (window as any).onTelegramAuth = async (user: any) => {
      setLoading(true);
      try {
        const response = await fetch('/api/auth/web-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user)
        });
        const result = await response.json();
        
        if (result.success) {
          router.push('/');
          router.refresh();
        } else {
          alert(result.message || 'Login failed');
          setLoading(false);
        }
      } catch (err) {
        console.error('Login Error:', err);
        alert('A connection error occurred.');
        setLoading(false);
      }
    };

    // 2. Inject the Telegram script
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', 'VtuTokenbot'); // Uses the verified username
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-radius', '12');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.setAttribute('data-request-access', 'write');
    script.async = true;

    if (widgetContainerRef.current) {
      widgetContainerRef.current.appendChild(script);
    }

    return () => {
      // Cleanup script on unmount
      if (widgetContainerRef.current) {
        widgetContainerRef.current.innerHTML = '';
      }
    };
  }, [router]);

  return (
    <main style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'var(--primary-blue)',
      padding: '24px'
    }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: 'white',
          borderRadius: '24px',
          padding: '40px 32px',
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
        } as any}
      >
        <Link href="/landing" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          color: 'var(--text-secondary)', 
          fontSize: '14px',
          marginBottom: '32px',
          fontWeight: '500'
        }}>
          <ArrowLeft size={16} />
          Back to landing
        </Link>

        <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--primary-blue)', marginBottom: '12px' }}>
          Welcome Back
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginBottom: '40px' }}>
          Connect your Telegram account to securely access your Paperbill wallet.
        </p>

        <div style={{ minHeight: '48px', display: 'flex', justifyContent: 'center' }}>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <Loader2 className="animate-spin" color="var(--primary-blue)" size={32} />
              <span style={{ fontSize: '13px', color: 'var(--primary-blue)', fontWeight: '600' }}>Authenticating...</span>
            </div>
          ) : (
            <div ref={widgetContainerRef} id="telegram-widget-container" />
          )}
        </div>

        <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid #f0f0f0' }}>
          <p style={{ fontSize: '12px', color: '#999', lineHeight: '1.5' }}>
            By continuing, you agree to our Terms of Service and Privacy Policy. Paperbill never sees your Telegram password.
          </p>
        </div>
      </motion.div>
    </main>
  );
}
