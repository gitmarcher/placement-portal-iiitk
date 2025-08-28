// server/src/controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const StudentCred = require('../models/studentCred.js');
const CoordinatorCred = require('../models/coordinatorCred.js');

const generateTokenAndSetCookie = require('../jwt/generate.js');
const Coordinator = require('../models/coordinatorModel.js');
const Student = require('../models/studentModel.js');

const logout = async(req, res) => {
    try{
        res.cookie('jwt',"",{maxAge: 0});
        res.status(200).json({message: "User logged out successfully"});
    }catch{
        console.error('Error in logout controller:', error.message);
        res.status(500).json({error: "Internal Server error while logging out user"});        
    }
};

// Verify JWT token and return user authentication status
const verify = async (req, res) => {
    try {
        const token = req.cookies.jwt;
        
        if (!token) {
            return res.status(401).json({ 
                isAuthenticated: false, 
                message: "No token provided" 
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (!decoded) {
            return res.status(401).json({ 
                isAuthenticated: false, 
                message: "Invalid token" 
            });
        }

        // Return user info without sensitive data
        return res.status(200).json({
            isAuthenticated: true,
            userType: decoded.role,
            user: {
                id: decoded.userId,
                username: decoded.username,
                role: decoded.role
            }
        });

    } catch (error) {
        console.error('Error in verify controller:', error.message);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                isAuthenticated: false, 
                message: "Token expired" 
            });
        }
        
        return res.status(401).json({ 
            isAuthenticated: false, 
            message: "Invalid token" 
        });
    }
};

const login = async (req, res) => {
    const { username, password, userType } = req.body;
    console.log(username, password, userType);

    if (!['student', 'coordinator'].includes(userType)) {
        return res.status(400).json({ error: "Invalid user type" });
    }

    try {
        const Model = userType === 'student' ? StudentCred : CoordinatorCred;
        const ProfileModel = userType === 'student' ? Student : Coordinator;
        const user = await Model.findOne({ username });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ error: "Invalid username or password" });
        }

        // Update lastLogin to current date/time
        user.lastLogin = new Date();
        await user.save(); // Save the updated document

        const profile = await ProfileModel.findOne({ creds: user._id });
        
        // Generate token with username and role
        generateTokenAndSetCookie(user._id.toString(), user.username, userType, res);

        // Don't send token in response anymore - only use secure cookies
        if (!profile) {
            return res.status(201).json({
                userType,
                message: `${userType.charAt(0).toUpperCase() + userType.slice(1)} profile incomplete, please complete your registration`,
            });
        }

        return res.status(200).json({
            userType,
            message: "User logged in successfully",
        });

    } catch (error) {
        console.error('Error in login controller:', error.message);
        res.status(500).json({ error: "Internal Server error" });
    }
};

// Student signup function
const signup = async (req, res) => {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }

    try {
        // Check if user already exists
        const existingUser = await StudentCred.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new student credentials
        const newStudentCred = new StudentCred({
            username,
            password: hashedPassword,
            lastLogin: new Date(),
        });

        await newStudentCred.save();

        // Generate token and set cookie for immediate login after signup
        generateTokenAndSetCookie(newStudentCred._id.toString(), newStudentCred.username, 'student', res);

        res.status(201).json({ 
            userType: 'student',
            message: 'Registration successful, please complete your profile.' 
        });

    } catch (error) {
        console.error('Error in signup controller:', error.message);
        res.status(500).json({ error: "Internal Server error during registration" });
    }
};

// export
module.exports = {
    login,
    logout,
    verify,
    signup
};