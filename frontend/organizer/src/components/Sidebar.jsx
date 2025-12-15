import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CalendarPlus, Activity, Users, DollarSign, UserCheck, LogOut, Ticket } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { logout } = useAuth();

    const navItems = [
        { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/create-event', label: 'Create Event', icon: <CalendarPlus size={20} /> },
        { path: '/live-monitor', label: 'Live Monitor', icon: <Activity size={20} /> },
        { path: '/attendees', label: 'Attendees', icon: <Users size={20} /> },
        { path: '/revenue', label: 'Revenue', icon: <DollarSign size={20} /> },
        { path: '/profile', label: 'Profile (KYC)', icon: <UserCheck size={20} /> },
    ];

    return (
        <aside className="h-full flex flex-col bg-[var(--bg-sidebar)] transition-colors">
            {/* Logo */}
            <div className="h-20 flex items-center px-6 border-b border-[var(--border-color)]">
                <div className="flex items-center gap-2 font-bold text-2xl text-[var(--text-page)]">
                    <Ticket className="text-yellow-500 fill-yellow-500" />
                    <span>EO<span className="text-yellow-500">Admin</span></span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive
                                ? 'bg-[#FFDA8A]/20 text-orange-600 dark:text-yellow-400'
                                : 'text-[var(--text-sidebar)] hover:bg-gray-100 dark:hover:bg-slate-800'
                            }`
                        }
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* User / Logout */}
            <div className="p-4 border-t border-[var(--border-color)]">
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors font-medium"
                >
                    <LogOut size={20} />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
