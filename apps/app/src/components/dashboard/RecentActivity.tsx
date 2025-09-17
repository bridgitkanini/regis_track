import { useMemo } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '../../lib/utils';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  InformationCircleIcon,
} from '@heroicons/react/20/solid';

type SortDirection = 'asc' | 'desc';

type SortConfig = {
  key: string;
  direction: SortDirection;
};

type Activity = {
  id: string;
  action: string;
  collection: string;
  documentId: string;
  timestamp: string;
  user: {
    username: string;
    avatar?: string;
  };
};

interface RecentActivityProps {
  activities: Activity[];
  itemsPerPage: number;
  currentPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onSort: (key: string) => void;
  sortConfig: SortConfig;
  className?: string;
}

const getActionIcon = (action: string) => {
  const iconClass = 'h-4 w-4';

  const icons = {
    create: {
      icon: <PlusIcon className={iconClass} />,
      variant: 'success' as const,
      label: 'Created',
    },
    update: {
      icon: <PencilSquareIcon className={iconClass} />,
      variant: 'info' as const,
      label: 'Updated',
    },
    delete: {
      icon: <TrashIcon className={iconClass} />,
      variant: 'error' as const,
      label: 'Deleted',
    },
    default: {
      icon: <InformationCircleIcon className={iconClass} />,
      variant: 'secondary' as const,
      label: 'Activity',
    },
  };

  const actionKey = action.toLowerCase() as keyof typeof icons;
  return icons[actionKey] || icons.default;
};

export const RecentActivity = ({
  activities,
  itemsPerPage,
  currentPage,
  totalItems,
  onPageChange,
  onSort,
  sortConfig,
  className,
}: RecentActivityProps) => {
  // Calculate total pages
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Calculate the range of items being displayed
  const startItem = Math.min((currentPage - 1) * itemsPerPage + 1, totalItems);
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Handle sort click
  const handleSort = (key: string) => {
    onSort(key);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    onPageChange(page);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages are less than or equal to maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show first page, current page, and pages around it
      const startPage = Math.max(
        1,
        currentPage - Math.floor(maxPagesToShow / 2)
      );
      const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

      // Adjust if we're near the end
      if (endPage - startPage + 1 < maxPagesToShow) {
        const diff = maxPagesToShow - (endPage - startPage + 1);
        if (startPage - diff > 0) {
          for (let i = startPage - diff; i <= endPage; i++) {
            pageNumbers.push(i);
          }
        } else {
          for (let i = 1; i <= maxPagesToShow; i++) {
            pageNumbers.push(i);
          }
        }
      } else {
        for (let i = startPage; i <= endPage; i++) {
          pageNumbers.push(i);
        }
      }
    }

    return pageNumbers;
  };

  if (activities.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-6 text-center text-muted-foreground">
        No recent activity to display.
      </div>
    );
  }

  return (
    <div
      className={cn(
        'overflow-hidden rounded-lg border bg-card shadow-sm',
        className
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                Action
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground"
                onClick={() => handleSort('collection')}
              >
                <div className="flex items-center">
                  Collection
                  {sortConfig.key === 'collection' && (
                    <span className="ml-1">
                      {sortConfig.direction === 'asc' ? (
                        <ArrowUpIcon className="h-3 w-3" />
                      ) : (
                        <ArrowDownIcon className="h-3 w-3" />
                      )}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                Document
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                User
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('timestamp')}
              >
                <div className="flex items-center">
                  When
                  {sortConfig.key === 'timestamp' && (
                    <span className="ml-1">
                      {sortConfig.direction === 'asc' ? (
                        <ArrowUpIcon className="h-3 w-3" />
                      ) : (
                        <ArrowDownIcon className="h-3 w-3" />
                      )}
                    </span>
                  )}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {activities.map((activity) => {
              const action = getActionIcon(activity.action);
              return (
                <tr key={activity.id} className="hover:bg-muted/20">
                  <td className="whitespace-nowrap px-4 py-3">
                    <Badge variant={action.variant} className="gap-1">
                      {action.icon}
                      {action.label}
                    </Badge>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-foreground">
                    {activity.collection}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground font-mono">
                    {activity.documentId}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-foreground">
                    {activity.user.username}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.timestamp), {
                      addSuffix: true,
                    })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-border px-4 py-3 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{startItem}</span> to{' '}
              <span className="font-medium">{endItem}</span> of{' '}
              <span className="font-medium">{totalItems}</span> results
            </p>
          </div>
          <div>
            <nav
              className="inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <Button
                variant="ghost"
                size="sm"
                className="rounded-r-none"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <span className="sr-only">Previous</span>
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>

              {getPageNumbers().map((page) => (
                <Button
                  key={page}
                  variant={page === currentPage ? 'primary' : 'ghost'}
                  size="sm"
                  className={cn(
                    'rounded-none border-l border-border',
                    page === currentPage
                      ? 'z-10 bg-primary text-primary-foreground'
                      : ''
                  )}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              ))}

              <Button
                variant="ghost"
                size="sm"
                className="rounded-l-none"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <span className="sr-only">Next</span>
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;
