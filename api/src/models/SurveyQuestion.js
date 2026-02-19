const mongoose = require('mongoose');

const surveyQuestionSchema = new mongoose.Schema({
    questionText: { type: String, required: true },
    category: { type: String, required: true },
    options: [{
        text: { type: String, required: true },
        score: { type: Number, required: true },
    }],
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('SurveyQuestion', surveyQuestionSchema);
