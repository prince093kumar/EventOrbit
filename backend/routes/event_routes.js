import express from "express";
import { getAllEvents, createEvent } from "../controllers/event_controller.js";
import { protect } from "../middleware/auth_middleware.js";
import { eventValidation, validate } from "../middleware/validator.js";

const router = express.Router();

// Public route (no auth needed for browsing)
router.get("/", getAllEvents);

// Private route (create event)
// Private route (create event)
router.post("/", protect, eventValidation, validate, createEvent);

export default router;
