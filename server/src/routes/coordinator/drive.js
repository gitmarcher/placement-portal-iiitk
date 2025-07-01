const express = require('express');
const router = express.Router();
const Drive = require('../../models/driveModel');
const protectCoordinatorAuth = require('../../middleware/coordinatorAuth'); // Middleware for coordinator auth
const User = require('../../models/studentModel');
const StudentCred = require('../../models/studentCred');
const Student  = require('../../models/studentModel');
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

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
const multer = require('multer');

// Configure multer for JD file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../../../JDs');
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        // Generate unique filename with timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = `jd-${uniqueSuffix}${path.extname(file.originalname)}`;
        cb(null, filename);
    }
});

// File filter for JD uploads (accept common document formats)
const fileFilter = (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|txt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype) || 
                     file.mimetype === 'application/pdf' ||
                     file.mimetype === 'application/msword' ||
                     file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                     file.mimetype === 'text/plain';
    
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only PDF, DOC, DOCX, and TXT files are allowed for JD uploads'));
    }
};

const uploadJDs = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: fileFilter
});

router.post('/create', protectCoordinatorAuth, uploadJDs.array('jd_files', 10), async (req, res) => {
  try {
    console.log("Received request body:", req.body);
    console.log("Uploaded files:", req.files);

    // Parse JSON fields from FormData if they exist, otherwise use direct values
    const parseField = (field) => {
      if (typeof field === 'string' && (field.startsWith('[') || field.startsWith('{'))) {
        try {
          return JSON.parse(field);
        } catch (e) {
          return field;
        }
      }
      return field;
    };

    const {
      drive_name,
      company_name,
      company_logo,
      about,
      type_of_role,
      ctc,
      stipend,
      duration,
      number_of_positions,
      deadline,
      drive_date
    } = req.body;

    // Parse complex fields
    const location = parseField(req.body.location) || [];
    const rounds = parseField(req.body.rounds) || [];
    const criteria = parseField(req.body.criteria) || {};
    const required_details = parseField(req.body.required_details) || [];
    const custom_required_details = parseField(req.body.custom_required_details) || [];
    const custom_questions = parseField(req.body.custom_questions) || [];

    // Process uploaded JD files
    const jdFiles = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        jdFiles.push({
          filename: file.filename,
          original_name: file.originalname,
          file_size: file.size,
          upload_date: new Date()
        });
      }
    }

    const newDrive = new Drive({
      drive_name,
      company_name,
      company_logo,
      about,
      type_of_role,
      location,
      ctc,
      stipend,
      duration,
      number_of_positions,
      deadline,
      drive_date,
      rounds,
      criteria,
      required_details,
      custom_required_details,
      custom_questions,
      jd_files: jdFiles,
      coordinator: req.user.id,
      isActive: true
    });

    console.log("Saving new drive:", newDrive);
    await newDrive.save();
    console.log("Drive saved successfully:", newDrive);

    res.status(201).json({ 
      message: "Drive created successfully", 
      drive: newDrive,
      uploaded_jd_files: jdFiles.length
    });
  } catch (error) {
    console.error("Error creating drive:", error);
    
    // Clean up uploaded files if drive creation fails
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          fs.unlinkSync(file.path);
        } catch (unlinkError) {
          console.error("Error deleting uploaded file:", unlinkError);
        }
      }
    }
    
    if (error.code === 11000) {
      return res.status(400).json({
        error: `A drive with the name "${req.body.drive_name}" already exists`,
      });
    }
    res.status(500).json({ error: "Failed to create drive", details: error.message });
  }
});

// Toggle drive active status (this route handles both ending applications and ending drive)
router.put('/toggle-active/:driveId', protectCoordinatorAuth, async (req, res) => {
    try {
        const drive = await Drive.findById(req.params.driveId);
        
        if (!drive) {
            return res.status(404).json({ error: 'Drive not found' });
        }

        const { action } = req.body; // 'end-applications', 'end-drive', 'reactivate', or 'resume-applications'
        
        if (action === 'end-applications') {
            // End applications but keep drive active
            drive.acceptingApplications = false;
            await drive.save();
            
            res.json({ 
                message: 'Applications closed successfully',
                isActive: drive.isActive,
                acceptingApplications: drive.acceptingApplications
            });
        } else if (action === 'resume-applications') {
            // Resume applications only if results haven't started
            if (drive.results_started) {
                return res.status(400).json({ 
                    error: 'Cannot resume applications after results process has started'
                });
            }
            
            drive.acceptingApplications = true;
            await drive.save();
            
            res.json({ 
                message: 'Applications resumed successfully',
                isActive: drive.isActive,
                acceptingApplications: drive.acceptingApplications
            });
        } else if (action === 'end-drive') {
            // End the entire drive
            drive.isActive = false;
            drive.acceptingApplications = false;
            await drive.save();
            
            res.json({ 
                message: 'Drive ended successfully',
                isActive: drive.isActive,
                acceptingApplications: drive.acceptingApplications
            });
        } else if (action === 'reactivate') {
            // Reactivate the drive and applications
            drive.isActive = true;
            drive.acceptingApplications = true;
            await drive.save();
            
            res.json({ 
                message: 'Drive reactivated successfully',
                isActive: drive.isActive,
                acceptingApplications: drive.acceptingApplications
            });
        } else {
            // Legacy support - toggle isActive (keeping old behavior for backward compatibility)
        drive.isActive = !drive.isActive;
            if (!drive.isActive) {
                drive.acceptingApplications = false;
            }
        await drive.save();
        
        res.json({ 
                message: `Drive ${drive.isActive ? 'reactivated' : 'ended'} successfully`,
                isActive: drive.isActive,
                acceptingApplications: drive.acceptingApplications
        });
        }
    } catch (error) {
        console.error('Error toggling drive status:', error);
        res.status(500).json({ error: 'Failed to update drive status' });
    }
});

