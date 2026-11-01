import {
  SPEECH_LOCALES,
  findBestVoice,
  getVoiceUnavailableMessage,
  cleanTextForSpeech,
  extractSpeechTranscripts,
  SpeechSubmissionManager
} from './src/services/speechService.js';
import { getOrCreateSessionId } from './src/services/sessionService.js';

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

// Final result: "Apply for a PAN card" (isFinal: true)
const event3 = {
  resultIndex: 0,
  results: [{ 0: { transcript: 'Apply for a PAN card' }, isFinal: true }]
};
const res3 = manager.updateFromEvent(event3);
assert(res3.finalTranscript === 'Apply for a PAN card', 'Final event should store final transcript');
assert(res3.interimTranscript === '', 'Interim transcript should be cleared');
assert(submittedTranscripts.length === 0, 'onresult MUST NOT submit to backend directly');

// Trigger onend: speech recognition ends
const submitted = manager.finalizeAndSubmit();
assert(submitted === true, 'Finalize and submit should return true on successful submission');
assert(submittedTranscripts.length === 1, `Expected exactly 1 submission, got ${submittedTranscripts.length}`);
assert(submittedTranscripts[0] === 'Apply for a PAN card', `Expected "Apply for a PAN card", got "${submittedTranscripts[0]}"`);
console.log('   ✅ Passed: Progressive interim results ("Apply for a PAN card") produced exactly ONE submission.');

// Test 2: Double-submission protection (onend fired, then stopListening called manually)
console.log('2. Testing submission lock against duplicate triggers (onend + stopListening):');
const secondSubmitAttempt = manager.finalizeAndSubmit();
assert(secondSubmitAttempt === false, 'Subsequent submission attempts must be blocked by lock');
assert(submittedTranscripts.length === 1, 'Still only 1 submission should exist');
console.log('   ✅ Passed: Duplicate submission successfully blocked by lock.');

// Test 3: Short utterance ("Yes")
console.log('3. Testing single short utterance ("Yes"):');
submittedTranscripts = [];
manager.reset();
manager.updateFromEvent({
  resultIndex: 0,
  results: [{ 0: { transcript: 'Yes' }, isFinal: true }]
});
manager.finalizeAndSubmit();
assert(submittedTranscripts.length === 1 && submittedTranscripts[0] === 'Yes', 'Short utterance should submit cleanly');
console.log('   ✅ Passed: Short utterance "Yes" submitted exactly once.');

// Test 4: Sentence split across multiple final result events
console.log('4. Testing longer sentence with pauses across multiple final chunks:');
submittedTranscripts = [];
manager.reset();
manager.updateFromEvent({
  resultIndex: 0,
  results: [{ 0: { transcript: 'I need an Ayushman card' }, isFinal: true }]
});
manager.updateFromEvent({
  resultIndex: 1,
  results: [
    { 0: { transcript: 'I need an Ayushman card' }, isFinal: true },
    { 0: { transcript: 'for my family' }, isFinal: true }
  ]
});
manager.finalizeAndSubmit();
assert(submittedTranscripts.length === 1, 'Should accumulate multiple chunks into single submission');
assert(submittedTranscripts[0] === 'I need an Ayushman card for my family', 'Chunks should concatenate with spaces');
console.log('   ✅ Passed: Multi-chunk sentence accumulated and submitted exactly once.');

// Test 5: Empty speech (user clicks mic, says nothing, and recognition ends)
console.log('5. Testing empty transcript handling (silent recording):');
submittedTranscripts = [];
manager.reset();
const emptySubmitted = manager.finalizeAndSubmit();
assert(emptySubmitted === false, 'Empty transcript must not submit');
assert(submittedTranscripts.length === 0, 'No request should be sent for empty speech');
console.log('   ✅ Passed: Empty/silent recording safely rejected with 0 requests sent.');

// Test 6: Multilingual Telugu input
console.log('6. Testing Telugu speech input ("పాన్ కార్డ్ దరఖాస్తు"):');
submittedTranscripts = [];
manager.reset();
manager.updateFromEvent({
  resultIndex: 0,
  results: [{ 0: { transcript: 'పాన్ కార్డ్ దరఖాస్తు' }, isFinal: true }]
});
manager.finalizeAndSubmit();
assert(submittedTranscripts.length === 1 && submittedTranscripts[0] === 'పాన్ కార్డ్ దరఖాస్తు', 'Telugu text must submit accurately');
console.log('   ✅ Passed: Telugu speech input submitted cleanly.');


// ---------------------------------------------------------------------
// PART 2: Speech Synthesis & Multilingual Native Voice Matching
// ---------------------------------------------------------------------

console.log('\n--- PART 2: Speech Synthesis & Voice Selection Tests ---\n');

const mockEdgeVoices = [
  { name: 'Microsoft Mohan Online (Natural) - Telugu (India)', lang: 'te-IN' },
  { name: 'Microsoft Swara Online (Natural) - Hindi (India)', lang: 'hi-IN' },
  { name: 'Microsoft Neerja Online (Natural) - English (India)', lang: 'en-IN' },
  { name: 'Microsoft David - English (United States)', lang: 'en-US' }
];

const mockChromeVoices = [
  { name: 'Google हिन्दी', lang: 'hi-IN' },
  { name: 'Google తెలుగు', lang: 'te-IN' },
  { name: 'Google UK English Female', lang: 'en-GB' },
  { name: 'Google US English', lang: 'en-US' }
];

const mockEnglishOnlyDevice = [
  { name: 'Default English System Voice', lang: 'en-US' },
  { name: 'English UK Voice', lang: 'en-GB' }
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


// ---------------------------------------------------------------------
// PART 3: Dynamic Session ID Generation & Tab Consistency
// ---------------------------------------------------------------------

console.log('\n--- PART 3: Dynamic Session ID Tests ---\n');

console.log('11. Testing dynamic UUID session creation:');
const mockStorage = {
  data: {},
  getItem(key) { return this.data[key] || null; },
  setItem(key, val) { this.data[key] = val; }
};
const id1 = getOrCreateSessionId(mockStorage);
assert(typeof id1 === 'string' && id1.length >= 16, 'Session ID must be a non-empty string');
console.log('   ✅ Passed: Generated unique session ID:', id1);

console.log('12. Testing session persistence within the same tab:');
const id2 = getOrCreateSessionId(mockStorage);
assert(id1 === id2, `Session ID must persist across calls in the same tab (${id1} vs ${id2})`);
console.log('   ✅ Passed: Session ID persisted in storage across requests.');

console.log('13. Testing new session creation for separate tab:');
const separateMockStorage = {
  data: {},
  getItem(key) { return this.data[key] || null; },
  setItem(key, val) { this.data[key] = val; }
};
const id3 = getOrCreateSessionId(separateMockStorage);
assert(id1 !== id3, 'Separate tab must generate a unique session ID');
console.log('   ✅ Passed: Separate storage context generates independent session ID:', id3);

console.log('\n======================================================');
console.log('🎉 ALL 13 VOICE, SPEECH & SESSION TESTS PASSED SUCCESSFULLY!');
console.log('======================================================\n');
