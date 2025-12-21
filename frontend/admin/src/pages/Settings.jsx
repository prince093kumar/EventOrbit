import React, { useState } from 'react';
import axios from 'axios';
import { Settings as SettingsIcon, Bell, Globe, Shield, Save, Monitor } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Settings = () => {
    const { theme, toggleTheme } = useTheme();
    const [activeTab, setActiveTab] = useState('general');

    // Mock State for Settings
    const [settings, setSettings] = useState({
        siteName: 'EventOrbit Admin',
        supportEmail: 'support@eventorbit.com',
        timezone: 'UTC-5 (Eastern Time)',
        emailAlerts: true,
        pushNotifications: false,
        maintenanceMode: false
    });

    const handleToggle = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Platform Settings</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Navigation Sidebar */}
                <div className="md:col-span-1">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <nav className="flex flex-col">
                            <button
                                onClick={() => setActiveTab('general')}
                                className={`flex items-center px-6 py-4 text-sm font-medium transition-colors border-l-4 ${activeTab === 'general' ? 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 border-violet-600' : 'border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                            >
                                <Globe className="w-5 h-5 mr-3" />
                                General
                            </button>
                            <button
                                onClick={() => setActiveTab('notifications')}
                                className={`flex items-center px-6 py-4 text-sm font-medium transition-colors border-l-4 ${activeTab === 'notifications' ? 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 border-violet-600' : 'border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                            >
                                <Bell className="w-5 h-5 mr-3" />
                                Notifications
                            </button>
                            <button
                                onClick={() => setActiveTab('system')}
                                className={`flex items-center px-6 py-4 text-sm font-medium transition-colors border-l-4 ${activeTab === 'system' ? 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 border-violet-600' : 'border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                            >
                                <Monitor className="w-5 h-5 mr-3" />
                                System
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Content Area */}
                <div className="md:col-span-2">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 min-h-[500px]">

                        {/* General Settings */}
                        {activeTab === 'general' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">General Information</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Basic details about the admin platform.</p>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Site Name</label>
                                        <input
                                            type="text"
                                            value={settings.siteName}
                                            onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-violet-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Support Email</label>
                                        <input
                                            type="email"
                                            value={settings.supportEmail}
                                            onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-violet-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Default Timezone</label>
                                        <select
                                            value={settings.timezone}
                                            onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-violet-500"
                                        >
                                            <option>UTC-5 (Eastern Time)</option>
                                            <option>UTC-8 (Pacific Time)</option>
                                            <option>UTC+0 (GMT)</option>
                                            <option>UTC+5:30 (IST)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Notification Settings */}
                        {activeTab === 'notifications' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Notification Preferences</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Manage how you receive alerts.</p>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                                        <div>
                                            <p className="font-medium text-slate-900 dark:text-white">Email Alerts</p>
                                            <p className="text-xs text-slate-500">Receive daily summaries and critical alerts.</p>
                                        </div>
                                        <button
                                            onClick={() => handleToggle('emailAlerts')}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${settings.emailAlerts ? 'bg-violet-600' : 'bg-slate-300 dark:bg-slate-600'}`}
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.emailAlerts ? 'translate-x-6' : 'translate-x-1'}`} />
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                                        <div>
                                            <p className="font-medium text-slate-900 dark:text-white">Push Notifications</p>
                                            <p className="text-xs text-slate-500">Get real-time updates on your browser.</p>
                                        </div>
                                        <button
                                            onClick={() => handleToggle('pushNotifications')}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${settings.pushNotifications ? 'bg-violet-600' : 'bg-slate-300 dark:bg-slate-600'}`}
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.pushNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* System Settings */}
                        {activeTab === 'system' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">System Configuration</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Advanced settings for the platform.</p>
                                </div>

                                <div className="p-4 border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 rounded-lg space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-red-700 dark:text-red-400">Maintenance Mode</p>
                                            <p className="text-xs text-red-600/80 dark:text-red-400/70">Prevent users from accessing the platform.</p>
                                        </div>
                                        <button
                                            onClick={() => handleToggle('maintenanceMode')}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${settings.maintenanceMode ? 'bg-red-600' : 'bg-slate-300 dark:bg-slate-600'}`}
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'}`} />
                                        </button>
                                    </div>

                                    <div className="border-t border-red-200 dark:border-red-900/30 pt-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-red-700 dark:text-red-400">Clear Database</p>
                                                <p className="text-xs text-red-600/80 dark:text-red-400/70">Permanently delete all Users, Events, and Bookings.</p>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    if (window.confirm("ARE YOU SURE? This will delete ALL data (Users, Events, Bookings) permanently. This action cannot be undone.")) {
                                                        axios.delete('http://localhost:5000/api/admin/clear-database')
                                                            .then(() => alert("Database cleared successfully!"))
                                                            .catch(err => alert("Failed to clear database: " + err.message));
                                                    }
                                                }}
                                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors"
                                            >
                                                Delete All Data
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                                    <h4 className="font-medium text-slate-900 dark:text-white">Appearance</h4>
                                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                                        <div>
                                            <p className="font-medium text-slate-900 dark:text-white">Dark Mode</p>
                                            <p className="text-xs text-slate-500">Toggle the dark theme for the admin panel.</p>
                                        </div>
                                        <button
                                            onClick={toggleTheme}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${theme === 'dark' ? 'bg-violet-600' : 'bg-slate-300 dark:bg-slate-600'}`}
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 flex justify-end">
                            <button className="flex items-center px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors">
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