// Delete an experience shared by a student
router.delete('/experience/:driveId/:experienceId', protectCoordinatorAuth, async (req, res) => {
    try {
        const { driveId, experienceId } = req.params;
        const drive = await Drive.findById(driveId);
        
        if (!drive) {
            return res.status(404).json({ message: 'Drive not found' });
        }
        
        // Find the experience to delete
        const experienceIndex = drive.experiences.findIndex(exp => 
            exp._id.toString() === experienceId
        );
        
        if (experienceIndex === -1) {
            return res.status(404).json({ message: 'Experience not found' });
        }
        
        // Remove the experience from the array
        drive.experiences.splice(experienceIndex, 1);
        await drive.save();
        
        res.json({ message: 'Experience deleted successfully' });
    } catch (error) {
        console.error('Error deleting experience:', error.message);
        res.status(500).json({ error: 'Failed to delete experience' });
    }
});

// Get all applications for a drive
router.get('/applications/:driveId', protectCoordinatorAuth, async (req, res) => {
    try {
        const drive = await Drive.findById(req.params.driveId);
        
        if (!drive) {
            return res.status(404).json({ message: 'Drive not found' });
        }

        // Populate full student details for each applicant
        const populatedApplicants = [];
        
        for (const applicant of drive.applied_students) {
            try {
                const student = await Student.findById(applicant.student);
                if (student) {
                    // Determine current status based on round results
                    const actualStatus = getStudentStatusFromRoundResults(applicant.student, drive.round_results, drive.rounds.length);
                    
                    populatedApplicants.push({
                        student_id: applicant.student,
                        name: student.name ?? 'N/A',
                        roll_no: student.roll_no ?? 'N/A',
                        email: student.email_id ?? 'N/A',
                        phone: applicant.phone ?? (student.phone_no && student.phone_no.length > 0 ? student.phone_no[0] : null) ?? 'N/A',
                        cgpa: student.academics?.cgpa ?? 'N/A',
                        resume_link: applicant.resumeLink ?? student.resume_link ?? 'N/A',
                        applied_at: applicant.applicationTimestamp ?? 'N/A',
                        current_status: actualStatus,
                        application_date: applicant.applicationTimestamp ?? 'N/A',
                        tenth_percentage: student.academics?.tenth_percentage ?? 'N/A',
                        twelfth_percentage: student.academics?.twelfth_percentage ?? 'N/A',
                        graduation_year: student.academics?.graduation_year ?? 'N/A',
                        stream: student.stream ?? 'N/A',
                        backlogs: student.academics?.backlogs ?? 'N/A',
                        address: student.address ?? 'N/A',
                        custom_field_responses: applicant.custom_field_responses || [],
                        custom_question_responses: applicant.custom_question_responses || []
                    });
                }
            } catch (err) {
                console.error('Error populating student:', err);
            }
        }
        
        res.json({
            drive_name: drive.drive_name,
            company_name: drive.company_name,
            isActive: drive.isActive,
            acceptingApplications: drive.acceptingApplications,
            applicants: populatedApplicants
        });
    } catch (error) {
        console.error('Error fetching applications:', error.message);
        res.status(500).json({ error: 'Failed to fetch applications' });
    }
});

