import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { bookEvent } from '../api/eventApi';

const BookingModal = ({ event, onClose }) => {
    const [step, setStep] = useState(1);
    const [selectedType, setSelectedType] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [attendeeNames, setAttendeeNames] = useState({}); // Store names by index
    const [loading, setLoading] = useState(false);

    // Parse price
    const prices = typeof event.price === 'object' ? event.price : { Regular: event.price, VIP: (event.price * 2) || 0 };
    const regularPrice = prices.Regular || 0;
    const vipPrice = prices.VIP || 0;

    const handleNext = () => {
        if (step === 1 && selectedType) setStep(2);
        else if (step === 2) {
            // Validate all names are filled
            const allFilled = Array.from({ length: quantity }).every((_, i) => attendeeNames[i] && attendeeNames[i].trim() !== "");
            if (allFilled && quantity > 0) setStep(3);
        }
    };

    const handleConfirm = async () => {
        setLoading(true);
        // Convert object to array
        const namesArray = Array.from({ length: quantity }).map((_, i) => attendeeNames[i]);

        const bookingData = {
            ...event,
            selectedType,
            quantity,
            attendeeNames: namesArray, // Pass array of names
            pricePaid: (selectedType === 'VIP' ? vipPrice : regularPrice) * quantity
        };

        const result = await bookEvent(bookingData);
        setLoading(false);
        alert(result.message);
        if (result.success) onClose();
    };

    const totalPrice = (selectedType === 'VIP' ? vipPrice : regularPrice) * quantity;
    const isStep2Valid = Array.from({ length: quantity }).every((_, i) => attendeeNames[i] && attendeeNames[i].trim() !== "");

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[var(--bg-card)] w-full max-w-md rounded-2xl border border-[var(--border-color)] shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto custom-scrollbar">
                <button onClick={onClose} className="absolute right-4 top-4 text-[var(--text-muted)] hover:text-[var(--text-page)]">
                    <X size={20} />
                </button>

                {/* Progress Indicators */}
                <div className="flex gap-2 mb-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className={`h-1 flex-1 rounded-full ${step >= i ? 'bg-purple-500' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                    ))}
                </div>

                <h2 className="text-xl font-bold text-[var(--text-page)] mb-1">
                    {step === 1 && "Select Ticket Type"}
                    {step === 2 && "Enter Details"}
                    {step === 3 && "Confirm Booking"}
                </h2>
                <p className="text-sm text-[var(--text-muted)] mb-6">{event.title}</p>

                {/* STEP 1: SELECT TYPE */}
                {step === 1 && (
                    <div className="space-y-3 mb-8">
                        {/* Regular */}
                        <div
                            onClick={() => setSelectedType('Regular')}
                            className={`p-4 rounded-xl border-2 cursor-pointer flex justify-between items-center transition-all ${selectedType === 'Regular' ? 'border-purple-500 bg-purple-500/10' : 'border-[var(--border-color)] hover:border-purple-500/50'}`}
                        >
                            <div>
                                <p className="font-semibold text-[var(--text-page)]">Regular</p>
                                <p className="text-xs text-[var(--text-muted)]">Standard Access</p>
                            </div>
                            <div className="text-right">
                                <span className="block font-bold text-[var(--text-page)]">₹{regularPrice}</span>
                                {selectedType === 'Regular' && <Check size={16} className="text-purple-500 ml-auto mt-1" />}
                            </div>
                        </div>
                        {/* VIP */}
                        <div
                            onClick={() => setSelectedType('VIP')}
                            className={`p-4 rounded-xl border-2 cursor-pointer flex justify-between items-center transition-all ${selectedType === 'VIP' ? 'border-[#FFDA8A] bg-[#FFDA8A]/10' : 'border-[var(--border-color)] hover:border-[#FFDA8A]/50'}`}
                        >
                            <div>
                                <p className="font-semibold text-[var(--text-page)]">VIP</p>
                                <p className="text-xs text-[var(--text-muted)]">Premium Access (10% Allocation)</p>
                            </div>
                            <div className="text-right">
                                <span className="block font-bold text-[#FFDA8A]">₹{vipPrice}</span>
                                {selectedType === 'VIP' && <Check size={16} className="text-[#FFDA8A] ml-auto mt-1" />}
                            </div>
                        </div>
                        <button onClick={handleNext} disabled={!selectedType} className="w-full py-3 mt-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold disabled:opacity-50">Next</button>
                    </div>
                )}

                {/* STEP 2: DETAILS */}
                {step === 2 && (
                    <div className="space-y-4 mb-8">
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">Number of Tickets</label>
                            <input
                                type="number" min="1" max="10"
                                value={quantity} onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    if (val >= 1 && val <= 10) setQuantity(val);
                                }}
                                className="w-full p-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-page)] text-[var(--text-page)] focus:ring-2 focus:ring-purple-500 outline-none"
                            />
                        </div>

                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {Array.from({ length: quantity }).map((_, index) => (
                                <div key={index} className="animate-in fade-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: `${index * 50}ms` }}>
                                    <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">
                                        Attendee #{index + 1} Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder={`Name for Ticket ${index + 1}`}
                                        value={attendeeNames[index] || ""}
                                        onChange={(e) => setAttendeeNames(prev => ({ ...prev, [index]: e.target.value }))}
                                        className="w-full p-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-page)] text-[var(--text-page)] focus:ring-2 focus:ring-purple-500 outline-none"
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl border border-[var(--border-color)] text-[var(--text-muted)] hover:bg-[var(--bg-page)]">Back</button>
                            <button onClick={handleNext} disabled={!isStep2Valid} className="flex-1 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold disabled:opacity-50">Next</button>
                        </div>
                    </div>
                )}

                {/* STEP 3: CONFIRM */}
                {step === 3 && (
                    <div className="mb-6">
                        <div className="bg-[var(--bg-page)] p-4 rounded-xl mb-6 space-y-2">
                            <div className="flex justify-between text-sm"><span className="text-[var(--text-muted)]">Ticket Type</span><span className="font-medium text-[var(--text-page)]">{selectedType}</span></div>
                            <div className="flex justify-between text-sm"><span className="text-[var(--text-muted)]">Quantity</span><span className="font-medium text-[var(--text-page)]">x{quantity}</span></div>
                            <div className="border-t border-[var(--border-color)] pt-2 mt-2 space-y-1">
                                <p className="text-xs text-[var(--text-muted)] font-bold uppercase">Attendees</p>
                                {Array.from({ length: quantity }).map((_, i) => (
                                    <div key={i} className="text-sm text-[var(--text-page)] truncate">• {attendeeNames[i]}</div>
                                ))}
                            </div>
                            <div className="border-t border-[var(--border-color)] pt-2 mt-2 flex justify-between text-lg font-bold">
                                <span className="text-[var(--text-page)]">Total</span>
                                <span className="text-purple-500">₹{totalPrice}</span>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-xl border border-[var(--border-color)] text-[var(--text-muted)] hover:bg-[var(--bg-page)]">Back</button>
                            <button onClick={handleConfirm} disabled={loading} className="flex-1 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg shadow-green-500/20">{loading ? 'Processing...' : 'Pay & Book'}</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingModal;
