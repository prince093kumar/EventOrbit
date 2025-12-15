import express from "express";
import { protect } from "../middleware/auth_middleware.js";
import { registerUser, loginUser, updatePassword } from "../controllers/auth_controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/change-password", protect, updatePassword);

export default router;