// Download applicants list as Excel file using template
router.get('/download-applicants/:driveId', protectCoordinatorAuth, async (req, res) => {
    try {
        const drive = await Drive.findById(req.params.driveId);
        
        if (!drive) {
            return res.status(404).json({ message: 'Drive not found' });
        }

        // Path to template file
        const templatePath = path.join(__dirname, '../../../templates/template.xlsx');
        
        // Check if template exists
        if (!fs.existsSync(templatePath)) {
            return res.status(500).json({ error: 'Excel template not found' });
        }

        // Create a new workbook from template
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(templatePath);
        const worksheet = workbook.getWorksheet('Applicants');

        // Clear existing data (keep only headers row)
        worksheet.spliceRows(2, worksheet.rowCount - 1);

        // Build dynamic headers based on custom fields
        let headers = ['Name', 'Roll No', 'Email', 'Phone', 'CGPA', 'Resume Link', 'Applied Date'];
        
        // Add custom required details headers
        if (drive.custom_required_details && drive.custom_required_details.length > 0) {
            drive.custom_required_details.forEach(field => {
                headers.push(field.field_label);
            });
        }
        
        // Add custom questions headers
        if (drive.custom_questions && drive.custom_questions.length > 0) {
            drive.custom_questions.forEach(question => {
                headers.push(question.question_text);
            });
        }

        // Update headers in the worksheet
        worksheet.getRow(1).values = headers;
        
        // Style the header row
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE6E6E6' }
        };

        // Add data rows
        let rowIndex = 2;
        for (const applicant of drive.applied_students) {
            try {
                const student = await Student.findById(applicant.student);
                if (student) {
                    let rowData = [];
                    
                    // Standard fields
                    rowData.push(student.name || 'N/A');
                    rowData.push(student.roll_no || 'N/A');
                    rowData.push(student.email_id || 'N/A');
                    rowData.push(applicant.phone || (student.phone_no && student.phone_no.length > 0 ? student.phone_no[0] : '') || 'N/A');
                    rowData.push(student.academics?.cgpa || 'N/A');
                    rowData.push(applicant.resumeLink || student.resume_link || 'N/A');
                    rowData.push(applicant.applicationTimestamp ? new Date(applicant.applicationTimestamp).toLocaleDateString() : 'N/A');
                    
                    // Custom required details
                    if (drive.custom_required_details && drive.custom_required_details.length > 0) {
                        drive.custom_required_details.forEach(field => {
                            const response = applicant.custom_field_responses?.find(r => r.field_id === field.field_id);
                            const value = response ? response.field_value : 'N/A';
                            rowData.push(value || 'N/A');
                        });
                    }
                    
                    // Custom questions
                    if (drive.custom_questions && drive.custom_questions.length > 0) {
                        drive.custom_questions.forEach(question => {
                            const response = applicant.custom_question_responses?.find(r => r.question_id === question.question_id);
                            let value = 'N/A';
                            if (response) {
                                if (Array.isArray(response.answer)) {
                                    value = response.answer.join('; ');
                                } else {
                                    value = response.answer;
                                }
                            }
                            rowData.push(value || 'N/A');
                        });
                    }
                    
                    // Add row to worksheet
                    worksheet.addRow(rowData);
                    rowIndex++;
                }
            } catch (err) {
                console.error('Error populating student for Excel:', err);
            }
        }

        // Auto-fit columns
        worksheet.columns.forEach(column => {
            column.width = 15;
        });

        // Generate unique filename
        const cleanDriveName = drive.drive_name.replace(/[^a-zA-Z0-9]/g, '_');
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `${cleanDriveName}_Applicants_${timestamp}.xlsx`;
        const outputPath = path.join(__dirname, '../../../templates', filename);

        // Save the populated file
        await workbook.xlsx.writeFile(outputPath);
        
        // Set response headers for Excel download
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Cache-Control', 'no-cache');
        
        // Send the file
        res.sendFile(outputPath, (err) => {
            if (err) {
                console.error('Error sending file:', err);
                res.status(500).json({ error: 'Failed to send Excel file' });
            }
            
            // Delete the file after sending
            fs.unlink(outputPath, (unlinkErr) => {
                if (unlinkErr) {
                    console.error('Error deleting temporary file:', unlinkErr);
                } else {
                    console.log('Temporary file deleted successfully:', filename);
                }
            });
        });
        
    } catch (error) {
        console.error('Error generating Excel file:', error.message);
        res.status(500).json({ error: 'Failed to generate Excel file' });
    }
});

// Get all experiences for a drive
router.get('/experiences/:driveId', protectCoordinatorAuth, async (req, res) => {
    try {
        const drive = await Drive.findById(req.params.driveId);
        
        if (!drive) {
            return res.status(404).json({ message: 'Drive not found' });
        }
        
        res.json(drive.experiences);
    } catch (error) {
        console.error('Error fetching experiences:', error.message);
        res.status(500).json({ error: 'Failed to fetch experiences' });
    }
});

router.delete('/delete/:id', protectCoordinatorAuth, async (req, res) => {
    try {
        const driveId = req.params.id;

        const drive = await Drive.findOne({ _id: driveId, coordinator: req.user.id });
        if (!drive) {
            return res.status(404).json({ message: 'Drive not found or unauthorized' });
        }

        await drive.remove(); // Remove the drive
        res.json({ message: 'Drive deleted successfully' });
    } catch (error) {
        console.error('Error deleting drive:', error.message);
        res.status(500).json({ error: 'Failed to delete drive' });
    }
});


const getUsersByUsernames = async (usernames) => {
    try {
        const studentCreds = await StudentCred.find({ username: { $in: usernames } });
        const credIds = studentCreds.map(cred => cred._id);
        return await User.find({ creds: { $in: credIds } });
    } catch (error) {
        console.error("Error fetching users by usernames:", error.message);
        throw error;
    }
};

