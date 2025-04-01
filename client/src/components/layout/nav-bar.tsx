import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { LoginButton } from "../buttons/login-button";
import { LogoutButton } from "../buttons/logout-button";
import { SignupButton } from "../buttons/signup-button";

export const Navbar = () => {
  const { isAuthenticated, user } = useAuth0();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* This logo already serves as the home button */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-primary-600">
                InvestTrack
              </Link>
            </div>
            <div className="hidden sm:ml-12 sm:flex sm:space-x-8">
              {/* No dedicated Home button needed */}
              {isAuthenticated && (
                <>
                  <Link to="/dashboard" className="border-transparent text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                    Dashboard
                  </Link>
                  <Link to="/profile" className="border-transparent text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                    Profile
                  </Link>
                  <Link to="/settings" className="border-transparent text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                    Settings
                  </Link>
                </>
              )}
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {!isAuthenticated ? (
              <div className="flex space-x-3">
                <SignupButton />
                <LoginButton />
              </div>
            ) : (
              <div className="flex items-center">
                <img
                  className="h-8 w-8 rounded-full"
                  src={user?.picture}
                  alt={user?.name || "User"}
                />
                {/* Change ml-4 to ml-2 to decrease space between picture and name */}
                <span className="ml-2 mr-6 text-sm text-gray-700">{user?.name}</span>
                <LogoutButton />
              </div>
            )}
          </div>
          
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          {/* No Home link in mobile menu either - logo already serves this purpose */}
          {isAuthenticated && (
            <>
              <Link
                to="/dashboard"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/profile"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Profile
              </Link>
            </>
          )}
        </div>
        
        <div className="pt-4 pb-3 border-t border-gray-200">
          {isAuthenticated ? (
            <>
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={user?.picture}
                    alt={user?.name || "User"}
                  />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{user?.name}</div>
                  <div className="text-sm font-medium text-gray-500">{user?.email}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1 px-2">
                <div className="px-2 py-2">
                  <LogoutButton />
                </div>
              </div>
            </>
          ) : (
            <div className="px-4 py-2 space-y-2">
              <div className="mb-2">
                <SignupButton />
              </div>
              <div>
                <LoginButton />
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};