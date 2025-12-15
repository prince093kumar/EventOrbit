import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
  seatType: String,
  seatNumber: String,
  amountPaid: Number,
  qrCode: String,
  status: { type: String, default: "confirmed" }
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);
