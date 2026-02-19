const express = require('express');
const FindriskSurvey = require('../models/FindriskSurvey');
const SurveyQuestion = require('../models/SurveyQuestion');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Helper to calculate risk level
const getRiskLevel = (score) => {
    if (score < 7) return 'dusuk';
    if (score < 12) return 'hafif';
    if (score < 15) return 'orta';
    if (score < 21) return 'yuksek';
    return 'cok_yuksek';
};

// GET /api/findrisk/questions - Get survey questions
router.get('/questions', auth, async (req, res) => {
    try {
        const questions = await SurveyQuestion.find({
            isActive: true,
            category: 'findrisk'
        }).sort({ order: 1 });
        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/findrisk - Submit survey
router.post('/', auth, async (req, res) => {
    try {
        const { answers } = req.body;
        const totalScore = answers.reduce((sum, a) => sum + (a.score || 0), 0);
        const riskLevel = getRiskLevel(totalScore);

        const survey = await FindriskSurvey.create({
            userId: req.user._id,
            answers,
            totalScore,
            riskLevel,
        });
        res.status(201).json(survey);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// GET /api/findrisk/history - Get survey history
router.get('/history', auth, async (req, res) => {
    try {
        const surveys = await FindriskSurvey.find({ userId: req.user._id })
            .sort({ date: -1 });
        res.json(surveys);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
