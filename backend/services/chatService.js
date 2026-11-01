import { getGeminiClient, GEMINI_MODEL } from './gemini.js';
import { VERIFIED_KNOWLEDGE } from '../knowledge/knowledgeBase.js';

// In-memory conversation session store
// Format: sessionId -> { history: [{ role: 'user'|'model', text: string }], lastWorkflow: string, lastActive: number }
const sessions = new Map();
const MAX_HISTORY_TURNS = 10;
const MAX_SESSIONS = 200;
const SESSION_TTL_MS = 60 * 60 * 1000; // 1 hour

/**
 * Wraps an async call with a timeout promise to protect against hanging network requests.
 */
function callWithTimeout(promise, timeoutMs = 6000) {
  let timer;
  const timeoutPromise = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`Model request timed out after ${timeoutMs}ms`)), timeoutMs);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timer));
}

/**
 * Periodically purge inactive sessions to prevent memory leaks.
 */
function cleanupExpiredSessions() {
  const now = Date.now();
  for (const [sessionId, session] of sessions.entries()) {
    if (now - session.lastActive > SESSION_TTL_MS) {
      sessions.delete(sessionId);
    }
  }
  if (sessions.size > MAX_SESSIONS) {
    const sorted = [...sessions.entries()].sort((a, b) => a[1].lastActive - b[1].lastActive);
    const toRemove = sorted.slice(0, sessions.size - MAX_SESSIONS);
    for (const [id] of toRemove) {
      sessions.delete(id);
    }
  }
}

/**
 * Accurate intent & workflow classifier supporting English, Hindi, and Telugu.
 * Distinguishes supported workflows (PAN, Ayushman), unsupported services (Voter ID, etc.),
 * and natural context follow-ups.
 */
export function detectIntentAndWorkflow(message, previousWorkflow = null) {
  const lower = message.toLowerCase();

  // 1. Check for Voter ID & unsupported service keywords across EN, HI, TE
  const isVoter =
    lower.includes('voter') ||
    lower.includes('voting') ||
    lower.includes('epic') ||
    lower.includes('election card') ||
    lower.includes('वोटर') ||
    lower.includes('मतदाता') ||
    lower.includes('चुनाव') ||
    lower.includes('ఓటర్') ||
    lower.includes('ఓటరు') ||
    lower.includes('ఎన్నికల') ||
    lower.includes('ఓటు');

  const isOtherUnsupported =
    lower.includes('driving license') ||
    lower.includes('driving licence') ||
    lower.includes('passport') ||
    lower.includes('ड्राइविंग') ||
    lower.includes('पासपोर्ट') ||
    lower.includes('డ్రైవింగ్') ||
    lower.includes('పాస్‌పోర్ట్');

  if (isVoter || isOtherUnsupported) {
    return {
      workflow: 'general',
      isUnsupported: true,
      serviceType: isVoter ? 'voter_id' : 'other_unsupported'
    };
  }

  // 2. Check for PAN Card keywords
  const isPan =
    lower.includes('pan') ||
    lower.includes('49a') ||
    lower.includes('nsdl') ||
    lower.includes('protean') ||
    lower.includes('utiitsl') ||
    lower.includes('income tax') ||
    lower.includes('पैन') ||
    lower.includes('పాన్');

  // 3. Check for Ayushman Bharat keywords
  const isAyushman =
    lower.includes('ayushman') ||
    lower.includes('pmjay') ||
    lower.includes('pm-jay') ||
    lower.includes('pm jay') ||
    lower.includes('health card') ||
    lower.includes('5 lakh') ||
    lower.includes('5,00,000') ||
    lower.includes('golden card') ||
    lower.includes('hospital') ||
    lower.includes('treatment') ||
    lower.includes('nha') ||
    lower.includes('abha') ||
    lower.includes('beneficiary') ||
    lower.includes('आयुष्मान') ||
    lower.includes('5 लाख') ||
    lower.includes('ఆయుష్మాన్') ||
    lower.includes('5 లక్ష');

  // If user explicitly mentions PAN Card
  if (isPan && !isAyushman) {
    return { workflow: 'pan_card', isUnsupported: false };
  }

  // If user explicitly mentions Ayushman Bharat
  if (isAyushman && !isPan) {
    return { workflow: 'ayushman_bharat', isUnsupported: false };
  }

  // 4. Contextual follow-up question evaluation (only valid if previous was a supported workflow)
  if (previousWorkflow && (previousWorkflow === 'pan_card' || previousWorkflow === 'ayushman_bharat')) {
    const isFollowUp =
      lower.includes('document') ||
      lower.includes('fee') ||
      lower.includes('cost') ||
      lower.includes('price') ||
      lower.includes('how') ||
      lower.includes('simple') ||
      lower.includes('eligib') ||
      lower.includes('step') ||
      lower.includes('next') ||
      lower.includes('apply') ||
      lower.includes('process') ||
      lower.includes('procedure') ||
      lower.includes('time') ||
      lower.includes('days') ||
      lower.includes('proof') ||
      lower.includes('online') ||
      lower.includes('दस्तावेज़') ||
      lower.includes('दस्तावेज') ||
      lower.includes('कागजात') ||
      lower.includes('शुल्क') ||
      lower.includes('फीस') ||
      lower.includes('खर्चा') ||
      lower.includes('सरल') ||
      lower.includes('आसान') ||
      lower.includes('पात्रता') ||
      lower.includes('प्रक्रिया') ||
      lower.includes('अगला') ||
      lower.includes('पैसे') ||
      lower.includes('పత్రాలు') ||
      lower.includes('డాక్యుమెంట్లు') ||
      lower.includes('ఫీజు') ||
      lower.includes('ఖర్చు') ||
      lower.includes('సులభం') ||
      lower.includes('అర్హత') ||
      lower.includes('దరఖాస్తు') ||
      lower.includes('విధానం') ||
      lower.includes('తదుపరి') ||
      lower.includes('ఎలా') ||
      lower.includes('ఎన్ని రోజులు');

    if (isFollowUp) {
      return { workflow: previousWorkflow, isUnsupported: false, isFollowUp: true };
    }
  }

  // 5. Default general intent
  return { workflow: 'general', isUnsupported: false };
}

