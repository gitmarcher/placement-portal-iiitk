const mongoose = require("mongoose");

const round = new mongoose.Schema({
    round_number: { type: Number, required: true, min: 1 },
    round_name: { type: String, required: true },
    description: { type: String, required: true },
    selected_students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }]
});

const criteria = new mongoose.Schema({
    tenth_percentage: { type: Number, required: false, min: 0, max: 100 },
    twelfth_percentage: { type: Number, required: false, min: 0, max: 100 },
    graduation_degree: { type: String, required: false, default: "B.Tech" },
    graduation_year: {
        required: false,
        type: [Number],
        validate: (years) => years.every((year) => year.toString().length === 4),
    },
    cgpa: { type: Number, required: false, min: 0, max: 10 },
    stream: {
        type: [String],
        required: false,
        default: "ALL",
        enum: ["ALL", "CSE", "ECE", "AIDS", "CSY"],
    },
    work_experience_count: { type: Number, required: false, min: 0, default: 0 },
    max_backlogs: { type: Number, required: false, min: 0, default: 0 },
    eligible_batches: { type: [Number], required: false }, // Added batch eligibility
});

const experienceSchema = new mongoose.Schema({
    comment: { type: String, required: true },
    likes: { type: Number, default: 0 },
    studentName: { type: String, required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    timestamp: { type: Date, default: Date.now }
});

// Custom required details schema for additional fields beyond standard ones
const customRequiredDetailSchema = new mongoose.Schema({
    field_id: { type: String, required: true }, // unique identifier for the field
    field_name: { type: String, required: true }, // internal name (e.g., "video_resume_link")
    field_label: { type: String, required: true }, // display label (e.g., "Video Resume Link")
    field_type: { 
        type: String, 
        required: true,
        enum: ['text', 'url', 'textarea', 'select', 'number', 'date', 'file']
    },
    is_required: { type: Boolean, default: true },
    options: [String], // for select type fields
    placeholder: { type: String },
    validation_regex: { type: String }, // for custom validation
    max_length: { type: Number }, // for text/textarea fields
    help_text: { type: String } // additional guidance for students
});

// Custom questions schema for additional questions/sections
const customQuestionSchema = new mongoose.Schema({
    question_id: { type: String, required: true }, // unique identifier
    question_text: { type: String, required: true }, // the actual question
    question_type: { 
        type: String, 
        required: true,
        enum: ['text', 'textarea', 'select', 'radio', 'checkbox', 'number', 'date', 'file']
    },
    is_required: { type: Boolean, default: true },
    options: [String], // for select/radio/checkbox types
    placeholder: { type: String },
    max_length: { type: Number },
    help_text: { type: String },
    section_title: { type: String } // optional section grouping
});

// Schema for storing custom field responses in applications
const customFieldResponseSchema = new mongoose.Schema({
    field_id: { type: String, required: true },
    field_value: { type: mongoose.Schema.Types.Mixed } // can store string, number, array, etc.
});

// Schema for storing custom question responses in applications
const customQuestionResponseSchema = new mongoose.Schema({
    question_id: { type: String, required: true },
    answer: { type: mongoose.Schema.Types.Mixed } // can store string, number, array, etc.
});

// Round results schema for tracking student progress
const roundResultsSchema = new mongoose.Schema({
    round_number: { type: Number, required: true },
    round_name: { type: String, required: true },
    selected_students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
    rejected_students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
    waitlisted_students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
    offer_accepted_students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }], // Track offer acceptance
    offer_rejected_students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }], // Track offer rejection
    is_published: { type: Boolean, default: false },
    published_at: { type: Date },
    published_by: { type: mongoose.Schema.Types.ObjectId, ref: 'Coordinator' }
});

