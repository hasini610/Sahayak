import React from 'react';
import { CheckCircle, AlertTriangle, Clock, CreditCard, Info, PhoneCall } from 'lucide-react';

/**
 * Displays the extracted key information from a government document.
 * Distinguishes actual document warnings from general safety/privacy notices.
 * Props:
 *   keyInfo: object with arrays: deadlines, eligibility, requiredDocs, fees, warnings, contacts
 */
export default function KeyInfoPanel({ keyInfo }) {
  if (!keyInfo) return null;
  const { deadlines = [], eligibility = [], requiredDocs = [], fees = [], warnings = [], contacts = [] } = keyInfo;

  // Filter out any accidental developer or generic non-document warnings
  const isGenericWarning = (text) => {
    if (!text || typeof text !== 'string') return true;
    const lower = text.toLowerCase();
    return (
      lower.includes('api key') ||
      lower.includes('never commit') ||
      lower.includes('developer') ||
      lower.includes('environment variable') ||
      lower.includes('system prompt') ||
      lower.includes('json parsing')
    );
  };

  const documentSpecificWarnings = (Array.isArray(warnings) ? warnings : [])
    .filter((w) => typeof w === 'string' && w.trim().length > 0 && !isGenericWarning(w));

  const sections = [
    {
      label: 'Deadlines & Key Dates',
      icon: <Clock className="w-4 h-4 inline mr-1.5 text-orange-600 flex-shrink-0" />,
      items: deadlines,
      borderColor: 'border-orange-100',
      bgColor: 'bg-orange-50/30'
    },
    {
      label: 'Eligibility & Criteria',
      icon: <CheckCircle className="w-4 h-4 inline mr-1.5 text-emerald-600 flex-shrink-0" />,
      items: eligibility,
      borderColor: 'border-emerald-100',
      bgColor: 'bg-emerald-50/30'
    },
    {
      label: 'Required Documents',
      icon: <Info className="w-4 h-4 inline mr-1.5 text-blue-600 flex-shrink-0" />,
      items: requiredDocs,
      borderColor: 'border-blue-100',
      bgColor: 'bg-blue-50/30'
    },
    {
      label: 'Fees & Government Charges',
      icon: <CreditCard className="w-4 h-4 inline mr-1.5 text-purple-600 flex-shrink-0" />,
      items: fees,
      borderColor: 'border-purple-100',
      bgColor: 'bg-purple-50/30'
    },
    {
      label: 'Document Warnings & Invalidation Cautions',
      icon: <AlertTriangle className="w-4 h-4 inline mr-1.5 text-amber-600 flex-shrink-0" />,
      items: documentSpecificWarnings,
      borderColor: 'border-amber-200',
      bgColor: 'bg-amber-50/50'
    },
    {
      label: 'Official Contacts & Helplines',
      icon: <PhoneCall className="w-4 h-4 inline mr-1.5 text-slate-600 flex-shrink-0" />,
      items: contacts,
      borderColor: 'border-slate-200',
      bgColor: 'bg-slate-50/50'
    },
  ];

  const hasAnyItems = sections.some((sec) => sec.items && sec.items.length > 0);

  if (!hasAnyItems) {
    return (
      <div className="p-4 text-center rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-500 italic">
        No specific statutory deadlines, fees, or document warnings were identified in this document.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sections.map((sec) => (
        sec.items && sec.items.length > 0 && (
          <div
            key={sec.label}
            className={`p-3.5 rounded-xl border ${sec.borderColor} ${sec.bgColor} transition-all`}
          >
            <h4 className="font-bold text-xs sm:text-sm text-slate-800 mb-2 flex items-center">
              {sec.icon}
              <span>{sec.label}</span>
            </h4>
            <ul className="list-disc list-inside text-xs sm:text-sm text-slate-700 space-y-1">
              {sec.items.map((it, i) => (
                <li key={i} className="leading-relaxed">{it}</li>
              ))}
            </ul>
          </div>
        )
      ))}
    </div>
  );
}
