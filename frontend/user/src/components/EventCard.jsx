import React from 'react';
import { Calendar, MapPin, Tag } from 'lucide-react';

import { bookEvent } from '../api/eventApi';
import BookingModal from './BookingModal';

const EventCard = ({ id, title, organizer, date, time, imageColor, banner, price, location, category }) => {
  const [showModal, setShowModal] = React.useState(false);

  const handleBook = () => {
    setShowModal(true);
  };

  return (
    <>
      <div className="group bg-[var(--bg-card)] rounded-2xl overflow-hidden shadow-sm border border-[var(--border-color)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
        {/* Image / Header */}
        <div className={`h-48 w-full relative p-4 flex flex-col justify-between ${!banner ? (imageColor || 'bg-[#FFDA8A] bg-gradient-to-br') : ''}`}>
          {banner && (
            <img
              src={banner}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <span className="self-start px-2.5 py-1 bg-black/40 backdrop-blur-md text-white text-xs font-semibold rounded-lg border border-white/10 z-10">
            {category}
          </span>
        </div>

        <div className="p-5 flex-1 flex flex-col">
          <div className="flex justify-between items-start gap-2 mb-2">
            <h3 className="text-lg font-bold text-[var(--text-page)] leading-tight line-clamp-2 group-hover:text-[#FFDA8A] transition-colors">
              {title}
            </h3>
          </div>

          <p className="text-sm text-[var(--text-muted)] font-medium mb-4">
            {typeof organizer === 'object' ? organizer?.fullName : organizer}
          </p>

          <div className="mt-auto space-y-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[var(--text-muted)] text-sm">
                <Calendar size={16} className="text-[#FFDA8A]" />
                <span>{date}</span>
              </div>
              <div className="flex items-center gap-2 text-[var(--text-muted)] text-sm">
                <MapPin size={16} className="text-red-500" />
                <span className="truncate">{location}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--border-color)] flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs text-[var(--text-muted)]">Starting from</span>
                <span className="text-lg font-bold text-[var(--text-page)]">
                  {(() => {
                    if (typeof price === 'object' && price !== null) {
                      const values = Object.values(price).filter(v => typeof v === 'number');
                      const minPrice = values.length > 0 ? Math.min(...values) : 0;
                      return `₹${minPrice}`;
                    }
                    return `₹${price || 0}`;
                  })()}
                </span>
              </div>
              <button
                onClick={handleBook}
                className="bg-[#FFDA8A]/20 text-gray-800 dark:text-[#FFDA8A] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#FFDA8A] hover:text-white transition-colors"
              >
                Book
              </button>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <BookingModal
          event={{ id, title, organizer, date, time, imageColor, price, location, category }}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default EventCard;
