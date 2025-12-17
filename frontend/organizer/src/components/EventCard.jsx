import React from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';

const EventCard = ({ event }) => {
    return (
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            {/* Image Section */}
            <div className="relative h-48 bg-gray-200">
                {event.banner ? (
                    <img
                        src={event.banner}
                        alt={event.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[var(--bg-subtle)] text-[var(--text-muted)]">
                        No Image
                    </div>
                )}
                <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm uppercase font-bold tracking-wider">
                    {event.category}
                </div>
            </div>

            {/* Content Section */}
            <div className="p-4">
                {/* Status Badge */}
                <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium mb-3 border ${event.status === 'approved' ? 'bg-green-100 text-green-700 border-green-200' :
                        event.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                            'bg-red-100 text-red-700 border-red-200'
                    }`}>
                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </span>

                <h3 className="font-bold text-lg text-[var(--text-page)] mb-2 line-clamp-1">{event.title}</h3>

                <div className="space-y-2 text-sm text-[var(--text-muted)]">
                    <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-indigo-500" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock size={14} className="text-orange-500" />
                        <span>{new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-red-500" />
                        <span className="line-clamp-1">{event.venue}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventCard;
