import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, Briefcase, IndianRupee, AlertCircle, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import apiClient from '../api/apiClient';

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalOrganizers: 0,
        totalEvents: 0,
        pendingEvents: 0,
        totalRevenue: 0,
        chartData: []
    });
    const [pendingEventsList, setPendingEventsList] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [statsRes, pendingRes] = await Promise.all([
                apiClient.get('/stats'),
                apiClient.get('/pending-events')
            ]);

            setStats(statsRes.data);
            setPendingEventsList(pendingRes.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(); // Initial fetch

        const interval = setInterval(() => {
            fetchData(); // Poll every 10 seconds
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    const cards = [
        {
            title: 'Total Revenue',
            value: `₹${stats.totalRevenue.toLocaleString()}`,
            icon: IndianRupee,
            color: 'text-green-500',
            bg: 'bg-green-500/10',
            trend: '+12.5%'
        },
        {
            title: 'Total Events',
            value: stats.totalEvents,
            icon: Calendar,
            color: 'text-yellow-500',
            bg: 'bg-yellow-500/10',
            trend: '+8.2%'
        },
        {
            title: 'Total Users',
            value: stats.totalUsers,
            icon: Users,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
            trend: '+15.3%'
        },
        {
            title: 'Organizers',
            value: stats.totalOrganizers,
            icon: Briefcase,
            color: 'text-orange-500',
            bg: 'bg-orange-500/10',
            trend: '+5.4%'
        },
    ];

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-96 text-slate-500 dark:text-slate-400">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mb-4"></div>
                <p className="animate-pulse font-medium">Loading Dashboard Analytics...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">System Overview</h2>
                    <p className="text-slate-500 dark:text-slate-400">Real-time performance metrics and analytics.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-400 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Live Dashboard
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {cards.map((card, index) => (
                    <div
                        key={index}
                        className="group p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-xl hover:shadow-yellow-500/5 hover:-translate-y-1 transition-all duration-300"
                    >
                        <div className="flex items-start justify-between">
                            <div className={`p-3 rounded-xl ${card.bg} ${card.color} group-hover:scale-110 transition-transform duration-300`}>
                                <card.icon className="w-6 h-6" />
                            </div>
                            <div className="flex items-center gap-1 text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                                <ArrowUpRight className="w-3 h-3" />
                                {card.trend}
                            </div>
                        </div>
                        <div className="mt-4">
                            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{card.title}</h3>
                            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1 tabular-nums">{card.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Event Growth</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Frequency of events scheduled monthly</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">New Events</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.chartData || []}>
                                <defs>
                                    <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#eab308" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" strokeOpacity={0.1} />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#0f172a',
                                        borderRadius: '12px',
                                        border: '1px solid #1e293b',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                        color: '#f8fafc'
                                    }}
                                    itemStyle={{ color: '#eab308', fontWeight: 'bold' }}
                                    cursor={{ stroke: '#eab308', strokeWidth: 2, strokeDasharray: '5 5' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="events"
                                    stroke="#eab308"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorEvents)"
                                    animationDuration={2000}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pending Actions */}
                <div className="p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Pending Approvals</h3>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20">
                            {pendingEventsList.length} Action Needed
                        </span>
                    </div>

                    <div className="space-y-4">
                        {pendingEventsList.length === 0 ? (
                            <div className="py-12 text-center">
                                <AlertCircle className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                                <p className="text-sm text-slate-500 dark:text-slate-400">All clear! No pending events.</p>
                            </div>
                        ) : (
                            pendingEventsList.map((event) => (
                                <div
                                    key={event._id}
                                    onClick={() => navigate('/events')}
                                    className="group flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-transparent hover:border-yellow-500/30 cursor-pointer transition-all"
                                >
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center flex-shrink-0 text-yellow-600 font-bold group-hover:scale-110 transition-transform">
                                            {event.title.substring(0, 1).toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{event.title}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-500 truncate">by {event.organizer?.fullName || 'Unknown'}</p>
                                        </div>
                                    </div>
                                    <div className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]"></div>
                                </div>
                            ))
                        )}
                    </div>

                    {pendingEventsList.length > 0 && (
                        <button
                            onClick={() => navigate('/events')}
                            className="w-full mt-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-sm font-bold hover:bg-yellow-500 hover:text-white dark:hover:bg-yellow-500 transition-all"
                        >
                            View All Events
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
