import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/user_model.js';

dotenv.config();

const seedOrganizer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/event_orbit");
        console.log("Connected to MongoDB");

        const email = "org@demo.com";
        const password = "password123";
        const hashedPassword = await bcrypt.hash(password, 10);

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            console.log("Updating existing user to organizer role...");
            existingUser.role = "organizer";
            existingUser.password = hashedPassword; // Reset password to known value
            await existingUser.save();
            console.log("User updated successfully.");
        } else {
            console.log("Creating new organizer user...");
            await User.create({
                fullName: "Demo Organizer",
                email,
                password: hashedPassword,
                role: "organizer",
                walletBalance: 1000
            });
            console.log("User created successfully.");
        }

        console.log(`\n✅ LOGIN DETAILS:\nEmail: ${email}\nPassword: ${password}\n`);
        process.exit();
    } catch (error) {
        console.error("Error seeding:", error);
        process.exit(1);
    }
};

seedOrganizer();
