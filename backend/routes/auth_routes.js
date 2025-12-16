import express from "express";
import { protect } from "../middleware/auth_middleware.js";
import { registerValidation, loginValidation, changePasswordValidation, validate } from "../middleware/validator.js";
import { registerUser, loginUser, updatePassword } from "../controllers/auth_controller.js";

const router = express.Router();

router.post("/register", registerValidation, validate, registerUser);
router.post("/login", loginValidation, validate, loginUser);
router.put("/change-password", protect, changePasswordValidation, validate, updatePassword);

export default router;
