 const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;

  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);

    // ❌ NEVER use process.exit in serverless
    throw new Error('Database connection failed');
  }
};

module.exports = connectDB;
