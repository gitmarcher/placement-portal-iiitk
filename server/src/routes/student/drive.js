const express = require('express');
const Drive = require('../../models/driveModel');
const protectRoute  = require('../../middleware/studentAuth');
const Student = require('../../models/studentModel');
const router = express.Router();

router.post('/add-applicant/:driveId', protectRoute, async (req, res) => {
    try {
        // Get student and drive
        const student = await Student.findOne({ creds: req.user.creds });
        const drive = await Drive.findById(req.params.driveId);

        if (!drive) {
            return res.status(404).send('Drive not found');
        }

        if (!student) {
            return res.status(404).send('Student not found');
        }

        // Check if student meets criteria
        if (!meetsCriteria(student, drive.criteria)) {
            return res.status(403).send('You do not meet the criteria for this drive');
        }

        // Check if student already applied (in Student model)
        const alreadyAppliedInStudent = student.applied_drives.some(appliedDrive => 
            appliedDrive.drive_id.equals(drive._id)
        );
        
        // Check if student already in drive's applied_students
        const alreadyInDrive = drive.applied_students.some(studentId => 
            studentId.equals(student._id)
        );

        if (alreadyAppliedInStudent || alreadyInDrive) {
            return res.status(400).send('Student has already applied for this drive');
        }

        // Update both models atomically
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Add to Student's applied_drives
            student.applied_drives.push({ 
                drive_id: drive._id,
                application_date: new Date(),
                status: 'Applied'
            });

            // Add to Drive's applied_students
            drive.applied_students.push(student._id);

            // Save both documents
            await student.save();
            await drive.save();

            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }

        res.status(200).json({
            message: 'Student successfully added to drive applicants',
            studentName: student.name,
            driveName: drive.drive_name
        });

    } catch (error) {
        console.error('Error adding student to drive:', error);
        res.status(500).send('Server error');
    }
});

router.get('/all', protectRoute, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
        const skip = (page - 1) * limit;

        const totalDrives = await Drive.countDocuments();
        const drives = await Drive.find({})
            .skip(skip)
            .limit(limit);

        res.json({
            drives,
            currentPage: page,
            totalPages: Math.ceil(totalDrives / limit),
            totalDrives
        });
    } catch (error) {
        console.error('Error fetching drives:', error);
        res.status(500).send('Server error');
    }
});



// get all drives that student is eligible for
router.get('/eligible', protectRoute, async (req, res) => {
    try {
        const student = await Student.findOne({ creds: req.user.creds });
        const drives = await Drive.find({});
        console.log('student:', student);
        console.log('drives:', drives);

        const eligibleDrives = drives.filter(drive => meetsCriteria(student, drive.criteria));

        res.json(eligibleDrives);
    } catch (error) {
        console.error('Error fetching eligible drives:', error);
        res.status(500).send('Server error');
    }
});


// get drive by id
router.get('/:driveId', protectRoute, async (req, res) => {
    try {
        const drive = await Drive.findById(req.params.driveId);
        if (!drive) {
            return res.status(404).send('Drive not found');
        }
        res.json(drive);
    } catch (error) {
        console.error('Error fetching drive:', error);
        res.status(500).send('Server error');
    }
});



// apply for a drive only if student meets the criteria
router.post('/apply/:driveId', protectRoute, async (req, res) => {
    try {
        const student = await Student.findOne({ creds: req.user.creds });
        const drive = await Drive.findById(req.params.driveId);

        if (!drive) {
            return res.status(404).send('Drive not found');
        }

        if (!meetsCriteria(student, drive.criteria)) {
            return res.status(403).send('You do not meet the criteria for this drive');
        }

        const alreadyApplied = student.applied_drives.some(appliedDrive => appliedDrive.drive_id.equals(drive._id));
        if (alreadyApplied) {
            return res.status(400).send('You have already applied for this drive');
        }

        student.applied_drives.push({ drive_id: drive._id });
        await student.save();

        res.send('Application successful');
    } catch (error) {
        console.error('Error applying for drive:', error);
        res.status(500).send('Server error');
    }
});


// st
router.delete('/withdraw/:driveId', protectRoute, async (req, res) => {
    try {
        const student = await Student.findById(req.user.id);
        const driveId = req.params.driveId;

        if (!student) {
            return res.status(404).send('Student not found');
        }

        // Check if the student has applied for the drive
        const appliedDriveIndex = student.applied_drives.findIndex(appliedDrive => appliedDrive.drive_id.equals(driveId));
        if (appliedDriveIndex === -1) {
            return res.status(404).send('Student has not applied for this drive or drive not found');
        }

        student.applied_drives.splice(appliedDriveIndex, 1);
        await student.save();

        res.send('Application withdrawn successfully');
    } catch (error) {
        console.error('Error withdrawing from drive:', error);
        res.status(500).send('Server error');
    }
});




function meetsCriteria(student, criteria) {
    return (
        (!criteria.tenth_percentage || student.academics.tenth_percentage >= criteria.tenth_percentage) &&
        (!criteria.twelfth_percentage || student.academics.twelfth_percentage >= criteria.twelfth_percentage) &&
        (!criteria.cgpa || student.academics.cgpa >= criteria.cgpa) &&
        (!criteria.graduation_year || criteria.graduation_year.includes(student.academics.graduation_year)) &&
        (!criteria.stream || criteria.stream.includes('ALL') || criteria.stream.includes(student.stream)) &&
        (student.work_experience.length >= criteria.work_experience_count)
    );
}



module.exports = router;




