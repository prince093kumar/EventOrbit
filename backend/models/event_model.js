import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: String,
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  venue: String,
  date: Date,
  category: String,
  description: String,
  banner: String,
  seatMap: Object, // e.g. { VIP: 50, Regular: 200 }
  price: Object,   // e.g. { VIP: 150, Regular: 50 }
  status: { type: String, default: "approved" }
}, { timestamps: true });

export default mongoose.model("Event", eventSchema);
