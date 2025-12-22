import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, Search, LayoutDashboard, Calendar, Users, Briefcase, Sun, Moon, Settings, LogOut, User, Ticket, ChevronDown, Star } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const { logout, user } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: 1, text: 'New event "Tech Summit 2025" pending approval', time: '5 min ago', isRead: false },
        { id: 2, text: 'Organizer "John Doe" registered', time: '1 hour ago', isRead: false },
        { id: 3, text: 'Monthly revenue report available', time: '2 hours ago', isRead: true },
    ]);
    const adminInfo = user || {
        fullName: 'Admin User',
        email: 'admin@eventorbit.com'
    };

    const dropdownRef = useRef(null);
    const notificationRef = useRef(null);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const toggleNotifications = () => {
        setIsNotificationsOpen(!isNotificationsOpen);
        if (!isNotificationsOpen) {
            // Mark all as read when opening (optional, or just hide dot)
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        }
    };

    const handleViewAllNotifications = () => {
        setIsNotificationsOpen(false);
        navigate('/notifications');
    };

    const handleLogout = () => {
        logout();
        setIsDropdownOpen(false);
        navigate('/login');
    };

    useEffect(() => {
        // Fetch logic omitted as context is primary source now
        /*
        const fetchAdminProfile = async () => {
            try {
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                const response = await axios.get(`${API_URL}/api/admin/profile`);
                if (response.data) {
                    setAdminInfo(response.data);
                }
            } catch (error) {
                console.error("Error fetching admin profile:", error);
            }
        };
        fetchAdminProfile();
        */

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setIsNotificationsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const navigation = [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard },
        { name: 'Events', href: '/events', icon: Calendar },
        { name: 'Organizers', href: '/organizers', icon: Briefcase },
        { name: 'Users', href: '/users', icon: Users },
        { name: 'Reviews', href: '/reviews', icon: Star },
    ];

    return (
        <header className="h-20 bg-[var(--bg-page)]/90 backdrop-blur-md border-b border-[var(--border-color)] sticky top-0 z-50 px-6 flex items-center gap-6 transition-all flex-shrink-0">
            {/* Logo Section */}
            <div className="flex items-center gap-2 min-w-fit mr-8">
                <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-[var(--text-page)]">
                    <Ticket className="text-yellow-500 fill-yellow-500" />
                    <span>EO<span className="text-yellow-500">Admin</span></span>
                </Link>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 flex-1">
                {navigation.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${isActive
                                ? 'bg-[#FFDA8A]/20 text-orange-600 dark:text-yellow-400'
                                : 'text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-page)]'
                                }`}
                        >
                            <item.icon size={18} />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3 sm:gap-4 ml-auto lg:ml-0">
                {/* Search (Compact) */}
                <div className="hidden xl:flex items-center gap-2 bg-white dark:bg-slate-800 px-3 py-2 rounded-lg border border-[var(--border-color)] w-64 focus-within:ring-2 focus-within:ring-yellow-400/50 transition-all">
                    <Search size={16} className="text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search events..."
                        className="bg-transparent border-none outline-none text-[var(--text-page)] placeholder-gray-400 w-full text-xs font-medium"
                    />
                </div>

                <div className="flex items-center gap-2 relative">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] rounded-full transition-colors"
                        title="Toggle Theme"
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    {/* Notifications */}
                    <div className="relative" ref={notificationRef}>
                        <button
                            onClick={toggleNotifications}
                            className="p-2 text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] rounded-full transition-colors relative"
                        >
                            <Bell size={20} />
                            {unreadCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-[var(--bg-page)]"></span>}
                        </button>

                        {isNotificationsOpen && (
                            <div className="absolute right-0 mt-2 w-80 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                                <div className="px-4 py-2 border-b border-[var(--border-color)] flex justify-between items-center">
                                    <span className="font-bold text-sm text-[var(--text-page)]">Notifications</span>
                                </div>
                                <div className="max-h-64 overflow-y-auto">
                                    {notifications.length > 0 ? (
                                        notifications.map((n) => (
                                            <div key={n.id} className={`px-4 py-3 hover:bg-[var(--bg-subtle)] border-b border-[var(--border-color)] last:border-0 cursor-pointer ${!n.isRead ? 'bg-[#FFDA8A]/5' : ''}`}>
                                                <p className={`text-sm ${!n.isRead ? 'font-semibold text-[var(--text-page)]' : 'text-[var(--text-muted)]'}`}>{n.text}</p>
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
                                        onClick={handleViewAllNotifications}
                                        className="text-xs font-medium text-[var(--text-muted)] cursor-pointer hover:text-[var(--text-page)]"
                                    >
                                        View all notifications
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Profile Dropdown */}
                    <div className="relative pl-2 sm:pl-4 border-l border-[var(--border-color)]" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-2 pl-2 pr-2 sm:pr-4 py-1.5 rounded-full hover:bg-gray-50 dark:hover:bg-slate-800 border border-transparent hover:border-gray-100 dark:hover:border-slate-700 transition-all text-left"
                        >
                            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-tr from-[#FFDA8A] to-[#ffc107] rounded-full flex items-center justify-center text-white font-bold shadow-sm ring-2 ring-white dark:ring-slate-700 text-gray-800">
                                {adminInfo.fullName ? adminInfo.fullName.charAt(0).toUpperCase() : 'A'}
                            </div>
                            <div className="text-left hidden md:block">
                                <p className="text-sm font-bold text-gray-700 dark:text-gray-200 leading-none">
                                    {adminInfo.fullName || 'Admin'}
                                </p>
                            </div>
                            <ChevronDown size={16} className={`hidden sm:block text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-gray-100 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                                <div className="px-4 py-3 border-b border-gray-50 dark:border-slate-800">
                                    <p className="text-sm font-bold text-[var(--text-page)]">Signed in as</p>
                                    <p className="text-sm text-[var(--text-muted)] truncate">{adminInfo.email}</p>
                                </div>
                                <div className="p-1">
                                    <Link
                                        to="/profile"
                                        onClick={() => setIsDropdownOpen(false)}
                                        className="flex items-center gap-3 px-3 py-2 text-sm text-[var(--text-page)] hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                    >
                                        <User size={16} />
                                        Your Profile
                                    </Link>
                                    <Link
                                        to="/settings"
                                        onClick={() => setIsDropdownOpen(false)}
                                        className="flex items-center gap-3 px-3 py-2 text-sm text-[var(--text-page)] hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                    >
                                        <Settings size={16} />
                                        Settings
                                    </Link>
                                </div>
                                <div className="p-1 border-t border-gray-50 dark:border-slate-800">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-left"
                                    >
                                        <LogOut size={16} />
                                        Sign out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