/**
 * Builds polite, grounded response for unsupported services (like Voter ID).
 * Never hallucinates procedures and offers help with currently supported services.
 */
function buildUnsupportedServiceResponse(serviceType, language) {
  if (language === 'hi') {
    return 'वर्तमान में, सहायक केवल नया पैन कार्ड (फॉर्म 49A) और आयुष्मान भारत (PM-JAY) स्वास्थ्य योजना के लिए चरण-दर-चरण मार्गदर्शन प्रदान करता है। वोटर आईडी के लिए मार्गदर्शन अभी उपलब्ध नहीं है। आप भारत निर्वाचन आयोग के आधिकारिक पोर्टल voters.eci.gov.in पर जा सकते हैं। क्या आप पैन कार्ड या आयुष्मान भारत के बारे में जानकारी चाहते हैं?';
  }
  if (language === 'te') {
    return 'ప్రస్తుతం, సహాయక్ కేవలం పాన్ కార్డ్ దరఖాస్తు (ఫారం 49A) మరియు ఆయుష్మాన్ భారత్ (PM-JAY) ఉచిత వైద్య పథకం వివరాలను మాత్రమే అందిస్తుంది. ఓటర్ ఐడి మార్గదర్శకం ప్రస్తుతం అందుబాటులో లేదు. మీరు కేంద్ర ఎన్నికల సంఘం అధికారిక పోర్టల్ voters.eci.gov.in ని సందర్శించవచ్చు. మీరు పాన్ కార్డ్ లేదా ఆయుష్మాన్ భారత్ గురించి తెలుసుకోవాలనుకుంటున్నారా?';
  }
  return 'Currently, Sahayak only provides guidance for PAN Card and Ayushman Bharat PM-JAY. Guidance for Voter ID is not available at this moment. You can visit the official Election Commission of India portal at voters.eci.gov.in. Would you like assistance with PAN Card or Ayushman Bharat instead?';
}


