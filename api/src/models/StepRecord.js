const mongoose = require('mongoose');

const stepRecordSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    stepCount: { type: Number, required: true, default: 0 },
}, { timestamps: true });

stepRecordSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('StepRecord', stepRecordSchema);
