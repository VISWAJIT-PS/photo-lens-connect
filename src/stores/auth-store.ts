import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session, AuthError } from '@/types/auth.types';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, userData?: Record<string, unknown>) => Promise<{ user: User | null; session: Session | null; error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ user: User | null; session: Session | null; error: Error | null }>;
  refreshSession: () => Promise<void>;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        session: null,
        loading: true,

        setUser: (user) => set({ user }),
        setSession: (session) => set({ session }),
        setLoading: (loading) => set({ loading }),

        signOut: async () => {
          try {
            await supabase.auth.signOut();
            set({ user: null, session: null });
            localStorage.removeItem('supabase-session');
          } catch (error) {
            console.error('Error signing out:', error);
          }
        },

        signUp: async (email: string, password: string, userData?: Record<string, unknown>) => {
          try {
            const redirectUrl = `${window.location.origin}/`;
            const { data, error } = await supabase.auth.signUp({
              email,
              password,
              options: {
                emailRedirectTo: redirectUrl,
                data: userData,
              }
            });

            if (error) {
              return { user: null, session: null, error };
            }

            if (data.user && data.session) {
              set({ user: data.user, session: data.session });
              localStorage.setItem('supabase-session', JSON.stringify(data.session));
            }

            return { user: data.user, session: data.session, error: null };
          } catch (error: Error | unknown) {
            return { user: null, session: null, error: error instanceof Error ? error : new Error('Unknown error') };
          }
        },

        signIn: async (email: string, password: string) => {
          try {
            const { data, error } = await supabase.auth.signInWithPassword({
              email,
              password,
            });

            if (error) {
              return { user: null, session: null, error };
            }

            if (data.user && data.session) {
              set({ user: data.user, session: data.session });
              localStorage.setItem('supabase-session', JSON.stringify(data.session));
            }

            return { user: data.user, session: data.session, error: null };
          } catch (error: Error | unknown) {
            return { user: null, session: null, error: error instanceof Error ? error : new Error('Unknown error') };
          }
        },

        refreshSession: async () => {
          try {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) {
              console.error('Error refreshing session:', error);
              return;
            }
            
            set({ session, user: session?.user ?? null });
            
            if (session) {
              localStorage.setItem('supabase-session', JSON.stringify(session));
            } else {
              localStorage.removeItem('supabase-session');
            }
          } catch (error) {
            console.error('Error refreshing session:', error);
          }
        },

        initializeAuth: async () => {
          try {
            set({ loading: true });
            
            // Check localStorage first for immediate availability
            const storedSession = localStorage.getItem('supabase-session');
            if (storedSession) {
              try {
                const parsedSession = JSON.parse(storedSession);
                set({ session: parsedSession, user: parsedSession.user ?? null });
              } catch (e) {
                localStorage.removeItem('supabase-session');
              }
            }

            // Then verify with Supabase
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) {
              console.error('Error getting session:', error);
            } else {
              set({ session, user: session?.user ?? null });
              if (session) {
                localStorage.setItem('supabase-session', JSON.stringify(session));
              }
            }
          } catch (error) {
            console.error('Auth initialization error:', error);
          } finally {
            set({ loading: false });
          }
        },
      }),
      {
        name: 'auth-store',
        partialize: (state) => ({
          user: state.user,
          session: state.session,
        }),
      }
    )
  )
);

// Set up auth state listener
const setupAuthListener = () => {
  const { setUser, setSession, setLoading } = useAuthStore.getState();
  
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      console.log('Auth event:', event);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Ensure session is persisted
      if (session) {
        localStorage.setItem('supabase-session', JSON.stringify(session));
      } else {
        localStorage.removeItem('supabase-session');
      }
    }
  );

  return () => subscription.unsubscribe();
};

// Initialize auth listener
setupAuthListener();

// Initialize auth on app load
useAuthStore.getState().initializeAuth();