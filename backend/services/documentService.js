import { getGeminiClient, GEMINI_MODEL } from './gemini.js';

// Maximum allowed file size: 10 MiB
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

// Permitted MIME types
export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];

// Target language map
export const TARGET_LANGUAGE_NAMES = {
  en: 'English',
  hi: 'Hindi',
  te: 'Telugu'
};

/**
 * Validates file magic bytes to ensure content genuine matches declared MIME type.
 * Protects against spoofed file extensions.
 */
export function validateFileMagicBytes(buffer, mimeType) {
  if (!buffer || buffer.length < 12) {
    return { valid: false, error: 'File is empty or too small to be a valid document.' };
  }

  const magic = buffer.subarray(0, 12);

  // PDF check: starts with %PDF- (0x25 0x50 0x44 0x46 0x2D)
  if (mimeType === 'application/pdf') {
    const isPdf = magic[0] === 0x25 && magic[1] === 0x50 && magic[2] === 0x44 && magic[3] === 0x46;
    if (!isPdf) return { valid: false, error: 'File content does not match a valid PDF signature.' };
    return { valid: true };
  }

  // JPEG check: starts with 0xFF 0xD8 0xFF
  if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') {
    const isJpeg = magic[0] === 0xff && magic[1] === 0xd8 && magic[2] === 0xff;
    if (!isJpeg) return { valid: false, error: 'File content does not match a valid JPEG image signature.' };
    return { valid: true };
  }

  // PNG check: starts with 0x89 0x50 0x4E 0x47 0x0D 0x0A 0x1A 0x0A
  if (mimeType === 'image/png') {
    const isPng = magic[0] === 0x89 && magic[1] === 0x50 && magic[2] === 0x4e && magic[3] === 0x47;
    if (!isPng) return { valid: false, error: 'File content does not match a valid PNG image signature.' };
    return { valid: true };
  }

  // WebP check: RIFF....WEBP (0x52 0x49 0x46 0x46 ... 0x57 0x45 0x42 0x50)
  if (mimeType === 'image/webp') {
    const isRiff = magic[0] === 0x52 && magic[1] === 0x49 && magic[2] === 0x46 && magic[3] === 0x46;
    const isWebp = magic[8] === 0x57 && magic[9] === 0x45 && magic[10] === 0x42 && magic[11] === 0x50;
    if (!isRiff || !isWebp) return { valid: false, error: 'File content does not match a valid WebP image signature.' };
    return { valid: true };
  }

  return { valid: false, error: `Unsupported MIME type: ${mimeType}` };
}

/**
 * Timeout wrapper for model processing promises.
 * Set to 85,000ms (85 seconds) to accommodate Indic languages (e.g. Telugu)
 * and large PDF/image documents without premature termination.
 */
function callWithTimeout(promise, timeoutMs = 85000) {
  let timer;
  const timeoutPromise = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`Document processing timed out after ${timeoutMs}ms.`)), timeoutMs);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timer));
}

/**
 * Cleanly extracts and parses JSON from Gemini's text response.
 */
function parseGeminiJson(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    throw new Error('Empty response received from Gemini.');
  }

  let cleaned = rawText.trim();

  // Strip markdown code fences if wrapped in ```json ... ```
  if (cleaned.startsWith('```')) {
    const firstNewline = cleaned.indexOf('\n');
    const lastFence = cleaned.lastIndexOf('```');
    if (firstNewline !== -1 && lastFence > firstNewline) {
      cleaned = cleaned.slice(firstNewline + 1, lastFence).trim();
    }
  }

  // If still not clean JSON, find outermost { and }
  const startIdx = cleaned.indexOf('{');
  const endIdx = cleaned.lastIndexOf('}');
  if (startIdx !== -1 && endIdx > startIdx) {
    cleaned = cleaned.slice(startIdx, endIdx + 1);
  }

  return JSON.parse(cleaned);
}

/**
 * Processes an uploaded document (PDF or Image) in-memory using Gemini.
 * Extracts original text, detects source language, translates into targetLanguage,
 * generates a simplified explanation, and structures key information.
 *
 * @param {Object} params
 * @param {Buffer} params.buffer - In-memory file buffer (never written to disk)
 * @param {string} params.mimeType - File MIME type
 * @param {string} params.targetLanguage - 'en' | 'hi' | 'te'
 * @returns {Promise<Object>} Structured translation response
 */
