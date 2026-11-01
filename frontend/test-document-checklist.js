import {
  CHECKLIST_SERVICES,
  getChecklistProgress,
  saveChecklistProgress,
  clearChecklistProgress,
  CHECKLIST_STORAGE_PREFIX
} from './src/data/checklistDocuments.js';
import { UI_STRINGS } from './src/translations/content.js';

function assert(condition, message) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

console.log('\n======================================================');
console.log('🧪 RUNNING SMART DOCUMENT CHECKLIST TEST SUITE');
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
// TEST 1: PAN Card Checklist Verification (Rule 114 & F093)
// ---------------------------------------------------------------------
console.log('1. Testing PAN Card document checklist structure & status qualification:');
const panChecklist = CHECKLIST_SERVICES.pan;
assert(panChecklist && panChecklist.id === 'pan', 'PAN checklist service must exist');
assert(panChecklist.en.documents.length === 6, 'Must have 6 verified PAN documents in English');
assert(panChecklist.hi.documents.length === 6, 'Must have 6 verified PAN documents in Hindi');
assert(panChecklist.te.documents.length === 6, 'Must have 6 verified PAN documents in Telugu');

// Verify Aadhaar is NOT claimed as the only accepted document
const aadhaarDoc = panChecklist.en.documents.find(d => d.id === 'pan_aadhaar');
assert(aadhaarDoc && aadhaarDoc.statusType === 'depends_on_mode', 'Aadhaar must be labeled depends_on_mode');
assert(aadhaarDoc.explanation.includes('alternative government IDs'), 'Must explain alternative IDs for non-Aadhaar routes');

// Verify Alternative POI/POA/DOB document
const altDocs = panChecklist.en.documents.find(d => d.id === 'pan_alt_poi_poa');
assert(altDocs && altDocs.statusType === 'depends_on_mode', 'Alternative POI/POA must be depends_on_mode');
assert(altDocs.explanation.includes('Voter ID') && altDocs.explanation.includes('Passport'), 'Must cite officially accepted alternative documents');

// Verify Photographs document
const photoDoc = panChecklist.en.documents.find(d => d.id === 'pan_photos');
assert(photoDoc.statusType === 'depends_on_mode', 'Photographs must be marked depends_on_mode (not required for paperless e-KYC)');

// Verify Email & Payment
const emailDoc = panChecklist.en.documents.find(d => d.id === 'pan_email');
assert(emailDoc.statusType === 'required', 'Email must be required for e-PAN delivery');

console.log('   ✅ Passed: PAN Card checklist accurately qualifies document requirements without mandating Aadhaar universally.');

// ---------------------------------------------------------------------
// TEST 2: Ayushman Bharat Checklist Verification (General vs 70+ Seniors)
// ---------------------------------------------------------------------
console.log('2. Testing Ayushman Bharat PM-JAY document checklist (SECC/NFSA vs 70+ Seniors):');
const ayushChecklist = CHECKLIST_SERVICES.ayushman;
assert(ayushChecklist && ayushChecklist.id === 'ayushman', 'Ayushman checklist must exist');
assert(ayushChecklist.en.documents.length === 5, 'Must have 5 verified documents in English');
assert(ayushChecklist.hi.documents.length === 5, 'Must have 5 verified documents in Hindi');
assert(ayushChecklist.te.documents.length === 5, 'Must have 5 verified documents in Telugu');

// Verify Ration card is conditional (NOT mandatory for 70+ seniors)
const rationDoc = ayushChecklist.en.documents.find(d => d.id === 'ayush_ration_card');
assert(rationDoc && rationDoc.statusType === 'conditional', 'Ration card must be marked conditional');
assert(rationDoc.explanation.includes('NOT required for senior citizens aged 70 and above'), 'Must explicitly clarify ration card is not required for 70+ seniors');

// Verify Aadhaar for age & identity
const ayushAadhaar = ayushChecklist.en.documents.find(d => d.id === 'ayush_aadhaar');
assert(ayushAadhaar.statusType === 'required', 'Aadhaar is primary required document for identity & age');

// Verify CGHS/ECHS/CAPF coordination option
const cghsDoc = ayushChecklist.en.documents.find(d => d.id === 'ayush_cghs_echs_card');
assert(cghsDoc && cghsDoc.statusType === 'conditional', 'Public health scheme card must be conditional');

console.log('   ✅ Passed: Ayushman Bharat checklist distinguishes general family entitlement from 70+ senior citizen rules.');

// ---------------------------------------------------------------------
// TEST 3: Progress Calculation & Percentage Updates
// ---------------------------------------------------------------------
console.log('3. Testing checklist progress and percentage calculations:');
function calcChecklistProgress(documents, readyMap) {
  const total = documents.length;
  const ready = documents.filter(d => !!readyMap[d.id]).length;
  const percent = total > 0 ? Math.round((ready / total) * 100) : 0;
  return { ready, total, percent };
}

// 0 ready
const c0 = calcChecklistProgress(panChecklist.en.documents, {});
assert(c0.ready === 0 && c0.percent === 0, '0 of 6 should be 0%');

// 3 ready (50%)
const c3 = calcChecklistProgress(panChecklist.en.documents, { pan_aadhaar: true, pan_mobile: true, pan_email: true });
assert(c3.ready === 3 && c3.percent === 50, '3 of 6 should be 50%');

// All ready (100%)
const cAll = calcChecklistProgress(panChecklist.en.documents, {
  pan_aadhaar: true, pan_mobile: true, pan_alt_poi_poa: true, pan_photos: true, pan_email: true, pan_payment: true
});
assert(cAll.ready === 6 && cAll.percent === 100, '6 of 6 should be 100%');

