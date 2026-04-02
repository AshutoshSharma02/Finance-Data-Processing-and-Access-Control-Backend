// models/User.js
const mongoose = require('mongoose');

// Define user schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['Viewer', 'Analyst', 'Admin'], 
        default: 'Viewer' 
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }
});

module.exports = mongoose.model('User', userSchema);
