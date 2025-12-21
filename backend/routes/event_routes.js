import express from "express";
import { getAllEvents, createEvent, addReview, getEventReviews, getUserReviews } from "../controllers/event_controller.js";
import { protect } from "../middleware/auth_middleware.js";
import { eventValidation, validate } from "../middleware/validator.js";
import upload from "../middleware/upload.js";
import { parseMultipartBody } from "../middleware/parseMultipartBody.js";

const router = express.Router();

// Public route (no auth needed for browsing)
router.get("/", getAllEvents);

// User Reviews (Must be before /:id routes)
router.get("/my-reviews", protect, getUserReviews);

// Private route (create event)
router.post("/", protect, upload.single('banner'), parseMultipartBody, eventValidation, validate, createEvent);

// Reviews
router.post("/:id/reviews", protect, addReview);
router.get("/:id/reviews", getEventReviews);

export default router;
