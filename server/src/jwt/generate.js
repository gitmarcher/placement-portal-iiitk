const jwt = require('jsonwebtoken');

const generateTokenAndSetCookie = (userId, username, role, res) => {
    try {
        const token = jwt.sign({ 
            userId,
            username,
            role  // Add role to JWT payload
        }, process.env.JWT_SECRET, { expiresIn: "15d" });
        
        res.cookie('jwt', token, {
            maxAge: 15*24*60*60*1000, // 15 days to match token expiry
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        });

    }
    catch (error) {
        console.error('Error in generateTokenAndSetCookie:', error.message);
        res.status(500).json({ error: "Internal Server error while generating token" });
    }
}

module.exports = generateTokenAndSetCookie;