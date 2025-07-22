export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  dateOfBirth: string;
  gender: string;
  status: 'active' | 'inactive' | 'pending';
  role: {
    id: string;
    name: string;
  };
  profilePicture: string | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface MemberFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  dateOfBirth: string | null;
  gender: string;
  status: 'active' | 'inactive' | 'pending';
  roleId: string;
  notes: string;
  profilePicture?: FileList;
}

export interface MemberFilters {
  search: string;
  status: string;
  role: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}
