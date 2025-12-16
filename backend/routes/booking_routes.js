import express from "express";
import { createBooking } from "../controllers/booking_controller.js";
import { protect } from "../middleware/auth_middleware.js";
import { bookingValidation, validate } from "../middleware/validator.js";

const router = express.Router();

router.post("/", protect, bookingValidation, validate, createBooking);

export default router;
