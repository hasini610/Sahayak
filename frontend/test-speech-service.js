import {
  SPEECH_LOCALES,
  findBestVoice,
  getVoiceUnavailableMessage,
  cleanTextForSpeech,
  extractSpeechTranscripts,
  SpeechSubmissionManager
} from './src/services/speechService.js';

function assert(condition, message) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

console.log('\n======================================================');
console.log('🧪 RUNNING SAHAYAK VOICE & SPEECH SERVICE TEST SUITE');
console.log('======================================================\n');

// ---------------------------------------------------------------------
// PART 1: Web Speech Recognition - Interim Results & Single-Submission
// ---------------------------------------------------------------------

console.log('--- PART 1: Interim Results & Single-Submission Tests ---\n');

// Test 1: Simulating progressive interim results ("Apply" -> "Apply for" -> "Apply for a PAN card")
console.log('1. Testing interim results accumulation:');
let submittedTranscripts = [];
const manager = new SpeechSubmissionManager((text) => {
  submittedTranscripts.push(text);
});

// Interim result 1: "Apply" (isFinal: false)
const event1 = {
  resultIndex: 0,
  results: [{ 0: { transcript: 'Apply' }, isFinal: false }]
};
const res1 = manager.updateFromEvent(event1);
assert(res1.finalTranscript === '', 'Interim event must not finalize');
assert(res1.interimTranscript === 'Apply', 'Interim transcript should be "Apply"');
assert(submittedTranscripts.length === 0, 'No submissions should occur during interim speech');

// Interim result 2: "Apply for" (isFinal: false)
const event2 = {
  resultIndex: 0,
  results: [{ 0: { transcript: 'Apply for' }, isFinal: false }]
};
const res2 = manager.updateFromEvent(event2);
assert(res2.finalTranscript === '', 'Interim event must not finalize');
assert(res2.interimTranscript === 'Apply for', 'Interim transcript should be "Apply for"');
assert(submittedTranscripts.length === 0, 'No submissions should occur during interim speech');

// Interim result 3: "Apply for a PAN" (isFinal: false)
const event3 = {
  resultIndex: 0,
  results: [{ 0: { transcript: 'Apply for a PAN' }, isFinal: false }]
};
const res3 = manager.updateFromEvent(event3);
assert(res3.finalTranscript === '', 'Interim event must not finalize');
assert(submittedTranscripts.length === 0, 'No submissions should occur during interim speech');

// Final result 4: "Apply for a PAN card" (isFinal: true)
const event4 = {
  resultIndex: 0,
  results: [{ 0: { transcript: 'Apply for a PAN card' }, isFinal: true }]
};
const res4 = manager.updateFromEvent(event4);
assert(res4.finalTranscript === 'Apply for a PAN card', 'Final transcript must be captured');
assert(submittedTranscripts.length === 0, 'Must NOT submit on onresult alone; waits for speech completion');

// Speech ends (onend triggered)
const submitted = manager.finalizeAndSubmit();
assert(submitted === true, 'Finalize and submit must succeed');
assert(submittedTranscripts.length === 1, `Expected exactly 1 submission, got ${submittedTranscripts.length}`);
assert(submittedTranscripts[0] === 'Apply for a PAN card', 'Submitted text matches final phrase');
console.log('   ✅ Passed: Progressive interim results ("Apply for a PAN card") produced exactly ONE submission.');

// Test 2: Double-submission Lock (e.g. onend + manual stopListening() race condition)
console.log('2. Testing submission lock against duplicate triggers (onend + stopListening):');
const secondCall = manager.finalizeAndSubmit();
assert(secondCall === false, 'Second submission attempt must be locked out');
assert(submittedTranscripts.length === 1, 'Duplicate trigger must NOT produce second request');
console.log('   ✅ Passed: Duplicate submission successfully blocked by lock.');

// Test 3: Short Single-Word Utterance ("Yes" / "అవును" / "हाँ")
console.log('3. Testing single short utterance ("Yes"):');
manager.reset();
submittedTranscripts = [];

const shortEvent = {
  resultIndex: 0,
  results: [{ 0: { transcript: 'Yes' }, isFinal: true }]
};
manager.updateFromEvent(shortEvent);
manager.finalizeAndSubmit();
assert(submittedTranscripts.length === 1, 'Short word should submit once');
assert(submittedTranscripts[0] === 'Yes', 'Short word submitted accurately');
console.log('   ✅ Passed: Short utterance "Yes" submitted exactly once.');

// Test 4: Long Utterance with Pauses (Multiple isFinal segments concatenated)
console.log('4. Testing longer sentence with pauses across multiple final chunks:');
manager.reset();
submittedTranscripts = [];

// Chunk 1 finalized: "I need to apply for Ayushman Bharat"
const chunk1 = {
  resultIndex: 0,
  results: [{ 0: { transcript: 'I need to apply for Ayushman Bharat' }, isFinal: true }]
};
manager.updateFromEvent(chunk1);
assert(submittedTranscripts.length === 0, 'No submission yet');

// Chunk 2 finalized: "and check my family eligibility"
const chunk2 = {
  resultIndex: 1,
  results: [
    { 0: { transcript: 'I need to apply for Ayushman Bharat' }, isFinal: true },
    { 0: { transcript: 'and check my family eligibility' }, isFinal: true }
  ]
};
manager.updateFromEvent(chunk2);
assert(submittedTranscripts.length === 0, 'No submission yet');

