import User from "../models/user_model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
    try {
        const { fullName, email, password, role } = req.body;



        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Create user
        const user = await User.create({
            fullName,
            email,
            password,
            role: role || 'user'
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
    try {
        const { email, password, requiredRole } = req.body;

        // Check for user email
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            // Role Enforcement
            if (requiredRole && user.role !== requiredRole) {
                return res.status(403).json({
                    message: `Access denied. accounts with role '${user.role}' cannot access this panel.`
                });
            }

            if (user.isBlocked) {
                return res.status(403).json({
                    message: "Your account has been blocked by the administrator."
                });
            }

            res.json({
                _id: user.id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Update password
// @route   PUT /api/auth/change-password
// @access  Private
export const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check current password
        if (!(await user.matchPassword(currentPassword))) {
            return res.status(401).json({ message: "Invalid current password" });
        }

        // Update password (pre-save middleware will handle hashing)
        user.password = newPassword;
        await user.save();

        res.json({ success: true, message: "Password updated successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Update User Profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
    try {
        console.log("updateUserProfile called with body:", req.body); // DEBUG LOG
        console.log("User from token:", req.user._id); // DEBUG LOG

        const user = await User.findById(req.user._id);

        if (user) {
            user.fullName = req.body.fullName || user.fullName;
            user.phone = req.body.phone || user.phone;
            user.profilePic = req.body.profilePic || user.profilePic;
            user.location = req.body.location || user.location;
            // Add location if schema supports it, for now storing in generic way or if user model is updated
            // Assuming we might want to add 'location' to user model if it's not there, or just keep it simple.
            // The frontend sends 'location', but User model didn't have it explicitly.
            // Let's check User Model again. If not present, we can ignore or add it.
            // For now, let's assume we update what we have.

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();
            console.log("User updated successfully:", updatedUser); // DEBUG LOG

            res.json({
                _id: updatedUser._id,
                fullName: updatedUser.fullName,
                email: updatedUser.email,
                role: updatedUser.role,
                phone: updatedUser.phone,
                location: updatedUser.location,
                token: generateToken(updatedUser._id),
                success: true
            });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error("Error in updateUserProfile:", error); // DEBUG LOG
        res.status(500).json({ message: error.message || "Server Error" });
    }
};

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || "default_secret_should_be_changed", {
        expiresIn: "30d",
    });
};
