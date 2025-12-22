import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/apiClient';
import { TrendingUp, Calendar, DollarSign, Clock, Ticket } from 'lucide-react';
import EventCard from '../components/EventCard';

const StatCard = ({ title, value, change, icon: Icon, color }) => (
    <div className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-[var(--text-muted)] text-sm font-medium mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-[var(--text-page)]">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${color}`}>
                <Icon size={20} className="text-white" />
            </div>
        </div>
        <div className="mt-4 flex items-center gap-1 text-sm">
            <span className="text-green-500 font-bold">{change}</span>
            <span className="text-[var(--text-muted)]">vs last month</span>
        </div>
    </div>
);

const Dashboard = () => {
    const { user, token, isAuthenticated } = useAuth();
    const [stats, setStats] = useState({
        totalSales: 0,
        ticketsSold: 0,
        eventsActive: 0,
        pendingApproval: 0
    });
    const [loading, setLoading] = useState(true);

    const [activities, setActivities] = useState([]);
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchStatsAndActivity = async () => {
            if (!isAuthenticated) {
                // Guest Mode setup (kept same)
                setLoading(false);
                return;
            }

            try {
                // Fetch Stats
                const statsRes = await apiClient.get('/organizer/stats');
                if (statsRes.data.success) setStats(statsRes.data);

                // Fetch Recent Activity
                const activityRes = await apiClient.get('/organizer/live-activity');
                if (activityRes.data.success) setActivities(activityRes.data.activities);

                // Fetch My Events
                const eventsRes = await apiClient.get('/organizer/events');
                if (eventsRes.data.success) setEvents(eventsRes.data.events);

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStatsAndActivity();
    }, [isAuthenticated, token]);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-[var(--text-page)]">Organizer Dashboard</h1>
                <p className="text-[var(--text-muted)]">Overview of your events and sales.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Sales" value={`₹${stats.totalSales.toLocaleString()}`} change="+20.1%" icon={DollarSign} color="bg-gradient-to-br from-green-400 to-emerald-600" />
                <StatCard title="Tickets Sold" value={stats.ticketsSold} change="+12.5%" icon={Ticket} color="bg-gradient-to-br from-blue-400 to-indigo-600" />
                <StatCard title="Events Active" value={stats.eventsActive} change="Active" icon={Calendar} color="bg-gradient-to-br from-purple-400 to-pink-600" />
                <StatCard title="Pending Approval" value={stats.pendingApproval} change="Waiting" icon={Clock} color="bg-gradient-to-br from-yellow-400 to-orange-500" />
            </div>

            {/* My Events Section */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-xl text-[var(--text-page)]">My Events</h3>
                    <a href="/create-event" className="text-sm text-indigo-500 hover:text-indigo-400 font-medium">Create New +</a>
                </div>

                {loading ? (
                    <div className="text-center py-10 text-[var(--text-muted)]">Loading events...</div>
                ) : events.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {events.map(event => (
                            <EventCard key={event._id} event={event} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-8 text-center">
                        <p className="text-[var(--text-muted)] mb-4">You haven't created any events yet.</p>
                        <a href="/create-event" className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                            Create Event
                        </a>
                    </div>
                )}
            </div>

            {/* Recent Activity */}
            <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] overflow-hidden">
                <div className="px-6 py-4 border-b border-[var(--border-color)]">
                    <h3 className="font-bold text-[var(--text-page)]">Recent Activity</h3>
                </div>
                <div className="divide-y divide-[var(--border-color)]">
                    {loading ? (
                        <div className="p-6 text-center text-[var(--text-muted)]">Loading activity...</div>
                    ) : activities.length > 0 ? (
                        activities.slice(0, 5).map((item) => (
                            <div key={item.id} className="px-6 py-4 flex items-center justify-between hover:bg-[var(--bg-subtle)] transition-colors">
                                <div>
                                    <p className="text-sm font-medium text-[var(--text-page)]">
                                        {item.action} for <span className="font-bold">{item.eventName}</span>
                                    </p>
                                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                                        {item.user} • {new Date(item.time).toLocaleTimeString()}
                                    </p>
                                </div>
                                <span className="text-xs font-mono text-[var(--text-muted)] bg-[var(--bg-page)] px-2 py-1 rounded border border-[var(--border-color)]">
                                    {new Date(item.time).toLocaleDateString()}
                                </span>
                            </div>
                        ))
                    ) : (
                        <div className="p-6 text-[var(--text-muted)] text-center text-sm">
                            No recent activity found. Sales and check-ins will appear here.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
