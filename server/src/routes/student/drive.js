const express = require('express');
const Drive = require('../../models/driveModel');
const protectRoute = require('../../middleware/studentAuth');
const Student = require('../../models/studentModel');
const mongoose = require('mongoose');
const router = express.Router();

router.post('/add-applicant/:driveId', protectRoute, async (req, res) => {
    try {
        // Get student and drive
        const student = await Student.findOne({ creds: req.user._id });
        const drive = await Drive.findById(req.params.driveId);

        if (!drive) {
            return res.status(404).send('Drive not found');
        }

        if (!student) {
            return res.status(404).send('Student not found');
        }

        // Enhanced validation with detailed error messages
        const validationErrors = validateStudentEligibility(student, drive);
        if (validationErrors.length > 0) {
            return res.status(403).json({
                message: 'Application cannot be submitted',
                errors: validationErrors
            });
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
        const student = await Student.findOne({ creds: req.user._id });
        const drives = await Drive.find({});
        console.log('student:', student);
        console.log('drives:', drives);

        const eligibleDrives = drives.filter(drive => meetsCriteria(student, drive.criteria));

        // Add application status to each drive
        const drivesWithStatus = eligibleDrives.map(drive => {
            const hasApplied = drive.applied_students.some(app => 
                app.student.equals(student._id)
            );
            
            return {
                ...drive.toObject(),
                hasApplied,
                isActive: drive.isActive,
                acceptingApplications: drive.acceptingApplications
            };
        });

        res.json(drivesWithStatus);
    } catch (error) {
        console.error('Error fetching eligible drives:', error);
        res.status(500).send('Server error');
    }
});

// get drive by id
router.get('/:driveId', protectRoute, async (req, res) => {
    try {
        const student = await Student.findOne({ creds: req.user._id });
        const drive = await Drive.findById(req.params.driveId);
        
        if (!drive) {
            return res.status(404).send('Drive not found');
        }
        
        // Check if student has applied
        const hasApplied = drive.applied_students.some(app => 
            app.student.equals(student._id)
        );
        
        // Add application status to drive
        const driveWithStatus = {
            ...drive.toObject(),
            hasApplied,
            isActive: drive.isActive,
            acceptingApplications: drive.acceptingApplications
        };
        
        res.json(driveWithStatus);
    } catch (error) {
        console.error('Error fetching drive:', error);
        res.status(500).send('Server error');
    }
});

// Modified apply for a drive route
router.post('/apply/:driveId', protectRoute, async (req, res) => {
    try {
        const student = await Student.findOne({ creds: req.user._id });
        const drive = await Drive.findById(req.params.driveId);

        if (!drive) {
            return res.status(404).send('Drive not found');
        }

        if (!student) {
            return res.status(404).send('Student not found');
        }

        // Enhanced validation with detailed error messages
        const validationErrors = validateStudentEligibility(student, drive);
        if (validationErrors.length > 0) {
            return res.status(403).json({
                message: 'Application cannot be submitted',
                errors: validationErrors
            });
        }

        // Check if student already applied (in Student model)
        const alreadyAppliedInStudent = student.applied_drives.some(appliedDrive => 
            appliedDrive.drive_id.equals(drive._id)
        );
        
        // Check if student already in drive's applied_students
        const alreadyInDrive = drive.applied_students.some(application => 
            application.student.equals(student._id)
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

            // Add to Drive's applied_students with enhanced details
            // Use resume link and phone from request body if provided, otherwise use student profile data
            const applicationData = {
                student: student._id,
                name: student.name,
                email: student.email_id,
                resumeLink: req.body.resumeLink || student.resume_link,
                phone: req.body.phone || (student.phone_no && student.phone_no[0]) || '',
                applicationTimestamp: new Date()
            };
            
            drive.applied_students.push(applicationData);

            // Save both documents
            await student.save({ session });
            await drive.save({ session });

            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }

        res.status(200).json({
            message: 'Application successful',
            studentName: student.name,
            driveName: drive.drive_name
        });

    } catch (error) {
        console.error('Error applying for drive:', error);
        res.status(500).send('Server error');
    }
});

// Submit application with form data (resume link and phone)
router.post('/submit-application/:driveId', protectRoute, async (req, res) => {
    try {
        const { resumeLink, phone, custom_field_responses = [], custom_question_responses = [] } = req.body;
        const student = await Student.findOne({ creds: req.user._id });
        const drive = await Drive.findById(req.params.driveId);

        if (!drive) {
            return res.status(404).json({ message: 'Drive not found' });
        }

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Check if drive is accepting applications
        if (!drive.acceptingApplications) {
            return res.status(403).json({ message: 'This drive is no longer accepting applications' });
        }

        // Validate required fields
        if (!resumeLink || resumeLink.trim() === '') {
            return res.status(400).json({ message: 'Resume link is required' });
        }

        if (!phone || phone.trim() === '') {
            return res.status(400).json({ message: 'Phone number is required' });
        }

        // Validate custom required details
        if (drive.custom_required_details && drive.custom_required_details.length > 0) {
            for (const field of drive.custom_required_details) {
                if (field.is_required) {
                    const response = custom_field_responses.find(r => r.field_id === field.field_id);
                    if (!response || !response.field_value || 
                        (typeof response.field_value === 'string' && !response.field_value.trim())) {
                        return res.status(400).json({ message: `${field.field_label} is required` });
                    }
                }
            }
        }

        // Validate custom questions
        if (drive.custom_questions && drive.custom_questions.length > 0) {
            for (const question of drive.custom_questions) {
                if (question.is_required) {
                    const response = custom_question_responses.find(r => r.question_id === question.question_id);
                    if (!response || !response.answer || 
                        (typeof response.answer === 'string' && !response.answer.trim()) ||
                        (Array.isArray(response.answer) && response.answer.length === 0)) {
                        return res.status(400).json({ message: `${question.question_text} is required` });
                    }
                }
            }
        }

        // Validate phone number format (basic validation)
        const phoneRegex = /^[+]?[0-9\s\-\(\)]{10,15}$/;
        if (!phoneRegex.test(phone.trim())) {
            return res.status(400).json({ message: 'Please enter a valid phone number' });
        }

        // Validate resume link format (basic URL validation)
        const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
        if (!urlRegex.test(resumeLink.trim())) {
            return res.status(400).json({ message: 'Please enter a valid resume link' });
        }

        // Enhanced validation with detailed error messages
        const validationErrors = validateStudentEligibility(student, drive);
        if (validationErrors.length > 0) {
            return res.status(403).json({
                message: 'Application cannot be submitted',
                errors: validationErrors
            });
        }

        // Check if student already applied (in Student model)
        const alreadyAppliedInStudent = student.applied_drives.some(appliedDrive => 
            appliedDrive.drive_id.equals(drive._id)
        );
        
        // Check if student already in drive's applied_students
        const alreadyInDrive = drive.applied_students.some(application => 
            application.student.equals(student._id)
        );

        if (alreadyAppliedInStudent || alreadyInDrive) {
            return res.status(400).json({ message: 'You have already applied for this drive' });
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

            // Add to Drive's applied_students with form data and custom responses
            const applicationData = {
                student: student._id,
                name: student.name,
                email: student.email_id,
                resumeLink: resumeLink.trim(),
                phone: phone.trim(),
                applicationTimestamp: new Date(),
                custom_field_responses: custom_field_responses || [],
                custom_question_responses: custom_question_responses || []
            };
            
            drive.applied_students.push(applicationData);

            // Save both documents
            await student.save({ session });
            await drive.save({ session });

            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }

        res.status(200).json({
            message: 'Application submitted successfully',
            studentName: student.name,
            driveName: drive.drive_name
        });

    } catch (error) {
        console.error('Error submitting application:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Edit application for a drive
router.put('/edit-application/:driveId', protectRoute, async (req, res) => {
    try {
        const { resumeLink, phone, custom_field_responses = [], custom_question_responses = [] } = req.body;
        const student = await Student.findOne({ creds: req.user._id });
        const drive = await Drive.findById(req.params.driveId);

        if (!drive) {
            return res.status(404).json({ message: 'Drive not found' });
        }

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Check if drive is accepting applications
        if (!drive.acceptingApplications) {
            return res.status(403).json({ message: 'This drive is no longer accepting application edits' });
        }

        // Validate required fields
        if (!resumeLink || resumeLink.trim() === '') {
            return res.status(400).json({ message: 'Resume link is required' });
        }

        if (!phone || phone.trim() === '') {
            return res.status(400).json({ message: 'Phone number is required' });
        }

        // Validate custom required details
        if (drive.custom_required_details && drive.custom_required_details.length > 0) {
            for (const field of drive.custom_required_details) {
                if (field.is_required) {
                    const response = custom_field_responses.find(r => r.field_id === field.field_id);
                    if (!response || !response.field_value || 
                        (typeof response.field_value === 'string' && !response.field_value.trim())) {
                        return res.status(400).json({ message: `${field.field_label} is required` });
                    }
                }
            }
        }

        // Validate custom questions
        if (drive.custom_questions && drive.custom_questions.length > 0) {
            for (const question of drive.custom_questions) {
                if (question.is_required) {
                    const response = custom_question_responses.find(r => r.question_id === question.question_id);
                    if (!response || !response.answer || 
                        (typeof response.answer === 'string' && !response.answer.trim()) ||
                        (Array.isArray(response.answer) && response.answer.length === 0)) {
                        return res.status(400).json({ message: `${question.question_text} is required` });
                    }
                }
            }
        }

        // Validate phone number format (basic validation)
        const phoneRegex = /^[+]?[0-9\s\-\(\)]{10,15}$/;
        if (!phoneRegex.test(phone.trim())) {
            return res.status(400).json({ message: 'Please enter a valid phone number' });
        }

        // Validate resume link format (basic URL validation)
        const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
        if (!urlRegex.test(resumeLink.trim())) {
            return res.status(400).json({ message: 'Please enter a valid resume link' });
        }

        // Check if student has applied
        const studentApplicationIndex = drive.applied_students.findIndex(app => 
            app.student.equals(student._id)
        );
        
        if (studentApplicationIndex === -1) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Update the application with new details from request
        drive.applied_students[studentApplicationIndex].resumeLink = resumeLink.trim();
        drive.applied_students[studentApplicationIndex].phone = phone.trim();
        drive.applied_students[studentApplicationIndex].custom_field_responses = custom_field_responses || [];
        drive.applied_students[studentApplicationIndex].custom_question_responses = custom_question_responses || [];
        drive.applied_students[studentApplicationIndex].last_status_update = new Date();

        await drive.save();

        res.status(200).json({
            message: 'Application updated successfully',
            studentName: student.name,
            driveName: drive.drive_name
        });

    } catch (error) {
        console.error('Error updating application:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get application status for a drive
router.get('/application-status/:driveId', protectRoute, async (req, res) => {
    try {
        const student = await Student.findOne({ creds: req.user._id });
        const drive = await Drive.findById(req.params.driveId);

        if (!drive) {
            return res.status(404).send('Drive not found');
        }

        if (!student) {
            return res.status(404).send('Student not found');
        }

        // Check if student has applied
        const hasApplied = drive.applied_students.some(app => 
            app.student.equals(student._id)
        );

        res.status(200).json({
            hasApplied,
            isActive: drive.isActive,
            drive: {
                _id: drive._id,
                drive_name: drive.drive_name,
                company_name: drive.company_name,
                deadline: drive.deadline
            }
        });

    } catch (error) {
        console.error('Error fetching application status:', error);
        res.status(500).send('Server error');
    }
});

// Helper function to determine student's current status based on round results
function getStudentStatusFromRoundResults(studentId, roundResults, totalRounds) {
    if (!roundResults || roundResults.length === 0) {
        return "Applied";
    }

    const studentIdStr = studentId.toString();
    
    // Sort round results by round number to check in order
    const sortedResults = roundResults
        .filter(result => result.is_published)
        .sort((a, b) => a.round_number - b.round_number);

    let latestStatus = "Applied";
    let latestRound = 0;
    let hasCompletedAllRounds = false;

    for (const roundResult of sortedResults) {
        
        // Check offer acceptance results first (highest priority)
        if (roundResult.offer_accepted_students && roundResult.offer_accepted_students.some(id => id.toString() === studentIdStr)) {
            return "Offer Accepted";
        }
        
        if (roundResult.offer_rejected_students && roundResult.offer_rejected_students.some(id => id.toString() === studentIdStr)) {
            return "Offer Rejected";
        }
        
        // Check if student was rejected in this round
        if (roundResult.rejected_students && roundResult.rejected_students.some(id => id.toString() === studentIdStr)) {
            return `Rejected in round ${roundResult.round_number}`;
        }
        
        // Check if student was shortlisted/selected in this round
        if (roundResult.selected_students && roundResult.selected_students.some(id => id.toString() === studentIdStr)) {
            latestRound = roundResult.round_number;
            
            // Check if this is the final round
            if (roundResult.round_number === totalRounds) {
                hasCompletedAllRounds = true;
                latestStatus = "Offer Extended";
            } else {
                latestStatus = `Shortlisted for round ${roundResult.round_number + 1}`;
            }
        }
        
        // Check if student was waitlisted in this round
        if (roundResult.waitlisted_students && roundResult.waitlisted_students.some(id => id.toString() === studentIdStr)) {
            latestStatus = `Waitlisted in round ${roundResult.round_number}`;
            latestRound = roundResult.round_number;
        }
    }

    return latestStatus;
}

// Get application details for a specific drive (including resume link)
router.get('/application-details/:driveId', protectRoute, async (req, res) => {
    try {
        const student = await Student.findOne({ creds: req.user._id });
        const drive = await Drive.findById(req.params.driveId);

        if (!drive) {
            return res.status(404).json({ message: 'Drive not found' });
        }

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Find the student's application in the drive's applied_students array
        const application = drive.applied_students.find(app => 
            app.student.equals(student._id)
        );

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Determine current status based on round results
        const actualStatus = getStudentStatusFromRoundResults(student._id, drive.round_results, drive.rounds.length);

        res.status(200).json({
            application: {
                resumeLink: application.resumeLink,
                phone: application.phone,
                applicationTimestamp: application.applicationTimestamp,
                current_status: actualStatus,
                last_status_update: application.last_status_update,
                custom_field_responses: application.custom_field_responses || [],
                custom_question_responses: application.custom_question_responses || []
            },
            driveDetails: {
                _id: drive._id,
                drive_name: drive.drive_name,
                company_name: drive.company_name,
                deadline: drive.deadline
            }
        });

    } catch (error) {
        console.error('Error fetching application details:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add experience for a drive
router.post('/add-experience/:driveId', protectRoute, async (req, res) => {
    try {
        const student = await Student.findOne({ creds: req.user._id });
        const drive = await Drive.findById(req.params.driveId);

        if (!drive) {
            return res.status(404).send('Drive not found');
        }

        if (!student) {
            return res.status(404).send('Student not found');
        }

        const { comment } = req.body;

        if (!comment || comment.trim() === '') {
            return res.status(400).send('Experience comment cannot be empty');
        }

        drive.experiences.push({
            comment,
            studentName: student.name,
            studentId: student._id,
            likes: 0,
            timestamp: new Date()
        });

        await drive.save();

        res.status(201).json({
            message: 'Experience added successfully',
            experience: drive.experiences[drive.experiences.length - 1]
        });

    } catch (error) {
        console.error('Error adding experience:', error);
        res.status(500).send('Server error');
    }
});

// Like an experience
router.post('/like-experience/:driveId/:experienceId', protectRoute, async (req, res) => {
    try {
        const drive = await Drive.findById(req.params.driveId);

        if (!drive) {
            return res.status(404).send('Drive not found');
        }

        const experienceIndex = drive.experiences.findIndex(exp => 
            exp._id.toString() === req.params.experienceId
        );

        if (experienceIndex === -1) {
            return res.status(404).send('Experience not found');
        }

        // Increment likes
        drive.experiences[experienceIndex].likes += 1;
        await drive.save();

        res.status(200).json({
            message: 'Experience liked successfully',
            likes: drive.experiences[experienceIndex].likes
        });

    } catch (error) {
        console.error('Error liking experience:', error);
        res.status(500).send('Server error');
    }
});

// Get all experiences for a drive
router.get('/experiences/:driveId', protectRoute, async (req, res) => {
    try {
        const drive = await Drive.findById(req.params.driveId);

        if (!drive) {
            return res.status(404).send('Drive not found');
        }

        res.status(200).json(drive.experiences);

    } catch (error) {
        console.error('Error fetching experiences:', error);
        res.status(500).send('Server error');
    }
});

// get all drives that student is eligible for
router.get('/eligible', protectRoute, async (req, res) => {
    try {
        const student = await Student.findOne({ creds: req.user._id });
        const drives = await Drive.find({});

        const eligibleDrives = drives.filter(drive => meetsCriteria(student, drive.criteria));

        // Add application status to each drive
        const drivesWithStatus = eligibleDrives.map(drive => {
            const hasApplied = drive.applied_students.some(app => 
                app.student.equals(student._id)
            );
            
            return {
                ...drive.toObject(),
                hasApplied,
                isActive: drive.isActive,
                acceptingApplications: drive.acceptingApplications
            };
        });

        res.json(drivesWithStatus);
    } catch (error) {
        console.error('Error fetching eligible drives:', error);
        res.status(500).send('Server error');
    }
});

router.get('/all', protectRoute, async (req, res) => {
    try {
        const student = await Student.findOne({ creds: req.user._id });
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
        const skip = (page - 1) * limit;

        const totalDrives = await Drive.countDocuments();
        const drives = await Drive.find({})
            .skip(skip)
            .limit(limit);

        // Add application status to each drive
        const drivesWithStatus = drives.map(drive => {
            const hasApplied = drive.applied_students.some(app => 
                app.student.equals(student._id)
            );
            
            return {
                ...drive.toObject(),
                hasApplied,
                isActive: drive.isActive
            };
        });

        res.json({
            drives: drivesWithStatus,
            currentPage: page,
            totalPages: Math.ceil(totalDrives / limit),
            totalDrives
        });
    } catch (error) {
        console.error('Error fetching drives:', error);
        res.status(500).send('Server error');
    }
});

// Withdraw application from a drive
router.delete('/withdraw/:driveId', protectRoute, async (req, res) => {
    try {
        const student = await Student.findOne({ creds: req.user._id });
        const drive = await Drive.findById(req.params.driveId);

        if (!drive) {
            return res.status(404).send('Drive not found');
        }

        if (!student) {
            return res.status(404).send('Student not found');
        }

        // Check if drive is accepting applications
        if (!drive.acceptingApplications) {
            return res.status(403).send('This drive is no longer accepting application changes');
        }

        // Check if the student has applied for the drive
        const appliedDriveIndex = student.applied_drives.findIndex(appliedDrive => 
            appliedDrive.drive_id.equals(drive._id)
        );
        
        if (appliedDriveIndex === -1) {
            return res.status(404).send('Student has not applied for this drive');
        }

        // Find student in drive's applied_students
        const driveStudentIndex = drive.applied_students.findIndex(app => 
            app.student.equals(student._id)
        );

        // Update both models atomically
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Remove from Student's applied_drives
            student.applied_drives.splice(appliedDriveIndex, 1);
            
            // Remove from Drive's applied_students
            if (driveStudentIndex !== -1) {
                drive.applied_students.splice(driveStudentIndex, 1);
            }

            // Save both documents
            await student.save({ session });
            await drive.save({ session });

            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }

        res.status(200).json({
            message: 'Application withdrawn successfully'
        });
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
        (!criteria.work_experience_count || student.work_experience.length >= criteria.work_experience_count)
    );
}

// Enhanced validation function that provides detailed error messages
function validateStudentEligibility(student, drive) {
    const errors = [];
    const criteria = drive.criteria;

    // Check deadline
    if (drive.deadline && new Date() > new Date(drive.deadline)) {
        errors.push('Application deadline has passed');
    }

    // Check if drive is accepting applications
    if (!drive.acceptingApplications) {
        errors.push('This drive is no longer accepting applications');
    }

    // Academic validations
    if (criteria.tenth_percentage && student.academics.tenth_percentage < criteria.tenth_percentage) {
        errors.push(`10th percentage should be at least ${criteria.tenth_percentage}%. Your score: ${student.academics.tenth_percentage}%`);
    }

    if (criteria.twelfth_percentage && student.academics.twelfth_percentage < criteria.twelfth_percentage) {
        errors.push(`12th percentage should be at least ${criteria.twelfth_percentage}%. Your score: ${student.academics.twelfth_percentage}%`);
    }

    if (criteria.cgpa && student.academics.cgpa < criteria.cgpa) {
        errors.push(`CGPA should be at least ${criteria.cgpa}. Your CGPA: ${student.academics.cgpa}`);
    }

    if (criteria.graduation_year && !criteria.graduation_year.includes(student.academics.graduation_year)) {
        errors.push(`Graduation year should be one of: ${criteria.graduation_year.join(', ')}. Your graduation year: ${student.academics.graduation_year}`);
    }

    if (criteria.stream && !criteria.stream.includes('ALL') && !criteria.stream.includes(student.stream)) {
        errors.push(`Stream should be one of: ${criteria.stream.join(', ')}. Your stream: ${student.stream}`);
    }

    if (criteria.work_experience_count && student.work_experience.length < criteria.work_experience_count) {
        errors.push(`Minimum ${criteria.work_experience_count} years of work experience required. Your experience: ${student.work_experience.length} years`);
    }

    // Check for backlogs based on drive criteria
    if (criteria.max_backlogs !== undefined && student.academics.backlogs > criteria.max_backlogs) {
        errors.push(`Maximum ${criteria.max_backlogs} backlogs allowed. Current backlogs: ${student.academics.backlogs}`);
    }

    // Check required details
    const requiredDetails = drive.required_details || [];
    const missingDetails = [];

    requiredDetails.forEach(detail => {
        switch (detail) {
            case 'name':
                if (!student.name) missingDetails.push('Name');
                break;
            case 'email':
                if (!student.email_id) missingDetails.push('Email');
                break;
            case 'phone':
                if (!student.phone_no || student.phone_no.length === 0) missingDetails.push('Phone number');
                break;
            case 'resume':
                if (!student.resume_link) missingDetails.push('Resume link');
                break;
            case 'cgpa':
                if (!student.academics.cgpa) missingDetails.push('CGPA');
                break;
            case 'backlogs':
                if (student.academics.backlogs === undefined || student.academics.backlogs === null) missingDetails.push('Backlogs information');
                break;
            case '10th':
                if (!student.academics.tenth_percentage) missingDetails.push('10th percentage');
                break;
            case '12th':
                if (!student.academics.twelfth_percentage) missingDetails.push('12th percentage');
                break;
            case 'address':
                if (!student.address || !student.address.city || !student.address.state) missingDetails.push('Address');
                break;
            case 'skills':
                if (!student.additional_skills || student.additional_skills.length === 0) missingDetails.push('Skills');
                break;
            case 'linkedin':
                if (!student.linkedin_profile) missingDetails.push('LinkedIn profile');
                break;
            case 'github':
                if (!student.github_profile) missingDetails.push('GitHub profile');
                break;
        }
    });

    if (missingDetails.length > 0) {
        errors.push(`Please complete your profile. Missing: ${missingDetails.join(', ')}`);
    }

    return errors;
}

module.exports = router;




