'use client';

import { useLaunchParams, useRawInitData } from '@telegram-apps/sdk-react';
import { useMemo, PropsWithChildren, useEffect, useState } from 'react';
import { isTMA } from '@telegram-apps/sdk';

/**
 * Mock data for browser-based development
 */
const MOCK_LAUNCH_PARAMS: any = {
  platform: 'browser',
  initData: {
    user: {
      id: 12345678,
      first_name: 'Browser',
      last_name: 'Tester',
      username: 'browser_user'
    }
  },
  initDataRaw: 'user=%7B%22id%22%3A12345678%2C%22first_name%22%3A%22Browser%22%2C%22last_name%22%3A%22Tester%22%2C%22username%22%3A%22browser_user%22%7D&auth_date=1710000000&hash=mock_hash'
};

/**
 * Modern Telegram Provider for Paperbill TMA
 * Includes a browser-failsafe for local development outside Telegram
 */
export function TelegramProvider({ children }: PropsWithChildren) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Trigger sync on initialization
  useSyncUser();

  if (!isClient) return <>{children}</>;

  return (
    <div id="telegram-app-root">
      {children}
    </div>
  );
}

/**
 * Custom hook to trigger the user sync process on app start
 */
function useSyncUser() {
  const { initDataRaw, user } = useTelegramAuth();
  
  useEffect(() => {
    // SECURITY: Don't sync if no data or if it's the mock hash
    if (!initDataRaw || initDataRaw.includes('mock_hash')) {
      console.log('[TMA-Sync] Skipping sync: No real Telegram data found.');
      return;
    }

    const sync = async () => {
      try {
        console.log('[TMA-Sync] Attempting synchronization for user:', user?.id);
        const res = await fetch('/api/auth/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ initDataRaw })
        });
        
        if (!res.ok) {
           const data = await res.json();
           console.error('[TMA-Sync] Server returned error:', data.message);
        } else {
           console.log('[TMA-Sync] User synchronized successfully with DB');
        }
      } catch (err) {
        console.error('[TMA-Sync] Network Error:', err);
      }
    };

    sync();
  }, [initDataRaw, user?.id]);
}

export interface TelegramAuthResult {
  initDataRaw: string;
  user: any;
}

/**
 * Hook to get the raw init data for API Authorization
 * Uses a failsafe to return mock data if not in a Telegram environment
 */
export function useTelegramAuth(): TelegramAuthResult {
  // 1. Source of Truth: Check if the current URL actually contains Telegram data
  // We check this BEFORE the SDK to avoid detection lag on fast devices.
  const hasHashData = typeof window !== 'undefined' && window.location.hash.includes('tgWebAppData');
  const isProd = typeof window !== 'undefined' && window.location.hostname.includes('paperbill.online');

  // We use the SDK's environment check as a secondary indicator
  const sdkInTMA = isTMA();
  const inTMA = hasHashData || sdkInTMA;

  const rawInitData = useMemo(() => {
    // SECURITY: Never use mock data in production
    if (!inTMA || isProd) {
       if (isProd && !hasHashData) return ''; // Force empty if prod and no hash
       if (!inTMA) return MOCK_LAUNCH_PARAMS.initDataRaw;
    }

    try {
      // Logic from useRawInitData - cleaning up the hash
      const hash = window.location.hash.slice(1);
      return hash.includes('tgWebAppData') ? hash : MOCK_LAUNCH_PARAMS.initDataRaw;
    } catch {
      return isProd ? '' : MOCK_LAUNCH_PARAMS.initDataRaw;
    }
  }, [inTMA, hasHashData, isProd]);

  const user = useMemo(() => {
    if (!inTMA || isProd) {
       if (isProd && !hasHashData) return null;
       if (!inTMA) return MOCK_LAUNCH_PARAMS.initData.user;
    }

    try {
      const params = new URLSearchParams(window.location.hash.slice(1));
      const userJson = params.get('user');
      return userJson ? JSON.parse(userJson) : null;
    } catch {
      return isProd ? null : MOCK_LAUNCH_PARAMS.initData.user;
    }
  }, [inTMA, hasHashData, isProd]);

  return useMemo(() => ({
    initDataRaw: rawInitData,
    user: user
  }), [rawInitData, user]);
}

/**
 * BackButton helper
 */
export function useTelegramBackButton() {
  return {
    show: () => {},
    hide: () => {},
    on: () => {},
    off: () => {},
  };
}
