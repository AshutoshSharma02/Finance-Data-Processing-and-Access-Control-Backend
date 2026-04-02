// routes/records.js
const express = require('express');
const router = express.Router();
const Record = require('../models/Record');
const { auth, checkRole } = require('../middleware/auth');

// @route   GET api/records
// @desc    Get all records (Supports pagination, search, date filtering)
router.get('/', auth, async (req, res) => {
    try {
        const { type, category, startDate, endDate, search, page = 1, limit = 10 } = req.query;
        let query = { isDeleted: false }; // Don't show soft-deleted records
        
        // Exact match filters
        if (type) query.type = type;
        if (category) query.category = category;

        // Date range filtering
        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        // Search in description
        if (search) {
            query.description = { $regex: search, $options: 'i' }; // Case-insensitive search
        }

        // Pagination calculations
        const skip = (page - 1) * limit;

        const records = await Record.find(query)
            .sort({ date: -1 })
            .skip(parseInt(skip))
            .limit(parseInt(limit));
            
        const total = await Record.countDocuments(query);

        res.json({
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            data: records
        });
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   POST api/records
// @desc    Create a record (Admin only, includes validation)
router.post('/', auth, checkRole(['Admin']), async (req, res) => {
    const { amount, type, category, description } = req.body;

    // Input Validation
    if (!amount || typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ msg: 'Please provide a valid positive amount' });
    }
    if (!type || !['income', 'expense'].includes(type)) {
        return res.status(400).json({ msg: 'Type must be either "income" or "expense"' });
    }
    if (!category) {
        return res.status(400).json({ msg: 'Category is required' });
    }

    try {
        const newRecord = new Record({
            amount, type, category, description, createdBy: req.user.id
        });

        const record = await newRecord.save();
        res.status(201).json(record);
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   PUT api/records/:id
// @desc    Update a record (Admin only)
router.put('/:id', auth, checkRole(['Admin']), async (req, res) => {
    try {
        let record = await Record.findById(req.params.id);
        if (!record || record.isDeleted) return res.status(404).json({ msg: 'Record not found' });

        record = await Record.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json(record);
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   DELETE api/records/:id
// @desc    Soft Delete a record (Admin only)
router.delete('/:id', auth, checkRole(['Admin']), async (req, res) => {
    try {
        let record = await Record.findById(req.params.id);
        if (!record || record.isDeleted) return res.status(404).json({ msg: 'Record not found' });

        // Soft delete: Update the flag instead of removing from DB
        record.isDeleted = true;
        await record.save();

        res.json({ msg: 'Record soft deleted successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
});

module.exports = router;
