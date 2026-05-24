const { OpenAI } = require('openai'); // Agar OpenAI use kar rahe hain
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;
    
    // AI call
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: message }],
      model: "gpt-3.5-turbo",
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ message: "AI Error: " + err.message });
  }
};