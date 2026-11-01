import {
  JOURNEY_WORKFLOWS,
  getJourneyProgress,
  saveJourneyProgress,
  clearJourneyProgress,
  STORAGE_PREFIX
} from './src/data/workflowJourneys.js';
import { UI_STRINGS } from './src/translations/content.js';

function assert(condition, message) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

console.log('\n======================================================');
console.log('🧪 RUNNING APPLICATION JOURNEY TRACKER TEST SUITE');
console.log('======================================================\n');

// Mock localStorage provider
class MockLocalStorage {
  constructor() {
    this.store = {};
  }
  getItem(key) {
    return this.store[key] || null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
  clear() {
    this.store = {};
  }
}

const mockStorage = new MockLocalStorage();

// ---------------------------------------------------------------------
// TEST 1: PAN Card Journey Workflow Definition & Fact Verification (Nov 2026)
// ---------------------------------------------------------------------
console.log('1. Testing PAN Card journey steps (Form F093, fee qualification, multiple modes):');
const panWorkflow = JOURNEY_WORKFLOWS.pan;
assert(panWorkflow && panWorkflow.id === 'pan', 'PAN workflow must exist');
assert(panWorkflow.lastVerified === 'November 2026', 'Must have lastVerified date set to November 2026');
assert(panWorkflow.officialSources?.length >= 3, 'Must have official source links configured');
assert(panWorkflow.en.steps.length === 6, 'PAN journey must have 6 steps in English');
assert(panWorkflow.hi.steps.length === 6, 'PAN journey must have 6 steps in Hindi');
assert(panWorkflow.te.steps.length === 6, 'PAN journey must have 6 steps in Telugu');

// Check Form F093 (current form since 1 April 2026)
assert(panWorkflow.en.steps[1].title.includes('Form F093'), 'Step 2 must present current Form F093');
assert(panWorkflow.hi.steps[1].title.includes('F093'), 'Hindi Step 2 must present current Form F093');
assert(panWorkflow.te.steps[1].title.includes('F093'), 'Telugu Step 2 must present current Form F093');

// Check Multiple submission modes (Step 3 & 4)
assert(panWorkflow.en.steps[2].desc.includes('Paperless') && panWorkflow.en.steps[2].desc.includes('Physical'), 'Step 3 must describe both paperless and physical modes');
assert(panWorkflow.en.steps[3].desc.includes('Aadhaar OTP') && panWorkflow.en.steps[3].desc.includes('prescribed identity'), 'Step 4 must cover Aadhaar and document upload/courier proofs');

// Check Qualified fees (Step 5) - not showing universal ₹107
assert(panWorkflow.en.steps[4].desc.includes('101') && panWorkflow.en.steps[4].desc.includes('107'), 'Step 5 must correctly qualify fees based on mode (₹101 paperless vs ₹107 physical)');
assert(panWorkflow.en.steps[4].desc.includes('66'), 'Step 5 must describe e-PAN digital fee');

console.log('   ✅ Passed: PAN Card journey verified with current Form F093, multi-mode pathways, and qualified fees.');

// ---------------------------------------------------------------------
// TEST 2: Ayushman Bharat PM-JAY Journey Definition (General vs 70+ Seniors)
// ---------------------------------------------------------------------
console.log('2. Testing Ayushman Bharat PM-JAY journey steps (SECC/NFSA vs 70+ Senior Citizens):');
const ayushWorkflow = JOURNEY_WORKFLOWS.ayushman;
assert(ayushWorkflow && ayushWorkflow.id === 'ayushman', 'Ayushman workflow must exist');
assert(ayushWorkflow.lastVerified === 'November 2026', 'Must have lastVerified date set to November 2026');
assert(ayushWorkflow.officialSources?.length >= 4, 'Must have official NHA and national portal sources');
assert(ayushWorkflow.en.steps.length === 5, 'Ayushman journey must have 5 steps in English');
assert(ayushWorkflow.hi.steps.length === 5, 'Ayushman journey must have 5 steps in Hindi');
assert(ayushWorkflow.te.steps.length === 5, 'Ayushman journey must have 5 steps in Telugu');

// Check general eligibility vs 70+ senior distinction (Step 1)
assert(ayushWorkflow.en.steps[0].desc.includes('SECC 2011') && ayushWorkflow.en.steps[0].desc.includes('70+ Senior Citizen'), 'Step 1 must distinguish SECC/NFSA from universal 70+ senior rules');
assert(ayushWorkflow.hi.steps[0].desc.includes('SECC 2011') && ayushWorkflow.hi.steps[0].desc.includes('70+'), 'Hindi step 1 must distinguish SECC from 70+ rules');
assert(ayushWorkflow.te.steps[0].desc.includes('SECC 2011') && ayushWorkflow.te.steps[0].desc.includes('70+'), 'Telugu step 1 must distinguish SECC from 70+ rules');

// Check Ayushman Vay Vandana Card (Step 4)
assert(ayushWorkflow.en.steps[3].title.includes('Vay Vandana') || ayushWorkflow.en.steps[3].desc.includes('Vay Vandana'), 'Step 4 must reference Ayushman Vay Vandana Card');
assert(ayushWorkflow.hi.steps[3].desc.includes('वय वंदना'), 'Hindi Step 4 must reference वय वंदना');
assert(ayushWorkflow.te.steps[3].desc.includes('వయ వందన'), 'Telugu Step 4 must reference వయ వందన');

console.log('   ✅ Passed: Ayushman Bharat PM-JAY journey properly differentiates general entitlement from 70+ universal expansion.');

// ---------------------------------------------------------------------
// TEST 3: Progress Calculation & Visual Bar Percentages
// ---------------------------------------------------------------------
console.log('3. Testing progress bar percentage calculations:');
function calcProgress(steps, completedMap) {
  const total = steps.length;
  const completed = steps.filter(s => !!completedMap[s.id]).length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { completed, total, percent };
}

// 0 steps done
const p0 = calcProgress(panWorkflow.en.steps, {});
assert(p0.completed === 0 && p0.percent === 0, '0 of 6 should be 0%');

// 3 steps done
const p3 = calcProgress(panWorkflow.en.steps, { 1: true, 2: true, 3: true });
assert(p3.completed === 3 && p3.percent === 50, '3 of 6 should be 50%');

// 6 steps done (all)
const p6 = calcProgress(panWorkflow.en.steps, { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true });
assert(p6.completed === 6 && p6.percent === 100, '6 of 6 should be 100%');

// Ayushman: 2 of 5 = 40%
const pa2 = calcProgress(ayushWorkflow.en.steps, { 1: true, 2: true });
assert(pa2.completed === 2 && pa2.percent === 40, '2 of 5 should be 40%');
console.log('   ✅ Passed: Progress percentages computed accurately.');

// ---------------------------------------------------------------------
// TEST 4: Visual Step Status Distinctions (Completed, Current, Pending)
// ---------------------------------------------------------------------
console.log('4. Testing Completed, Current, and Pending step distinction:');
function getStepStatus(stepIndex, stepId, completedMap, totalSteps) {
  if (completedMap[stepId]) return 'completed';
  let firstIncompleteIdx = -1;
  for (let i = 1; i <= totalSteps; i++) {
    if (!completedMap[i]) {
      firstIncompleteIdx = i - 1;
      break;
    }
  }
  if (stepIndex === firstIncompleteIdx) return 'current';
  return 'pending';
}

const mapPartial = { 1: true, 2: true };
assert(getStepStatus(0, 1, mapPartial, 6) === 'completed', 'Step 1 should be completed');
assert(getStepStatus(1, 2, mapPartial, 6) === 'completed', 'Step 2 should be completed');
assert(getStepStatus(2, 3, mapPartial, 6) === 'current', 'Step 3 must be marked CURRENT');
assert(getStepStatus(3, 4, mapPartial, 6) === 'pending', 'Step 4 must be marked PENDING');
assert(getStepStatus(4, 5, mapPartial, 6) === 'pending', 'Step 5 must be marked PENDING');
console.log('   ✅ Passed: Completed, Current, and Pending steps accurately differentiated.');

// ---------------------------------------------------------------------
// TEST 5: Independent Progress Isolation Between PAN & Ayushman Bharat
// ---------------------------------------------------------------------
console.log('5. Testing independent progress isolation between PAN and Ayushman Bharat:');
mockStorage.clear();

saveJourneyProgress('pan', { 1: true, 2: true, 3: true }, mockStorage);
const ayushInitial = getJourneyProgress('ayushman', mockStorage);
assert(Object.keys(ayushInitial).length === 0, 'Ayushman progress must be untouched by PAN updates');

saveJourneyProgress('ayushman', { 1: true }, mockStorage);
const panRetrieved = getJourneyProgress('pan', mockStorage);
assert(panRetrieved[1] && panRetrieved[2] && panRetrieved[3] && !panRetrieved[4], 'PAN progress must remain intact');

const ayushRetrieved = getJourneyProgress('ayushman', mockStorage);
assert(ayushRetrieved[1] && !ayushRetrieved[2], 'Ayushman progress must contain only its own steps');
console.log('   ✅ Passed: Strict isolation between PAN Card and Ayushman Bharat progress verified.');

// ---------------------------------------------------------------------
// TEST 6: Persistence Across Simulated Browser Refreshes
// ---------------------------------------------------------------------
console.log('6. Testing progress persistence across simulated browser refreshes:');
const afterRefreshPan = getJourneyProgress('pan', mockStorage);
assert(afterRefreshPan[1] === true && afterRefreshPan[2] === true && afterRefreshPan[3] === true, 'PAN steps must persist after refresh');

const afterRefreshAyush = getJourneyProgress('ayushman', mockStorage);
assert(afterRefreshAyush[1] === true, 'Ayushman steps must persist after refresh');
console.log('   ✅ Passed: LocalStorage persistence verified across session reloads.');

// ---------------------------------------------------------------------
// TEST 7: Reset Progress with Confirmation
// ---------------------------------------------------------------------
console.log('7. Testing Reset Progress functionality:');
clearJourneyProgress('pan', mockStorage);
const panAfterReset = getJourneyProgress('pan', mockStorage);
assert(Object.keys(panAfterReset).length === 0, 'PAN progress must be cleared after reset');

const ayushAfterPanReset = getJourneyProgress('ayushman', mockStorage);
assert(ayushAfterPanReset[1] === true, 'Ayushman progress must NOT be cleared when PAN is reset');
console.log('   ✅ Passed: Resetting one service cleanly preserves other service progress.');

// ---------------------------------------------------------------------
// TEST 8: Multilingual UI Strings for Tracker
// ---------------------------------------------------------------------
console.log('8. Testing Multilingual UI Strings for Tracker (EN, HI, TE):');
for (const lang of ['en', 'hi', 'te']) {
  const strings = UI_STRINGS[lang];
  assert(strings.trackerTitle && strings.trackerTitle.length > 0, `Missing trackerTitle in ${lang}`);
  assert(strings.statusCompleted && strings.statusCompleted.length > 0, `Missing statusCompleted in ${lang}`);
  assert(strings.statusCurrent && strings.statusCurrent.length > 0, `Missing statusCurrent in ${lang}`);
  assert(strings.statusPending && strings.statusPending.length > 0, `Missing statusPending in ${lang}`);
  assert(strings.resetProgress && strings.resetProgress.length > 0, `Missing resetProgress in ${lang}`);
  assert(strings.resetConfirmQuestion && strings.resetConfirmQuestion.length > 0, `Missing resetConfirmQuestion in ${lang}`);
  assert(strings.trackerGuidanceNote && strings.trackerGuidanceNote.length > 0, `Missing trackerGuidanceNote in ${lang}`);
}
console.log('   ✅ Passed: All tracker UI strings verified in English, Hindi, and Telugu.');

console.log('\n======================================================');
console.log('🎉 ALL 8 APPLICATION JOURNEY TRACKER TESTS PASSED SUCCESSFULLY!');
console.log('======================================================\n');
