import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../../services/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const validate = async () => {
      // Quick client-side check first
      if (!authService.isAuthenticated()) {
        setIsValid(false);
        setIsValidating(false);
        return;
      }

      // Server-side token validation
      const valid = await authService.validateToken();
      if (!valid) {
        authService.clearSession();
      }
      setIsValid(valid);
      setIsValidating(false);
    };

    validate();
  }, []);

  if (isValidating) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Vérification de la session...</p>
        </div>
      </div>
    );
  }

  if (!isValid) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
