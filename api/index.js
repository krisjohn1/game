require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const gameRoutes = require('./routes/game');

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/game', gameRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok', type: 'vercel-serverless' }));

// For local testing (Vercel will export the app instead of listening on a port)
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3030;
    app.listen(PORT, () => {
        console.log(`Serverless Backend running locally on http://localhost:${PORT}`);
    });
}

// Export for Vercel
module.exports = app;
