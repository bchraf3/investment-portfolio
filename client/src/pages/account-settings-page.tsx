import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Cog6ToothIcon, ChartBarIcon, ShieldCheckIcon, BellIcon } from "@heroicons/react/24/outline";

export const AccountSettingsPage = () => {
    const { user } = useAuth0();

    if (!user) {
        return null;
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="flex items-center gap-4 mb-8">
                    <Cog6ToothIcon className="w-8 h-8 text-primary-600" />
                    <h1 className="text-3xl font-semibold text-gray-900">Account Settings</h1>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Profile Section - LCP element prioritized */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                            <div className="flex flex-col items-center">
                                <img 
                                    src={user.picture} 
                                    alt="Profile" 
                                    className="w-32 h-32 rounded-full object-cover border-4 border-primary-100"
                                    loading="eager" // Prioritize LCP image
                                    width={128}
                                    height={128}
                                />
                                <h2 className="text-xl font-semibold mt-4 text-gray-900">{user.name}</h2>
                                <p className="text-gray-600 text-sm mt-1">{user.email}</p>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                            <h3 className="text-sm font-semibold text-gray-600 mb-4">QUICK ACTIONS</h3>
                            <button className="w-full bg-primary-500 hover:bg-primary-600 text-white rounded-lg py-3 px-4 transition-colors">
                                Export Portfolio Data
                            </button>
                        </div>
                    </div>

                    {/* Main Settings */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Investment Preferences */}
                        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <ChartBarIcon className="w-6 h-6 text-primary-600" />
                                <h2 className="text-xl font-semibold text-gray-900">Investment Preferences</h2>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-200">
                                    <div>
                                        <h4 className="font-medium text-gray-900">Default Currency</h4>
                                        <p className="text-sm text-gray-600">Set your preferred display currency</p>
                                    </div>
                                    <select className="bg-white rounded-lg px-4 py-2 w-40 border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500">
                                        <option>USD ($)</option>
                                        <option>EUR (€)</option>
                                        <option>GBP (£)</option>
                                    </select>
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-200">
                                    <div>
                                        <h4 className="font-medium text-gray-900">Risk Tolerance Level</h4>
                                        <p className="text-sm text-gray-600">Update your investment risk profile</p>
                                    </div>
                                    <select className="bg-white rounded-lg px-4 py-2 w-40 border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500">
                                        <option>Conservative</option>
                                        <option>Moderate</option>
                                        <option>Aggressive</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Security & Privacy */}
                        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <ShieldCheckIcon className="w-6 h-6 text-primary-600" />
                                <h2 className="text-xl font-semibold text-gray-900">Security & Privacy</h2>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-200">
                                    <div>
                                        <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                                        <p className="text-sm text-gray-600">Add an extra layer of security</p>
                                    </div>
                                    <button className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                                        Enable 2FA
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Notification Settings */}
                        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <BellIcon className="w-6 h-6 text-primary-600" />
                                <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-200">
                                    <div>
                                        <h4 className="font-medium text-gray-900">Portfolio Alerts</h4>
                                        <p className="text-sm text-gray-600">Receive important portfolio updates</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" />
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
}