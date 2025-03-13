import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

export const ProfilePage = () => {
  const { user } = useAuth0();

  if (!user) {
    return null;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">User Profile</h1>
        
        <div className="card">
          <div className="flex items-center border-b border-gray-200 pb-6 mb-6">
            <img
              src={user.picture}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-primary-200"
            />
            <div className="ml-6">
              <h2 className="text-2xl font-semibold">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Account Information</h3>
            <p className="text-gray-600">Email: {user.email}</p>
            <p className="text-gray-600">Email verified: {user.email_verified ? "Yes" : "No"}</p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Raw Profile Information</h3>
            <div className="bg-gray-50 p-4 rounded-md overflow-auto">
              <pre className="text-sm text-gray-700">{JSON.stringify(user, null, 2)}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};