router.put('/update-selected/:driveId/:roundNumber', protectCoordinatorAuth, async (req, res) => {
    try {
        const { driveId, roundNumber } = req.params;
        const { usernames } = req.body;

        const drive = await Drive.findOne({ _id: driveId, coordinator: req.user.id });
        if (!drive) {
            return res.status(404).json({ message: 'Drive not found or unauthorized' });
        }

        const round = drive.rounds.find(round => round.round_number === parseInt(roundNumber));
        if (!round) {
            return res.status(404).json({ message: 'Round not found' });
        }

        const users = await getUsersByUsernames(usernames);
        const userIds = users.map(user => user._id);

        // Use a Set to ensure unique entries
        round.selected_students = Array.from(new Set([
            ...(round.selected_students || []),
            ...userIds,
        ]));

        const isLastRound = roundNumber == drive.rounds.length;

        await Student.updateMany(
            { 'applied_drives.drive_id': driveId },
            {
                $set: {
                    'applied_drives.$[elem].status': {
                        $cond: {
                            if: { $in: ['$$elem.student_id', round.selected_students] },
                            then: isLastRound ? 'Accepted' : 'Shortlisted',
                            else: 'Rejected'
                        }
                    }
                }
            },
            {
                arrayFilters: [{ 'elem.drive_id': driveId }]
            }
        );


        await drive.save();
        res.json({ message: 'Students added successfully for the round', drive });
    } catch (error) {
        console.error('Error adding students:', error.message);
        res.status(500).json({ error: 'Failed to add students' });
    }
});

