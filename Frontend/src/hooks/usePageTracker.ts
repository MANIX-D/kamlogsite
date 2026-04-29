import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { apiService } from '../services/api';

/**
 * Hook qui enregistre chaque navigation de page côté backend.
 * À placer une seule fois dans App.tsx ou le layout principal.
 */
export function usePageTracker() {
  const location = useLocation();

  useEffect(() => {
    // Ne pas tracker les pages admin
    if (location.pathname.startsWith('/admin')) return;

    apiService.trackPageVisit(location.pathname);
  }, [location.pathname]);
}
