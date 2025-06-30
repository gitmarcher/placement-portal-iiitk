const express = require('express');
const router = express.Router();
const protectAuth = require('../../middleware/studentAuth');
const Student  = require('../../models/studentModel');
const StudentCred = require('../../models/studentCred');
// fetch userinfo
router.get('/', protectAuth, async (req, res) => {
    try {
        console.log("User ID from req.user:", req.user._id); // Updated debug log
        const student = await Student.findOne({ creds: req.user._id }); // Updated to use req.user._id

        console.log("Student found:", student);
        if (!student) {
            return res.status(404).send('Student not found');
        }

        res.json({
            roll_no: student.roll_no,
            name: student.name,
            email_id: student.email_id,
            stream: student.stream,
            phone_no: student.phone_no,
            gender: student.gender,
            work_experience: student.work_experience,
            additional_skills: student.additional_skills,
            digital_locker: student.digital_locker,
            address: student.address,
            academics: student.academics,
            applied_drives: student.applied_drives,
            resume_link: student.resume_link,
            linkedin_profile: student.linkedin_profile,
            github_profile: student.github_profile
        });
    } catch (error) {
        console.error('Error fetching student:', error);
        res.status(500).send('Error fetching student');
    }
});

// update userinfo
router.put('/', protectAuth, async (req, res) => {
    try {
        const updateData = {
            name: req.body.name,
            email_id: req.body.email_id,
            stream: req.body.stream,
            phone_no: req.body.phone_no,
            gender: req.body.gender,
            work_experience: req.body.work_experience,
            additional_skills: req.body.additional_skills,
            digital_locker: req.body.digital_locker,
            address: req.body.address,
            academics: req.body.academics,
            // applied_drives: req.body.applied_drives
        };

        // Remove undefined or null fields
        Object.keys(updateData).forEach(key => 
            (updateData[key] === undefined || updateData[key] === null) && delete updateData[key]
        );
        console.log("Update data:", updateData);    

        const student = await Student.findOneAndUpdate(
            { creds: req.user._id }, // Updated to use req.user._id
            updateData,
            { new: true }
        );

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.json({
            message: 'Profile updated successfully',
            student: student
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).send('Server error');
    }
});


// sample json data
// {
//     "name": "John Doe",
//     "email_id": "john.doe@example.com",
//     "stream": "Computer Science",
//     "phone_no": ["1234567890"],
//     "gender": "Male",
//     "work_experience": ["Intern at ABC Corp"],
//     "additional_skills": ["Python", "Data Analysis"],
//     "digital_locker": "abcd",
//     "address": {
//         "street": "123 Main St",
//         "city": "Springfield",
//         "state": "IL",
//         "district": "Central",
//         "pin_code": "123456"
//     },
//     "academics": {
//         "cgpa": 9.5,
//         "tenth_board_name": "CBSE",
//         "tenth_percentage": 95.0,
//         "tenth_passing_year": 2010,
//         "twelfth_board_name": "CBSE",
//         "twelfth_percentage": 90.0,
//         "twelfth_passing_year": 2012,
//         "graduation_degree": "B.Tech",
//         "graduation_year": 2016
//     },
//     "applied_drives": []
// }


module.exports = router;
