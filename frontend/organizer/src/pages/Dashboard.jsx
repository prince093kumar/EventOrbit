import React, { useState, useEffect } from 'react';
import { TrendingUp, Calendar, DollarSign, Clock, Ticket } from 'lucide-react';

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
    const [stats, setStats] = useState({
        totalSales: 0,
        ticketsSold: 0,
        eventsActive: 0,
        pendingApproval: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/organizer/stats');
                const data = await res.json();
                if (data.success) {
                    setStats(data);
                }
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-[var(--text-page)]">Organizer Dashboard</h1>
                <p className="text-[var(--text-muted)]">Overview of your events and sales.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Sales"
                    value={`₹${stats.totalSales.toLocaleString()}`}
                    change="+20.1%"
                    icon={DollarSign}
                    color="bg-gradient-to-br from-green-400 to-emerald-600"
                />
                <StatCard
                    title="Tickets Sold"
                    value={stats.ticketsSold}
                    change="+12.5%"
                    icon={Ticket}
                    color="bg-gradient-to-br from-blue-400 to-indigo-600"
                />
                <StatCard
                    title="Events Active"
                    value={stats.eventsActive}
                    change="Active"
                    icon={Calendar}
                    color="bg-gradient-to-br from-purple-400 to-pink-600"
                />
                <StatCard
                    title="Pending Approval"
                    value={stats.pendingApproval}
                    change="Waiting"
                    icon={Clock}
                    color="bg-gradient-to-br from-yellow-400 to-orange-500"
                />
            </div>

            {/* Recent Activity Placeholder from Wireframe */}
            <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] overflow-hidden">
                <div className="px-6 py-4 border-b border-[var(--border-color)]">
                    <h3 className="font-bold text-[var(--text-page)]">Recent Activity</h3>
                </div>
                <div className="p-6 text-[var(--text-muted)] text-center text-sm">
                    {loading ? 'Loading stats...' : 'No recent notifications.'}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
