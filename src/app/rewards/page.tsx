'use client';

import BottomNav from '@/components/dashboard/BottomNav';
import TokenCard from '@/components/dashboard/TokenCard';
import { Gift, Share2, Award, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RewardsPage() {
  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <header>
        <h1 style={{ fontSize: '24px', fontWeight: '700' }}>Rewards</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Earn PAPER and exclusive discounts</p>
      </header>

      <TokenCard />

      <section>
        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Earn More</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <RewardSection 
            icon={Share2} 
            title="Refer & Earn" 
            desc="Get 10 PAPER for every friend who joins"
            color="#4F46E5"
          />
          <RewardSection 
            icon={Zap} 
            title="Daily Check-in" 
            desc="Earn 0.5 PAPER every day you login"
            color="#10B981"
          />
          <RewardSection 
            icon={Award} 
            title="Milestone Bonus" 
            desc="Reach ₦50k spending for a huge bonus"
            color="#F59E0B"
          />
        </div>
      </section>

      <div className="card" style={{ 
        background: 'var(--primary-blue)', 
        color: 'white',
        textAlign: 'center',
        padding: '24px'
      }}>
        <h3 style={{ marginBottom: '8px' }}>Referral Link</h3>
        <code style={{ 
          display: 'block', 
          background: 'rgba(255,255,255,0.1)', 
          padding: '12px', 
          borderRadius: '8px',
          marginBottom: '16px',
          fontSize: '13px'
        }}>
          paperbill.io/ref/praise_d
        </code>
        <button className="btn-primary" style={{ width: '100%', border: 'none' }}>
           Copy Link
        </button>
      </div>
    </div>
  );
}

function RewardSection({ icon: Icon, title, desc, color }: any) {
  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        backgroundColor: `${color}15`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Icon size={24} color={color} />
      </div>
      <div>
        <h4 style={{ fontSize: '15px', fontWeight: '700' }}>{title}</h4>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{desc}</p>
      </div>
    </div>
  );
}
