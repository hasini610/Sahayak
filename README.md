# SAHAYAK (सहायक) 🇮🇳
### Multilingual Voice-First Digital Assistant for Public Services

Sahayak is a voice-first assistant designed to help Indian citizens navigate essential public service workflows in **English**, **Hindi (हिन्दी)**, and **Telugu (తెలుగు)** with simple language explanations, step-by-step procedures, interactive document checklists, and verified official sources.

---

## 📁 Project Structure

```
sahayak/
├── frontend/                     # Moksha's Frontend Ownership
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx               # Header, language selector, A+/A- text size, High-contrast
│   │   │   ├── LandingPage.jsx          # Intro screen, language cards, workflow badges, Start CTA
│   │   │   ├── AssistantInterface.jsx   # 2-column layout: chat, mic, fallback input, suggestions
│   │   │   ├── VoiceMicButton.jsx       # Voice states (listening/thinking/speaking/idle) + stop audio
│   │   │   ├── ConversationDisplay.jsx  # Bubbles, transcripts, timestamps, audio replay
│   │   │   ├── GuidedStepsUI.jsx        # Step stepper + interactive document checklist with progress
│   │   │   └── SourcesPanel.jsx         # Official .gov.in sources with safety disclaimers
│   │   ├── services/
│   │   │   └── api.js                   # Express API client + standalone fallback simulator
│   │   ├── translations/
│   │   │   └── content.js               # Multilingual translations (EN, HI, TE)
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── backend/                      # Express Backend
    ├── server.js                 # Express server with /api/health and /api/services
    └── package.json
```

---

## 🚀 Running the Project

### 1. Run the Frontend (Moksha's UI)
```bash
cd frontend
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Run the Backend
```bash
cd backend
npm run dev
# Server starts at http://localhost:5000
```

---

## 🎯 Completed Deliverables for Moksha (Frontend Lead)

1. **Project Setup**: Vite + React 18 + Tailwind CSS + Lucide icons.
2. **Landing Page**: Sahayak intro, multilingual cards (English, Hindi, Telugu), workflow highlights, and primary CTA.
3. **Assistant Interface**: 
   - Speech-to-text with Web Speech API (`SpeechRecognition`).
   - Voice synthesis (`SpeechSynthesis`) in native Indian accents.
   - Large animated microphone button with states: **Idle**, **Listening**, **Thinking**, **Speaking**.
   - Stop-audio controls and quick suggestions.
   - Text input fallback with keyboard shortcuts.
4. **Conversation Display**:
   - Distinct user & assistant message bubbles.
   - Live speech transcript & timestamps.
   - Audio replay button for any assistant message.
5. **Accessibility**:
   - `A-` / `A+` font size switcher (14px – 22px).
   - High-contrast mode toggle.
   - ARIA labels and keyboard accessibility throughout.
6. **Guided Steps & Checklist UI**:
   - Visual step-by-step progress guide.
   - Interactive document checklist with completion progress bar.
7. **Sources Panel**:
   - Official `.gov.in` clickable verified source links with security disclaimers.
8. **Minor Backend Task**:
   - Implemented `GET /api/health` and `GET /api/services` in Express.
   - Verified and tested with automated HTTP calls.
