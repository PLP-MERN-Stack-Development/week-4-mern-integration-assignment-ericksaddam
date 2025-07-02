import React from 'react';
import { useAuth } from '../context/AuthContext';

function Profile() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-8 rounded shadow">
      <h1 className="text-3xl font-bold mb-4">Profile</h1>
      <div className="flex items-center mb-6">
        <img
          src={user.avatar || '/default-avatar.jpg'}
          alt={user.name}
          className="w-20 h-20 rounded-full mr-6 border"
        />
        <div>
          <p className="text-xl font-semibold">{user.name}</p>
          <p className="text-gray-600">{user.email}</p>
          <p className="text-gray-500 text-sm mt-2">Role: {user.role}</p>
        </div>
      </div>
      <p className="text-gray-700">Welcome to your profile page!</p>
    </div>
  );
}

export default Profile;
