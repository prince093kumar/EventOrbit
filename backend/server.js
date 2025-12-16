import dotenv from "dotenv";
dotenv.config();
console.log("JWT_SECRET Loaded:", process.env.JWT_SECRET ? "Yes" : "No");

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import eventRoutes from "./routes/event_routes.js";
import authRoutes from "./routes/auth_routes.js";
import organizerRoutes from "./routes/organizer_routes.js";
import bookingRoutes from "./routes/booking_routes.js";

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/events", eventRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/organizer", organizerRoutes);
app.use("/api/bookings", bookingRoutes);

// Database Connection
mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
