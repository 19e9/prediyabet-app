const mongoose = require('mongoose');

const testRecordSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['pre', 'post'], required: true },
    answers: [{
        questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'SurveyQuestion' },
        questionText: String,
        selectedOption: String,
        score: Number,
    }],
    totalScore: { type: Number, required: true },
    date: { type: Date, default: Date.now },
}, { timestamps: true });

testRecordSchema.index({ userId: 1, type: 1, date: -1 });

module.exports = mongoose.model('TestRecord', testRecordSchema);
