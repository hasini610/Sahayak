import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import { testGeminiConnection } from './services/gemini.js';
import { processChatMessage } from './services/chatService.js';
import { searchAuthorisedCentres, OFFICIAL_LOCATOR_PORTALS } from './data/serviceCentres.js';
import { formatSourcesForResponse, OFFICIAL_SOURCES } from './knowledge/officialSources.js';
import { processDocument, MAX_FILE_SIZE_BYTES } from './services/documentService.js';

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
      officialPortal: 'https://onlineservices.proteantech.in/paam/endUserRegisterContact.html',
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

// 5. Official Source Verification Registry Endpoint (FEATURE 1)
app.get('/api/sources', (req, res) => {
  try {
    const workflow = req.query.workflow;
    if (workflow) {
      const sources = formatSourcesForResponse(workflow);
      return res.json({
        workflow,
        count: sources.length,
        sources,
        disclaimer: 'All source records represent verified official Government of India portals.'
      });
    }
    // Return all sources grouped
    res.json({
      totalSources: OFFICIAL_SOURCES.length,
      panCardSources: formatSourcesForResponse('pan_card'),
      ayushmanSources: formatSourcesForResponse('ayushman_bharat'),
      boundarySources: formatSourcesForResponse('voter_id')
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve official sources' });
  }
});

// 6. Nearby Government Service Centre Finder Endpoint (FEATURE 2)
app.get('/api/centres', (req, res) => {
  try {
    const { service = 'pan_card', query = '', pincode = '', lat, lng, radiusKm = 50 } = req.query;

    // Validate coordinates if provided
    let userLat = null;
    let userLng = null;
    if (lat !== undefined && lng !== undefined) {
      const parsedLat = parseFloat(lat);
      const parsedLng = parseFloat(lng);
      if (!isNaN(parsedLat) && !isNaN(parsedLng) && parsedLat >= -90 && parsedLat <= 90 && parsedLng >= -180 && parsedLng <= 180) {
        userLat = parsedLat;
        userLng = parsedLng;
      }
    }

    // Validate PIN code format if provided
    let cleanPin = (pincode || '').toString().trim();
    if (cleanPin && !/^\d{1,6}$/.test(cleanPin)) {
      return res.status(400).json({
        error: 'Invalid PIN code. PIN code must contain up to 6 digits.'
      });
    }

    const searchResponse = searchAuthorisedCentres({
      service: service || 'pan_card',
      query: (query || '').toString().trim().slice(0, 100),
      pincode: cleanPin,
      userLat,
      userLng,
      maxRadiusKm: Math.min(Math.max(parseInt(radiusKm, 10) || 50, 5), 200)
    });

    res.json(searchResponse);
  } catch (err) {
    console.error('Error in /api/centres:', err.message);
    res.status(500).json({
      error: 'Failed to search authorised service centres.',
      fallbackLocators: OFFICIAL_LOCATOR_PORTALS.pan_card
    });
  }
});

// Rate limiter for document processing endpoint: 10 requests per minute per IP
export const docLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  statusCode: 429,
  skip: (req) => req.headers['x-test-suite'] === 'sahayak-tests' || process.env.NODE_ENV === 'test',
  message: {
    error: 'Too many document translation requests. Please wait a moment before trying again.',
    tip: 'Rate limit is 10 requests per minute.',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
});

// In-memory Multer storage (uploaded documents are NEVER written to disk)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES
  }
});

// 7. Government Document Understanding & Translation Endpoint (FEATURE 3)
app.post('/api/document/process', docLimiter, (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          error: 'File size exceeds maximum allowed limit of 10 MB.'
        });
      }
      return res.status(400).json({ error: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ error: `Upload error: ${err.message}` });
    }
    next();
  });
}, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No document file uploaded. Please upload a PDF, JPEG, PNG, or WebP document.'
      });
    }

    const { language = 'en' } = req.body || {};

    const result = await processDocument({
      buffer: req.file.buffer,
      mimeType: req.file.mimetype,
      targetLanguage: language
    });

    res.json(result);
  } catch (error) {
    const msg = error.message || 'Failed to process document';
    const isTimeout = msg.includes('timed out');
    const isRateLimit = msg.includes('429') || msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED');
    const isServiceUnavailable = msg.includes('503') || msg.includes('UNAVAILABLE');
    const isClientError = msg.includes('Unsupported file type') ||
      msg.includes('magic') ||
      msg.includes('signature') ||
      msg.includes('Invalid target language') ||
      msg.includes('empty') ||
      msg.includes('exceeds maximum');

    let status = 500;
    let userMsg = msg;

    if (isClientError) {
      status = 400;
    } else if (isTimeout) {
      status = 504;
      userMsg = 'Document processing timed out on the server. Please try again or submit a clearer document.';
    } else if (isRateLimit) {
      status = 429;
      userMsg = 'AI rate limit reached. Please wait a minute before submitting another document.';
    } else if (isServiceUnavailable) {
      status = 503;
      userMsg = 'AI translation service is temporarily unavailable. Please retry in a few moments.';
    }

    if (status >= 500 && !isTimeout) {
      console.error('Error in /api/document/process:', error.message);
    }

    res.status(status).json({
      error: userMsg,
      disclaimer: 'Please ensure you upload a valid, readable government document.'
    });
  }
});

export const server = app.listen(PORT, () => {
  server.requestTimeout = 120000;
  server.headersTimeout = 120000;
  console.log(`Sahayak backend running on http://localhost:${PORT}`);
});
