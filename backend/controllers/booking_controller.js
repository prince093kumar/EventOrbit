import Booking from "../models/booking_model.js";

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res) => {
    try {
        const { event, seatType, seatNumber, amountPaid, qrCode } = req.body;

        // Ensure user is authenticated
        const userId = req.user._id;

        const booking = await Booking.create({
            user: userId,
            event,
            seatType,
            seatNumber,
            amountPaid,
            qrCode
        });

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
