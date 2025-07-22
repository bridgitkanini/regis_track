import { useState, useCallback } from 'react';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import type { AxiosError } from 'axios';
import apiClient from '../lib/api/client';
import { StatsGrid } from '../components/dashboard/StatsGrid';
import type { DashboardStats } from '../components/dashboard/StatsGrid';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import { Loader } from '../components/common/Loader';
import { ErrorMessage } from '../components/common/ErrorMessage';

// Define the activity type
type Activity = {
  id: string;
  action: string;
  collection: string;
  documentId: string;
  timestamp: string;
  user: {
    id: string;
    username: string;
    avatar?: string;
  };
};

export const Dashboard = () => {
  // State for search query
  const [searchQuery, setSearchQuery] = useState('');

  // Handle search
  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would trigger a search API call here
    console.log('Searching for:', searchQuery);
  }, [searchQuery]);

  // Fetch dashboard stats with proper typing
  const { 
    data: stats, 
    isLoading: isLoadingStats, 
    error: statsError 
  }: UseQueryResult<DashboardStats, AxiosError> = useQuery<DashboardStats, AxiosError>({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const { data } = await apiClient.get<DashboardStats>('/api/dashboard/stats');
      return data;
    }
  });

  // Handle dashboard stats errors
  if (statsError) {
    console.error('Error fetching dashboard stats:', statsError);
    toast.error('Failed to load dashboard statistics');
  }

  // Fetch recent activity with proper typing
  const { 
    data: activities = [], 
    isLoading: isLoadingActivity, 
    error: activityError 
  }: UseQueryResult<Activity[], AxiosError> = useQuery<Activity[], AxiosError>({
    queryKey: ['recentActivity'],
    queryFn: async () => {
      const { data } = await apiClient.get<Activity[]>('/api/activity');
      return data;
    }
  });

  // Handle recent activity errors
  if (activityError) {
    console.error('Error fetching recent activity:', activityError);
    toast.error('Failed to load recent activity');
  }

  // Show loading state
  if (isLoadingStats || isLoadingActivity) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader size="lg" />
      </div>
    );
  }

  // Show error state if both queries fail
  if (statsError && activityError) {
    return (
      <div className="p-4">
        <ErrorMessage 
          title="Failed to load dashboard data"
          message="Please try refreshing the page or contact support if the issue persists."
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with search */}
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Overview of your organization's membership data
          </p>
        </div>
        <div className="mt-4 md:mt-0 md:ml-4">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              placeholder="Search members..."
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2 border"
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

      {/* Stats Grid */}
      <div className="mb-8">
        {statsError ? (
          <div className="bg-red-50 p-4 rounded-md mb-6">
            <p className="text-sm text-red-700">
              Failed to load statistics. {statsError instanceof Error ? statsError.message : 'Please try again later.'}
            </p>
          </div>
        ) : (
          <StatsGrid stats={stats || { 
            totalMembers: 0, 
            activeMembers: 0, 
            newMembersThisMonth: 0, 
            membershipRenewals: 0 
          }} />
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
          <p className="mt-1 text-sm text-gray-500">
            A summary of recent changes in the system
          </p>
        </div>
        
        {activityError ? (
          <div className="p-6 text-center text-red-600">
            Failed to load recent activity. {activityError instanceof Error ? activityError.message : ''}
          </div>
        ) : (
          <RecentActivity activities={activities} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