// Get all drives - MUST be before /:id route
router.get('/all', protectCoordinatorAuth, async (req, res) => {
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

// Get single drive by ID for editing
router.get('/:id', protectCoordinatorAuth, async (req, res) => {
    try {
        const drive = await Drive.findById(req.params.id);
        
        if (!drive) {
            return res.status(404).json({ message: 'Drive not found' });
        }
        
        res.json(drive);
    } catch (error) {
        console.error('Error fetching drive:', error);
        res.status(500).json({ error: 'Failed to fetch drive details' });
    }
});

// Update drive by ID
router.put('/:id', protectCoordinatorAuth, async (req, res) => {
    try {
        const {
            drive_name,
            company_name,
            company_logo,
            about,
            type_of_role,
            location,
            ctc,
            duration,
            number_of_positions,
            deadline,
            drive_date,
            rounds,
            criteria,
            required_details,
        } = req.body;

        const drive = await Drive.findById(req.params.id);
        
        if (!drive) {
            return res.status(404).json({ message: 'Drive not found' });
        }

        // Update the drive fields
        drive.drive_name = drive_name;
        drive.company_name = company_name;
        drive.company_logo = company_logo;
        drive.about = about;
        drive.type_of_role = type_of_role;
        drive.location = location;
        drive.ctc = ctc;
        drive.duration = duration;
        drive.number_of_positions = number_of_positions;
        drive.deadline = deadline;
        drive.drive_date = drive_date;
        drive.rounds = rounds;
        drive.criteria = criteria;
        drive.required_details = required_details;

        await drive.save();
        
        res.json({ message: 'Drive updated successfully', drive });
    } catch (error) {
        console.error('Error updating drive:', error);
        if (error.code === 11000) {
            return res.status(400).json({
                error: `A drive with the name "${req.body.drive_name}" already exists`,
            });
        }
        res.status(500).json({ error: 'Failed to update drive', details: error.message });
    }
});

router.delete('/update-selected/:driveId/:roundNumber', protectCoordinatorAuth, async (req, res) => {
    try {
        const { driveId, roundNumber } = req.params;
        const { usernames } = req.body;

        const drive = await Drive.findOne({ _id: driveId, coordinator: req.user.id });
        if (!drive) {
            return res.status(404).json({ message: 'Drive not found or unauthorized' });
        }

        const round = drive.rounds.find(round => round.round_number === parseInt(roundNumber));
        if (!round) {
            return res.status(404).json({ message: 'Round not found' });
        }

        const users = await getUsersByUsernames(usernames);
        const userIds = users.map(user => user._id);

        round.selected_students = (round.selected_students || []).filter(
            studentId => !userIds.includes(studentId)
        );

        await drive.save();
        res.json({ message: 'Students removed successfully for the round', drive });
    } catch (error) {
        console.error('Error removing students:', error.message);
        res.status(500).json({ error: 'Failed to remove students' });
    }
});

// Add experience for a drive (coordinator version)
router.post('/add-experience/:driveId', protectCoordinatorAuth, async (req, res) => {
    try {
        const coordinator = req.user;
        const drive = await Drive.findById(req.params.driveId);
        
        if (!drive) {
            return res.status(404).json({ message: 'Drive not found' });
        }
        
        const { comment } = req.body;
        
        if (!comment || comment.trim() === '') {
            return res.status(400).json({ message: 'Experience comment cannot be empty' });
        }
        
        drive.experiences.push({
            comment,
            studentName: 'Coordinator',
            studentId: coordinator._id,
            likes: 0,
            timestamp: new Date()
        });
        
        await drive.save();
        
        res.status(201).json({
            message: 'Experience added successfully',
            experience: drive.experiences[drive.experiences.length - 1]
        });
    } catch (error) {
        console.error('Error adding experience:', error.message);
        res.status(500).json({ error: 'Failed to add experience' });
    }
});

// Test endpoint to create sample drives (for development/testing only)
router.post('/create-test-data', protectCoordinatorAuth, async (req, res) => {
    try {
        // Only allow this in development or for coordinators
        const testDrives = [
            {
                drive_name: "Software Engineer - Google",
                company_name: "Google",
                company_logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/368px-Google_2015_logo.svg.png",
                about: "Join Google as a Software Engineer and work on products that impact billions of users worldwide. You'll be working with cutting-edge technology and collaborating with some of the brightest minds in the industry.",
                type_of_role: "Full-time",
                location: ["Mountain View", "Bangalore", "Hyderabad"],
                ctc: "₹25-30 LPA",
                duration: "Permanent",
                number_of_positions: 5,
                deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
                drive_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
                rounds: [
                    {
                        round_number: 1,
                        round_name: "Online Assessment",
                        description: "Coding round with data structures and algorithms questions"
                    },
                    {
                        round_number: 2,
                        round_name: "Technical Interview",
                        description: "Technical interview focusing on system design and coding"
                    },
                    {
                        round_number: 3,
                        round_name: "HR Interview",
                        description: "Final round with HR for cultural fit and compensation discussion"
                    }
                ],
                criteria: {
                    tenth_percentage: 75,
                    twelfth_percentage: 75,
                    graduation_degree: "B.Tech",
                    graduation_year: [2024, 2025],
                    cgpa: 7.5,
                    stream: ["CSE", "ECE"],
                    work_experience_count: 0,
                    max_backlogs: 0
                },
                required_details: ["name", "email", "phone", "resume", "cgpa", "backlogs", "10th", "12th", "address"],
                isActive: true,
                applied_students: [],
                experiences: []
            },
            {
                drive_name: "Backend Developer - Amazon",
                company_name: "Amazon",
                company_logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/603px-Amazon_logo.svg.png",
                about: "Join Amazon's backend engineering team and help build scalable systems that serve millions of customers worldwide. Work with AWS technologies and distributed systems.",
                type_of_role: "Full-time",
                location: ["Seattle", "Bangalore", "Chennai"],
                ctc: "₹20-25 LPA",
                duration: "Permanent",
                number_of_positions: 8,
                deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
                drive_date: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
                rounds: [
                    {
                        round_number: 1,
                        round_name: "Online Test",
                        description: "Coding and aptitude test"
                    },
                    {
                        round_number: 2,
                        round_name: "Technical Round 1",
                        description: "Data structures and algorithms interview"
                    }
                ],
                criteria: {
                    tenth_percentage: 65,
                    twelfth_percentage: 65,
                    graduation_degree: "B.Tech",
                    graduation_year: [2024, 2025],
                    cgpa: 7.0,
                    stream: ["ALL"],
                    work_experience_count: 0,
                    max_backlogs: 2
                },
                required_details: ["name", "email", "phone", "resume", "cgpa", "10th", "12th"],
                isActive: true,
                applied_students: [],
                experiences: []
            }
        ];

        const insertedDrives = await Drive.insertMany(testDrives);
        
        res.status(201).json({
            message: `Successfully created ${insertedDrives.length} test drives`,
            drives: insertedDrives.map(drive => ({
                id: drive._id,
                name: drive.drive_name,
                company: drive.company_name
            }))
        });

    } catch (error) {
        console.error('Error creating test data:', error);
        res.status(500).json({ message: 'Failed to create test data' });
    }
});

// Get results data for a drive
router.get('/results/:driveId', protectCoordinatorAuth, async (req, res) => {
    try {
        const drive = await Drive.findById(req.params.driveId);
        
        if (!drive) {
            return res.status(404).json({ message: 'Drive not found' });
        }

        // Prepare response data
        const responseData = {
            total_applicants: drive.applied_students.length,
            total_rounds: drive.rounds.length,
            rounds: drive.rounds,
            round_results: drive.round_results || [],
            current_result_round: drive.current_result_round || 1,
            results_started: drive.results_started || false
        };

        res.json(responseData);
    } catch (error) {
        console.error('Error fetching results data:', error);
        res.status(500).json({ error: 'Failed to fetch results data' });
    }
});

// Start results process for a drive (only after drive ends)
router.post('/start-results/:driveId', protectCoordinatorAuth, async (req, res) => {
    try {
        const drive = await Drive.findById(req.params.driveId);
        
        if (!drive) {
            return res.status(404).json({ message: 'Drive not found' });
        }

        // Check if applications have ended
        if (drive.acceptingApplications) {
            return res.status(400).json({ 
                message: 'Cannot start results process while drive is still accepting applications. Please end applications first.' 
            });
        }

        // Check if results already started
        if (drive.results_started) {
            return res.status(400).json({ 
                message: 'Results process has already been started for this drive.' 
            });
        }

        // Initialize round results based on drive rounds
        const roundResults = drive.rounds.map(round => ({
            round_number: round.round_number,
            round_name: round.round_name,
            selected_students: [],
            rejected_students: [],
            waitlisted_students: [],
            offer_accepted_students: [],
            offer_rejected_students: [],
            is_published: false
        }));

        drive.round_results = roundResults;
        drive.results_started = true;
        drive.current_result_round = 1;

        await drive.save();

        res.json({ 
            message: 'Results process started successfully',
            current_round: 1,
            rounds: roundResults
        });
    } catch (error) {
        console.error('Error starting results process:', error);
        res.status(500).json({ error: 'Failed to start results process' });
    }
});

// Get eligible students for a specific round
router.get('/round-eligible/:driveId/:roundNumber', protectCoordinatorAuth, async (req, res) => {
    try {
        const { driveId, roundNumber } = req.params;
        const round = parseInt(roundNumber);
        
        const drive = await Drive.findById(driveId);
        
        if (!drive) {
            return res.status(404).json({ message: 'Drive not found' });
        }

        let eligibleStudents = [];
        let roundName = '';
        let isOfferAcceptanceRound = round > drive.rounds.length;

        if (isOfferAcceptanceRound) {
            // For offer acceptance round, get students selected in the final round
            const finalRound = drive.rounds.length;
            const finalRoundResult = drive.round_results.find(r => r.round_number === finalRound);
            
            if (finalRoundResult && finalRoundResult.is_published && finalRoundResult.selected_students.length > 0) {
                const selectedStudentIds = finalRoundResult.selected_students.map(id => id.toString());
                eligibleStudents = drive.applied_students
                    .filter(app => selectedStudentIds.includes(app.student.toString()))
                    .map(app => ({
                        student_id: app.student,
                        name: app.name,
                        email: app.email,
                        phone: app.phone,
                        current_status: app.current_status
                    }));
            }
            roundName = 'Offer Acceptance';
        } else if (round === 1) {
            // For first round, all applied students are eligible
            eligibleStudents = drive.applied_students.map(app => ({
                student_id: app.student,
                name: app.name,
                email: app.email,
                phone: app.phone,
                current_status: app.current_status
            }));
            roundName = drive.rounds.find(r => r.round_number === round)?.round_name || `Round ${round}`;
        } else {
            // For subsequent rounds, only students selected in previous round are eligible
            const previousRoundResult = drive.round_results.find(r => r.round_number === round - 1);
            
            if (previousRoundResult && previousRoundResult.is_published) {
                const selectedStudentIds = previousRoundResult.selected_students.map(id => id.toString());
                eligibleStudents = drive.applied_students
                    .filter(app => selectedStudentIds.includes(app.student.toString()))
                    .map(app => ({
                        student_id: app.student,
                        name: app.name,
                        email: app.email,
                        phone: app.phone,
                        current_status: app.current_status
                    }));
            }
            roundName = drive.rounds.find(r => r.round_number === round)?.round_name || `Round ${round}`;
        }

        // Check if offer acceptance round can be shown
        const canShowOfferAcceptance = isOfferAcceptanceRound && 
            drive.rounds.length > 0 && 
            drive.round_results.find(r => r.round_number === drive.rounds.length)?.is_published;

        res.json({
            round_number: round,
            round_name: roundName,
            eligible_students: eligibleStudents,
            can_publish: isOfferAcceptanceRound ? canShowOfferAcceptance : round <= drive.current_result_round,
            is_published: drive.round_results.find(r => r.round_number === round)?.is_published || false,
            is_offer_acceptance: isOfferAcceptanceRound
        });
    } catch (error) {
        console.error('Error fetching eligible students:', error);
        res.status(500).json({ error: 'Failed to fetch eligible students' });
    }
});

// Publish results for a specific round
router.post('/publish-results/:driveId/:roundNumber', protectCoordinatorAuth, async (req, res) => {
    try {
        const { driveId, roundNumber } = req.params;
        const { student_results } = req.body;
        const round = parseInt(roundNumber);
        
        const drive = await Drive.findById(driveId);
        
        if (!drive) {
            return res.status(404).json({ message: 'Drive not found' });
        }

        // Check if results process has started
        if (!drive.results_started) {
            return res.status(400).json({ 
                message: 'Results process has not been started. Please start the results process first.' 
            });
        }

        // Check if this is the Offer Acceptance round
        const isOfferAcceptanceRound = round > drive.rounds.length;
        
        if (!isOfferAcceptanceRound && round > drive.current_result_round) {
            return res.status(400).json({ 
                message: `Cannot publish results for future rounds. Current round is ${drive.current_result_round}.` 
            });
        }

        // Find or create round result
        let roundResult = drive.round_results.find(r => r.round_number === round);
        if (!roundResult) {
            if (isOfferAcceptanceRound) {
                // Create Offer Acceptance round result
                roundResult = {
                    round_number: round,
                    round_name: "Offer Acceptance",
                    selected_students: [],
                    rejected_students: [],
                    waitlisted_students: [],
                    offer_accepted_students: [],
                    offer_rejected_students: [],
                    is_published: false
                };
                drive.round_results.push(roundResult);
            } else {
                return res.status(404).json({ message: 'Round not found' });
            }
        }

        // Process student results
        if (isOfferAcceptanceRound) {
            // Handle offer acceptance round
            roundResult.offer_accepted_students = [];
            roundResult.offer_rejected_students = [];
            
            Object.entries(student_results).forEach(([studentId, status]) => {
                if (status === 'accepted') {
                    roundResult.offer_accepted_students.push(studentId);
                    // Add to placed students in drive
                    const existingPlacement = drive.placed_students.find(p => p.student_id.toString() === studentId);
                    if (!existingPlacement) {
                        drive.placed_students.push({
                            student_id: studentId,
                            accepted_at: new Date(),
                            offer_details: {
                                ctc: drive.ctc,
                                stipend: drive.stipend,
                                role_type: drive.type_of_role
                            }
                        });
                    }
                } else if (status === 'rejected') {
                    roundResult.offer_rejected_students.push(studentId);
                }
            });
        } else {
            // Handle regular rounds
            roundResult.selected_students = [];
            roundResult.rejected_students = [];
            roundResult.waitlisted_students = [];
            
            Object.entries(student_results).forEach(([studentId, status]) => {
                if (status === 'shortlisted') {
                    roundResult.selected_students.push(studentId);
                } else if (status === 'rejected') {
                    roundResult.rejected_students.push(studentId);
                } else if (status === 'waitlisted') {
                    roundResult.waitlisted_students.push(studentId);
                }
            });

            // Move to next round if this is the current round
            if (round === drive.current_result_round && round < drive.rounds.length) {
                drive.current_result_round = round + 1;
            }
        }

        roundResult.is_published = true;
        roundResult.published_at = new Date();
        roundResult.published_by = req.user.id;

        await drive.save();

        res.json({ 
            message: 'Results published successfully', 
            round_results: drive.round_results,
            current_round: drive.current_result_round,
            is_offer_acceptance: isOfferAcceptanceRound
        });
    } catch (error) {
        console.error('Error publishing results:', error);
        res.status(500).json({ error: 'Failed to publish results' });
    }
});

// Download JD file endpoint (accessible to both coordinators and students)
router.get('/download-jd/:driveId/:filename', async (req, res) => {
    try {
        const { driveId, filename } = req.params;
        
        // Verify the drive exists and the file belongs to it
        const drive = await Drive.findById(driveId);
        if (!drive) {
            return res.status(404).json({ message: 'Drive not found' });
        }
        
        // Check if the file exists in the drive's JD files
        const jdFile = drive.jd_files.find(file => file.filename === filename);
        if (!jdFile) {
            return res.status(404).json({ message: 'JD file not found' });
        }
        
        // Construct file path
        const filePath = path.join(__dirname, '../../../JDs', filename);
        
        // Check if file exists on disk
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'File not found on server' });
        }
        
        // Set appropriate headers for file download
        res.setHeader('Content-Disposition', `attachment; filename="${jdFile.original_name}"`);
        res.setHeader('Content-Type', 'application/octet-stream');
        
        // Send the file
        res.sendFile(filePath);
        
    } catch (error) {
        console.error('Error downloading JD file:', error);
        res.status(500).json({ error: 'Failed to download file' });
    }
});

