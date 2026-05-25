const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// ---------------- DB CONNECTION (SAFE FOR VERCEL) ----------------
let isConnected = false;

const dbConnect = async () => {
  if (isConnected) return;

  try {
    await connectDB();
    isConnected = true;
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("DB Connection Error:", err.message);
    throw err;
  }
};

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

// test route
app.post('/api/chat', (req, res) => {
  res.json({ reply: "InkFlow AI is ready!" });
});

// health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    time: new Date()
  });
});

// root
app.get('/', (req, res) => {
  res.send("InkFlow Backend Running 🚀");
});

// ---------------- ERROR HANDLING ----------------
app.use(notFound);
app.use(errorHandler);

// ---------------- EXPORT ----------------
module.exports = { app, dbConnect };
