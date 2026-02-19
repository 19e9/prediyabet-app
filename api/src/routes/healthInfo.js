const express = require('express');
const HealthInfo = require('../models/HealthInfo');

const router = express.Router();

// GET /api/health-info - Get all health articles
router.get('/', async (req, res) => {
    try {
        const articles = await HealthInfo.find({ isActive: true }).sort({ order: 1 });
        res.json(articles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/health-info/:id
router.get('/:id', async (req, res) => {
    try {
        const article = await HealthInfo.findById(req.params.id);
        if (!article) {
            return res.status(404).json({ message: 'Makale bulunamadı' });
        }
        res.json(article);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
