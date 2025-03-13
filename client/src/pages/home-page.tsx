import React from "react";
import { LoginButton } from "../components/buttons/login-button";
import { SignupButton } from "../components/buttons/signup-button";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";

export const HomePage = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Investment Portfolio Tracker</h1>
          <p className="text-xl text-gray-600 mb-8">Track and manage your investments in one place</p>
          
          {!isAuthenticated ? (
            <div className="flex gap-4 justify-center">
              <LoginButton />
              <SignupButton />
            </div>
          ) : (
            <div className="text-center">
              <p className="text-green-600 mb-4">You're logged in!</p>
              <Link to="/dashboard" className="btn btn-primary">
                Go to Dashboard
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};