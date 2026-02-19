const express = require('express');
const ContactInfo = require('../models/ContactInfo');

const router = express.Router();

// GET /api/contact
router.get('/', async (req, res) => {
    try {
        let contact = await ContactInfo.findOne();
        if (!contact) {
            contact = await ContactInfo.create({
                phone: '0545 664 76 62',
                email: 'ibrahim.topuz@ksbu.edu.tr',
                website: 'www.prediabet-tr.com',
                whatsapp: '+905456647662',
            });
        }
        res.json(contact);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
