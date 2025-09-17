import React from 'react';
import type { AuthResponse } from '../services/auth.service';

interface ProfileProps {
  user: AuthResponse['user'];
}

export const Profile: React.FC<ProfileProps> = ({ user }) => {
  return (
    <div className="profile-container">
      <h1>User Profile</h1>
      <div className="profile-info">
        <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xl">
          {user.username?.[0]?.toUpperCase()}
        </div>
        <div className="profile-details">
          <h2>{user.username}</h2>
          <p>{user.email}</p>
          <p>Role: {user.role?.name}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