/**
 * Builds the system instruction prompt grounding Gemini in verified government facts
 * and instructing it on tone, language, and security guardrails.
 */
function buildSystemInstruction(language, workflow) {
  const languageNames = {
    hi: 'Hindi (हिन्दी) in Devanagari script',
    te: 'Telugu (తెలుగు) in Telugu script',
    en: 'clear and natural Indian English'
  };

  const targetLang = languageNames[language] || languageNames.en;

  return `You are Sahayak (सहायक), a voice-first multilingual digital assistant built for Indian citizens. Your mission is to provide accurate, step-by-step guidance on public government services with dignity, warmth, and clarity.

PRIMARY LANGUAGE DIRECTIVE:
- You MUST respond strictly in ${targetLang}.
- The response will be read aloud using browser Text-to-Speech (TTS). Write in a clean, natural conversational spoken style.
- Avoid markdown symbols like bold asterisks (**), hashtags (###), bullet points with hyphens, raw URLs, or tables in your spoken reply.
- Keep responses concise (typically 2 to 4 spoken sentences) so citizens can easily listen and understand.

CURRENTLY SUPPORTED SERVICES ONLY:
1. PAN Card:
   - Form 49A is for Indian citizens; Form 49AA is for foreign citizens.
   - Official portals: Protean eGov (formerly NSDL) and UTIITSL.
   - Government fee: ₹107 (incl. GST) for physical card delivered within India; ₹72 for digital e-PAN.
   - Completely paperless Aadhaar e-KYC is available using Aadhaar OTP on the registered mobile number.
   - e-PAN is delivered within 24-48 hours; physical PAN card arrives in 10-15 business days.
   - Proof required: Aadhaar card serves as complete proof of identity, address, and date of birth.

2. Ayushman Bharat (PM-JAY):
   - Benefit: Up to ₹5,00,000 (5 Lakh Rupees) per family per year for free, cashless hospitalization at empanelled public and private hospitals.
   - Eligibility: Based on SECC 2011 census database or state food security (Ration Card / NFSA). All senior citizens aged 70+ years are also eligible regardless of income.
   - Portals: beneficiary.nha.gov.in (to check eligibility and download Ayushman card) and hospitals.pmjay.gov.in (to locate hospitals).
   - Application/Card: Free at Common Service Centres (CSC) or beneficiary portal with Aadhaar e-KYC.

CRITICAL UNSUPPORTED SERVICE RULE:
- Sahayak ONLY supports PAN Card and Ayushman Bharat PM-JAY.
- If the user asks about ANY other government service (such as Voter ID, Election Card, Driving License, Passport, etc.), DO NOT provide instructions for PAN Card or Ayushman Bharat, and DO NOT invent rules or procedures. Politely state that guidance for that service is not currently available, direct them to the official portal (e.g. voters.eci.gov.in for Voter ID), and warmly offer help with PAN Card or Ayushman Bharat.

STRICT SAFETY GUARDRAILS:
- NEVER ask the user for Aadhaar numbers, OTPs, PINs, bank account numbers, passwords, or any sensitive credentials.
- NEVER claim to submit applications, make payments, or issue government certificates directly.`;
}

/**
 * Intelligent local fallback generator when Gemini API is completely unreachable.
 */
