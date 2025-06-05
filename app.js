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
const prompt = `
Generate a detailed one-day itinerary in ${city} for a ${tripType} trip on ${date}.
Use Markdown formatting:
- Make times and key venues **bold**
- Use headings for Morning, Afternoon, Evening, Night
- Use bullet points for activities within each section
- add line break between each section
- Link restaurants/venues so the user can click through a book a table
`;

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
