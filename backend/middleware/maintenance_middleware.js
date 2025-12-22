import Settings from "../models/settings_model.js";

export const checkMaintenance = async (req, res, next) => {
    try {
        const settings = await Settings.getSettings();

        // If maintenance mode is active
        if (settings.maintenanceMode) {
            // Bypass for Admin routes / login
            if (req.originalUrl.startsWith('/api/admin') ||
                req.originalUrl.startsWith('/api/auth/login') ||
                req.originalUrl.startsWith('/api/auth/admin-login')) {
                return next();
            }

            // Reject all other requests
            return res.status(503).json({
                message: "System is currently under maintenance. We will be back shortly.",
                maintenance: true
            });
        }

        next();
    } catch (error) {
        console.error("Maintenance Check Error:", error);
        next(); // Fail open if DB error, or fail closed? better fail open for now to avoid outages due to settings error
    }
};
