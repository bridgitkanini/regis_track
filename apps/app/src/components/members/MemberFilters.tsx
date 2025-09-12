import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
} from '@heroicons/react/20/solid';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../lib/api/client';
import { Role } from '../../types/role';
import { cn } from '../../lib/utils';

interface MemberFiltersProps {
  onSearch: (params: { search: string; status: string; role: string }) => void;
  initialValues?: {
    search?: string;
    status?: string;
    role?: string;
  };
  className?: string;
}

export const MemberFilters = ({
  onSearch,
  initialValues = {},
  className,
}: MemberFiltersProps) => {
  const [_, setSearchParams] = useSearchParams();
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
      return response.data.roles;
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

  const handleInputChange = (name: string, value: string) => {
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
    <div className={cn('space-y-4', className)}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Input
              type="search"
              name="search"
              placeholder="Search members..."
              value={filters.search}
              onChange={(e) => handleInputChange('search', e.target.value)}
              leftIcon={
                <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
              }
              className="w-full"
            />
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <FunnelIcon className="h-4 w-4" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                {Object.values(filters).filter(Boolean).length}
              </span>
            )}
          </Button>
        </div>

        {showFilters && (
          <div className="rounded-lg border bg-muted/50 p-4 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Select
                label="Status"
                name="status"
                value={filters.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                options={[
                  { value: '', label: 'All Statuses' },
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' },
                  { value: 'pending', label: 'Pending' },
                ]}
              />

              <Select
                label="Role"
                name="role"
                value={filters.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                options={[
                  { value: '', label: 'All Roles' },
                  ...(roles?.map((role) => ({
                    value: role.id,
                    label: role.name,
                  })) || []),
                ]}
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleReset}
                disabled={!hasActiveFilters}
              >
                <XMarkIcon className="mr-1 h-4 w-4" />
                Reset filters
              </Button>
              <Button type="submit" size="sm">
                Apply filters
              </Button>
            </div>
          </div>
        )}
      </form>

      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted-foreground">Active filters:</span>
          {filters.status && (
            <span className="inline-flex items-center rounded-full border bg-muted px-2.5 py-0.5 text-xs font-medium">
              Status: {filters.status}
              <button
                type="button"
                className="ml-1.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted-foreground/20"
                onClick={() => handleInputChange('status', '')}
              >
                <span className="sr-only">Remove status filter</span>
                <XMarkIcon className="h-3 w-3" />
              </button>
            </span>
          )}
          {filters.role && (
            <span className="inline-flex items-center rounded-full border bg-muted px-2.5 py-0.5 text-xs font-medium">
              Role:{' '}
              {roles?.find((r) => r.id === filters.role)?.name || filters.role}
              <button
                type="button"
                className="ml-1.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted-foreground/20"
                onClick={() => handleInputChange('role', '')}
              >
                <span className="sr-only">Remove role filter</span>
                <XMarkIcon className="h-3 w-3" />
              </button>
            </span>
          )}
          {filters.search && (
            <span className="inline-flex items-center rounded-full border bg-muted px-2.5 py-0.5 text-xs font-medium">
              Search: {filters.search}
              <button
                type="button"
                className="ml-1.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted-foreground/20"
                onClick={() => handleInputChange('search', '')}
              >
                <span className="sr-only">Remove search filter</span>
                <XMarkIcon className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default MemberFilters;
