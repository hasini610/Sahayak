import { processChatMessage } from './services/chatService.js';
import { STEP_GUIDANCE_DATA } from './knowledge/interactiveGuidance.js';

function assert(condition, message) {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`);
  }
}

console.log('\n======================================================');
console.log('🧪 RUNNING INTERACTIVE STEP-BY-STEP GUIDANCE TEST SUITE');
console.log('======================================================\n');

let passedTests = 0;

// Test 1: Explicit PAN Card Step-by-Step Guidance Initiation
console.log('1. Testing initiation of PAN Card step-by-step guidance...');
const sessionId1 = `test_pan_step_${Date.now()}`;
const res1 = await processChatMessage({
  message: 'Guide me through applying for a PAN card step by step.',
  language: 'en',
  sessionId: sessionId1
});

assert(res1.workflow === 'pan_card', `Expected workflow pan_card, got ${res1.workflow}`);
assert(res1.guidanceState?.active === true, 'Guidance must be active');
assert(res1.guidanceState?.step === 1, `Expected step 1, got ${res1.guidanceState?.step}`);
assert(res1.reply.includes('Step 1'), 'Reply must introduce Step 1');
assert(res1.reply.includes('https://onlineservices.proteantech.in/paam/endUserRegisterContact.html'), 'Step 1 must include official Protean portal URL');
assert(res1.reply.includes('Have you opened the portal?'), 'Must ask if user opened portal');
assert(!res1.reply.includes('Step 2:'), 'Must NOT dump Step 2 prematurely');
console.log('   ✅ Passed: Successfully initiated PAN Card step-by-step guidance at Step 1');
passedTests++;

// Test 2: Confirmation ("I opened it") advances to Step 2
console.log('2. Testing step confirmation ("I opened it") advances to Step 2...');
const res2 = await processChatMessage({
  message: 'I opened it.',
  language: 'en',
  sessionId: sessionId1
});

assert(res2.guidanceState?.active === true, 'Guidance must remain active');
assert(res2.guidanceState?.step === 2, `Expected step 2, got ${res2.guidanceState?.step}`);
assert(res2.reply.includes('Step 2:'), 'Reply must present Step 2');
assert(res2.reply.includes('Individual'), 'Step 2 must instruct to select Individual');
assert(!res2.reply.includes('Step 3:'), 'Must NOT dump Step 3 prematurely');
console.log('   ✅ Passed: Confirmation advances to Step 2 only');
passedTests++;

// Test 3: User asks mid-step question ("What documents do I need?")
console.log('3. Testing mid-step question ("What documents do I need?") does NOT advance step...');
const res3 = await processChatMessage({
  message: 'What documents do I need?',
  language: 'en',
  sessionId: sessionId1
});

assert(res3.guidanceState?.active === true, 'Guidance must remain active');
assert(res3.guidanceState?.step === 2, `Step must remain at 2, got ${res3.guidanceState?.step}`);
assert(res3.reply.toLowerCase().includes('aadhaar') || res3.reply.includes('Rule 114') || res3.reply.toLowerCase().includes('document'), 'Must answer document question');
assert(res3.reply.includes('Step 2'), 'Must include checkpoint reminder for Step 2');
console.log('   ✅ Passed: Mid-step question answered and step context held at Step 2');
passedTests++;

// Test 4: User says they are confused ("I am confused, explain simpler")
console.log('4. Testing confusion/simpler explanation request on Step 2...');
const res4 = await processChatMessage({
  message: "I'm confused, can you explain in simpler words?",
  language: 'en',
  sessionId: sessionId1
});

assert(res4.guidanceState?.active === true, 'Guidance must remain active');
assert(res4.guidanceState?.step === 2, `Step must remain at 2, got ${res4.guidanceState?.step}`);
assert(res4.reply.includes('Step 2:'), 'Must re-explain Step 2');
console.log('   ✅ Passed: Provided simpler explanation without advancing step');
passedTests++;

// Test 5: User confirms Step 2 ("Done") -> Advances to Step 3
console.log('5. Testing confirmation ("Done") advances to Step 3...');
const res5 = await processChatMessage({
  message: 'Done',
  language: 'en',
  sessionId: sessionId1
});

assert(res5.guidanceState?.active === true, 'Guidance must remain active');
assert(res5.guidanceState?.step === 3, `Expected step 3, got ${res5.guidanceState?.step}`);
assert(res5.reply.includes('Step 3:'), 'Must present Step 3');
console.log('   ✅ Passed: Confirmation successfully advanced to Step 3');
passedTests++;

// Test 6: User requests to stop ("Stop guidance")
console.log('6. Testing exit request ("Stop")...');
const res6 = await processChatMessage({
  message: 'Stop guidance',
  language: 'en',
  sessionId: sessionId1
});

assert(res6.guidanceState?.active === false, 'Guidance must be deactivated');
assert(res6.reply.toLowerCase().includes('stopped'), 'Reply must confirm guidance stopped');
console.log('   ✅ Passed: Step guidance cleanly stopped on user exit request');
passedTests++;

// Test 7: Ayushman Bharat Step-by-Step Guidance
console.log('7. Testing initiation of Ayushman Bharat step-by-step guidance...');
const sessionId2 = `test_ayush_step_${Date.now()}`;
const resAyush1 = await processChatMessage({
  message: 'Walk me through applying for Ayushman Bharat card step by step.',
  language: 'en',
  sessionId: sessionId2
});

assert(resAyush1.workflow === 'ayushman_bharat', `Expected workflow ayushman_bharat, got ${resAyush1.workflow}`);
assert(resAyush1.guidanceState?.active === true, 'Guidance must be active');
assert(resAyush1.guidanceState?.step === 1, `Expected step 1, got ${resAyush1.guidanceState?.step}`);
assert(resAyush1.reply.includes('Step 1:'), 'Reply must introduce Step 1');
assert(resAyush1.reply.includes('https://beneficiary.nha.gov.in/'), 'Step 1 must cite beneficiary portal');
console.log('   ✅ Passed: Successfully initiated Ayushman Bharat step-by-step guidance');
passedTests++;

// Test 8: Hindi Multilingual Step-by-Step Guidance
console.log('8. Testing Hindi step-by-step guidance...');
const sessionId3 = `test_hi_step_${Date.now()}`;
const resHi1 = await processChatMessage({
  message: 'पैन कार्ड के लिए मुझे स्टेप बाय स्टेप बताएं।',
  language: 'hi',
  sessionId: sessionId3
});

assert(resHi1.guidanceState?.active === true, 'Hindi guidance must be active');
assert(resHi1.guidanceState?.step === 1, 'Hindi guidance must be at Step 1');
assert(resHi1.reply.includes('चरण 1'), 'Must use चरण 1 in Hindi');
assert(resHi1.reply.includes('https://onlineservices.proteantech.in/paam/endUserRegisterContact.html'), 'Must include correct Protean link in Hindi');

const resHi2 = await processChatMessage({
  message: 'पोर्टल खोल लिया',
  language: 'hi',
  sessionId: sessionId3
});
assert(resHi2.guidanceState?.step === 2, 'Hindi confirmation must advance to Step 2');
assert(resHi2.reply.includes('चरण 2'), 'Must present चरण 2 in Hindi');
console.log('   ✅ Passed: Multilingual Hindi step guidance verified');
passedTests++;

// Test 9: Telugu Multilingual Step-by-Step Guidance
console.log('9. Testing Telugu step-by-step guidance...');
const sessionId4 = `test_te_step_${Date.now()}`;
const resTe1 = await processChatMessage({
  message: 'పాన్ కార్డ్ కోసం దశలవారీగా గైడ్ చేయండి.',
  language: 'te',
  sessionId: sessionId4
});

assert(resTe1.guidanceState?.active === true, 'Telugu guidance must be active');
assert(resTe1.guidanceState?.step === 1, 'Telugu guidance must be at Step 1');
assert(resTe1.reply.includes('దశ 1'), 'Must use దశ 1 in Telugu');

const resTe2 = await processChatMessage({
  message: 'అయిపోయింది',
  language: 'te',
  sessionId: sessionId4
});
assert(resTe2.guidanceState?.step === 2, 'Telugu confirmation must advance to Step 2');
assert(resTe2.reply.includes('దశ 2'), 'Must present దశ 2 in Telugu');
console.log('   ✅ Passed: Multilingual Telugu step guidance verified');
passedTests++;

// Test 10: Normal questions do NOT enter step guidance
console.log('10. Verifying normal questions receive normal responses without entering guidance mode...');
const sessionId5 = `test_normal_${Date.now()}`;
const resNormal = await processChatMessage({
  message: 'What is the fee for a new PAN card?',
  language: 'en',
  sessionId: sessionId5
});
assert(!resNormal.guidanceState?.active, 'Normal question must not activate step guidance');
assert(resNormal.reply.includes('107') || resNormal.reply.includes('101'), 'Must answer fee question normally');
console.log('   ✅ Passed: Ordinary questions receive normal responses');
passedTests++;

console.log('\n======================================================');
console.log(`🎉 ALL ${passedTests} OF 10 STEP-GUIDANCE TESTS PASSED SUCCESSFULLY!`);
console.log('======================================================\n');
