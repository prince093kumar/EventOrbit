import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Ticket, Share2, ArrowLeft } from 'lucide-react';
import { fetchEventById } from '../api/eventApi';
import EventReviews from '../components/EventReviews';

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadEvent = async () => {
            const data = await fetchEventById(id);
            if (data && data.success) {
                setEvent(data.event);
            }
            setLoading(false);
        };
        loadEvent();
    }, [id]);

    if (loading) return <div className="p-8 text-center text-[var(--text-muted)]">Loading event details...</div>;
    if (!event) return <div className="p-8 text-center text-red-500">Event not found</div>;

    const isPast = new Date(event.date) < new Date();

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl animate-in fade-in duration-500">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-page)] mb-6 transition-colors"
            >
                <ArrowLeft size={20} /> Back to Events
            </button>

            {/* Event Hero Section */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="relative group overflow-hidden rounded-2xl shadow-lg border border-[var(--border-color)] aspect-video md:aspect-auto">
                    {/* Fallback Image or Banner */}
                    <img
                        src={event.banner || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"}
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-mono border border-white/10 uppercase tracking-widest">
                        {event.category}
                    </div>
                </div>

                <div className="flex flex-col justify-center">
                    <h1 className="text-4xl md:text-5xl font-black text-[var(--text-page)] mb-4 leading-tight">{event.title}</h1>

                    <div className="space-y-4 mb-8">
                        <div className="flex items-center gap-3 text-[var(--text-muted)] text-lg">
                            <div className="p-2 bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)]">
                                <Calendar className="text-[#FFDA8A]" size={24} />
                            </div>
                            <span>{new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[var(--text-muted)] text-lg">
                            <div className="p-2 bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)]">
                                <MapPin className="text-[#FFDA8A]" size={24} />
                            </div>
                            <span>{event.venue}</span>
                        </div>
                    </div>

                    <div className="flex gap-4 items-center">
                        <div className="flex-1">
                            <p className="text-sm text-[var(--text-muted)] uppercase tracking-wider mb-1">Starting From</p>
                            <p className="text-3xl font-bold text-[var(--text-page)]">
                                ₹{event.price.Regular || event.price.Presale || '0'}
                            </p>
                        </div>

                        {!isPast ? (
                            <button
                                onClick={() => navigate(`/event/${event._id}/seats`)}
                                className="flex-1 bg-[#FFDA8A] hover:bg-[#ffc107] text-gray-900 py-4 px-6 rounded-xl font-bold text-lg shadow-lg shadow-[#FFDA8A]/20 transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
                            >
                                <Ticket size={24} />
                                Book Now
                            </button>
                        ) : (
                            <div className="flex-1 bg-gray-200 dark:bg-gray-800 text-gray-400 py-4 px-6 rounded-xl font-bold text-lg text-center cursor-not-allowed border border-gray-300 dark:border-gray-700">
                                Event Ended
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* About Section */}
            <div className="grid md:grid-cols-3 gap-8 border-t border-[var(--border-color)] pt-12">
                <div className="md:col-span-2 space-y-8">
                    <section>
                        <h3 className="text-2xl font-bold text-[var(--text-page)] mb-4">About This Event</h3>
                        <p className="text-[var(--text-muted)] leading-relaxed whitespace-pre-wrap">
                            {event.description}
                        </p>
                    </section>

                    {/* Integrated Reviews Component */}
                    <EventReviews eventId={event._id} eventDate={event.date} />
                </div>

                {/* Sidebar Details */}
                <div className="space-y-6">
                    <div className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border-color)]">
                        <h4 className="font-bold text-[var(--text-page)] mb-4">Organizer</h4>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                                {event.organizer?.fullName?.charAt(0) || 'O'}
                            </div>
                            <div>
                                <p className="font-medium text-[var(--text-page)]">{event.organizer?.fullName || 'Event Organizer'}</p>
                                <button className="text-xs text-[#FFDA8A] hover:underline">View Profile</button>
                            </div>
                        </div>
                    </div>

                    <button className="w-full py-3 px-4 rounded-xl border border-[var(--border-color)] text-[var(--text-page)] hover:bg-[var(--bg-subtle)] transition-colors flex items-center justify-center gap-2">
                        <Share2 size={18} />
                        Share Event
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;
