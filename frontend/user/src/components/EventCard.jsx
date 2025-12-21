import React from 'react';
import { Calendar, MapPin, Tag } from 'lucide-react';

import { bookEvent } from '../api/eventApi';

const EventCard = ({ id, title, organizer, date, imageColor, price, location, category, banner, status, onBookClick }) => {
  const handleBook = async () => {
    if (status === 'cancelled') return;

    if (onBookClick) {
      onBookClick({ id, title, organizer, date, imageColor, price, location, category });
    } else {
      const result = await bookEvent({ id, title, organizer, date, imageColor, price, location, category });
      alert(result.message);
    }
  };

  const organizerName = typeof organizer === 'object' ? organizer?.fullName || 'Unknown' : organizer;

  // Handle price display (finding cheapest option)
  const displayPrice = typeof price === 'object'
    ? Object.values(price).length > 0
      ? `₹${Math.min(...Object.values(price).map(p => Number(p) || 0))}`
      : 'Free'
    : price;

  const formattedDate = new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  const isCancelled = status === 'cancelled';

  return (
    <div className={`group bg-[var(--bg-card)] rounded-2xl overflow-hidden shadow-sm border border-[var(--border-color)] transition-all duration-300 flex flex-col h-full ${isCancelled ? 'opacity-75 grayscale' : 'hover:shadow-xl hover:-translate-y-1'}`}>
      {/* Image / Header */}
      <div
        className={`h-48 w-full bg-cover bg-center relative p-4 flex flex-col justify-between ${!banner ? (imageColor || 'bg-[#FFDA8A]') : ''}`}
        style={banner ? { backgroundImage: `url(${banner})` } : {}}
      >
        <div className={`absolute inset-0 ${banner ? 'bg-black/40' : ''}`}></div>
        <div className="flex justify-between items-start relative z-10 w-full">
          <span className="px-2.5 py-1 bg-black/20 backdrop-blur-md text-white text-xs font-semibold rounded-lg border border-white/10">
            {category}
          </span>
          {isCancelled && (
            <span className="px-2.5 py-1 bg-red-600 text-white text-xs font-bold rounded-lg uppercase tracking-wide border border-red-400 shadow-md transform rotate-3">
              Cancelled
            </span>
          )}
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start gap-2 mb-2">
          <h3 className={`text-lg font-bold text-[var(--text-page)] leading-tight line-clamp-2 ${!isCancelled && 'group-hover:text-[#FFDA8A]'} transition-colors`}>
            {title}
          </h3>
        </div>

        <p className="text-sm text-[var(--text-muted)] font-medium mb-4">{organizerName}</p>

        <div className="mt-auto space-y-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[var(--text-muted)] text-sm">
              <Calendar size={16} className={isCancelled ? "text-gray-400" : "text-[#FFDA8A]"} />
              <span className={isCancelled ? "line-through text-gray-400" : ""}>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--text-muted)] text-sm">
              <MapPin size={16} className={isCancelled ? "text-gray-400" : "text-red-500"} />
              <span className="truncate">{location}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--border-color)] flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs text-[var(--text-muted)]">Starting from</span>
              <span className="text-lg font-bold text-[var(--text-page)]">{displayPrice}</span>
            </div>
            <button
              onClick={handleBook}
              disabled={isCancelled}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${isCancelled
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-slate-800 dark:text-gray-600'
                  : 'bg-[#FFDA8A]/20 text-gray-800 dark:text-[#FFDA8A] hover:bg-[#FFDA8A] hover:text-white'
                }`}
            >
              {isCancelled ? 'Cancelled' : 'Book'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
