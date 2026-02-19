const mongoose = require('mongoose');

const bmiRecordSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    weight: { type: Number, required: [true, 'Kilo gerekli'] },
    height: { type: Number, required: [true, 'Boy gerekli'] },
    bmiValue: { type: Number, required: true },
    date: { type: Date, default: Date.now },
}, { timestamps: true });

bmiRecordSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('BmiRecord', bmiRecordSchema);
