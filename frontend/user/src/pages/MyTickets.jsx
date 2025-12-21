import React, { useState } from 'react';
import { MapPin, Calendar, QrCode, Download, Ticket, User, Star, X, Loader2 } from 'lucide-react';
import { submitReview } from '../api/eventApi';

import domToImage from 'dom-to-image-more';
import { QRCodeCanvas } from 'qrcode.react';

const MyTickets = () => {
    // ... (state matching original)
    const [tickets, setTickets] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [activeTab, setActiveTab] = React.useState('upcoming');
    const [downloadingTicketId, setDownloadingTicketId] = React.useState(null);

    // Review Modal State
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [reviewLoading, setReviewLoading] = useState(false);
    const [selectedTicketId, setSelectedTicketId] = useState(null); // Actually handling event ID
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    React.useEffect(() => {
        const loadTickets = async () => {
            try {
                const data = await import('../api/eventApi').then(module => module.fetchUserTickets());
                // Sort by rawDate descending
                setTickets(data.sort((a, b) => new Date(a.rawDate) - new Date(b.rawDate)));
            } catch (error) {
                console.error("Failed to load tickets", error);
            } finally {
                setLoading(false);
            }
        };
        loadTickets();
    }, []);

    const handleDownload = async (ticketId) => {
        const element = document.getElementById(`ticket-${ticketId}`);
        if (!element) return;

        // Clone/Style fixes for capture
        const filter = (node) => {
            return (node.tagName !== 'BUTTON'); // Exclude the download button
        }

        setDownloadingTicketId(ticketId);
        // Delay to allow react to update the DOM with 'downloading' classes
        await new Promise(resolve => setTimeout(resolve, 200));

        try {
            // Get the computed background color
            const computedStyle = window.getComputedStyle(element);
            const bgColor = computedStyle.backgroundColor;

            const dataUrl = await domToImage.toPng(element, {
                bgcolor: bgColor,
                filter: filter,
                scale: 3,
                style: {
                    'margin': '0',
                    'border': 'none',
                    'box-shadow': 'none',
                    'border-radius': '0'
                }
            });

            const link = document.createElement('a');
            link.download = `EventOrbit-Ticket-${ticketId}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error("Download failed:", err);
            alert("Failed to download ticket. Please try again.");
        } finally {
            setDownloadingTicketId(null);
        }
    };

    const handleOpenReview = (eventId) => {
        setSelectedEventId(eventId);
        setRating(5);
        setComment('');
        setIsReviewModalOpen(true);
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        setReviewLoading(true);
        try {
            await submitReview(selectedEventId, rating, comment);
            alert("Review submitted successfully!");
            setIsReviewModalOpen(false);
        } catch (error) {
            console.error("Review failed", error);
            alert(error.response?.data?.message || "Failed to submit review");
        } finally {
            setReviewLoading(false);
        }
    };

    const filteredTickets = tickets.filter(ticket => {
        const ticketDate = new Date(ticket.rawDate || ticket.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // If ticket is checked-in, it goes to Past Events
        // If ticket is upcoming AND NOT checked-in, it stays in Upcoming
        if (activeTab === 'upcoming') {
            return ticketDate >= today && ticket.status !== 'checked_in';
        } else {
            return ticketDate < today || ticket.status === 'checked_in';
        }
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFDA8A]"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl animate-in fade-in duration-500 relative">
            <h1 className="text-3xl font-bold text-[var(--text-page)] mb-2">My Tickets</h1>
            <p className="text-[var(--text-muted)] mb-8">Manage your bookings and download tickets.</p>

            {/* Tabs */}
            <div className="flex gap-6 border-b border-[var(--border-color)] mb-8">
                <button
                    onClick={() => setActiveTab('upcoming')}
                    className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === 'upcoming' ? 'text-[#FFDA8A]' : 'text-[var(--text-muted)] hover:text-[var(--text-page)]'
                        }`}
                >
                    Upcoming Events
                    {activeTab === 'upcoming' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FFDA8A] rounded-t-full"></span>}
                </button>
                <button
                    onClick={() => setActiveTab('past')}
                    className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === 'past' ? 'text-[#FFDA8A]' : 'text-[var(--text-muted)] hover:text-[var(--text-page)]'
                        }`}
                >
                    Past Events
                    {activeTab === 'past' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FFDA8A] rounded-t-full"></span>}
                </button>
            </div>

            {/* Ticket List */}
            {filteredTickets.length > 0 ? (
                filteredTickets.map((ticket) => (
                    <div
                        id={`ticket-${ticket.ticketId}`}
                        key={ticket.ticketId}
                        className={`bg-white dark:bg-slate-800 rounded-2xl overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-shadow group ${downloadingTicketId === ticket.ticketId ? '[&_*]:border-none' : 'border border-gray-100 dark:border-slate-700 shadow-sm'}`}
                    >
                        {/* Left: Event Info */}
                        <div className="p-6 md:p-8 flex-1">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${ticket.status === 'confirmed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-500'
                                    }`}>
                                    {ticket.status}
                                </div>
                                <span className="text-xs text-[var(--text-muted)]">Booked on {ticket.bookedDate}</span>
                            </div>

                            <h3 className="text-2xl font-bold text-[var(--text-page)] mb-4">{ticket.title}</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm text-[var(--text-muted)] mb-8">
                                <div className="flex items-center gap-3">
                                    <Calendar size={18} className="text-[#FFDA8A]" />
                                    <span>{ticket.date} • {ticket.time || 'Time TBA'}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <MapPin size={18} className="text-[#FFDA8A]" />
                                    <span>{ticket.location}</span>
                                </div>
                                <div className="flex items-center gap-3 col-span-2">
                                    <User size={18} className="text-[#FFDA8A]" />
                                    <span>Booked By: {ticket.attendeeName || 'Guest'}</span>
                                </div>
                            </div>

                            <div className={`flex flex-wrap gap-8 pt-6 ${downloadingTicketId === ticket.ticketId ? 'mt-6' : 'border-t border-[var(--border-color)]'}`}>
                                <div>
                                    <p className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-wider mb-1">SEAT</p>
                                    <p className="text-lg font-bold text-[var(--text-page)]">{ticket.seat}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-wider mb-1">TYPE</p>
                                    <p className="text-lg font-bold text-[var(--text-page)]">{ticket.type}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-wider mb-1">PRICE</p>
                                    <p className="text-lg font-bold text-[var(--text-page)]">{ticket.price}</p>
                                </div>
                            </div>
                        </div>

                        {/* Right: Ticket Stub / QR / Actions */}
                        <div className={`w-full md:w-72 bg-gray-50 dark:bg-slate-900 p-6 flex flex-col items-center justify-center relative ${downloadingTicketId === ticket.ticketId ? '' : 'border-t md:border-t-0 md:border-l border-dashed border-[var(--border-color)]'}`}>
                            {/* Semi-circles for ticket stub look */}
                            {downloadingTicketId !== ticket.ticketId && (
                                <>
                                    <div className="hidden md:block absolute -left-3 top-0 bottom-0 m-auto h-6 w-6 bg-[var(--bg-page)] rounded-full"></div>
                                    <div className="hidden md:block absolute -right-3 top-0 bottom-0 m-auto h-6 w-6 bg-[var(--bg-page)] rounded-full"></div>
                                </>
                            )}

                            {/* Show QR only for upcoming/valid tickets */}
                            <div className="bg-white dark:bg-white p-3 rounded-xl shadow-sm mb-4">
                                <QRCodeCanvas
                                    value={ticket.ticketId}
                                    size={100}
                                    level={"H"}
                                    includeMargin={false}
                                />
                            </div>
                            <p className="text-xs font-mono text-[var(--text-muted)] mb-6">{ticket.ticketId}</p>

                            <button
                                onClick={() => handleDownload(ticket.ticketId)}
                                className="flex items-center gap-2 text-[#FFDA8A] hover:text-[#ffc107] text-sm font-semibold transition-colors mb-2"
                            >
                                <Download size={16} />
                                Download Ticket
                            </button>

                            {/* Only Show Review Button if Checked-In */}
                            {ticket.status === 'checked_in' && (
                                <button
                                    onClick={() => handleOpenReview(ticket.event._id || ticket.event)}
                                    className="flex items-center gap-2 bg-[#FFDA8A] text-gray-900 hover:bg-[#ffc107] px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all mt-2"
                                >
                                    <Star size={16} className="fill-current" />
                                    Rate & Review
                                </button>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-20 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-dashed border-[var(--border-color)]">
                    <Ticket size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-[var(--text-muted)]">No {activeTab} tickets found.</p>
                </div>
            )}

            {/* Review Modal */}
            {isReviewModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Write a Review</h3>
                            <button onClick={() => setIsReviewModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmitReview} className="p-6 space-y-6">
                            <div className="flex flex-col items-center gap-2">
                                <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Rate your experience</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            className={`transition-all transform hover:scale-110 ${rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-100 dark:fill-slate-800'}`}
                                        >
                                            <Star size={32} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Your Review</label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Tell us about the event..."
                                    required
                                    className="w-full h-32 px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#FFDA8A] focus:border-[#FFDA8A] outline-none transition-all resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={reviewLoading}
                                className="w-full py-3 bg-[#FFDA8A] hover:bg-[#ffc107] text-gray-900 font-bold rounded-xl shadow-lg shadow-[#FFDA8A]/20 transition-all flex items-center justify-center gap-2"
                            >
                                {reviewLoading ? <Loader2 className="animate-spin" /> : 'Submit Review'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>

    );
};

export default MyTickets;
