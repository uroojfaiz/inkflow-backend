const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();

// Database connection (Vercel pe connection ko handle karna zaroori hai)
connectDB();

mongoose.set('strictQuery', false); 

const app = express();

// --- CORS Configuration ---
const allowedOrigins = [
    'http://localhost:5173', 
    'https://inkflow-frontend.vercel.app'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// --- Routes ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/blogs', require('./routes/blogRoutes'));
app.use('/api/interactions', require('./routes/interactionRoutes'));

app.post('/api/chat', async (req, res) => {
    res.json({ reply: "InkFlow AI is ready!" });
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
});

// Root route for Vercel
app.get('/', (req, res) => {
    res.send("InkFlow Backend is running.");
});

app.use(notFound);
app.use(errorHandler);

// --- Vercel Export logic ---
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

module.exports = app;