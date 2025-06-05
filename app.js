import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// ✅ CORS must go here before any route
app.use(cors({
  origin: "https://preview--onedayin.lovable.app"
}));

// ✅ Needed to parse JSON request bodies
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/generate-itinerary", async (req, res) => {
  const { city, date, tripType } = req.body;

  try {
    const prompt = `Generate a detailed one-day itinerary in ${city} for a ${tripType} trip on ${date}. Format it with headings for morning, afternoon, evening, and night.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const itinerary = response.choices[0].message.content;
    res.json({ itinerary });
  } catch (err) {
    console.error("❌ Failed to generate itinerary:", err);
    res.status(500).json({ error: "Failed to generate itinerary" });
  }
});

app.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
});
