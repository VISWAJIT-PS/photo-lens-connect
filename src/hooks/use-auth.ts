import { useAuthStore } from '@/stores/auth-store';

export const useAuth = () => {
  const store = useAuthStore();
  return {
    user: store.user,
    session: store.session,
    loading: store.loading,
    signOut: store.signOut,
    signUp: store.signUp,
    signIn: store.signIn,
    refreshSession: store.refreshSession,
  };
};