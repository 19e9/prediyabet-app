const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'Besin adı gerekli'] },
    category: {
        type: String,
        required: true,
        enum: ['unlu_mamuller', 'sebze', 'meyve', 'et', 'sut_urunleri', 'balik', 'icecek', 'tatli', 'yag', 'diger']
    },
    description: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('FoodItem', foodItemSchema);
