import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { Button } from '../common/Button';
import { Loader } from '../common/Loader';
import { Badge } from '../common/Badge';
import apiClient from '../../lib/api/client';
import { Member } from '../../types/member';

const statusColors = {
  active: 'green',
  inactive: 'red',
  pending: 'yellow',
} as const;

export const MemberDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch member data
  const {
    data: member,
    isLoading,
    error,
  } = useQuery<Member>({
    queryKey: ['member', id],
    queryFn: async () => {
      if (!id) throw new Error('Member ID is required');
      const data = await apiClient.get<Member>(`/api/members/${id}`);
      return data;
    },
    enabled: !!id,
    onError: (error: Error) => {
      toast.error(error?.message || 'Failed to load member data');
      navigate('/members');
    },
  });

  // Delete member mutation
  const deleteMember = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error('Member ID is required');
      await apiClient.delete(`/api/members/${id}`);
    },
    onSuccess: () => {
      toast.success('Member deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['members'] });
      navigate('/members');
    },
    onError: (error: Error) => {
      toast.error(error?.message || 'Failed to delete member');
    },
  });

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this member? This action cannot be undone.')) {
      deleteMember.mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error loading member data
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>Failed to load member information. Please try again later.</p>
            </div>
            <div className="mt-4">
              <Button
                variant="outline"
                onClick={() => navigate('/members')}
                className="text-sm"
              >
                Back to Members
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="text-center py-12">
        <h3 className="mt-2 text-sm font-medium text-gray-900">Member not found</h3>
        <p className="mt-1 text-sm text-gray-500">
          The member you're looking for doesn't exist or has been deleted.
        </p>
        <div className="mt-6">
          <Button
            variant="primary"
            onClick={() => navigate('/members')}
            className="text-sm"
          >
            Back to Members
          </Button>
        </div>
      </div>
    );
  }

  const fullName = `${member.firstName} ${member.lastName}`;
  const profileImage = member.profilePicture
    ? `${process.env.NX_API_URL || 'http://localhost:3333'}/uploads/profile-pictures/${member.profilePicture}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=4f46e5&color=fff&size=256`;

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            {fullName}
          </h2>
          <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <span className="mr-2">
                <Badge color={statusColors[member.status]}>
                  {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                </Badge>
              </span>
              <span className="mr-2">•</span>
              <span>{member.role.name}</span>
              <span className="mx-2">•</span>
              <span>Joined {format(new Date(member.createdAt), 'MMM d, yyyy')}</span>
            </div>
          </div>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
          <Link
            to={`/members/${member.id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Edit
          </Link>
          <Button
            variant="danger"
            onClick={handleDelete}
            isLoading={deleteMember.isLoading}
            className="inline-flex items-center px-4 py-2"
          >
            Delete
          </Button>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Member Information
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Personal details and contact information.
          </p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Profile Picture</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-100">
                  <img
                    src={profileImage}
                    alt={fullName}
                    className="h-full w-full object-cover"
                  />
                </div>
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Full name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {fullName}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Email address</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <a
                  href={`mailto:${member.email}`}
                  className="text-indigo-600 hover:text-indigo-500"
                >
                  {member.email}
                </a>
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Phone</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {member.phone || 'N/A'}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {member.dateOfBirth
                  ? format(new Date(member.dateOfBirth), 'MMMM d, yyyy')
                  : 'N/A'}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Gender</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {member.gender
                  ? member.gender.charAt(0).toUpperCase() + member.gender.slice(1)
                  : 'N/A'}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Address</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {[
                  member.address,
                  member.city,
                  member.state,
                  member.postalCode,
                  member.country,
                ]
                  .filter(Boolean)
                  .join(', ') || 'N/A'}
              </dd>
            </div>
            {member.notes && (
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Notes</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <p className="whitespace-pre-line">{member.notes}</p>
                </dd>
              </div>
            )}
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Member Since</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {format(new Date(member.createdAt), 'MMMM d, yyyy')}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {format(new Date(member.updatedAt), 'MMMM d, yyyy')}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default MemberDetail;
