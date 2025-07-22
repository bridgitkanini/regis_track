export interface Role {
  id: string;
  name: string;
  permissions: string[];
  description?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RoleFormData {
  name: string;
  description: string;
  permissions: string[];
  isDefault: boolean;
}
