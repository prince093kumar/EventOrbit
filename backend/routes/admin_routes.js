
import express from "express";
import {
    getDashboardStats,
    getPendingEvents,
    getAllUsers,
    getAllOrganizers,
    getAllEvents,
    updateEventStatus,
    deleteUser,
    verifyOrganizer,
    toggleUserBlock,
    getAllReviews,
    deleteReview,
    getSettings,
    updateSettings
} from "../controllers/admin_controller.js";
import { protect } from "../middleware/auth_middleware.js";

const router = express.Router();

// Middleware to check for 'admin' role could be added here
// For now, relying on 'protect' + checking inside controller or assume 'protect' allows access (ideally should add admin check middleware)

router.get("/stats", getDashboardStats);
router.get("/pending-events", getPendingEvents);
router.get("/users", getAllUsers);
router.get("/organizers", getAllOrganizers);
router.get("/events", getAllEvents);
router.put("/events/:id/status", protect, updateEventStatus);
router.delete("/users/:id", protect, deleteUser);
router.put("/users/:id/block", protect, toggleUserBlock);
router.put("/organizers/:id/kyc", protect, verifyOrganizer);

// Review Management
router.get("/reviews", protect, getAllReviews);
router.delete("/reviews/:id", protect, deleteReview);

// System Settings
router.get("/settings", protect, getSettings);
router.put("/settings", protect, updateSettings);

export default router;
