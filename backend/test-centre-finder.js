import assert from 'assert';
import {
  AUTHORISED_CENTRES,
  OFFICIAL_LOCATOR_PORTALS,
  calculateHaversineDistanceKm,
  searchAuthorisedCentres
} from './data/serviceCentres.js';

console.log('\n======================================================');
console.log('🧪 RUNNING AUTHORISED CENTRE FINDER TEST SUITE');
console.log('======================================================\n');

let passedTests = 0;

// Test 1: Verify Directory Quality & Authorisation Status
console.log('1. Verifying service centre directory records and authorisation metadata...');
assert(AUTHORISED_CENTRES.length >= 8, 'Directory should have at least 8 curated authorised centres');
for (const centre of AUTHORISED_CENTRES) {
  assert(centre.id, 'Centre must have an ID');
  assert(centre.name, 'Centre must have a verified name');
  assert(centre.address, 'Centre must have full street address');
  assert(centre.city, 'Centre must specify city');
  assert(centre.state, 'Centre must specify state');
  assert(/^\d{6}$/.test(centre.pincode), `Centre ${centre.id} must have valid 6-digit PIN code`);
  assert(centre.coordinates && typeof centre.coordinates.lat === 'number' && typeof centre.coordinates.lng === 'number', 'Centre must have coordinates');
  assert(centre.authorisedBy, 'Centre must explicitly state authorising agency (Income Tax Dept, UTIITSL, MeitY)');
  assert(centre.verifiedContact && centre.verifiedContact.phone, 'Centre must have verified contact phone');
}
console.log('   ✅ Passed: All centres have verified addresses, 6-digit PIN codes, and official authorisation.');
passedTests++;

// Test 2: Haversine distance accuracy
console.log('2. Testing Haversine distance calculation...');
// Distance between Abids (17.3916, 78.4735) and Himayatnagar (17.4045, 78.4867) in Hyderabad ~ 2.0 km
const distKm = calculateHaversineDistanceKm(17.3916, 78.4735, 17.4045, 78.4867);
assert(distKm >= 1.5 && distKm <= 2.5, `Distance should be around 2.0 km, got ${distKm}`);
console.log(`   ✅ Passed: Haversine distance calculated accurately (${distKm} km).`);
passedTests++;

// Test 3: Search by PIN code
console.log('3. Testing search by PIN code (500001)...');
const pinSearch = searchAuthorisedCentres({ service: 'pan_card', pincode: '500001' });
assert(pinSearch.success, 'Search should succeed');
assert(pinSearch.results.length >= 1, 'Should find at least 1 centre for PIN code 500001');
assert(pinSearch.results[0].pincode === '500001', 'First match should have PIN code 500001');
console.log(`   ✅ Passed: Found ${pinSearch.results.length} centre(s) matching PIN code 500001.`);
passedTests++;

// Test 4: Search by City text query
console.log('4. Testing search by city query ("Hyderabad")...');
const citySearch = searchAuthorisedCentres({ service: 'pan_card', query: 'Hyderabad' });
assert(citySearch.success, 'Search should succeed');
assert(citySearch.results.length >= 3, 'Should find multiple PAN centres in Hyderabad');
console.log(`   ✅ Passed: Found ${citySearch.results.length} authorised centres in Hyderabad.`);
passedTests++;

// Test 5: Search with GPS coordinates and distance sorting
console.log('5. Testing GPS location search with automatic distance sorting...');
// User located at Charminar, Hyderabad (17.3616, 78.4747)
const geoSearch = searchAuthorisedCentres({
  service: 'pan_card',
  userLat: 17.3616,
  userLng: 78.4747,
  maxRadiusKm: 25
});
assert(geoSearch.hasLocationProvided === true, 'Should mark hasLocationProvided as true');
assert(geoSearch.results.length >= 1, 'Should return nearby centres');
assert(geoSearch.results[0].distanceKm !== null, 'Should compute distanceKm');
assert(geoSearch.results[0].directionsUrl.includes('google.com/maps'), 'Should generate Google Maps directions URL');
// Check that results are sorted ascending by distance
for (let i = 0; i < geoSearch.results.length - 1; i++) {
  assert(geoSearch.results[i].distanceKm <= geoSearch.results[i + 1].distanceKm, 'Results must be sorted by proximity');
}
console.log(`   ✅ Passed: Closest centre is "${geoSearch.results[0].name}" at ${geoSearch.results[0].distanceFormatted}.`);
passedTests++;

// Test 6: Fallback when searching an unindexed location/PIN code
console.log('6. Testing safe fallback to official locators when no centres exist for an unindexed PIN...');
const emptySearch = searchAuthorisedCentres({ service: 'pan_card', pincode: '999999' });
assert(emptySearch.success, 'Search should succeed gracefully');
assert(emptySearch.results.length === 0, 'No direct centres should be found for fake/unindexed PIN 999999');
assert(emptySearch.fallbackLocators && emptySearch.fallbackLocators.length >= 2, 'Must provide official locator fallbacks');
assert(emptySearch.fallbackLocators[0].url.includes('tin-nsdl.com'), 'Must provide official Protean locator URL');
assert(emptySearch.fallbackLocators[1].url.includes('utiitsl.com'), 'Must provide official UTIITSL locator URL');
console.log('   ✅ Passed: Correctly returned official statutory locator portals instead of inventing fake centres.');
passedTests++;

// Test 7: Ayushman Bharat / CSC centres search
console.log('7. Testing Ayushman Bharat CSC / Seva Kendra discovery...');
const cscSearch = searchAuthorisedCentres({ service: 'ayushman_bharat', query: 'Hyderabad' });
assert(cscSearch.results.length >= 1, 'Should find at least 1 CSC centre for Ayushman Bharat');
assert(cscSearch.results.some((c) => c.centreType === 'csc_centre'), 'Should return CSC / Seva Kendra');
console.log(`   ✅ Passed: Found ${cscSearch.results.length} authorised CSC / Seva Kendra(s) for PM-JAY.`);
passedTests++;

console.log('\n======================================================');
console.log(`🎉 ALL ${passedTests} OF ${passedTests} CENTRE FINDER TESTS PASSED!`);
console.log('======================================================\n');
