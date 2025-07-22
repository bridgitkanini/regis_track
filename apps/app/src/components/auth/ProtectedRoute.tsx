import { ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { Loader } from '../common/Loader';
import { useGetCurrentUserQuery } from '../../features/auth/authApi';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: string[];
}

export const ProtectedRoute = ({
  children,
  requiredRoles = [],
}: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const {
    data: currentUser,
    isLoading,
    isError,
  } = useGetCurrentUserQuery(undefined, {
    skip: !isAuthenticated, // Skip the query if not authenticated
  });

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect to login page if not authenticated
      navigate('/login', { state: { from: location }, replace: true });
    } else if (
      !isLoading &&
      isAuthenticated &&
      currentUser &&
      requiredRoles.length > 0
    ) {
      // Check if user has required role
      const hasRequiredRole = requiredRoles.some(
        (role) => currentUser.role.name === role
      );

      if (!hasRequiredRole) {
        // Redirect to unauthorized page if user doesn't have required role
        navigate('/unauthorized', { replace: true });
      }
    }
  }, [
    isAuthenticated,
    isLoading,
    currentUser,
    navigate,
    location,
    requiredRoles,
  ]);

  // Show loading state while checking authentication
  if (isLoading || (isAuthenticated && !currentUser && !isError)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  // If there was an error fetching the current user, treat as not authenticated
  if (isError) {
    return null; // Will be redirected by the useEffect
  }

  if (!isAuthenticated) {
    return null; // Will be redirected by the useEffect
  }

  // Check if user has required role (if any required)
  if (
    requiredRoles.length > 0 &&
    !requiredRoles.some((role) => user?.role.name === role)
  ) {
    return null; // Will be redirected by the useEffect
  }

  return <>{children}</>;
};

export default ProtectedRoute;
