import apiClient from '../lib/api/client';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  username: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: {
      id: string;
      name: string;
    };
  };
}

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/api/auth/login', credentials);
  return response.data;
};

export const register = async (userData: RegisterData): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/api/auth/register', userData);
  return response.data;
};

export const getCurrentUser = async (): Promise<AuthResponse['user'] | null> => {
  try {
    const response = await apiClient.get<AuthResponse['user']>('/api/auth/me');
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      // Clear the invalid token
      localStorage.removeItem('token');
    }
    return null;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await apiClient.post('/api/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Clear local storage and redirect to login
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
};

export const refreshToken = async (): Promise<{ token: string }> => {
  const response = await apiClient.post<{ token: string }>('/api/auth/refresh-token');
  return response.data;
};

export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('token');
};
