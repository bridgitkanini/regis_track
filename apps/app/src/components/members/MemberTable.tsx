import { Link } from 'react-router-dom';
import {
  ArrowUpIcon,
  ArrowDownIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
} from '@heroicons/react/20/solid';
import { Badge } from '../common/Badge';
import { Loader } from '../common/Loader';
import { format } from 'date-fns';
import { Member } from '../../types/member';
import { cn } from '../../lib/utils';
import { Button } from '../common/Button';

type MemberStatus = 'active' | 'inactive' | 'pending';

type SortableField =
  | keyof Pick<Member, 'firstName' | 'email' | 'status' | 'createdAt'>
  | 'role.name';

interface MemberTableProps {
  members: Member[];
  sortField:
    | keyof Pick<
        Member,
        'firstName' | 'email' | 'status' | 'createdAt' | 'role'
      >
    | 'role.name';
  sortOrder: 'asc' | 'desc';
  onSort: (field: keyof Member | 'role.name') => void;
  onEdit?: (member: Member) => void;
  onDelete?: (member: Member) => void;
  isLoading?: boolean;
  className?: string;
}

const statusVariantMap: Record<
  MemberStatus,
  'success' | 'warning' | 'destructive'
> = {
  active: 'success',
  pending: 'warning',
  inactive: 'destructive',
};

export const MemberTable = ({
  members,
  sortField,
  sortOrder,
  onSort,
  onEdit,
  onDelete,
  isLoading = false,
  className,
}: MemberTableProps) => {
  const handleSort = (field: string) => {
    if (isSortableField(field)) {
      onSort(field);
    }
  };

  const isSortableField = (field: string): field is SortableField => {
    return ['firstName', 'email', 'status', 'createdAt', 'role.name'].includes(
      field
    );
  };

  const renderSortIcon = (field: string) => {
    if (!isSortableField(field)) return null;

    const isActive = sortField === field;
    const Icon = sortOrder === 'asc' ? ArrowUpIcon : ArrowDownIcon;

    return (
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          'ml-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100',
          isActive ? 'opacity-100' : ''
        )}
        onClick={() => handleSort(field)}
        aria-label={isActive ? `Sorted ${sortOrder}ending` : 'Sort'}
      >
        <Icon className="h-3.5 w-3.5" />
      </Button>
    );
  };

  const renderHeaderCell = (field: string, label: string, className = '') => (
    <th
      scope="col"
      className={cn(
        'px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider group',
        isSortableField(field) ? 'cursor-pointer hover:text-foreground' : '',
        className
      )}
      onClick={() => isSortableField(field) && handleSort(field)}
    >
      <div className="flex items-center">
        {label}
        {isSortableField(field) && renderSortIcon(field)}
      </div>
    </th>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader />
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No members found</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'overflow-hidden shadow ring-1 ring-black/5 rounded-lg',
        className
      )}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              {renderHeaderCell('firstName', 'Name')}
              {renderHeaderCell('email', 'Email')}
              {renderHeaderCell('role.name', 'Role')}
              {renderHeaderCell('status', 'Status', 'hidden sm:table-cell')}
              {renderHeaderCell('createdAt', 'Joined', 'hidden md:table-cell')}
              <th scope="col" className="relative px-4 py-3 w-32">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-background">
            {members.map((member) => (
              <tr
                key={member.id}
                className="hover:bg-muted/50 transition-colors"
              >
                <td className="whitespace-nowrap px-4 py-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-muted overflow-hidden">
                      {member.profilePicture ? (
                        <img
                          className="h-full w-full object-cover"
                          src={member.profilePicture}
                          alt={`${member.firstName} ${member.lastName}`}
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary">
                          {member.firstName?.[0]?.toUpperCase()}
                          {member.lastName?.[0]?.toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="font-medium text-foreground">
                        {member.firstName} {member.lastName}
                      </div>
                      <div className="text-sm text-muted-foreground sm:hidden">
                        {member.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-4 py-4 hidden sm:table-cell">
                  <div className="text-foreground">{member.email}</div>
                </td>
                <td className="whitespace-nowrap px-4 py-4">
                  <div className="text-foreground">
                    {member.role?.name || '—'}
                  </div>
                </td>
                <td className="whitespace-nowrap px-4 py-4 hidden sm:table-cell">
                  <Badge variant={statusVariantMap[member.status]}>
                    {member.status.charAt(0).toUpperCase() +
                      member.status.slice(1)}
                  </Badge>
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-sm text-muted-foreground hidden md:table-cell">
                  {member.createdAt
                    ? format(new Date(member.createdAt), 'MMM d, yyyy')
                    : '—'}
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    {(Link as any)(
                      { to: `/members/${member.id}` },
                      <Button variant="ghost" size="sm">
                        <EyeIcon className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                    )}
                    {onEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(member)}
                      >
                        <PencilIcon className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(member)}
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      >
                        <TrashIcon className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MemberTable;
