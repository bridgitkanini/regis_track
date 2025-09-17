export * from './member';
export * from './role';

export interface User {
  id: string;
  username: string;
  email: string;
  role: {
    id: string;
    name: string;
  };
}
export type LoginRequest = { email: string; password: string };
export type RegisterRequest = {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  isActive?: boolean;
};

export interface MemberRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  dateOfBirth?: string | null;
  gender?: string;
  status: 'active' | 'inactive' | 'pending';
  roleId: string;
  notes?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

// Activity types
export interface Activity {
  id: string;
  action: 'create' | 'update' | 'delete' | 'login' | 'logout';
  collectionName: 'User' | 'Member' | 'Role';
  documentId: string;
  userId: string;
  changes?: Record<string, any>;
  timestamp: string;
  user?: {
    username?: string;
    avatar?: string;
  };
}

// Paginated response type
export interface PaginatedResponse<T> {
  data: T;
  count: number;
  total: number;
  page: number;
  pages: number;
}
