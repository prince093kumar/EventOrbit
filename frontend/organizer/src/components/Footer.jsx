import React from 'react';
import { Mail, Ticket } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-slate-900 border-t border-[var(--border-color)] pt-10 pb-6 mt-auto transition-colors z-30 relative shadow-sm">
            <div className="container mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
                    {/* Brand Section */}
                    <div className="col-span-1 md:col-span-4">
                        <Link to="/" className="text-xl font-bold text-[#FFDA8A] flex items-center gap-2 mb-4">
                            <Ticket className="fill-[#FFDA8A] text-[#FFDA8A]" size={20} />
                            <span className="text-gray-900 dark:text-white">EventOrbit <span className="text-yellow-500 font-normal">Organizer</span></span>
                        </Link>
                        <p className="text-[var(--text-muted)] text-xs leading-relaxed mb-6 max-w-sm">
                            Empowering organizers to create, manage, and scale world-class events. Your command center for success.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="col-span-1 md:col-span-2">
                        <h4 className="font-bold text-[var(--text-page)] mb-4 text-base">Dashboard</h4>
                        <ul className="space-y-2 text-xs text-[var(--text-muted)]">
                            <li><Link to="/create-event" className="hover:text-[#FFDA8A] transition-colors">Create Event</Link></li>
                            <li><Link to="/attendees" className="hover:text-[#FFDA8A] transition-colors">Attendees</Link></li>
                            <li><Link to="/revenue" className="hover:text-[#FFDA8A] transition-colors">Revenue</Link></li>
                            <li><Link to="/live-monitor" className="hover:text-[#FFDA8A] transition-colors">Live Monitor</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="col-span-1 md:col-span-2">
                        <h4 className="font-bold text-[var(--text-page)] mb-4 text-base">Resources</h4>
                        <ul className="space-y-2 text-xs text-[var(--text-muted)]">
                            <li><a href="#" className="hover:text-[#FFDA8A] transition-colors">Organizer Guide</a></li>
                            <li><a href="#" className="hover:text-[#FFDA8A] transition-colors">API Documentation</a></li>
                            <li><a href="#" className="hover:text-[#FFDA8A] transition-colors">Support Center</a></li>
                            <li><a href="#" className="hover:text-[#FFDA8A] transition-colors">Terms for Organizers</a></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="col-span-1 md:col-span-4">
                        <div className="bg-gray-50 dark:bg-slate-800 p-5 rounded-xl border border-gray-100 dark:border-slate-700">
                            <h4 className="font-bold text-[var(--text-page)] mb-2 text-base">Organizer Updates</h4>
                            <p className="text-[var(--text-muted)] text-xs mb-4">Get the latest tips, trends, and feature updates for event organizers.</p>
                            <div className="flex flex-col gap-2">
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="email"
                                        placeholder="Enter your email address"
                                        className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#FFDA8A]/50 focus:border-[#FFDA8A] transition-all"
                                    />
                                </div>
                                <button className="bg-gradient-to-r from-[#FFDA8A] to-[#ffc107] text-gray-900 py-2.5 rounded-lg text-xs font-bold hover:shadow-md hover:shadow-[#FFDA8A]/20 transition-all transform hover:-translate-y-0.5">
                                    Subscribe Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-[var(--border-color)] flex justify-center items-center">
                    <p className="text-[var(--text-muted)] text-xs font-medium text-center">© 2025 EventOrbit. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
