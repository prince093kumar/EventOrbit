import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import EventCard from '../components/EventCard';
import { Star, Loader2, Sparkles } from 'lucide-react';
import { fetchEvents, fetchCategories, searchEvents } from '../api/eventApi';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const eventsSectionRef = useRef(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');

  // Reset category if searching
  useEffect(() => {
    if (searchQuery) {
      setActiveCategory('all');
    }
  }, [searchQuery]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // If search query exists, prioritize search
        let eventsData;
        if (searchQuery) {
          eventsData = await searchEvents(searchQuery);
        } else {
          eventsData = await fetchEvents(activeCategory);
        }

        const categoriesData = await fetchCategories();

        setEvents(eventsData);
        if (categories.length === 0) setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to load events", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [activeCategory, searchQuery]);

  const scrollToEvents = () => {
    eventsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* Hero / Welcome Section */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#FFDA8A] to-[#ffc107] text-gray-900 shadow-xl p-8 md:p-12">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 max-w-2xl">

          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            Discover Unforgettable Experiences
          </h1>
          <p className="text-gray-800 text-lg mb-8">
            Explore concerts, conferences, workshops and more happening around you.
          </p>
          <div className="flex gap-4">
            <button
              onClick={scrollToEvents}
              className="bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors shadow-lg"
            >
              Explore Now
            </button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="flex overflow-x-auto pb-4 gap-3 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveCategory(cat.id);
              // Clear search query when changing category
              if (searchQuery) {
                setSearchParams({}, { replace: true });
              }
            }}
            className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-medium transition-all ${activeCategory === cat.id
              ? 'bg-[#FFDA8A] text-gray-900 shadow-md shadow-[#FFDA8A]/20'
              : 'bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700'
              }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      <div ref={eventsSectionRef}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[var(--text-page)] flex items-center gap-2">
            <Sparkles className="fill-yellow-400 text-yellow-400" size={20} />
            {activeCategory === 'all' ? 'Recommended for You' : `${categories.find(c => c.id === activeCategory)?.label} Events`}
          </h2>
          <span className="text-sm text-[var(--text-muted)] font-medium">
            {events.length} results found
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-[#FFDA8A]" size={40} />
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {events.map(event => (
              <EventCard
                key={event.id}
                id={event.id}
                title={event.title}
                organizer={event.organizer}
                date={event.date}
                imageColor={event.imageColor}
                price={event.price}
                category={event.category}
                location={event.location}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] dashed">
            <p className="text-[var(--text-muted)] text-lg">No events found in this category.</p>
            <button
              onClick={() => setActiveCategory('all')}
              className="mt-4 text-[#FFDA8A] hover:underline font-medium"
            >
              View all events
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
