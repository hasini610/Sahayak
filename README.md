# SAHAYAK (सहायक) 🇮🇳
### Multilingual Voice Assistant for Indian Public Services

[![Node.js](https://img.shields.io/badge/Node.js-18.x%20%7C%2020.x%20%7C%2024.x-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-amber.svg)](LICENSE)

**Sahayak** is an accessible, voice-first digital assistant engineered to guide Indian citizens through essential government service workflows in **English**, **Hindi (हिन्दी)**, and **Telugu (తెలుగు)**. Built with high-contrast accessibility, real-time speech recognition, responsive step-by-step guidance, smart document readiness checklists, and grounded statutory government sources, Sahayak empowers citizens to navigate public services with clarity, dignity, and independence.

---

## 📑 Table of Contents

- [The Problem Sahayak Solves](#-the-problem-sahayak-solves)
- [Proposed Solution & Target Users](#-proposed-solution--target-users)
- [Key Features](#-key-features)
- [Supported Services & Languages](#-supported-services--languages)
- [Technology Stack](#-technology-stack)
- [System Requirements & Prerequisites](#-system-requirements--prerequisites)
- [Installation & Local Execution](#-installation--local-execution)
- [Environment Configuration](#-environment-configuration)
- [Project Directory Structure](#-project-directory-structure)
- [API Endpoints Reference](#-api-endpoints-reference)
- [Documentation Suite](#-documentation-suite)
- [Guidance-Only Statutory Disclaimer](#-guidance-only-statutory-disclaimer)

---

## 🔍 The Problem Sahayak Solves

Navigating Indian public service portals can be an intimidating and confusing experience for millions of citizens due to:

1. **Linguistic Barriers:** Most government portals and application manuals are published primarily in English or formal administrative Hindi, creating significant hurdles for vernacular speakers.
2. **Procedural Complexity:** Applications such as PAN Card issuance or Ayushman Bharat PM-JAY health coverage involve multiple pathways (e.g., Aadhaar paperless e-KYC vs. physical document submission vs. senior citizen 70+ expansions) with differing fees, requirements, and portal entry points.
3. **Information Fragmentation & Misinformation:** Citizens often encounter outdated advice, unofficial intermediary aggregators, or predatory commercial agencies charging high fees for free or low-cost statutory services.
4. **Digital Divide & Accessibility Hurdles:** Traditional web forms require keyboard proficiency and visual acuity, excluding elderly individuals, visually impaired users, or citizens with limited digital literacy.

---

## 💡 Proposed Solution & Target Users

Sahayak provides an empathetic, voice-first digital concierge that converts bureaucratic processes into natural spoken dialogue:

- **Conversational Guidance:** Citizens speak naturally in their mother tongue; Sahayak transcribes their request, processes their intent, and speaks back clear, concise instructions.
- **Interactive Step-by-Step Walkthrough:** Rather than overwhelming the user with a lengthy wall of text, Sahayak guides users one actionable step at a time, answering intermediate questions and verifying completion before advancing.
- **Grounded Verification:** Every procedure, fee, and requirement is anchored directly to verified Government of India portals (Income Tax Department, Protean, UTIITSL, National Health Authority).
- **Target Users:** First-time applicants, rural and semi-urban citizens, senior citizens aged 70+, vernacular language speakers, and users accessing digital governance via mobile devices.

---

## ✨ Key Features

### 🎙️ 1. Multilingual Voice Interaction
- **Speech-to-Text (STT):** Integrates browser Web Speech API configured for Indian locales (`en-IN`, `hi-IN`, `te-IN`).
- **Hands-Free Auto-Submission:** Automatically submits queries upon completion of speech with an atomic single-submission lock to prevent duplicate API calls.
- **Natural Text-to-Speech (TTS):** Speaks responses using native browser synthesis voices. Refuses mismatched foreign accents (e.g., will never play an English TTS voice for Hindi or Telugu).
- **Text Fallback:** Manual typing input with instant submission for noisy environments or devices without microphone permissions.

### 🚶 2. Interactive Step-by-Step Guidance
- **One-Step-At-A-Time Flow:** Breaks complex procedures into individual actionable steps.
- **Checkpoint Confirmation:** Asks users whether they have completed the current step before advancing.
- **Mid-Workflow Clarifications:** Answers ad-hoc questions (e.g., *"What documents do I need?"* or *"What is the fee?"*) without losing the current step or resetting progress.
- **Adaptive Explanation:** Explains steps in simpler language if the user expresses confusion or asks for plain language.

### 📋 3. Smart Document Checklist
- **Real-Time Readiness Tracking:** Interactive document checklists tailored specifically to PAN Card and Ayushman Bharat PM-JAY.
- **Clear Status Badges:** Highlights whether a document is `Required`, `Conditional`, or `Depends on application method` based on Rule 114 and PM-JAY guidelines.
- **Client-Side Persistence:** Checklists persist across browser reloads via `localStorage` with separate progress tracking for each service.
- **Privacy Guardrail:** Educational checklist only; strictly prohibits the upload or entry of Aadhaar numbers, OTPs, or identity scans.

### 🗺️ 4. Application Journey Tracker
- **Visual Progress Pipeline:** Step indicator displaying completed, in-progress, and upcoming milestones.
- **Mode-Dependent Fee Qualifications:** Clarifies accurate statutory fees (e.g., ₹101 paperless vs. ₹107 physical PAN delivery) rather than presenting a single universal number.
- **Senior Citizen 70+ Differentiation:** Explicitly guides users on the universal Ayushman Vay Vandana Card pathway for individuals aged 70 and above, distinct from SECC 2011/NFSA family limits.

### 📍 5. Authorised Service Centre Finder
- **Nearby Centre Locator:** Curated sample directory of public Protean TIN-Facilitation Centres and Common Service Centres (CSC Seva Kendras), with direct links to official locator portals for complete nationwide verification.
- **Search Modes:** Filter by 6-digit postal PIN code, city name, or browser GPS geolocation with automatic Haversine distance calculations.
- **Statutory Fallbacks:** Direct links to official government portal locators when querying unindexed regions.

### 🛡️ 6. Official Sources & Boundary Enforcement
- **Verified Source Citations:** Every workflow displays authoritative links to official `.gov.in` and statutory provider portals with manual verification audit dates.
- **Unsupported Service Safeguard:** If a user requests an unsupported public service (e.g., Voter ID, Driving Licence, Passport), Sahayak politely clarifies its current scope and directs the user to the official constitutional portal (e.g., `voters.eci.gov.in`).

### ♿ 7. Inclusive Accessibility
- **Font Sizing Controls:** Adjustable text scaling (`A-` / `A+`) ranging from 14px to 22px.
- **High-Contrast Mode:** High-contrast toggle ensuring readability under bright sunlight or for users with visual impairments.
- **Non-Intrusive Layout:** Clean two-column layout with container-scoped scrolling to eliminate jarring full-page jumps during voice recording.

---

## 🌐 Supported Services & Languages

| Service Workflow | Primary Authority | Application Forms / Schemes | Supported Languages |
| :--- | :--- | :--- | :--- |
| **PAN Card** | Income Tax Dept / Protean / UTIITSL | Form 93 (New simplified PAN application, replacing legacy Form 49A) | English, हिन्दी, తెలుగు |
| **Ayushman Bharat** | National Health Authority (NHA) | PM-JAY Cashless Health Cover & 70+ Ayushman Vay Vandana | English, हिन्दी, తెలుగు |
| **Voter ID (Boundary)** | Election Commission of India (ECI) | Statutory redirection to `voters.eci.gov.in` | English, हिन्दी, తెలుగు |

---

## 🛠️ Technology Stack

### **Frontend**
- **Framework:** React 18.3 (Single Page Application)
- **Build Tool:** Vite 5.4 with `@vitejs/plugin-react`
- **Styling:** Tailwind CSS 3.4 with custom saffron-and-slate Indian public governance palette
- **Iconography:** Lucide React
- **Voice APIs:** Browser Web Speech API (`webkitSpeechRecognition` / `SpeechRecognition`, `speechSynthesis`)
- **State & Storage:** React Hooks (`useState`, `useEffect`, `useRef`), Browser `localStorage` (Checklist & Tracker), Browser `sessionStorage` (Tab-Isolated UUIDs)

### **Backend**
- **Runtime:** Node.js (ES Modules)
- **Web Framework:** Express 4.21
- **AI Integration:** Google Gen AI SDK (`@google/genai` v2.32) utilizing `gemini-3.5-flash-lite`
- **Security & Reliability:** `express-rate-limit` (20 requests/min per IP), CORS
- **Configuration:** `dotenv`

---

## 💻 System Requirements & Prerequisites

- **Operating System:** Windows 10/11, macOS 12+, or modern Linux distribution
- **Node.js:** v18.0.0 or higher (tested up to Node v24.x)
- **npm:** v9.0.0 or higher
- **Web Browser:** Google Chrome 90+ or Microsoft Edge 90+ (recommended for complete Web Speech API recognition and native Indian voice synthesis support)
- **Network Access:** Required for cloud Gemini API calls and initial client asset loading. When Gemini API quota is exhausted or unreachable, an in-process local fallback handles queries without external AI calls (browser speech recognition may still depend on browser vendor network services).

---

## 🚀 Installation & Local Execution

### 1. Clone the Repository
```bash
git clone https://github.com/hasini610/Sahayak.git
cd Sahayak
```

### 2. Configure the Backend Environment
Navigate into the `backend/` directory and configure your environment file:
```bash
cd backend
cp .env.example .env
```
Open `backend/.env` in your text editor and add your Google Gemini API key:
```env
PORT=5000
GEMINI_API_KEY=your_actual_gemini_api_key_here
```
> *(Note: If you do not have a Gemini API key or exceed quota limits, Sahayak's verified local knowledge fallback automatically responds without interruption).*

### 3. Install Dependencies

**Install Backend Dependencies:**
```bash
cd backend
npm install
```

**Install Frontend Dependencies:**
```bash
cd ../frontend
npm install
```

### 4. Run the Development Servers

**Start Backend Server:**
```bash
cd backend
npm run dev
```
*The Express backend starts at `http://localhost:5000` with live reload.*

**Start Frontend Development Server:**
In a separate terminal:
```bash
cd frontend
npm run dev
```
*The Vite development server runs at `http://localhost:3000` and automatically proxies `/api` calls to `http://localhost:5000`.*

Open **[http://localhost:3000](http://localhost:3000)** in Google Chrome or Microsoft Edge to use Sahayak.

---

## ⚙️ Environment Configuration

| Variable | Location | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `PORT` | `backend/.env` | No | `5000` | Port on which the Express API server listens |
| `GEMINI_API_KEY` | `backend/.env` | Optional | *None* | Google Gemini API Key from Google AI Studio. If omitted or quota-limited, local fallback activates. |
