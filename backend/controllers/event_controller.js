import Event from "../models/event_model.js";

// @desc    Get all events
// @route   GET /api/events
// @access  Public
export const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find();
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

        const newEvent = new Event({
            title,
            venue,
            date,
            category,
            description,
            banner,
            seatMap,
            price,
            organizer: req.user ? req.user._id : "6753457a1234567890abcdef" // Default/Mock ID until auth is enabled
        });

        const savedEvent = await newEvent.save();
        res.status(201).json({ success: true, event: savedEvent });

    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
