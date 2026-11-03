import React from 'react';
import { ArrowRight, Mic, Globe, Sparkles } from 'lucide-react';
import { UI_STRINGS } from '../translations/content';

export default function HowItWorks({ language }) {
  const t = UI_STRINGS[language] || UI_STRINGS.en;
  const steps = [
    {
      icon: <Mic className="w-6 h-6 text-orange-600" />, 
      title: t.step1Title || 'Speak or type your request',
      description: t.step1Desc || 'Press “Talk to Sahayak” or type a query in your language.'
    },
    {
      icon: <Globe className="w-6 h-6 text-emerald-600" />, 
      title: t.step2Title || 'AI understands and fetches official data',
      description: t.step2Desc || 'The assistant processes your request and pulls verified government sources.'
    },
    {
      icon: <Sparkles className="w-6 h-6 text-indigo-600" />, 
      title: t.step3Title || 'Get step‑by‑step guidance',
      description: t.step3Desc || 'Follow clear instructions to complete the service (PAN, Ayushman, etc.).'
    }
  ];

  return (
    <section className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold text-center text-slate-800 mb-8">{t.howItWorks || 'How it works'}</h2>
      <div className="max-w-4xl mx-auto grid gap-8 md:grid-cols-3 items-start">
        {steps.map((s, idx) => (
          <div key={idx} className="flex flex-col items-center text-center">
            <div className="mb-4">{s.icon}</div>
            <h3 className="text-lg font-medium text-slate-700 mb-2">{s.title}</h3>
            <p className="text-sm text-slate-600">{s.description}</p>
            {idx < steps.length - 1 && (
              <ArrowRight className="mt-4 w-6 h-6 text-slate-400" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
