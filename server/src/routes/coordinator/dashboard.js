const express = require('express');
const router = express.Router();
const Drive = require('../../models/driveModel');
const Student = require('../../models/studentModel');
const protectCoordinatorAuth = require('../../middleware/coordinatorAuth');

// Get coordinator dashboard summary
router.get('/summary', protectCoordinatorAuth, async (req, res) => {
    try {
        const coordinatorId = req.user._id;
        
        // Get all drives created by this coordinator
        const allDrives = await Drive.find({ coordinator: coordinatorId });
        
        // Get active drives
        const activeDrives = allDrives.filter(drive => drive.isActive);
        
        // Get inactive drives
        const inactiveDrives = allDrives.filter(drive => !drive.isActive);
        
        // Calculate total applications across all drives
        const totalApplications = allDrives.reduce((total, drive) => {
            return total + (drive.applied_students ? drive.applied_students.length : 0);
        }, 0);
        
        // Calculate total experiences shared
        const totalExperiences = allDrives.reduce((total, drive) => {
            return total + (drive.experiences ? drive.experiences.length : 0);
        }, 0);
        
        // Get recent drives
        const recentDrives = allDrives
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);
        
        // Calculate stats
        const stats = {
            totalDrives: allDrives.length,
            activeDrives: activeDrives.length,
            inactiveDrives: inactiveDrives.length,
            totalApplications: totalApplications,
            totalExperiences: totalExperiences,
            averageApplicationsPerDrive: allDrives.length > 0 ? Math.round(totalApplications / allDrives.length) : 0
        };
        
        res.json({
            stats,
            recentDrives,
            activeDrives: activeDrives.slice(0, 5),
            upcomingDeadlines: activeDrives
                .filter(drive => new Date(drive.deadline) > new Date())
                .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
                .slice(0, 5)
        });
        
    } catch (error) {
        console.error('Error fetching coordinator dashboard data:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
});

// Get detailed drive statistics
router.get('/drive-stats/:driveId', protectCoordinatorAuth, async (req, res) => {
    try {
        const { driveId } = req.params;
        
        const drive = await Drive.findOne({ 
            _id: driveId, 
            coordinator: req.user._id 
        });
        
        if (!drive) {
            return res.status(404).json({ error: 'Drive not found' });
        }
        
        const stats = {
            driveName: drive.drive_name,
            companyName: drive.company_name,
            isActive: drive.isActive,
            totalApplications: drive.applied_students ? drive.applied_students.length : 0,
            totalExperiences: drive.experiences ? drive.experiences.length : 0,
            deadline: drive.deadline,
            driveDate: drive.drive_date,
            numberOfPositions: drive.number_of_positions
        };
        
        res.json(stats);
        
    } catch (error) {
        console.error('Error fetching drive statistics:', error);
        res.status(500).json({ error: 'Failed to fetch drive statistics' });
    }
});

// Get coordinator's recent activities
router.get('/activities', protectCoordinatorAuth, async (req, res) => {
    try {
        const coordinatorId = req.user._id;
        
        // Get recent drives and their activities
        const recentDrives = await Drive.find({ coordinator: coordinatorId })
            .sort({ updatedAt: -1 })
            .limit(10);
        
        const activities = recentDrives.map(drive => ({
            driveId: drive._id,
            driveName: drive.drive_name,
            companyName: drive.company_name,
            lastUpdated: drive.updatedAt,
            isActive: drive.isActive,
            applicationCount: drive.applied_students ? drive.applied_students.length : 0,
            experienceCount: drive.experiences ? drive.experiences.length : 0
        }));
        
        res.json({ activities });
        
    } catch (error) {
        console.error('Error fetching coordinator activities:', error);
        res.status(500).json({ error: 'Failed to fetch activities' });
    }
});

module.exports = router;
