'use client';

import { motion } from 'framer-motion';
import { 
  Shield, Zap, Gift, Smartphone, Globe, 
  ArrowRight, CreditCard, Wallet, Trophy, Lock, Loader2, ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    // 1. Scroll Detection
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);

    // 2. Smart Auth Check
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/session');
        const data = await res.json();
        setIsAuthenticated(data.isAuthenticated);
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        setLoadingAuth(false);
      }
    };

    checkAuth();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ backgroundColor: '#fff', color: '#0A1F44', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* ELITE CLEAN NAVBAR */}
      <nav style={{
        padding: scrolled ? '12px 0' : '32px 0',
        position: 'fixed',
        width: '100%',
        top: 0,
        backgroundColor: scrolled ? 'rgba(255,255,255,1)' : 'transparent',
        zIndex: 1000,
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        borderBottom: scrolled ? '1px solid rgba(10, 31, 68, 0.08)' : '1px solid transparent'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          width: '90%', 
          margin: '0 auto',
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '8px', backgroundColor: '#0A1F44', borderRadius: '10px' }}>
              <Wallet size={20} color="#00C853" />
            </div>
            <span style={{ fontSize: '22px', fontWeight: '900', letterSpacing: '-0.5px' }}>
              Paperbill<span style={{ color: '#00C853' }}>.</span>
            </span>
          </div>

          {/* Centered Navigation (Floating) */}
          <div className="desktop-only" style={{ display: 'flex', gap: '32px' }}>
            {['Features', 'Security', 'Rewards'].map(item => (
              <button 
                key={item} 
                onClick={() => scrollToSection(item.toLowerCase())}
                style={{ 
                  fontSize: '15px', 
                  fontWeight: '600', 
                  color: '#0A1F44', 
                  opacity: 0.6,
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Action Zone - Smart Recognition */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {loadingAuth ? (
               <Loader2 size={20} className="animate-spin" opacity={0.3} />
            ) : isAuthenticated ? (
              <Link href="/">
                <button style={{
                  backgroundColor: '#0A1F44',
                  color: '#fff',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontWeight: '800',
                  fontSize: '15px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 8px 16px rgba(10, 31, 68, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  Dashboard <ChevronRight size={16} />
                </button>
              </Link>
            ) : (
              <>
                <Link href="/login" className="desktop-only">
                  <button style={{
                    color: '#0A1F44',
                    padding: '12px 18px',
                    borderRadius: '10px',
                    fontWeight: '700',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    fontSize: '15px'
                  }}>
                    Login
                  </button>
                </Link>
                <Link href="/login">
                  <button style={{
                    backgroundColor: '#0A1F44',
                    color: '#fff',
                    padding: '12px 24px',
                    borderRadius: '10px',
                    fontWeight: '800',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '15px',
                    boxShadow: '0 8px 16px rgba(10, 31, 68, 0.12)'
                  }}>
                    Connect Wallet
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* REFINED SPLIT HERO */}
      <header style={{ 
        padding: '240px 0 160px', 
        width: '90%',
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '80px',
        position: 'relative'
      }}>
        <div style={{ flex: '1', minWidth: '320px' }}>
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', backgroundColor: '#00C85310', borderRadius: '6px', marginBottom: '32px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#00C853' }} />
              <span style={{ color: '#00C853', fontSize: '12px', fontWeight: '900', letterSpacing: '1.5px' }}>
                 LIVE HYBRID APP
              </span>
            </div>
            <h1 style={{ 
              fontSize: 'clamp(44px, 5.5vw, 72px)', 
              fontWeight: '900', 
              lineHeight: '0.98',
              letterSpacing: '-2.5px',
              marginBottom: '32px',
              color: '#0A1F44'
            }}>
              Digital wallet<br/>
              for <span style={{ color: '#00C853' }}>Paperbills.</span>
            </h1>
            <p style={{ fontSize: '19px', color: '#475569', lineHeight: '1.6', marginBottom: '48px', maxWidth: '480px', fontWeight: '500' }}>
              Send money, pay bills, and get rewarded in real-time. Experience the most powerful VTU ecosystem in Nigeria.
            </p>

            <div style={{ display: 'flex', gap: '16px' }}>
              <Link href={isAuthenticated ? "/" : "/login"}>
                <button style={{
                  backgroundColor: '#0A1F44',
                  color: '#fff',
                  padding: '20px 40px',
                  borderRadius: '16px',
                  fontWeight: '800',
                  fontSize: '18px',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  boxShadow: '0 20px 40px rgba(10, 31, 68, 0.2)',
                  cursor: 'pointer'
                }}>
                  {isAuthenticated ? 'Go to Dashboard' : 'Open Wallet'} <ArrowRight size={22} />
                </button>
              </Link>
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ flex: '1.4', minWidth: '320px', position: 'relative' } as any}
        >
          <div style={{ 
            borderRadius: '40px', 
            overflow: 'hidden', 
            boxShadow: '0 50px 100px -20px rgba(10, 31, 68, 0.2), 0 30px 60px -30px rgba(0, 0, 0, 0.2)',
            border: '8px solid #fff',
            backgroundColor: '#fff',
          }}>
            <img 
              src="/hero.jpeg" 
              alt="Paperbill Interface" 
              style={{ width: '100%', display: 'block' }} 
            />
          </div>
        </motion.div>
      </header>

      {/* CORE FEATURES (Grid) */}
      <section id="features" style={{ padding: '160px 0', backgroundColor: '#F8FAFC' }}>
        <div style={{ width: '90%', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 100px' }}>
            <h2 style={{ fontSize: '42px', fontWeight: '900', marginBottom: '24px', letterSpacing: '-1.5px' }}>Simple. Fast. Secure.</h2>
            <p style={{ fontSize: '18px', color: '#475569', fontWeight: '500' }}>Everything you need to thrive in the digital economy, all in one place.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
            <FeatureCard 
              icon={Zap} 
              title="Instant Delivery" 
              desc="Our direct-to-telco connections ensure your airtime and data arrive in seconds."
              color="#00C853"
            />
            <FeatureCard 
              icon={Gift} 
              title="Yield Rewards" 
              desc="Earn PAPER tokens on every transaction. Stake them to unlock exclusive discounts."
              color="#4F46E5"
            />
            <FeatureCard 
              icon={Shield} 
              title="Verified by Telegram" 
              desc="Your identity is protected by Telegram’s world-class cryptographic infrastructure."
              color="#0A1F44"
            />
          </div>
        </div>
      </section>

      {/* TRUSTED BY NUMBERS */}
      <section id="rewards" style={{ padding: '100px 0', backgroundColor: '#0A1F44', color: '#fff' }}>
        <div style={{ width: '90%', maxWidth: '1000px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '60px', textAlign: 'center' }}>
           <Stat label="Total Volume" value="₦2.5B+" />
           <Stat label="Active Wallets" value="14.2k" />
           <Stat label="PAPER Reward Pool" value="4.5M" />
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: '160px 5%' }}>
        <div style={{ 
          maxWidth: '1200px',
          margin: '0 auto',
          backgroundColor: '#0A1F44', 
          borderRadius: '48px', 
          padding: '100px 40px', 
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          backgroundImage: 'linear-gradient(135deg, #0A1F44 0%, #112B5A 100%)'
        }}>
          <h2 style={{ color: '#fff', fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: '900', marginBottom: '32px', letterSpacing: '-2px' }}>
            The future of bill payments <br/>is here.
          </h2>
          <Link href={isAuthenticated ? "/" : "/login"}>
            <button style={{ 
              backgroundColor: '#00C853', 
              color: '#0A1F44', 
              padding: '22px 56px', 
              borderRadius: '16px', 
              fontWeight: '900', 
              fontSize: '18px', 
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 20px 40px rgba(0, 200, 83, 0.2)'
            }}>
              {isAuthenticated ? 'Enter Dashboard' : 'Connect Account Now'}
            </button>
          </Link>
        </div>
      </section>

      {/* CLEAN FOOTER */}
      <footer style={{ padding: '120px 0 60px', borderTop: '1px solid #f1f5f9' }}>
         <div style={{ width: '90%', maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '80px' }}>
            <div style={{ gridColumn: 'span 2' }}>
               <h3 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '24px' }}>Paperbill<span style={{ color: '#00C853' }}>.</span></h3>
               <p style={{ color: '#64748B', maxWidth: '300px', lineHeight: '1.7', fontSize: '15px' }}>
                 Redefining digital finance for the next generation of Africans. Fast, secure, and rewarding.
               </p>
            </div>
            <FooterCol title="Product" items={['Features', 'Security', 'Rewards', 'Privacy']} />
            <FooterCol title="Connect" items={['Help Desk', 'Twitter', 'Instagram', 'Telegram']} />
         </div>
         <div style={{ width: '90%', maxWidth: '1200px', margin: '100px auto 0', borderTop: '1px solid #f1f5f9', paddingTop: '40px', textAlign: 'center', color: '#94A3B8', fontSize: '14px' }}>
            &copy; {new Date().getFullYear()} Paperbill Global. Built with precision by Bolaji.
         </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc, color }: any) {
  return (
    <div style={{ 
      backgroundColor: '#fff', 
      padding: '64px 44px', 
      borderRadius: '32px', 
      boxShadow: '0 8px 16px -4px rgba(0, 0, 0, 0.04), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
      border: '1px solid #f1f5f9',
      transition: 'all 0.3s ease'
    }}>
      <div style={{ width: '64px', height: '64px', borderRadius: '18px', backgroundColor: `${color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}>
        <Icon size={28} color={color} />
      </div>
      <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px' }}>{title}</h3>
      <p style={{ color: '#475569', lineHeight: '1.7', fontSize: '15px', fontWeight: '500' }}>{desc}</p>
    </div>
  );
}

function Stat({ label, value }: any) {
  return (
    <div>
       <h4 style={{ fontSize: '48px', fontWeight: '900', marginBottom: '8px', color: '#00C853' }}>{value}</h4>
       <p style={{ fontSize: '12px', fontWeight: '800', opacity: 0.5, letterSpacing: '2px' }}>{label.toUpperCase()}</p>
    </div>
  );
}

function FooterCol({ title, items }: any) {
  return (
    <div>
       <h4 style={{ fontSize: '15px', fontWeight: '900', marginBottom: '24px' }}>{title}</h4>
       <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {items.map((it: string) => (
            <li key={it} style={{ fontSize: '14px', color: '#64748B', fontWeight: '600', cursor: 'pointer' }}>{it}</li>
          ))}
       </ul>
    </div>
  );
}
