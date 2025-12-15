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
            <div className="space-y-6">
                {filteredTickets.length > 0 ? (
                    filteredTickets.map((ticket) => (
                        <div
                            id={`ticket-${ticket.ticketId}`}
                            key={ticket.ticketId}
                            className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-shadow group"
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
                                        <span>{ticket.date} • {ticket.time}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <MapPin size={18} className="text-[#FFDA8A]" />
                                        <span>{ticket.location}</span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-8 pt-6 border-t border-[var(--border-color)]">
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

                            {/* Right: Ticket Stub / QR */}
                            <div className="w-full md:w-72 bg-gray-50 dark:bg-slate-900 border-t md:border-t-0 md:border-l border-dashed border-[var(--border-color)] p-6 flex flex-col items-center justify-center relative">
                                {/* Semi-circles for ticket stub look */}
                                <div className="hidden md:block absolute -left-3 top-0 bottom-0 m-auto h-6 w-6 bg-[var(--bg-page)] rounded-full"></div>
                                <div className="hidden md:block absolute -right-3 top-0 bottom-0 m-auto h-6 w-6 bg-[var(--bg-page)] rounded-full"></div>

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
                                    className="flex items-center gap-2 text-[#FFDA8A] hover:text-[#ffc107] text-sm font-semibold transition-colors"
                                >
                                    <Download size={16} />
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
