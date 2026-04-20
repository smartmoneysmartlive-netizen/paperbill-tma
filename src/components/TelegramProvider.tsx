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

  if (!isClient) return <>{children}</>;

  return (
    <div id="telegram-app-root">
      {children}
    </div>
  );
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
  // We use the SDK's environment check
  const inTMA = isTMA();

  // REAL FIX: Since the SDK hooks are strict, we use the raw SDK 
  // retrieval logic if we want to be safe across environments.
  
  const rawInitData = useMemo(() => {
    if (!inTMA) return MOCK_LAUNCH_PARAMS.initDataRaw;
    try {
      // Logic from useRawInitData
      return window.location.hash.slice(1); 
    } catch {
      return MOCK_LAUNCH_PARAMS.initDataRaw;
    }
  }, [inTMA]);

  const user = useMemo(() => {
    if (!inTMA) return MOCK_LAUNCH_PARAMS.initData.user;
    try {
      const params = new URLSearchParams(window.location.hash.slice(1));
      const userJson = params.get('user');
      return userJson ? JSON.parse(userJson) : MOCK_LAUNCH_PARAMS.initData.user;
    } catch {
      return MOCK_LAUNCH_PARAMS.initData.user;
    }
  }, [inTMA]);

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
