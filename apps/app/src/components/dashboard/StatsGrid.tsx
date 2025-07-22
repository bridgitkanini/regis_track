import { 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  UserGroupIcon, 
  UserPlusIcon, 
  ClockIcon 
} from '@heroicons/react/24/outline';

// Define the DashboardStats type
export type DashboardStats = {
  totalMembers: number;
  activeMembers: number;
  newMembersThisMonth: number;
  membershipRenewals: number;
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

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
}

export const StatsGrid = ({ stats }: StatsGridProps) => {
  // Calculate percentage changes (in a real app, these would come from the API)
  // For now, we'll use placeholder values
  const statItems: StatItem[] = [
    {
      name: 'Total Members',
      value: formatNumber(stats.totalMembers),
      icon: UserGroupIcon,
      change: '+12%',
      changeType: 'increase' as const,
      description: 'Total number of members registered',
    },
    {
      name: 'Active Members',
      value: formatNumber(stats.activeMembers),
      icon: UserGroupIcon,
      change: '+8.2%',
      changeType: 'increase' as const,
      description: 'Members with active status',
    },
    {
      name: 'New This Month',
      value: formatNumber(stats.newMembersThisMonth),
      icon: UserPlusIcon,
      change: '+5.4%',
      changeType: 'increase' as const,
      description: 'New members registered this month',
    },
    {
      name: 'Renewals Due',
      value: formatNumber(stats.membershipRenewals),
      icon: ClockIcon,
      change: stats.membershipRenewals > 0 ? `+${stats.membershipRenewals}` : '0',
      changeType: stats.membershipRenewals > 0 ? 'increase' as const : 'decrease' as const,
      description: 'Memberships requiring renewal soon',
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {statItems.map((item) => {
        const Icon = item.icon;
        const ChangeIcon = item.changeType === 'increase' ? ArrowTrendingUpIcon : ArrowTrendingDownIcon;
        const changeColor = item.changeType === 'increase' ? 'text-green-600' : 'text-red-600';
        
        return (
          <div
            key={item.name}
            className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-12 shadow transition-all duration-200 hover:shadow-md sm:px-6 sm:pt-6"
          >
            <dt>
              <div className="absolute rounded-md bg-indigo-500 p-3">
                <Icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
                {item.name}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <div>
                <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
              <div
                className={classNames(
                  changeColor,
                  'ml-2 flex items-baseline text-sm font-semibold'
                )}
              >
                <ChangeIcon
                  className={classNames(
                    'h-5 w-5 flex-shrink-0 self-center',
                    changeColor
                  )}
                  aria-hidden="true"
                />
                <span className="sr-only">
                  {item.changeType === 'increase' ? 'Increased' : 'Decreased'} by
                </span>
                {item.change}
              </div>
            </dd>
            <div className="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6">
              <div className="text-sm">
                <button
                  type="button"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none"
                  onClick={() => console.log(`View all ${item.name}`)}
                >
                  View all
                  <span className="sr-only"> {item.name} stats</span>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsGrid;
