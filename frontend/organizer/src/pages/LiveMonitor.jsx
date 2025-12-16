import React, { useState, useEffect } from 'react';
import { Activity, Users, Clock, AlertCircle, Loader2 } from 'lucide-react';

const MonitorCard = ({ title, value, subtext, icon: Icon, color }) => (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-2xl flex items-center justify-between">
        <div>
            <p className="text-[var(--text-muted)] text-sm font-medium mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-[var(--text-page)]">{value}</h3>
            <p className="text-xs text-[var(--text-muted)] mt-1">{subtext}</p>
        </div>
        <div className={`p-3 rounded-xl ${color} bg-opacity-10 dark:bg-opacity-20`}>
            <Icon size={24} className={color.replace('bg-', 'text-')} />
        </div>
    </div>
);

import { io } from 'socket.io-client';

const LiveMonitor = () => {
    const [liveFeed, setLiveFeed] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        recentCheckIns: 0,
        ticketsScanned: 0, // Used as 'Tickets Sold' for now
        alerts: 0
    });

    useEffect(() => {
        // Fetch Initial Data
        const fetchActivity = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/organizer/live-activity', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('eventorbit_organizer_token')}`
                    }
                });
                const data = await res.json();
                if (data.success) {
                    setLiveFeed(data.activities);
                    setStats(prev => ({
                        ...prev,
                        ticketsScanned: data.stats.ticketsScanned, // Total tickets from DB
                        recentCheckIns: data.stats.recentCheckIns, // Total check-ins
                        alerts: data.stats.alerts // Total alerts
                    }));
                }
            } catch (error) {
                console.error("Error fetching live activity:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchActivity();

        // WebSocket Connection
        const socket = io('http://localhost:5000');

        socket.on('connect', () => {
            console.log("Connected to WebSocket");
        });

        socket.on('newBooking', (booking) => {
            console.log("New Booking Received:", booking);

            // Create activity item from booking data
            const newActivity = {
                id: Date.now(), // Temp ID
                time: booking.timestamp,
                action: 'Ticket Sold',
                user: booking.customerName || 'New Customer',
                ticket: `#${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
                eventName: booking.eventTitle,
                seatNumber: booking.seatNumber,
                alert: false
            };

            // Add to feed
            setLiveFeed(prev => [newActivity, ...prev].slice(0, 20)); // Keep last 20

            // Update Stats
            setStats(prev => ({
                ...prev,
                ticketsScanned: prev.ticketsScanned + 1
            }));
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    // Time formatter helper if date-fns not available or preferred simple
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-page)] flex items-center gap-2">
                        <Activity className="text-red-500 animate-pulse" /> Live Monitor
                    </h1>
                    <p className="text-[var(--text-muted)]">Real-time event activity tracking.</p>
                </div>
                <div className="flex items-center gap-2 bg-red-100 dark:bg-red-900/20 px-3 py-1 rounded-full border border-red-200 dark:border-red-900">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                    <span className="text-xs font-bold text-red-600 dark:text-red-400">LIVE</span>
                </div>
            </div>

            {/* Live Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MonitorCard
                    title="Real-time Check-ins"
                    value={stats.recentCheckIns.toString()}
                    subtext="Last 20 activities"
                    icon={Users}
                    color="text-green-500"
                />
                <MonitorCard
                    title="Recent Tickets"
                    value={stats.ticketsScanned.toString()}
                    subtext="Last 20 activities"
                    icon={Clock}
                    color="text-blue-500"
                />
                <MonitorCard
                    title="Gate Alerts"
                    value={stats.alerts.toString()}
                    subtext="Requires Attention"
                    icon={AlertCircle}
                    color="text-red-500"
                />
            </div>

            {/* Live Feed */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-[var(--border-color)]">
                    <h3 className="font-bold text-[var(--text-page)]">Activity Feed</h3>
                </div>

                {loading ? (
                    <div className="p-8 flex justify-center text-[var(--text-muted)]">
                        <Loader2 className="animate-spin" size={24} />
                    </div>
                ) : liveFeed.length > 0 ? (
                    <div className="divide-y divide-[var(--border-color)]">
                        {liveFeed.map((item) => (
                            <div key={item.id} className="px-6 py-4 flex items-center justify-between hover:bg-[var(--bg-subtle)] transition-colors">
                                <div className="flex items-center gap-4">
                                    <span className="text-xs font-mono text-[var(--text-muted)] bg-[var(--bg-page)] px-2 py-1 rounded border border-[var(--border-color)] min-w-[70px] text-center">
                                        {formatTime(item.time)}
                                    </span>
                                    <div>
                                        <p className={`text-sm font-medium ${item.alert ? 'text-red-500' : 'text-[var(--text-page)]'}`}>
                                            {item.user} <span className="text-[var(--text-muted)] font-normal text-xs">bought</span> {item.eventName}
                                        </p>
                                        <p className="text-xs text-[var(--text-muted)]">
                                            Seat: <span className="font-mono font-bold text-purple-500">{item.seatNumber || 'N/A'}</span> • <span className="font-mono">{item.ticket}</span>
                                        </p>
                                    </div>
                                </div>
                                {item.alert && (
                                    <button className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-1 rounded-full font-bold">
                                        Details
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-8 text-center text-[var(--text-muted)]">
                        <Activity className="mx-auto mb-2 opacity-50" size={32} />
                        <p>No recent activity detected.</p>
                        <p className="text-xs mt-1">Sales and check-ins will appear here in real-time.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LiveMonitor;
