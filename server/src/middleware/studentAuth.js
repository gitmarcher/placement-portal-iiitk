const jwt = require('jsonwebtoken');
const Creds = require('../models/studentCred');
const Student = require('../models/studentModel');

const protectAuth = async (req, res, next) => {
  const token = req.cookies.jwt;
  console.log("Token received:", token); // Debug
  
  if (!token) {
    console.log("No token found in cookies");
    return res.status(401).json({ error: "No token, authorization denied", code: "NO_TOKEN" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded JWT:", decoded); // Debug
    
    // Check if the user role is student
    if (decoded.role !== 'student') {
      console.log("User role is not student:", decoded.role);
      return res.status(403).json({ 
        error: "Access denied. Student role required.", 
        code: "WRONG_ROLE",
        userRole: decoded.role 
      });
    }
    
    // Set user info on request object
    req.user = { 
      _id: decoded.userId,
      username: decoded.username,
      role: decoded.role
    };
    
    console.log("req.user set:", req.user); // Debug
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: "Token expired", code: "TOKEN_EXPIRED" });
    }
    
    return res.status(401).json({ error: "Invalid token", code: "INVALID_TOKEN" });
  }
};

module.exports = protectAuth;