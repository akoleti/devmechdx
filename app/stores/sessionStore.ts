import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Define the session user interface
interface User {
  id: string;
  name?: string;
  email?: string;
  image?: string;
  organizations?: Array<{
    id: string;
    name: string;
    role: string;
    type?: string;
  }>;
  currentOrganizationId?: string;
}

// Define the session store state interface
interface SessionState {
  status: 'loading' | 'authenticated' | 'unauthenticated';
  user: User | null;
  organizations: Array<{
    id: string;
    name: string;
    role: string;
    type?: string;
  }>;
  initialized: boolean;
  setUser: (user: User | null) => void;
  setStatus: (status: 'loading' | 'authenticated' | 'unauthenticated') => void;
  setOrganizations: (organizations: Array<{
    id: string;
    name: string;
    role: string;
    type?: string;
  }>) => void;
  setCurrentOrganization: (organizationId: string) => void;
  clearSession: () => void;
  setInitialized: (initialized: boolean) => void;
}

// Create the store with persistence
const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      status: 'loading',
      user: null,
      organizations: [],
      initialized: false,
      setUser: (user) => {
        const newStatus = user ? 'authenticated' : 'unauthenticated';
        if (process.env.NODE_ENV === 'development') {
          console.log('SessionStore: Setting user', { userId: user?.id, status: newStatus });
        }
        set({ 
          user, 
          status: newStatus,
          initialized: true 
        });
      },
      setStatus: (status) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('SessionStore: Setting status', { status, currentStatus: get().status });
        }
        set({ status });
      },
      setOrganizations: (organizations) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('SessionStore: Setting organizations', { count: organizations.length });
        }
        set({ organizations });
      },
      setCurrentOrganization: (organizationId) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('SessionStore: Setting current organization', { organizationId });
        }
        set((state) => ({
          user: state.user ? { ...state.user, currentOrganizationId: organizationId } : null
        }));
      },
      clearSession: () => {
        if (process.env.NODE_ENV === 'development') {
          console.log('SessionStore: Clearing session');
        }
        set({ 
          user: null, 
          status: 'unauthenticated', 
          organizations: [], 
          initialized: true 
        });
      },
      setInitialized: (initialized) => set({ initialized })
    }),
    {
      name: 'mechdx-session-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist specific fields
      partialize: (state) => ({
        user: state.user,
        organizations: state.organizations,
        initialized: state.initialized
        // Don't persist status since we want to validate on reload
      }),
      onRehydrateStorage: () => (state) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('SessionStore: Rehydrated from storage', { 
            hasUser: !!state?.user,
            orgCount: state?.organizations?.length || 0
          });
        }
        if (state) {
          state.setInitialized(true);
        }
      }
    }
  )
);

export default useSessionStore; 