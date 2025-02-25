'use client';

import { SessionProvider } from 'next-auth/react';
import SessionSyncProvider from './providers/SessionSyncProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SessionSyncProvider>
        {children}
      </SessionSyncProvider>
    </SessionProvider>
  );
} 