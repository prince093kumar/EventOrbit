import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, MoreVertical, Check, X, Ban } from 'lucide-react';
import apiClient from '../api/apiClient';

const Events = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await apiClient.get('/events');
                setEvents(res.data);
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };

        fetchEvents(); // Initial fetch
        const interval = setInterval(fetchEvents, 5000); // Poll every 5 seconds

        return () => clearInterval(interval);
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'bg-green-500/10 text-green-500';
            case 'pending': return 'bg-yellow-500/10 text-yellow-500';
            case 'rejected': return 'bg-red-500/10 text-red-500';
            case 'cancelled': return 'bg-gray-500/10 text-gray-500';
            default: return 'bg-slate-500/10 text-slate-500';
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await apiClient.put(`/events/${id}/status`, { status });
            setEvents(events.map(e => e._id === id ? { ...e, status } : e));
        } catch (error) {
            console.error("Error updating status", error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Events Management</h2>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search events..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-violet-500"
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-500 dark:text-slate-400">
                        <thead className="bg-slate-50 dark:bg-slate-900/50 uppercase text-xs font-semibold text-slate-700 dark:text-slate-300">
                            <tr>
                                <th className="px-6 py-4">Event Name</th>
                                <th className="px-6 py-4">Organizer</th>
                                <th className="px-6 py-4">Date & Venue</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {events.length > 0 ? events.map((event) => (
                                <tr key={event._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-slate-900 dark:text-white">{event.title}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-500">ID: {event._id}</p>
                                    </td>
                                    <td className="px-6 py-4 text-slate-700 dark:text-white">
                                        {event.organizer?.fullName || 'Unknown'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-slate-700 dark:text-slate-300">{new Date(event.date).toLocaleDateString()}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-500">{event.venue}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        {typeof event.price === 'object' ? (
                                            Object.entries(event.price).map(([key, val]) => (
                                                <div key={key} className="text-xs">{key}: ₹{val}</div>
                                            ))
                                        ) : (
                                            `₹${event.price}`
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-xs">
                                            {event.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase ${getStatusColor(event.status)}`}>
                                            {event.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                            {/* Pending: Approve / Reject */}
                                            {event.status === 'pending' && (
                                                <>
                                                    <button onClick={() => handleStatusUpdate(event._id, 'approved')} className="p-1 text-green-500 hover:bg-green-500/10 rounded" title="Approve">
                                                        <Check className="w-5 h-5" />
                                                    </button>
                                                    <button onClick={() => handleStatusUpdate(event._id, 'rejected')} className="p-1 text-red-500 hover:bg-red-500/10 rounded" title="Reject">
                                                        <X className="w-5 h-5" />
                                                    </button>
                                                </>
                                            )}

                                            {/* Cancelled: Uncancel (Revert to Pending) */}
                                            {event.status === 'cancelled' && (
                                                <button
                                                    onClick={() => {
                                                        if (window.confirm('Restore this event to Pending status?')) {
                                                            handleStatusUpdate(event._id, 'pending');
                                                        }
                                                    }}
                                                    className="p-1 text-yellow-500 hover:bg-yellow-500/10 rounded flex items-center gap-1"
                                                    title="Restore Event"
                                                >
                                                    <span className="text-xs font-medium">Restore</span>
                                                </button>
                                            )}

                                            {/* Active/Approved: Cancel Option */}
                                            {event.status === 'approved' && (
                                                <button
                                                    onClick={() => {
                                                        if (window.confirm('Are you sure you want to cancel this event?')) {
                                                            handleStatusUpdate(event._id, 'cancelled');
                                                        }
                                                    }}
                                                    className="p-1 text-red-500 hover:text-red-700 rounded"
                                                    title="Cancel Event"
                                                >
                                                    <Ban className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-8 text-center text-slate-500">
                                        No events found.
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

export default Events;
