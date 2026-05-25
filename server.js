const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();

const app = express();

// ---------------- DB CONNECTION (SAFE FOR VERCEL) ----------------
let isConnected = false;

const dbConnect = async () => {
    if (isConnected) return;

    try {
        await connectDB();
        isConnected = true;
        console.log("MongoDB connected");
    } catch (err) {
        console.error("DB Connection Failed:", err.message);
    }
};

// ---------------- CORS ----------------
const allowedOrigins = [
    'http://localhost:5173',
    'https://inkflow-frontend.vercel.app',
    'https://inkflow-frontend-2gxb.vercel.app'
];

app.use(cors({
    origin: function (origin, callback) {

        // allow requests with no origin
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// ---------------- MIDDLEWARE ----------------
app.use(helmet());

app.use(express.json({
    limit: '10mb'
}));

app.use(express.urlencoded({
    extended: true
}));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// ---------------- ROUTES ----------------
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/blogs', require('./routes/blogRoutes'));
app.use('/api/interactions', require('./routes/interactionRoutes'));

// ---------------- TEST ROUTES ----------------
app.post('/api/chat', async (req, res) => {
    res.json({
        reply: "InkFlow AI is ready!"
    });
});

app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date()
    });
});

app.get('/', (req, res) => {
    res.send("InkFlow Backend is running.");
});

// ---------------- ERROR HANDLING ----------------
app.use(notFound);
app.use(errorHandler);

// ---------------- VERCEL SERVERLESS EXPORT ----------------
module.exports = async (req, res) => {
    await dbConnect();
    return app(req, res);
};
