import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { Star, Trash2, MessageSquare, Search, Filter, Loader2, AlertCircle } from 'lucide-react';

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRating, setFilterRating] = useState('all');

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/reviews');
            if (response.data.success) {
                setReviews(response.data.reviews);
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleDelete = async (reviewId) => {
        if (!window.confirm("Are you sure you want to delete this review?")) return;

        try {
            await apiClient.delete(`/reviews/${reviewId}`);
            setReviews(reviews.filter(r => r._id !== reviewId));
        } catch (error) {
            alert("Failed to delete review");
        }
    };

    const filteredReviews = reviews.filter(review => {
        const matchesSearch =
            review.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            review.event?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            review.comment?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRating = filterRating === 'all' || review.rating.toString() === filterRating;

        return matchesSearch && matchesRating;
    });

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Reviews & Ratings</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage all user feedback across the platform</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex-1 min-w-[300px] relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by user, event, or comment..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter size={18} className="text-slate-400" />
                    <select
                        className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
                        value={filterRating}
                        onChange={(e) => setFilterRating(e.target.value)}
                    >
                        <option value="all">All Ratings</option>
                        <option value="5">5 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="2">2 Stars</option>
                        <option value="1">1 Star</option>
                    </select>
                </div>
            </div>

            {/* Reviews Table */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                {loading ? (
                    <div className="p-20 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
                        <Loader2 className="animate-spin mb-4" size={40} />
                        <p>Loading reviews...</p>
                    </div>
                ) : filteredReviews.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Event</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Rating</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Comment</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                {filteredReviews.map((review) => (
                                    <tr key={review._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-yellow-500/10 text-yellow-600 flex items-center justify-center font-bold text-xs">
                                                    {review.user?.fullName?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900 dark:text-white">{review.user?.fullName}</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">{review.user?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-medium text-slate-900 dark:text-white">{review.event?.title}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={14}
                                                        className={`${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200 dark:text-slate-700'}`}
                                                    />
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xs truncate">{review.comment}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(review._id)}
                                                className="p-2 text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-lg transition-colors"
                                                title="Delete Review"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-20 text-center">
                        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MessageSquare className="text-slate-300 dark:text-slate-600" size={32} />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900 dark:text-white">No reviews found</h3>
                        <p className="text-slate-500 dark:text-slate-400">Wait for users to start reviewing events.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reviews;
