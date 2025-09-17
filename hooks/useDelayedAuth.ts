import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export function useDelayedAuth() {
  const [isReady, setIsReady] = useState(false);
  const auth = useAuth();

  useEffect(() => {
    // Small delay to ensure auth context is properly initialized
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return {
      ...auth,
      loading: true,
    };
  }

  return auth;
}