import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";

export const DashboardPage = () => {
  const { user } = useAuth0();

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
        
        <div className="grid md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <div className="card">
              <div className="flex flex-col items-center mb-4">
                <img 
                  src={user?.picture} 
                  alt="Profile" 
                  className="w-24 h-24 rounded-full object-cover border-2 border-primary-200"
                />
                <h2 className="text-xl font-semibold mt-2">{user?.name}</h2>
                <p className="text-gray-500 text-sm">{user?.email}</p>
              </div>
              
              <div className="border-t border-gray-200 pt-4 mt-2">
                <h3 className="text-lg font-medium mb-2">Account Menu</h3>
                <ul className="space-y-2">
                <li><Link to="/profile" className="text-primary-600 hover:text-primary-800">View Profile</Link></li>
                <li><Link to="/settings" className="text-gray-600 hover:text-gray-800">Account Settings</Link></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-3">
            <div className="card mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Your Portfolios</h3>
                <button className="btn btn-primary text-sm">+ New Portfolio</button>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <p className="text-gray-500">You don't have any portfolios yet.</p>
                <p className="text-gray-500 mb-4">Create your first investment portfolio to get started!</p>
              </div>
            </div>
            
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Market Overview</h3>
              <p className="text-gray-500">Market data will appear here.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};