const mongoose = require('mongoose');
const { link } = require('../routes/authRoutes');

/*
Status: Under Development
Access: Ansh, Abdul, DP, Sarthak
Description: Schema for Student Profile
Proposals:
    - here (Status: here)
    - here (Status: here)
Remarks/message:
    - here
*/



//username, pass, last login, (password encrypted and salted)



//address. Idk if needed
const address = new mongoose.Schema({
    street: { type: String, required: false },
    city: { type: String, required: true },
    state: { type: String, required: true },
    district: { type: String, required: true },
    pin_code: { type: String, required: true, minlength: 6, maxlength: 6 },
});




const academics = new mongoose.Schema({
    
    tenth_board_name: { type: String, required: true },
    tenth_percentage: { type: Number, required: true, min: 0, max: 100 },
    tenth_passing_year: { type: Number, required: true, minlength: 4, maxlength: 4 },
    twelfth_board_name: { type: String, required: true },
    twelfth_percentage: { type: Number, required: true, min: 0, max: 100 },
    twelfth_passing_year: { type: Number, required: true, minlength: 4, maxlength: 4 },
    graduation_degree: { type: String, required: true, default: 'B.Tech', enum: ['B.Tech'] },
    // graduation_percentage: { type: Number, required: true, min: 0, max: 100 },
    graduation_year: { type: Number, required: true, minlength: 4, maxlength: 4 },
    cgpa: { type: Number, required: true, min: 0, max: 10 },
    backlogs: { type: Number, required: true, min: 0 },

    //not sure if needed
    // pg_subject: { type: String, required: false },
    // pg_year: { type: Number, required: false, minlength: 4, maxlength: 4 },
    
    
});

//applied drives. Same data in another collection
const appliedDrives = new mongoose.Schema({
    drive_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Drive', required: true },
    application_date: { type: Date, required: true, default: Date.now },
    status: { type: String, required: true, enum: ['Applied', 'Shortlisted', 'Selected', 'Rejected'], default: 'Applied'},
});



//final schema
const studentSchema = new mongoose.Schema({
    creds: { type: mongoose.Schema.Types.ObjectId, ref: 'studentCred', required: true },     // nested
    roll_no: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email_id: { type: String, required: true, unique: true, match: /\S+@\S+\.\S+/ },
    stream: { type: String, required: true },
    batch: { type: Number, required: true, min: 2000, max: 2050 }, // Added batch field
    phone_no: [{ type: String, required: true, minlength: 10, maxlength: 15 }],
    gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
    work_experience: [{ type: String, required: false }],
    additional_skills: [{ type: String, required: false }],
    digital_locker: { type: String, required: true },
    resume_link: { type: String, required: true },
    linkedin_profile: { type: String, required: false },
    github_profile: { type: String, required: false },

    address: { type: address, required: true },                 // nested
    academics: { type: academics, required: true },             // nested
    applied_drives: { type: [appliedDrives], required: false }, // nested
});


const Student = mongoose.model('Student',studentSchema);


module.exports = Student;