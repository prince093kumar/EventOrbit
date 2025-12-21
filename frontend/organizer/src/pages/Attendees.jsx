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
            const res = await fetch('http://localhost:5000/api/organizer/attendees', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('eventorbit_organizer_token')}`
                }
            });
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

    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [cancelReason, setCancelReason] = useState("");

    const updateStatus = async (id, status, reason = "") => {
        try {
            const res = await fetch(`http://localhost:5000/api/organizer/booking/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('eventorbit_organizer_token')}`
                },
                body: JSON.stringify({ status, reason })
            });
            const data = await res.json();
            if (data.success) {
                // Refresh list
                fetchAttendees();
                setShowCancelModal(false);
                setCancelReason("");
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const handleCancelClick = (id) => {
        setSelectedId(id);
        setShowCancelModal(true);
    };

    const confirmCancel = () => {
        if (selectedId) {
            updateStatus(selectedId, 'cancelled', cancelReason);
        }
    };

    // ... (Filter Logic remains same)

    // Filter Logic
    const filteredAttendees = attendees.filter(attendee => {
        const matchesSearch =
            attendee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            attendee.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'All' || attendee.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const handleExport = () => {
        if (!attendees.length) return;

        const headers = ["Name", "Email", "Phone", "Ticket Type", "Seat", "Status"];
        const rows = attendees.map(a => [
            a.name,
            a.email,
            a.phone,
            a.ticket,
            a.seat,
            a.status
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `attendees_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6 relative">
            {/* ... Header and Filters ... */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-page)]">Attendees</h1>
                    <p className="text-[var(--text-muted)]">Manage guest lists and check-ins.</p>
                </div>
                {/* ... Export Button ... */}
                <div className="flex gap-2">
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl text-[var(--text-page)] hover:bg-[var(--bg-subtle)] transition-colors text-sm font-medium">
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
                                <th className="p-4 font-medium text-[var(--text-muted)] text-sm">Seat</th>
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
                                        <td className="p-4 text-[var(--text-page)]">
                                            <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${attendee.ticket?.toLowerCase() === 'vip'
                                                ? 'bg-amber-100 text-amber-700 border border-amber-200'
                                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                                                }`}>
                                                {attendee.ticket}
                                            </span>
                                        </td>
                                        <td className="p-4 text-[var(--text-page)] font-mono text-xs">{attendee.seat}</td>
                                        <td className="p-4">
                                            <StatusBadge status={attendee.status} />
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                {/* Check In Action */}
                                                {attendee.status !== 'Checked In' && attendee.status !== 'Cancelled' && (
                                                    <button
                                                        onClick={() => updateStatus(attendee.id, 'checked_in')}
                                                        className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                                                        title="Gate Check-In">
                                                        <CheckCircle size={14} /> Check In
                                                    </button>
                                                )}

                                                {/* Confirm Action (for Pending/Cancelled) */}
                                                {(attendee.status === 'Pending' || attendee.status === 'Cancelled') && (
                                                    <button
                                                        onClick={() => updateStatus(attendee.id, 'confirmed')}
                                                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                                        title="Confirm Booking (Approve)">
                                                        <CheckCircle size={18} />
                                                    </button>
                                                )}

                                                {/* Mark Pending */}
                                                {attendee.status !== 'Pending' && attendee.status !== 'Cancelled' && (
                                                    <button
                                                        onClick={() => updateStatus(attendee.id, 'pending')}
                                                        className="p-2 text-yellow-600 hover:bg-yellow-100 rounded-lg transition-colors" title="Mark Pending">
                                                        <Clock size={18} />
                                                    </button>
                                                )}

                                                {/* Cancel Action */}
                                                {attendee.status !== 'Cancelled' && (
                                                    <button
                                                        onClick={() => handleCancelClick(attendee.id)}
                                                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Cancel Booking">
                                                        <XCircle size={18} />
                                                    </button>
                                                )}
                                            </div>
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

            {/* Cancellation Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-[var(--bg-card)] p-6 rounded-2xl w-full max-w-md border border-[var(--border-color)] shadow-2xl animate-in fade-in zoom-in duration-200">
                        <h3 className="text-lg font-bold text-[var(--text-page)] mb-2">Cancel Booking</h3>
                        <p className="text-sm text-[var(--text-muted)] mb-4">Please provide a reason for cancelling this booking.</p>
                        <textarea
                            className="w-full p-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-page)] text-[var(--text-page)] focus:ring-2 focus:ring-red-500 outline-none h-32 resize-none"
                            placeholder="Reason for cancellation..."
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                        />
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowCancelModal(false)}
                                className="flex-1 py-2 rounded-xl border border-[var(--border-color)] text-[var(--text-muted)] hover:bg-[var(--bg-page)]"
                            >
                                Close
                            </button>
                            <button
                                onClick={confirmCancel}
                                className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold"
                            >
                                Confirm Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
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
