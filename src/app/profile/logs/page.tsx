'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Info, AlertTriangle, AlertOctagon, Terminal, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTelegramAuth } from '@/components/TelegramProvider';

export default function LogsPage() {
  const router = useRouter();
  const { initDataRaw } = useTelegramAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const response = await fetch('/api/profile/logs', {
          headers: {
            'Authorization': `Bearer ${initDataRaw}`
          }
        });
        const data = await response.json();
        if (data.success) {
          setLogs(data.logs);
        }
      } catch (err) {
        console.error('Failed to fetch logs:', err);
      } finally {
        setLoading(false);
      }
    }

    if (initDataRaw) fetchLogs();
  }, [initDataRaw]);

  const toggleExpand = (id: string) => {
    setExpandedLogId(expandedLogId === id ? null : id);
  };

  const getLogLevelIcon = (level: string) => {
    switch (level) {
      case 'ERROR':
      case 'CRITICAL':
        return <AlertOctagon size={18} color="#EF4444" />;
      case 'WARN':
        return <AlertTriangle size={18} color="#F59E0B" />;
      default:
        return <Info size={18} color="var(--primary-blue)" />;
    }
  };

  const getLogLevelBg = (level: string) => {
    switch (level) {
      case 'ERROR':
      case 'CRITICAL':
        return 'rgba(239, 68, 68, 0.1)';
      case 'WARN':
        return 'rgba(245, 158, 11, 0.1)';
      default:
        return 'rgba(79, 70, 229, 0.08)';
    }
  };

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'ERROR':
      case 'CRITICAL':
        return '#EF4444';
      case 'WARN':
        return '#F59E0B';
      default:
        return 'var(--primary-blue)';
    }
  };

  return (
    <main style={{ padding: '24px 16px', maxWidth: '500px', margin: '0 auto', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <button 
          onClick={() => router.back()}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
        >
          <ChevronLeft size={24} color="var(--text-primary)" />
        </button>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: '700' }}>Activity Logs</h1>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Real-time non-technical ledger events</p>
        </div>
      </header>

      {/* Logs List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0' }}>
            <Loader2 className="animate-spin" size={36} color="var(--primary-blue)" />
            <p style={{ marginTop: '16px', fontSize: '14px', color: 'var(--text-secondary)' }}>Retrieving audit ledger...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="card" style={{ padding: '40px 20px', textAlign: 'center', opacity: 0.7 }}>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>No ledger logs found for your account yet.</p>
          </div>
        ) : (
          logs.map((log, index) => {
            const isExpanded = expandedLogId === log.id;
            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.04, 0.4) }}
                className="card"
                style={{ 
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  border: isExpanded ? '1px solid rgba(79, 70, 229, 0.3)' : '1px solid rgba(0,0,0,0.05)',
                  boxShadow: isExpanded ? 'var(--shadow-soft)' : 'none'
                }}
              >
                {/* Header Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ 
                      width: '32px', 
                      height: '32px', 
                      borderRadius: '8px', 
                      backgroundColor: getLogLevelBg(log.level),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {getLogLevelIcon(log.level)}
                    </div>
                    <div>
                      <span style={{ 
                        fontSize: '10px', 
                        fontWeight: '700', 
                        color: getLogLevelColor(log.level),
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        {log.level}
                      </span>
                      <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{log.date}</p>
                    </div>
                  </div>

                  {/* Toggle Technical Button */}
                  <button 
                    onClick={() => toggleExpand(log.id)}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '11px',
                      color: 'var(--text-secondary)',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(0,0,0,0.02)'
                    }}
                  >
                    <Terminal size={12} />
                    <span>Details</span>
                    {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  </button>
                </div>

                {/* Friendly Message */}
                <p style={{ fontSize: '13px', lineHeight: '1.5', fontWeight: '500', color: 'var(--text-primary)' }}>
                  {log.message}
                </p>

                {/* Technical Meta Expand */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{ 
                        marginTop: '4px',
                        padding: '12px',
                        borderRadius: '8px',
                        backgroundColor: '#1E1E1E',
                        color: '#4AF626',
                        fontFamily: 'monospace',
                        fontSize: '11px',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-all',
                        border: '1px solid #333'
                      }}>
                        <p style={{ color: '#888', marginBottom: '6px' }}>// Vercel Audit Metadata</p>
                        <strong>Action:</strong> {log.action}<br />
                        <strong>Payload:</strong> {JSON.stringify(log.rawMetadata, null, 2)}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>
    </main>
  );
}
