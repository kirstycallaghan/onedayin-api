const express = require("express");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/generate-itinerary", async (req, res) => {
  const { city, date, tripType } = req.body;

  const prompt = `Plan a 1-day ${tripType} trip in ${city} on ${date}. Include breakfast, activities, lunch, dinner, and must-see attractions.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    const itinerary = response.choices[0].message.content;
    res.json({ itinerary });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate itinerary" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});