import React from 'react';
import { Mic, Globe, Sparkles } from 'lucide-react';
import { UI_STRINGS } from '../translations/content';

export default function FeatureCards({ language }) {
  const t = UI_STRINGS[language] || UI_STRINGS.en;
  const features = [
    {
      icon: <Mic className="w-8 h-8 text-orange-600" />, 
      title: t.voiceFirst || 'Voice‑first AI assistance',
      description: t.voiceFirstDesc || 'Speak naturally and get instant, accurate guidance without typing.'
    },
    {
      icon: <Globe className="w-8 h-8 text-emerald-600" />, 
      title: t.multilingual || 'Multilingual support',
      description: t.multilingualDesc || 'Interact in English, Hindi or Telugu – the assistant understands your language.'
    },
    {
      icon: <Sparkles className="w-8 h-8 text-indigo-600" />, 
      title: t.guidedAssistance || 'Guided government service assistance',
      description: t.guidedAssistanceDesc || 'Step‑by‑step help for PAN cards, health schemes, voter IDs and more.'
    }
  ];

  return (
    <section className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-3">
        {features.map((f, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm text-center">
            <div className="flex justify-center mb-4">{f.icon}</div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">{f.title}</h3>
            <p className="text-sm text-slate-600">{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
