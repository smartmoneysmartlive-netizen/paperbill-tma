'use client';

import { PropsWithChildren, useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import BottomNav from '../dashboard/BottomNav';
import { usePathname } from 'next/navigation';

export default function ResponsiveShell({ children }: PropsWithChildren) {
  const [isDesktop, setIsDesktop] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkSize = () => setIsDesktop(window.innerWidth >= 768);
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  const isPublicPage = pathname === '/landing' || pathname === '/login';

  return (
    <div className="app-layout">
      {/* Sidebar - Only rendered on desktop AND NOT on public pages */}
      {isDesktop && !isPublicPage && <Sidebar />}

      {/* Main Content Area */}
      <main className={isDesktop && !isPublicPage ? 'main-content' : ''} style={!isDesktop && !isPublicPage ? { paddingBottom: '100px' } : {}}>
        <div className="content-container">
          {children}
        </div>
      </main>

      {/* Bottom Navigation - Only rendered on mobile AND NOT on public pages */}
      {!isDesktop && !isPublicPage && <BottomNav />}
    </div>
  );
}
