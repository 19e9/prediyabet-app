const express = require('express');
const AboutContent = require('../models/AboutContent');

const router = express.Router();

// GET /api/about
router.get('/', async (req, res) => {
    try {
        let about = await AboutContent.findOne();
        if (!about) {
            about = await AboutContent.create({
                content: 'PREDIABE-TR mobil uygulamasının geliştirilmesi ve kullanılabilirliğinin değerlendirilmesidir. Bu mobil uygulama prediyabetli bireylere sağlıkla ilgili konularda bilgi sunmak ve bireylerde sağlıklı yaşam biçimi davranışları oluşmasının sağlanmasını içermektedir.',
                images: [],
            });
        }
        res.json(about);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
