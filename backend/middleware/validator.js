import { body, validationResult } from "express-validator";

// Middleware to handle validation results
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: errors.array()[0].msg, // Return the first error message
            errors: errors.array()
        });
    }
    next();
};

// Validation rules for Registration
export const registerValidation = [
    body("fullName")
        .trim()
        .notEmpty().withMessage("Full Name is required")
        .isLength({ min: 2 }).withMessage("Full Name must be at least 2 characters long"),

    body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Please provide a valid email address")
        .normalizeEmail(),

    body("password")
        .trim()
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
        .matches(/\d/).withMessage("Password must contain a number")
        .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage("Password must contain a special character"),

    body("phone")
        .optional()
        .trim()
        .isMobilePhone("any").withMessage("Please provide a valid phone number"),

    body("role")
        .optional()
        .isIn(["user", "organizer", "admin"]).withMessage("Invalid role specified")
];

// Validation rules for Login
export const loginValidation = [
    body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Please provide a valid email address")
        .normalizeEmail(),

    body("password")
        .trim()
        .notEmpty().withMessage("Password is required")
];

// Validation for Password Change
export const changePasswordValidation = [
    body("currentPassword")
        .trim()
        .notEmpty().withMessage("Current Password is required"),

    body("newPassword")
        .trim()
        .notEmpty().withMessage("New Password is required")
        .isLength({ min: 8 }).withMessage("New Password must be at least 8 characters long")
];

// Validation rules for Creating Events
export const eventValidation = [
    body("title")
        .trim()
        .notEmpty().withMessage("Event title is required")
        .isLength({ min: 3 }).withMessage("Title must be at least 3 characters long"),

    body("venue")
        .trim()
        .notEmpty().withMessage("Venue is required"),

    body("date")
        .notEmpty().withMessage("Date is required")
        .isISO8601().toDate().withMessage("Please provide a valid date"),

    body("category")
        .trim()
        .notEmpty().withMessage("Category is required"),

    body("description")
        .trim()
        .notEmpty().withMessage("Description is required")
        .isLength({ min: 10 }).withMessage("Description must be at least 10 characters long"),

    body("price")
        .optional()
        .isObject().withMessage("Price must be an object { VIP, Regular }"),

    body("seatMap")
        .optional()
        .isObject().withMessage("SeatMap must be an object { VIP, Regular }")
];

// Validation rules for Booking
export const bookingValidation = [
    body("event")
        .trim()
        .notEmpty().withMessage("Event ID is required")
        .isMongoId().withMessage("Invalid Event ID"),

    body("seatType")
        .trim()
        .notEmpty().withMessage("Seat Type is required"),

    body("seatNumber")
        .trim()
        .notEmpty().withMessage("Seat Number is required"),

    body("amountPaid")
        .notEmpty().withMessage("Amount Paid is required")
        .isNumeric().withMessage("Amount Paid must be a number")
        .toFloat() // Sanitize to a float
];
