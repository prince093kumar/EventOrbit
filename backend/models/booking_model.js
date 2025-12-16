import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: [true, "User is required"] },
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: [true, "Event is required"] },
  seatType: { type: String, required: [true, "Seat type is required"] },
  seatNumber: { type: String, required: [true, "Seat number is required"] },
  amountPaid: { type: Number, required: [true, "Amount paid is required"], min: [0, "Amount cannot be negative"] },
  qrCode: String,
  status: {
    type: String,
    default: "confirmed",
    enum: {
      values: ["pending", "confirmed", "cancelled", "checked_in"],
      message: "{VALUE} is not a valid status"
    }
  },
  cancellationReason: { type: String },
  attendeeName: { type: String, required: [true, "Attendee Name is required"] }
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);
