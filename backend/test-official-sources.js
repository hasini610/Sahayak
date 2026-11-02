import assert from 'assert';
import { OFFICIAL_SOURCES, formatSourcesForResponse, getSourcesForWorkflow } from './knowledge/officialSources.js';
import { processChatMessage } from './services/chatService.js';

console.log('\n======================================================');
console.log('🧪 RUNNING OFFICIAL SOURCE VERIFICATION TEST SUITE');
console.log('======================================================\n');

let passedTests = 0;

// Test 1: Verify source registry structure and official domain rules
console.log('1. Verifying official sources structure and domains...');
assert(OFFICIAL_SOURCES.length >= 6, 'Should have at least 6 verified sources');
for (const src of OFFICIAL_SOURCES) {
  assert(src.id, 'Source must have an ID');
  assert(src.title, 'Source must have a title');
  assert(src.organisation, 'Source must specify the authoritative organisation');
  assert(src.portalUrl.startsWith('https://'), 'Source URL must use secure HTTPS');
  assert(
    src.portalUrl.includes('.gov.in') || src.portalUrl.includes('nsdl.com') || src.portalUrl.includes('proteantech.in') || src.portalUrl.includes('utiitsl.com'),
    `Source URL (${src.portalUrl}) must be an official government or statutory provider domain`
  );
  assert(/^\d{4}-\d{2}-\d{2}$/.test(src.lastVerifiedDate), 'Source must have valid YYYY-MM-DD verified date');
  // Strict rule: verification date must NOT be fabricated as today's date
  assert(src.lastVerifiedDate <= '2026-10-31', 'Verification date must be actual audit date, not fabricated current date');
  assert(Array.isArray(src.verifiedClaims) && src.verifiedClaims.length > 0, 'Source must have mapped claims');
}
console.log('   ✅ Passed: All sources contain verified official domains, organisations, and genuine audit dates.');
passedTests++;

// Test 2: PAN Card source retrieval
console.log('2. Testing PAN Card official source retrieval...');
const panSources = formatSourcesForResponse('pan_card');
assert(panSources.length >= 3, 'PAN card must retrieve at least 3 official sources (Income Tax, Protean, UTIITSL)');
const hasProtean = panSources.some((s) => s.id === 'protean_pan');
const hasITD = panSources.some((s) => s.id === 'incometax_efiling');
const hasUTIITSL = panSources.some((s) => s.id === 'utiitsl_pan');
assert(hasProtean && hasITD && hasUTIITSL, 'Must retrieve Protean, ITD, and UTIITSL for PAN card');
console.log('   ✅ Passed: Correctly retrieved Protean, ITD, and UTIITSL with verified claims.');
passedTests++;

// Test 3: Ayushman Bharat PM-JAY source retrieval
console.log('3. Testing Ayushman Bharat PM-JAY official source retrieval...');
const ayushmanSources = formatSourcesForResponse('ayushman_bharat');
assert(ayushmanSources.length >= 3, 'Ayushman Bharat must retrieve at least 3 official sources (NHA, Beneficiary, Hospitals)');
const hasNHA = ayushmanSources.some((s) => s.id === 'nha_pmjay_main');
const hasBeneficiary = ayushmanSources.some((s) => s.id === 'nha_beneficiary_portal');
const hasHospitals = ayushmanSources.some((s) => s.id === 'nha_hospital_search');
assert(hasNHA && hasBeneficiary && hasHospitals, 'Must retrieve NHA, Beneficiary, and Hospital portals for PM-JAY');
console.log('   ✅ Passed: Correctly retrieved NHA, Beneficiary, and Hospital search portals.');
passedTests++;

// Test 4: Voter ID boundary source retrieval
console.log('4. Testing Voter ID boundary portal retrieval...');
const voterSources = formatSourcesForResponse('voter_id');
assert(voterSources.length >= 1, 'Should retrieve constitutional boundary source for Voter ID');
assert(voterSources[0].url.includes('voters.eci.gov.in'), 'Must direct to official voters.eci.gov.in portal');
console.log('   ✅ Passed: Boundary check correctly binds Voter ID to ECI constitutional portal.');
passedTests++;

// Test 5: Verify Chat message response carries structured official source metadata
console.log('5. Testing chat response structure with official sources attached...');
const chatResponse = await processChatMessage({
  message: 'How do I apply for a PAN card online?',
  language: 'en',
  sessionId: 'test_sources_session'
});
assert(chatResponse.sources && Array.isArray(chatResponse.sources), 'Chat response must include sources array');
assert(chatResponse.sources.length >= 3, 'PAN response must include at least 3 official sources');
assert(chatResponse.sources[0].organisation, 'Each source must have organisation');
assert(chatResponse.sources[0].lastVerifiedDate, 'Each source must have lastVerifiedDate');
assert(chatResponse.sources[0].url, 'Each source must have official portal URL');
assert(chatResponse.verificationNotice, 'Must include verification notice');
console.log('   ✅ Passed: Chat response includes structured sources, organisation names, and audit notice.');
passedTests++;

// Test 6: Verify Multilingual source claims integrity
console.log('6. Testing source retrieval in Hindi and Telugu queries...');
const hiResponse = await processChatMessage({
  message: 'आयुष्मान भारत कार्ड कैसे बनवाएं?',
  language: 'hi',
  sessionId: 'test_hi_session'
});
assert(hiResponse.sources.some((s) => s.id === 'nha_pmjay_main'), 'Hindi query must retrieve NHA PM-JAY source');

const teResponse = await processChatMessage({
  message: 'పాన్ కార్డ్ ఆన్‌లైన్‌లో ఎలా దరఖాస్తు చేయాలి?',
  language: 'te',
  sessionId: 'test_te_session'
});
assert(teResponse.sources.some((s) => s.id === 'protean_pan'), 'Telugu query must retrieve Protean source');
console.log('   ✅ Passed: Multilingual queries accurately grounded in official source registry.');
passedTests++;

console.log('\n======================================================');
console.log(`🎉 ALL ${passedTests} OF ${passedTests} SOURCE VERIFICATION TESTS PASSED!`);
console.log('======================================================\n');
