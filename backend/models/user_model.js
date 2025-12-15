import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  phone: { type: String },
  profilePic: { type: String },
  role: { type: String, default: "user", enum: ["user", "organizer", "admin"] },
  walletBalance: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model("User", userSchema);
