/**
 * Sahayak Speech Service
 * Robust Web Speech API helper for multilingual SpeechSynthesis & SpeechRecognition.
 * Supports English (en-IN), Hindi (hi-IN), and Telugu (te-IN).
 */

export const SPEECH_LOCALES = {
  en: 'en-IN',
  hi: 'hi-IN',
  te: 'te-IN'
};

/**
 * Finds the most suitable voice for the requested language.
 * Strictly avoids falling back to an English voice for Hindi or Telugu.
 */
export function findBestVoice(voices, langCode) {
  if (!voices || voices.length === 0) return null;
  const target = (langCode || 'en').toLowerCase();

  if (target === 'te') {
    // Look strictly for Telugu voices
    return (
      voices.find((v) => {
        const l = (v.lang || '').toLowerCase();
        const n = (v.name || '').toLowerCase();
        return (
          l.startsWith('te') ||
          l.includes('te-in') ||
          l.includes('te_in') ||
          n.includes('telugu') ||
          n.includes('తెలుగు')
        );
      }) || null
    );
  }

  if (target === 'hi') {
    // Look strictly for Hindi voices
    return (
      voices.find((v) => {
        const l = (v.lang || '').toLowerCase();
        const n = (v.name || '').toLowerCase();
        return (
          l.startsWith('hi') ||
          l.includes('hi-in') ||
          l.includes('hi_in') ||
          n.includes('hindi') ||
          n.includes('हिन्दी')
        );
      }) || null
    );
  }

  // English: Prioritize Indian English (en-IN)
  const enIn = voices.find((v) => {
    const l = (v.lang || '').toLowerCase();
    const n = (v.name || '').toLowerCase();
    return l === 'en-in' || l === 'en_in' || (l.startsWith('en') && (n.includes('india') || n.includes('indian')));
  });
  if (enIn) return enIn;

  // Fallback to any English voice
  return voices.find((v) => (v.lang || '').toLowerCase().startsWith('en')) || null;
}

/**
 * Returns a friendly, localized message when a voice is not installed on the user's OS/browser.
 */
export function getVoiceUnavailableMessage(langCode) {
  if (langCode === 'te') {
    return 'తెలుగు వాయిస్ (Telugu Voice) మీ బ్రౌజర్ లేదా డివైస్‌లో ఇన్‌స్టాల్ కాలేదు. దయచేసి స్క్రీన్‌పై ఉన్న సమాచారాన్ని చదువుకోండి.';
  }
  if (langCode === 'hi') {
    return 'हिंदी आवाज़ (Hindi Voice) आपके इस ब्राउज़र/डिवाइस में इंस्टॉल नहीं है। कृपया स्क्रीन पर जवाब पढ़ें।';
  }
  return 'English voice is not available on this device. Please read the response on screen.';
}

/**
 * Cleans text for natural Text-To-Speech (stripping URLs, markdown, brackets).
 * Does not alter the original visible text.
 */
export function cleanTextForSpeech(text) {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/https?:\/\/\S+/gi, '') // remove raw URLs so TTS doesn't spell 'h-t-t-p-s-colon-slash-slash'
    .replace(/www\.\S+/gi, '')
    .replace(/[*#_~`[\]()]/g, ' ') // remove markdown markers
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Parses Web Speech API SpeechRecognitionEvent results.
 * Distinguishes between final and interim transcripts across all result indexes.
 * Never treats interim results as final.
 */
export function extractSpeechTranscripts(event, previousFinal = '') {
  if (!event || !event.results) {
    return {
      finalTranscript: previousFinal || '',
      interimTranscript: '',
      hasNewFinal: false
    };
  }

  let finalParts = [];
  let interimParts = [];

  const startIndex = typeof event.resultIndex === 'number' ? event.resultIndex : 0;

  for (let i = startIndex; i < event.results.length; i++) {
    const item = event.results[i];
    const transcriptText = item[0]?.transcript || '';
    if (item.isFinal) {
      if (transcriptText.trim()) finalParts.push(transcriptText.trim());
    } else {
      if (transcriptText.trim()) interimParts.push(transcriptText.trim());
    }
  }

  const finalChunk = finalParts.join(' ');
  const interimChunk = interimParts.join(' ');

  let updatedFinal = previousFinal ? previousFinal.trim() : '';
  if (finalChunk) {
    updatedFinal = updatedFinal ? `${updatedFinal} ${finalChunk}` : finalChunk;
  }

  return {
    finalTranscript: updatedFinal.trim(),
    interimTranscript: interimChunk.trim(),
    hasNewFinal: Boolean(finalChunk)
  };
}

/**
 * Manages atomic single-submission locking for voice input.
 * Prevents duplicate submissions between onresult and onend, and guards against
 * submitting partial interim results.
 */
export class SpeechSubmissionManager {
  constructor(onSubmit) {
    this.onSubmit = onSubmit;
    this.hasSubmitted = false;
    this.isSubmitting = false;
    this.accumulatedFinal = '';
    this.interim = '';
  }

  reset() {
    this.hasSubmitted = false;
    this.isSubmitting = false;
    this.accumulatedFinal = '';
    this.interim = '';
  }

  updateFromEvent(event) {
    const res = extractSpeechTranscripts(event, this.accumulatedFinal);
    this.accumulatedFinal = res.finalTranscript;
    this.interim = res.interimTranscript;
    return res;
  }

  finalizeAndSubmit() {
    // 1. Submission lock: ignore if already submitted or currently sending
    if (this.hasSubmitted || this.isSubmitting) {
      return false;
    }

    // 2. Determine completed text: prefer accumulated final, fallback to interim if browser closed early
    let textToSubmit = (this.accumulatedFinal || '').trim();
    if (!textToSubmit && this.interim) {
      textToSubmit = this.interim.trim();
    }

    // 3. Reject empty transcripts safely
    if (!textToSubmit) {
      this.reset();
      return false;
    }

    // 4. Acquire submission locks immediately
    this.hasSubmitted = true;
    this.isSubmitting = true;

    try {
      if (typeof this.onSubmit === 'function') {
        this.onSubmit(textToSubmit);
      }
      return true;
    } finally {
      this.isSubmitting = false;
      this.accumulatedFinal = '';
      this.interim = '';
    }
  }
}
