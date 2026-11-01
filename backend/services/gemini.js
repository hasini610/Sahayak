import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

// Currently supported production Gemini model
export const GEMINI_MODEL = 'gemini-3.5-flash-lite';

let aiInstance = null;

/**
 * Initializes and returns the GoogleGenAI instance safely.
 * Throws a descriptive error if GEMINI_API_KEY is not configured.
 */
export function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
    throw new Error('GEMINI_API_KEY is missing or invalid. Please add your Gemini API key to backend/.env');
  }

  if (!aiInstance) {
    aiInstance = new GoogleGenAI({ apiKey });
  }

  return aiInstance;
}

/**
 * Simple test function to verify connectivity with the Gemini API.
 * Sends a multilingual test prompt and returns the generated text.
 */
export async function testGeminiConnection(prompt = 'Respond with: "Sahayak Gemini backend is connected successfully!" followed by a short friendly greeting in Hindi and Telugu.') {
  const ai = getGeminiClient();

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
  });

  return {
    success: true,
    model: GEMINI_MODEL,
    prompt,
    reply: response.text,
    timestamp: new Date().toISOString(),
  };
}

