import mongoose from 'mongoose';

const MONGO_URI = "mongodb://localhost:27017/event_orbit";

const checkSystem = async () => {
    console.log("1. Checking Database Connection...");
    try {
        await mongoose.connect(MONGO_URI);
        console.log("   ✅ MongoDB Connected");

        const count = await mongoose.connection.db.collection('events').countDocuments();
        console.log(`   📊 Events in DB: ${count}`);

        if (count === 0) {
            console.log("   ⚠️ WARNING: Database is empty!");
        }
    } catch (err) {
        console.error("   ❌ MongoDB Connection Failed:", err.message);
    } finally {
        await mongoose.disconnect();
    }

    console.log("\n2. Checking API Endpoint...");
    try {
        const response = await fetch('http://localhost:5000/api/events');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("   ✅ API is reachable");
        console.log(`   📦 API returned ${data.length} events`);
    } catch (err) {
        console.error("   ❌ API Request Failed:", err.message);
    }
};

checkSystem();
