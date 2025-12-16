import mongoose from "mongoose";
import validator from "validator";

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add an event title"],
    validate: {
      validator: function (v) {
        return validator.isLength(v, { min: 3 });
      },
      message: "Title must be at least 3 characters long"
    }
  },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  venue: { type: String, required: [true, "Please add a venue"] },
  date: { type: Date, required: [true, "Please add a date"] },
  category: { type: String, required: [true, "Please add a category"] },
  description: {
    type: String,
    required: [true, "Please add a description"],
    validate: {
      validator: function (v) {
        return validator.isLength(v, { min: 10 });
      },
      message: "Description must be at least 10 characters long"
    }
  },
  banner: String,
  seatMap: Object, // e.g. { VIP: 50, Regular: 200 }
  price: Object,   // e.g. { VIP: 150, Regular: 50 }
  status: { type: String, default: "approved" }
}, { timestamps: true });

export default mongoose.model("Event", eventSchema);
