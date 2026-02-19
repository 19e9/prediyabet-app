const express = require('express');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// GET /api/users/profile
router.get('/profile', auth, async (req, res) => {
    try {
        res.json(req.user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/users/profile
router.put('/profile', auth, async (req, res) => {
    try {
        const { name, surname, phone, password } = req.body;
        const user = await User.findById(req.user._id).select('+password');

        if (name) user.name = name;
        if (surname) user.surname = surname;
        if (phone) user.phone = phone;
        if (password) user.password = password;

        await user.save();

        const updatedUser = await User.findById(user._id);
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
