import User from "../models/user_model.js";
import Event from "../models/event_model.js";
import Booking from "../models/booking_model.js";

// @desc    Get Organizer Dashboard Stats
// @route   GET /api/organizer/stats
// @access  Private
export const getDashboardStats = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Not authorized" });
        }
        const userId = req.user._id;

        // 1. Total Sales (from Bookings)
        const events = await Event.find({ organizer: userId });
        const eventIds = events.map(e => e._id);

        // 1. Total Sales & Tickets Sold
        // Fetch ALL bookings for these events to calculate various stats
        const allBookings = await Booking.find({ event: { $in: eventIds } });

        // Filter for confirmed/checked_in for revenue and sales count
        const confirmedBookings = allBookings.filter(b => b.status === 'confirmed' || b.status === 'checked_in');
        const totalSales = confirmedBookings.reduce((acc, curr) => acc + (curr.amountPaid || 0), 0);
        const ticketsSold = confirmedBookings.length;

        // 2. Events Active
        const eventsActive = events.length;

        // 3. Pending Approval (Tickets needing action)
        const pendingBookings = allBookings.filter(b => b.status === 'pending').length;

        res.json({
            success: true,
            totalSales,
            ticketsSold,
            eventsActive,
            pendingApproval: pendingBookings
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error fetching stats" });
    }
};

// @desc    Get Revenue Analytics
// @route   GET /api/organizer/revenue
// @access  Private
export const getRevenueAnalytics = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Not authorized" });
        }
        const userId = req.user._id;

        // Calculate Real Total Revenue
        const events = await Event.find({ organizer: userId });
        const eventIds = events.map(e => e._id);
        const bookings = await Booking.find({ event: { $in: eventIds }, status: 'confirmed' });
        const totalRevenue = bookings.reduce((acc, curr) => acc + (curr.amountPaid || 0), 0);

        // Mock Chart Data (Time series logic would go here)
        const data = [
            { name: 'Mon', revenue: 0 },
            { name: 'Tue', revenue: 0 },
            { name: 'Wed', revenue: 0 },
            { name: 'Thu', revenue: 0 },
            { name: 'Fri', revenue: 0 },
            { name: 'Sat', revenue: 0 },
            { name: 'Sun', revenue: totalRevenue }, // Dump total here for visualization
        ];

        res.json({
            success: true,
            chartData: data,
            totalRevenue: totalRevenue,
            pendingPayouts: totalRevenue * 0.9, // 90% payout rule example
            avgTicketPrice: bookings.length > 0 ? (totalRevenue / bookings.length).toFixed(2) : 0
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error fetching revenue" });
    }
};

// @desc    Get Attendees List
// @route   GET /api/organizer/attendees
// @access  Private
export const getAttendees = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Not authorized" });
        }
        const userId = req.user._id;
        const events = await Event.find({ organizer: userId });
        const eventIds = events.map(e => e._id);

        const bookings = await Booking.find({ event: { $in: eventIds } })
            .populate('user', 'fullName email phone')
            .populate('event', 'title')
            .sort({ createdAt: -1 });

        const attendees = bookings.map(b => {
            let displayStatus = b.status;
            // Correct mapping priority
            if (b.status === 'confirmed') displayStatus = 'Confirmed';
            if (b.status === 'checked_in') displayStatus = 'Checked In';
            if (b.status === 'pending') displayStatus = 'Pending';
            if (b.status === 'cancelled') displayStatus = 'Cancelled';

            return {
                id: b._id,
                name: b.attendeeName || (b.user ? b.user.fullName : 'Guest User'),
                email: b.user ? b.user.email : 'N/A',
                phone: b.user ? b.user.phone : 'N/A',
                ticket: b.seatType || 'General',
                seat: b.seatNumber || 'N/A',
                status: displayStatus
            };
        });

        res.json({ success: true, attendees });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error fetching attendees" });
    }
};

