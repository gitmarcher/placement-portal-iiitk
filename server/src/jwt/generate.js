const jwt = require('jsonwebtoken');

const generateTokenAndSetCookie = (userId, username, role, res) => {
    try {
        const token = jwt.sign({ 
            userId,
            username,
            role  // Add role to JWT payload
        }, process.env.JWT_SECRET, { expiresIn: "15d" });
        
        const cookieOptions = {
            maxAge: 15*24*60*60*1000, // 15 days to match token expiry
            httpOnly: true,
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // Allow cross-origin for production
            secure: process.env.NODE_ENV === "production" // Require HTTPS in production
        };

        // Add debugging
        console.log('Setting cookie with options:', cookieOptions);
        console.log('NODE_ENV:', process.env.NODE_ENV);
        
        res.cookie('jwt', token, cookieOptions);

    }
    catch (error) {
        console.error('Error in generateTokenAndSetCookie:', error.message);
        res.status(500).json({ error: "Internal Server error while generating token" });
    }
}

module.exports = generateTokenAndSetCookie;