import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { MemberTable } from '../components/members/MemberTable';
import { Pagination } from '../components/common/Pagination';
import { Button } from '../components/common/Button';
import { Loader } from '../components/common/Loader';
import apiClient from '../lib/api/client';
import { Member } from '../types';

type MembersResponse = {
  members: Member[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

type SortField =
  | keyof Pick<Member, 'firstName' | 'email' | 'status' | 'createdAt'>
  | 'role.name';

export const Members = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const { data, isLoading, isError, error } = useQuery<MembersResponse, Error>({
    queryKey: ['members', { page, limit, searchTerm, sortField, sortOrder }],
   queryFn: async () => {
       const params = new URLSearchParams({
         page: page.toString(),
         limit: limit.toString(),
         sort: `${sortField}:${sortOrder}`,
         ...(searchTerm && { search: searchTerm }),
       });

       const { data } = await apiClient.get(`/api/members?${params.toString()}`);
       return data;
     },
    placeholderData: (prev) => prev,
   });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Reset to first page when searching
    setPage(1);
  };

  const handleSort = (field: keyof Member | 'role.name') => {
    const allowed: ReadonlyArray<SortField> = [
      'firstName',
      'email',
      'status',
      'createdAt',
      'role.name',
    ];
    if (!allowed.includes(field as SortField)) return;
    const sf = field as SortField;
  
    if (sortField === sf) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(sf);
      setSortOrder('asc');
    }
  };

  if (isError) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error loading members
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error?.message || 'An error occurred while loading members.'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Members</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your organization's members and their information.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link to="/members/new">
            <Button>
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Add Member
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="p-4 border-b border-gray-200 sm:px-6">
          <form onSubmit={handleSearch} className="flex space-x-4">
            <div className="flex-1 min-w-0">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <input
                  type="text"
                  name="search"
                  id="search"
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Search members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Button type="submit" variant="secondary">
              Search
            </Button>
          </form>
        </div>

        <div className="overflow-x-auto">
          <MemberTable
            members={data?.members || []}
            sortField={sortField}
            sortOrder={sortOrder}
            onSort={handleSort}
          />
        </div>

        {data && data.total > 0 && (
          <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <Button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                variant="outline"
                size="sm"
              >
                Previous
              </Button>
              <Button
                onClick={() => setPage((p) => p + 1)}
                disabled={!data || page >= data.totalPages}
                variant="outline"
                size="sm"
                className="ml-3"
              >
                Next
              </Button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(page * limit, data.total)}
                  </span>{' '}
                  of <span className="font-medium">{data.total}</span> results
                </p>
              </div>
              <div>
                <Pagination
                  currentPage={page}
                  totalPages={data.totalPages}
                  onPageChange={setPage}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Members;
