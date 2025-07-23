import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UserGroupIcon,
  UserPlusIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { cn } from '../../lib/utils';

// Define the DashboardStats type
export type DashboardStats = {
  totalMembers: number;
  activeMembers: number;
  newMembersThisMonth: number;
  membershipRenewals: number;
};

// Format number with commas
export const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

type StatItem = {
  name: string;
  value: string;
  icon: React.ElementType;
  change: string;
  changeType: 'increase' | 'decrease' | 'neutral';
  description: string;
};

interface StatsGridProps {
  stats: DashboardStats;
  className?: string;
}

export const StatsGrid = ({ stats, className }: StatsGridProps) => {
  const statItems: StatItem[] = [
    {
      name: 'Total Members',
      value: formatNumber(stats.totalMembers),
      icon: UserGroupIcon,
      change: '+12%',
      changeType: 'increase',
      description: 'Total number of members registered',
    },
    {
      name: 'Active Members',
      value: formatNumber(stats.activeMembers),
      icon: UserGroupIcon,
      change: '+8.2%',
      changeType: 'increase',
      description: 'Members with active status',
    },
    {
      name: 'New This Month',
      value: formatNumber(stats.newMembersThisMonth),
      icon: UserPlusIcon,
      change: '+5.4%',
      changeType: 'increase',
      description: 'New members registered this month',
    },
    {
      name: 'Renewals Due',
      value: formatNumber(stats.membershipRenewals),
      icon: ClockIcon,
      change:
        stats.membershipRenewals > 0 ? `+${stats.membershipRenewals}` : '0',
      changeType: stats.membershipRenewals > 0 ? 'increase' : 'decrease',
      description: 'Memberships requiring renewal soon',
    },
  ];

  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4',
        className
      )}
    >
      {statItems.map((item) => {
        const Icon = item.icon;
        const ChangeIcon =
          item.changeType === 'increase'
            ? ArrowTrendingUpIcon
            : ArrowTrendingDownIcon;

        const changeConfig = {
          increase: {
            bg: 'bg-green-100 dark:bg-green-900/30',
            text: 'text-green-700 dark:text-green-400',
            icon: 'text-green-600 dark:text-green-400',
          },
          decrease: {
            bg: 'bg-red-100 dark:bg-red-900/30',
            text: 'text-red-700 dark:text-red-400',
            icon: 'text-red-600 dark:text-red-400',
          },
          neutral: {
            bg: 'bg-gray-100 dark:bg-gray-800',
            text: 'text-gray-700 dark:text-gray-400',
            icon: 'text-gray-600 dark:text-gray-400',
          },
        }[item.changeType];

        return (
          <div
            key={item.name}
            className="group relative overflow-hidden rounded-lg border bg-card p-6 transition-all duration-200 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div className="flex-shrink-0 rounded-md bg-primary/10 p-2">
                <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
              </div>
              <div
                className={cn(
                  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                  changeConfig.bg,
                  changeConfig.text
                )}
              >
                <ChangeIcon className="mr-1 h-3.5 w-3.5" />
                {item.change}
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                {item.name}
              </h3>
              <p className="mt-1 text-2xl font-semibold text-foreground">
                {item.value}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {item.description}
              </p>
            </div>

            <div className="absolute inset-x-0 bottom-0 bg-muted/20 px-4 py-2 text-center text-xs">
              <button
                type="button"
                className="font-medium text-primary hover:text-primary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
                onClick={() => console.log(`View all ${item.name}`)}
              >
                View details
                <span className="sr-only"> {item.name} stats</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsGrid;