// @desc    Get Organizer Profile
// @route   GET /api/organizer/profile
// @access  Private
export const getOrganizerProfile = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Not authorized" });
        }
        const userId = req.user._id;
        const user = await User.findById(userId).select('-password');

        if (user) {
            res.json({ success: true, user });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error fetching profile" });
    }
};

// @desc    Update Organizer Profile
// @route   PUT /api/organizer/profile
// @access  Private
export const updateOrganizerProfile = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Not authorized" });
        }
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (user) {
            user.fullName = req.body.fullName || user.fullName;
            user.email = req.body.email || user.email;
            user.phone = req.body.phone || user.phone;

            // Update Organization Details
            if (req.body.organizationDetails) {
                user.organizationDetails = {
                    ...user.organizationDetails,
                    ...req.body.organizationDetails
                };
            }

            // Update Bank Details
            if (req.body.bankDetails) {
                user.bankDetails = {
                    ...user.bankDetails,
                    ...req.body.bankDetails
                };
            }

            const updatedUser = await user.save();

            res.json({
                success: true,
                user: {
                    _id: updatedUser._id,
                    fullName: updatedUser.fullName,
                    email: updatedUser.email,
                    role: updatedUser.role,
                    phone: updatedUser.phone,
                    organizationDetails: updatedUser.organizationDetails,
                    bankDetails: updatedUser.bankDetails,
                    kycStatus: updatedUser.kycStatus
                }
            });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: error.message || "Server Error updating profile" });
    }
};

// @desc    Update Booking Status
// @route   PUT /api/organizer/booking/:id/status
// @access  Private
export const updateBookingStatus = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Not authorized" });
        }

        const { status, reason } = req.body;
        const booking = await Booking.findById(req.params.id).populate('event');

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // Verify ownership
        if (booking.event.organizer.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Not authorized to update this booking" });
        }

        booking.status = status;
        if (status === 'cancelled' && reason) {
            booking.cancellationReason = reason;
        }

        await booking.save();

        res.json({ success: true, booking });

    } catch (error) {
        console.error("Error updating booking status", error);
        res.status(500).json({ message: "Server Error updating booking status" });
    }
};

// @desc    Get Live Activity Feed
// @route   GET /api/organizer/live-activity
// @access  Private
export const getLiveActivity = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Not authorized" });
        }
        const userId = req.user._id;

        // Find all events by this organizer
        const events = await Event.find({ organizer: userId });
        const eventIds = events.map(e => e._id);

        // Find bookings
        const bookings = await Booking.find({ event: { $in: eventIds } })
            .sort({ createdAt: -1 })
            .populate('user', 'fullName email')
            .populate('event', 'title');

        // Calculate Stats
        const recentCheckIns = bookings.filter(b => b.status === 'checked_in').length;
        const ticketsScanned = bookings.length; // Total Tickets
        const alerts = bookings.filter(b => b.status === 'cancelled').length; // Gate Alerts (Cancelled status)

        const activities = bookings.slice(0, 20).map(b => {
            let action = 'Ticket Sold';
            if (b.status === 'checked_in') action = 'Check-in';
            if (b.status === 'cancelled') action = 'Cancelled';

            return {
                id: b._id,
                time: b.createdAt,
                action: action,
                user: b.attendeeName || (b.user ? b.user.fullName : 'Guest User'),
                ticket: `#${b._id.toString().slice(-6).toUpperCase()}`,
                seatNumber: b.seatNumber,
                eventName: b.event ? b.event.title : 'Unknown Event',
                alert: b.status === 'cancelled'
            };
        });

        res.json({
            success: true,
            activities,
            stats: {
                recentCheckIns,
                ticketsScanned,
                alerts
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error fetching live activity" });
    }
};
// @desc    Get All Events for Organizer
// @route   GET /api/organizer/events
// @access  Private
export const getOrganizerEvents = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Not authorized" });
        }
        const userId = req.user._id;
        const events = await Event.find({ organizer: userId }).sort({ date: 1 }); // Sort by date ascending

        res.json({ success: true, events });
    } catch (error) {
        console.error("Error fetching organizer events:", error);
        res.status(500).json({ message: "Server Error fetching events" });
    }
};
