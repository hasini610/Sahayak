import React from 'react';
import { ExternalLink, ShieldCheck, AlertTriangle } from 'lucide-react';
import { UI_STRINGS } from '../translations/content';

export default function SourcesPanel({ sources = [], language = 'en' }) {
  const t = UI_STRINGS[language] || UI_STRINGS.en;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 space-y-4">
      {/* Title */}
      <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
        <ShieldCheck className="w-5 h-5 text-emerald-600" />
        <h3 className="font-bold text-slate-800 text-sm sm:text-base">
          {t.officialSources}
        </h3>
      </div>

      {/* Sources list */}
      {sources.length > 0 ? (
        <div className="space-y-2">
          {sources.map((src, i) => (
            <a
              key={i}
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-orange-400 hover:bg-orange-50/30 transition-all group"
            >
              <div className="pr-2">
                <p className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                  {src.title}
                </p>
                <span className="text-[11px] text-slate-400 break-all font-mono">
                  {src.url}
                </span>
              </div>
              <div className="p-1.5 rounded-lg bg-slate-100 text-slate-500 group-hover:bg-orange-100 group-hover:text-orange-700 flex-shrink-0">
                <ExternalLink className="w-4 h-4" />
              </div>
            </a>
          ))}
        </div>
      ) : (
        <p className="text-xs text-slate-400 italic">
          Official sources will appear here as you ask questions.
        </p>
      )}

      {/* Trust & Fraud Disclaimer */}
      <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          {t.govDisclaimer}
        </p>
      </div>
    </div>
  );
}
