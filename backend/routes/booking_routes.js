import express from "express";
import { createBooking, getMyBookings, verifyTicket } from "../controllers/booking_controller.js";
import { protect } from "../middleware/auth_middleware.js";
import { bookingValidation, validate } from "../middleware/validator.js";

const router = express.Router();

router.use(protect); // All routes protected

router.get("/my-tickets", getMyBookings);
router.post("/", bookingValidation, validate, createBooking);
router.post("/verify", verifyTicket);

export default router;
