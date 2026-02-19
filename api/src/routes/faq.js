const express = require('express');
const Faq = require('../models/Faq');

const router = express.Router();

// GET /api/faq
router.get('/', async (req, res) => {
    try {
        const faqs = await Faq.find({ isActive: true }).sort({ order: 1 });
        res.json(faqs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
