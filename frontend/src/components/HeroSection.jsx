import React from 'react';
import { Mic, Globe, ArrowRight, ChevronRight } from 'lucide-react';
import { UI_STRINGS } from '../translations/content';

export default function HeroSection({ onTalk, language }) {
  const t = UI_STRINGS[language] || UI_STRINGS.en;

  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8 text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">
        Your multilingual voice‑first gateway to government services
      </h1>
      <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
        Secure, AI‑powered assistance in English, Hindi and Telugu – help with PAN cards, health benefits, voter IDs and more.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4 items-center">
        <button
          onClick={onTalk}
          className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg shadow-md transition"
        >
          <Mic className="w-5 h-5" />
          Talk to Sahayak
        </button>
        <button
          onClick={() => { /* placeholder – navigation handled via Navbar */ }}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-slate-800 font-medium rounded-lg transition"
        >
          Explore Services
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      <div className="mt-6 flex justify-center gap-4">
        {/* Language indicators */}
        <span className="flex items-center gap-1 text-sm text-slate-500">
          <Globe className="w-4 h-4" /> English
        </span>
        <span className="flex items-center gap-1 text-sm text-slate-500">
          हिन्दी
        </span>
        <span className="flex items-center gap-1 text-sm text-slate-500">
          తెలుగు
        </span>
      </div>
    </section>
  );
}
