const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const stepRoutes = require('./routes/steps');
const bmiRoutes = require('./routes/bmi');
const foodRoutes = require('./routes/food');
const findriskRoutes = require('./routes/findrisk');
const testRoutes = require('./routes/tests');
const healthInfoRoutes = require('./routes/healthInfo');
const faqRoutes = require('./routes/faq');
const contactRoutes = require('./routes/contact');
const aboutRoutes = require('./routes/about');
const adminRoutes = require('./routes/admin');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'PREDIABET API çalışıyor' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/steps', stepRoutes);
app.use('/api/bmi', bmiRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/findrisk', findriskRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/health-info', healthInfoRoutes);
app.use('/api/faq', faqRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/admin', adminRoutes);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 PREDIABET API sunucusu ${PORT} portunda çalışıyor`);
});