export function generateLocalFallback(message, language, workflow) {
  const isSimpler =
    message.toLowerCase().includes('simple') ||
    message.toLowerCase().includes('सरल') ||
    message.toLowerCase().includes('आसान') ||
    message.toLowerCase().includes('సులభం');

  if (workflow === 'ayushman_bharat') {
    if (language === 'hi') {
      return isSimpler
        ? 'आयुष्मान भारत कार्ड से हर पात्र परिवार को अस्पताल में 5 लाख रुपये तक का मुफ़्त इलाज मिलता है। आप आधार कार्ड और राशन कार्ड लेकर नज़दीकी जन सेवा केंद्र (CSC) जाएं।'
        : 'आयुष्मान भारत (PM-JAY) योजना के तहत पात्र परिवारों को प्रति वर्ष ₹5 लाख का कैशलेस स्वास्थ्य बीमा मिलता है। आप beneficiary.nha.gov.in पर जाकर अपनी पात्रता जांच सकते हैं।';
    }
    if (language === 'te') {
      return isSimpler
        ? 'ఆయుష్మాన్ భారత్ కార్డు ద్వారా మీ కుటుంబానికి ఏడాదికి 5 లక్షల వరకు ఉచిత ఆసుపత్రి చికిత్స లభిస్తుంది. ఆధార్, రేషన్ కార్డుతో దగ్గరి CSC కేంద్రానికి వెళ్లండి.'
        : 'ఆయుష్మాన్ భారత్ (PM-JAY) పథకం ద్వారా సంవత్సరానికి ₹5 లక్షల నగదు రహిత ఆరోగ్య బీమా లభిస్తుంది. beneficiary.nha.gov.in లో అర్హత తనిఖీ చేసుకోవచ్చు.';
    }
    return isSimpler
      ? 'Ayushman Bharat provides your family up to ₹5 Lakh in free hospital treatment every year. Take your Ration Card and Aadhaar to your nearest Common Service Centre (CSC).'
      : 'Under Ayushman Bharat (PM-JAY), eligible families receive cashless healthcare cover of up to ₹5,00,000 per year at empanelled public and private hospitals across India.';
  }

  if (workflow === 'pan_card') {
    if (language === 'hi') {
      return isSimpler
        ? 'नया पैन कार्ड बनवाना बहुत आसान है। Protean पोर्टल पर फॉर्म 49A भरें, आधार OTP से सत्यापन करें और 107 रुपये शुल्क दें। कार्ड 10 से 15 दिनों में घर आ जाएगा।'
        : 'नया पैन कार्ड (Form 49A) बनवाने के लिए आधिकारिक Protean या UTIITSL पोर्टल पर जाएं। पहचान और पते के लिए आधार कार्ड पर्याप्त है। सरकारी शुल्क ₹107 है।';
    }
    if (language === 'te') {
      return isSimpler
        ? 'కొత్త పాన్ కార్డ్ తీసుకోవడం చాలా సులభం. అధికారిక వెబ్‌సైట్‌లో ఫారం 49A పూరించి, ఆధార్ OTP ధృవీకరించి ₹107 చెల్లించండి. 10-15 రోజుల్లో కార్డు వస్తుంది.'
        : 'కొత్త పాన్ కార్డ్ (Form 49A) కోసం Protean లేదా UTIITSL పోర్టల్‌లో దరఖాస్తు చేయండి. ఆధార్ కార్డ్ గుర్తింపు రుజువుగా పనిచేస్తుంది. ప్రభుత్వ రుసుము ₹107.';
    }
    return isSimpler
      ? 'Getting a PAN card is simple. Fill Form 49A online on the Protean portal, verify with your Aadhaar OTP, and pay ₹107. Your card will arrive in 10-15 business days.'
      : 'To apply for a new PAN card, fill Form 49A on the official Protean (NSDL) or UTIITSL portal. Aadhaar serves as complete proof. The government fee is ₹107.';
  }

  // General fallback
  if (language === 'hi') {
    return 'नमस्ते! मैं सहायक हूँ। मैं आपको नया पैन कार्ड बनवाने और आयुष्मान भारत स्वास्थ्य योजना की पूरी जानकारी दे सकता हूँ। आप क्या जानना चाहते हैं?';
  }
  if (language === 'te') {
    return 'నమస్కారం! నేను సహాయక్. పాన్ కార్డ్ దరఖాస్తు మరియు ఆయుష్మాన్ భారత్ ఆరోగ్య పథకం వివరాల్లో మీకు సహాయం చేస్తాను. మీరు ఏమి తెలుసుకోవాలనుకుంటున్నారు?';
  }
  return 'Namaste! I am Sahayak. I can guide you through applying for a new PAN Card or understanding Ayushman Bharat healthcare benefits. How can I help you?';
}