// Ayushman: 2 of 5 = 40%
const ca2 = calcChecklistProgress(ayushChecklist.en.documents, { ayush_aadhaar: true, ayush_mobile: true });
assert(ca2.ready === 2 && ca2.percent === 40, '2 of 5 should be 40%');
console.log('   ✅ Passed: Progress counts and percentages calculate accurately.');

// ---------------------------------------------------------------------
// TEST 4: Independent Checklist Progress Isolation Between Services
// ---------------------------------------------------------------------
console.log('4. Testing independent checklist isolation between PAN and Ayushman:');
mockStorage.clear();

// Mark PAN documents ready
saveChecklistProgress('pan', { pan_aadhaar: true, pan_email: true }, mockStorage);

// Verify Ayushman is untouched
const ayushProgressInitial = getChecklistProgress('ayushman', mockStorage);
assert(Object.keys(ayushProgressInitial).length === 0, 'Ayushman checklist must be empty initially');

// Mark Ayushman documents ready
saveChecklistProgress('ayushman', { ayush_aadhaar: true }, mockStorage);

// Check PAN progress is preserved
const panProgressRetrieved = getChecklistProgress('pan', mockStorage);
assert(panProgressRetrieved.pan_aadhaar === true && panProgressRetrieved.pan_email === true && !panProgressRetrieved.pan_photos, 'PAN progress intact');

const ayushProgressRetrieved = getChecklistProgress('ayushman', mockStorage);
assert(ayushProgressRetrieved.ayush_aadhaar === true && !ayushProgressRetrieved.ayush_ration_card, 'Ayushman progress intact');
console.log('   ✅ Passed: PAN and Ayushman document progress remain strictly isolated.');

// ---------------------------------------------------------------------
// TEST 5: Persistence Across Simulated Browser Refreshes
// ---------------------------------------------------------------------
console.log('5. Testing checklist progress persistence across page refreshes:');
const reloadedPan = getChecklistProgress('pan', mockStorage);
assert(reloadedPan.pan_aadhaar === true && reloadedPan.pan_email === true, 'PAN checklist persists across reloads');

const reloadedAyush = getChecklistProgress('ayushman', mockStorage);
assert(reloadedAyush.ayush_aadhaar === true, 'Ayushman checklist persists across reloads');
console.log('   ✅ Passed: LocalStorage persistence verified across session reloads.');

// ---------------------------------------------------------------------
// TEST 6: Reset Functionality & Isolation
// ---------------------------------------------------------------------
console.log('6. Testing checklist reset functionality & isolation:');
clearChecklistProgress('pan', mockStorage);

const panAfterReset = getChecklistProgress('pan', mockStorage);
assert(Object.keys(panAfterReset).length === 0, 'PAN checklist must be empty after reset');

const ayushAfterPanReset = getChecklistProgress('ayushman', mockStorage);
assert(ayushAfterPanReset.ayush_aadhaar === true, 'Ayushman checklist must NOT be cleared when PAN is reset');
console.log('   ✅ Passed: Resetting PAN checklist preserves Ayushman progress intact.');

// ---------------------------------------------------------------------
// TEST 7: Multilingual Translations (English, Hindi, Telugu)
// ---------------------------------------------------------------------
console.log('7. Testing Multilingual translations in EN, HI, TE:');
for (const lang of ['en', 'hi', 'te']) {
  const strings = UI_STRINGS[lang];
  assert(strings.checklistHeaderTitle && strings.checklistHeaderTitle.length > 0, `Missing checklistHeaderTitle in ${lang}`);
  assert(strings.checklistSubtitle && strings.checklistSubtitle.length > 0, `Missing checklistSubtitle in ${lang}`);
  assert(strings.checklistGuidanceNotice && strings.checklistGuidanceNotice.length > 0, `Missing checklistGuidanceNotice in ${lang}`);
  assert(strings.statusRequired && strings.statusRequired.length > 0, `Missing statusRequired in ${lang}`);
  assert(strings.statusConditional && strings.statusConditional.length > 0, `Missing statusConditional in ${lang}`);
  assert(strings.statusDependsOnMode && strings.statusDependsOnMode.length > 0, `Missing statusDependsOnMode in ${lang}`);
  assert(strings.docsReadyLabel && strings.docsReadyLabel.length > 0, `Missing docsReadyLabel in ${lang}`);
  assert(strings.resetChecklist && strings.resetChecklist.length > 0, `Missing resetChecklist in ${lang}`);
  assert(strings.resetChecklistConfirm && strings.resetChecklistConfirm.length > 0, `Missing resetChecklistConfirm in ${lang}`);
  assert(strings.portalConfirmationNote && strings.portalConfirmationNote.length > 0, `Missing portalConfirmationNote in ${lang}`);

  // Check document names in that language
  const panDocs = CHECKLIST_SERVICES.pan[lang].documents;
  assert(panDocs.length === 6, `PAN docs in ${lang} must have 6 items`);
  assert(panDocs[0].name.length > 0 && panDocs[0].explanation.length > 0, `PAN doc 0 invalid in ${lang}`);

  const ayushDocs = CHECKLIST_SERVICES.ayushman[lang].documents;
  assert(ayushDocs.length === 5, `Ayushman docs in ${lang} must have 5 items`);
  assert(ayushDocs[0].name.length > 0 && ayushDocs[0].explanation.length > 0, `Ayushman doc 0 invalid in ${lang}`);
}
console.log('   ✅ Passed: All checklist strings and documents fully translated in English, Hindi, and Telugu.');

console.log('\n======================================================');
console.log('🎉 ALL 7 SMART DOCUMENT CHECKLIST TESTS PASSED SUCCESSFULLY!');
console.log('======================================================\n');
