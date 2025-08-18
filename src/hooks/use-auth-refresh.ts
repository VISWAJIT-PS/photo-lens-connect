import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';

export const useAuthRefresh = () => {
  const refreshSession = useAuthStore((state) => state.refreshSession);

  useEffect(() => {
    // Refresh session on app focus to ensure it's still valid
    const handleFocus = () => {
      refreshSession();
    };

    // Refresh session periodically
    const interval = setInterval(() => {
      refreshSession();
    }, 1000 * 60 * 30); // Every 30 minutes

    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, [refreshSession]);
};