/**
 * Handles incoming chat messages, manages session history, queries Gemini,
 * and formats the response matching the frontend contract.
 */
export async function processChatMessage({ message, language = 'en', sessionId = 'session_1' }) {
  cleanupExpiredSessions();

  // Normalize language (default 'en' if invalid)
  const validLang = ['en', 'hi', 'te'].includes(language) ? language : 'en';

  // Retrieve or create session
  let session = sessions.get(sessionId);
  if (!session) {
    session = {
      history: [],
      lastWorkflow: 'general',
      lastActive: Date.now()
    };
    sessions.set(sessionId, session);
  }
  session.lastActive = Date.now();

  // Detect intent and workflow accurately
  const classification = detectIntentAndWorkflow(message, session.lastWorkflow);
  const workflow = classification.workflow;
  session.lastWorkflow = workflow;

  // Handle Unsupported Services (e.g. Voter ID, Driving License)
  if (classification.isUnsupported) {
    const replyText = buildUnsupportedServiceResponse(classification.serviceType, validLang);

    session.history.push({ role: 'user', text: message });
    session.history.push({ role: 'model', text: replyText });
    if (session.history.length > MAX_HISTORY_TURNS) {
      session.history = session.history.slice(-MAX_HISTORY_TURNS);
    }

    const sources = classification.serviceType === 'voter_id'
      ? VERIFIED_KNOWLEDGE.general.voterPortals
      : VERIFIED_KNOWLEDGE.general.officialPortals;

    return {
      reply: replyText,
      language: validLang,
      workflow: 'general',
      steps: [],
      checklist: [],
      sources,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }

  // Build prompt instruction
  const systemInstruction = buildSystemInstruction(validLang, workflow);

  // Prepare Gemini content turns
  const contents = [
    ...session.history.map((turn) => ({
      role: turn.role,
      parts: [{ text: turn.text }]
    })),
    {
      role: 'user',
      parts: [{ text: message }]
    }
  ];

  let replyText = '';

  try {
    const ai = getGeminiClient();

    const response = await callWithTimeout(
      ai.models.generateContent({
        model: GEMINI_MODEL,
        contents,
        config: { systemInstruction }
      }),
      6000
    );
    replyText = response.text?.trim() || '';
  } catch (err) {
    const isQuotaOrUnavailable =
      err?.status === 429 ||
      err?.status === 503 ||
      err?.message?.includes('429') ||
      err?.message?.includes('503') ||
      err?.message?.includes('quota') ||
      err?.message?.includes('RESOURCE_EXHAUSTED') ||
      err?.message?.includes('UNAVAILABLE');

    if (isQuotaOrUnavailable) {
      console.warn(`Gemini quota/availability notice (${err.status || err.message}), immediately utilizing verified local fallback.`);
    } else {
      console.warn('Gemini chat error, utilizing verified knowledge fallback:', err.message);
    }
    replyText = generateLocalFallback(message, validLang, workflow);
  }

  // Ensure replyText is clean for TTS
  replyText = replyText
    .replace(/[*#_~`]/g, '')
    .replace(/\n\s*\n/g, ' ')
    .trim();

  // Update session history
  session.history.push({ role: 'user', text: message });
  session.history.push({ role: 'model', text: replyText });
  if (session.history.length > MAX_HISTORY_TURNS) {
    session.history = session.history.slice(-MAX_HISTORY_TURNS);
  }

  // Retrieve steps, checklist and sources from verified knowledge base
  const kbData = VERIFIED_KNOWLEDGE[workflow] || VERIFIED_KNOWLEDGE.general;
  const localizedData = kbData[validLang] || kbData.en || {};

  const steps = localizedData.steps || [];
  const checklist = localizedData.checklist || [];
  const sources = kbData.officialPortals || [];

  return {
    reply: replyText,
    language: validLang,
    workflow,
    steps,
    checklist,
    sources,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
}
