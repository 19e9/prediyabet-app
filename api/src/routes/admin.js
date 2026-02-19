const express = require('express');
const User = require('../models/User');
const StepRecord = require('../models/StepRecord');
const BmiRecord = require('../models/BmiRecord');
const FoodEntry = require('../models/FoodEntry');
const FoodItem = require('../models/FoodItem');
const FindriskSurvey = require('../models/FindriskSurvey');
const TestRecord = require('../models/TestRecord');
const HealthInfo = require('../models/HealthInfo');
const Faq = require('../models/Faq');
const ContactInfo = require('../models/ContactInfo');
const AboutContent = require('../models/AboutContent');
const SurveyQuestion = require('../models/SurveyQuestion');
const { auth, adminGuard } = require('../middleware/auth');

const router = express.Router();

// All admin routes require auth + admin role
router.use(auth, adminGuard);

// ═══════════════════════════════════════
// DASHBOARD STATS
// ═══════════════════════════════════════
router.get('/stats', async (req, res) => {
    try {
        const [
            totalUsers, totalSteps, totalBmi, totalFood,
            totalSurveys, totalTests
        ] = await Promise.all([
            User.countDocuments(),
            StepRecord.countDocuments(),
            BmiRecord.countDocuments(),
            FoodEntry.countDocuments(),
            FindriskSurvey.countDocuments(),
            TestRecord.countDocuments(),
        ]);

        const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);

        res.json({
            totalUsers, totalSteps, totalBmi, totalFood,
            totalSurveys, totalTests, recentUsers,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ═══════════════════════════════════════
// USER MANAGEMENT
// ═══════════════════════════════════════
router.get('/users', async (req, res) => {
    try {
        const { search, page = 1, limit = 20 } = req.query;
        const filter = {};
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { surname: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }
        const users = await User.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));
        const total = await User.countDocuments(filter);
        res.json({ users, total, page: parseInt(page), pages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });

        const [steps, bmiRecords, foodEntries, surveys, tests] = await Promise.all([
            StepRecord.find({ userId: req.params.id }).sort({ date: -1 }).limit(30),
            BmiRecord.find({ userId: req.params.id }).sort({ date: -1 }),
            FoodEntry.find({ userId: req.params.id }).populate('items').sort({ date: -1 }).limit(30),
            FindriskSurvey.find({ userId: req.params.id }).sort({ date: -1 }),
            TestRecord.find({ userId: req.params.id }).sort({ date: -1 }),
        ]);

        res.json({ user, steps, bmiRecords, foodEntries, surveys, tests });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/users/:id', async (req, res) => {
    try {
        const { name, surname, email, phone, role } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { name, surname, email, phone, role },
            { new: true, runValidators: true }
        );
        if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
        // Clean up user data
        await Promise.all([
            StepRecord.deleteMany({ userId: req.params.id }),
            BmiRecord.deleteMany({ userId: req.params.id }),
            FoodEntry.deleteMany({ userId: req.params.id }),
            FindriskSurvey.deleteMany({ userId: req.params.id }),
            TestRecord.deleteMany({ userId: req.params.id }),
        ]);
        res.json({ message: 'Kullanıcı ve verileri silindi' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ═══════════════════════════════════════
// HEALTH INFO MANAGEMENT
// ═══════════════════════════════════════
router.get('/health-info', async (req, res) => {
    try {
        const articles = await HealthInfo.find().sort({ order: 1 });
        res.json(articles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/health-info', async (req, res) => {
    try {
        const article = await HealthInfo.create(req.body);
        res.status(201).json(article);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.put('/health-info/:id', async (req, res) => {
    try {
        const article = await HealthInfo.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!article) return res.status(404).json({ message: 'Makale bulunamadı' });
        res.json(article);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/health-info/:id', async (req, res) => {
    try {
        await HealthInfo.findByIdAndDelete(req.params.id);
        res.json({ message: 'Makale silindi' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ═══════════════════════════════════════
// FAQ MANAGEMENT
// ═══════════════════════════════════════
router.get('/faq', async (req, res) => {
    try {
        const faqs = await Faq.find().sort({ order: 1 });
        res.json(faqs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/faq', async (req, res) => {
    try {
        const faq = await Faq.create(req.body);
        res.status(201).json(faq);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.put('/faq/:id', async (req, res) => {
    try {
        const faq = await Faq.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!faq) return res.status(404).json({ message: 'SSS bulunamadı' });
        res.json(faq);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/faq/:id', async (req, res) => {
    try {
        await Faq.findByIdAndDelete(req.params.id);
        res.json({ message: 'SSS silindi' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ═══════════════════════════════════════
// FOOD ITEMS MANAGEMENT
// ═══════════════════════════════════════
router.get('/food-items', async (req, res) => {
    try {
        const items = await FoodItem.find().sort({ category: 1, name: 1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/food-items', async (req, res) => {
    try {
        const item = await FoodItem.create(req.body);
        res.status(201).json(item);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.put('/food-items/:id', async (req, res) => {
    try {
        const item = await FoodItem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!item) return res.status(404).json({ message: 'Besin bulunamadı' });
        res.json(item);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/food-items/:id', async (req, res) => {
    try {
        await FoodItem.findByIdAndDelete(req.params.id);
        res.json({ message: 'Besin silindi' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ═══════════════════════════════════════
// SURVEY QUESTIONS MANAGEMENT
// ═══════════════════════════════════════
router.get('/survey-questions', async (req, res) => {
    try {
        const { category } = req.query;
        const filter = {};
        if (category) filter.category = category;
        const questions = await SurveyQuestion.find(filter).sort({ category: 1, order: 1 });
        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/survey-questions', async (req, res) => {
    try {
        const question = await SurveyQuestion.create(req.body);
        res.status(201).json(question);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.put('/survey-questions/:id', async (req, res) => {
    try {
        const question = await SurveyQuestion.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!question) return res.status(404).json({ message: 'Soru bulunamadı' });
        res.json(question);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/survey-questions/:id', async (req, res) => {
    try {
        await SurveyQuestion.findByIdAndDelete(req.params.id);
        res.json({ message: 'Soru silindi' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ═══════════════════════════════════════
// CONTACT MANAGEMENT
// ═══════════════════════════════════════
router.put('/contact', async (req, res) => {
    try {
        let contact = await ContactInfo.findOne();
        if (contact) {
            Object.assign(contact, req.body);
            await contact.save();
        } else {
            contact = await ContactInfo.create(req.body);
        }
        res.json(contact);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// ═══════════════════════════════════════
// ABOUT MANAGEMENT
// ═══════════════════════════════════════
router.put('/about', async (req, res) => {
    try {
        let about = await AboutContent.findOne();
        if (about) {
            Object.assign(about, req.body);
            await about.save();
        } else {
            about = await AboutContent.create(req.body);
        }
        res.json(about);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
