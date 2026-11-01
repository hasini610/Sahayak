import React, { useRef, useEffect } from 'react';
import { Volume2, User, Bot, AlertCircle, RefreshCw } from 'lucide-react';
import { UI_STRINGS } from '../translations/content';

export default function ConversationDisplay({
  messages,
  status,
  language,
  fontSize,
  onReplayAudio,
  onRetry
}) {
  const t = UI_STRINGS[language] || UI_STRINGS.en;
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, status]);

  return (
    <div 
      className="flex-1 overflow-y-auto px-4 py-4 space-y-4 max-h-[500px] sm:max-h-[580px] scroll-smooth"
      style={{ fontSize: `${fontSize}px` }}
      aria-label="Conversation Transcript"
      role="log"
    >
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center p-8 text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl bg-white/50">
          <Bot className="w-12 h-12 text-slate-300 mb-2" />
          <p className="font-semibold text-slate-600 text-sm">
            {language === 'hi' 
              ? 'बातचीत शुरू करने के लिए माइक दबाएँ या नीचे सवाल लिखें'
              : language === 'te'
              ? 'సంభాషణ ప్రారంభించడానికి మైక్ నొక్కండి లేదా కింద ప్రశ్న రాయండి'
              : 'Press the microphone above or type below to start your conversation'}
          </p>
          <span className="text-xs text-slate-400 mt-1">
            (PAN Card • Ayushman Bharat • English, हिंदी, తెలుగు)
          </span>
        </div>
      )}

      {messages.map((msg, index) => {
        const isUser = msg.sender === 'user';
        return (
          <div
            key={msg.id || index}
            className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {/* Avatar */}
            <div
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold shadow-sm ${
                isUser
                  ? 'bg-slate-700'
                  : 'bg-gradient-to-tr from-orange-600 to-amber-500'
              }`}
            >
              {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[85%] sm:max-w-[78%] rounded-2xl px-4 py-3 shadow-sm ${
                isUser
                  ? 'bg-orange-600 text-white rounded-tr-none'
                  : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none'
              }`}
            >
              {/* Sender & timestamp header */}
              <div className="flex items-center justify-between gap-4 mb-1 text-xs opacity-75">
                <span className="font-bold">
                  {isUser ? 'You' : 'Sahayak'}
                </span>
                <span>{msg.timestamp}</span>
              </div>

              {/* Message text / transcript */}
              <p className="leading-relaxed whitespace-pre-line font-normal">
                {msg.text}
              </p>

              {/* Action bar for assistant messages */}
              {!isUser && (
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    ✓ Verified Official Data
                  </span>
                  <button
                    type="button"
                    onClick={() => onReplayAudio(msg.text)}
                    aria-label="Replay audio for this message"
                    title="Listen to this message"
                    className="flex items-center gap-1 hover:text-orange-600 font-semibold px-2 py-1 rounded hover:bg-slate-50 transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Replay Audio</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Thinking state bubble */}
      {status === 'thinking' && (
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-sm">
            <Bot className="w-5 h-5 animate-spin" />
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-2">
            <div className="flex space-x-1.5">
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" />
            </div>
            <span className="text-xs text-slate-500 font-medium ml-2">
              {t.micThinking}
            </span>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
