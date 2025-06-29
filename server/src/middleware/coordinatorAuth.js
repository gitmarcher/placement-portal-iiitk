const jwt = require('jsonwebtoken');
const Coord = require('../models/coordinatorCred');

const protectRouteCord = async (req, res, next) => {
    try{
        let token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({error: "No token, authorization denied", code: "NO_TOKEN"});
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded){
            return res.status(401).json({error:"Invalid token", code: "INVALID_TOKEN"});
        }
        
        // Check if the user role is coordinator
        if (decoded.role !== 'coordinator') {
            console.log("User role is not coordinator:", decoded.role);
            return res.status(403).json({ 
                error: "Access denied. Coordinator role required.", 
                code: "WRONG_ROLE",
                userRole: decoded.role 
            });
        }
        
        const user = await Coord.findById(decoded.userId).select('-password');

        if (!user){
            return res.status(401).json({error: "User not found", code: "USER_NOT_FOUND"});
        }
        
        // Set user info on request object
        req.user = {
            _id: user._id,
            id: user._id, // Add id field for compatibility
            username: decoded.username,
            role: decoded.role
        };
        
        next();
    }
    catch(error)
    {
        console.error('Error in protectRoute middleware:', error.message);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({error: "Token expired", code: "TOKEN_EXPIRED"});
        }
        
        res.status(401).json({error: "Invalid token", code: "INVALID_TOKEN"});      
    }
}

module.exports = protectRouteCord;