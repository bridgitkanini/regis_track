import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { Button } from '../common/Button';
import { Loader } from '../common/Loader';
import { Badge } from '../common/Badge';
import { Card } from '../common/Card';
import apiClient from '../../lib/api/client';
import { Member } from '../../types/member';

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
      const response = await apiClient.get<Member>(`/api/members/${id}`);
      return response.data;
    },
    enabled: !!id,
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
    if (
      window.confirm(
        'Are you sure you want to delete this member? This action cannot be undone.'
      )
    ) {
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
      <Card className="max-w-3xl mx-auto">
        <div className="p-6">
          <h3 className="text-lg font-medium text-destructive">
            Error loading member data
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Failed to load member information. Please try again later.
          </p>
          <div className="mt-6">
            <Button variant="outline" onClick={() => navigate('/members')}>
              Back to Members
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  if (!member) {
    return (
      <Card className="max-w-3xl mx-auto">
        <div className="p-6 text-center">
          <h3 className="text-lg font-medium">Member not found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            The member you're looking for doesn't exist or has been deleted.
          </p>
          <div className="mt-6">
            <Button onClick={() => navigate('/members')}>
              Back to Members
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  const fullName = `${member.firstName} ${member.lastName}`;
  const profileImage = member.profilePicture
    ? `${
        process.env.NX_API_URL || 'http://localhost:3000'
      }/uploads/profile-pictures/${member.profilePicture}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
        fullName
      )}&background=4f46e5&color=fff&size=256`;

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'destructive';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {fullName}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Badge variant={getStatusVariant(member.status)}>
              {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
            </Badge>
            <span className="mx-1 hidden sm:inline">•</span>
            <span>{member.role?.name || 'No role assigned'}</span>
            <span className="mx-1 hidden sm:inline">•</span>
            <span>
              Joined {format(new Date(member.createdAt), 'MMM d, yyyy')}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/members/${member.id}/edit`)}
          >
            Edit
          </Button>
          <Button
            variant="outline"
            onClick={handleDelete}
            isLoading={deleteMember.isPending}
          >
            Delete
          </Button>
        </div>
      </div>

      <Card>
        <div className="p-6">
          <div className="space-y-8">
            <div className="flex flex-col gap-6 sm:flex-row">
              <div className="flex-shrink-0">
                <div className="h-32 w-32 rounded-lg overflow-hidden bg-muted">
                  <img
                    src={profileImage}
                    alt={fullName}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-medium">Profile Information</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Personal details and contact information for{' '}
                  {member.firstName}.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-1">
                <h3 className="text-sm font-medium">Full Name</h3>
                <p className="text-sm">{fullName}</p>
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-medium">Email Address</h3>
                <a
                  href={`mailto:${member.email}`}
                  className="text-sm text-primary hover:underline"
                >
                  {member.email}
                </a>
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-medium">Phone Number</h3>
                <p className="text-sm">{member.phone || 'Not provided'}</p>
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-medium">Member Since</h3>
                <p className="text-sm">
                  {format(new Date(member.createdAt), 'MMMM d, yyyy')}
                </p>
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-medium">Status</h3>
                <Badge variant={getStatusVariant(member.status)}>
                  {member.status.charAt(0).toUpperCase() +
                    member.status.slice(1)}
                </Badge>
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-medium">Role</h3>
                <p className="text-sm">
                  {member.role?.name || 'No role assigned'}
                </p>
              </div>
            </div>

            {member.address && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Address</h3>
                <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                  <div>
                    <p>{member.address}</p>
                    <p>
                      {member.city}, {member.state} {member.postalCode}
                    </p>
                    <p>{member.country}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MemberDetail;
