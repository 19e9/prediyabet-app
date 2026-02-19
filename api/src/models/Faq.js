const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
    question: { type: String, required: [true, 'Soru gerekli'] },
    answer: { type: String, required: [true, 'Cevap gerekli'] },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Faq', faqSchema);
