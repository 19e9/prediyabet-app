const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({ message: messages.join(', ') });
    }

    if (err.code === 11000) {
        return res.status(400).json({ message: 'Bu kayıt zaten mevcut' });
    }

    if (err.name === 'CastError') {
        return res.status(400).json({ message: 'Geçersiz ID formatı' });
    }

    res.status(err.statusCode || 500).json({
        message: err.message || 'Sunucu hatası'
    });
};

module.exports = errorHandler;
