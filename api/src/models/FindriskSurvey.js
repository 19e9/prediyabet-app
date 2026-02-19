const mongoose = require('mongoose');

const findriskSurveySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    answers: [{
        questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'SurveyQuestion' },
        questionText: String,
        selectedOption: String,
        score: Number,
    }],
    totalScore: { type: Number, required: true },
    riskLevel: {
        type: String,
        enum: ['dusuk', 'hafif', 'orta', 'yuksek', 'cok_yuksek'],
        required: true
    },
    date: { type: Date, default: Date.now },
}, { timestamps: true });

findriskSurveySchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('FindriskSurvey', findriskSurveySchema);