// End of speech
manager.finalizeAndSubmit();
assert(submittedTranscripts.length === 1, 'Multi-chunk sentence submitted exactly once');
assert(
  submittedTranscripts[0] === 'I need to apply for Ayushman Bharat and check my family eligibility',
  'Multi-chunk sentence concatenated cleanly'
);
console.log('   ✅ Passed: Multi-chunk sentence accumulated and submitted exactly once.');

// Test 5: Empty Transcript Handling (Microphone opened and closed without speaking)
console.log('5. Testing empty transcript handling (silent recording):');
manager.reset();
submittedTranscripts = [];

const emptyEvent = {
  resultIndex: 0,
  results: []
};
manager.updateFromEvent(emptyEvent);
const emptySubmitted = manager.finalizeAndSubmit();
assert(emptySubmitted === false, 'Empty transcript should return false');
assert(submittedTranscripts.length === 0, 'Empty transcript must never send a network request');
console.log('   ✅ Passed: Empty/silent recording safely rejected with 0 requests sent.');

// Test 6: Multilingual Speech Input: Telugu Utterance
console.log('6. Testing Telugu speech input ("పాన్ కార్డ్ దరఖాస్తు"):');
manager.reset();
submittedTranscripts = [];

const teluguEvent = {
  resultIndex: 0,
  results: [{ 0: { transcript: 'పాన్ కార్డ్ దరఖాస్తు' }, isFinal: true }]
};
manager.updateFromEvent(teluguEvent);
manager.finalizeAndSubmit();
assert(submittedTranscripts.length === 1, 'Telugu utterance submitted once');
assert(submittedTranscripts[0] === 'పాన్ కార్డ్ దరఖాస్తు', 'Telugu text accurately captured');
console.log('   ✅ Passed: Telugu speech input submitted cleanly.');

// ---------------------------------------------------------------------
// PART 2: Speech Synthesis & Multilingual Voice Selection
// ---------------------------------------------------------------------

console.log('\n--- PART 2: Speech Synthesis & Voice Selection Tests ---\n');

const mockEdgeVoices = [
  { name: 'Microsoft David - English (United States)', lang: 'en-US' },
  { name: 'Microsoft Neerja Online (Natural) - English (India)', lang: 'en-IN' },
  { name: 'Microsoft Swara Online (Natural) - Hindi (India)', lang: 'hi-IN' },
  { name: 'Microsoft Mohan Online (Natural) - Telugu (India)', lang: 'te-IN' }
];

const mockChromeVoices = [
  { name: 'Google US English', lang: 'en-US' },
  { name: 'Google हिन्दी', lang: 'hi-IN' },
  { name: 'Google తెలుగు', lang: 'te-IN' }
];

const mockEnglishOnlyDevice = [
  { name: 'Microsoft David - English (United States)', lang: 'en-US' },
  { name: 'Microsoft Zira - English (United States)', lang: 'en-US' }
];

// Test 7: Locales
console.log('7. Verifying Language Locales:');
assert(SPEECH_LOCALES.en === 'en-IN', 'en must map to en-IN');
assert(SPEECH_LOCALES.hi === 'hi-IN', 'hi must map to hi-IN');
assert(SPEECH_LOCALES.te === 'te-IN', 'te must map to te-IN');
console.log('   ✅ Passed: en-IN, hi-IN, te-IN properly configured.');

// Test 8: Voice Matching
console.log('8. Verifying native voice detection (Edge & Chrome):');
assert(findBestVoice(mockEdgeVoices, 'te')?.name.includes('Mohan'), 'Edge Telugu matched');
assert(findBestVoice(mockChromeVoices, 'te')?.name.includes('తెలుగు'), 'Chrome Telugu matched');
assert(findBestVoice(mockEdgeVoices, 'hi')?.name.includes('Swara'), 'Edge Hindi matched');
assert(findBestVoice(mockChromeVoices, 'hi')?.name.includes('हिन्दी'), 'Chrome Hindi matched');
assert(findBestVoice(mockEdgeVoices, 'en')?.name.includes('Neerja'), 'Indian English matched');
console.log('   ✅ Passed: Native Telugu, Hindi, and Indian English voices accurately selected.');

// Test 9: Strict English Voice Rejection for Telugu/Hindi on English-Only Devices
console.log('9. Verifying STRICT English voice rejection for Telugu/Hindi:');
assert(findBestVoice(mockEnglishOnlyDevice, 'te') === null, 'Must return null for Telugu if no native voice');
assert(findBestVoice(mockEnglishOnlyDevice, 'hi') === null, 'Must return null for Hindi if no native voice');
console.log('   ✅ Passed: Refuses to use English voice for Telugu or Hindi.');

// Test 10: TTS Text Cleaning
console.log('10. Verifying TTS Text Sanitization:');
const rawReply = 'Apply at https://onlineservices.nsdl.com/paam/ with **Aadhaar OTP** [Fee: ₹107].';
const clean = cleanTextForSpeech(rawReply);
assert(!clean.includes('https://'), 'Must strip URLs');
assert(!clean.includes('**'), 'Must strip markdown asterisks');
assert(!clean.includes('['), 'Must strip brackets');
console.log('   ✅ Passed: Spoken text cleaned:', clean);

console.log('\n======================================================');
console.log('🎉 ALL 10 VOICE & SPEECH SERVICE TESTS PASSED SUCCESSFULLY!');
console.log('======================================================\n');
