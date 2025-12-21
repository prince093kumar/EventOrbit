import express from "express";
import {
    getDashboardStats,
    getRevenueAnalytics,
    getAttendees,
    getOrganizerProfile,
    updateOrganizerProfile,
    getLiveActivity,
    updateBookingStatus,
    getOrganizerEvents
} from "../controllers/organizer_controller.js";
import { protect } from "../middleware/auth_middleware.js";
import upload from "../middleware/upload.js";
import { parseMultipartBody } from "../middleware/parseMultipartBody.js";

const router = express.Router();

// Apply protect middleware to all routes
router.use(protect);

router.get("/stats", getDashboardStats);
router.get("/revenue", getRevenueAnalytics);
router.get("/attendees", getAttendees);
router.get("/live-activity", getLiveActivity);
router.get("/events", getOrganizerEvents);
router.put("/booking/:id/status", updateBookingStatus);
router.route("/profile").get(getOrganizerProfile).put(upload.single('kycDocument'), parseMultipartBody, updateOrganizerProfile);

export default router;
