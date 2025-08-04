import React from 'react';
import { Member } from '../types/member';

interface ProfileProps {
  user: Member;
}

export const Profile: React.FC<ProfileProps> = ({ user }) => {
  return (
    <div className="profile-container">
      <h1>User Profile</h1>
      <div className="profile-info">
        <img 
          src={user.profilePicture ? user.profilePicture : ''} 
          alt={`${user.firstName}'s avatar`}
          className="profile-avatar"
        />
        <div className="profile-details">
          <h2>{user.firstName} {user.lastName}</h2>
          <p>{user.email}</p>
          <p>Member since: {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;