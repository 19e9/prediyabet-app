const express = require('express');
const BmiRecord = require('../models/BmiRecord');
const { auth } = require('../middleware/auth');

const router = express.Router();

// POST /api/bmi - Calculate and save BMI
router.post('/', auth, async (req, res) => {
    try {
        const { weight, height } = req.body;
        const heightInMeters = height / 100;
        const bmiValue = parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(2));

        const record = await BmiRecord.create({
            userId: req.user._id,
            weight,
            height,
            bmiValue,
        });
        res.status(201).json(record);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// GET /api/bmi - Get BMI history
router.get('/', auth, async (req, res) => {
    try {
        const records = await BmiRecord.find({ userId: req.user._id })
            .sort({ date: -1 });
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE /api/bmi/:id
router.delete('/:id', auth, async (req, res) => {
    try {
        const record = await BmiRecord.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id,
        });
        if (!record) {
            return res.status(404).json({ message: 'Kayıt bulunamadı' });
        }
        res.json({ message: 'Kayıt silindi' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
