const express = require('express');
const router = express.Router();
const Drive = require('../../models/driveModel');
const Student = require('../../models/studentModel');
const protectStudentAuth = require('../../middleware/studentAuth');

// Get student dashboard summary
router.get('/summary', protectStudentAuth, async (req, res) => {
    try {
        const studentId = req.user._id;
        
        // Get all drives
        const allDrives = await Drive.find({});
        
        // Get drives student has applied to
        const appliedDrives = await Drive.find({
            'applied_students.student_id': studentId
        });
        
        // Get active drives
        const activeDrives = await Drive.find({ isActive: true });
        
        // Get drives student can apply to (active and not already applied)
        const appliedDriveIds = appliedDrives.map(drive => drive._id.toString());
        const availableDrives = activeDrives.filter(drive => 
            !appliedDriveIds.includes(drive._id.toString())
        );
        
        // Calculate stats
        const stats = {
            totalDrives: allDrives.length,
            appliedDrives: appliedDrives.length,
            activeDrives: activeDrives.length,
            availableDrives: availableDrives.length,
            completedApplications: appliedDrives.length,
            pendingApplications: availableDrives.length
        };
        
        res.json({
            stats,
            recentDrives: activeDrives.slice(0, 5), // Show 5 most recent active drives
            appliedDrives: appliedDrives.slice(0, 5) // Show 5 most recent applications
        });
        
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
});

// Get student's recent activities
router.get('/activities', protectStudentAuth, async (req, res) => {
    try {
        const studentId = req.user._id;
        
        // Get recent applications
        const recentApplications = await Drive.find({
            'applied_students.student_id': studentId
        }).sort({ 'applied_students.applied_at': -1 }).limit(10);
        
        res.json({ activities: recentApplications });
        
    } catch (error) {
        console.error('Error fetching activities:', error);
        res.status(500).json({ error: 'Failed to fetch activities' });
    }
});

module.exports = router;
