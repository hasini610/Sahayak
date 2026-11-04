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
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-5 sm:p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base tracking-tight">
              {t.sourcesHeaderTitle}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.sourcesHeaderSubtitle}
          </p>
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
                className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 hover:bg-slate-50 hover:border-emerald-300 transition-all text-left"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-900 leading-snug">
                        {src.title || src.name}
                      </span>
                      {src.authorityType && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {src.authorityType}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span>{src.organisation}</span>
                    </div>

                    {src.summary && (
                      <p className="text-xs text-slate-600 leading-relaxed pt-1">
                        {src.summary}
                      </p>
                    )}
                  </div>

                  {src.url && (
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={t.viewOfficialSource}
                      className="p-2 rounded-xl bg-white border border-slate-200 hover:border-emerald-400 text-emerald-700 hover:bg-emerald-50 transition-colors shadow-sm flex-shrink-0"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>

                {/* Footer metadata: Verified date & Claims Toggle */}
                <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t.lastVerifiedDateLabel}: {verifiedDateFormatted}</span>
                  </div>

                  {hasClaims && (
                    <button
                      type="button"
                      onClick={() => toggleExpand(src.id || i)}
                      className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                    >
                      <span>{src.claims.length} {t.verifiedClaimsTitle}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>

                {/* Expandable Claims Box */}
                {isExpanded && hasClaims && (
                  <div className="mt-3 pt-3 border-t border-slate-200/80 space-y-2">
                    <p className="text-[11px] font-bold text-slate-700">
                      {t.verifiedClaimsTitle}:
                    </p>
                    <ul className="space-y-1.5">
                      {src.claims.map((claim, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{claim}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
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

      {/* Trust & Verification Disclaimer Notice */}
      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-slate-700 text-xs space-y-1">
        <div className="flex items-center gap-1.5 font-bold text-slate-800 text-[11px]">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
          <span>Statutory Data Integrity Rule:</span>
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          {t.sourceAuditNotice}
        </p>
      </div>
    </div>
  );
}