const drive = new mongoose.Schema({
    drive_name: { type: String, required: true },
    company_name: { type: String, required: true },
    company_logo: { type: String },
    about: { type: String },
    type_of_role: { type: String },
    location: { type: [String] },
    ctc: { type: String },
    stipend: { type: String },
    duration: { type: String },
    number_of_positions: { type: Number },
    deadline: { type: Date },
    drive_date: { type: Date },
    rounds: [
        {
            round_number: { type: Number },
            round_name: { type: String },
            description: { type: String },
        },
    ],
    criteria: {
        tenth_percentage: { type: Number },
        twelfth_percentage: { type: Number },
        graduation_degree: { type: String },
        graduation_year: { type: [Number] },
        cgpa: { type: Number },
        stream: { type: [String] },
        work_experience_count: { type: Number },
        max_backlogs: { type: Number },
        eligible_batches: { type: [Number] },
    },
    required_details: {
        type: [String],
        required: true,
        enum: [
            "name",
            "gender",
            "roll",
            "email",
            "personalEmail",
            "cgpa",
            "backlogs",
            "phone",
            "resume",
            "batch",
            "branch",
            "dob",
            "12th",
            "10th",
            "address",
            "skills",
            "work",
            "github",
            "linkedin",
            "location",
        ],
    },
    // Custom required details beyond standard ones
    custom_required_details: [customRequiredDetailSchema],
    // Custom questions for additional information gathering
    custom_questions: [customQuestionSchema],
    // New field to indicate if the drive is currently accepting applications
    isActive: { type: Boolean, default: true },
    // New field to indicate if the drive is accepting applications (separate from overall active status)
    acceptingApplications: { type: Boolean, default: true },
    // Enhanced applied_students field with more details
    applied_students: [{
        student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
        name: { type: String, required: true },
        email: { type: String, required: true },
        resumeLink: { type: String },
        phone: { type: String },
        applicationTimestamp: { type: Date, default: Date.now },
        current_status: { 
            type: String, 
            enum: [
                'Applied', 
                'Resume Shortlisted', 
                'Interview I Selected', 
                'Interview II Selected', 
                'Final Selected', 
                'Rejected',
                'Waitlisted - Round 1',
                'Waitlisted - Round 2', 
                'Waitlisted - Round 3'
            ], 
            default: 'Applied' 
        },
        rejected_at_round: { type: Number, default: null }, // Track which round student was rejected at
        last_status_update: { type: Date, default: Date.now },
        // Responses to custom required details
        custom_field_responses: [customFieldResponseSchema],
        // Responses to custom questions
        custom_question_responses: [customQuestionResponseSchema]
    }],
    // New field to store student experiences
    experiences: [experienceSchema],
    // Results tracking for each round
    round_results: [roundResultsSchema],
    // Track current active round for results
    current_result_round: { type: Number, default: 1 },
    // Track if results process has started
    results_started: { type: Boolean, default: false },
    // Track students who accepted offers (for placement tracking)
    placed_students: [{
        student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
        accepted_at: { type: Date, default: Date.now },
        offer_details: {
            ctc: { type: String },
            stipend: { type: String },
            role_type: { type: String, enum: ['Intern', 'Intern + PPO', 'Fulltime'] }
        }
    }],
    jd_files: [{
        filename: { type: String, required: true }, // Stored filename
        original_name: { type: String, required: true }, // Original filename from user
        upload_date: { type: Date, default: Date.now },
        file_size: { type: Number } // File size in bytes
    }],
    published_results: [{
        round_number: { type: Number, required: true },
        published_date: { type: Date, default: Date.now },
        student_results: [{
            student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'students', required: true },
            status: { type: String, enum: ['Selected', 'Rejected'], required: true }
        }]
    }]
});

// On Delete Cascade when a drive is deleted remove the drive reference from all students' applied_drives
drive.pre('remove', async function (next) {
    try {
        await mongoose.model('Student').updateMany(
            { 'applied_drives.drive_id': this._id },
            { $pull: { applied_drives: { drive_id: this._id } } }
        );
        next();
    } catch (error) {
        next(error);
    }
});

const Drive = mongoose.model("Drive", drive);

module.exports = Drive;