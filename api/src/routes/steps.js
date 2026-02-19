const express = require('express');
const StepRecord = require('../models/StepRecord');
const { auth } = require('../middleware/auth');

const router = express.Router();

// POST /api/steps - Log steps
router.post('/', auth, async (req, res) => {
    try {
        const { date, stepCount } = req.body;
        const record = await StepRecord.findOneAndUpdate(
            { userId: req.user._id, date: new Date(date).toISOString().split('T')[0] },
            { stepCount },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        res.status(201).json(record);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// GET /api/steps - Get step history
router.get('/', auth, async (req, res) => {
    try {
        const records = await StepRecord.find({ userId: req.user._id })
            .sort({ date: -1 })
            .limit(50);
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/steps/weekly - Weekly step report
router.get('/weekly', auth, async (req, res) => {
    try {
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        const records = await StepRecord.find({
            userId: req.user._id,
            date: { $gte: weekAgo, $lte: now }
        }).sort({ date: 1 });

        const totalSteps = records.reduce((sum, r) => sum + r.stepCount, 0);
        const avgSteps = records.length > 0 ? Math.round(totalSteps / records.length) : 0;

        res.json({ records, totalSteps, avgSteps, days: records.length });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
