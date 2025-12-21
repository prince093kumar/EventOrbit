import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Bell, Search, User, Sun, Moon, Menu, LayoutDashboard, CalendarPlus, Activity, Users, IndianRupee, UserCheck, Ticket, LogOut, ChevronDown, Scan } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

const TopBar = ({ toggleSidebar }) => {
    const { isDarkMode, toggleTheme } = useTheme();
    const { user, logout, isAuthenticated } = useAuth();
    const { notifications, unreadCount, markAllRead } = useNotifications();

    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const notificationRef = useRef(null);
    const profileRef = useRef(null);
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState('');

    const navItems = [
        { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
        { path: '/create-event', label: 'Create Event', icon: <CalendarPlus size={18} /> },
        { path: '/live-monitor', label: 'Live', icon: <Activity size={18} /> },
        { path: '/attendees', label: 'Attendees', icon: <Users size={18} /> },
        { path: '/revenue', label: 'Revenue', icon: <IndianRupee size={18} /> },
        { path: '/kyc', label: 'KYC', icon: <UserCheck size={18} /> },
    ];

    // Click Outside Logic
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setShowProfileDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleNotificationClick = () => {
        setShowNotifications(!showNotifications);
    };

    const handleViewAllClick = () => {
        setShowNotifications(false);
        navigate('/notifications');
    };

    return (
        <header className="h-20 bg-[var(--bg-page)]/90 backdrop-blur-md border-b border-[var(--border-color)] sticky top-0 z-50 px-6 flex items-center gap-6 transition-all flex-shrink-0">

            {/* Logo Section */}
            <div className="flex items-center gap-2 min-w-fit">
                <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-[var(--text-page)]">
                    <Ticket className="text-yellow-500 fill-yellow-500" />
                    <span>EO<span className="text-yellow-500">GANIZER</span></span>
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
                    {/* Gate Entry Action */}
                    <Link
                        to="/scan"
                        className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors shadow-sm text-sm font-medium mr-2"
                    >
                        <Scan size={16} />
                        <span>Scan</span>
                    </Link>

                    <button onClick={toggleTheme} className="p-2 text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] rounded-full transition-colors">
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    {/* Notification Wrapper */}
                    <div className="relative" ref={notificationRef}>
                        <button
                            onClick={handleNotificationClick}
                            className="p-2 text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] rounded-full transition-colors relative"
                        >
                            <Bell size={20} />
                            {unreadCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-[var(--bg-page)]"></span>}
                        </button>

                        {/* Notifications Dropdown */}
                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-80 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                                <div className="px-4 py-2 border-b border-[var(--border-color)] flex justify-between items-center">
                                    <span className="font-bold text-sm text-[var(--text-page)]">Notifications</span>
                                    <button onClick={markAllRead} className="text-xs text-[#FFDA8A] cursor-pointer hover:underline">Mark all read</button>
                                </div>
                                <div className="max-h-64 overflow-y-auto">
                                    {notifications.length > 0 ? (
                                        notifications.slice(0, 5).map(n => (
                                            <div key={n.id} className={`px-4 py-3 hover:bg-[var(--bg-subtle)] border-b border-[var(--border-color)] last:border-0 cursor-pointer ${n.unread ? 'bg-[#FFDA8A]/5' : ''}`}>
                                                <p className={`text-sm ${n.unread ? 'font-semibold text-[var(--text-page)]' : 'text-[var(--text-muted)]'}`}>{n.text}</p>
                                                <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="px-4 py-8 text-center text-sm text-[var(--text-muted)]">
                                            No notifications
                                        </div>
                                    )}
                                </div>
                                <div className="px-4 py-2 border-t border-[var(--border-color)] text-center">
                                    <button
                                        onClick={handleViewAllClick}
                                        className="text-xs font-medium text-[var(--text-muted)] cursor-pointer hover:text-[var(--text-page)]"
                                    >
                                        View all notifications
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Auth Action & Profile Dropdown */}
                    <div className="relative pl-2 sm:pl-4 border-l border-[var(--border-color)]" ref={profileRef}>
                        {isAuthenticated ? (
                            <>
                                <button
                                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                                    className="flex items-center gap-2 pl-2 pr-2 sm:pr-4 py-1.5 rounded-full hover:bg-gray-50 dark:hover:bg-slate-800 border border-transparent hover:border-gray-100 dark:hover:border-slate-700 transition-all text-left"
                                >
                                    <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-tr from-[#FFDA8A] to-[#ffc107] rounded-full flex items-center justify-center text-white font-bold shadow-sm ring-2 ring-white dark:ring-slate-700 text-gray-800">
                                        {user?.fullName?.charAt(0) || user?.name?.charAt(0) || 'O'}
                                    </div>
                                    <div className="text-left hidden md:block">
                                        <p className="text-sm font-bold text-gray-700 dark:text-gray-200 leading-none">
                                            {user?.fullName || user?.name || 'Organizer'}
                                        </p>
                                    </div>
                                    <ChevronDown size={16} className={`hidden sm:block text-gray-400 transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Profile Dropdown */}
                                {showProfileDropdown && (
                                    <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-gray-100 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                                        <div className="px-4 py-3 border-b border-gray-50 dark:border-slate-800">
                                            <p className="text-sm font-bold text-[var(--text-page)]">Signed in as</p>
                                            <p className="text-sm text-[var(--text-muted)] truncate">{user?.email}</p>
                                        </div>
                                        <div className="p-1">
                                            <Link
                                                to="/profile"
                                                onClick={() => setShowProfileDropdown(false)}
                                                className="flex items-center gap-3 px-3 py-2 text-sm text-[var(--text-page)] hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                            >
                                                <User size={16} />
                                                Your Profile
                                            </Link>
                                        </div>
                                        <div className="p-1 border-t border-gray-50 dark:border-slate-800">
                                            <button
                                                onClick={() => {
                                                    logout();
                                                    setShowProfileDropdown(false);
                                                }}
                                                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-left"
                                            >
                                                <LogOut size={16} />
                                                Sign out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link
                                    to="/login"
                                    className="hidden sm:block px-4 py-2 text-sm font-medium text-[var(--text-page)] hover:bg-[var(--bg-subtle)] rounded-lg transition-all"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/signup"
                                    className="px-4 py-2 text-sm font-semibold bg-[#FFDA8A] hover:bg-[#ffc107] text-gray-900 rounded-lg transition-all shadow-sm"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TopBar;
