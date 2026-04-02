// models/Record.js
const mongoose = require('mongoose');

// Define record schema
const recordSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    type: { 
        type: String, 
        enum: ['income', 'expense'], 
        required: true 
    },
    category: { type: String, required: true },
    description: { type: String },
    date: { type: Date, default: Date.now },
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    isDeleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('Record', recordSchema);