// Placement Tracker APIs

// Get placement statistics by graduation year
router.get('/placement/statistics/:batch', protectCoordinatorAuth, async (req, res) => {
    try {
        const { batch } = req.params;
        const graduationYear = parseInt(batch);

        // Get all students with the graduation year
        const allStudents = await Student.find({ 'academics.graduation_year': graduationYear }).populate('creds');
        
        // Get all drives with placed students
        const drives = await Drive.find({
            'placed_students.0': { $exists: true }
        }).populate({
            path: 'placed_students.student_id',
            match: { 'academics.graduation_year': graduationYear },
            select: 'name email academics.graduation_year stream'
        });

        // Filter out drives that don't have students from this graduation year
        const relevantDrives = drives.filter(drive => 
            drive.placed_students.some(placement => placement.student_id && placement.student_id.academics.graduation_year === graduationYear)
        );

        // Get placed students
        const placedStudentIds = new Set();
        const placements = [];
        const ctcValues = [];
        const stipendValues = [];
        const companies = new Set();

        relevantDrives.forEach(drive => {
            drive.placed_students.forEach(placement => {
                if (placement.student_id && placement.student_id.academics.graduation_year === graduationYear) {
                    placedStudentIds.add(placement.student_id._id.toString());
                    placements.push({
                        student: placement.student_id,
                        company: drive.company_name,
                        role_type: placement.offer_details.role_type,
                        ctc: placement.offer_details.ctc,
                        stipend: placement.offer_details.stipend,
                        accepted_at: placement.accepted_at
                    });
                    
                    companies.add(drive.company_name);
                    
                    // Parse compensation values
                    if (placement.offer_details.ctc && placement.offer_details.ctc !== 'N/A') {
                        const ctc = parseFloat(placement.offer_details.ctc.replace(/[^\d.]/g, ''));
                        if (!isNaN(ctc)) ctcValues.push(ctc);
                    }
                    
                    if (placement.offer_details.stipend && placement.offer_details.stipend !== 'N/A') {
                        const stipend = parseFloat(placement.offer_details.stipend.replace(/[^\d.]/g, ''));
                        if (!isNaN(stipend)) stipendValues.push(stipend);
                    }
                }
            });
        });

        // Calculate statistics
        const totalStudents = allStudents.length;
        const placedStudents = placedStudentIds.size;
        
        const avgCTC = ctcValues.length > 0 ? 
            (ctcValues.reduce((a, b) => a + b, 0) / ctcValues.length).toFixed(2) : 0;
        
        const avgStipend = stipendValues.length > 0 ? 
            (stipendValues.reduce((a, b) => a + b, 0) / stipendValues.length).toFixed(2) : 0;
        
        const medianCTC = ctcValues.length > 0 ? 
            ctcValues.sort((a, b) => a - b)[Math.floor(ctcValues.length / 2)].toFixed(2) : 0;
        
        const medianStipend = stipendValues.length > 0 ? 
            stipendValues.sort((a, b) => a - b)[Math.floor(stipendValues.length / 2)].toFixed(2) : 0;

        res.json({
            batch: graduationYear,
            totalStudents,
            placedStudents,
            placementPercentage: totalStudents > 0 ? ((placedStudents / totalStudents) * 100).toFixed(2) : 0,
            avgCTC,
            avgStipend,
            medianCTC,
            medianStipend,
            companiesVisited: Array.from(companies),
            totalCompanies: companies.size,
            placements
        });
    } catch (error) {
        console.error('Error fetching placement statistics:', error);
        res.status(500).json({ error: 'Failed to fetch placement statistics' });
    }
});

