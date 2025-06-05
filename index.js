import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // ✅ Enable CORS
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post("/generate-itinerary", async (req, res) => {
  const { city, date, tripType } = req.body;

  try {
    const prompt = `Generate a detailed one-day itinerary in ${city} for a ${tripType} trip on ${date}. Format it with headings for morning, afternoon, evening, and night.`;

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const itinerary = response.data.choices[0].message.content;
    res.json({ itinerary });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to generate itinerary" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
