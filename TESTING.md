# Testing and Quality Assurance Report for Sahayak

This document outlines the testing strategy, test suites, automated test cases, and manual verification procedures for the **Sahayak** application.

---

## 📑 Table of Contents

- [Testing Strategy Overview](#-testing-strategy-overview)
- [Automated Test Execution Summary](#-automated-test-execution-summary)
- [Backend Automated Test Suites](#-backend-automated-test-suites)
  - [1. Comprehensive Chat & Security Suite (`test-chat-endpoint.js`)](#1-comprehensive-chat--security-suite-test-chat-endpointjs)
  - [2. Interactive Step-by-Step Guidance Suite (`test-step-guidance.js`)](#2-interactive-step-by-step-guidance-suite-test-step-guidancejs)
  - [3. Official Source Verification Suite (`test-official-sources.js`)](#3-official-source-verification-suite-test-official-sourcesjs)
  - [4. Authorised Service Centre Finder Suite (`test-centre-finder.js`)](#4-authorised-service-centre-finder-suite-test-centre-finderjs)
- [Frontend Automated Test Suites](#-frontend-automated-test-suites)
  - [5. Application Journey Tracker Suite (`test-journey-tracker.js`)](#5-application-journey-tracker-suite-test-journey-trackerjs)
  - [6. Smart Document Checklist Suite (`test-document-checklist.js`)](#6-smart-document-checklist-suite-test-document-checklistjs)
  - [7. Voice, Speech & Session Isolation Suite (`test-speech-service.js`)](#7-voice-speech--session-isolation-suite-test-speech-servicejs)
- [Production Build Verification](#-production-build-verification)
- [Manual Test Procedures & Verification Matrix](#-manual-test-procedures--verification-matrix)
- [Automated Test Execution Guide](#-automated-test-execution-guide)

---

## 🎯 Testing Strategy Overview

Sahayak employs a multi-layered testing methodology to verify conversational correctness, API security, multilingual natural language understanding, accessibility, and client-side persistence:

```
+-------------------------------------------------------------------+
|                        TESTING PYRAMID                            |
+-------------------------------------------------------------------+
|  Manual Hardware Tests  | Live Microphone, Browser TTS, Geolocation|
+-------------------------+-----------------------------------------+
|  Frontend Unit Suites   | Speech Locking, LocalStorage, Trackers  |
+-------------------------+-----------------------------------------+
|  Backend Integration    | Conversational Sessions, Fallbacks, Rate|
+-------------------------+-----------------------------------------+
|  Data Integrity Tests   | Official Sources, Centre PIN Code Maps  |
+-------------------------------------------------------------------+
```

1. **Automated Unit & Integration Tests (65 Tests):** Executed directly in Node.js against pure modules, simulated DOM APIs, and live Express routes.
2. **Deterministic Fallback Testing:** Every conversational scenario is verified under both online API mode and offline/quota-limited conditions to ensure uninterrupted citizen access.
3. **Manual Hardware & Cross-Browser Tests:** Validated in live Chromium-based environments (Google Chrome and Microsoft Edge) for audio hardware access, native acoustic voice synthesis, and responsive CSS viewports.

---

## 📊 Automated Test Execution Summary

| Test Suite File | Domain | Tests Executed | Passed | Failed | Status |
| :--- | :--- | :---: | :---: | :---: | :---: |
| `backend/test-chat-endpoint.js` | API, Intent, Rate Limiting & Fallbacks | 14 | 14 | 0 | **PASSED** |
| `backend/test-step-guidance.js` | Step Guidance Dialogue & State Engine | 10 | 10 | 0 | **PASSED** |
| `backend/test-official-sources.js` | Source Schema, URLs & Verification Dates | 6 | 6 | 0 | **PASSED** |
| `backend/test-centre-finder.js` | Geolocation, PIN Search & Distance Math | 7 | 7 | 0 | **PASSED** |
| `frontend/test-journey-tracker.js` | Step Stepper, LocalStorage & Multilingual | 8 | 8 | 0 | **PASSED** |
| `frontend/test-document-checklist.js` | Document Status Badges & Persistence | 7 | 7 | 0 | **PASSED** |
| `frontend/test-speech-service.js` | Voice Submission Lock, Locales & UUIDs | 13 | 13 | 0 | **PASSED** |
| **Total Automated Tests** | | **65** | **65** | **0** | **100% PASS** |

---

## 🖥️ Backend Automated Test Suites

### 1. Comprehensive Chat & Security Suite (`test-chat-endpoint.js`)
*Command:* `cd backend && npm run test:chat`

| Test ID | Feature Under Test | Test Input / Action | Expected Result | Actual Status |
| :--- | :--- | :--- | :--- | :--- |
| `TC-BE-01` | PAN Card (English) | `POST /api/chat` with *"How do I apply for a new PAN card online?"* in `en` | Returns `workflow: 'pan_card'`, guided steps array, and verified sources. | **PASSED** |
| `TC-BE-02` | PAN Card (Hindi) | `POST /api/chat` with *"नया पैन कार्ड कैसे बनवाएं और क्या शुल्क लगेगा?"* in `hi` | Returns Hindi guidance mentioning Form 93 / Form 49A and ₹107 fee without English fallback text. | **PASSED** |
| `TC-BE-03` | PAN Card (Telugu) | `POST /api/chat` with *"కొత్త పాన్ కార్డ్ దరఖాస్తు చేసుకోవడం ఎలా?"* in `te` | Returns Telugu guidance in native Telugu script with ₹107 fee. | **PASSED** |
| `TC-BE-04` | Ayushman Bharat (English) | `POST /api/chat` with *"What is Ayushman Bharat and how much health cover is given?"* in `en` | Returns `workflow: 'ayushman_bharat'` and ₹5,00,000 cover. | **PASSED** |
| `TC-BE-05` | Ayushman Bharat (Hindi) | `POST /api/chat` with *"आयुष्मान भारत योजना क्या है और 5 लाख का इलाज कैसे मिलता है?"* in `hi` | Returns Hindi Ayushman guidance and 5 लाख cover. | **PASSED** |
| `TC-BE-06` | Ayushman Bharat (Telugu) | `POST /api/chat` with *"ఆయుష్మాన్ భారత్ హెల్త్ కార్డు ఎలా పొందాలి?"* in `te` | Returns Telugu Ayushman guidance mentioning 5 లక్షల బీమా. | **PASSED** |
| `TC-BE-07` | Unsupported Service (English) | `POST /api/chat` with *"How do I apply for a Voter ID card?"* | Returns `workflow: 'general'`, 0 steps, and polite rejection citing `voters.eci.gov.in`. | **PASSED** |
| `TC-BE-08` | Unsupported Service (Hindi) | `POST /api/chat` with *"वोटर कार्ड कैसे बनाएं?"* | Returns Hindi polite rejection mentioning वोटर आईडी and `voters.eci.gov.in`. | **PASSED** |
| `TC-BE-09` | Unsupported Service (Telugu) | `POST /api/chat` with *"ఓటర్ ఐడి ఎలా అప్లై చేయాలి?"* | Returns Telugu polite rejection without misclassifying as PAN Card. | **PASSED** |
| `TC-BE-10` | Conversational Context Retention | `POST /api/chat` with *"What documents do I need?"* on existing PAN session | Recognises follow-up query and retains `workflow: 'pan_card'`. | **PASSED** |
| `TC-BE-11` | Mid-Session Service Switch | `POST /api/chat` switching from PAN session to Voter ID | Immediately clears PAN steps and switches to unsupported service boundary. | **PASSED** |
| `TC-BE-12` | Workflow Switch | `POST /api/chat` switching from Ayushman session to PAN Card | Smoothly switches session context to `pan_card`. | **PASSED** |
| `TC-BE-13` | Rate Limiter Bypass on Health | Multiple requests to `GET /api/health` | Health check endpoint remains unthrottled and returns `200 OK`. | **PASSED** |
| `TC-BE-14` | Zero-Delay Local Fallback | Gemini fallback invocation with no retry loops on 429/503 | Produces immediate in-process grounded fallback in EN, HI, and TE without external model latency or crash. | **PASSED** |

---

### 2. Interactive Step-by-Step Guidance Suite (`test-step-guidance.js`)
*Command:* `cd backend && node test-step-guidance.js`

| Test ID | Feature Under Test | Test Input / Action | Expected Result | Actual Status |
| :--- | :--- | :--- | :--- | :--- |
| `TC-SG-01` | Step 1 Initiation (PAN) | *"Guide me through applying for a PAN card step by step."* | Activates `guidanceState`, presents Step 1 only with official portal URL, asks if opened. | **PASSED** |
| `TC-SG-02` | Step Confirmation Advancement | *"I opened it."* on active Step 1 session | Advances `step` to 2 only; instructs selection of Individual category. | **PASSED** |
| `TC-SG-03` | Mid-Step Question Handling | *"What documents do I need?"* on active Step 2 session | Answers document requirements accurately; **does not advance step**; appends checkpoint. | **PASSED** |
| `TC-SG-04` | Simpler Explanation Request | *"I'm confused, can you explain in simpler words?"* | Re-explains Step 2 in plain language; does not advance step. | **PASSED** |
| `TC-SG-05` | Subsequent Confirmation | *"Done"* after clarification on Step 2 | Advances `step` to 3 only (applicant personal details). | **PASSED** |
| `TC-SG-06` | Exit Request | *"Stop guidance"* | Deactivates `guidanceState`; confirms guidance stopped; returns to normal assistant mode. | **PASSED** |
| `TC-SG-07` | Step 1 Initiation (Ayushman) | *"Walk me through applying for Ayushman Bharat card step by step."* | Activates Ayushman guidance; presents Step 1 with `beneficiary.nha.gov.in`. | **PASSED** |
| `TC-SG-08` | Multilingual Step Guidance (Hindi) | *"पैन कार्ड के लिए मुझे स्टेप बाय स्टेप बताएं।"* followed by *"पोर्टल खोल लिया"* | Initiates चरण 1 in Hindi; confirmation advances strictly to चरण 2. | **PASSED** |
| `TC-SG-09` | Multilingual Step Guidance (Telugu) | *"పాన్ కార్డ్ కోసం దశలవారీగా గైడ్ చేయండి."* followed by *"అయిపోయింది"* | Initiates దశ 1 in Telugu; confirmation advances strictly to దశ 2. | **PASSED** |
| `TC-SG-10` | Non-Procedural Query Isolation | *"What is the fee for a new PAN card?"* | Answers fee query normally without activating step-by-step guidance mode. | **PASSED** |

---

### 3. Official Source Verification Suite (`test-official-sources.js`)
*Command:* `cd backend && npm run test:sources`

| Test ID | Feature Under Test | Test Input / Action | Expected Result | Actual Status |
| :--- | :--- | :--- | :--- | :--- |
| `TC-OS-01` | Source Schema & Domains | Validate `OFFICIAL_SOURCES` array structure | All sources use HTTPS, official domains (`.gov.in`, `proteantech.in`, `utiitsl.com`), and audit dates <= October 2026. | **PASSED** |
| `TC-OS-02` | PAN Source Retrieval | Call `formatSourcesForResponse('pan_card')` | Returns at least 3 verified sources: Income Tax Dept, Protean, UTIITSL. | **PASSED** |
| `TC-OS-03` | Ayushman Source Retrieval | Call `formatSourcesForResponse('ayushman_bharat')` | Returns NHA official portal, Beneficiary portal, and Hospital search portal. | **PASSED** |
| `TC-OS-04` | Voter ID Boundary Source | Call `formatSourcesForResponse('voter_id')` | Correctly binds to `voters.eci.gov.in` (Election Commission of India). | **PASSED** |
| `TC-OS-05` | Response Sources Payload | Execute chat message and verify response JSON | Chat response includes source title, organisation, portal URL, and verification notice. | **PASSED** |
| `TC-OS-06` | Multilingual Grounding | Retrieve sources for Hindi and Telugu chat queries | Sources remain attached to responses regardless of interface language. | **PASSED** |

---

### 4. Authorised Service Centre Finder Suite (`test-centre-finder.js`)
*Command:* `cd backend && npm run test:centres`

| Test ID | Feature Under Test | Test Input / Action | Expected Result | Actual Status |
| :--- | :--- | :--- | :--- | :--- |
| `TC-CF-01` | Centre Directory Schema | Validate sample service centre directory records | All records contain complete address, 6-digit PIN, valid GPS coordinates, and contact details. | **PASSED** |
| `TC-CF-02` | Haversine Distance Math | Calculate distance between (17.3850, 78.4867) and (17.4000, 78.4900) | Computes accurate distance (~2.0 km) within mathematical tolerance. | **PASSED** |
| `TC-CF-03` | PIN Code Filter | Query centres for PIN `500001` | Returns matching Protean and CSC centres in Abids/Hyderabad. | **PASSED** |
| `TC-CF-04` | City Text Search | Search query `"Hyderabad"` | Case-insensitive match returns all authorized centres in Hyderabad. | **PASSED** |
| `TC-CF-05` | GPS Geolocation Search | Lat: `17.3850`, Lng: `78.4867` (Hyderabad centre) | Returns centres sorted ascending by Haversine distance in kilometres. | **PASSED** |
| `TC-CF-06` | Unindexed Region Fallback | Query with unindexed PIN `999999` | Returns 0 centres and provides official statutory online locator portals. | **PASSED** |
| `TC-CF-07` | Ayushman Centre Filter | Query with `service='ayushman_bharat'` | Returns authorised CSC / Seva Kendras handling Ayushman card enrolment. | **PASSED** |

---

## 🌐 Frontend Automated Test Suites

### 5. Application Journey Tracker Suite (`test-journey-tracker.js`)
*Command:* `cd frontend && node test-journey-tracker.js`

| Test ID | Feature Under Test | Test Input / Action | Expected Result | Actual Status |
| :--- | :--- | :--- | :--- | :--- |
| `TC-JT-01` | PAN Steps & Qualified Fees | Inspect PAN Card journey steps | Form 93 referenced; multi-mode submission pathways (paperless, e-Sign, physical) and fees (₹101–₹107) qualified. | **PASSED** |
| `TC-JT-02` | Ayushman 70+ Senior Differentiation | Inspect PM-JAY journey steps | Clearly differentiates SECC 2011/NFSA family limit from universal 70+ Ayushman Vay Vandana expansion. | **PASSED** |
| `TC-JT-03` | Progress Percentage Math | Mark 2 of 6 PAN steps complete | Calculates exact percentage (33%) and step count (2 of 6). | **PASSED** |
| `TC-JT-04` | Visual Step States | Mark Step 1 complete | Step 1 marked Completed; Step 2 marked Current/In-Progress; Step 3 marked Pending. | **PASSED** |
| `TC-JT-05` | Service State Isolation | Mark PAN steps complete, inspect PM-JAY | PM-JAY progress remains 0% (strict independent key isolation). | **PASSED** |
| `TC-JT-06` | `localStorage` Persistence | Simulate browser reload | Saved progress restores accurately from `localStorage`. | **PASSED** |
| `TC-JT-07` | Reset Progress Function | Reset PAN progress | Resets PAN progress to 0% while preserving Ayushman Bharat progress intact. | **PASSED** |
| `TC-JT-08` | Multilingual UI Strings | Inspect strings in EN, HI, and TE | All titles, status badges, buttons, and notices localized accurately. | **PASSED** |

---

### 6. Smart Document Checklist Suite (`test-document-checklist.js`)
*Command:* `cd frontend && node test-document-checklist.js`

| Test ID | Feature Under Test | Test Input / Action | Expected Result | Actual Status |
| :--- | :--- | :--- | :--- | :--- |
| `TC-DC-01` | PAN Document Classification | Inspect PAN checklist items | Aadhaar marked `Required` only for paperless mode; other methods accurately labeled `Depends on application method`. | **PASSED** |
| `TC-DC-02` | Ayushman Senior Citizen Documents | Inspect PM-JAY checklist items | Ration Card marked `Conditional`; clarifies Ration Card is not required for 70+ seniors. | **PASSED** |
| `TC-DC-03` | Checklist Progress Math | Toggle ready items | Ready count and progress bar percentage update accurately in real time. | **PASSED** |
| `TC-DC-04` | Checklist Storage Isolation | Mark PAN documents ready | Ayushman checklist readiness remains completely unaffected. | **PASSED** |
| `TC-DC-05` | Checklist Reload Persistence | Simulate browser refresh | Marked documents remain checked upon reloading from `localStorage`. | **PASSED** |
| `TC-DC-06` | Checklist Reset Function | Reset PAN document checklist | Clears PAN checks only; Ayushman checks remain preserved. | **PASSED** |
| `TC-DC-07` | Multilingual Checklist Items | Verify documents in EN, HI, and TE | Document names, explanations, and safety notices verified across all 3 languages. | **PASSED** |

---

### 7. Voice, Speech & Session Isolation Suite (`test-speech-service.js`)
*Command:* `cd frontend && node test-speech-service.js`

| Test ID | Feature Under Test | Test Input / Action | Expected Result | Actual Status |
| :--- | :--- | :--- | :--- | :--- |
| `TC-SS-01` | Progressive Interim Speech | Stream interim results *"Apply"* -> *"Apply for"* -> *"Apply for a PAN card"* | Never submits on interim results; produces exactly ONE submission on speech end. | **PASSED** |
| `TC-SS-02` | Double-Submission Protection | Simulate `onend` and `stopListening` triggering simultaneously | Submission lock blocks second submission attempt; exactly 1 request submitted. | **PASSED** |
| `TC-SS-03` | Short Utterance Submission | Utterance *"Yes"* captured | Submits *"Yes"* cleanly without timing out or dropping. | **PASSED** |
| `TC-SS-04` | Multi-Chunk Pause Accumulation | Sentence split across pauses into separate final chunks | Accumulates chunks into single coherent sentence and submits once. | **PASSED** |
| `TC-SS-05` | Silent Recording Safety | Empty speech recording (`transcript === ''`) | Safely rejects with 0 requests submitted; resets to `idle`. | **PASSED** |
| `TC-SS-06` | Telugu Voice Input | Speech recognition event with Telugu text *"పాన్ కార్డ్ దరఖాస్తు"* | Accurately captures and submits Telugu Unicode string. | **PASSED** |
| `TC-SS-07` | Speech Locale Mapping | Check language mapping configuration | Maps `en` -> `en-IN`, `hi` -> `hi-IN`, `te` -> `te-IN`. | **PASSED** |
| `TC-SS-08` | Native Voice Matching | Inspect Chrome/Edge synthetic voice selector | Accurately pairs Telugu, Hindi, and Indian English voices. | **PASSED** |
| `TC-SS-09` | Strict Accent Guardrail | Request Telugu TTS when only English voice is installed | Refuses to speak Telugu with an English accent; displays visual notice instead. | **PASSED** |
| `TC-SS-10` | TTS Text Sanitization | Clean string containing raw URLs, markdown, brackets | Strips `https://...`, asterisks, and brackets so speech synthesizer reads natural prose. | **PASSED** |
| `TC-SS-11` | Dynamic UUID Session Creation | Initialize assistant interface | Generates valid RFC 4122 v4 UUID string. | **PASSED** |
| `TC-SS-12` | Tab-Persistent Session | Query assistant repeatedly within same tab | Sends identical session UUID across all conversational turns. | **PASSED** |
| `TC-SS-13` | Multi-Tab Session Isolation | Instantiate assistant in separate simulated tab | Generates independent session UUID ensuring privacy across browser tabs. | **PASSED** |

---

## 📦 Production Build Verification

The frontend production build is compiled using Vite:
```bash
cd frontend && npm run build
```

**Build Outcome:**
- **Modules Transformed:** 1,586 modules
- **Build Duration:** ~3.5 seconds
- **Production Artifacts:**
  - `dist/index.html` (1.28 kB)
  - `dist/assets/index-*.css` (~38.8 kB)
  - `dist/assets/index-*.js` (~255.1 kB)
- **Status:** **Zero compilation errors or warnings.**

---

## 🧪 Manual Test Procedures & Verification Matrix

The following scenarios require physical browser hardware and user environment validation:

| Test ID | Scenario | Verification Procedure | Expected Behavior | Status |
| :--- | :--- | :--- | :--- | :--- |
| `TC-MN-01` | Microphone Permissions | Click microphone button on a fresh browser profile | Browser displays microphone permission prompt. Granting permission begins audio capture. | Verified manually on Chrome & Edge |
| `TC-MN-02` | Hands-Free Auto-Submission | Speak *"How do I apply for a PAN card?"* into the microphone | Transcript streams live into input box; when speech stops, query submits automatically. | Verified manually on Chrome & Edge |
| `TC-MN-03` | Audio Spoken Output (TTS) | Receive assistant reply with audio enabled | Assistant speaks response in natural Indian English, Hindi, or Telugu accent. | Verified manually on Chrome & Edge |
| `TC-MN-04` | Container-Scoped Scroll | Click microphone while scrolled mid-page | Viewport stays fixed at current position; no page-level jump or displacement occurs. | Verified manually on Chrome & Edge |
| `TC-MN-05` | Text Size Adjustment | Click `A+` and `A-` buttons in header | Transcript text size adjusts smoothly from 14px to 22px without breaking layout. | Verified manually |
| `TC-MN-06` | High-Contrast Mode | Toggle High-Contrast switch in header | Entire UI switches to high-contrast palette with darkened borders and sharp text. | Verified manually |
| `TC-MN-07` | GPS Geolocation in Centre Finder | Click *"Use My Current Location"* in Centre Finder | Browser displays location prompt; upon approval, centres display with real-time distance. | Verified manually |
| `TC-MN-08` | Mobile Viewport Responsiveness | Resize browser window to mobile width (<640px) | Left column (voice/transcript/checklist) and right column (tracker/sources) stack cleanly. | Verified manually |

---

## 🏃 Automated Test Execution Guide

To run all automated test suites on your local machine:

### 1. Run All Backend Test Suites
```bash
cd backend
# 1. Test chat endpoint, follow-ups, and fallbacks
npm run test:chat

# 2. Test interactive step-by-step guidance engine
node test-step-guidance.js

# 3. Test official source verification registry
npm run test:sources

# 4. Test authorised centre finder and distance math
npm run test:centres
```

### 2. Run All Frontend Test Suites
```bash
cd ../frontend
# 1. Test journey tracker milestones and persistence
node test-journey-tracker.js

# 2. Test smart document checklist and Rule 114 badges
node test-document-checklist.js

# 3. Test voice submission lock, locales, and session UUIDs
node test-speech-service.js

# 4. Verify production bundle compilation
npm run build
```
