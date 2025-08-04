import React from 'react';
import { Link } from 'react-router-dom';

export const Unauthorized: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white">403</h1>
        <p className="text-xl mt-4 mb-8 text-gray-600 dark:text-gray-400">
          Access Denied
        </p>
        <Link
          to="/login"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Return to Login
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;