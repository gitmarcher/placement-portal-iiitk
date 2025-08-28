const express = require('express');
const router = express.Router();
const Drive = require('../../models/driveModel');
const Student = require('../../models/studentModel');
const protectCoordinatorAuth = require('../../middleware/coordinatorAuth');

// Get coordinator dashboard summary
router.get('/summary', protectCoordinatorAuth, async (req, res) => {
    try {
        const coordinatorId = req.user._id;

        const summary = await Drive.aggregate([
            // Match drives for the specific coordinator
            { $match: { coordinator: coordinatorId } },
            // Unwind applied_students and experiences for counting, preserve drives with no students/experiences
            {
                $unwind: {
                    path: "$applied_students",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $unwind: {
                    path: "$experiences",
                    preserveNullAndEmptyArrays: true
                }
            },
            // Group by drive to count applications and experiences per drive
            {
                $group: {
                    _id: "$_id",
                    drive_name: { $first: "$drive_name" },
                    isActive: { $first: "$isActive" },
                    createdAt: { $first: "$createdAt" },
                    deadline: { $first: "$deadline" },
                    totalApplications: {
                        $sum: { $cond: [{ $ifNull: ["$applied_students", false] }, 1, 0] }
                    },
                    totalExperiences: {
                        $sum: { $cond: [{ $ifNull: ["$experiences", false] }, 1, 0] }
                    }
                }
            },
            // Group everything to get overall stats
            {
                $group: {
                    _id: null,
                    totalDrives: { $sum: 1 },
                    activeDrives: { $sum: { $cond: ["$isActive", 1, 0] } },
                    inactiveDrives: { $sum: { $cond: ["$isActive", 0, 1] } },
                    totalApplications: { $sum: "$totalApplications" },
                    totalExperiences: { $sum: "$totalExperiences" },
                    recentDrives: {
                        $push: {
                            _id: "$_id",
                            drive_name: "$drive_name",
                            createdAt: "$createdAt"
                        }
                    },
                    upcomingDeadlines: {
                        $push: {
                            _id: "$_id",
                            drive_name: "$drive_name",
                            deadline: "$deadline",
                            isActive: "$isActive"
                        }
                    }
                }
            },
            // Project the final structure
            {
                $project: {
                    _id: 0,
                    stats: {
                        totalDrives: "$totalDrives",
                        activeDrives: "$activeDrives",
                        inactiveDrives: "$inactiveDrives",
                        totalApplications: "$totalApplications",
                        totalExperiences: "$totalExperiences",
                        averageApplicationsPerDrive: {
                            $cond: [{ $eq: ["$totalDrives", 0] }, 0, { $round: [{ $divide: ["$totalApplications", "$totalDrives"] }, 0] }]
                        }
                    },
                    recentDrives: {
                        $slice: [{
                            $sortArray: {
                                input: "$recentDrives",
                                sortBy: { createdAt: -1 }
                            }
                        }, 5]
                    },
                    activeDrives: {
                        $slice: [{
                            $filter: {
                                input: "$upcomingDeadlines",
                                as: "drive",
                                cond: { $eq: ["$$drive.isActive", true] }
                            }
                        }, 5]
                    },
                    upcomingDeadlines: {
                        $slice: [{
                            $filter: {
                                input: "$upcomingDeadlines",
                                as: "drive",
                                cond: { $gt: ["$$drive.deadline", new Date()] }
                            }
                        }, 5]
                    }
                }
            }
        ]);

        res.json(summary[0] || { // Return the first result or a default empty structure
            stats: {
                totalDrives: 0, activeDrives: 0, inactiveDrives: 0,
                totalApplications: 0, totalExperiences: 0, averageApplicationsPerDrive: 0
            },
            recentDrives: [], activeDrives: [], upcomingDeadlines: []
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
