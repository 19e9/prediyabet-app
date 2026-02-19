const express = require('express');
const TestRecord = require('../models/TestRecord');
const SurveyQuestion = require('../models/SurveyQuestion');
const { auth } = require('../middleware/auth');

const router = express.Router();

// GET /api/tests/questions/:type - Get test questions
router.get('/questions/:type', auth, async (req, res) => {
    try {
        const { type } = req.params;
        const questions = await SurveyQuestion.find({
            isActive: true,
            category: type === 'pre' ? 'pre_test' : 'post_test'
        }).sort({ order: 1 });
        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/tests - Submit test
router.post('/', auth, async (req, res) => {
    try {
        const { type, answers } = req.body;
        const totalScore = answers.reduce((sum, a) => sum + (a.score || 0), 0);

        const record = await TestRecord.create({
            userId: req.user._id,
            type,
            answers,
            totalScore,
        });
        res.status(201).json(record);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// GET /api/tests - Get test history
router.get('/', auth, async (req, res) => {
    try {
        const { type } = req.query;
        const filter = { userId: req.user._id };
        if (type) filter.type = type;

        const records = await TestRecord.find(filter).sort({ date: -1 });
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
