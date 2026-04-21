import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "Paperbill | Smart Digital Wallet",
  description: "Load money, buy data, and earn rewards effortlessly.",
};

import ResponsiveShell from "@/components/layout/ResponsiveShell";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="antialiased">
        <Providers>
          <ResponsiveShell>
            {children}
          </ResponsiveShell>
        </Providers>
      </body>
    </html>
  );
}
