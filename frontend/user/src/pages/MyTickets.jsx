import React from 'react';
import { MapPin, Calendar, QrCode, Download, Ticket } from 'lucide-react';

import domToImage from 'dom-to-image-more';
import { QRCodeCanvas } from 'qrcode.react';

const MyTickets = () => {
    // ... (state matching original)
    const [tickets, setTickets] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [activeTab, setActiveTab] = React.useState('upcoming');

    React.useEffect(() => {
        const loadTickets = async () => {
            try {
                const data = await import('../api/eventApi').then(module => module.fetchUserTickets());
                // Sort by date descending
                setTickets(data.sort((a, b) => new Date(a.date) - new Date(b.date)));
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

        try {
            const dataUrl = await domToImage.toPng(element, {
                bgcolor: '#ffffff',
                scale: 2
            });

            const link = document.createElement('a');
            link.download = `EventOrbit-Ticket-${ticketId}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error("Download failed:", err);
            alert("Failed to download ticket. Please try again.");
        }
    };

    const filteredTickets = tickets.filter(ticket => {
        const ticketDate = new Date(ticket.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (activeTab === 'upcoming') {
            return ticketDate >= today;
        } else {
            return ticketDate < today;
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
        <div className="container mx-auto px-4 py-8 max-w-5xl animate-in fade-in duration-500">
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
            <div className="space-y-8">
                {filteredTickets.length > 0 ? (
                    filteredTickets.map((ticket) => (
                        <div key={ticket.ticketId} className="flex flex-col items-center">
                            {/* Download Wrapper - This element allows capturing the whole ticket */}
                            <div id={`ticket-${ticket.ticketId}`} className="w-full max-w-4xl bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col md:flex-row border border-gray-200 dark:border-slate-700 relative">

                                {/* Left Side - Main Ticket Info */}
                                <div className="flex-1 p-6 md:p-8 relative">
                                    {/* Decorative Circles for 'perforation' effect */}
                                    <div className="absolute -right-3 top-1/2 w-6 h-6 bg-[var(--bg-page)] rounded-full transform -translate-y-1/2 z-10 hidden md:block"></div>

                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-page)] mb-2">{ticket.title || 'Event Title'}</h2>
                                            <p className="text-[var(--text-muted)] flex items-center gap-2">
                                                <MapPin size={16} /> {ticket.location || 'Location TBA'}
                                            </p>
                                        </div>
                                        <div className={`px-4 py-1.5 rounded-lg text-sm font-bold uppercase tracking-wider ${ticket.selectedType === 'VIP' ? 'bg-[#FFDA8A] text-black' : 'bg-purple-100 text-purple-700'}`}>
                                            {ticket.selectedType || 'Standard'}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                                        <div>
                                            <p className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-wider mb-1">Date</p>
                                            <p className="font-semibold text-[var(--text-page)]">{ticket.date || 'Date TBA'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-wider mb-1">Time</p>
                                            <p className="font-semibold text-[var(--text-page)]">
                                                {ticket.time || (ticket.date ? new Date(ticket.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Time TBA')}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-wider mb-1">Seat</p>
                                            <p className="font-semibold text-[var(--text-page)]">{ticket.seat || 'GA'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-wider mb-1">Price</p>
                                            <p className="font-semibold text-[var(--text-page)]">
                                                ₹{ticket.pricePaid || (typeof ticket.price === 'number' ? ticket.price : '0')}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-dashed border-gray-300 dark:border-gray-600 flex justify-between items-end">
                                        <div>
                                            <p className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-wider mb-1">Attendee</p>
                                            <p className="font-bold text-lg text-[var(--text-page)]">{ticket.attendeeName || 'Guest'}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-[var(--text-muted)] mb-1">Ticket Code</p>
                                            <p className="font-mono font-bold text-[var(--text-page)]">{ticket.ticketId}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side - Stub / QR */}
                                <div className="w-full md:w-80 bg-gray-50 dark:bg-slate-900 border-t md:border-t-0 md:border-l-2 border-dashed border-gray-300 dark:border-gray-600 p-8 flex flex-col items-center justify-center relative">
                                    {/* Perforation circles match left side */}
                                    <div className="absolute -left-3 top-1/2 w-6 h-6 bg-[var(--bg-page)] rounded-full transform -translate-y-1/2 z-10 hidden md:block"></div>

                                    <div className="bg-white p-3 rounded-xl shadow-sm mb-4">
                                        <QRCodeCanvas
                                            value={JSON.stringify({ id: ticket.ticketId, event: ticket.title, status: ticket.status })}
                                            size={120}
                                            level={"H"}
                                            fgColor={ticket.status === 'cancelled' ? '#EF4444' : '#000000'}
                                        />
                                    </div>
                                    <p className="text-xs text-[var(--text-muted)] text-center mb-1">
                                        {ticket.status === 'cancelled' ? 'Ticket Invalid' : 'Scan at entry'}
                                    </p>
                                    <p className={`text-sm font-bold ${ticket.status === 'cancelled' ? 'text-red-500' : ticket.status === 'checked_in' ? 'text-green-600' : 'text-[var(--text-page)]'}`}>
                                        {(ticket.status || 'CONFIRMED').toUpperCase().replace('_', ' ')}
                                    </p>
                                    {ticket.status === 'cancelled' && ticket.cancellationReason && (
                                        <div className="mt-2 text-xs text-red-500 text-center bg-red-50 p-2 rounded w-full">
                                            Reason: {ticket.cancellationReason}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons (outside download area) */}
                            <div className="mt-4 flex gap-4">
                                <button
                                    onClick={() => handleDownload(ticket.ticketId)}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-[#FFDA8A] text-gray-900 rounded-xl font-bold hover:bg-[#ffc107] transition-colors shadow-lg shadow-orange-500/20"
                                >
                                    <Download size={18} />
                                    Download Ticket
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-dashed border-[var(--border-color)]">
                        <Ticket size={48} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-[var(--text-muted)]">No {activeTab} tickets found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyTickets;
