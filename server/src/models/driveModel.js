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
	// graduation_percentage: { type: Number, required: true, min: 0, max: 100 },
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
});

 

const drive = new mongoose.Schema({
  drive_name: { type: String, required: true },
  company_name: { type: String, required: true },
  company_logo: { type: String },
  about: { type: String },
  type_of_role: { type: String },
  location: { type: [String] },
  ctc: { type: String },
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
});

// module.exports = mongoose.model("Drive", driveSchema);

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
