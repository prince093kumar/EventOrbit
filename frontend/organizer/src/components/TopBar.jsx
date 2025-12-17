import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Bell, Search, User, Sun, Moon, Menu, LayoutDashboard, CalendarPlus, Activity, Users, IndianRupee, UserCheck, Ticket, LogOut } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const TopBar = ({ toggleSidebar }) => {
    const { isDarkMode, toggleTheme } = useTheme();
    const { user, logout, isAuthenticated } = useAuth();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);

    // Dummy Notifications
    const notifications = [
        { id: 1, text: "New ticket sold for 'Tech Submit 2025'", time: "2 min ago", unread: true },
        { id: 2, text: "Event 'Jazz Night' was approved", time: "1 hr ago", unread: false },
        { id: 3, text: "Payout of ₹45,000 processed", time: "1 day ago", unread: false },
    ];

    const [searchQuery, setSearchQuery] = useState('');

    const navItems = [
        { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
        { path: '/create-event', label: 'Create Event', icon: <CalendarPlus size={18} /> },
        { path: '/live-monitor', label: 'Live', icon: <Activity size={18} /> },
        { path: '/attendees', label: 'Attendees', icon: <Users size={18} /> },
        { path: '/revenue', label: 'Revenue', icon: <IndianRupee size={18} /> },
        { path: '/profile', label: 'KYC', icon: <UserCheck size={18} /> },
    ];

    return (
        <header className="h-20 bg-[var(--bg-page)]/90 backdrop-blur-md border-b border-[var(--border-color)] sticky top-0 z-50 px-6 flex items-center gap-6 transition-all flex-shrink-0">


            {/* Logo Section */}
            <div className="flex items-center gap-2 min-w-fit">
                <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-[var(--text-page)]">
                    <Ticket className="text-yellow-500 fill-yellow-500" />
                    <span>EO<span className="text-yellow-500">Admin</span></span>
                </Link>
            </div>

            {/* Navigation (Desktop) */}
            <nav className="hidden lg:flex items-center gap-1 flex-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${isActive
                                ? 'bg-[#FFDA8A]/20 text-orange-600 dark:text-yellow-400'
                                : 'text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-page)]'
                            }`
                        }
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Mobile Toggle */}
            <button onClick={toggleSidebar} className="lg:hidden p-2 text-[var(--text-muted)] ml-auto">
                <Menu size={24} />
            </button>

            {/* Actions */}
            <div className="flex items-center gap-3 sm:gap-4 ml-auto lg:ml-0">
                {/* Search (Compact) */}
                <div className="hidden xl:flex items-center gap-2 bg-white dark:bg-slate-800 px-3 py-2 rounded-lg border border-[var(--border-color)] w-64 focus-within:ring-2 focus-within:ring-yellow-400/50 transition-all">
                    <Search size={16} className="text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent border-none outline-none text-[var(--text-page)] placeholder-gray-400 w-full text-xs font-medium"
                    />
                </div>

                <div className="flex items-center gap-2 relative">
                    <button onClick={toggleTheme} className="p-2 text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] rounded-full transition-colors">
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="p-2 text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] rounded-full transition-colors relative"
                        >
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-[var(--bg-page)]"></span>
                        </button>

                        {/* Notifications Dropdown */}
                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-80 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                                <div className="px-4 py-2 border-b border-[var(--border-color)] flex justify-between items-center">
                                    <span className="font-bold text-sm text-[var(--text-page)]">Notifications</span>
                                    <span className="text-xs text-[#FFDA8A] cursor-pointer hover:underline">Mark all read</span>
                                </div>
                                <div className="max-h-64 overflow-y-auto">
                                    {notifications.map(n => (
                                        <div key={n.id} className={`px-4 py-3 hover:bg-[var(--bg-subtle)] border-b border-[var(--border-color)] last:border-0 cursor-pointer ${n.unread ? 'bg-[#FFDA8A]/5' : ''}`}>
                                            <p className={`text-sm ${n.unread ? 'font-semibold text-[var(--text-page)]' : 'text-[var(--text-muted)]'}`}>{n.text}</p>
                                            <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="px-4 py-2 border-t border-[var(--border-color)] text-center">
                                    <span className="text-xs font-medium text-[var(--text-muted)] cursor-pointer hover:text-[var(--text-page)]">View all notifications</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Auth Action & Profile Dropdown */}
                    {isAuthenticated ? (
                        <div className="relative pl-4 border-l border-[var(--border-color)]">
                            <button
                                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                                className="flex items-center gap-3 hover:bg-[var(--bg-subtle)] p-2 rounded-lg transition-colors text-left"
                            >
                                <div className="hidden sm:block">
                                    <p className="text-xs font-bold text-[var(--text-page)]">
                                        {user?.fullName || 'Organizer'}
                                    </p>
                                    <p className="text-[10px] text-[var(--text-muted)]">Organizer</p>
                                </div>
                                <div className="w-9 h-9 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                                    {user?.fullName?.charAt(0) || 'O'}
                                </div>
                            </button>

                            {/* Profile Dropdown */}
                            {showProfileDropdown && (
                                <div className="absolute right-0 mt-2 w-56 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-200">
                                    <div className="px-4 py-3 border-b border-[var(--border-color)]">
                                        <p className="text-xs text-[var(--text-muted)]">Signed in as</p>
                                        <p className="text-sm font-bold text-[var(--text-page)] truncate">{user?.email}</p>
                                    </div>
                                    <div className="py-1">
                                        <Link
                                            to="/profile"
                                            onClick={() => setShowProfileDropdown(false)}
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--text-page)] hover:bg-[var(--bg-subtle)]"
                                        >
                                            <User size={16} />
                                            Your Profile
                                        </Link>
                                    </div>
                                    <div className="py-1 border-t border-[var(--border-color)]">
                                        <button
                                            onClick={() => {
                                                logout();
                                                setShowProfileDropdown(false);
                                            }}
                                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 text-left"
                                        >
                                            <LogOut size={16} />
                                            Sign out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="pl-4 border-l border-[var(--border-color)]">
                            <Link to="/login" className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                                Login
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default TopBar;
