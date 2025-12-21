import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, AlertCircle, Loader2, X, History, PenTool, Calendar } from 'lucide-react';
import { fetchUserTickets, fetchUserReviews, submitReview } from '../api/eventApi';

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [eligibleEvents, setEligibleEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('history'); // Default to History as per screenshot emphasis

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [hoveredStar, setHoveredStar] = useState(0);

    const loadData = async () => {
        setLoading(true);
        try {
            const [userReviews, userTickets] = await Promise.all([
                fetchUserReviews(),
                fetchUserTickets()
            ]);

            setReviews(userReviews);

            // Filter eligible events: 
            // 1. Checked-in 
            // 2. Not yet reviewed
            const reviewedEventIds = new Set(userReviews.map(r => r.event?._id || r.event));
            const eligible = userTickets
                .filter(ticket => ticket.status === 'checked_in')
                .filter(ticket => !reviewedEventIds.has(ticket.event._id || ticket.event));

            // Remove duplicates (in case of multiple tickets for same event)
            const uniqueEligible = [];
            const seenEvents = new Set();
            for (const t of eligible) {
                const eId = t.event._id || t.event;
                if (!seenEvents.has(eId)) {
                    seenEvents.add(eId);
                    uniqueEligible.push(t);
                }
            }

            setEligibleEvents(uniqueEligible);

            // If no history but has eligible, switch to write tab
            if (userReviews.length === 0 && uniqueEligible.length > 0) {
                setActiveTab('write');
            }

        } catch (error) {
            console.error("Failed to load review data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleOpenReview = (eventId) => {
        setSelectedEventId(eventId);
        setRating(5);
        setComment('');
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await submitReview(selectedEventId, rating, comment);
            setIsModalOpen(false);
            // Reload data to move from eligible to history
            loadData();
            setActiveTab('history');
        } catch (error) {
            alert("Failed to submit review");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl animate-in fade-in duration-500">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[var(--text-page)] mb-2">Reviews & Ratings</h1>
                <p className="text-[var(--text-muted)]">Share your experience for events you've attended.</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-8 border-b border-[var(--border-color)] mb-8">
                <button
                    onClick={() => setActiveTab('write')}
                    className={`pb-4 text-sm font-medium transition-colors relative flex items-center gap-2 ${activeTab === 'write' ? 'text-[#FFDA8A]' : 'text-[var(--text-muted)] hover:text-[var(--text-page)]'}`}
                >
                    Write a Review ({eligibleEvents.length})
                    {activeTab === 'write' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FFDA8A] rounded-t-full"></span>}
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`pb-4 text-sm font-medium transition-colors relative flex items-center gap-2 ${activeTab === 'history' ? 'text-[#FFDA8A]' : 'text-[var(--text-muted)] hover:text-[var(--text-page)]'}`}
                >
                    My History ({reviews.length})
                    {activeTab === 'history' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FFDA8A] rounded-t-full"></span>}
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-[#FFDA8A]" size={32} />
                </div>
            ) : (
                <>
                    {/* Write Tab */}
                    {activeTab === 'write' && (
                        <div className="space-y-4">
                            {eligibleEvents.length > 0 ? (
                                eligibleEvents.map(ticket => (
                                    <div key={ticket.ticketId} className="bg-[var(--bg-card)] p-6 rounded-xl border border-[var(--border-color)] flex justify-between items-center group hover:shadow-md transition-shadow">
                                        <div>
                                            <h3 className="font-bold text-[var(--text-page)] text-lg mb-1">{ticket.title}</h3>
                                            <div className="text-sm text-[var(--text-muted)] flex items-center gap-4">
                                                <span className="flex items-center gap-1"><Calendar size={14} /> {ticket.date}</span>
                                                <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded text-xs font-bold uppercase">Attended</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleOpenReview(ticket.event._id || ticket.event)}
                                            className="bg-[#FFDA8A]/10 text-[#FFDA8A] hover:bg-[#FFDA8A] hover:text-gray-900 px-5 py-2.5 rounded-lg font-semibold transition-all flex items-center gap-2"
                                        >
                                            <PenTool size={16} />
                                            Write Review
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-20 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-[var(--border-color)]">
                                    <p className="text-[var(--text-muted)]">No pending reviews. You're all caught up!</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* History Tab */}
                    {activeTab === 'history' && (
                        <div className="space-y-4">
                            {reviews.length > 0 ? (
                                reviews.map(review => (
                                    <div key={review._id} className="bg-[#1e2330] dark:bg-[#1e2330] p-6 rounded-xl border border-gray-800 shadow-sm">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="font-bold text-white text-lg">{review.event?.title || 'Unknown Event'}</h3>
                                            <span className="text-sm text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                                        </div>

                                        <div className="flex gap-1 mb-4">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={18}
                                                    className={`${i < review.rating ? 'fill-[#FFDA8A] text-[#FFDA8A]' : 'fill-gray-700 text-gray-700'}`}
                                                />
                                            ))}
                                        </div>

                                        <div className="bg-[#161b22] p-4 rounded-lg">
                                            <p className="text-gray-300 italic">"{review.comment}"</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-20 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-[var(--border-color)]">
                                    <History size={48} className="mx-auto text-gray-300 mb-4" />
                                    <p className="text-[var(--text-muted)]">No review history yet.</p>
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}

            {/* Review Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white dark:bg-[#1e2330] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-700">
                        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Write a Review</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="flex flex-col items-center gap-2">
                                <label className="text-sm font-medium text-gray-400 uppercase tracking-wide">Rate your experience</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHoveredStar(star)}
                                            onMouseLeave={() => setHoveredStar(0)}
                                            className="focus:outline-none transition-transform hover:scale-110"
                                        >
                                            <Star
                                                size={32}
                                                className={`${star <= (hoveredStar || rating)
                                                    ? 'fill-[#FFDA8A] text-[#FFDA8A]'
                                                    : 'fill-gray-700 text-gray-700'}`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Your Review</label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Share your experience..."
                                    required
                                    className="w-full h-32 px-4 py-3 bg-[#161b22] border border-gray-700 rounded-xl focus:ring-2 focus:ring-[#FFDA8A] focus:border-[#FFDA8A] outline-none transition-all resize-none text-white"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-3 bg-[#FFDA8A] hover:bg-[#ffc107] text-gray-900 font-bold rounded-xl shadow-lg shadow-[#FFDA8A]/20 transition-all flex items-center justify-center gap-2"
                            >
                                {submitting ? <Loader2 className="animate-spin" /> : 'Submit Review'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reviews;
