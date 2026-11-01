import React from 'react';
import { languages, UI_STRINGS } from '../translations/content';
import { Volume2, VolumeX, Eye, Sparkles, Globe, Sun, Moon } from 'lucide-react';

export default function Navbar({
  language,
  setLanguage,
  fontSize,
  setFontSize,
  highContrast,
  setHighContrast,
  status,
  isAudioMuted,
  setIsAudioMuted,
  onReset
}) {
  const t = UI_STRINGS[language] || UI_STRINGS.en;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 transition-colors shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Identity */}
          <div 
            onClick={onReset}
            className="flex items-center gap-3 cursor-pointer group focus:outline-none"
            role="button"
            tabIndex={0}
            aria-label="Sahayak Home"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-orange-600 via-amber-500 to-emerald-600 p-[2px] shadow-md group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center font-black text-xl text-orange-600">
                स
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900 group-hover:text-orange-600 transition-colors">
                  {t.appTitle}
                </span>
                <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Gov MVP
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Controls: Language, Text Size, Accessibility */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Language Selector */}
            <div className="relative inline-flex items-center">
              <Globe className="w-4 h-4 text-slate-500 absolute left-2.5 pointer-events-none" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                aria-label="Select Assistant Language"
                className="pl-8 pr-4 py-1.5 text-xs sm:text-sm font-semibold rounded-lg border border-slate-300 bg-white text-slate-800 hover:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm cursor-pointer"
              >
                {languages.map((lang) => (
                  <option key={lang.id} value={lang.id}>
                    {lang.native} ({lang.name})
                  </option>
                ))}
              </select>
            </div>

            {/* Accessibility: Font Size toggler */}
            <div className="hidden md:flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200">
              <button
                type="button"
                onClick={() => setFontSize(Math.max(14, fontSize - 2))}
                title="Decrease font size"
                aria-label="Decrease text size"
                className="px-2 py-1 text-xs font-bold text-slate-600 hover:text-slate-900 rounded hover:bg-white"
              >
                A-
              </button>
              <span className="text-xs px-1 text-slate-400 font-mono">
                {fontSize}px
              </span>
              <button
                type="button"
                onClick={() => setFontSize(Math.min(22, fontSize + 2))}
                title="Increase font size"
                aria-label="Increase text size"
                className="px-2 py-1 text-xs font-bold text-slate-600 hover:text-slate-900 rounded hover:bg-white"
              >
                A+
              </button>
            </div>

            {/* High Contrast Toggle */}
            <button
              type="button"
              onClick={() => setHighContrast(!highContrast)}
              title={t.highContrast}
              aria-label="Toggle High Contrast Mode"
              className={`p-2 rounded-lg border text-xs font-medium flex items-center gap-1 transition-all ${
                highContrast 
                  ? 'bg-black text-yellow-300 border-black' 
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span className="hidden xl:inline">{t.highContrast}</span>
            </button>

            {/* Audio Mute / Unmute */}
            <button
              type="button"
              onClick={() => setIsAudioMuted(!isAudioMuted)}
              title={isAudioMuted ? 'Unmute Audio' : 'Mute Audio'}
              aria-label={isAudioMuted ? 'Unmute speech output' : 'Mute speech output'}
              className={`p-2 rounded-lg border text-xs font-medium transition-all ${
                isAudioMuted
                  ? 'bg-red-50 text-red-700 border-red-300'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}
