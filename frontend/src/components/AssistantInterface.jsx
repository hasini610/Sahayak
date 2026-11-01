import React, { useState, useEffect, useRef } from 'react';
import { Send, AlertCircle, Sparkles, RotateCcw, VolumeX } from 'lucide-react';
import VoiceMicButton from './VoiceMicButton';
import ConversationDisplay from './ConversationDisplay';
import GuidedStepsUI from './GuidedStepsUI';
import SourcesPanel from './SourcesPanel';
import { UI_STRINGS } from '../translations/content';
import { sendChatMessage } from '../services/api';
import {
  SPEECH_LOCALES,
  findBestVoice,
  getVoiceUnavailableMessage,
  cleanTextForSpeech,
  SpeechSubmissionManager
} from '../services/speechService';


import { getOrCreateSessionId } from '../services/sessionService';
export default function AssistantInterface({
  language,
  fontSize,
  isAudioMuted
}) {
  const t = UI_STRINGS[language] || UI_STRINGS.en;

  const [status, setStatus] = useState('idle'); // 'idle' | 'listening' | 'thinking' | 'speaking'
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: 'assistant',
      text: language === 'hi'
        ? 'नमस्ते! मैं सहायक हूँ। मैं आपको नया पैन कार्ड बनवाने या आयुष्मान भारत योजना की जानकारी दे सकता हूँ। आप माइक दबाकर बोल सकते हैं या सवाल लिख सकते हैं।'
        : language === 'te'
        ? 'నమస్కారం! నేను సహాయక్. నేను మీకు పాన్ కార్డ్ దరఖాస్తు లేదా ఆయుష్మాన్ భారత్ వివరాలను సులభంగా వివరిస్తాను. మాట్లాడటానికి మైక్ నొక్కండి.'
        : 'Namaste! I am Sahayak. I can guide you through applying for a new PAN card or checking Ayushman Bharat benefits. How can I help you today?',
      language,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [steps, setSteps] = useState([]);
  const [checklist, setChecklist] = useState([]);
  const [sources, setSources] = useState([]);
  const [micError, setMicError] = useState(null);
  const [ttsNotice, setTtsNotice] = useState(null);
  const [availableVoices, setAvailableVoices] = useState([]);

  const recognitionRef = useRef(null);
  const synthRef = useRef(typeof window !== 'undefined' ? window.speechSynthesis : null);

  // Single-submission lock and transcript accumulator manager
  const sessionIdRef = useRef(null);
  if (!sessionIdRef.current) {
    sessionIdRef.current = getOrCreateSessionId();
  }

  const handleSendMessageRef = useRef(null);
  const submissionManagerRef = useRef(null);

  if (!submissionManagerRef.current) {
    submissionManagerRef.current = new SpeechSubmissionManager((text) => {
      handleSendMessageRef.current?.(text);
    });
  }

  // Load browser speech synthesis voices asynchronously
  useEffect(() => {
    const updateVoices = () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        const voices = window.speechSynthesis.getVoices() || [];
        setAvailableVoices(voices);
      }
    };

    updateVoices();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Sync initial welcome message and clear notices when language changes in header
  useEffect(() => {
    setTtsNotice(null);
    setMicError(null);
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === 'm1') {
        return [
          {
            id: 'm1',
            sender: 'assistant',
            text:
              language === 'hi'
                ? 'नमस्ते! मैं सहायक हूँ। मैं आपको नया पैन कार्ड बनवाने या आयुष्मान भारत योजना की जानकारी दे सकता हूँ। आप माइक दबाकर बोल सकते हैं या सवाल लिख सकते हैं।'
                : language === 'te'
                ? 'నమస్కారం! నేను సహాయక్. నేను మీకు పాన్ కార్డ్ దరఖాస్తు లేదా ఆయుష్మాన్ భారత్ వివరాలను సులభంగా వివరిస్తాను. మాట్లాడటానికి మైక్ నొక్కండి.'
                : 'Namaste! I am Sahayak. I can guide you through applying for a new PAN card or checking Ayushman Bharat benefits. How can I help you today?',
            language,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ];
      }
      return prev;
    });
  }, [language]);

  // Initialize Speech Recognition with language support (en-IN, hi-IN, te-IN)
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      // Allow interim results for visual feedback, but never submit them
      recognition.interimResults = true;
      recognition.lang = SPEECH_LOCALES[language] || 'en-IN';

      recognition.onstart = () => {
        setMicError(null);
        setStatus('listening');
        submissionManagerRef.current?.reset();
      };

      // Accumulate results separating interim and final; NEVER submit from onresult directly
      recognition.onresult = (event) => {
        if (!submissionManagerRef.current) return;
        const { finalTranscript, interimTranscript } = submissionManagerRef.current.updateFromEvent(event);
        // Show live preview in input box without triggering any network submission
        const livePreview = (finalTranscript + (interimTranscript ? ' ' + interimTranscript : '')).trim();
        if (livePreview) {
          setInputText(livePreview);
        }
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setMicError('Microphone permission was denied. Please allow microphone access or use the text box below.');
          setStatus('idle');
        } else if (event.error === 'no-speech') {
          setMicError('No speech was detected. Please try again or type below.');
          setStatus('idle');
        } else {
          setMicError(`Voice error (${event.error}). You can continue by typing.`);
          setStatus('idle');
        }
      };

      // Finalize and submit accumulated transcript ONCE when speech ends
      recognition.onend = () => {
        const submitted = submissionManagerRef.current?.finalizeAndSubmit();
        if (!submitted) {
          setStatus((prev) => (prev === 'listening' ? 'idle' : prev));
        }
      };

      recognitionRef.current = recognition;
    } else {
      setMicError('Speech recognition is not supported in this browser. Please use Google Chrome, Edge, or type below.');
    }

    return () => {
      recognitionRef.current?.abort();
      synthRef.current?.cancel();
    };
  }, [language]);

  // Multilingual Speech Synthesis (Text-to-Speech)
  const speakText = (rawText, targetLang = language) => {
    if (isAudioMuted || !window.speechSynthesis) {
      setStatus('idle');
      return;
    }

    // Always cancel previous speech to prevent overlapping audio
    synthRef.current?.cancel();

    const cleanedText = cleanTextForSpeech(rawText);
    if (!cleanedText) {
      setStatus('idle');
      return;
    }

    // Refresh voices directly from window.speechSynthesis to avoid stale state
    const currentVoices =
      window.speechSynthesis.getVoices().length > 0
        ? window.speechSynthesis.getVoices()
        : availableVoices;

    const matchedVoice = findBestVoice(currentVoices, targetLang);

    // Rule: Never play English audio for Hindi or Telugu responses
    if ((targetLang === 'hi' || targetLang === 'te') && !matchedVoice) {
      console.warn(`No native voice found for ${targetLang}. Refusing to use English fallback voice.`);
      setStatus('idle');
      setTtsNotice(t.voiceUnavailable || getVoiceUnavailableMessage(targetLang));
      return;
    }

    setTtsNotice(null);

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    if (matchedVoice) {
      utterance.voice = matchedVoice;
      utterance.lang = matchedVoice.lang || SPEECH_LOCALES[targetLang] || 'en-IN';
    } else {
      utterance.lang = SPEECH_LOCALES[targetLang] || 'en-IN';
    }

    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onstart = () => setStatus('speaking');
    utterance.onend = () => setStatus('idle');
    utterance.onerror = (e) => {
      console.warn('Speech synthesis error:', e);
      setStatus('idle');
    };

    // Small delay prevents Chromium cancel-speak race condition
    setTimeout(() => {
      synthRef.current?.speak(utterance);
    }, 40);
  };

  const stopAudio = () => {
    synthRef.current?.cancel();
    setStatus('idle');
  };

  const startListening = () => {
    setMicError(null);
    stopAudio();
    submissionManagerRef.current?.reset();
    try {
      if (recognitionRef.current) {
        recognitionRef.current.lang = SPEECH_LOCALES[language] || 'en-IN';
      }
      recognitionRef.current?.start();
    } catch (err) {
      console.warn('Recognition start failed:', err);
      setStatus('idle');
    }
  };

  const stopListening = () => {
    try {
      recognitionRef.current?.stop();
    } catch (err) {
      //
    }
    // Finalize speech immediately if not already submitted
    const submitted = submissionManagerRef.current?.finalizeAndSubmit();
    if (!submitted) {
      setStatus('idle');
    }
  };

  const handleSendMessage = async (rawMessage) => {
    const textToSend = rawMessage || inputText;
    if (!textToSend || !textToSend.trim()) return;

    setInputText('');
    setMicError(null);

    // 1. Append user message
    const userMsg = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      language,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, userMsg]);
    setStatus('thinking');

    // 2. Query backend or fallback
    const res = await sendChatMessage({
      message: textToSend.trim(),
      language,
      sessionId: sessionIdRef.current || getOrCreateSessionId()
    });

    const responseLang = res.language || language;

    const botMsg = {
      id: `b_${Date.now()}`,
      sender: 'assistant',
      text: res.reply,
      language: responseLang,
      timestamp: res.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, botMsg]);

    // Update guided steps & checklist (or clear them if current workflow has none)
    setSteps(res.steps || []);
    setChecklist(res.checklist || []);
    setSources(res.sources || []);

    // Speak response in the exact language of the response
    speakText(res.reply, responseLang);
  };

  // Keep ref up to date to prevent stale closures
  handleSendMessageRef.current = handleSendMessage;

  const clearChat = () => {
    stopAudio();
    setTtsNotice(null);
    submissionManagerRef.current?.reset();
    setMessages([]);
    setSteps([]);
    setChecklist([]);
    setSources([]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
      
      {/* Top Controls: Voice Mic & Quick Status */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 mb-6">
        <VoiceMicButton
          status={status}
          onStartListening={startListening}
          onStopListening={stopListening}
          onStopAudio={stopAudio}
          language={language}
        />

        {/* Mic Permission / Error Alert */}
        {micError && (
          <div className="mt-2 max-w-xl mx-auto p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <p className="flex-1">{micError}</p>
          </div>
        )}

        {/* Voice Unavailable Friendly Alert */}
        {ttsNotice && (
          <div className="mt-3 max-w-xl mx-auto p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center justify-between gap-2 shadow-xs">
            <div className="flex items-center gap-2">
              <VolumeX className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <p className="flex-1">{ttsNotice}</p>
            </div>
            <button
              type="button"
              onClick={() => setTtsNotice(null)}
              className="text-blue-700 hover:text-blue-900 font-bold px-1.5"
            >
              ✕
            </button>
          </div>
        )}

        {/* Quick Suggestion Chips */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-1.5 justify-center">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span>{t.samplePromptsTitle}</span>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {t.samplePrompts.map((prompt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSendMessage(prompt)}
                className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 hover:bg-orange-50 hover:text-orange-700 text-slate-700 border border-slate-200/80 transition-colors shadow-2xs"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (Chat, Transcript & Text Fallback) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col">
            
            {/* Conversation Header */}
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-800 text-sm sm:text-base">
                  Live Conversation & Transcript
                </h2>
                <span className="text-[11px] text-slate-500">
                  Real-time speech-to-text transcript
                </span>
              </div>
              <button
                type="button"
                onClick={clearChat}
                title={t.clearChat}
                className="text-xs font-medium text-slate-500 hover:text-red-600 flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-white transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.clearChat}</span>
              </button>
            </div>

            {/* Transcript & Message History with Language-Aware Replay */}
            <ConversationDisplay
              messages={messages}
              status={status}
              language={language}
              fontSize={fontSize}
              onReplayAudio={(text, msgLang) => speakText(text, msgLang || language)}
            />

            {/* Text Input Fallback */}
            <div className="p-3 bg-slate-50/90 border-t border-slate-200">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={t.inputPlaceholder}
                  aria-label="Type message"
                  className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-inner"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">{t.send}</span>
                </button>
              </form>
              <p className="text-[11px] text-slate-400 mt-1.5 text-center">
                {t.textFallbackNotice}
              </p>
            </div>

          </div>
        </div>

        {/* Right Column (Guided Steps, Checklist & Official Sources) */}
        <div className="lg:col-span-5 space-y-6">
          <GuidedStepsUI
            steps={steps}
            checklist={checklist}
            language={language}
          />

          <SourcesPanel
            sources={sources}
            language={language}
          />
        </div>

      </div>

    </div>
  );
}
