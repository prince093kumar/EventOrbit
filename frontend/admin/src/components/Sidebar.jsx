import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, Users, Briefcase, Settings, LogOut, Ticket } from 'lucide-react';

const Sidebar = () => {
    const location = useLocation();

    const navigation = [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard },
        { name: 'Events', href: '/events', icon: Calendar },
        { name: 'Organizers', href: '/organizers', icon: Briefcase },
        { name: 'Users', href: '/users', icon: Users },
        { name: 'Settings', href: '/settings', icon: Settings },
    ];

    return (
        <div className="flex flex-col w-64 bg-[var(--bg-sidebar)] border-r border-[var(--border-color)] transition-colors duration-200">
            <div className="flex items-center justify-center h-20 border-b border-[var(--border-color)]">
                <div className="flex items-center gap-2 font-bold text-2xl text-[var(--text-page)]">
                    <Ticket className="text-yellow-500 fill-yellow-500" />
                    <span>EO<span className="text-yellow-500">Admin</span></span>
                </div>
            </div>

            <div className="flex flex-col flex-1 px-2 py-4 space-y-1">
                {navigation.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${isActive
                                ? 'bg-[var(--bg-sidebar-active)] text-[var(--text-sidebar-active)]'
                                : 'text-[var(--text-sidebar)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-page)]'
                                }`}
                        >
                            <item.icon className="w-5 h-5 mr-3" />
                            {item.name}
                        </Link>
                    );
                })}
            </div>

            <div className="p-4 border-t border-[var(--border-color)]">
                <button className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                    <LogOut className="w-5 h-5 mr-3" />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
