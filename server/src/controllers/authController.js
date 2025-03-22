// server/src/controllers/authController.js
const bcrypt = require('bcrypt');

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
        generateTokenAndSetCookie(user._id.toString(), res);

        if (!profile) {
            return res.status(201).json({
                _id: user._id,
                username: user.username,
                userType,
                message: `${userType.charAt(0).toUpperCase() + userType.slice(1)} profile incomplete, please complete your registration`,
            });
        }

        return res.status(200).json({
            _id: user._id,
            username: user.username,
            userType,
            message: "User logged in successfully",
        });

    } catch (error) {
        console.error('Error in login controller:', error.message);
        res.status(500).json({ error: "Internal Server error" });
    }
};

// export
module.exports = {
    login,
    logout
};