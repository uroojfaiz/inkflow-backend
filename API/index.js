const { app, dbConnect } = require('../app');

module.exports = async (req, res) => {
  try {
    // DB connect only when request comes (Vercel safe)
    await dbConnect();

    // Pass request to Express app
    return app(req, res);

  } catch (error) {
    console.error("Serverless Function Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};
