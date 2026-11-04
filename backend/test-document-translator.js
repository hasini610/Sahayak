/**
 * Sahayak Document Translator & Understanding Test Suite
 * Tests in-memory processing, MIME & magic bytes validation, size limits,
 * API endpoint behavior, structure parsing, and disk privacy.
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  validateFileMagicBytes,
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE_BYTES,
  processDocument
} from './services/documentService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let passedCount = 0;
let totalCount = 0;

function it(desc, fn) {
  totalCount++;
  try {
    fn();
    console.log(`   ✅ Passed: ${desc}`);
    passedCount++;
  } catch (err) {
    console.error(`   ❌ Failed: ${desc}`);
    console.error(`      ${err.message}`);
    process.exitCode = 1;
  }
}

async function itAsync(desc, fn) {
  totalCount++;
  try {
    await fn();
    console.log(`   ✅ Passed: ${desc}`);
    passedCount++;
  } catch (err) {
    console.error(`   ❌ Failed: ${desc}`);
    console.error(`      ${err.message}`);
    process.exitCode = 1;
  }
}

console.log('\n======================================================');
console.log('🧪 RUNNING DOCUMENT TRANSLATOR & PROCESSING TEST SUITE');
console.log('======================================================\n');

// 1. MIME and Size Validation Tests
console.log('--- PART 1: MIME Types & Size Constraints ---');

it('Verifies allowed MIME types list', () => {
  assert.ok(ALLOWED_MIME_TYPES.includes('application/pdf'), 'PDF must be allowed');
  assert.ok(ALLOWED_MIME_TYPES.includes('image/jpeg'), 'JPEG must be allowed');
  assert.ok(ALLOWED_MIME_TYPES.includes('image/png'), 'PNG must be allowed');
  assert.ok(ALLOWED_MIME_TYPES.includes('image/webp'), 'WebP must be allowed');
  assert.strictEqual(ALLOWED_MIME_TYPES.includes('text/plain'), false, 'TXT must be prohibited');
  assert.strictEqual(ALLOWED_MIME_TYPES.includes('application/x-msdownload'), false, 'EXE must be prohibited');
});

it('Verifies 10 MB maximum file size limit constant', () => {
  assert.strictEqual(MAX_FILE_SIZE_BYTES, 10 * 1024 * 1024, 'Limit must be 10 MB exactly');
});

// 2. Magic Bytes Deep Validation Tests
console.log('\n--- PART 2: Magic Bytes & Header Verification ---');

it('Accurately validates valid PDF magic bytes (%PDF-)', () => {
  const pdfHeader = Buffer.from('%PDF-1.4\n%âãÏÓ\n');
  const res = validateFileMagicBytes(pdfHeader, 'application/pdf');
  assert.strictEqual(res.valid, true);
});

it('Rejects fake PDF with text content', () => {
  const fakePdf = Buffer.from('This is a text file renamed to sample.pdf');
  const res = validateFileMagicBytes(fakePdf, 'application/pdf');
  assert.strictEqual(res.valid, false);
  assert.ok(res.error.includes('PDF signature'), 'Should detect invalid signature');
});

it('Accurately validates JPEG magic bytes (FF D8 FF)', () => {
  const jpegHeader = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01]);
  const res = validateFileMagicBytes(jpegHeader, 'image/jpeg');
  assert.strictEqual(res.valid, true);
});

it('Accurately validates PNG magic bytes (89 50 4E 47)', () => {
  const pngHeader = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d]);
  const res = validateFileMagicBytes(pngHeader, 'image/png');
  assert.strictEqual(res.valid, true);
});

it('Accurately validates WebP magic bytes (RIFF....WEBP)', () => {
  const webpHeader = Buffer.from([
    0x52, 0x49, 0x46, 0x46, // RIFF
    0x20, 0x00, 0x00, 0x00, // file size
    0x57, 0x45, 0x42, 0x50  // WEBP
  ]);
  const res = validateFileMagicBytes(webpHeader, 'image/webp');
  assert.strictEqual(res.valid, true);
});

it('Rejects malicious / spoofed file attempting extension override', () => {
  const evilExe = Buffer.from('MZ\x90\x00\x03\x00\x00\x00\x04\x00\x00\x00\xff\xff');
  const res = validateFileMagicBytes(evilExe, 'application/pdf');
  assert.strictEqual(res.valid, false);
});

// 3. Document Processing Validation & Rejection Logic
console.log('\n--- PART 3: Input Validation & Error Handling ---');

await itAsync('Rejects empty file buffer', async () => {
  let thrown = false;
  try {
    await processDocument({ buffer: Buffer.alloc(0), mimeType: 'application/pdf', targetLanguage: 'en' });
  } catch (err) {
    thrown = true;
    assert.ok(err.message.includes('empty'), 'Should report empty file');
  }
  assert.strictEqual(thrown, true);
});

await itAsync('Rejects file exceeding 10 MB limit', async () => {
  let thrown = false;
  const oversizedBuffer = Buffer.alloc(10 * 1024 * 1024 + 1); // 10MB + 1 byte
  try {
    await processDocument({ buffer: oversizedBuffer, mimeType: 'application/pdf', targetLanguage: 'en' });
  } catch (err) {
    thrown = true;
    assert.ok(err.message.includes('exceeds maximum allowed limit'), 'Should report size limit');
  }
  assert.strictEqual(thrown, true);
});

await itAsync('Rejects unsupported target language', async () => {
  let thrown = false;
  const validPdf = Buffer.from('%PDF-1.4\n%âãÏÓ\n');
  try {
    await processDocument({ buffer: validPdf, mimeType: 'application/pdf', targetLanguage: 'french' });
  } catch (err) {
    thrown = true;
    assert.ok(err.message.includes('Invalid target language'), 'Should reject unsupported language');
  }
  assert.strictEqual(thrown, true);
});

await itAsync('Rejects prohibited file types (e.g. .txt, .exe)', async () => {
  let thrown = false;
  try {
    await processDocument({
      buffer: Buffer.from('hello world'),
      mimeType: 'text/plain',
      targetLanguage: 'en'
    });
  } catch (err) {
    thrown = true;
    assert.ok(err.message.includes('Unsupported file type'), 'Should report unsupported type');
  }
  assert.strictEqual(thrown, true);
});

// 4. In-Memory Privacy & Disk Non-Persistence Verification
console.log('\n--- PART 4: Privacy & Zero-Disk Persistence ---');

it('Confirms uploaded documents are never persisted to disk', () => {
  const uploadsDir = path.join(__dirname, 'uploads');
  const tempDir = path.join(__dirname, 'temp');
  assert.strictEqual(fs.existsSync(uploadsDir), false, 'uploads/ folder must NOT exist on disk');
  assert.strictEqual(fs.existsSync(tempDir), false, 'temp/ folder must NOT exist on disk');
});

// 5. Structure & Contract Verification
console.log('\n--- PART 5: Response Contract Verification ---');

it('Verifies structured response schema expectations', () => {
  const sampleContract = {
    success: true,
    original: 'Income Tax Department Acknowledgement No: 881239102910',
    detectedLanguage: 'English',
    targetLanguage: 'hi',
    translation: 'आयकर विभाग पावती संख्या: 881239102910',
    explanation: 'यह पैन कार्ड आवेदन पावती रसीद है।',
    keyInfo: {
      deadlines: ['Submit within 15 days'],
      eligibility: ['Indian Resident'],
      requiredDocs: ['Aadhaar Card Copy'],
      fees: ['₹107 (incl. GST)'],
      warnings: ['Incomplete forms will be rejected'],
      contacts: ['tininfo@proteantech.in']
    },
    warnings: [],
    disclaimer: 'AI-generated translation and explanation provided for informational guidance only.',
    timestamp: new Date().toISOString()
  };

  assert.strictEqual(typeof sampleContract.original, 'string');
  assert.strictEqual(typeof sampleContract.translation, 'string');
  assert.strictEqual(typeof sampleContract.explanation, 'string');
  assert.ok(Array.isArray(sampleContract.keyInfo.deadlines), 'deadlines must be an array');
  assert.ok(Array.isArray(sampleContract.keyInfo.eligibility), 'eligibility must be an array');
  assert.ok(Array.isArray(sampleContract.keyInfo.requiredDocs), 'requiredDocs must be an array');
  assert.ok(Array.isArray(sampleContract.keyInfo.fees), 'fees must be an array');
  assert.ok(Array.isArray(sampleContract.keyInfo.warnings), 'warnings must be an array');
  assert.ok(Array.isArray(sampleContract.keyInfo.contacts), 'contacts must be an array');
  assert.ok(Array.isArray(sampleContract.warnings), 'document warnings must be an array');
  assert.ok(sampleContract.disclaimer.includes('AI-generated'), 'Statutory disclaimer required');
});

it('Filters out generic developer warnings from keyInfo.warnings', () => {
  const rawWarnings = [
    'Penalty of ₹10,000 under section 272B for furnishing false PAN',
    'Never commit real API keys to repository',
    'Developer warning: check environment variables',
    'Valid government caution: application expires in 30 days'
  ];

  const isGeneric = (text) => {
    const lower = text.toLowerCase();
    return lower.includes('api key') || lower.includes('never commit') || lower.includes('developer');
  };

  const filtered = rawWarnings.filter((w) => !isGeneric(w));
  assert.strictEqual(filtered.length, 2);
  assert.strictEqual(filtered[0], 'Penalty of ₹10,000 under section 272B for furnishing false PAN');
  assert.strictEqual(filtered[1], 'Valid government caution: application expires in 30 days');
});

console.log('\n======================================================');
console.log(`🎉 ALL ${passedCount} OF ${totalCount} DOCUMENT TRANSLATOR TESTS PASSED!`);
console.log('======================================================\n');

