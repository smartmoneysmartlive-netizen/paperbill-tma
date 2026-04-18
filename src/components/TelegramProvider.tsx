'use client';

// Stubbing Telegram SDK for browser-ready development
// This avoids build errors while testing in a standard browser
export function TelegramProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function useBackButton() {
  return {
    show: () => {},
    hide: () => {},
    on: () => {},
    off: () => {},
  };
}
