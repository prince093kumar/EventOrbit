import React, { useState } from 'react';
import { Bell, CheckCircle, Clock, Filter, Trash2 } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

const Notifications = () => {
    const { notifications, markAllRead, markAsRead, unreadCount } = useNotifications();
    const [filter, setFilter] = useState('all'); // 'all', 'unread'

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'unread') return n.unread;
        return true;
    });

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--text-page)]">Notifications</h1>
                    <p className="text-[var(--text-muted)] mt-1">Stay updated with your latest alerts and activities.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={markAllRead}
                        className="px-4 py-2 text-sm font-medium text-[var(--text-page)] bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-subtle)] transition-colors flex items-center gap-2"
                    >
                        <CheckCircle size={16} className="text-green-500" />
                        Mark all read
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 border-b border-[var(--border-color)] pb-1">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-all ${filter === 'all'
                            ? 'border-[#FFDA8A] text-[#FFDA8A]'
                            : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-page)]'
                        }`}
                >
                    All
                </button>
                <button
                    onClick={() => setFilter('unread')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-all flex items-center gap-2 ${filter === 'unread'
                            ? 'border-[#FFDA8A] text-[#FFDA8A]'
                            : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-page)]'
                        }`}
                >
                    Unread
                    {unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{unreadCount}</span>
                    )}
                </button>
            </div>

            {/* List */}
            <div className="space-y-3">
                {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((notif) => (
                        <div
                            key={notif.id}
                            onClick={() => markAsRead(notif.id)}
                            className={`group p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-4 ${notif.unread
                                    ? 'bg-white dark:bg-slate-800 border-l-4 border-l-[#FFDA8A] border-y-[var(--border-color)] border-r-[var(--border-color)] shadow-sm'
                                    : 'bg-[var(--bg-card)] border-[var(--border-color)] opacity-75 hover:opacity-100'
                                }`}
                        >
                            <div className={`p-2 rounded-full flex-shrink-0 ${notif.unread ? 'bg-[#FFDA8A]/10 text-orange-600 dark:text-yellow-400' : 'bg-gray-100 dark:bg-slate-700 text-gray-400'}`}>
                                <Bell size={20} />
                            </div>
                            <div className="flex-1">
                                <p className={`text-sm ${notif.unread ? 'font-semibold text-[var(--text-page)]' : 'text-[var(--text-page)]'}`}>
                                    {notif.text}
                                </p>
                                <div className="flex items-center gap-4 mt-1.5">
                                    <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                                        <Clock size={12} /> {notif.time}
                                    </span>
                                    {notif.unread && (
                                        <span className="text-[10px] font-bold text-orange-600 dark:text-yellow-400 bg-orange-50 dark:bg-yellow-900/20 px-2 py-0.5 rounded-full">
                                            NEW
                                        </span>
                                    )}
                                </div>
                            </div>
                            {notif.unread && (
                                <div className="self-center">
                                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl border-dashed">
                        <div className="w-16 h-16 bg-[var(--bg-subtle)] rounded-full flex items-center justify-center mx-auto mb-4 text-[var(--text-muted)]">
                            <Bell size={24} />
                        </div>
                        <h3 className="text-lg font-medium text-[var(--text-page)]">No notifications</h3>
                        <p className="text-[var(--text-muted)] text-sm">You're all caught up!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
