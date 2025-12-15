import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, MoreVertical, CheckCircle, Clock, XCircle } from 'lucide-react';

const Attendees = () => {
    // State for attendees and filters
    const [attendees, setAttendees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    useEffect(() => {
        fetchAttendees();
    }, []);

    const fetchAttendees = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/organizer/attendees');
            const data = await res.json();
            if (data.success) {
                setAttendees(data.attendees);
            }
        } catch (error) {
            console.error("Error fetching attendees:", error);
        } finally {
            setLoading(false);
        }
    };

    // Filter Logic
    const filteredAttendees = attendees.filter(attendee => {
        const matchesSearch =
            attendee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            attendee.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'All' || attendee.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-page)]">Attendees</h1>
                    <p className="text-[var(--text-muted)]">Manage guest lists and check-ins.</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl text-[var(--text-page)] hover:bg-[var(--bg-subtle)] transition-colors text-sm font-medium">
                        <Download size={16} /> Export CSV
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 bg-[var(--bg-card)] p-4 rounded-2xl border border-[var(--border-color)]">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-2.5 text-[var(--text-muted)]" size={20} />
                    <input
                        type="text"
                        placeholder="Search attendees..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-[var(--bg-page)] border border-[var(--border-color)] text-[var(--text-page)] focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    {['All', 'Checked In', 'Pending', 'Cancelled'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filterStatus === status
                                ? 'bg-purple-600 text-white'
                                : 'bg-[var(--bg-page)] text-[var(--text-muted)] hover:text-[var(--text-page)]'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[var(--border-color)] bg-[var(--bg-subtle)]">
                                <th className="p-4 font-medium text-[var(--text-muted)] text-sm">Name</th>
                                <th className="p-4 font-medium text-[var(--text-muted)] text-sm hidden md:table-cell">Email</th>
                                <th className="p-4 font-medium text-[var(--text-muted)] text-sm">Ticket Type</th>
                                <th className="p-4 font-medium text-[var(--text-muted)] text-sm">Status</th>
                                <th className="p-4 font-medium text-[var(--text-muted)] text-sm">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-[var(--text-muted)]">Loading attendees...</td>
                                </tr>
                            ) : filteredAttendees.length > 0 ? (
                                filteredAttendees.map((attendee) => (
                                    <tr key={attendee.id} className="border-b border-[var(--border-color)] last:border-0 hover:bg-[var(--bg-subtle)] transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                                                    {attendee.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-[var(--text-page)]">{attendee.name}</p>
                                                    <p className="text-xs text-[var(--text-muted)] md:hidden">{attendee.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-[var(--text-page)] hidden md:table-cell">{attendee.email}</td>
                                        <td className="p-4 text-[var(--text-page)]">{attendee.ticket}</td>
                                        <td className="p-4">
                                            <StatusBadge status={attendee.status} />
                                        </td>
                                        <td className="p-4">
                                            <button className="p-2 text-[var(--text-muted)] hover:text-[var(--text-page)] hover:bg-[var(--bg-page)] rounded-full transition-colors">
                                                <MoreVertical size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-[var(--text-muted)]">
                                        No attendees found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const StatusBadge = ({ status }) => {
    const styles = {
        'Checked In': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
        'Pending': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
        'Cancelled': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
    };

    // Fallback logic
    let badgeStyle = styles[status] || styles['Pending'];
    if (status === 'confirmed') badgeStyle = styles['Checked In'];

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${badgeStyle}`}>
            {status}
        </span>
    );
};

export default Attendees;
