import React from 'react';
import { Profile } from '../../pages/Profile';
import { useAuth } from '../../contexts/AuthContext';

export const ProfileWrapper: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) {
    return null; // or a loading/error state
  }
  
  return <Profile user={user} />;
};

export default ProfileWrapper;
