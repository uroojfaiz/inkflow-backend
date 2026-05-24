const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose'); // Import mongoose
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Environment variables setup
dotenv.config();

// Database connection
connectDB();

// --- Mongoose Warning Fix ---
mongoose.set('strictQuery', false); 

const app = express();

// --- CORS Configuration ---
const corsOptions = {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
};

app.use(cors(corsOptions));

// --- Middlewares ---
app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// --- API Routes ---

// 1. Auth Routes
app.use('/api/auth', require('./routes/authRoutes'));

// 2. Blog Routes
app.use('/api/blogs', require('./routes/blogRoutes'));

// 3. Interaction Routes
app.use('/api/interactions', require('./routes/interactionRoutes'));

// 4. CHAT ROUTE (Yahan add kiya hai)
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        // Yahan aap apni AI logic ya static reply rakh sakte hain
        const reply = `InkFlow AI: " ${message} " ka jawab dena abhi baaki hai. Main seekh raha hoon!`;
        res.json({ reply });
    } catch (error) {
        res.status(500).json({ reply: "Error contacting AI server." });
    }
});

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
});

// --- Error Handling Middlewares ---
app.use(notFound);
app.use(errorHandler);

// --- Server Start ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is live on port ${PORT}`);
    console.log(`📡 Routes Loaded: Auth, Blogs, Interactions, Chat`);
});