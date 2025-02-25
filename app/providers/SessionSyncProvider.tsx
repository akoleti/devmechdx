'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useRef } from 'react';
import useSessionStore from '../stores/sessionStore';

export default function SessionSyncProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const { setUser, setStatus, setOrganizations } = useSessionStore();
  const syncedRef = useRef(false);

  // Sync the NextAuth session with our Zustand store
  useEffect(() => {
    // Always update the status
    setStatus(status);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('SessionSyncProvider - Session status:', status);
    }

    // If we have a session and haven't synced yet or status changed to authenticated
    if (session?.user && (status === 'authenticated' || !syncedRef.current)) {
      if (process.env.NODE_ENV === 'development') {
        console.log('SessionSyncProvider - Syncing user data to store');
      }
      
      // Update user in store
      setUser(session.user as any);
      
      // If user has organizations, update those too
      if (session.user.organizations) {
        if (process.env.NODE_ENV === 'development') {
          console.log('SessionSyncProvider - Syncing organizations:', session.user.organizations.length);
        }
        setOrganizations(session.user.organizations);
      }
      
      syncedRef.current = true;
    } else if (status === 'unauthenticated') {
      // Clear user data if not authenticated
      if (process.env.NODE_ENV === 'development') {
        console.log('SessionSyncProvider - Clearing user data (unauthenticated)');
      }
      setUser(null);
      syncedRef.current = false;
    }
  }, [session, status, setUser, setStatus, setOrganizations]);

  return <>{children}</>;
} 