export async function processDocument({ buffer, mimeType, targetLanguage = 'en' }) {
  // 1. Validate target language
  const normalizedLang = (targetLanguage || 'en').toLowerCase().trim();
  const targetLanguageName = TARGET_LANGUAGE_NAMES[normalizedLang];
  if (!targetLanguageName) {
    throw new Error(`Invalid target language "${targetLanguage}". Supported languages are: en (English), hi (Hindi), te (Telugu).`);
  }

  // 2. Validate MIME type
  const normalizedMime = (mimeType || '').toLowerCase().trim();
  if (!ALLOWED_MIME_TYPES.includes(normalizedMime)) {
    throw new Error(`Unsupported file type: ${mimeType}. Permitted formats are PDF, JPEG, PNG, and WebP.`);
  }

  // 3. Validate file size
  if (!buffer || buffer.length === 0) {
    throw new Error('Uploaded file is empty.');
  }
  if (buffer.length > MAX_FILE_SIZE_BYTES) {
    throw new Error(`File size (${(buffer.length / (1024 * 1024)).toFixed(2)} MB) exceeds maximum allowed limit of 10 MB.`);
  }

  // 4. Validate magic bytes
  const magicValidation = validateFileMagicBytes(buffer, normalizedMime);
  if (!magicValidation.valid) {
    throw new Error(magicValidation.error);
  }

  // 5. Initialize Gemini Client
  const ai = getGeminiClient();

  // 6. Construct prompt
  const systemPrompt = `You are Sahayak's Official Government Document Understanding & Translation Engine for Indian public services.
Analyze the attached document carefully and provide a complete, accurate, factual extraction and translation.

Target Translation Language: ${targetLanguageName} (${normalizedLang})

Follow these strict rules:
1. "original": Transcribe all visible text from the document faithfully and verbatim. If parts are handwritten, stamped, or blurred, transcribe as accurately as possible.
2. "detectedLanguage": Identify the primary language(s) of the original document (e.g. English, Hindi, Telugu, Marathi, Tamil, etc.).
3. "translation": Translate the full extracted text into ${targetLanguageName}. Preserve official reference numbers, names of people/officials, monetary amounts (₹), dates, statutory acts/sections, and application IDs exactly without modification. Never invent or hallucinate missing data.
4. "explanation": Write a clear, concise, jargon-free explanation in ${targetLanguageName} (in 2 to 4 concise bullet points or short paragraphs) explaining:
   - What this document is (e.g., PAN acknowledgement, Ayushman card, Ration card, birth certificate, tax notice).
   - Who issued it and for whom.
   - What the citizen needs to know or do next (immediate action items, submission requirements, or deadlines).
5. "keyInfo": Extract specific key details into structured arrays (in ${targetLanguageName}):
   - "deadlines": Array of strings representing submission deadlines, renewal dates, or expiry periods explicitly mentioned in the document. (Empty array [] if none found).
   - "eligibility": Array of strings representing eligibility conditions explicitly stated. (Empty array [] if none).
   - "requiredDocs": Array of strings representing supporting documents explicitly requested or required. (Empty array [] if none).
   - "fees": Array of strings representing fees, costs, stamp duties, or penalties explicitly stated. (Empty array [] if none).
   - "warnings": Array of strings representing legal cautions, conditions of invalidation, or penalties explicitly mentioned in the document itself. (Empty array [] if none).
   - "contacts": Array of strings representing helplines, official emails, portals, or office addresses explicitly mentioned. (Empty array [] if none).

CRITICAL EXTRACTION RULES:
- ONLY extract information that is explicitly stated in the document.
- NEVER invent, hallucinate, or extrapolate unmentioned government dates, fees, or requirements.
- The "warnings" field in "keyInfo" must contain ONLY legal cautions, penalties, or invalidation conditions explicitly written in the uploaded government document. NEVER include developer tips, generic API warnings (e.g. "Never commit API keys"), or general system advice. If no cautions or penalties are in the document, return an empty array [].
6. "warnings": Array of strings noting any physical legibility issues (e.g., "Page 2 is low-contrast", "Handwritten signature partially unreadable", "Document appears incomplete"). If clean and legible, provide an empty array [].

OUTPUT FORMAT: Return ONLY a valid JSON object with EXACTLY this structure (no markdown fences, no explanatory text outside the JSON):
{
  "original": "...",
  "detectedLanguage": "...",
  "translation": "...",
  "explanation": "...",
  "keyInfo": {
    "deadlines": [],
    "eligibility": [],
    "requiredDocs": [],
    "fees": [],
    "warnings": [],
    "contacts": []
  },
  "warnings": []
}`;

  const base64Data = buffer.toString('base64');

  const modelPromise = ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: [
      {
        inlineData: {
          mimeType: normalizedMime,
          data: base64Data
        }
      },
      {
        text: systemPrompt
      }
    ]
  });

  const response = await callWithTimeout(modelPromise, 85000);
  const rawText = response.text || '';

  // Parse structured JSON
  let parsed;
  try {
    parsed = parseGeminiJson(rawText);
  } catch (parseErr) {
    // If model didn't return perfect JSON, construct safe fallback structure from response text
    parsed = {
      original: 'Text extracted from document.',
      detectedLanguage: 'Unknown',
      translation: rawText,
      explanation: 'Please review the translated text above.',
      keyInfo: {
        deadlines: [],
        eligibility: [],
        requiredDocs: [],
        fees: [],
        warnings: [],
        contacts: []
      },
      warnings: ['Automated JSON parsing could not separate all sections cleanly; full translation provided.']
    };
  }

  // Helper to filter out any accidental generic system/developer warnings
  const isGenericOrDevWarning = (text) => {
    if (!text || typeof text !== 'string') return true;
    const lower = text.toLowerCase();
    return (
      lower.includes('api key') ||
      lower.includes('never commit') ||
      lower.includes('developer') ||
      lower.includes('environment variable') ||
      lower.includes('system prompt') ||
      lower.includes('json parsing')
    );
  };

  // Ensure all keyInfo properties exist and are sanitized arrays
  const keyInfo = parsed.keyInfo || {};
  const sanitizedKeyInfo = {
    deadlines: Array.isArray(keyInfo.deadlines)
      ? keyInfo.deadlines.filter((item) => typeof item === 'string' && item.trim().length > 0)
      : [],
    eligibility: Array.isArray(keyInfo.eligibility)
      ? keyInfo.eligibility.filter((item) => typeof item === 'string' && item.trim().length > 0)
      : [],
    requiredDocs: Array.isArray(keyInfo.requiredDocs)
      ? keyInfo.requiredDocs.filter((item) => typeof item === 'string' && item.trim().length > 0)
      : [],
    fees: Array.isArray(keyInfo.fees)
      ? keyInfo.fees.filter((item) => typeof item === 'string' && item.trim().length > 0)
      : [],
    warnings: Array.isArray(keyInfo.warnings)
      ? keyInfo.warnings.filter((item) => typeof item === 'string' && item.trim().length > 0 && !isGenericOrDevWarning(item))
      : [],
    contacts: Array.isArray(keyInfo.contacts)
      ? keyInfo.contacts.filter((item) => typeof item === 'string' && item.trim().length > 0)
      : []
  };

  const documentWarnings = Array.isArray(parsed.warnings)
    ? parsed.warnings.filter((item) => typeof item === 'string' && item.trim().length > 0 && !isGenericOrDevWarning(item))
    : [];

  const disclaimer = 'AI-generated translation and explanation provided for informational guidance only. This does not constitute an official certified translation or legal advice. Please verify critical details with the original document or issuing government authority.';

  return {
    success: true,
    original: parsed.original || 'No text could be extracted from this document.',
    detectedLanguage: parsed.detectedLanguage || 'Unspecified',
    targetLanguage: normalizedLang,
    translation: parsed.translation || 'Translation could not be completed.',
    explanation: parsed.explanation || 'No explanation available for this document.',
    keyInfo: sanitizedKeyInfo,
    warnings: documentWarnings,
    disclaimer,
    timestamp: new Date().toISOString()
  };
}
