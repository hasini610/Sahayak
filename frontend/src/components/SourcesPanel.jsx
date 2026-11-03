import React, { useState } from 'react';
import { ExternalLink, ShieldCheck, AlertTriangle, Calendar, Building2, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { UI_STRINGS } from '../translations/content';

export default function SourcesPanel({ sources = [], language = 'en' }) {
  const t = UI_STRINGS[language] || UI_STRINGS.en;
  const [expandedSourceId, setExpandedSourceId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedSourceId((prev) => (prev === id ? null : id));
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'October 2026';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const month = months[parseInt(parts[1], 10) - 1] || parts[1];
        return `${parts[2]} ${month} ${parts[0]}`;
      }
    } catch (e) {
      // fallback
    }
    return dateStr;
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-4">
      {/* Title & Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200/70">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm sm:text-base leading-tight">
              {t.sourcesHeaderTitle || t.officialSources}
            </h3>
            <p className="text-[11px] text-slate-500">
              {t.sourcesHeaderSubtitle || 'Statutory Portals & Verified Authority Attribution'}
            </p>
          </div>
        </div>

        {sources.length > 0 && (
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            {sources.length} Official {sources.length === 1 ? 'Source' : 'Sources'}
          </span>
        )}
      </div>

      {/* Sources List */}
      {sources.length > 0 ? (
        <div className="space-y-3">
          {sources.map((src, i) => {
            const isExpanded = expandedSourceId === (src.id || i);
            const verifiedDateFormatted = formatDate(src.lastVerifiedDate);
            const hasClaims = Array.isArray(src.claims) && src.claims.length > 0;

            return (
              <div
                key={src.id || i}
                className="rounded-2xl border border-slate-200/90 bg-slate-50/40 hover:bg-white hover:border-orange-300 transition-all shadow-2xs overflow-hidden"
              >
                <div className="p-3.5 space-y-2">
                  {/* Top Bar: Authority Badge & Last Verified Date */}
                  <div className="flex flex-wrap items-center justify-between gap-1.5 text-[11px]">
                    <span className="font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {src.authorityType || 'Official Government Portal'}
                    </span>
                    <span className="inline-flex items-center gap-1 text-slate-500 font-mono text-[10px] bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{t.lastVerifiedDateLabel}: {verifiedDateFormatted}</span>
                    </span>
                  </div>

                  {/* Source Title & Organisation */}
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug">
                      {src.title}
                    </h4>
                    {src.organisation && (
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-600 mt-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="font-medium line-clamp-1">{src.organisation}</span>
                      </div>
                    )}
                  </div>

                  {/* Official URL display */}
                  <div className="text-[11px] text-slate-400 font-mono break-all line-clamp-1">
                    {src.url}
                  </div>

                  {/* Actions & Claims Toggle */}
                  <div className="pt-2 border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-2">
                    {hasClaims && (
                      <button
                        type="button"
                        onClick={() => toggleExpand(src.id || i)}
                        className="text-[11px] font-semibold text-slate-600 hover:text-orange-600 flex items-center gap-1 transition-colors"
                      >
                        <span>{t.verifiedClaimsTitle} ({src.claims.length})</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    )}

                    {/* View Official Source Action */}
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-sm hover:shadow transition-all group ml-auto cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-400"
                    >
                      <span>{t.viewOfficialSource}</span>
                      <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  </div>

                  {/* Expanded Verified Claims */}
                  {isExpanded && hasClaims && (
                    <div className="mt-2.5 pt-2.5 border-t border-slate-200/80 bg-white p-3 rounded-xl space-y-1.5">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {t.verifiedClaimsTitle}:
                      </p>
                      <ul className="space-y-1.5 text-xs text-slate-600">
                        {src.claims.map((claim, cIdx) => (
                          <li key={cIdx} className="flex items-start gap-1.5 leading-snug">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span>{claim}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center p-6 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
          <ShieldCheck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            {t.noSourcesAvailable}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            (PAN Card • Ayushman Bharat • Election Commission of India)
          </span>
        </div>
      )}

      
    </div>
  );
}
