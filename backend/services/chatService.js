import { getGeminiClient, GEMINI_MODEL } from './gemini.js';
import { VERIFIED_KNOWLEDGE } from '../knowledge/knowledgeBase.js';
import { formatSourcesForResponse, getSourcesForWorkflow } from '../knowledge/officialSources.js';
import {
  STEP_GUIDANCE_DATA,
  isExplicitStepGuidanceRequest,
  isStepConfirmation,
  isStepConfusionOrHelp,
  isStepExitRequest,
  formatStepResponse,
  formatCompletionResponse,
  formatExitResponse,
  formatStepCheckpoint
} from '../knowledge/interactiveGuidance.js';

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
    return 'वर्तमान में, सहायक केवल नया पैन कार्ड और आयुष्मान भारत (PM-JAY) स्वास्थ्य योजना के लिए सत्यापित आधिकारिक मार्गदर्शन प्रदान करता है। वोटर आईडी के लिए मार्गदर्शन अभी उपलब्ध नहीं है। आप भारत निर्वाचन आयोग के आधिकारिक पोर्टल voters.eci.gov.in पर जा सकते हैं। क्या आप पैन कार्ड या आयुष्मान भारत के बारे में जानकारी चाहते हैं?';
  }
  if (language === 'te') {
    return 'ప్రస్తుతం, సహాయక్ కేవలం పాన్ కార్డ్ దరఖాస్తు మరియు ఆయుష్మాన్ భారత్ (PM-JAY) ఉచిత వైద్య పథకం వివరాలను మాత్రమే అధికారికంగా అందిస్తుంది. ఓటర్ ఐడి మార్గదర్శకం ప్రస్తుతం అందుబాటులో లేదు. మీరు కేంద్ర ఎన్నికల సంఘం అధికారిక పోర్టల్ voters.eci.gov.in ని సందర్శించవచ్చు. మీరు పాన్ కార్డ్ లేదా ఆయుష్మాన్ భారత్ గురించి తెలుసుకోవాలనుకుంటున్నారా?';
  }
  return 'Currently, Sahayak only provides verified guidance for PAN Card and Ayushman Bharat PM-JAY. Guidance for Voter ID is not available at this moment. You can visit the official Election Commission of India portal at voters.eci.gov.in. Would you like assistance with PAN Card or Ayushman Bharat instead?';
}

/**
 * Builds the system instruction prompt grounding Gemini in verified government facts
 * and instructing it on tone, language, source attribution, and security guardrails.
 */
function buildSystemInstruction(language, workflow, retrievedSources = []) {
  const languageNames = {
    hi: 'Hindi (हिन्दी) in Devanagari script',
    te: 'Telugu (తెలుగు) in Telugu script',
    en: 'clear and natural Indian English'
  };

  const targetLang = languageNames[language] || languageNames.en;

  // Format retrieved official sources for prompt grounding
  const sourcesText = retrievedSources.length > 0
    ? retrievedSources.map((s, idx) => `SOURCE ${idx + 1}: ${s.title}
  Organisation: ${s.organisation}
  Official Portal: ${s.url}
  Last Manually Verified Date: ${s.lastVerifiedDate}
  Verified Claims:
  ${(s.claims || []).map((c) => `- ${c}`).join('\n  ')}`).join('\n\n')
    : 'No external verified sources required for general greetings.';

  return `You are Sahayak (सहायक), an official multilingual voice-first digital assistant for Indian public services.

CRITICAL OFFICIAL SOURCE VERIFICATION DIRECTIVE:
- Every factual claim you state MUST be grounded strictly in the verified source records provided below.
- Do NOT invent source URLs, facts, verification dates, or eligibility rules.
- If an answer is not supported by these official sources, state that clearly instead of guessing or fabricating an answer.
- Always explain the retrieved facts in simple language in ${targetLang}.
- Attribute rules to their official authorities (such as Income Tax Department, Protean eGov Technologies, or National Health Authority).

PRIMARY LANGUAGE DIRECTIVE:
- You MUST respond strictly in ${targetLang}.
- The response will be read aloud using browser Text-to-Speech (TTS). Write in a clean, natural conversational spoken style.
- Avoid markdown symbols like bold asterisks (**), hashtags (###), bullet points with hyphens, raw URLs, or tables in your spoken reply.
- Keep responses concise (typically 2 to 4 spoken sentences) so citizens can easily listen and understand.

RETRIEVED VERIFIED OFFICIAL SOURCES:
${sourcesText}

CRITICAL UNSUPPORTED SERVICE RULE:
- Sahayak ONLY supports PAN Card and Ayushman Bharat PM-JAY.
- If the user asks about ANY other government service (such as Voter ID, Election Card, Driving License, Passport, etc.), DO NOT provide instructions for PAN Card or Ayushman Bharat, and DO NOT invent rules or procedures. Politely state that guidance for that service is not currently available, direct them to the official portal (e.g. voters.eci.gov.in for Voter ID), and warmly offer help with PAN Card or Ayushman Bharat.

STRICT SAFETY GUARDRAILS:
- NEVER ask the user for Aadhaar numbers, OTPs, PINs, bank account numbers, passwords, or any sensitive credentials.
- NEVER claim to submit applications, make payments, or issue government certificates directly.`;
}

