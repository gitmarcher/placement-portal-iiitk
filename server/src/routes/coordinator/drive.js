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

router.post('/create', protectCoordinatorAuth, async (req, res) => {
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
      required_details, // Ensure this is included
      custom_required_details, // New: Custom required details
      custom_questions, // New: Custom questions
    } = req.body;

    console.log("Received request body:", req.body);

    const newDrive = new Drive({
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
      required_details, // Add this field
      custom_required_details: custom_required_details || [], // Add custom required details
      custom_questions: custom_questions || [], // Add custom questions
      coordinator: req.user.id,
      isActive: true // Default to active
    });

    console.log("Saving new drive:", newDrive);
    await newDrive.save();
    console.log("Drive saved successfully:", newDrive);

    res.status(201).json({ message: "Drive created successfully", drive: newDrive });
  } catch (error) {
    console.error("Error creating drive:", error);
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

        const { action } = req.body; // 'end-applications', 'end-drive', or 'reactivate'
        
        if (action === 'end-applications') {
            // End applications but keep drive active
            drive.acceptingApplications = false;
            await drive.save();
            
            res.json({ 
                message: 'Applications closed successfully',
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
                    populatedApplicants.push({
                        student_id: applicant.student,
                        name: student.name ?? 'N/A',
                        roll_no: student.roll_no ?? 'N/A',
                        email: student.email_id ?? 'N/A',
                        phone: applicant.phone ?? (student.phone_no && student.phone_no.length > 0 ? student.phone_no[0] : null) ?? 'N/A',
                        cgpa: student.academics?.cgpa ?? 'N/A',
                        resume_link: applicant.resumeLink ?? student.resume_link ?? 'N/A',
                        applied_at: applicant.applicationTimestamp ?? 'N/A',
                        current_status: applicant.current_status ?? 'Applied',
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

        if (round === 1) {
            // For first round, all applied students are eligible
            eligibleStudents = drive.applied_students.map(app => ({
                student_id: app.student,
                name: app.name,
                email: app.email,
                phone: app.phone,
                current_status: app.current_status
            }));
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
        }

        res.json({
            round_number: round,
            round_name: drive.rounds.find(r => r.round_number === round)?.round_name || `Round ${round}`,
            eligible_students: eligibleStudents,
            can_publish: round <= drive.current_result_round,
            is_published: drive.round_results.find(r => r.round_number === round)?.is_published || false
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
        const { student_results } = req.body; // Changed from selected_students to student_results
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

        // Check if trying to publish future rounds
        if (round > drive.current_result_round) {
            return res.status(400).json({ 
                message: `Cannot publish results for future rounds. Current round is ${drive.current_result_round}.` 
            });
        }

        // Publish results for the specified round
        const roundResult = drive.round_results.find(r => r.round_number === round);
        if (!roundResult) {
            return res.status(404).json({ message: 'Round not found' });
        }

        roundResult.selected_students = student_results;
        roundResult.is_published = true;

        await drive.save();

        res.json({ message: 'Results published successfully', round_results: drive.round_results });
    } catch (error) {
        console.error('Error publishing results:', error);
        res.status(500).json({ error: 'Failed to publish results' });
    }
});

module.exports = router;

