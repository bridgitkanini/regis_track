import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MemberTable } from '../components/members/MemberTable';
import { MemberFilters } from '../components/members/MemberFilters';
import { Pagination } from '../components/common/Pagination';
import { Loader } from '../components/common/Loader';
import { RouterLink } from '../components/common/RouterLink';
import { Member } from '../types/member';
import apiClient from '../lib/api/client';

type SortField =
  | 'firstName'
  | 'email'
  | 'role'
  | 'status'
  | 'createdAt'
  | 'role.name';
type SortOrder = 'asc' | 'desc';

export const MembersPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    status: searchParams.get('status') || '',
    role: searchParams.get('role') || '',
  });

  // Update filters from URL on initial load
  useEffect(() => {
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const role = searchParams.get('role') || '';

    setFilters({
      search,
      status,
      role,
    });
  }, [searchParams]);

  // Fetch members with pagination, sorting, and filters
  const {
    data: membersData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['members', { page, sortField, sortOrder, ...filters }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        sortBy: sortField,
        order: sortOrder,
        ...(filters.search && { search: filters.search }),
        ...(filters.status && { status: filters.status }),
        ...(filters.role && { role: filters.role }),
      });

      const { data } = await apiClient.get(`/api/members?${params.toString()}`);
      return data;
    },
    placeholderData: (previousData) => previousData,
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    // Scroll to top when changing pages
    window.scrollTo(0, 0);
  };

  const handleSort = (field: keyof Member | 'role.name') => {
    // If clicking the same field, toggle the sort order
    const newSortOrder =
      sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field as SortField);
    setSortOrder(newSortOrder);
    // Reset to first page when changing sort
    setPage(1);
  };

  const handleSearch = (newFilters: {
    search: string;
    status: string;
    role: string;
  }) => {
    setFilters(newFilters);
    // Reset to first page when applying new filters
    setPage(1);
  };

  if (isLoading && !membersData) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error loading members
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>Failed to load member data. Please try again later.</p>
              <button
                onClick={() => refetch()}
                className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Members</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the members in your organization including their name,
            email, role, and status.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <RouterLink
            to="/members/new"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            Add member
          </RouterLink>
        </div>
      </div>

      <MemberFilters onSearch={handleSearch} initialValues={filters} />

      <div className="overflow-hidden bg-white shadow sm:rounded-md">
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <Loader size="md" />
          </div>
        ) : (
          <>
            <MemberTable
              members={membersData?.data || []}
              sortField={sortField}
              sortOrder={sortOrder}
              onSort={handleSort}
            />

            {membersData?.data?.length === 0 ? (
              <div className="px-6 py-4 text-center text-sm text-gray-500">
                No members found matching your criteria.
              </div>
            ) : null}
          </>
        )}
      </div>

      {membersData && (
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                page === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= membersData.pages}
              className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                page >= membersData.pages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{' '}
                <span className="font-medium">
                  {membersData.total === 0 ? 0 : (page - 1) * 10 + 1}
                </span>{' '}
                to{' '}
                <span className="font-medium">
                  {Math.min(page * 10, membersData.total)}
                </span>{' '}
                of <span className="font-medium">{membersData.total}</span>{' '}
                results
              </p>
            </div>
            <div>
              <Pagination
                currentPage={page}
                totalPages={membersData.pages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembersPage;
