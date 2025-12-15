import User from "../models/user_model.js";
import Event from "../models/event_model.js";
import Booking from "../models/booking_model.js";

// @desc    Get Organizer Dashboard Stats
// @route   GET /api/organizer/stats
// @access  Private
export const getDashboardStats = async (req, res) => {
    try {
        const userId = req.user ? req.user._id : "6753457a1234567890abcdef"; // Fallback for dev

        // 1. Total Sales (from Bookings)
        // Find all events by this organizer
        const events = await Event.find({ organizer: userId });
        const eventIds = events.map(e => e._id);

        // Calculate total revenue from bookings for these events
        const bookings = await Booking.find({ event: { $in: eventIds }, status: 'confirmed' });
        const totalSales = bookings.reduce((acc, curr) => acc + (curr.amountPaid || 0), 0);

        // 2. Tickets Sold
        const ticketsSold = bookings.length;

        // 3. Events Active
        const eventsActive = events.length;

        // 4. Pending Approval (Mock logic for now, or check status='pending')
        const pendingApproval = await Event.countDocuments({ organizer: userId, status: 'pending' });

        res.json({
            success: true,
            totalSales,
            ticketsSold,
            eventsActive,
            pendingApproval
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
        // Mock data logic for now as aggregation is complex without real data
        // In real app: Aggregate Booking.amountPaid grouped by createdAt date

        const data = [
            { name: 'Mon', revenue: 4000 },
            { name: 'Tue', revenue: 3000 },
            { name: 'Wed', revenue: 2000 },
            { name: 'Thu', revenue: 2780 },
            { name: 'Fri', revenue: 1890 },
            { name: 'Sat', revenue: 2390 },
            { name: 'Sun', revenue: 3490 },
        ];

        res.json({
            success: true,
            chartData: data,
            totalRevenue: 45231, // Replace with calc
            pendingPayouts: 12450,
            avgTicketPrice: 48.50
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
        const userId = req.user ? req.user._id : "6753457a1234567890abcdef";
        const events = await Event.find({ organizer: userId });
        const eventIds = events.map(e => e._id);

        const bookings = await Booking.find({ event: { $in: eventIds } })
            .populate('user', 'fullName email phone')
            .populate('event', 'title')
            .limit(50); // Pagination needed in future

        const attendees = bookings.map(b => ({
            id: b._id,
            name: b.user ? b.user.fullName : 'Guest User',
            email: b.user ? b.user.email : 'N/A',
            phone: b.user ? b.user.phone : 'N/A',
            ticket: b.seatType || 'General',
            status: b.status === 'confirmed' ? 'Checked In' : b.status // Mapping status
        }));

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
        const userId = req.user ? req.user._id : "6753457a1234567890abcdef";
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
        const userId = req.user ? req.user._id : "6753457a1234567890abcdef";
        const user = await User.findById(userId);

        if (user) {
            user.fullName = req.body.fullName || user.fullName;
            user.email = req.body.email || user.email;
            user.phone = req.body.phone || user.phone;
            // Add other fields like address if schema supports it or use mixin

            const updatedUser = await user.save();

            res.json({
                success: true,
                user: {
                    _id: updatedUser._id,
                    fullName: updatedUser.fullName,
                    email: updatedUser.email,
                    role: updatedUser.role,
                    phone: updatedUser.phone
                }
            });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error updating profile" });
    }
};
