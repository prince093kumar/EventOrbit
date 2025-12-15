import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
  rating: Number,
  comment: String,
}, { timestamps: true });

export default mongoose.model("Review", reviewSchema);
