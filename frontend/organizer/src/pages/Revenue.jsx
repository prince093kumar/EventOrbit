import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, CreditCard, Download, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Revenue = () => {
    const [stats, setStats] = useState({
        chartData: [],
        totalRevenue: 0,
        pendingPayouts: 0,
        avgTicketPrice: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRevenue = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/organizer/revenue');
                const data = await res.json();
                if (data.success) {
                    setStats(data);
                }
            } catch (error) {
                console.error("Error fetching revenue stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRevenue();
    }, []);

    // Placeholder data for chart if empty
    const chartData = stats.chartData.length > 0 ? stats.chartData : [
        { name: 'Mon', revenue: 0 },
        { name: 'Tue', revenue: 0 },
        { name: 'Wed', revenue: 0 },
        { name: 'Thu', revenue: 0 },
        { name: 'Fri', revenue: 0 },
        { name: 'Sat', revenue: 0 },
        { name: 'Sun', revenue: 0 },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-page)]">Revenue Analytics</h1>
                    <p className="text-[var(--text-muted)]">Financial performance overview.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl text-[var(--text-page)] hover:bg-[var(--bg-subtle)] transition-colors text-sm font-medium">
                    <Download size={16} /> Download Report
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-green-500 to-emerald-700 rounded-2xl p-6 text-white shadow-lg">
                    <p className="text-emerald-100 text-sm font-medium mb-1">Total Revenue</p>
                    <h3 className="text-3xl font-bold mb-2">₹{stats.totalRevenue.toLocaleString()}</h3>
                    <div className="flex items-center gap-2 text-sm text-emerald-100 bg-white/20 w-fit px-2 py-1 rounded-lg backdrop-blur-sm">
                        <TrendingUp size={16} /> +12% from last month
                    </div>
                </div>

                <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-[var(--text-muted)] text-sm font-medium">Pending Payouts</p>
                            <h3 className="text-2xl font-bold text-[var(--text-page)]">₹{stats.pendingPayouts.toLocaleString()}</h3>
                        </div>
                        <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg text-yellow-600 dark:text-yellow-400">
                            <ClockIcon size={20} />
                        </div>
                    </div>
                    <p className="text-xs text-[var(--text-muted)]">Next payout scheduled for Dec 18</p>
                </div>

                <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-[var(--text-muted)] text-sm font-medium">Avg. Ticket Price</p>
                            <h3 className="text-2xl font-bold text-[var(--text-page)]">₹{stats.avgTicketPrice.toLocaleString()}</h3>
                        </div>
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                            <CreditCard size={20} />
                        </div>
                    </div>
                    <p className="text-xs text-[var(--text-muted)]">Based on actual sales</p>
                </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 h-[400px]">
                <h3 className="text-lg font-bold text-[var(--text-page)] mb-6">Revenue Trend (7 Days)</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)' }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)' }} tickFormatter={(value) => `₹${value} `} />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-page)' }}
                            itemStyle={{ color: 'var(--text-page)' }}
                        />
                        <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

// Helper for icon
const ClockIcon = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
);

export default Revenue;
