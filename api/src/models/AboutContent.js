const mongoose = require('mongoose');

const aboutContentSchema = new mongoose.Schema({
    content: { type: String, required: [true, 'İçerik gerekli'] },
    images: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('AboutContent', aboutContentSchema);
