import React from 'react';
import { languages, UI_STRINGS } from '../translations/content';
import { Mic, ShieldCheck, HeartHandshake, FileText, CheckCircle2 } from 'lucide-react';
import FeatureCards from './FeatureCards';
import HowItWorks from './HowItWorks';
import FinalCTA from './FinalCTA';
import Footer from './Footer';

export default function LandingPage({ language, setLanguage, onStart, onExplore }) {
  const t = UI_STRINGS[language] || UI_STRINGS.en;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
      {/* Hero Badge */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100/80 border border-orange-200 text-orange-800 text-xs sm:text-sm font-semibold shadow-sm">
          <ShieldCheck className="w-4 h-4 text-orange-600" />
          <span>Multilingual Voice-First Public Service Assistant</span>
        </div>
        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Government services, made simpler.
        </h1>
        {/* Sub‑headline */}
        <p className="max-w-2xl mx-auto text-base sm:text-xl text-slate-600 leading-relaxed">
          Understand government services, find the information you need, and get guided assistance in your preferred language.
        </p>
      </div>

      {/* Language Picker */}
      <div className="mt-10 max-w-3xl mx-auto">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3 text-center">
          {t.chooseLanguage}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {languages.map((item) => {
            const isSelected = language === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setLanguage(item.id)}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 text-center transition-all ${
                  isSelected
                    ? 'border-orange-500 bg-orange-50/60 shadow-md ring-2 ring-orange-200'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80'
                }`}
              >
                <span className="text-3xl mb-1">{item.flag}</span>
                <span className="font-bold text-lg text-slate-900">{item.native}</span>
                <span className="text-xs text-slate-500 font-medium">{item.name}</span>
                <span className="text-[11px] text-slate-400 mt-1 line-clamp-1">{item.sub}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Workflow preview cards (retain existing) */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* PAN Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 left-0 h-1.5 w-full bg-orange-500" />
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-700 flex-shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-orange-600 uppercase tracking-wider">Workflow 1</span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">{t.panCard}</h3>
              <p className="text-xs text-slate-600 mt-1">{t.panCardDesc}</p>
              <ul className="mt-3 space-y-1.5 text-xs text-slate-500">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Form 49A step‑by‑step guidance
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Aadhaar OTP verification &amp; ₹107 fee details
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* Ayushman Bharat */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 left-0 h-1.5 w-full bg-emerald-600" />
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 flex-shrink-0">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Workflow 2</span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">{t.ayushmanBharat}</h3>
              <p className="text-xs text-slate-600 mt-1">{t.ayushmanBharatDesc}</p>
              <ul className="mt-3 space-y-1.5 text-xs text-slate-500">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> ₹5 Lakh free medical cover details
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> SECC &amp; Ration Card eligibility checker
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Primary & Secondary CTA buttons */}
      <div className="mt-10 text-center space-x-4">
        <button
          type="button"
          onClick={onStart}
          className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 text-white font-bold text-lg sm:text-xl shadow-lg hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Mic className="w-6 h-6" />
          {t.startTalking}
        </button>
        <button
          type="button"
          onClick={onExplore}
          className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gray-200 text-gray-800 font-medium text-lg hover:bg-gray-300 transition"
        >
          Explore Services
        </button>
      </div>

      {/* Feature cards */}
      <FeatureCards language={language} />

      {/* How‑It‑Works */}
      <HowItWorks language={language} />

      {/* Final CTA */}
      <FinalCTA onTalk={onStart} language={language} />

      {/* Footer */}
      <Footer />

      {/* Trust & Safety banner */}
      <div className="mt-12 p-4 rounded-xl bg-slate-100 border border-slate-200/80 text-center">
        <p className="text-xs text-slate-600 leading-relaxed font-medium">
          <strong className="text-slate-800">Privacy &amp; Safety Notice:</strong> Sahayak will never ask for your Aadhaar number, OTP, bank PIN, or passwords. All information is strictly retrieved from official portals (.gov.in).
        </p>
      </div>
    </div>
  );
}
