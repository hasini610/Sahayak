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