// Get detailed student placement data by graduation year
router.get('/placement/students/:batch', protectCoordinatorAuth, async (req, res) => {
    try {
        const { batch } = req.params;
        const { search = '' } = req.query;
        const graduationYear = parseInt(batch);

        // Get all students with the graduation year
        const students = await Student.find({ 
            'academics.graduation_year': graduationYear,
            ...(search && {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                    { roll_no: { $regex: search, $options: 'i' } }
                ]
            })
        }).populate('creds');

        // Get all drives with placed students from this graduation year
        const drives = await Drive.find({
            'placed_students.0': { $exists: true }
        }).populate({
            path: 'placed_students.student_id',
            match: { 'academics.graduation_year': graduationYear }
        });

        // Create a map of student placements
        const studentPlacements = new Map();
        
        drives.forEach(drive => {
            drive.placed_students.forEach(placement => {
                if (placement.student_id && placement.student_id.academics.graduation_year === graduationYear) {
                    studentPlacements.set(placement.student_id._id.toString(), {
                        company: drive.company_name,
                        role_type: placement.offer_details.role_type,
                        ctc: placement.offer_details.ctc,
                        stipend: placement.offer_details.stipend,
                        accepted_at: placement.accepted_at
                    });
                }
            });
        });

        // Combine student data with placement data
        const studentDetails = students.map(student => ({
            student_id: student._id,
            name: student.name,
            email: student.email,
            roll_no: student.roll_no,
            stream: student.stream,
            cgpa: student.academics.cgpa,
            placement: studentPlacements.get(student._id.toString()) || null,
            isPlaced: studentPlacements.has(student._id.toString())
        }));

        res.json({
            batch: graduationYear,
            students: studentDetails,
            totalStudents: studentDetails.length,
            placedStudents: studentDetails.filter(s => s.isPlaced).length
        });
    } catch (error) {
        console.error('Error fetching student placement details:', error);
        res.status(500).json({ error: 'Failed to fetch student placement details' });
    }
});

// Get available graduation years
router.get('/placement/batches', protectCoordinatorAuth, async (req, res) => {
    try {
        const graduationYears = await Student.distinct('academics.graduation_year');
        const sortedYears = graduationYears.filter(year => year != null).sort((a, b) => b - a); // Latest first
        
        res.json({ batches: sortedYears });
    } catch (error) {
        console.error('Error fetching available graduation years:', error);
        res.status(500).json({ error: 'Failed to fetch available graduation years' });
    }
});

module.exports = router;

