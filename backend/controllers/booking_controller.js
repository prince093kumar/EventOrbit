import Booking from "../models/booking_model.js";

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res) => {
    try {
        const { event, seatType, amountPaid, qrCode, attendeeName, quantity = 1, attendeeNames = [] } = req.body;

        // Ensure user is authenticated
        const userId = req.user._id;

        const bookings = [];
        let firstQrCode = null;

        // Find current count for this seat type to determine starting number
        const currentCount = await Booking.countDocuments({
            event: typeof event === 'object' ? (event.id || event._id) : event,
            seatType: seatType
        });

        for (let i = 0; i < quantity; i++) {
            const prefix = (seatType === 'VIP') ? 'A' : 'B';
            const seatNum = `${prefix}-${currentCount + i + 1}`;
            const specificAttendeeName = attendeeNames[i] || attendeeName;

            // Generate unique QR for each ticket
            // Use the first one provided for the first ticket, generate new ones for others if not provided
            const specificQrCode = i === 0 ? qrCode : `TIX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
            if (i === 0) firstQrCode = specificQrCode;

            const booking = await Booking.create({
                user: userId,
                event,
                seatType,
                seatNumber: seatNum,
                amountPaid: amountPaid / quantity, // Split total amount per ticket for tracking
                qrCode: specificQrCode,
                attendeeName: specificAttendeeName
            });

            bookings.push(booking);
        }

        // Return the first booking or a summary, but client expects one object usually.
        // We'll return the first one as primary, but maybe include all in a 'tickets' array if client supports it.
        // For backward compatibility, return the first created booking object as 'data'.

        const primaryBooking = bookings[0];

        // Populate event details for real-time update
        await primaryBooking.populate(['event', 'user']);

        // Emit real-time update (Summary of bulk booking)
        if (req.io) {
            const prefix = (seatType === 'VIP') ? 'A' : 'B';
            req.io.emit('newBooking', {
                eventTitle: primaryBooking.event.title,
                amountPaid,
                seatType,
                seatNumber: `${prefix}-${currentCount + 1} to ${prefix}-${currentCount + quantity}`,
                timestamp: new Date(),
                customerName: attendeeName || primaryBooking.user.fullName,
                quantity: quantity
            });
            console.log("Emitted newBooking event for", primaryBooking.event.title);
        }

        res.status(201).json({
            success: true,
            data: primaryBooking, // Return first ticket as main reference
            tickets: bookings // Return all tickets if client needs them
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

// @desc    Get User's Bookings
// @route   GET /api/bookings/my-tickets
// @access  Private
export const getMyBookings = async (req, res) => {
    try {
        const userId = req.user._id;
        const bookings = await Booking.find({ user: userId })
            .populate('event', 'title venue date time location price') // Ensure these fields exist in Event model
            .sort({ createdAt: -1 });

        const formattedBookings = bookings.map(b => ({
            ticketId: b.qrCode,
            event: b.event, // Include the populated event object
            title: b.event.title,
            location: b.event.venue,
            date: b.event.date,
            time: b.event.time,
            selectedType: b.seatType,
            seat: b.seatNumber,
            pricePaid: b.amountPaid,
            attendeeName: b.attendeeName,
            status: b.status,
            cancellationReason: b.cancellationReason
        }));

        res.json({ success: true, bookings: formattedBookings });
    } catch (error) {
        console.error("Error fetching my tickets:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Verify Ticket (Gate Check-In)
// @route   POST /api/bookings/verify
// @access  Private (Organizer/Admin)
export const verifyTicket = async (req, res) => {
    try {
        const { ticketId, eventId } = req.body; // ticketId matches qrCode field

        const booking = await Booking.findOne({ qrCode: ticketId })
            .populate('user', 'fullName email phone')
            .populate('event', 'title organizer');

        if (!booking) {
            return res.status(404).json({ success: false, message: "Invalid Ticket ID" });
        }

        // Check if ticket belongs to the requested event (optional security check)
        if (eventId && booking.event._id.toString() !== eventId) {
            return res.status(400).json({ success: false, message: "Ticket is for a different event" });
        }

        if (booking.status === 'cancelled') {
            return res.status(400).json({ success: false, message: "Ticket has been CANCELLED" });
        }

        if (booking.status === 'checked_in') {
            return res.status(400).json({ success: false, message: "Ticket already used for check-in" });
        }

        // Update status
        booking.status = 'checked_in';
        await booking.save();

        // Emit Real-Time Alert to Organizer
        // Find the organizer ID from the event (booking.event.organizer)
        // Ideally we emit to a room specific to the organizer, but for now we emit globally or check client side
        if (req.io) {
            req.io.emit('checkInAlert', {
                eventTitle: booking.event.title,
                attendeeName: booking.attendeeName || booking.user.fullName,
                seatType: booking.seatType,
                ticketId: booking.qrCode,
                timestamp: new Date(),
                organizerId: booking.event.organizer // Frontend can filter by this
            });
            console.log(`Check-in alert emitted for ticket ${ticketId}`);
        }

        res.json({
            success: true,
            message: "Check-In Successful",
            data: {
                attendee: booking.attendeeName || booking.user.fullName,
                seatType: booking.seatType,
                seatNumber: booking.seatNumber,
                event: booking.event.title
            }
        });

    } catch (error) {
        console.error("Check-In Error:", error);
        res.status(500).json({ success: false, message: "Server Error during verification" });
    }
};
