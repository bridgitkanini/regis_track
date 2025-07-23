import { ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { Loader } from '../common/Loader';
import { useGetCurrentUserQuery } from '../../features/auth/authApi';
import { Button } from '../common/Button';

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
    error,
    refetch,
  } = useGetCurrentUserQuery(undefined, {
    skip: !isAuthenticated, // Skip the query if not authenticated
    refetchOnMountOrArgChange: true, // Ensure we always have fresh data
  });

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect to login page if not authenticated
      navigate('/login', {
        state: {
          from: location,
          message: 'Please sign in to access this page',
        },
        replace: true,
      });
    } else if (
      !isLoading &&
      isAuthenticated &&
      currentUser &&
      requiredRoles.length > 0
    ) {
      // Check if user has required role
      const hasRequiredRole = requiredRoles.some(
        (role) => currentUser.role?.name === role
      );

      if (!hasRequiredRole) {
        // Redirect to unauthorized page if user doesn't have required role
        navigate('/unauthorized', {
          state: {
            from: location,
            requiredRoles,
            currentRole: currentUser.role?.name,
          },
          replace: true,
        });
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
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Loader size="lg" />
          <p className="text-sm text-muted-foreground">
            Checking permissions...
          </p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (isError) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background p-4">
        <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">
                Authentication Error
              </h2>
              <p className="text-muted-foreground">
                {error && 'message' in error
                  ? error.message
                  : 'An error occurred while checking your authentication status.'}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => refetch()}
              className="w-full"
            >
              Retry
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                navigate('/login', {
                  state: { from: location },
                  replace: true,
                });
              }}
              className="w-full"
            >
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated, show nothing (will be redirected by the useEffect)
  if (!isAuthenticated) {
    return null;
  }

  // Check if user has required role (if any required)
  if (
    requiredRoles.length > 0 &&
    !requiredRoles.some((role) => user?.role?.name === role)
  ) {
    return null; // Will be redirected by the useEffect
  }

  return <>{children}</>;
};

export default ProtectedRoute;
