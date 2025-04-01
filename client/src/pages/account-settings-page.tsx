import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { 
  Cog6ToothIcon, 
  ChartBarIcon, 
  ShieldCheckIcon, 
  BellIcon, 
  SwatchIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon
} from "@heroicons/react/24/outline";
import { useAccountSettings } from "../hooks/useAccountSettings";

export const AccountSettingsPage = () => {
    const { user } = useAuth0();
    const {
        preferences,
        setThemePreference,
        toggleEmailNotifications,
        togglePriceAlerts,
        togglePortfolioSummaries,
        setDefaultPortfolioView,
        setDefaultCurrency,
        togglePerformanceDisplay
    } = useAccountSettings();

    if (!user) return null;
    
    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="flex items-center gap-4 mb-8">
                    <Cog6ToothIcon className="w-8 h-8 text-primary-600" />
                    <h1 className="text-3xl font-semibold text-gray-900">Account Settings</h1>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Profile Section */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                            <div className="flex flex-col items-center">
                                <img 
                                    src={user.picture} 
                                    alt="Profile" 
                                    className="w-32 h-32 rounded-full object-cover border-4 border-primary-100"
                                    loading="eager"
                                    width={128}
                                    height={128}
                                />
                                <h2 className="text-xl font-semibold mt-4 text-gray-900">{user.name}</h2>
                                <p className="text-gray-600 text-sm mt-1">{user.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Main Settings */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Display Preferences */}
                        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <ChartBarIcon className="w-6 h-6 text-primary-600" />
                                <h2 className="text-xl font-semibold text-gray-900">Display Preferences</h2>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-200">
                                    <div>
                                        <h4 className="font-medium text-gray-900">Default Currency</h4>
                                        <p className="text-sm text-gray-600">Set your preferred display currency</p>
                                    </div>
                                    <select 
                                        value={preferences.defaultCurrency}
                                        onChange={(e) => setDefaultCurrency(e.target.value)}
                                        className="bg-white rounded-lg px-4 py-2 w-40 border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                                    >
                                        <option value="USD">USD ($)</option>
                                        <option value="EUR">EUR (€)</option>
                                        <option value="GBP">GBP (£)</option>
                                    </select>
                                </div>

                                {/* <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-200">
                                    <div>
                                        <h4 className="font-medium text-gray-900">Default Portfolio View</h4>
                                        <p className="text-sm text-gray-600">Choose your default dashboard view</p>
                                    </div>
                                    <select 
                                        value={preferences.defaultPortfolioView}
                                        onChange={(e) => setDefaultPortfolioView(e.target.value as any)}
                                        className="bg-white rounded-lg px-4 py-2 w-40 border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                                    >
                                        <option value="Summary">Summary</option>
                                        <option value="Detailed">Detailed</option>
                                        <option value="Performance">Performance</option>
                                    </select>
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-200">
                                    <div>
                                        <h4 className="font-medium text-gray-900">Performance Display</h4>
                                        <p className="text-sm text-gray-600">Show performance in percentage or value</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            className="sr-only peer" 
                                            checked={preferences.showPerformanceInPercentage}
                                            onChange={togglePerformanceDisplay}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-primary-500 peer-focus:ring-2 peer-focus:ring-primary-300 after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                                        <span className="ml-3 text-sm font-medium text-gray-700">
                                            {preferences.showPerformanceInPercentage ? "Percentage" : "Absolute Value"}
                                        </span>
                                    </label>
                                </div> */}
                            </div>
                        </div>

                        {/* Theme Settings */}
                        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <SwatchIcon className="w-6 h-6 text-primary-600" />
                                <h2 className="text-xl font-semibold text-gray-900">Theme Preferences</h2>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-200">
                                    <div>
                                        <h4 className="font-medium text-gray-900">Theme Mode</h4>
                                        <p className="text-sm text-gray-600">Choose your preferred theme</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setThemePreference("Light")}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${preferences.themePreference === "Light" ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                                        >
                                            <SunIcon className="w-5 h-5" />
                                            Light
                                        </button>
                                        <button
                                            onClick={() => setThemePreference("Dark")}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${preferences.themePreference === "Dark" ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                                        >
                                            <MoonIcon className="w-5 h-5" />
                                            Dark
                                        </button>
                                        <button
                                            onClick={() => setThemePreference("System")}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${preferences.themePreference === "System" ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                                        >
                                            <ComputerDesktopIcon className="w-5 h-5" />
                                            System
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Notification Settings */}
                        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <BellIcon className="w-6 h-6 text-primary-600" />
                                <h2 className="text-xl font-semibold text-gray-900">Notification Settings</h2>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-200">
                                    <div>
                                        <h4 className="font-medium text-gray-900">Email Notifications</h4>
                                        <p className="text-sm text-gray-600">Receive notifications via email</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            className="sr-only peer" 
                                            checked={preferences.emailNotificationsEnabled}
                                            onChange={toggleEmailNotifications}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-primary-500 peer-focus:ring-2 peer-focus:ring-primary-300 after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-200">
                                    <div>
                                        <h4 className="font-medium text-gray-900">Price Alerts</h4>
                                        <p className="text-sm text-gray-600">Get notified when prices hit targets</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            className="sr-only peer" 
                                            checked={preferences.priceAlertNotificationsEnabled}
                                            onChange={togglePriceAlerts}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-primary-500 peer-focus:ring-2 peer-focus:ring-primary-300 after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-200">
                                    <div>
                                        <h4 className="font-medium text-gray-900">Portfolio Summaries</h4>
                                        <p className="text-sm text-gray-600">Receive weekly portfolio summaries</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            className="sr-only peer" 
                                            checked={preferences.portfolioSummaryNotificationsEnabled}
                                            onChange={togglePortfolioSummaries}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-primary-500 peer-focus:ring-2 peer-focus:ring-primary-300 after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};