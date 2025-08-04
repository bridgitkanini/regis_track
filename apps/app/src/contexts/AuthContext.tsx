import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import * as authService from '../services/auth.service';
import { AuthResponse } from '../services/auth.service';

interface AuthContextType {
  user: AuthResponse['user'] | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (data: {
    username: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  // Fetch current user
  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: authService.getCurrentUser,
    retry: false,
    enabled: authService.isAuthenticated(),
    gcTime: 0, // Disable garbage collection for this query
    meta: {
      errorMessage: 'Failed to fetch current user',
    },
  });

  // Handle errors with useEffect
  useEffect(() => {
    if (user === null) {
      // If user is explicitly set to null (error case), clear the token
      localStorage.removeItem('token');
    }
  }, [user]);

  useEffect(() => {
    // Set loading to false once user data is loaded or if not authenticated
    if (!isUserLoading) {
      setIsLoading(false);
    }
  }, [isUserLoading]);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const { token, user } = await authService.login(credentials);
      localStorage.setItem('token', token);
      queryClient.setQueryData(['currentUser'], user);
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: {
    username: string;
    email: string;
    password: string;
  }) => {
    try {
      const { token, user } = await authService.register(data);
      localStorage.setItem('token', token);
      queryClient.setQueryData(['currentUser'], user);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    await authService.logout();
    queryClient.clear();
  };

  const value = {
    user: user || null,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
