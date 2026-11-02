import React, { useRef, useEffect, useState } from 'react';
import { Volume2, User, Bot, ShieldCheck, ExternalLink, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
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
  const containerRef = useRef(null);
  const prevMessagesCountRef = useRef(messages.length);
  const [openSourcesMsgId, setOpenSourcesMsgId] = useState(null);

  useEffect(() => {
    // Only scroll the internal conversation container when new messages arrive.
    // NEVER call window/page scrollIntoView so user remains at current viewport position.
    if (containerRef.current && messages.length > prevMessagesCountRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
    prevMessagesCountRef.current = messages.length;
  }, [messages]);

  const toggleSourceDrawer = (id) => {
    setOpenSourcesMsgId((prev) => (prev === id ? null : id));
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Oct 2026';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${parts[2]} ${months[parseInt(parts[1], 10) - 1]} ${parts[0]}`;
      }
    } catch (e) {
      // fallback
    }
    return dateStr;
  };

  return (
    <div
      ref={containerRef}
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
        const msgId = msg.id || `m_${index}`;
        const hasSources = Array.isArray(msg.sources) && msg.sources.length > 0;
        const isSourcesOpen = openSourcesMsgId === msgId;

        return (
          <div
            key={msgId}
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
              className={`max-w-[88%] sm:max-w-[82%] rounded-2xl px-4 py-3 shadow-sm ${
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
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    {hasSources ? (
                      <button
                        type="button"
                        onClick={() => toggleSourceDrawer(msgId)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{t.groundedInOfficialBadge || 'Grounded in Official Sources'} ({msg.sources.length})</span>
                        {isSourcesOpen ? <ChevronUp className="w-3 h-3 ml-0.5" /> : <ChevronDown className="w-3 h-3 ml-0.5" />}
                      </button>
                    ) : (
                      <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        ✓ Verified Official Data
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => onReplayAudio(msg.text, msg.language || language)}
                    aria-label="Replay audio for this message"
                    title="Listen to this message"
                    className="flex items-center gap-1 hover:text-orange-600 font-semibold px-2 py-1 rounded hover:bg-slate-50 transition-colors ml-auto"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Replay Audio</span>
                  </button>
                </div>
              )}

              {/* Expandable Official Sources Drawer for Assistant Message (FEATURE 1) */}
              {!isUser && hasSources && isSourcesOpen && (
                <div className="mt-3 pt-3 border-t border-slate-100 space-y-2 bg-slate-50/80 -mx-2 px-3 py-2.5 rounded-xl border border-slate-200/60">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                    <span>{t.officialSources}:</span>
                    <span className="text-[10px] text-slate-400">Audited Oct 2026</span>
                  </div>

                  {msg.sources.map((src, sIdx) => (
                    <div key={src.id || sIdx} className="bg-white p-2.5 rounded-lg border border-slate-200 text-xs space-y-1 shadow-2xs">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-bold text-slate-900 text-xs leading-snug">
                            {src.title}
                          </p>
                          {src.organisation && (
                            <p className="text-[10px] text-slate-500">
                              {src.organisation}
                            </p>
                          )}
                        </div>
                        <span className="text-[9px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded flex-shrink-0">
                          {formatDate(src.lastVerifiedDate)}
                        </span>
                      </div>

                      <div className="pt-1 flex items-center justify-between text-[10px]">
                        <span className="text-slate-400 font-mono truncate max-w-[180px]">
                          {src.url}
                        </span>
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-orange-600 hover:text-orange-700 font-bold ml-auto"
                        >
                          <span>{t.viewOfficialSource}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
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

      </div>
  );
}
