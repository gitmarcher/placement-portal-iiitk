const jwt = require('jsonwebtoken');
const Creds = require('../models/studentCred');
const Student = require('../models/studentModel');

 

const protectAuth = async (req, res, next) => {
  const token = req.cookies.jwt;
  console.log("Token received:", token); // Debug
  if (!token) {
    console.log("No token found in cookies");
    return res.status(401).json({ error: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded JWT:", decoded); // Debug
    req.user = { _id: decoded.userId }; // Set _id directly on req.user
    console.log("req.user set:", req.user); // Debug
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = protectAuth; //