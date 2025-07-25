import { useState, useCallback, useMemo } from 'react';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import type { AxiosError } from 'axios';
import apiClient from '../lib/api/client';
import { StatsGrid } from '../components/dashboard/StatsGrid';
import type { DashboardStats } from '../components/dashboard/StatsGrid';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import { Loader } from '../components/common/Loader';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { useGetActivitiesQuery } from '../features/activity/activityApi';
import { Activity } from '../types';

// Define the activity type for the RecentActivity component
type ActivityItem = Activity & {
  user: {
    username: string;
    avatar?: string;
  };
};

export const Dashboard = () => {
  // State for search query
  const [searchQuery, setSearchQuery] = useState('');
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  // State for sorting
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  }>({
    key: 'timestamp',
    direction: 'desc',
  });

  // Handle search
  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      // Reset to first page when searching
      setCurrentPage(1);
      // In a real app, we would trigger a search API call here
      console.log('Searching for:', searchQuery);
    },
    [searchQuery]
  );

  // Fetch dashboard stats with proper typing
  const {
    data: stats,
    isLoading: isLoadingStats,
    error: statsError,
  }: UseQueryResult<DashboardStats, AxiosError> = useQuery<
    DashboardStats,
    AxiosError
  >({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const { data } = await apiClient.get<DashboardStats>(
        '/api/dashboard/stats'
      );
      return data;
    },
  });

  // Fetch activities with pagination and sorting
  const {
    data: activitiesData,
    isLoading: isLoadingActivities,
    error: activitiesError,
  } = useGetActivitiesQuery({
    page: currentPage,
    limit: itemsPerPage,
    sortBy: sortConfig.key,
    order: sortConfig.direction,
    ...(searchQuery && { search: searchQuery }),
  });

  // Transform activities data to match the RecentActivity component's expected format
  const activities = useMemo<ActivityItem[]>(() => {
    if (!activitiesData?.data) return [];
    return activitiesData.data.map((activity) => ({
      ...activity,
      user: {
        username: activity.user?.name || 'System',
        avatar: activity.user?.avatar,
      },
    }));
  }, [activitiesData]);

  // Handle sort change
  const handleSort = (key: string) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === 'asc'
          ? 'desc'
          : 'asc',
    }));
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle items per page change
  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Handle dashboard stats errors
  if (statsError) {
    toast.error('Failed to load dashboard statistics');
    console.error('Dashboard stats error:', statsError);
  }

  // Handle activities errors
  if (activitiesError) {
    toast.error('Failed to load recent activities');
    console.error('Activities error:', activitiesError);
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Dashboard
            </h2>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                placeholder="Search activities..."
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      {isLoadingStats ? (
        <div className="flex justify-center items-center h-40">
          <Loader size="lg" />
        </div>
      ) : statsError ? (
        <ErrorMessage message="Failed to load dashboard statistics" />
      ) : (
        stats && <StatsGrid stats={stats} />
      )}

      {/* Recent Activity */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Recent Activity
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            A list of recent activities in the system.
          </p>
        </div>

        {/* Items per page selector */}
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Showing{' '}
            <span className="font-medium">
              {activitiesData ? (currentPage - 1) * itemsPerPage + 1 : 0}
            </span>{' '}
            to{' '}
            <span className="font-medium">
              {activitiesData
                ? Math.min(currentPage * itemsPerPage, activitiesData.total)
                : 0}
            </span>{' '}
            of <span className="font-medium">{activitiesData?.total || 0}</span>{' '}
            results
          </div>
          <div className="flex items-center">
            <label
              htmlFor="itemsPerPage"
              className="mr-2 text-sm text-gray-600"
            >
              Items per page:
            </label>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="block w-20 pl-3 pr-10 py-1.5 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {isLoadingActivities ? (
          <div className="flex justify-center items-center h-40">
            <Loader size="lg" />
          </div>
        ) : activitiesError ? (
          <ErrorMessage message="Failed to load recent activities" />
        ) : activities && activities.length > 0 ? (
          <RecentActivity
            activities={activities}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            totalItems={activitiesData?.total || 0}
            onPageChange={handlePageChange}
            onSort={handleSort}
            sortConfig={sortConfig}
          />
        ) : (
          <div className="text-center py-4 text-gray-500">
            No recent activity to display.
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
