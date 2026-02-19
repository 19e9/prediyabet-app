const express = require('express');
const FoodEntry = require('../models/FoodEntry');
const FoodItem = require('../models/FoodItem');
const { auth } = require('../middleware/auth');

const router = express.Router();

// GET /api/food/items - Get food database
router.get('/items', auth, async (req, res) => {
    try {
        const { category } = req.query;
        const filter = { isActive: true };
        if (category) filter.category = category;
        const items = await FoodItem.find(filter).sort({ category: 1, name: 1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/food - Log food entry
router.post('/', auth, async (req, res) => {
    try {
        const { items, customItems, notes, date } = req.body;
        const entry = await FoodEntry.create({
            userId: req.user._id,
            items,
            customItems,
            notes,
            date: date || new Date(),
        });
        res.status(201).json(entry);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// GET /api/food - Get food history
router.get('/', auth, async (req, res) => {
    try {
        const entries = await FoodEntry.find({ userId: req.user._id })
            .populate('items')
            .sort({ date: -1 })
            .limit(30);
        res.json(entries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
