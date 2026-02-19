const mongoose = require('mongoose');

const foodEntrySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem' }],
    customItems: [{ name: String, category: String }],
    date: { type: Date, default: Date.now },
    notes: { type: String, default: '' },
}, { timestamps: true });

foodEntrySchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('FoodEntry', foodEntrySchema);
