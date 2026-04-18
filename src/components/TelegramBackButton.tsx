'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

// Stub until native SDK is required for production
export function TelegramBackButton() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // In actual Telegram, this would show/hide the native back button
    console.log(`Navigation path: ${pathname}`);
  }, [pathname]);

  return null;
}
