import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Calendar, CheckCircle } from 'lucide-react';
// Import API to get user's bookings to know what they can review
import { fetchUserTickets } from '../api/eventApi';

const Reviews = () => {
    const [activeTab, setActiveTab] = useState('to-review');
    const [reviews, setReviews] = useState([]);
    const [pastEvents, setPastEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [hoveredStar, setHoveredStar] = useState(0);

    useEffect(() => {
        const loadData = async () => {
            try {
                // 1. Load User Bookings
                const tickets = await fetchUserTickets();

                // 2. Filter for Past Events
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const past = tickets.filter(t => new Date(t.date) < today);
                setPastEvents(past);

                // 3. Load Existing Reviews from LocalStorage
                const storedReviews = localStorage.getItem('user_reviews');
                if (storedReviews) {
                    setReviews(JSON.parse(storedReviews));
                } else {
                    // Default Mock Reviews for demo
                    const mockReviews = [
                        {
                            id: 101,
                            eventId: 999, // mismatched ID to not conflict easily
                            event: "Tech Innovators Meetup",
                            rating: 4,
                            comment: "Great networking opportunity, but the lunch break was a bit too short.",
                            date: new Date(Date.now() - 2592000000).toLocaleDateString() // 1 month ago
                        }
                    ];
                    setReviews(mockReviews);
                    localStorage.setItem('user_reviews', JSON.stringify(mockReviews));
                }
            } catch (error) {
                console.error("Failed to load review data", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleSubmitReview = (e) => {
        e.preventDefault();
        if (!selectedEventId || rating === 0) return;

        const eventToReview = pastEvents.find(e => e.id === selectedEventId || e.ticketId === selectedEventId); // Handle both ID types
        if (!eventToReview) return;

        const newReview = {
            id: Date.now(),
            eventId: selectedEventId,
            event: eventToReview.title,
            rating: rating,
            comment: comment,
            date: new Date().toLocaleDateString()
        };

        const updatedReviews = [newReview, ...reviews];
        setReviews(updatedReviews);
        localStorage.setItem('user_reviews', JSON.stringify(updatedReviews));

        // Reset Form
        setRating(0);
        setComment('');
        setSelectedEventId(null);
        setActiveTab('history');
    };

    // Filter "To Review" list: Past events that DO NOT have a review yet
    const eventsToReview = pastEvents.filter(event =>
        !reviews.some(r => r.eventId === event.id || r.eventId === event.ticketId)
    );

    if (loading) return <div className="p-8 text-center text-[var(--text-muted)]">Loading...</div>;

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl animate-in fade-in duration-500">
            <h2 className="text-3xl font-bold text-[var(--text-page)] mb-2">Reviews & Ratings</h2>
            <p className="text-[var(--text-muted)] mb-8">Share your experience for events you've attended.</p>

            {/* Tabs */}
            <div className="flex gap-6 border-b border-[var(--border-color)] mb-8">
                <button
                    onClick={() => setActiveTab('to-review')}
                    className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === 'to-review' ? 'text-[#FFDA8A]' : 'text-[var(--text-muted)] hover:text-[var(--text-page)]'}`}
                >
                    Write a Review ({eventsToReview.length})
                    {activeTab === 'to-review' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FFDA8A] rounded-t-full"></span>}
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === 'history' ? 'text-[#FFDA8A]' : 'text-[var(--text-muted)] hover:text-[var(--text-page)]'}`}
                >
                    My History ({reviews.length})
                    {activeTab === 'history' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FFDA8A] rounded-t-full"></span>}
                </button>
            </div>

            {/* Content */}
            <div className="space-y-6">
                {activeTab === 'to-review' && (
                    eventsToReview.length > 0 ? (
                        eventsToReview.map(event => (
                            <div key={event.ticketId} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-[var(--border-color)] shadow-sm">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-xl font-bold text-[var(--text-page)]">{event.title}</h3>
                                        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mt-1">
                                            <Calendar size={14} />
                                            <span>{event.date}</span>
                                        </div>
                                    </div>
                                    {selectedEventId !== event.ticketId && (
                                        <button
                                            onClick={() => setSelectedEventId(event.ticketId)}
                                            className="px-4 py-2 bg-[#FFDA8A] hover:bg-[#ffc107] text-gray-900 rounded-lg font-semibold text-sm transition-colors"
                                        >
                                            Write Review
                                        </button>
                                    )}
                                </div>

                                {/* Review Form (Expanded) */}
                                {selectedEventId === event.ticketId && (
                                    <form onSubmit={handleSubmitReview} className="bg-gray-50 dark:bg-slate-900 rounded-xl p-6 border border-[var(--border-color)] animate-in slide-in-from-top-2 duration-300">
                                        <div className="mb-4">
                                            <label className="block text-sm font-bold text-[var(--text-muted)] mb-2">Your Rating</label>
                                            <div className="flex gap-2">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onClick={() => setRating(star)}
                                                        onMouseEnter={() => setHoveredStar(star)}
                                                        onMouseLeave={() => setHoveredStar(0)}
                                                        className="transition-transform hover:scale-110 focus:outline-none"
                                                    >
                                                        <Star
                                                            size={28}
                                                            className={`${star <= (hoveredStar || rating) ? 'fill-[#FFDA8A] text-[#FFDA8A]' : 'fill-gray-200 dark:fill-slate-700 text-gray-300 dark:text-slate-600'}`}
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-sm font-bold text-[var(--text-muted)] mb-2">Your Experience</label>
                                            <textarea
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                placeholder="Tell us what you liked or didn't like..."
                                                className="w-full p-4 bg-white dark:bg-slate-800 border border-[var(--border-color)] rounded-xl text-[var(--text-page)] focus:outline-none focus:ring-2 focus:ring-[#FFDA8A] min-h-[100px]"
                                                required
                                            ></textarea>
                                        </div>

                                        <div className="flex gap-3 justify-end">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedEventId(null);
                                                    setRating(0);
                                                    setComment('');
                                                }}
                                                className="px-4 py-2 text-[var(--text-muted)] hover:text-[var(--text-page)] font-medium"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={rating === 0 || !comment.trim()}
                                                className="px-6 py-2 bg-[#FFDA8A] hover:bg-[#ffc107] text-gray-900 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                Submit Review
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-16 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-dashed border-[var(--border-color)]">
                            <CheckCircle size={48} className="mx-auto text-green-500 mb-4 opacity-50" />
                            <h3 className="text-lg font-medium text-[var(--text-page)]">All caught up!</h3>
                            <p className="text-[var(--text-muted)]">You've reviewed all your past events.</p>
                        </div>
                    )
                )}

                {activeTab === 'history' && (
                    reviews.map(review => (
                        <div key={review.id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-[var(--border-color)] shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="font-bold text-[var(--text-page)] text-lg">{review.event}</h3>
                                <span className="text-sm text-[var(--text-muted)]">{review.date}</span>
                            </div>

                            <div className="flex gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={18}
                                        className={`${i < review.rating ? 'fill-[#FFDA8A] text-[#FFDA8A]' : 'fill-gray-200 dark:fill-slate-700 text-gray-300 dark:text-slate-600'}`}
                                    />
                                ))}
                            </div>

                            <p className="text-[var(--text-muted)] leading-relaxed bg-gray-50 dark:bg-slate-900/50 p-4 rounded-xl">
                                "{review.comment}"
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Reviews;
