import express from "express";
import {
    getDashboardStats,
    getRevenueAnalytics,
    getAttendees,
    getOrganizerProfile,
    updateOrganizerProfile,
    getLiveActivity
} from "../controllers/organizer_controller.js";
import { protect } from "../middleware/auth_middleware.js";

const router = express.Router();

// Apply protect middleware to all routes
router.use(protect);

router.get("/stats", getDashboardStats);
router.get("/revenue", getRevenueAnalytics);
router.get("/attendees", getAttendees);
router.get("/live-activity", getLiveActivity);
router.route("/profile").get(getOrganizerProfile).put(updateOrganizerProfile);

export default router;
