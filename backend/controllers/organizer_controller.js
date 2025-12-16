import User from "../models/user_model.js";
import Event from "../models/event_model.js";
import Booking from "../models/booking_model.js";

// @desc    Get Organizer Dashboard Stats
// @route   GET /api/organizer/stats
// @access  Private
export const getDashboardStats = async (req, res) => {
    try {
        // Check if user is authenticated (middleware should ensure this)
        if (!req.user) {
            return res.status(401).json({ message: "Not authorized" });
        }
        const userId = req.user._id;

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
        if (!req.user) {
            return res.status(401).json({ message: "Not authorized" });
        }
        const userId = req.user._id;
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
        const userId = req.user ? req.user._id : "6753457a1234567890abcdef";
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

            // If checking "Submit for Verification", logic could go here to change kycStatus to 'pending' if it was 'not_submitted'

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
        res.status(500).json({ message: "Server Error updating profile" });
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

        // Find recent bookings (limit 20)
        const bookings = await Booking.find({ event: { $in: eventIds } })
            .sort({ createdAt: -1 })
            .limit(20)
            .populate('user', 'fullName email')
            .populate('event', 'title');

        // Map to activity format
        const activities = bookings.map(b => {
            // Determine action type based on status or recent creation
            let action = 'Ticket Sold';
            // For now, we assume all recent bookings are sales. 
            // In a real system, we might have a separate 'CheckIn' model or status log.
            // If status is 'checked_in', we can call it Check-in.
            if (b.status === 'checked_in') action = 'Check-in';

            return {
                id: b._id,
                time: b.createdAt, // Frontend will format this
                action: action,
                user: b.user ? b.user.fullName : 'Guest User',
                ticket: `#${b._id.toString().slice(-6).toUpperCase()}`, // Mock ticket ID from ObjectId
                eventName: b.event ? b.event.title : 'Unknown Event',
                alert: false // Add logic for alerts if needed (e.g. failed payment)
            };
        });

        res.json({ success: true, activities });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error fetching live activity" });
    }
};
