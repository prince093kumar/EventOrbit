import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([
        { id: 1, text: "New ticket sold for 'Tech Submit 2025'", time: "2 min ago", unread: true },
        { id: 2, text: "Event 'Jazz Night' was approved", time: "1 hr ago", unread: false },
        { id: 3, text: "Payout of ₹45,000 processed", time: "1 day ago", unread: false },
    ]);
    const [unreadCount, setUnreadCount] = useState(0);

    // Calculate unread count whenever notifications change
    useEffect(() => {
        const count = notifications.filter(n => n.unread).length;
        setUnreadCount(count);
    }, [notifications]);

    // Socket Connection
    useEffect(() => {
        const socket = io('http://localhost:5000');

        socket.on('connect', () => {
            console.log('Connected to socket server (Context)');
            if (user?.id) {
                socket.emit('join_organizer_room', user.id);
            }
        });

        // Generic Notification
        socket.on('notification', (data) => {
            addNotification(data.message || "New notification received");
        });

        // 1. New Booking
        socket.on('newBooking', (data) => {
            const msg = `New Booking: ${data.quantity}x ${data.seatType} for '${data.eventTitle}' by ${data.customerName}`;
            addNotification(msg);
        });

        // 2. Check-In Alert
        socket.on('checkInAlert', (data) => {
            const msg = `Check-In: ${data.attendeeName} (${data.seatType}) for '${data.eventTitle}'`;
            addNotification(msg);
        });

        // 3. Event Created
        socket.on('eventCreated', (data) => {
            const msg = `New Event Created: '${data.eventTitle}'`;
            addNotification(msg);
        });

        // Helper to add notification
        const addNotification = (text) => {
            const newNotif = {
                id: Date.now(),
                text: text,
                time: "Just now",
                unread: true
            };
            setNotifications(prev => [newNotif, ...prev]);
        };

        return () => {
            socket.off('notification');
            socket.disconnect();
        };
    }, [user]);

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    };

    const markAsRead = (id) => {
        setNotifications(prev => prev.map(n =>
            n.id === id ? { ...n, unread: false } : n
        ));
    };

    const value = {
        notifications,
        unreadCount,
        markAllRead,
        markAsRead,
        setNotifications // Exposed if manual addition is needed elsewhere
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};
