'use client';

import { ThemeProvider } from "@/components/ThemeProvider";
import { TelegramProvider } from "@/components/TelegramProvider";
import { TelegramBackButton } from "@/components/TelegramBackButton";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TelegramProvider>
      <ThemeProvider>
        <TelegramBackButton />
        {children}
      </ThemeProvider>
    </TelegramProvider>
  );
}