/**
 * Intelligent local fallback generator when Gemini API is completely unreachable.
 * Strictly uses verified government facts with real manually verified dates.
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
        ? 'ఆయుష్మాన్ భారత్ కార్డుతో మీ కుటుంబానికి ఏడాదికి 5 లక్షల రూపాయల వరకు ఉచిత ఆసుపత్రి చికిత్స లభిస్తుంది. ఆధార్ కార్డు, రేషన్ కార్డుతో దగ్గరలోని CSC సెంటర్‌కు వెళ్లండి.'
        : 'ఆయుష్మాన్ భారత్ (PM-JAY) పథకం ద్వారా అర్హులైన కుటుంబాలకు సంవత్సరానికి ₹5 లక్షల నగదు రహిత ఆరోగ్య బీమా లభిస్తుంది. beneficiary.nha.gov.in లో మీ అర్హత తనిఖీ చేసుకోవచ్చు.';
    }
    return isSimpler
      ? 'Ayushman Bharat gives your family up to ₹5 Lakh free hospital treatment every year. All you need is your Ration Card and Aadhaar at your nearest Common Service Centre (CSC).'
      : 'Under Ayushman Bharat (PM-JAY), eligible families receive cashless healthcare cover of up to ₹5,00,000 per year at empanelled public and private hospitals across India.';
  }

  // PAN Card Fallback
  if (language === 'hi') {
    return isSimpler
      ? 'नया पैन कार्ड बनवाना बहुत आसान है। Protean या UTIITSL वेबसाइट पर फॉर्म 49A भरें, आधार OTP से सत्यापन करें और 107 रुपये शुल्क दें। 10 से 15 दिनों में पैन कार्ड आपके पते पर आ जाएगा।'
      : 'नया पैन कार्ड (Form 49A) बनवाने के लिए आधिकारिक Protean या UTIITSL पोर्टल पर जाएं। आधार से e-KYC पेपरलेस है और भारतीय पते के लिए सरकारी शुल्क ₹107 है।';
  }
  if (language === 'te') {
    return isSimpler
      ? 'కొత్త పాన్ కార్డ్ తీసుకోవడం చాలా సులభం. అధికారిక వెబ్‌సైట్‌లో ఫారం 49A పూరించండి. ఆధార్ OTP ద్వారా e-KYC చేసి ₹107 రుసుము చెల్లించండి. 10-15 రోజుల్లో మీ ఇంటికి వస్తుంది.'
      : 'కొత్త పాన్ కార్డ్ (Form 49A) కోసం Protean లేదా UTIITSL పోర్టల్‌లో దరఖాస్తు చేయండి. ఆధార్ కార్డ్ గుర్తింపు మరియు చిరునామా రుజువుగా పనిచేస్తుంది. రుసుము ₹107.';
  }
  return isSimpler
    ? 'Getting a PAN card is simple. Go online to Protean or UTIITSL, fill Form 49A, verify with your Aadhaar OTP, and pay ₹107. Your physical PAN card will arrive in 10-15 business days.'
    : 'To apply for a new PAN card, fill Form 49A on the official Protean (NSDL) or UTIITSL website. Aadhaar is accepted as complete proof of identity, address, and date of birth. The fee is ₹107.';
}

/**
 * Main chat message processor.
 * 1. Manages conversational sessions and memory.
 * 2. Classifies intent accurately across EN, HI, and TE.
 * 3. Retrieves official verified government sources before generating response.
 * 4. Calls Gemini with verified knowledge grounding and fallbacks.
 * 5. Returns clean TTS-ready response, steps, checklists, and structured source records.
 */
