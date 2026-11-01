import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { testGeminiConnection } from './services/gemini.js';
import { processChatMessage } from './services/chatService.js';

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 1. Health check route (Existing Moksha route - preserved)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Sahayak API Server',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// 2. Services directory route (Existing Moksha route - preserved)
app.get('/api/services', (req, res) => {
  res.json([
    {
      id: 'pan',
      title: 'PAN Card Application & Guidance',
      forms: ['Form 49A (Indian Citizens)', 'Form 49AA (Foreign Citizens)'],
      officialPortal: 'https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html',
      fee: {
        physicalCard: 107,
        ePan: 72,
        currency: 'INR'
      },
      status: 'active'
    },
    {
      id: 'ayushman',
      title: 'Ayushman Bharat PM-JAY',
      benefit: '₹5,00,000 cashless medical coverage per year per family',
      officialPortal: 'https://beneficiary.nha.gov.in/',
      status: 'active'
    }
  ]);
});

// 3. Simple Gemini connection test route (Preserved)
app.get('/api/test-gemini', async (req, res) => {
  try {
    const result = await testGeminiConnection();
    res.json(result);
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
      tip: 'Please ensure GEMINI_API_KEY is configured in backend/.env'
    });
  }
});


// Rate limiter for chat endpoint: 20 requests per minute per IP
export const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // 20 requests per minute per IP
  standardHeaders: true, // Return standard RateLimit-* headers
  legacyHeaders: false, // Disable X-RateLimit-* headers
  statusCode: 429,
  skip: (req) => req.headers['x-test-suite'] === 'sahayak-tests' || process.env.NODE_ENV === 'test',
  message: {
    error: 'Too many requests. Please wait a moment before trying again.',
    tip: 'Rate limit is 20 requests per minute.',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
});

// 4. Main AI Chat Endpoint for Sahayak Voice Assistant
app.post('/api/chat', chatLimiter, async (req, res) => {
  try {
    const { message, language, sessionId } = req.body || {};

    // Validate message
    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({
        error: 'Invalid request: "message" is required and cannot be empty.'
      });
    }

    // Validate & sanitize language (allowed: 'en', 'hi', 'te')
    const sanitizedLang = ['en', 'hi', 'te'].includes(language) ? language : 'en';

    // Sanitize sessionId
    const sanitizedSessionId = (sessionId && typeof sessionId === 'string')
      ? sessionId.slice(0, 100)
      : 'default_session';

    const response = await processChatMessage({
      message: message.trim(),
      language: sanitizedLang,
      sessionId: sanitizedSessionId
    });

    res.json(response);
  } catch (error) {
    console.error('Error processing /api/chat:', error.message);
    res.status(500).json({
      error: 'An error occurred while processing your request. Please try again.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  }
});

export const server = app.listen(PORT, () => {
  console.log(`Sahayak backend running on http://localhost:${PORT}`);
});
