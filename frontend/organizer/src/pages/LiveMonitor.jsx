import React from 'react';
import { Activity, Users, Clock, AlertCircle } from 'lucide-react';

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

const LiveMonitor = () => {
    // Mock Live Data
    const liveFeed = [
        { time: '10:42 AM', action: 'Check-in', user: 'Sarah Connor', ticket: '#T-800' },
        { time: '10:41 AM', action: 'Ticket Sold', user: 'Kyle Reese', ticket: '#T-801' },
        { time: '10:39 AM', action: 'Check-in', user: 'John Doe', ticket: '#T-755' },
        { time: '10:35 AM', action: 'Gate Alert', user: 'Unknown', ticket: 'Invalid Scan', alert: true },
        { time: '10:30 AM', action: 'Check-in', user: 'Jane Smith', ticket: '#T-642' },
    ];

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
                    value="142"
                    subtext="Last 60 mins: +28"
                    icon={Users}
                    color="text-green-500"
                />
                <MonitorCard
                    title="Tickets Scanned"
                    value="89%"
                    subtext="Capacity: 250/280"
                    icon={Clock}
                    color="text-blue-500"
                />
                <MonitorCard
                    title="Gate Alerts"
                    value="2"
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
                <div className="divide-y divide-[var(--border-color)]">
                    {liveFeed.map((item, index) => (
                        <div key={index} className="px-6 py-4 flex items-center justify-between hover:bg-[var(--bg-subtle)] transition-colors">
                            <div className="flex items-center gap-4">
                                <span className="text-xs font-mono text-[var(--text-muted)] bg-[var(--bg-page)] px-2 py-1 rounded border border-[var(--border-color)]">
                                    {item.time}
                                </span>
                                <div>
                                    <p className={`text-sm font-medium ${item.alert ? 'text-red-500' : 'text-[var(--text-page)]'}`}>
                                        {item.action}
                                    </p>
                                    <p className="text-xs text-[var(--text-muted)]">
                                        {item.user} • <span className="font-mono">{item.ticket}</span>
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
            </div>
        </div>
    );
};

export default LiveMonitor;
