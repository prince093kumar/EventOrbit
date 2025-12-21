import React, { useState } from 'react';
import { Bell, Check, Clock, AlertCircle } from 'lucide-react';

const Notifications = () => {
    // Mock data - in a real app this would come from an API
    const [notifications, setNotifications] = useState([
        { id: 1, text: 'New event "Tech Summit 2025" pending approval', time: '5 min ago', type: 'alert', isRead: false },
        { id: 2, text: 'Organizer "John Doe" registered', time: '1 hour ago', type: 'info', isRead: false },
        { id: 3, text: 'Monthly revenue report available', time: '2 hours ago', type: 'success', isRead: true },
        { id: 4, text: 'Server maintenance scheduled for midnight', time: '5 hours ago', type: 'alert', isRead: true },
        { id: 5, text: 'New user registration spike detected', time: '1 day ago', type: 'info', isRead: true },
        { id: 6, text: 'Event "Music Fest" ticket sales exceeded 1000', time: '2 days ago', type: 'success', isRead: true },
    ]);

    const markAsRead = (id) => {
        setNotifications(notifications.map(n =>
            n.id === id ? { ...n, isRead: true } : n
        ));
    };

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    };

    const getIcon = (type) => {
        switch (type) {
            case 'alert': return <AlertCircle className="w-5 h-5 text-red-500" />;
            case 'success': return <Check className="w-5 h-5 text-green-500" />;
            default: return <Bell className="w-5 h-5 text-blue-500" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Notifications</h2>
                <button
                    onClick={markAllRead}
                    className="px-4 py-2 text-sm font-medium text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/10 hover:bg-yellow-100 dark:hover:bg-yellow-900/20 rounded-lg transition-colors"
                >
                    Mark all as read
                </button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                {notifications.length > 0 ? (
                    <div className="divide-y divide-slate-200 dark:divide-slate-700">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`p-4 flex items-start gap-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50 ${!notification.isRead ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                            >
                                <div className={`p-2 rounded-full flex-shrink-0 bg-slate-50 dark:bg-slate-900`}>
                                    {getIcon(notification.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <p className={`text-sm ${!notification.isRead ? 'font-semibold' : 'font-medium'} text-slate-900 dark:text-white`}>
                                            {notification.text}
                                        </p>
                                        <span className="flex items-center text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap ml-4">
                                            <Clock className="w-3 h-3 mr-1" />
                                            {notification.time}
                                        </span>
                                    </div>
                                    <div className="mt-1 flex gap-2">
                                        {!notification.isRead && (
                                            <button
                                                onClick={() => markAsRead(notification.id)}
                                                className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                                            >
                                                Mark as read
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center text-slate-500 dark:text-slate-400">
                        <Bell className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>No notifications found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
