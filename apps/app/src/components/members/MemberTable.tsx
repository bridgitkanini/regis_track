import { Link } from 'react-router-dom';
import { ArrowUpIcon, ArrowDownIcon, PlusIcon } from '@heroicons/react/20/solid';
import { Badge } from '../common/Badge';
import { format } from 'date-fns';
import { Member } from '../../types/member';

type SortableField = keyof Pick<Member, 'firstName' | 'email' | 'status' | 'createdAt'> | 'role.name';

const isSortableField = (field: string): field is SortableField => {
  return ['firstName', 'email', 'status', 'createdAt', 'role.name'].includes(field);
};

interface MemberTableProps {
  members: Member[];
  sortField: keyof Pick<Member, 'firstName' | 'email' | 'status' | 'createdAt' | 'role'> | 'role.name';
  sortOrder: 'asc' | 'desc';
  onSort: (field: keyof Member | 'role.name') => void;
}

const statusColors = {
  active: 'green',
  inactive: 'red',
  pending: 'yellow',
} as const;

export const MemberTable = ({
  members,
  sortField,
  sortOrder,
  onSort,
}: MemberTableProps) => {
  const renderSortIcon = (field: string) => {
    if (sortField !== field) {
      return (
        <span className="ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
          <ArrowUpIcon className="h-4 w-4" aria-hidden="true" />
        </span>
      );
    }

    return sortOrder === 'asc' ? (
      <span className="ml-2 flex-none rounded bg-gray-200 text-gray-900 group-hover:bg-gray-300">
        <ArrowUpIcon className="h-4 w-4" aria-hidden="true" />
      </span>
    ) : (
      <span className="ml-2 flex-none rounded bg-gray-200 text-gray-900 group-hover:bg-gray-300">
        <ArrowDownIcon className="h-4 w-4" aria-hidden="true" />
      </span>
    );
  };

  const handleSort = (field: string) => {
    if (isSortableField(field)) {
      onSort(field);
    }
  };

  if (members.length === 0) {
    return (
      <div className="px-6 py-14 text-center text-sm sm:px-14">
        <svg
          className="mx-auto h-6 w-6 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="mt-4 font-medium text-gray-900">No members found</h3>
        <p className="mt-1 text-gray-500">
          Get started by adding a new member.
        </p>
        <div className="mt-6">
          <Link
            to="/members/new"
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            New Member
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              <div
                className="group inline-flex cursor-pointer"
                onClick={() => handleSort('firstName')}
              >
                Name
                {renderSortIcon('firstName')}
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              <div
                className="group inline-flex cursor-pointer"
                onClick={() => handleSort('email')}
              >
                Email
                {renderSortIcon('email')}
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              <div
                className="group inline-flex cursor-pointer"
                onClick={() => handleSort('role')}
              >
                Role
                {renderSortIcon('role')}
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              <div
                className="group inline-flex cursor-pointer"
                onClick={() => handleSort('status')}
              >
                Status
                {renderSortIcon('status')}
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              <div
                className="group inline-flex cursor-pointer"
                onClick={() => handleSort('createdAt')}
              >
                Joined
                {renderSortIcon('createdAt')}
              </div>
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {members.map((member) => (
            <tr key={member.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-600 font-medium">
                      {member.firstName.charAt(0)}
                      {member.lastName.charAt(0)}
                    </span>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {member.firstName} {member.lastName}
                    </div>
                    <div className="text-sm text-gray-500">{member.phone}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{member.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                  {member.role.name}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge color={statusColors[member.status]}>
                  {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {format(new Date(member.createdAt), 'MMM d, yyyy')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Link
                  to={`/members/${member.id}`}
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  Edit
                </Link>
                <button className="text-red-600 hover:text-red-900">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MemberTable;
