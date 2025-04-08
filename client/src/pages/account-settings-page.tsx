import React, { useState } from 'react';
import { useAccountSettings } from '../hooks/useAccountSettings';

const PreferencesPage: React.FC = () => {
  const {
    preferences,
    isLoading,
    error,
    savePreferences,
    setThemePreference,
    toggleEmailNotifications,
    togglePriceAlerts,
    togglePortfolioSummaries,
    setDefaultPortfolioView,
    setDefaultCurrency,
    togglePerformanceDisplay
  } = useAccountSettings();
  
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const success = await savePreferences();
      if (success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return <div className="text-center p-4">Loading preferences...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Account Preferences</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {saveSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Preferences saved successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Theme Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Display Settings</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Theme Preference
            </label>
            <select
              value={preferences.themePreference}
              onChange={(e) => setThemePreference(e.target.value as "Light" | "Dark" | "System")}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="Light">Light</option>
              <option value="Dark">Dark</option>
              <option value="System">System</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Default Currency
            </label>
            <select
              value={preferences.defaultCurrency}
              onChange={(e) => setDefaultCurrency(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="JPY">JPY</option>
            </select>
          </div>
          
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={preferences.showPerformanceInPercentage}
                onChange={togglePerformanceDisplay}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Show performance as percentage</span>
            </label>
          </div>
        </div>
        
        {/* Portfolio View Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Portfolio Settings</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Default Portfolio View
            </label>
            <select
              value={preferences.defaultPortfolioView}
              onChange={(e) => setDefaultPortfolioView(e.target.value as "Summary" | "Detailed" | "Performance")}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="Summary">Summary</option>
              <option value="Detailed">Detailed</option>
              <option value="Performance">Performance</option>
            </select>
          </div>
        </div>
        
        {/* Notifications Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Notification Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.emailNotificationsEnabled}
                  onChange={toggleEmailNotifications}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Email Notifications</span>
              </label>
            </div>
            
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.priceAlertNotificationsEnabled}
                  onChange={togglePriceAlerts}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Price Alert Notifications</span>
              </label>
            </div>
            
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.portfolioSummaryNotificationsEnabled}
                  onChange={togglePortfolioSummaries}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Portfolio Summary Notifications</span>
              </label>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving || isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PreferencesPage;