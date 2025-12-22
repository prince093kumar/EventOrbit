import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
    siteName: {
        type: String,
        default: 'EventOrbit Admin'
    },
    supportEmail: {
        type: String,
        default: 'support@eventorbit.com'
    },
    timezone: {
        type: String,
        default: 'UTC-5 (Eastern Time)'
    },
    emailAlerts: {
        type: Boolean,
        default: true
    },
    pushNotifications: {
        type: Boolean,
        default: false
    },
    maintenanceMode: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Ensure only one document exists
settingsSchema.statics.getSettings = async function () {
    let settings = await this.findOne();
    if (!settings) {
        settings = await this.create({});
    }
    return settings;
};

const Settings = mongoose.model('Settings', settingsSchema);
export default Settings;
