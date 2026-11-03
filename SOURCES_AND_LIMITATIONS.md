# Sources, Limitations, and Safety Guidelines for Sahayak

This document outlines the official government information sources, source verification protocols, scope boundaries, technical limitations, and privacy guardrails governing **Sahayak**.

---

## 📑 Table of Contents

- [Official Information Sources](#-official-information-sources)
- [Source Verification Registry & Metadata](#-source-verification-registry--metadata)
- [Handling Unavailable or Unverified Information](#-handling-unavailable-or-unverified-information)
- [Scope of Supported Services & Boundary Enforcement](#-scope-of-supported-services--boundary-enforcement)
- [Limitations of AI-Generated Content](#-limitations-of-ai-generated-content)
- [API Quotas, Availability & Offline Fallback Reliability](#-api-quotas-availability--offline-fallback-reliability)
- [Browser & Hardware Dependencies (Speech Recognition & TTS)](#-browser--hardware-dependencies-speech-recognition--tts)
- [Service Centre Locator Coverage & Limitations](#-service-centre-locator-coverage--limitations)
- [Privacy, Data Protection & Guardrails](#-privacy-data-protection--guardrails)
- [Statutory Guidance-Only Disclaimer](#-statutory-guidance-only-disclaimer)

---

## 🏛️ Official Information Sources

All procedural guidance, rules, fees, and requirements in Sahayak are derived strictly from published Government of India portals and statutory service providers authorised by relevant ministries.

| Service Domain | Authoritative Organisation | Official Portal URL | Authority Classification | Manual Audit Date |
| :--- | :--- | :--- | :--- | :--- |
| **PAN Card Application** | Protean eGov Technologies Limited | [`https://onlineservices.proteantech.in/paam/endUserRegisterContact.html`](https://onlineservices.proteantech.in/paam/endUserRegisterContact.html) | Authorised Statutory Service Provider (Income Tax Dept) | 15 October 2026 |
| **Income Tax & e-PAN** | Income Tax Department, Ministry of Finance | [`https://www.incometax.gov.in/iec/foportal/`](https://www.incometax.gov.in/iec/foportal/) | Constitutional / Central Government Authority | 10 October 2026 |
| **UTIITSL PAN Services** | UTI Infrastructure Technology And Services Limited | [`https://www.pan.utiitsl.com/`](https://www.pan.utiitsl.com/) | Authorised Statutory Service Provider (Income Tax Dept) | 12 October 2026 |
| **PM-JAY Scheme** | National Health Authority (NHA) | [`https://nha.gov.in/PM-JAY`](https://nha.gov.in/PM-JAY) | Statutory National Authority (MoHFW) | 20 October 2026 |
| **PM-JAY Beneficiary Portal** | National Health Authority (NHA) | [`https://beneficiary.nha.gov.in/`](https://beneficiary.nha.gov.in/) | Official Citizen Beneficiary Service Portal | 20 October 2026 |
| **Empanelled Hospitals** | National Health Authority (NHA) | [`https://hospitals.pmjay.gov.in/`](https://hospitals.pmjay.gov.in/) | Official Hospital Locator Service | 18 October 2026 |
| **Voter ID (Boundary)** | Election Commission of India (ECI) | [`https://voters.eci.gov.in/`](https://voters.eci.gov.in/) | Constitutional Authority | 01 October 2026 |

---

## 🔍 Source Verification Registry & Metadata

Sahayak implements an explicit **Official Sources Registry** (`backend/knowledge/officialSources.js`) to establish trust, eliminate hallucinations, and provide complete auditability.

### Key Objectives of the Registry
1. **Fact Grounding:** Serves as the authoritative ground truth for system prompts, ensuring that Gemini responses cite verified facts, accepted forms, and accurate fee schedules.
2. **Citizen Transparency:** Every conversational response is linked with structured source metadata presented visually in the **Sources Panel** and inline within chat messages.
3. **Manual Audit Timestamps:** Every source record contains a `lastVerifiedDate` field reflecting the date on which government circulars, forms, and fees were last audited against gazette publications.

### Verified Claims Mapped in the Registry
- **PAN Card (Form 49A / Form 93):** Statutory fees for dispatch in India (₹101 paperless via Aadhaar e-KYC; ₹107 physical submission; ₹66–₹72 for digital e-PAN); Aadhaar OTP validity as proof of identity, address, and date of birth under Rule 114.
- **Ayushman Bharat PM-JAY:** Annual cashless coverage of ₹5,00,000 per family; non-restriction on family size or age; universal card creation for senior citizens aged 70+ under the Ayushman Vay Vandana Card expansion regardless of income.

---

## ⚠️ Handling Unavailable or Unverified Information

Government rules and portal URLs can change as ministries update their digital infrastructure. Sahayak manages uncertainty using the following rules:

1. **Refusal to Guess:** If a user query concerns edge cases not documented in the verified knowledge base (such as complex trust applications, non-resident alien procedures under Form 49AA, or special corporate entities), the assistant explicitly states that the specific scenario is not indexed and directs the user to the official government helpdesk.
2. **Explicit Verification Notice:** Every chat response carries an explicit verification disclaimer indicating the audit timeline (e.g., *"Grounded in official Government of India sources last manually verified in October 2026"*).
3. **Absence of Current-Date Fabrication:** The assistant never fabricates today's date as a verification timestamp; all audit dates correspond to actual manual audit records.

---

## 🛑 Scope of Supported Services & Boundary Enforcement

Sahayak is strictly engineered for specialized guidance on **PAN Card** and **Ayushman Bharat PM-JAY**. It intentionally rejects queries for unrelated government services to protect citizens from misleading advice.

```
+--------------------------------------------------------------------------+
|                     SUPPORTED SERVICE BOUNDARIES                         |
+--------------------------------------------------------------------------+
|  SUPPORTED SERVICES                                                      |
|  - PAN Card: New application (Form 93 / legacy Form 49A), correction, fees, e-KYC.   |
|  - Ayushman Bharat: Eligibility check, PM-JAY card download, 70+ senior   |
|    citizen enrollment, empanelled hospital procedures.                   |
+--------------------------------------------------------------------------+
|  OUT-OF-SCOPE / UNSUPPORTED SERVICES                                     |
|  - Voter ID (EPIC / Election Card)                                       |
|  - Driving Licence / Vahan / Sarathi services                             |
|  - Passport Seva                                                         |
|  - Ration Card issuance or state food distribution                       |
|  - Direct Tax filing or income tax assessment appeals                    |
+--------------------------------------------------------------------------+
```

### Boundary Enforcement Behaviour
When an out-of-scope service is requested across English, Hindi, or Telugu:
- **No Procedural Hallucination:** Sahayak never fabricates application steps or document lists for unsupported services.
- **Polite Scope Notice:** The assistant politely clarifies that guidance is currently available only for PAN Card and Ayushman Bharat PM-JAY.
- **Official Portal Redirection:** For Voter ID queries, Sahayak automatically attaches verified links to the Election Commission of India portal ([`voters.eci.gov.in`](https://voters.eci.gov.in/)).

---

## 🤖 Limitations of AI-Generated Content

While Sahayak utilizes Google Gemini (gemini-3.5-flash-lite) grounded in official sources, users and developers must understand the following technical limitations:

1. **Non-Deterministic Phrasing:** Although grounded in static source records, language models may phrase explanations differently across turns. Citizens must rely on official portal documentation for legal determinations.
2. **Context Window Expiry:** Conversational memory is maintained in an in-memory session store limited to 10 conversational turns. Long or interrupted conversations may lose context and require the user to state their topic again.
3. **Speech Translation Subtleties:** Technical legal terminology in English may occasionally produce colloquial variants in Hindi or Telugu. Sahayak uses simplified vernacular phrasing to maximize accessibility rather than formal legal dialect.

---

## ⚡ API Quotas, Availability & Offline Fallback Reliability

### 1. Quota & Availability Constraints
- The Google Gemini API operates under rate limits and service quotas.
- Public network latency or API provider maintenance can cause HTTP 429 (Quota Exhausted) or HTTP 503 (Service Unavailable) responses.

### 2. In-Process Deterministic Fallback Strategy
To guarantee resilience against cloud AI service interruptions:
- **Zero-Delay In-Process Fallback:** Calls to Gemini are protected by a 6,000ms timeout promise. If Gemini times out, returns an HTTP 429 (quota exhausted), or encounters an HTTP 503 (unavailable), Sahayak **immediately engages its in-process verified knowledge base**.
- **Scope of Fallback:** This mechanism protects against model outages, missing API keys, and rate limits without latency. It does NOT constitute a complete offline application, as initial web application delivery and browser Web Speech API transcription typically rely on standard client network connectivity.
- **No Unnecessary Retry Loops:** Quota-exhausted errors immediately bypass secondary API retries, avoiding interface freezes.
- **Full Multilingual Parity:** In-process fallback answers are grounded in pre-authored, verified facts in English, Hindi, and Telugu, preserving complete conversational functionality.

---

## 🎧 Browser & Hardware Dependencies (Speech Recognition & TTS)

### 1. Speech Recognition (Speech-to-Text)
- **Browser Engine:** Relies on the browser implementation of the W3C Web Speech API (`webkitSpeechRecognition` / `SpeechRecognition`).
- **Optimal Browsers:** Fully functional on **Google Chrome** and **Microsoft Edge** on desktop and Android. Browsers such as Mozilla Firefox or Apple Safari on iOS have limited or non-standard Web Speech API recognition support.
- **Microphone Permissions:** Requires explicit browser audio permissions and a functional microphone hardware device.
- **Acoustic Environment:** Accuracy depends on ambient noise levels and clear vocal articulation.

### 2. Speech Synthesis (Text-to-Speech)
- **Native Voice Availability:** Audio playback depends on the speech synthesis voices installed in the operating system or browser:
  - English (`en-IN`): Widely available across Windows, macOS, Android, and Linux.
  - Hindi (`hi-IN`): Supported natively in modern Windows 10/11, Edge, Chrome, and Android.
  - Telugu (`te-IN`): Native Telugu voices are pre-installed in modern Microsoft Edge (Natural voices) and Google Chrome. On devices lacking native Telugu TTS voices, Sahayak strictly refuses to play Telugu text with an English accent and displays an on-screen reading advisory instead.

---

## 📍 Service Centre Locator Coverage & Limitations

The Authorised Service Centre Finder (`/api/centres`) assists citizens in finding physical counters:

1. **Sample Directory Scope:** The backend directory contains a curated sample index of representative public facilitation counters and CSC Seva Kendras in select urban areas (such as Hyderabad, Secunderabad, Delhi, Mumbai, and Visakhapatnam). It is a functional demonstration and is not an exhaustive or officially certified nationwide census of all centres.
2. **Unindexed Regions & Authoritative Verification:** For PIN codes outside the sample dataset, Sahayak does not invent fake centres. It transparently reports zero local matches in the sample and displays direct links to the official nationwide Protean centre locator ([`tin-nsdl.com/tin-facilities.html`](https://www.tin-nsdl.com/tin-facilities.html)) and CSC portals for authoritative verification.
3. **GPS Accuracy:** Distance calculations use the Haversine formula based on straight-line spherical distance, which does not account for road traffic, winding routes, or travel transit time.

---

## 🔒 Privacy, Data Protection & Guardrails

Sahayak adheres to strict privacy-by-design standards:

1. **Zero Credential Collection:**
   - Sahayak does not request, collect, store, or transmit Aadhaar numbers, Permanent Account Numbers, OTPs, bank account numbers, UPI PINs, or passwords.
   - Text inputs containing sensitive tokens trigger advisory notices instructing users never to enter credentials into conversational interfaces.
2. **Ephemeral Sessions:**
   - Conversation sessions are tracked using randomly generated UUIDs stored in browser `sessionStorage`.
   - Backend session context is stored in volatile RAM and is completely purged after 1 hour of inactivity.
3. **Client-Side Preparation Persistence:**
   - Document checklist marks and journey tracker step completions are stored exclusively on the citizen's own device via browser `localStorage`. No personal checklist data is uploaded to backend databases.
4. **Rate Limiting Protection:**
   - The `/api/chat` route is rate-limited to 20 requests per minute per IP address to safeguard server resources and prevent automated scraping or denial-of-service attempts.

---

## 📜 Statutory Guidance-Only Disclaimer

> ### **CRITICAL STATUTORY NOTICE FOR CITIZENS & EVALUATORS**
>
> **Sahayak is an educational, guidance-only technology demonstration.**
>
> 1. **Non-Affiliation:** Sahayak is **not** an agency, subsidiary, or official representative of the Government of India, the Ministry of Finance, the Ministry of Health and Family Welfare, the Income Tax Department, the National Health Authority, Protean eGov Technologies Limited, or UTIITSL.
> 2. **No Executive Authority:** Sahayak does not process applications, submit forms, approve identity verifications, collect application fees, or issue PAN or Ayushman cards.
> 3. **Mandatory Official Submission:** All binding citizen transactions, identity authentications, document submissions, and statutory fee payments must be executed directly on official Government of India portals or at authorized physical government counters.
> 4. **No Legal Liability:** The creators and operators of Sahayak accept no liability for procedural delays, fee modifications enacted by statutory bodies after audit dates, or citizen application rejections occurring on government portals.
