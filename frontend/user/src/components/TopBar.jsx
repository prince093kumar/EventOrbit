import React, { useState } from 'react';
import { Search, Filter, Bell, User, LogOut, ChevronDown, Moon, Sun, LayoutDashboard, Ticket, Wallet, Star, Menu, X } from 'lucide-react';
import { Link, useNavigate, NavLink, useLocation, useSearchParams } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { searchEvents } from '../api/eventApi';

const TopBar = () => {
    const { isDarkMode, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: 1, title: 'Ticket Confirmed', message: 'Your booking for Neon Nights is confirmed.', time: '2m ago', read: false },
        { id: 2, title: 'Event Reminder', message: 'Global AI Summit starts tomorrow at 9 AM.', time: '1h ago', read: false },
        { id: 3, title: 'Wallet Updated', message: '₹5,000 added to your wallet successfully.', time: '5h ago', read: false }
    ]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const clearNotifications = () => {
        setNotifications([]);
        setIsNotificationsOpen(false);
    };

    const navItems = [
        { path: '/', label: 'Browse', icon: <LayoutDashboard size={18} /> },
        { path: '/my-tickets', label: 'My Tickets', icon: <Ticket size={18} /> },
        { path: '/wallet', label: 'Wallet', icon: <Wallet size={18} /> },
        { path: '/reviews', label: 'Reviews', icon: <Star size={18} /> },
    ];

    // Search Logic
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = React.useRef(null);
    const profileRef = React.useRef(null);

    const handleSearchCheck = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.trim()) {
            try {
                const results = await searchEvents(query);
                if (Array.isArray(results)) {
                    setSuggestions(results.slice(0, 5));
                    setShowSuggestions(true);
                } else {
                    setSuggestions([]);
                }
            } catch (error) {
                console.error("Search error:", error);
                setSuggestions([]);
            }
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (title) => {
        setSearchQuery(title);
        setShowSuggestions(false);
        navigate(`/?search=${encodeURIComponent(title)}`);
    };

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Debounce Search - Update URL after 500ms of no typing
    React.useEffect(() => {
        const timer = setTimeout(() => {
            // Don't update if it matches URL already (prevents loop)
            if (searchQuery === (searchParams.get('search') || '')) return;

            if (searchQuery) {
                if (location.pathname !== '/') {
                    navigate(`/?search=${encodeURIComponent(searchQuery)}`);
                } else {
                    setSearchParams(prev => {
                        prev.set('search', searchQuery);
                        return prev;
                    }, { replace: true });
                }
            } else {
                if (location.pathname === '/') {
                    setSearchParams(prev => {
                        prev.delete('search');
                        return prev;
                    }, { replace: true });
                }
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery, location.pathname, navigate, setSearchParams, searchParams]);

    // Sync local state with URL param on mount/update
    React.useEffect(() => {
        setSearchQuery(searchParams.get('search') || '');
    }, [searchParams]);

    return (
        <header className="h-20 bg-[var(--topbar-bg)] backdrop-blur-md border-b border-[var(--border-color)] fixed top-0 w-full z-50 transition-all">
            <div className="container mx-auto px-4 h-full flex items-center justify-between gap-4">

                {/* Logo Section */}
                <div className="flex items-center gap-2 min-w-fit">
                    <Link to="/" className="text-2xl font-bold text-[#FFDA8A] flex items-center gap-2">
                        <Ticket className="fill-[#FFDA8A] text-[#FFDA8A]" />
                        <span className="hidden sm:block text-gray-800 dark:text-white">EventOrbit</span>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? 'bg-[#FFDA8A]/10 text-[#FFDA8A]'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'
                                }`
                            }
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Search Bar */}
                {/* Search Bar */}
                <div ref={searchRef} className="relative hidden md:block flex-1 max-w-md">
                    <div className="flex items-center gap-4 bg-gray-50/50 dark:bg-slate-800/50 p-1.5 rounded-xl border border-gray-100 dark:border-slate-700 focus-within:bg-white dark:focus-within:bg-slate-800 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 transition-all">
                        <Search className="text-gray-400 ml-2" size={20} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchCheck}
                            onFocus={() => { if (searchQuery.trim()) setShowSuggestions(true); }}
                            placeholder="Search events..."
                            className="w-full bg-transparent border-none focus:outline-none text-[var(--text-page)] placeholder-gray-400 text-sm"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setSuggestions([]);
                                    // Normally the debounce handles the URL, but for immediate UI feedback we can just clear state
                                    // and let the debounce effect or a direct effect handle the URL if needed.
                                    // Actually, let's force update URL here for responsiveness.
                                    if (location.pathname === '/') {
                                        setSearchParams(prev => {
                                            prev.delete('search');
                                            return prev;
                                        }, { replace: true });
                                    }
                                }}
                                className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-full text-gray-400 transition-colors"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    {/* Suggestions Dropdown */}
                    {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute top-full left-0 w-full mt-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            {suggestions.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => handleSuggestionClick(item.title)}
                                    className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors border-b border-[var(--border-color)] last:border-0 flex justify-between items-center group"
                                >
                                    <div>
                                        <p className="text-sm font-medium text-[var(--text-page)]">{item.title}</p>
                                        <p className="text-xs text-[var(--text-muted)]">{item.category} • {item.location}</p>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[#FFDA8A]">
                                        <ChevronDown size={16} className="-rotate-90" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-3 sm:gap-4">
                    <button
                        onClick={toggleTheme}
                        className="p-2 text-gray-500 hover:text-[#FFDA8A] hover:bg-[#FFDA8A]/10 rounded-full transition-colors"
                    >
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    <Link to="/wallet" className="p-2 text-gray-500 hover:text-[#FFDA8A] hover:bg-[#FFDA8A]/10 rounded-full transition-colors lg:hidden">
                        <Wallet size={20} />
                    </Link>

                    <div className="relative">
                        <button
                            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                            className="relative p-2 text-gray-500 hover:text-[#FFDA8A] hover:bg-[#FFDA8A]/10 rounded-full transition-colors hidden sm:block"
                        >
                            <Bell size={20} />
                            {notifications.length > 0 && (
                                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                            )}
                        </button>

                        {isNotificationsOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setIsNotificationsOpen(false)}></div>
                                <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-gray-100 dark:border-slate-800 py-2 z-20 animate-in fade-in zoom-in-95 duration-200">
                                    <div className="px-4 py-3 border-b border-gray-50 dark:border-slate-800 flex justify-between items-center">
                                        <p className="text-sm font-bold text-[var(--text-page)]">Notifications</p>
                                        {notifications.length > 0 && (
                                            <button onClick={clearNotifications} className="text-xs text-[#FFDA8A] hover:underline">
                                                Clear all
                                            </button>
                                        )}
                                    </div>
                                    <div className="max-h-80 overflow-y-auto">
                                        {notifications.length > 0 ? (
                                            notifications.map(notif => (
                                                <div key={notif.id} className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors border-b border-gray-50 dark:border-slate-800 last:border-0 cursor-pointer">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <p className="text-sm font-semibold text-[var(--text-page)]">{notif.title}</p>
                                                        <span className="text-xs text-[var(--text-muted)]">{notif.time}</span>
                                                    </div>
                                                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">{notif.message}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="px-4 py-8 text-center text-gray-400">
                                                <Bell size={24} className="mx-auto mb-2 opacity-50" />
                                                <p className="text-sm">No new notifications</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* User Profile Dropdown */}
                    <div ref={profileRef} className="relative">
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-2 pl-2 pr-2 sm:pr-4 py-1.5 rounded-full hover:bg-gray-50 dark:hover:bg-slate-800 border border-transparent hover:border-gray-100 dark:hover:border-slate-700 transition-all"
                        >
                            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-tr from-[#FFDA8A] to-[#ffc107] rounded-full flex items-center justify-center text-white font-bold shadow-sm ring-2 ring-white dark:ring-slate-700 text-gray-800">
                                {user ? (user.fullName?.charAt(0) || user.name?.charAt(0) || 'U') : <User size={18} />}
                            </div>
                            <div className="text-left hidden md:block">
                                <p className="text-sm font-bold text-gray-700 dark:text-gray-200 leading-none">
                                    {user ? (user.fullName || user.name) : 'Guest'}
                                </p>
                            </div>
                            <ChevronDown size={16} className={`hidden sm:block text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isProfileOpen && (
                            <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-gray-100 dark:border-slate-800 py-2 z-20 animate-in fade-in zoom-in-95 duration-200">
                                {user ? (
                                    <>
                                        <div className="px-4 py-3 border-b border-gray-50 dark:border-slate-800">
                                            <p className="text-sm font-bold text-[var(--text-page)]">Signed in as</p>
                                            <p className="text-sm text-[var(--text-muted)] truncate">{user.email}</p>
                                        </div>
                                        <div className="p-1">
                                            <Link to="/profile" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm text-[var(--text-page)] hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
                                                <User size={16} /> Your Profile
                                            </Link>

                                        </div>
                                        <div className="p-1 border-t border-gray-50 dark:border-slate-800">
                                            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-left">
                                                <LogOut size={16} /> Sign out
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="px-4 py-3 border-b border-gray-50 dark:border-slate-800">
                                            <p className="text-sm font-bold text-[var(--text-page)]">Welcome, Guest!</p>
                                            <p className="text-xs text-[var(--text-muted)]">Join us to book tickets.</p>
                                        </div>
                                        <div className="p-1">
                                            <Link to="/login" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm text-[var(--text-page)] hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
                                                <User size={16} /> Sign In
                                            </Link>
                                            <Link to="/signup" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                                                <User size={16} /> Create Account
                                            </Link>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="lg:hidden p-2 text-gray-500 hover:bg-gray-50 rounded-lg"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="lg:hidden fixed top-20 left-0 w-full h-[calc(100vh-80px)] bg-[var(--bg-page)] border-t border-[var(--border-color)] p-4 flex flex-col gap-4 overflow-y-auto z-40 animate-in slide-in-from-top-4 duration-200">
                    {/* Mobile Search */}
                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-slate-800 p-3 rounded-xl border border-gray-100 dark:border-slate-700">
                        <Search className="text-gray-400" size={20} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchCheck} // Reused handler for mobile
                            placeholder="Search events..."
                            className="w-full bg-transparent border-none focus:outline-none text-[var(--text-page)]"
                        />
                    </div>

                    <nav className="flex flex-col space-y-2">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-4 px-4 py-4 rounded-xl text-base font-medium transition-colors ${isActive
                                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                        : 'text-[var(--text-page)] hover:bg-gray-50 dark:hover:bg-slate-800'
                                    }`
                                }
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    );
};

export default TopBar;
