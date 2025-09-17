import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/20/solid';
import { cn } from '../../lib/utils';
import { Button } from './Button';

interface PaginationProps {
  /** Current page number (1-based) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Callback when page changes */
  onPageChange: (page: number) => void;
  /** Maximum number of page buttons to show (excluding ellipsis and nav buttons) */
  maxVisiblePages?: number;
  /** Custom class name for the container */
  className?: string;
  /** Show page size selector */
  showPageSizeSelector?: boolean;
  /** Available page sizes */
  pageSizes?: number[];
  /** Current page size */
  pageSize?: number;
  /** Callback when page size changes */
  onPageSizeChange?: (size: number) => void;
  /** Show total items count */
  showTotal?: boolean;
  /** Total number of items */
  totalItems?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 5,
  className,
  showPageSizeSelector = false,
  pageSizes = [10, 20, 50, 100],
  pageSize,
  onPageSizeChange,
  showTotal = false,
  totalItems,
}: PaginationProps) {
  if (totalPages <= 1 && !showPageSizeSelector) {
    return null;
  }

  const getPageNumbers = () => {
    if (totalPages <= 1) return [];

    const pages: (number | '...')[] = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('...');
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();
  const canPrevious = currentPage > 1;
  const canNext = currentPage < totalPages;

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row items-center justify-between gap-4',
        className
      )}
    >
      {showTotal && totalItems !== undefined && (
        <div className="text-sm text-muted-foreground">
          Showing{' '}
          <span className="font-medium">
            {(currentPage - 1) * (pageSize || 0) + 1}
          </span>{' '}
          to{' '}
          <span className="font-medium">
            {Math.min(currentPage * (pageSize || 0), totalItems)}
          </span>{' '}
          of <span className="font-medium">{totalItems}</span> results
        </div>
      )}

      <div className="flex-1 flex items-center justify-center sm:justify-end gap-1">
        <nav className="flex items-center gap-1" aria-label="Pagination">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!canPrevious}
            aria-label="Previous page"
            className={!canPrevious ? 'opacity-50' : ''}
          >
            <ChevronLeftIcon className="h-4 w-4" />
            <span className="sr-only">Previous</span>
          </Button>

          {pages.map((page, index) =>
            page === '...' ? (
              <span
                key={`ellipsis-${index}`}
                className="px-3 py-1.5 text-sm font-medium text-foreground/50"
              >
                <EllipsisHorizontalIcon className="h-4 w-4" />
                <span className="sr-only">More pages</span>
              </span>
            ) : (
              <Button
                key={page}
                variant={page === currentPage ? 'primary' : 'outline'}
                size="sm"
                onClick={() => onPageChange(page as number)}
                aria-current={page === currentPage ? 'page' : undefined}
                className={cn(
                  'min-w-[2rem]',
                  page === currentPage ? 'font-semibold' : ''
                )}
              >
                {page}
              </Button>
            )
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!canNext}
            aria-label="Next page"
            className={!canNext ? 'opacity-50' : ''}
          >
            <ChevronRightIcon className="h-4 w-4" />
            <span className="sr-only">Next</span>
          </Button>
        </nav>

        {showPageSizeSelector && onPageSizeChange && (
          <div className="ml-4 flex items-center text-sm">
            <label htmlFor="page-size" className="mr-2 text-muted-foreground">
              Rows per page:
            </label>
            <select
              id="page-size"
              className="bg-background border rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-ring focus:ring-offset-2"
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
            >
              {pageSizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}

export default Pagination;
