const mongoose = require('mongoose');


const coordCreds = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    lastLogin: { type: Date, required: true },
});


const coordinator = new mongoose.Schema({
    creds: { type: mongoose.Schema.Types.ObjectId, ref: 'CoordinatorCred', required: true }, 
    name: { type: String, required: true },
    email_id: { type: String, required: true, unique: true, match: /\S+@\S+\.\S+/ },
    // phone_no: { type: String, required: false, minlength: 10, maxlength: 15 },
    // company_name: { type: String, required: true },
    
});

const Coordinator = mongoose.model('Coordinator', coordinator);

module.exports = Coordinator;
