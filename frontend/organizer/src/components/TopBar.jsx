import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Bell, Search, User, Sun, Moon, Menu, LayoutDashboard, CalendarPlus, Activity, Users, IndianRupee, UserCheck, Ticket, LogOut } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const TopBar = ({ toggleSidebar }) => {
    const { isDarkMode, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
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

                <div className="flex items-center gap-2">
                    <button onClick={toggleTheme} className="p-2 text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] rounded-full transition-colors">
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    <button className="p-2 text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] rounded-full transition-colors relative">
                        <Bell size={20} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-[var(--bg-page)]"></span>
                    </button>

                    <button onClick={logout} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-full transition-colors" title="Sign Out">
                        <LogOut size={20} />
                    </button>
                </div>

                {/* Profile Avatar */}
                <div className="hidden sm:flex items-center gap-3 border-l border-[var(--border-color)] pl-4">
                    <div className="text-right">
                        <p className="text-xs font-bold text-[var(--text-page)]">{user?.name || 'Organizer'}</p>
                        <p className="text-[10px] text-[var(--text-muted)]">Admin</p>
                    </div>
                    <div className="w-9 h-9 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                        {user?.name?.charAt(0) || 'O'}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TopBar;
