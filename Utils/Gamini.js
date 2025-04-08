import { GoogleGenerativeAI } from "@google/generative-ai";

// Ensure your API key is defined
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("Missing Gemini API Key");
}

const genAI = new GoogleGenerativeAI(apiKey);

// Use the correct model name
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro", // or "gemini-pro" for older version
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// Export a session that can be reused
export const chatSession = model.startChat({
  generationConfig,
});