
import mongoose from "mongoose";
import dotenv from "dotenv";
import Event from "./models/event_model.js";
import User from "./models/user_model.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/event_orbit";

const seedEvents = [
    {
        title: "Neon Nights Music Festival",
        venue: "Downtown Arena",
        date: new Date(Date.now() + 86400000 * 5), // 5 days later
        category: "Music",
        description: "Experience the ultimate electronic music festival under the neon lights.",
        price: { Standard: 50, VIP: 150 },
        banner: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745",
        status: "approved"
    },
    {
        title: "Tech Innovators Summit 2024",
        venue: "Silicon Valley Convention Center",
        date: new Date(Date.now() + 86400000 * 10), // 10 days later
        category: "Technology",
        description: "Join the brightest minds in tech for a day of innovation and networking.",
        price: { Standard: 100, VIP: 300 },
        banner: "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
        status: "approved"
    },
    {
        title: "Vintage Rock Concert",
        venue: "The Old Mill",
        date: new Date(Date.now() - 86400000 * 5), // 5 days ago (Past Event)
        category: "Music",
        description: "Relive the classics with the best vintage rock bands.",
        price: { Standard: 40, VIP: 120 },
        banner: "https://images.unsplash.com/photo-1459749411177-046f52bbce99",
        status: "approved"
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB for seeding...");

        // Clear existing events to avoid duplicates
        await Event.deleteMany({});
        console.log("Cleared existing events.");

        // Create a mock organizer if needed, or just insert events (schema allows organizer to be optional/loose for now or we can create one)
        // ideally we should link to a user, but for now we might skip or create a default admin

        await Event.insertMany(seedEvents);
        console.log("Database seeded successfully with 3 events!");

        mongoose.disconnect();
    } catch (err) {
        console.error("Seeding failed:", err);
        mongoose.disconnect();
    }
};

seedDB();
