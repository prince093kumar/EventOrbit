import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Ticket, ChevronDown, Check } from 'lucide-react';

const CreateEvent = () => {
    // Mock Venue Data for "Venue-Driven Ticket System"
    const venues = [
        // Delhi NCR
        { id: 101, name: "Bharat Mandapam (Pragati Maidan)", capacity: 7000, location: "New Delhi" },
        { id: 102, name: "Jawaharlal Nehru Stadium", capacity: 60000, location: "New Delhi" },
        { id: 103, name: "Indira Gandhi Arena", capacity: 14000, location: "New Delhi" },
        { id: 104, name: "Buddh International Circuit", capacity: 100000, location: "Greater Noida" },

        // Mumbai
        { id: 201, name: "Jio World Centre", capacity: 2000, location: "Mumbai" },
        { id: 202, name: "Wankhede Stadium", capacity: 33000, location: "Mumbai" },
        { id: 203, name: "DY Patil Stadium", capacity: 55000, location: "Navi Mumbai" },
        { id: 204, name: "Nita Mukesh Ambani Cultural Centre", capacity: 2000, location: "Mumbai" },
        { id: 205, name: "The Dome, NSCI", capacity: 5000, location: "Mumbai" },

        // Bangalore
        { id: 301, name: "M. Chinnaswamy Stadium", capacity: 40000, location: "Bangalore" },
        { id: 302, name: "Bangalore Palace Grounds", capacity: 30000, location: "Bangalore" },
        { id: 303, name: "KTPO Trade Center", capacity: 5000, location: "Bangalore" },

        // Hyderabad
        { id: 401, name: "Rajiv Gandhi International Cricket Stadium", capacity: 55000, location: "Hyderabad" },
        { id: 402, name: "HITEX Exhibition Center", capacity: 4000, location: "Hyderabad" },
        { id: 403, name: "Gachibowli Indoor Stadium", capacity: 5000, location: "Hyderabad" },

        // Chennai
        { id: 501, name: "M. A. Chidambaram Stadium", capacity: 50000, location: "Chennai" },
        { id: 502, name: "Chennai Trade Centre", capacity: 6000, location: "Chennai" },

        // Kolkata
        { id: 601, name: "Eden Gardens", capacity: 68000, location: "Kolkata" },
        { id: 602, name: "Salt Lake Stadium", capacity: 85000, location: "Kolkata" },
        { id: 603, name: "Biswa Bangla Convention Centre", capacity: 3200, location: "Kolkata" },

        // Ahmedabad
        { id: 701, name: "Narendra Modi Stadium", capacity: 132000, location: "Ahmedabad" },

        // Pune
        { id: 801, name: "MCA Stadium", capacity: 37000, location: "Pune" },

        // Jaipur
        { id: 901, name: "Sawai Mansingh Stadium", capacity: 30000, location: "Jaipur" }
    ];

    const [eventData, setEventData] = useState({
        title: '',
        category: 'Concert',
        date: '',
        time: '',
        venueId: '',
    });

    const [selectedVenue, setSelectedVenue] = useState(null);

    const handleVenueChange = (e) => {
        const venueId = parseInt(e.target.value);
        const venue = venues.find(v => v.id === venueId);
        setSelectedVenue(venue);
        setEventData({ ...eventData, venueId });
    };

    const [loading, setLoading] = useState(false);

    const handlePublish = async () => {
        if (!selectedVenue || !eventData.title || !eventData.date || !eventData.time) {
            alert("Please fill in all required fields and select a venue.");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                title: eventData.title,
                category: eventData.category,
                date: new Date(`${eventData.date}T${eventData.time}`), // Combine date & time
                venue: selectedVenue.name,
                description: "Event description placeholder", // Add a description field to form if needed
                banner: "https://via.placeholder.com/800x400", // Placeholder image
                seatMap: { General: selectedVenue.capacity },
                price: { General: 50 }, // Default price for now
            };

            const response = await fetch('http://localhost:5000/api/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${token}` // Add token when Auth is real
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (data.success) {
                alert("Event Created Successfully! Check Dashboard.");
                // Reset form or redirect
                setEventData({
                    title: '',
                    category: 'Concert',
                    date: '',
                    time: '',
                    venueId: '',
                });
                setSelectedVenue(null);
            } else {
                alert(`Error: ${data.message}`);
            }

        } catch (error) {
            console.error("Error creating event:", error);
            alert("Failed to connect to server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-[var(--text-page)]">Create New Event</h1>
                <p className="text-[var(--text-muted)]">Setup your event details and venue.</p>
            </div>

            {/* 1. Event Details */}
            <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-6 space-y-4">
                <h3 className="font-bold text-[var(--text-page)] border-b border-[var(--border-color)] pb-2 mb-4">1. Event Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-[var(--text-muted)]">Event Title</label>
                        <input
                            type="text"
                            placeholder="Event Title"
                            className="w-full bg-[var(--bg-page)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-[var(--text-page)] focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                            value={eventData.title}
                            onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-[var(--text-muted)]">Category</label>
                        <div className="relative">
                            <select
                                className="w-full bg-[var(--bg-page)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-[var(--text-page)] focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none appearance-none transition-all"
                                value={eventData.category}
                                onChange={(e) => setEventData({ ...eventData, category: e.target.value })}
                            >
                                <option>Concert</option>
                                <option>Conference</option>
                                <option>Workshop</option>
                                <option>Exhibition</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-3 text-gray-400 pointer-events-none" size={16} />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-[var(--text-muted)]">Date</label>
                        <div className="relative">
                            <input
                                type="date"
                                className="w-full bg-[var(--bg-page)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-[var(--text-page)] focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                                value={eventData.date}
                                onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
                            />
                            <Calendar className="absolute right-4 top-2.5 text-gray-400 pointer-events-none" size={18} />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-[var(--text-muted)]">Time</label>
                        <div className="relative">
                            <input
                                type="time"
                                className="w-full bg-[var(--bg-page)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-[var(--text-page)] focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                                value={eventData.time}
                                onChange={(e) => setEventData({ ...eventData, time: e.target.value })}
                            />
                            <Clock className="absolute right-4 top-2.5 text-gray-400 pointer-events-none" size={18} />
                        </div>
                    </div>
                    <div className="col-span-2 space-y-1">
                        <label className="text-xs font-medium text-[var(--text-muted)]">Description (Optional)</label>
                        <textarea
                            className="w-full bg-[var(--bg-page)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-[var(--text-page)] focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                            rows="2"
                            placeholder="Brief description..."
                            value={eventData.description || ''}
                            onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                        ></textarea>
                    </div>
                </div>
            </div>

            {/* 2. Venue & Capacity */}
            <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-6 space-y-4">
                <h3 className="font-bold text-[var(--text-page)] border-b border-[var(--border-color)] pb-2 mb-4">2. Venue & Capacity (Auto-Assigned)</h3>

                <div className="bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30 p-4 rounded-xl flex items-start gap-3 mb-6">
                    <Ticket className="text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" size={20} />
                    <div>
                        <p className="font-semibold text-purple-900 dark:text-purple-200 text-sm">Venue-Driven Ticket System</p>
                        <p className="text-purple-700 dark:text-purple-300 text-xs">Select a venue. Total tickets will be automatically set to the venue's max capacity. You cannot manually edit ticket counts.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-[var(--text-muted)]">Select Venue</label>
                        <div className="relative">
                            <select
                                className="w-full bg-[var(--bg-page)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-[var(--text-page)] focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none appearance-none transition-all"
                                onChange={handleVenueChange}
                                value={eventData.venueId}
                            >
                                <option value="">-- Choose Venue --</option>
                                {venues.map(v => (
                                    <option key={v.id} value={v.id}>{v.name}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-3 text-gray-400 pointer-events-none" size={16} />
                        </div>
                    </div>

                    <div className="bg-[var(--bg-page)] border border-[var(--border-color)] rounded-xl p-4 flex flex-col items-center justify-center h-[50px] min-h-[80px]">
                        <p className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-wider mb-1">Total Tickets (Locked)</p>
                        <p className="text-2xl font-bold text-[var(--text-page)]">
                            {selectedVenue ? selectedVenue.capacity.toLocaleString() : '---'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-4">
                <button
                    className="px-6 py-2.5 rounded-xl border border-[var(--border-color)] text-[var(--text-muted)] font-medium hover:bg-[var(--bg-subtle)] transition-colors"
                    disabled={loading}
                >
                    Save Draft
                </button>
                <button
                    onClick={handlePublish}
                    disabled={loading}
                    className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium shadow-lg shadow-purple-500/20 transition-all flex items-center gap-2"
                >
                    {loading ? 'Publishing...' : 'Submit for Approval'}
                    {!loading && <Check size={18} />}
                </button>
            </div>
        </div>
    );
};

export default CreateEvent;
