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
import adminRoutes from "./routes/admin_routes.js";

const app = express();
import { createServer } from "http"; // Import createServer
import { Server } from "socket.io"; // Import socket.io

const httpServer = createServer(app); // Wrap express app
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  process.env.ADMIN_URL, // Admin
  process.env.ORGANIZER_URL, // Organizer
  process.env.USER_URL // User
].filter(Boolean); // Remove undefined values

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(express.json());

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      // ✅ allow any vercel.app deployment
      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.error("CORS blocked origin:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options(/.* /, cors()); // Enable pre-flight for all routes (RegExp to avoid path-to-regexp error)

import session from "express-session";
import cookieParser from "cookie-parser";

app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret_key_session',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 10 * 60 * 1000 } // 10 minutes
}));

// Theme Preference Route

// Theme Preference Route
app.post('/api/theme', (req, res) => {
  const { theme } = req.body;
  // Set cookie for 1 year (preference)
  res.cookie('theme', theme, { maxAge: 365 * 24 * 60 * 60 * 1000, httpOnly: false });
  res.json({ success: true, theme });
});

// Attach io to req for controllers
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
import { checkMaintenance } from "./middleware/maintenance_middleware.js";

// Apply maintenance check to all API routes
// The middleware internally skips admin routes
app.use("/api", checkMaintenance);

app.use("/api/events", eventRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/organizer", organizerRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);

// Database Connection
mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start Server
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
