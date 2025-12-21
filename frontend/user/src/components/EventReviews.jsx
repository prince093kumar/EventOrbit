import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, AlertCircle } from 'lucide-react';
import { fetchReviews } from '../api/eventApi';
import { useAuth } from '../context/AuthContext';

const EventReviews = ({ eventId, eventDate }) => {
    const { isAuthenticated } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [hoveredStar, setHoveredStar] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const isEventPast = new Date(eventDate) < new Date();

    useEffect(() => {
        const loadReviews = async () => {
            const data = await fetchReviews(eventId);
            setReviews(data);
            setLoading(false);
        };
        loadReviews();
    }, [eventId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) return;

        setSubmitting(true);
        setError(null);
        try {
            const res = await submitReview(eventId, { rating, comment });
            setReviews([res.review, ...reviews]);
            setSuccess("Review submitted successfully!");
            setRating(0);
            setComment('');
        } catch (err) {
            setError(err.message || "Failed to submit review");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="text-[var(--text-muted)]">Loading reviews...</div>;

    return (
        <div className="mt-12">
            <h3 className="text-2xl font-bold text-[var(--text-page)] mb-6 flex items-center gap-2">
                <MessageSquare className="text-[#FFDA8A]" />
                Reviews & Ratings
            </h3>

            {/* Review Form Removed - Reviews are now submitted via My Tickets for attended events only */}
            <div className="bg-blue-500/10 text-blue-400 p-4 rounded-xl border border-blue-500/20 mb-8 flex items-center gap-3">
                <AlertCircle size={20} />
                <span>To review this event, please visit "My Tickets" after checking in.</span>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
                {reviews.length > 0 ? (
                    reviews.map(review => (
                        <div key={review._id} className="bg-[var(--bg-card)] p-5 rounded-xl border border-[var(--border-color)]">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <span className="font-bold text-[var(--text-page)]">{review.user ? review.user.fullName : 'Anonymous'}</span>
                                    <span className="text-xs text-[var(--text-muted)] ml-2">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={14}
                                            className={`${i < review.rating ? 'fill-[#FFDA8A] text-[#FFDA8A]' : 'fill-gray-700 text-gray-700'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                            <p className="text-[var(--text-muted)] text-sm">{review.comment}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-[var(--text-muted)] italic">No reviews yet. Be the first to share your experience!</p>
                )}
            </div>
        </div>
    );
};

export default EventReviews;
