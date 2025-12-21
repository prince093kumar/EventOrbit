import Event from "../models/event_model.js";
import Review from "../models/review_model.js";
import Booking from "../models/booking_model.js";

// @desc    Get all events
// @route   GET /api/events
// @access  Public
export const getAllEvents = async (req, res) => {
    try {
        const { category } = req.query;
        let filter = {};

        if (category && category !== 'all') {
            filter.category = category;
        }

        // Only show approved events to public users
        filter.status = 'approved';

        const events = await Event.find(filter).populate('organizer', 'fullName');
        res.json({ success: true, events });
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @desc    Create a new event
// @route   POST /api/events
// @access  Public
export const createEvent = async (req, res) => {
    try {
        const { title, venue, date, category, description, banner, seatMap, price } = req.body;

        // Calculate VIP Allocation (10%)
        let processedSeatMap = seatMap;
        if (seatMap && seatMap.General) {
            const totalCapacity = parseInt(seatMap.General);
            const vipCapacity = Math.ceil(totalCapacity * 0.10);
            const regularCapacity = totalCapacity - vipCapacity;
            processedSeatMap = {
                VIP: vipCapacity,
                Regular: regularCapacity,
                Total: totalCapacity
            };
        }

        const newEvent = new Event({
            title,
            venue,
            date,
            category,
            description,
            banner: req.file ? req.file.path : banner, // Use uploaded Cloudinary URL
            seatMap: processedSeatMap,
            price,
            organizer: req.user ? req.user._id : "6753457a1234567890abcdef" // Default/Mock ID until auth is enabled
        });

        const savedEvent = await newEvent.save();

        if (req.io) {
            req.io.emit('eventCreated', {
                eventTitle: savedEvent.title,
                organizerName: req.user ? req.user.fullName : 'Organizer',
                timestamp: new Date()
            });
        }

        res.status(201).json({ success: true, event: savedEvent });

    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
// @desc    Add a Review
// @route   POST /api/events/:id/reviews
// @access  Private
export const addReview = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Not authorized" });
        }

        const { rating, comment } = req.body;
        const eventId = req.params.id;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }

        // Check if event has ended
        // if (new Date(event.date) > new Date()) {
        //     return res.status(400).json({ success: false, message: "You can only review events that have ended." });
        // }
        // NOTE: User requested to review after check-in, regardless of strict date end (e.g., during event or right after scan).
        // So we strictly enforce 'checked_in' status instead.

        // Enforce Check-In Status
        const booking = await Booking.findOne({
            user: req.user._id,
            event: eventId,
            status: 'checked_in'
        });

        if (!booking) {
            return res.status(403).json({ success: false, message: "You can only review events you have checked in for." });
        }

        const review = await Review.create({
            user: req.user._id,
            event: eventId,
            rating,
            comment
        });

        res.status(201).json({ success: true, review });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: "You have already reviewed this event" });
        }
        console.error("Error adding review:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @desc    Get Reviews for an Event
// @route   GET /api/events/:id/reviews
// @access  Public
export const getEventReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ event: req.params.id })
            .populate('user', 'fullName')
            .sort({ createdAt: -1 });

        res.json({ success: true, reviews });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
// @desc    Get User's Reviews
// @route   GET /api/events/my-reviews
// @access  Private
export const getUserReviews = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Not authorized" });
        }

        const reviews = await Review.find({ user: req.user._id })
            .populate('event', 'title date banner')
            .sort({ createdAt: -1 });

        res.json({ success: true, reviews });
    } catch (error) {
        console.error("Error fetching user reviews:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
