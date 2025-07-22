import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { Button } from '../common/Button';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../lib/api/client';
import { Role } from '../../types/role';

interface MemberFiltersProps {
  onSearch: (params: {
    search: string;
    status: string;
    role: string;
  }) => void;
  initialValues?: {
    search?: string;
    status?: string;
    role?: string;
  };
}

export const MemberFilters = ({
  onSearch,
  initialValues = {},
}: MemberFiltersProps) => {
  const [_, setSearchParams] = useSearchParams(); // Prefix with _ to indicate it's intentionally unused
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: initialValues.search || '',
    status: initialValues.status || '',
    role: initialValues.role || '',
  });

  // Fetch roles for the role filter
  const { data: roles } = useQuery<Role[]>({
    queryKey: ['roles'],
    queryFn: async () => {
      const response = await apiClient.get<{ roles: Role[] }>('/api/roles');
      return response.roles;
    },
  });

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (filters.search) params.set('search', filters.search);
    if (filters.status) params.set('status', filters.status);
    if (filters.role) params.set('role', filters.role);
    
    // Update URL without triggering a navigation
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleReset = () => {
    const resetFilters = {
      search: '',
      status: '',
      role: '',
    };
    setFilters(resetFilters);
    onSearch(resetFilters);
    setSearchParams({});
  };

  const hasActiveFilters = Object.values(filters).some((value) => value !== '');

  return (
    <div className="mb-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <form onSubmit={handleSubmit} className="flex-1 max-w-2xl">
          <div className="flex rounded-md shadow-sm">
            <div className="relative flex flex-grow items-stretch focus-within:z-10">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleInputChange}
                className="block w-full rounded-none rounded-l-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Search members..."
              />
            </div>
            <button
              type="submit"
              className="relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <span>Search</span>
            </button>
          </div>
        </form>

        <div className="flex items-center space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center"
          >
            <FunnelIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Filters
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={() => (window.location.href = '/members/new')}
          >
            Add Member
          </Button>
        </div>
      </div>

      {/* Advanced filters */}
      {showFilters && (
        <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900">Filters</h3>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleReset}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                disabled={!hasActiveFilters}
              >
                Reset all
              </button>
              <button
                type="button"
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close filters</span>
                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={filters.status}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700"
              >
                Role
              </label>
              <select
                id="role"
                name="role"
                value={filters.role}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">All Roles</option>
                {roles?.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <Button type="submit" variant="primary" className="w-full sm:w-auto">
                Apply Filters
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Active filters */}
      {hasActiveFilters && (
        <div className="mt-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Active filters:</span>
            
            {filters.search && (
              <span className="inline-flex items-center rounded-full bg-indigo-100 py-1 pl-3 pr-2 text-sm text-indigo-700">
                Search: {filters.search}
                <button
                  type="button"
                  onClick={() => {
                    const newFilters = { ...filters, search: '' };
                    setFilters(newFilters);
                    onSearch(newFilters);
                  }}
                  className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-indigo-200 text-indigo-600 hover:bg-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
                >
                  <span className="sr-only">Remove search filter</span>
                  <XMarkIcon className="h-3 w-3" aria-hidden="true" />
                </button>
              </span>
            )}
            
            {filters.status && (
              <span className="inline-flex items-center rounded-full bg-indigo-100 py-1 pl-3 pr-2 text-sm text-indigo-700">
                Status: {filters.status.charAt(0).toUpperCase() + filters.status.slice(1)}
                <button
                  type="button"
                  onClick={() => {
                    const newFilters = { ...filters, status: '' };
                    setFilters(newFilters);
                    onSearch(newFilters);
                  }}
                  className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-indigo-200 text-indigo-600 hover:bg-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
                >
                  <span className="sr-only">Remove status filter</span>
                  <XMarkIcon className="h-3 w-3" aria-hidden="true" />
                </button>
              </span>
            )}
            
            {filters.role && roles?.find((r) => r.id === filters.role) && (
              <span className="inline-flex items-center rounded-full bg-indigo-100 py-1 pl-3 pr-2 text-sm text-indigo-700">
                Role: {roles.find((r) => r.id === filters.role)?.name}
                <button
                  type="button"
                  onClick={() => {
                    const newFilters = { ...filters, role: '' };
                    setFilters(newFilters);
                    onSearch(newFilters);
                  }}
                  className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-indigo-200 text-indigo-600 hover:bg-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
                >
                  <span className="sr-only">Remove role filter</span>
                  <XMarkIcon className="h-3 w-3" aria-hidden="true" />
                </button>
              </span>
            )}
            
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleReset}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberFilters;
