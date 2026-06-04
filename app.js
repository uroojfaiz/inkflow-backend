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
// Allowed origins list
const allowedOrigins = [
  'http://localhost:5173',
  'https://inkflow-frontend.vercel.app',
  'https://inkflow-frontend-2gxb.vercel.app' // Aapka naya deployed frontend URL yahan add kar diya hai
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
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
