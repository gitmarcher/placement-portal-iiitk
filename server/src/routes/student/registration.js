const express = require('express');
const bcrypt = require('bcryptjs');
const StudentCred = require('../../models/studentCred'); 
const Student = require('../../models/studentModel');
const protectRoute = require('../../middleware/studentAuth');
const router = express.Router();

router.post('', async (req, res) => {
    const { username, password } = req.body;

    const user = await StudentCred.findOne({ username });
    if (user) {
        return res.status(400).json({ error: 'Username already exists' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newStudentCred = new StudentCred({
            username,
            password: hashedPassword,
            lastLogin: new Date(),
        });

        await newStudentCred.save();
        res.status(201).json({ message: 'Registration successful, please complete your profile.' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


router.post('/complete-profile', protectRoute, async (req, res) => {
  if (req.user.profileComplete) {
    return res.status(400).json({ error: "Profile already completed" });
  }

  try {
    const createData = {
      roll_no: req.body.roll_no,
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
      applied_drives: req.body.applied_drives,
      resume_link: req.body.resume_link,
      linkedin_profile: req.body.linkedin_profile,
      github_profile: req.body.github_profile,
    };

    console.log("createData:", createData);

    const student = await Student.findOne({ creds: req.user._id });
    if (student) {
      return res.status(400).json({ error: 'Student already exists' });
    }

    const newStudent = new Student({
      creds: req.user._id,
      ...createData,
    });

    await newStudent.save();
    res.status(201).json({ message: 'Profile created successfully' });
  } catch (err) {
    console.error("Error:", err);
    res.status(400).json({ error: err.message });
  }
});


module.exports = router;