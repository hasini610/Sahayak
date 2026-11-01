import {
  SPEECH_LOCALES,
  findBestVoice,
  getVoiceUnavailableMessage,
  cleanTextForSpeech
} from './src/services/speechService.js';

function assert(condition, message) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

console.log('\n======================================================');
console.log('🧪 RUNNING SPEECH SERVICE MULTILINGUAL TEST SUITE');
console.log('======================================================\n');

// Mock voice fixtures
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

// Test 1: Locale Map Configuration
console.log('1. Verifying Language Locales:');
assert(SPEECH_LOCALES.en === 'en-IN', 'en must map to en-IN');
assert(SPEECH_LOCALES.hi === 'hi-IN', 'hi must map to hi-IN');
assert(SPEECH_LOCALES.te === 'te-IN', 'te must map to te-IN');
console.log('   ✅ Passed: en-IN, hi-IN, te-IN properly configured.');

// Test 2: Edge Telugu Voice Selection
console.log('2. Verifying Edge Telugu voice detection:');
const teVoiceEdge = findBestVoice(mockEdgeVoices, 'te');
assert(teVoiceEdge && teVoiceEdge.lang === 'te-IN', 'Should select Microsoft Mohan for Telugu');
console.log(`   ✅ Passed: Matched "${teVoiceEdge.name}"`);

// Test 3: Chrome Telugu Voice Selection
console.log('3. Verifying Chrome Telugu voice detection:');
const teVoiceChrome = findBestVoice(mockChromeVoices, 'te');
assert(teVoiceChrome && teVoiceChrome.name.includes('తెలుగు'), 'Should select Google తెలుగు');
console.log(`   ✅ Passed: Matched "${teVoiceChrome.name}"`);

// Test 4: Edge Hindi Voice Selection
console.log('4. Verifying Edge Hindi voice detection:');
const hiVoiceEdge = findBestVoice(mockEdgeVoices, 'hi');
assert(hiVoiceEdge && hiVoiceEdge.lang === 'hi-IN', 'Should select Microsoft Swara for Hindi');
console.log(`   ✅ Passed: Matched "${hiVoiceEdge.name}"`);

// Test 5: English India Preference
console.log('5. Verifying Indian English preference:');
const enVoice = findBestVoice(mockEdgeVoices, 'en');
assert(enVoice && enVoice.lang === 'en-IN', 'Must prioritize en-IN over en-US');
console.log(`   ✅ Passed: Prioritized "${enVoice.name}"`);

// Test 6: STRICT English Voice Rejection for Telugu when unavailable
console.log('6. Verifying NO English fallback for Telugu on English-only devices:');
const teOnEnglishOnly = findBestVoice(mockEnglishOnlyDevice, 'te');
assert(teOnEnglishOnly === null, 'Must return null rather than selecting English David/Zira for Telugu');
console.log('   ✅ Passed: Correctly returned null (no English voice fallback).');

// Test 7: STRICT English Voice Rejection for Hindi when unavailable
console.log('7. Verifying NO English fallback for Hindi on English-only devices:');
const hiOnEnglishOnly = findBestVoice(mockEnglishOnlyDevice, 'hi');
assert(hiOnEnglishOnly === null, 'Must return null rather than selecting English David/Zira for Hindi');
console.log('   ✅ Passed: Correctly returned null (no English voice fallback).');

// Test 8: Asynchronous Empty Voices Array
console.log('8. Verifying handling of empty voices array:');
assert(findBestVoice([], 'te') === null, 'Empty array must return null');
assert(findBestVoice(null, 'hi') === null, 'Null voices must return null');
console.log('   ✅ Passed: Handled empty voices safely.');

// Test 9: Voice Unavailable Messages
console.log('9. Verifying Voice Unavailable Notice messages:');
const teNotice = getVoiceUnavailableMessage('te');
const hiNotice = getVoiceUnavailableMessage('hi');
assert(teNotice.includes('తెలుగు వాయిస్'), 'Telugu notice must be in Telugu script');
assert(hiNotice.includes('हिंदी आवाज़'), 'Hindi notice must be in Hindi script');
console.log('   ✅ Passed: Localized friendly notices verified.');

// Test 10: Clean Text for TTS
console.log('10. Verifying Text Cleaning for Natural Voice Output:');
const rawReply = 'Visit https://beneficiary.nha.gov.in/ or CSC. You get **₹5,00,000** coverage! [Form 49A]';
const cleaned = cleanTextForSpeech(rawReply);
assert(!cleaned.includes('https://'), 'Must strip URLs');
assert(!cleaned.includes('**'), 'Must strip markdown asterisks');
assert(!cleaned.includes('['), 'Must strip brackets');
console.log('   Raw:    ', rawReply);
console.log('   Cleaned:', cleaned);
console.log('   ✅ Passed: Speech text cleanly sanitized without changing display text.');

console.log('\n======================================================');
console.log('🎉 ALL 10 SPEECH SERVICE TESTS PASSED SUCCESSFULLY!');
console.log('======================================================\n');

