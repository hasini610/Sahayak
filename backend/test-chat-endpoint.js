/**
 * Sahayak Comprehensive Test Suite (12 Required Scenarios)
 */
async function main() {
  const BASE_URL = 'http://localhost:5000/api';
  let localServer = null;

  // Check if server is already running on port 5000
  let isRunning = false;
  try {
    const health = await fetch(`${BASE_URL}/health`);
    if (health.ok) isRunning = true;
  } catch {
    isRunning = false;
  }

  if (!isRunning) {
    console.log('Starting internal test server on port 5000...');
    const { server } = await import('./server.js');
    localServer = server;
    await new Promise((r) => setTimeout(r, 800));
  } else {
    console.log('Connecting to running Sahayak backend on http://localhost:5000...');
  }

  let passedCount = 0;

  function assert(condition, message) {
    if (!condition) {
      throw new Error(`Assertion Failed: ${message}`);
    }
  }

  console.log('\n======================================================');
  console.log('🧪 RUNNING SAHAYAK COMPREHENSIVE 12-POINT TEST SUITE');
  console.log('======================================================\n');

  // --- 1. PAN Card in English ---
  console.log('1. Testing PAN Card in English...');
  const res1 = await fetch(`${BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'How do I apply for a new PAN card online?', language: 'en', sessionId: 's_en_pan' })
  });
  const data1 = await res1.json();
  assert(data1.workflow === 'pan_card', `Expected workflow pan_card, got ${data1.workflow}`);
  assert(data1.steps?.length > 0, 'Expected PAN steps');
  assert(data1.checklist?.length > 0, 'Expected PAN checklist');
  console.log('   ✅ Passed: Correctly identified PAN Card (EN) with guided steps');
  passedCount++;

  // --- 2. PAN Card in Hindi ---
  console.log('2. Testing PAN Card in Hindi...');
  const res2 = await fetch(`${BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'नया पैन कार्ड कैसे बनवाएं और क्या शुल्क लगेगा?', language: 'hi', sessionId: 's_hi_pan' })
  });
  const data2 = await res2.json();
  assert(data2.workflow === 'pan_card', `Expected workflow pan_card, got ${data2.workflow}`);
  assert(data2.steps?.length > 0, 'Expected PAN steps in Hindi');
  console.log('   ✅ Passed: Correctly identified PAN Card (HI) with Hindi steps');
  passedCount++;

  // --- 3. PAN Card in Telugu ---
  console.log('3. Testing PAN Card in Telugu...');
  const res3 = await fetch(`${BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'కొత్త పాన్ కార్డ్ దరఖాస్తు చేసుకోవడం ఎలా?', language: 'te', sessionId: 's_te_pan' })
  });
  const data3 = await res3.json();
  assert(data3.workflow === 'pan_card', `Expected workflow pan_card, got ${data3.workflow}`);
  assert(data3.steps?.length > 0, 'Expected PAN steps in Telugu');
  console.log('   ✅ Passed: Correctly identified PAN Card (TE) with Telugu steps');
  passedCount++;

  // --- 4. Ayushman Bharat in English ---
  console.log('4. Testing Ayushman Bharat in English...');
  const res4 = await fetch(`${BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'What are the benefits of Ayushman Bharat PM-JAY?', language: 'en', sessionId: 's_en_ayush' })
  });
  const data4 = await res4.json();
  assert(data4.workflow === 'ayushman_bharat', `Expected workflow ayushman_bharat, got ${data4.workflow}`);
  assert(data4.steps?.length > 0, 'Expected Ayushman steps');
  console.log('   ✅ Passed: Correctly identified Ayushman Bharat (EN)');
  passedCount++;

  // --- 5. Ayushman Bharat in Hindi ---
  console.log('5. Testing Ayushman Bharat in Hindi...');
  const res5 = await fetch(`${BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'आयुष्मान भारत कार्ड कैसे बनवा सकते हैं?', language: 'hi', sessionId: 's_hi_ayush' })
  });
  const data5 = await res5.json();
  assert(data5.workflow === 'ayushman_bharat', `Expected workflow ayushman_bharat, got ${data5.workflow}`);
  assert(data5.steps?.length > 0, 'Expected Ayushman steps');
  console.log('   ✅ Passed: Correctly identified Ayushman Bharat (HI)');
  passedCount++;

  // --- 6. Ayushman Bharat in Telugu ---
  console.log('6. Testing Ayushman Bharat in Telugu...');
  const res6 = await fetch(`${BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'ఆయుష్మాన్ భారత్ హెల్త్ కార్డ్ ఎవరు పొందవచ్చు?', language: 'te', sessionId: 's_te_ayush' })
  });
  const data6 = await res6.json();
  assert(data6.workflow === 'ayushman_bharat', `Expected workflow ayushman_bharat, got ${data6.workflow}`);
  assert(data6.steps?.length > 0, 'Expected Ayushman steps');
  console.log('   ✅ Passed: Correctly identified Ayushman Bharat (TE)');
  passedCount++;

  // --- 7. Voter ID in English ---
  console.log('7. Testing Voter ID in English (Unsupported)...');
  const res7 = await fetch(`${BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'How do I apply for a new Voter ID card online?', language: 'en', sessionId: 's_en_voter' })
  });
  const data7 = await res7.json();
  assert(data7.workflow === 'general', `Expected workflow general, got ${data7.workflow}`);
  assert(data7.steps.length === 0, 'Expected 0 steps for unsupported workflow');
  assert(data7.checklist.length === 0, 'Expected 0 checklist items for unsupported workflow');
  assert(data7.reply.toLowerCase().includes('voter id'), 'Expected reply to mention Voter ID');
  assert(data7.reply.toLowerCase().includes('not available'), 'Expected reply to state service is not available');
  console.log('   ✅ Passed: Correctly handled Voter ID (EN) as unsupported without fabricating rules');
  passedCount++;

  // --- 8. Voter ID in Hindi ---
  console.log('8. Testing Voter ID in Hindi (Unsupported)...');
  const res8 = await fetch(`${BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'नया वोटर आईडी कार्ड कैसे बनाएं?', language: 'hi', sessionId: 's_hi_voter' })
  });
  const data8 = await res8.json();
  assert(data8.workflow === 'general', `Expected workflow general, got ${data8.workflow}`);
  assert(data8.steps.length === 0, 'Expected 0 steps for unsupported workflow');
  assert(data8.checklist.length === 0, 'Expected 0 checklist items for unsupported workflow');
  assert(data8.reply.includes('वोटर आईडी') && data8.reply.includes('उपलब्ध नहीं'), 'Expected Hindi unsupported notice');
  console.log('   ✅ Passed: Correctly handled Voter ID (HI) as unsupported without fabricating rules');
  passedCount++;

  // --- 9. Voter ID in Telugu ---
  console.log('9. Testing Voter ID in Telugu ("ఓటర్ ఐడి ఎలా అప్లై చేయాలి?")...');
  const res9 = await fetch(`${BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'ఓటర్ ఐడి ఎలా అప్లై చేయాలి?', language: 'te', sessionId: 's_te_voter' })
  });
  const data9 = await res9.json();
  assert(data9.workflow === 'general', `Expected workflow general, got ${data9.workflow}`);
  assert(data9.steps.length === 0, 'Expected 0 steps for unsupported workflow');
  assert(data9.checklist.length === 0, 'Expected 0 checklist items for unsupported workflow');
  assert(data9.reply.includes('ఓటర్ ఐడి') && data9.reply.includes('అందుబాటులో లేదు'), 'Expected Telugu unsupported notice');
  console.log('   ✅ Passed: User-reported bug verified fixed! Telugu Voter ID is not misclassified as PAN');
  passedCount++;

  // --- 10. PAN Card follow-up maintaining context ---
  console.log('10. Testing PAN Card follow-up context retention...');
  const res10 = await fetch(`${BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'What documents do I need for this?', language: 'en', sessionId: 's_en_pan' })
  });
  const data10 = await res10.json();
  assert(data10.workflow === 'pan_card', `Expected continued pan_card workflow, got ${data10.workflow}`);
  assert(data10.checklist?.length > 0, 'Expected checklist retention');
  console.log('   ✅ Passed: Maintained PAN Card context on follow-up question');
  passedCount++;

  // --- 11. Switching from PAN Card to Voter ID in same session ---
  console.log('11. Testing switching from PAN Card to Voter ID in same session...');
  const res11 = await fetch(`${BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'Can you also help me apply for a Voter ID card?', language: 'en', sessionId: 's_en_pan' })
  });
  const data11 = await res11.json();
  assert(data11.workflow === 'general', `Expected workflow general on switch, got ${data11.workflow}`);
  assert(data11.steps.length === 0, 'Expected 0 steps after switching to unsupported');
  assert(data11.checklist.length === 0, 'Expected 0 checklist items after switching to unsupported');
  assert(!data11.reply.toLowerCase().includes('form 49a'), 'Must not return PAN Card instructions for Voter ID');
  assert(data11.reply.toLowerCase().includes('voter id'), 'Expected reply to mention Voter ID');
  console.log('   ✅ Passed: Successfully switched from PAN Card to Voter ID without retaining old PAN data');
  passedCount++;

  // --- 12. Switching from Ayushman Bharat to PAN Card in same session ---
  console.log('12. Testing switching from Ayushman Bharat to PAN Card in same session...');
  const res12 = await fetch(`${BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'Now I want to apply for a PAN card', language: 'en', sessionId: 's_en_ayush' })
  });
  const data12 = await res12.json();
  assert(data12.workflow === 'pan_card', `Expected workflow pan_card on switch, got ${data12.workflow}`);
  assert(data12.steps?.length > 0, 'Expected PAN Card steps after switch');
  console.log('   ✅ Passed: Successfully switched from Ayushman Bharat to PAN Card');
  passedCount++;

  console.log('\n======================================================');
  console.log(`🎉 ALL ${passedCount} OF 12 AUTOMATED TESTS PASSED SUCCESSFULLY!`);
  console.log('======================================================\n');

  if (localServer) {
    console.log('Stopping test server...');
    localServer.close();
  }
  process.exit(0);
}

main().catch((err) => {
  console.error('\n❌ Test suite failed:', err);
  process.exit(1);
});
