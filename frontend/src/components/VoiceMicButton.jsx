import React from 'react';
import { Mic, Square, Loader2, Volume2 } from 'lucide-react';
import { UI_STRINGS } from '../translations/content';

export default function VoiceMicButton({
  status, // 'idle' | 'listening' | 'thinking' | 'speaking'
  onStartListening,
  onStopListening,
  onStopAudio,
  language = 'en'
}) {
  const t = UI_STRINGS[language] || UI_STRINGS.en;

  const getStatusText = () => {
    switch (status) {
      case 'listening':
        return t.micListening;
      case 'thinking':
        return t.micThinking;
      case 'speaking':
        return t.micSpeaking;
      default:
        return t.micIdle;
    }
  };

  const handleClick = () => {
    if (status === 'speaking') {
      onStopAudio();
    } else if (status === 'listening') {
      onStopListening();
    } else if (status === 'idle') {
      onStartListening();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* Outer Pulse Rings for Active States */}
      <div className="relative flex items-center justify-center">
        {status === 'listening' && (
          <div className="absolute w-28 h-28 rounded-full bg-orange-400/30 animate-ping pointer-events-none" />
        )}
        {status === 'speaking' && (
          <div className="absolute w-28 h-28 rounded-full bg-emerald-400/30 animate-pulse pointer-events-none" />
        )}

        {/* Primary Mic Button */}
        <button
          type="button"
          onClick={handleClick}
          disabled={status === 'thinking'}
          aria-label={getStatusText()}
          aria-live="polite"
          className={`relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center transition-all shadow-xl focus:outline-none focus:ring-4 ${
            status === 'listening'
              ? 'bg-orange-600 text-white shadow-orange-500/50 scale-105 ring-orange-300'
              : status === 'speaking'
              ? 'bg-emerald-600 text-white shadow-emerald-500/50 scale-105 ring-emerald-300'
              : status === 'thinking'
              ? 'bg-slate-300 text-slate-600 cursor-wait'
              : 'bg-gradient-to-tr from-orange-600 to-amber-500 text-white hover:scale-105 active:scale-95 shadow-orange-500/30 ring-orange-200'
          }`}
        >
          {status === 'listening' && <Square className="w-8 h-8 fill-current" />}
          {status === 'speaking' && <Volume2 className="w-8 h-8 animate-bounce" />}
          {status === 'thinking' && <Loader2 className="w-8 h-8 animate-spin" />}
          {status === 'idle' && <Mic className="w-8 h-8 sm:w-9 sm:h-9" />}
        </button>
      </div>

      {/* Dynamic Status Text */}
      <div className="mt-3 flex items-center gap-2">
        <span
          className={`w-2.5 h-2.5 rounded-full ${
            status === 'listening'
              ? 'bg-orange-500 animate-pulse'
              : status === 'speaking'
              ? 'bg-emerald-500 animate-pulse'
              : status === 'thinking'
              ? 'bg-amber-500 animate-spin'
              : 'bg-slate-400'
          }`}
        />
        <p className="text-sm sm:text-base font-bold text-slate-700 tracking-wide">
          {getStatusText()}
        </p>
      </div>

      {/* Stop Speech Output control when assistant is speaking */}
      {status === 'speaking' && (
        <button
          type="button"
          onClick={onStopAudio}
          className="mt-2 text-xs font-semibold px-3 py-1 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition-colors flex items-center gap-1"
        >
          <Square className="w-3 h-3 fill-current" />
          <span>{t.tapToStop}</span>
        </button>
      )}
    </div>
  );
}
