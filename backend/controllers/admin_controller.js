
import User from "../models/user_model.js";
import Event from "../models/event_model.js";
import Booking from "../models/booking_model.js";
import Review from "../models/review_model.js";
import Settings from "../models/settings_model.js";

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalOrganizers = await User.countDocuments({ role: 'organizer' });
        const totalEvents = await Event.countDocuments();
        const pendingEvents = await Event.countDocuments({ status: 'pending' });

        // Calculate Revenue (sum of all bookings)
        const bookings = await Booking.find();
        const totalRevenue = bookings.reduce((acc, booking) => acc + (booking.amountPaid || 0), 0);

        // Chart Data (Events per month for last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);

        const eventsPerMonth = await Event.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 }
                }
            }
        ]);

        // Format for Recharts (Month Name)
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const chartData = eventsPerMonth.map(item => ({
            name: months[item._id - 1],
            events: item.count
        }));

        res.json({
            totalUsers,
            totalOrganizers,
            totalEvents,
            pendingEvents,
            totalRevenue,
            chartData
        });

    } catch (error) {
        console.error("Error fetching admin stats:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Get Pending Events (limit 5)
// @route   GET /api/admin/pending-events
// @access  Private/Admin
export const getPendingEvents = async (req, res) => {
    try {
        const events = await Event.find({ status: 'pending' })
            .populate('organizer', 'fullName')
            .sort({ createdAt: -1 })
            .limit(5);

        res.json(events);
    } catch (error) {
        console.error("Error fetching pending events:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Get All Users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'user' }).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Get All Organizers
// @route   GET /api/admin/organizers
// @access  Private/Admin
export const getAllOrganizers = async (req, res) => {
    try {
        const organizers = await User.find({ role: 'organizer' }).select('-password');
        res.json(organizers);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Get All Events
// @route   GET /api/admin/events
// @access  Private/Admin
export const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find().populate('organizer', 'fullName');
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Approve/Reject Event
// @route   PUT /api/admin/events/:id/status
// @access  Private/Admin
export const updateEventStatus = async (req, res) => {
    try {
        const { status } = req.body; // 'approved' or 'rejected'
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        event.status = status;
        await event.save();

        res.json({ success: true, message: `Event ${status}` });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Delete User
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await User.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'User deleted' });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Block/Unblock User
// @route   PUT /api/admin/users/:id/block
// @access  Private/Admin
export const toggleUserBlock = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.isBlocked = !user.isBlocked;
        await user.save();

        res.json({
            success: true,
            message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`,
            isBlocked: user.isBlocked
        });
    } catch (error) {
        console.error("Error toggling block status:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Verify/Reject Organizer KYC
// @route   PUT /api/admin/organizers/:id/kyc
// @access  Private/Admin
export const verifyOrganizer = async (req, res) => {
    try {
        const { kycStatus } = req.body; // 'approved' or 'rejected'
        const user = await User.findById(req.params.id);

        if (!user || user.role !== 'organizer') {
            return res.status(404).json({ message: 'Organizer not found' });
        }

        user.kycStatus = kycStatus;
        await user.save();

        res.json({ success: true, message: `Organizer KYC ${kycStatus}` });
    } catch (error) {
        console.error("Error updating organizer KYC:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Get All Reviews (Admin)
// @route   GET /api/admin/reviews
// @access  Private/Admin
export const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find({})
            .populate('user', 'fullName email')
            .populate('event', 'title banner')
            .sort({ createdAt: -1 });

        res.json({ success: true, reviews });
    } catch (error) {
        console.error("Error fetching all reviews:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @desc    Delete a Review (Admin)
// @route   DELETE /api/admin/reviews/:id
// @access  Private/Admin
export const deleteReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);
        if (!review) {
            return res.status(404).json({ success: false, message: "Review not found" });
        }

        res.json({ success: true, message: "Review deleted successfully" });
    } catch (error) {
        console.error("Error deleting review:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @desc    Get System Settings
// @route   GET /api/admin/settings
// @access  Private/Admin
export const getSettings = async (req, res) => {
    try {
        const settings = await Settings.getSettings();
        res.json(settings);
    } catch (error) {
        console.error("Error fetching settings:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Update System Settings
// @route   PUT /api/admin/settings
// @access  Private/Admin
export const updateSettings = async (req, res) => {
    try {
        const settings = await Settings.getSettings();
        const { siteName, supportEmail, timezone, emailAlerts, pushNotifications, maintenanceMode } = req.body;

        settings.siteName = siteName ?? settings.siteName;
        settings.supportEmail = supportEmail ?? settings.supportEmail;
        settings.timezone = timezone ?? settings.timezone;
        settings.emailAlerts = emailAlerts ?? settings.emailAlerts;
        settings.pushNotifications = pushNotifications ?? settings.pushNotifications;
        settings.maintenanceMode = maintenanceMode ?? settings.maintenanceMode;

        await settings.save();
        res.json({ success: true, settings, message: "Settings updated successfully" });
    } catch (error) {
        console.error("Error updating settings:", error);
        res.status(500).json({ message: "Server Error" });
    }
};


