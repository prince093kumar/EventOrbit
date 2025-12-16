import Booking from "../models/booking_model.js";

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res) => {
    try {
        const { event, seatType, seatNumber, amountPaid, qrCode, attendeeName } = req.body;

        // Ensure user is authenticated
        const userId = req.user._id;

        const booking = await Booking.create({
            user: userId,
            event,
            seatType,
            seatNumber,
            amountPaid,
            qrCode,
            attendeeName // Save the specific attendee name
        });

        // Populate event details for real-time update
        await booking.populate(['event', 'user']);

        // Emit real-time update
        if (req.io) {
            req.io.emit('newBooking', {
                eventTitle: booking.event.title,
                amountPaid,
                seatType,
                seatNumber,
                timestamp: new Date(),
                customerName: attendeeName || booking.user.fullName // Use attendee name if available
            });
            console.log("Emitted newBooking event for", booking.event.title);
        }

        res.status(201).json({
            success: true,
            data: booking
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
            ticketId: b.qrCode, // Using qrCode as ticketId
            title: b.event.title,
            location: b.event.venue,
            date: b.event.date, // Formatted on frontend
            time: b.event.time, // Include time
            selectedType: b.seatType,
            seat: b.seatNumber,
            pricePaid: b.amountPaid,
            attendeeName: b.attendeeName, // Specific attendee
            status: b.status,
            cancellationReason: b.cancellationReason
        }));

        res.json({ success: true, bookings: formattedBookings });
    } catch (error) {
        console.error("Error fetching my tickets:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
