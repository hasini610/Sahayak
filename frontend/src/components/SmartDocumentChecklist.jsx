import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Square,
  RotateCcw,
  ShieldCheck,
  AlertTriangle,
  Award,
  FileCheck2,
  FileText,
  HeartHandshake,
  HelpCircle,
  Info
} from 'lucide-react';
import { UI_STRINGS } from '../translations/content';
import {
  CHECKLIST_SERVICES,
  getChecklistProgress,
  saveChecklistProgress,
  clearChecklistProgress
} from '../data/checklistDocuments';

export default function SmartDocumentChecklist({
  language = 'en',
  activeService = null,
  onServiceChange = null
}) {
  const t = UI_STRINGS[language] || UI_STRINGS.en;

  // Selected service: 'pan' | 'ayushman'
  const [selectedService, setSelectedService] = useState('pan');

  // Ready documents map for each service: { [docId]: boolean }
  const [panReady, setPanReady] = useState({});
  const [ayushmanReady, setAyushmanReady] = useState({});

  // Reset confirmation state
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Synchronize with activeService prop from assistant chat or parent
  useEffect(() => {
    if (activeService) {
      if (activeService === 'pan' || activeService === 'pan_card') {
        setSelectedService('pan');
      } else if (activeService === 'ayushman' || activeService === 'ayushman_bharat') {
        setSelectedService('ayushman');
      }
    }
  }, [activeService]);

  // Load progress from localStorage on initial render
  useEffect(() => {
    setPanReady(getChecklistProgress('pan'));
    setAyushmanReady(getChecklistProgress('ayushman'));
  }, []);

  const handleSelectService = (serviceId) => {
    setSelectedService(serviceId);
    setShowResetConfirm(false);
    if (onServiceChange) {
      onServiceChange(serviceId);
    }
  };

  const currentServiceData = CHECKLIST_SERVICES[selectedService] || CHECKLIST_SERVICES.pan;
  const localizedData = currentServiceData[language] || currentServiceData.en;
  const documents = localizedData.documents || [];

  const readyMap = selectedService === 'pan' ? panReady : ayushmanReady;

  const totalDocs = documents.length;
  const readyCount = documents.filter((doc) => !!readyMap[doc.id]).length;
  const progressPercent = totalDocs > 0 ? Math.round((readyCount / totalDocs) * 100) : 0;
  const isAllReady = totalDocs > 0 && readyCount === totalDocs;

  // Toggle document ready state and persist to localStorage
  const toggleDocument = (docId) => {
    const updated = {
      ...readyMap,
      [docId]: !readyMap[docId]
    };

    if (selectedService === 'pan') {
      setPanReady(updated);
      saveChecklistProgress('pan', updated);
    } else {
      setAyushmanReady(updated);
      saveChecklistProgress('ayushman', updated);
    }
  };

  // Reset progress for the currently selected service
  const handleResetConfirm = () => {
    clearChecklistProgress(selectedService);
    if (selectedService === 'pan') {
      setPanReady({});
    } else {
      setAyushmanReady({});
    }
    setShowResetConfirm(false);
  };

  // Summary counts for tab badges
  const panTotalCount = CHECKLIST_SERVICES.pan.en.documents.length;
  const panReadyCount = CHECKLIST_SERVICES.pan.en.documents.filter((d) => panReady[d.id]).length;

  const ayushTotalCount = CHECKLIST_SERVICES.ayushman.en.documents.length;
  const ayushReadyCount = CHECKLIST_SERVICES.ayushman.en.documents.filter((d) => ayushmanReady[d.id]).length;

  // Helper to render appropriate status badge
  const renderStatusBadge = (statusType) => {
    if (statusType === 'required') {
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
          ● {t.statusRequired}
        </span>
      );
    }
    if (statusType === 'conditional') {
      return (
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
          ◆ {t.statusConditional}
        </span>
      );
    }
    // depends_on_mode
    return (
      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
        ⚙ {t.statusDependsOnMode}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden transition-all">
      {/* Top Emerald Accent Ribbon */}
      <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600" />

      <div className="p-4 sm:p-5">
        {/* Header Title & Reset */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight">
                {t.checklistHeaderTitle}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {t.checklistSubtitle}
            </p>
          </div>

          {/* Reset Progress Button */}
          {readyCount > 0 && !showResetConfirm && (
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl text-slate-600 hover:text-red-700 bg-slate-100 hover:bg-red-50 border border-slate-200/80 hover:border-red-200 transition-colors shadow-2xs self-start sm:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.resetChecklist}</span>
            </button>
          )}
        </div>

        {/* Inline Reset Confirmation Prompt */}
        {showResetConfirm && (
          <div className="mt-3 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs animate-in fade-in duration-200">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 space-y-2">
                <p className="font-medium leading-relaxed">
                  {t.resetChecklistConfirm}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetConfirm}
                    className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] shadow-xs transition-colors"
                  >
                    {t.confirmYes}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowResetConfirm(false)}
                    className="px-3 py-1 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium text-[11px] shadow-2xs transition-colors"
                  >
                    {t.confirmCancel}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Service Switcher Tabs */}
        <div className="mt-4">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            {t.switchService}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {/* PAN Card Tab */}
            <button
              type="button"
              onClick={() => handleSelectService('pan')}
              className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                selectedService === 'pan'
                  ? 'border-emerald-500 bg-emerald-50/70 shadow-sm ring-1 ring-emerald-400'
                  : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100/80 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between gap-1 w-full">
                <div className="flex items-center gap-1.5">
                  <FileText className={`w-4 h-4 ${selectedService === 'pan' ? 'text-emerald-700' : 'text-slate-500'}`} />
                  <span className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-1">
                    {t.panCard}
                  </span>
                </div>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  panReadyCount === panTotalCount
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-white text-slate-600 border border-slate-200'
                }`}>
                  {panReadyCount}/{panTotalCount}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 mt-1 line-clamp-1">Rule 114</span>
            </button>

            {/* Ayushman Bharat Tab */}
            <button
              type="button"
              onClick={() => handleSelectService('ayushman')}
              className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                selectedService === 'ayushman'
                  ? 'border-emerald-500 bg-emerald-50/70 shadow-sm ring-1 ring-emerald-400'
                  : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100/80 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between gap-1 w-full">
                <div className="flex items-center gap-1.5">
                  <HeartHandshake className={`w-4 h-4 ${selectedService === 'ayushman' ? 'text-emerald-700' : 'text-slate-500'}`} />
                  <span className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-1">
                    {t.ayushmanBharat}
                  </span>
                </div>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  ayushReadyCount === ayushTotalCount
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-white text-slate-600 border border-slate-200'
                }`}>
                  {ayushReadyCount}/{ayushTotalCount}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 mt-1 line-clamp-1">PM-JAY & 70+</span>
            </button>
          </div>
        </div>

        {/* Progress Summary & Progress Bar */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
            <span className="text-slate-700">
              {readyCount} of {totalDocs} {t.docsReadyLabel}
            </span>
            <span className={`font-mono px-2 py-0.5 rounded-full text-[11px] ${
              isAllReady
                ? 'bg-emerald-100 text-emerald-800 font-bold'
                : 'bg-teal-100 text-teal-800 font-bold'
            }`}>
              {progressPercent}%
            </span>
          </div>

          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden p-[1px] border border-slate-200/80">
            <div
              className={`h-full rounded-full transition-all duration-400 ${
                isAllReady
                  ? 'bg-gradient-to-r from-emerald-500 to-green-600'
                  : 'bg-gradient-to-r from-teal-500 to-emerald-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* All Ready Celebration Banner */}
        {isAllReady && (
          <div className="mt-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2.5 animate-in fade-in duration-300">
            <Award className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <p className="font-medium leading-relaxed">
              {t.allDocsReady}
            </p>
          </div>
        )}

        {/* Checklist Items */}
        <div className="mt-4 space-y-2.5">
          {documents.map((doc) => {
            const isChecked = !!readyMap[doc.id];

            return (
              <div
                key={doc.id}
                onClick={() => toggleDocument(doc.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer select-none ${
                  isChecked
                    ? 'bg-emerald-50/50 border-emerald-300/80 text-slate-800 shadow-2xs'
                    : 'bg-slate-50/60 border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Interactive Checkbox */}
                  <div className="mt-0.5 flex-shrink-0">
                    {isChecked ? (
                      <CheckSquare className="w-5 h-5 fill-emerald-600 text-white transition-transform active:scale-95" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-400 transition-transform active:scale-95 hover:text-emerald-600" />
                    )}
                  </div>

                  {/* Document Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1">
                      <h4 className={`text-xs sm:text-sm font-bold leading-snug ${
                        isChecked ? 'line-through text-slate-500' : 'text-slate-900'
                      }`}>
                        {doc.name}
                      </h4>
                      <div>
                        {renderStatusBadge(doc.statusType)}
                      </div>
                    </div>

                    <p className={`text-xs leading-relaxed mt-1 ${
                      isChecked ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {doc.explanation}
                    </p>

                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-500">
                        {doc.category}
                      </span>
                      <span className={isChecked ? 'text-emerald-700 font-bold' : 'text-slate-400'}>
                        {isChecked ? `✓ ${t.statusCompleted}` : t.statusPending}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Portal Confirmation Advice */}
        <div className="mt-4 p-3 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-900 text-[11px] flex items-start gap-2">
          <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {t.portalConfirmationNote}
          </p>
        </div>

        {/* Safety & Guidance Notice */}
        <div className="mt-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-600 text-[11px] flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {t.checklistGuidanceNotice}
          </p>
        </div>

      </div>
    </div>
  );
}
