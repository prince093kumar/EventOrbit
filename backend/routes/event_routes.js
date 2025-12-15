import express from "express";
import { getAllEvents, createEvent } from "../controllers/event_controller.js";
import { protect } from "../middleware/auth_middleware.js";

const router = express.Router();

// Public route (no auth needed for browsing)
router.get("/", getAllEvents);

// Private route (create event)
// router.post("/", protect, createEvent); // Re-enable when Frontend Login is real
router.post("/", createEvent);

export default router;
