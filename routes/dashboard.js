// routes/dashboard.js
const express = require('express');
const router = express.Router();
const Record = require('../models/Record');
const { auth, checkRole } = require('../middleware/auth');

// @route   GET api/dashboard
// @desc    Get summary analytics (Analyst and Admin)
router.get('/', auth, checkRole(['Analyst', 'Admin']), async (req, res) => {
    try {
        const records = await Record.find({ isDeleted: false }).sort({ date: -1 });

        let totalIncome = 0;
        let totalExpense = 0;
        let categoryTotals = {}; // Object to store category-wise totals

        records.forEach(record => {
            // Overall totals
            if (record.type === 'income') {
                totalIncome += record.amount;
            } else {
                totalExpense += record.amount;
            }

            // Category-wise totals logic
            if (!categoryTotals[record.category]) {
                categoryTotals[record.category] = 0;
            }
            categoryTotals[record.category] += record.amount;
        });

        const balance = totalIncome - totalExpense;

        // Recently activity: Top 5 most recent records
        const recentActivity = records.slice(0, 5);

        res.json({
            totalIncome,
            totalExpense,
            balance,
            categoryTotals,
            recentActivity
        });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