export async function processChatMessage({ message, language = 'en', sessionId = 'default' }) {
  cleanupExpiredSessions();

  // Validate language
  const validLang = ['en', 'hi', 'te'].includes(language) ? language : 'en';

  // Get or initialize session
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, {
      history: [],
      lastWorkflow: null,
      guidanceState: null,
      lastActive: Date.now()
    });
  }
  const session = sessions.get(sessionId);
  session.lastActive = Date.now();

  // Detect intent and workflow
  const classification = detectIntentAndWorkflow(message, session.lastWorkflow);
  const workflow = classification.workflow;

  // Update session workflow tracking
  session.lastWorkflow = workflow;

  // Retrieve structured official sources for the workflow
  const verifiedSources = formatSourcesForResponse(workflow);

  // Verification notice citing real audit timeline
  const verificationNotice = workflow === 'general'
    ? 'Verified against statutory portals (voters.eci.gov.in) as of October 2026.'
    : `Grounded in official Government of India sources (${workflow === 'pan_card' ? 'Income Tax Dept / Protean / UTIITSL' : 'National Health Authority'}) last manually verified in October 2026.`;

  // Handle unsupported services (Voter ID, etc.)
  if (classification.isUnsupported) {
    if (session.guidanceState) {
      session.guidanceState = null;
    }
    const replyText = buildUnsupportedServiceResponse(classification.serviceType, validLang);

    session.history.push({ role: 'user', text: message });
    session.history.push({ role: 'model', text: replyText });
    if (session.history.length > MAX_HISTORY_TURNS) {
      session.history = session.history.slice(-MAX_HISTORY_TURNS);
    }

    const boundarySources = formatSourcesForResponse('voter_id');

    return {
      reply: replyText,
      language: validLang,
      workflow: 'general',
      steps: [],
      checklist: [],
      sources: boundarySources.length > 0 ? boundarySources : (VERIFIED_KNOWLEDGE.general?.voterPortals || []),
      verificationNotice: 'Boundary check: Guidance for this service is not supported. Directing to official constitutional portal.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }

  // 1. Check if user is currently in active interactive step guidance
  if (session.guidanceState?.active) {
    const guidance = session.guidanceState;
    const totalSteps = STEP_GUIDANCE_DATA[guidance.workflow]?.totalSteps || 6;

    // A. User requests to exit or stop step guidance
    if (isStepExitRequest(message)) {
      session.guidanceState = null;
      const replyText = formatExitResponse({ language: validLang });

      session.history.push({ role: 'user', text: message });
      session.history.push({ role: 'model', text: replyText });
      if (session.history.length > MAX_HISTORY_TURNS) {
        session.history = session.history.slice(-MAX_HISTORY_TURNS);
      }

      const kbData = VERIFIED_KNOWLEDGE[workflow] || VERIFIED_KNOWLEDGE.general || {};
      const localizedData = kbData[validLang] || kbData.en || {};

      return {
        reply: replyText,
        language: validLang,
        workflow,
        steps: localizedData.steps || [],
        checklist: localizedData.checklist || [],
        sources: verifiedSources,
        verificationNotice,
        guidanceState: { active: false },
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    }

    // B. User confirms completion of current step or requests next step
    if (isStepConfirmation(message)) {
      const nextStepIndex = guidance.stepIndex + 1;
      let replyText = '';

      if (nextStepIndex > totalSteps) {
        session.guidanceState = null;
        replyText = formatCompletionResponse({ workflow: guidance.workflow, language: validLang });
      } else {
        guidance.stepIndex = nextStepIndex;
        replyText = formatStepResponse({
          workflow: guidance.workflow,
          stepIndex: nextStepIndex,
          language: validLang,
          isInitial: false
        });
      }

      session.history.push({ role: 'user', text: message });
      session.history.push({ role: 'model', text: replyText });
      if (session.history.length > MAX_HISTORY_TURNS) {
        session.history = session.history.slice(-MAX_HISTORY_TURNS);
      }

      const kbData = VERIFIED_KNOWLEDGE[guidance.workflow] || {};
      const localizedData = kbData[validLang] || kbData.en || {};

      return {
        reply: replyText,
        language: validLang,
        workflow: guidance.workflow,
        steps: localizedData.steps || [],
        checklist: localizedData.checklist || [],
        sources: verifiedSources,
        verificationNotice,
        guidanceState: session.guidanceState
          ? { active: true, step: guidance.stepIndex, totalSteps }
          : { active: false },
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    }

    // C. User says they are confused or need a simpler explanation
    if (isStepConfusionOrHelp(message)) {
      const replyText = formatStepResponse({
        workflow: guidance.workflow,
        stepIndex: guidance.stepIndex,
        language: validLang,
        isInitial: false,
        isSimpler: true
      });

      session.history.push({ role: 'user', text: message });
      session.history.push({ role: 'model', text: replyText });
      if (session.history.length > MAX_HISTORY_TURNS) {
        session.history = session.history.slice(-MAX_HISTORY_TURNS);
      }

      const kbData = VERIFIED_KNOWLEDGE[guidance.workflow] || {};
      const localizedData = kbData[validLang] || kbData.en || {};

      return {
        reply: replyText,
        language: validLang,
        workflow: guidance.workflow,
        steps: localizedData.steps || [],
        checklist: localizedData.checklist || [],
        sources: verifiedSources,
        verificationNotice,
        guidanceState: { active: true, step: guidance.stepIndex, totalSteps },
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    }

    // D. Mid-step question: Will be processed below without advancing stepIndex,
    // and a checkpoint prompt will be appended.
  }

  // 2. Check if user is initiating a new step-by-step guidance request
  if (isExplicitStepGuidanceRequest(message)) {
    const targetWorkflow = (workflow === 'ayushman_bharat') ? 'ayushman_bharat' : 'pan_card';
    session.guidanceState = {
      active: true,
      workflow: targetWorkflow,
      stepIndex: 1
    };
    session.lastWorkflow = targetWorkflow;

    const replyText = formatStepResponse({
      workflow: targetWorkflow,
      stepIndex: 1,
      language: validLang,
      isInitial: true
    });

    session.history.push({ role: 'user', text: message });
    session.history.push({ role: 'model', text: replyText });
    if (session.history.length > MAX_HISTORY_TURNS) {
      session.history = session.history.slice(-MAX_HISTORY_TURNS);
    }

    const kbData = VERIFIED_KNOWLEDGE[targetWorkflow] || {};
    const localizedData = kbData[validLang] || kbData.en || {};
    const totalSteps = STEP_GUIDANCE_DATA[targetWorkflow]?.totalSteps || 6;

    return {
      reply: replyText,
      language: validLang,
      workflow: targetWorkflow,
      steps: localizedData.steps || [],
      checklist: localizedData.checklist || [],
      sources: formatSourcesForResponse(targetWorkflow),
      verificationNotice,
      guidanceState: { active: true, step: 1, totalSteps },
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }

  // Build prompt instruction with retrieved official sources
  const systemInstruction = buildSystemInstruction(validLang, workflow, verifiedSources);

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

  // If user was in active guidance and asked a specific question, append the step checkpoint
  if (session.guidanceState?.active) {
    const checkpoint = formatStepCheckpoint({
      workflow: session.guidanceState.workflow,
      stepIndex: session.guidanceState.stepIndex,
      language: validLang
    });
    replyText += checkpoint;
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

  // Retrieve steps and checklist from verified knowledge base
  const kbData = VERIFIED_KNOWLEDGE[workflow] || VERIFIED_KNOWLEDGE.general || {};
  const localizedData = kbData[validLang] || kbData.en || {};

  const steps = localizedData.steps || [];
  const checklist = localizedData.checklist || [];

  return {
    reply: replyText,
    language: validLang,
    workflow,
    steps,
    checklist,
    sources: verifiedSources,
    verificationNotice,
    guidanceState: session.guidanceState
      ? {
          active: session.guidanceState.active,
          step: session.guidanceState.stepIndex,
          totalSteps: STEP_GUIDANCE_DATA[session.guidanceState.workflow]?.totalSteps || 6
        }
      : { active: false },
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
}
