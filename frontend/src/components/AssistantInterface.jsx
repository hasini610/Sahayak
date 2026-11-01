import React, { useState, useEffect, useRef } from 'react';
import { Send, AlertCircle, Sparkles, RotateCcw } from 'lucide-react';
import VoiceMicButton from './VoiceMicButton';
import ConversationDisplay from './ConversationDisplay';
import GuidedStepsUI from './GuidedStepsUI';
import SourcesPanel from './SourcesPanel';
import { UI_STRINGS } from '../translations/content';
import { sendChatMessage } from '../services/api';

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
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [steps, setSteps] = useState([]);
  const [checklist, setChecklist] = useState([]);
  const [sources, setSources] = useState([]);
  const [micError, setMicError] = useState(null);

  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      // Set recognition language
      if (language === 'hi') recognition.lang = 'hi-IN';
      else if (language === 'te') recognition.lang = 'te-IN';
      else recognition.lang = 'en-IN';

      recognition.onstart = () => {
        setMicError(null);
        setStatus('listening');
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript && transcript.trim()) {
          handleSendMessage(transcript);
        }
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setStatus('idle');
        if (event.error === 'not-allowed') {
          setMicError('Microphone permission was denied. Please allow microphone access or use the text box below.');
        } else if (event.error === 'no-speech') {
          setMicError('No speech was detected. Please try again or type below.');
        } else {
          setMicError(`Voice error (${event.error}). You can continue by typing.`);
        }
      };

      recognition.onend = () => {
        if (status === 'listening') {
          setStatus('idle');
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

  // Voice synthesis (Text-to-Speech)
  const speakText = (text) => {
    if (isAudioMuted || !window.speechSynthesis) {
      setStatus('idle');
      return;
    }

    synthRef.current?.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    if (language === 'hi') utterance.lang = 'hi-IN';
    else if (language === 'te') utterance.lang = 'te-IN';
    else utterance.lang = 'en-IN';

    utterance.rate = 0.95; // Slightly slower for clarity
    utterance.pitch = 1.0;

    utterance.onstart = () => setStatus('speaking');
    utterance.onend = () => setStatus('idle');
    utterance.onerror = () => setStatus('idle');

    synthRef.current.speak(utterance);
  };

  const stopAudio = () => {
    synthRef.current?.cancel();
    setStatus('idle');
  };

  const startListening = () => {
    setMicError(null);
    stopAudio();
    try {
      recognitionRef.current?.start();
    } catch (err) {
      console.warn('Recognition start failed:', err);
      // If already started or browser blocked
      setStatus('idle');
    }
  };

  const stopListening = () => {
    try {
      recognitionRef.current?.stop();
    } catch (err) {
      //
    }
    setStatus('idle');
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
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, userMsg]);
    setStatus('thinking');

    // 2. Query backend or fallback
    const res = await sendChatMessage({
      message: textToSend.trim(),
      language,
      sessionId: 'user_session_1'
    });

    const botMsg = {
      id: `b_${Date.now()}`,
      sender: 'assistant',
      text: res.reply,
      timestamp: res.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, botMsg]);

    // Update guided steps & checklist if returned
    if (res.steps && res.steps.length > 0) setSteps(res.steps);
    if (res.checklist && res.checklist.length > 0) setChecklist(res.checklist);
    if (res.sources && res.sources.length > 0) setSources(res.sources);

    // Speak response
    speakText(res.reply);
  };

  const clearChat = () => {
    stopAudio();
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

            {/* Transcript & Message History */}
            <ConversationDisplay
              messages={messages}
              status={status}
              language={language}
              fontSize={fontSize}
              onReplayAudio={speakText}
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
