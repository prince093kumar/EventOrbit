export const parseMultipartBody = (req, res, next) => {
    // If there is no body, skip
    if (!req.body) return next();

    try {
        // Parse 'price' if it's a string
        if (req.body.price && typeof req.body.price === 'string') {
            req.body.price = JSON.parse(req.body.price);
        }

        // Parse 'seatMap' if it's a string
        if (req.body.seatMap && typeof req.body.seatMap === 'string') {
            req.body.seatMap = JSON.parse(req.body.seatMap);
        }

        // Parse 'organizationDetails' if it's a string
        if (req.body.organizationDetails && typeof req.body.organizationDetails === 'string') {
            req.body.organizationDetails = JSON.parse(req.body.organizationDetails);
        }

        // Parse 'bankDetails' if it's a string
        if (req.body.bankDetails && typeof req.body.bankDetails === 'string') {
            req.body.bankDetails = JSON.parse(req.body.bankDetails);
        }

        next();
    } catch (error) {
        console.error("Error parsing multipart JSON:", error);
        return res.status(400).json({
            success: false,
            message: "Invalid JSON format in form data"
        });
    }
};
