import React from 'react';
import { Mic } from 'lucide-react';
import { UI_STRINGS } from '../translations/content';

export default function FinalCTA({ onTalk, language }) {
  const t = UI_STRINGS[language] || UI_STRINGS.en;
  return (
    <section className="bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">
        Ready to get started?
      </h2>
      <p className="mb-6 text-slate-600 max-w-xl mx-auto">
        Experience secure, AI‑driven assistance for any Indian government service.
      </p>
      <button
        onClick={onTalk}
        className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg shadow-md transition"
      >
        <Mic className="w-5 h-5" />
        Talk to Sahayak
      </button>
    </section>
  );
}
