const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// ---------------- DB CONNECTION ----------------
connectDB();

// ---------------- MIDDLEWARE ----------------
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://inkflow-frontend.vercel.app'
  ],
  credentials: true
}));

app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// ---------------- ROUTES ----------------
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/blogs', require('./routes/blogRoutes'));
app.use('/api/interactions', require('./routes/interactionRoutes'));

app.post('/api/chat', (req, res) => {
  res.json({ reply: "InkFlow AI is ready!" });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    time: new Date()
  });
});

app.get('/', (req, res) => {
  res.send("InkFlow Backend Running 🚀");
});

// ---------------- ERROR HANDLING ----------------
app.use(notFound);
app.use(errorHandler);

// ---------------- EXPORT ----------------
module.exports = app;
