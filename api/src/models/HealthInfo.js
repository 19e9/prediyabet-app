const mongoose = require('mongoose');

const healthInfoSchema = new mongoose.Schema({
    title: { type: String, required: [true, 'Başlık gerekli'] },
    content: { type: String, required: [true, 'İçerik gerekli'] },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('HealthInfo', healthInfoSchema);
