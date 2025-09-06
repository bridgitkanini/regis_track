export * from './member';
export * from './role';

// Activity types
export interface Activity {
  _id: string;
  action: 'create' | 'update' | 'delete' | 'login' | 'logout';
  collectionName: 'User' | 'Member' | 'Role';
  documentId: string;
  userId: string;
  changes?: Record<string, any>;
  timestamp: string;
  user?: {
    name?: string;
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
