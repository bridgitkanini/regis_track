import { ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Loader } from '../common/Loader';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: string[];
}

export const ProtectedRoute = ({ children, requiredRoles = [] }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect to login page if not authenticated
      navigate('/login', { state: { from: location }, replace: true });
    } else if (!isLoading && isAuthenticated && requiredRoles.length > 0) {
      // Check if user has required role
      const hasRequiredRole = requiredRoles.some(role => user?.role.name === role);
      
      if (!hasRequiredRole) {
        // Redirect to unauthorized page if user doesn't have required role
        navigate('/unauthorized', { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, user, navigate, location, requiredRoles]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will be redirected by the useEffect
  }

  // Check if user has required role (if any required)
  if (requiredRoles.length > 0 && !requiredRoles.some(role => user?.role.name === role)) {
    return null; // Will be redirected by the useEffect
  }

  return <>{children}</>;
};

export default ProtectedRoute;
