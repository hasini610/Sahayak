import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Square,
  RotateCcw,
  ExternalLink,
  ShieldAlert,
  Sparkles,
  AlertTriangle,
  Award,
  FileText,
  HeartHandshake
} from 'lucide-react';
import { UI_STRINGS } from '../translations/content';
import {
  JOURNEY_WORKFLOWS,
  getJourneyProgress,
  saveJourneyProgress,
  clearJourneyProgress
} from '../data/workflowJourneys';

export default function ApplicationJourneyTracker({
  language = 'en',
  activeService = null,
  onServiceChange = null
}) {
  const t = UI_STRINGS[language] || UI_STRINGS.en;

  // Selected service: 'pan' | 'ayushman'
  const [selectedService, setSelectedService] = useState('pan');

  // Completed steps map for each service: { [stepId]: boolean }
  const [panCompleted, setPanCompleted] = useState({});
  const [ayushmanCompleted, setAyushmanCompleted] = useState({});

  // Reset confirmation state
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Sync with activeService prop if supplied from assistant chat
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
    setPanCompleted(getJourneyProgress('pan'));
    setAyushmanCompleted(getJourneyProgress('ayushman'));
  }, []);

  const handleSelectService = (serviceId) => {
    setSelectedService(serviceId);
    setShowResetConfirm(false);
    if (onServiceChange) {
      onServiceChange(serviceId);
    }
  };

  const currentWorkflowData = JOURNEY_WORKFLOWS[selectedService] || JOURNEY_WORKFLOWS.pan;
  const localizedData = currentWorkflowData[language] || currentWorkflowData.en;
  const steps = localizedData.steps || [];

  const completedMap = selectedService === 'pan' ? panCompleted : ayushmanCompleted;

  const totalSteps = steps.length;
  const completedCount = steps.filter((step) => !!completedMap[step.id]).length;
  const progressPercent = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;
  const isAllCompleted = totalSteps > 0 && completedCount === totalSteps;

  // Calculate first incomplete step index (to determine 'current' step)
  const firstIncompleteIndex = steps.findIndex((step) => !completedMap[step.id]);

  // Toggle step completion and persist to localStorage
  const toggleStep = (stepId) => {
    const updated = {
      ...completedMap,
      [stepId]: !completedMap[stepId]
    };

    if (selectedService === 'pan') {
      setPanCompleted(updated);
      saveJourneyProgress('pan', updated);
    } else {
      setAyushmanCompleted(updated);
      saveJourneyProgress('ayushman', updated);
    }
  };

  // Reset progress for the currently selected service
  const handleResetConfirm = () => {
    clearJourneyProgress(selectedService);
    if (selectedService === 'pan') {
      setPanCompleted({});
    } else {
      setAyushmanCompleted({});
    }
    setShowResetConfirm(false);
  };

  // Calculate summary counts for tab badges
  const panStepsCount = JOURNEY_WORKFLOWS.pan.en.steps.length;
  const panDoneCount = JOURNEY_WORKFLOWS.pan.en.steps.filter((s) => panCompleted[s.id]).length;

  const ayushStepsCount = JOURNEY_WORKFLOWS.ayushman.en.steps.length;
  const ayushDoneCount = JOURNEY_WORKFLOWS.ayushman.en.steps.filter((s) => ayushmanCompleted[s.id]).length;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden transition-all">
      {/* Tricolour Accent Top Ribbon */}
      <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-600" />

      <div className="p-4 sm:p-5">
        {/* Header & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight">
                {t.trackerTitle}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {t.trackerSubtitle}
            </p>
          </div>

          {/* Reset Progress Button */}
          {completedCount > 0 && !showResetConfirm && (
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl text-slate-600 hover:text-red-700 bg-slate-100 hover:bg-red-50 border border-slate-200/80 hover:border-red-200 transition-colors shadow-2xs self-start sm:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.resetProgress}</span>
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
                  {t.resetConfirmQuestion}
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

        {/* Service Selector Tabs */}
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
                  ? 'border-orange-500 bg-orange-50/70 shadow-sm ring-1 ring-orange-400'
                  : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100/80 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between gap-1 w-full">
                <div className="flex items-center gap-1.5">
                  <FileText className={`w-4 h-4 ${selectedService === 'pan' ? 'text-orange-600' : 'text-slate-500'}`} />
                  <span className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-1">
                    {t.panCard}
                  </span>
                </div>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  panDoneCount === panStepsCount
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-white text-slate-600 border border-slate-200'
                }`}>
                  {panDoneCount}/{panStepsCount}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 mt-1 line-clamp-1">Form 49A</span>
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
                  <HeartHandshake className={`w-4 h-4 ${selectedService === 'ayushman' ? 'text-emerald-600' : 'text-slate-500'}`} />
                  <span className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-1">
                    {t.ayushmanBharat}
                  </span>
                </div>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  ayushDoneCount === ayushStepsCount
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-white text-slate-600 border border-slate-200'
                }`}>
                  {ayushDoneCount}/{ayushStepsCount}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 mt-1 line-clamp-1">PM-JAY ₹5L</span>
            </button>
          </div>
        </div>

        {/* Visual Progress Bar & Summary */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
            <span className="text-slate-700">
              {completedCount} of {totalSteps} {t.stepsCompletedLabel}
            </span>
            <span className={`font-mono px-2 py-0.5 rounded-full text-[11px] ${
              isAllCompleted
                ? 'bg-emerald-100 text-emerald-800 font-bold'
                : 'bg-orange-100 text-orange-800 font-bold'
            }`}>
              {progressPercent}%
            </span>
          </div>

          {/* Saffron & Emerald Progress Track */}
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden p-[1px] border border-slate-200/80">
            <div
              className={`h-full rounded-full transition-all duration-400 ${
                isAllCompleted
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                  : 'bg-gradient-to-r from-orange-500 to-amber-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Milestone Celebration Banner */}
        {isAllCompleted && (
          <div className="mt-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2.5 animate-in fade-in duration-300">
            <Award className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <p className="font-medium leading-relaxed">
              {t.allStepsDone}
            </p>
          </div>
        )}

        {/* Sequence of Numbered Steps */}
        <div className="mt-4 space-y-2.5">
          {steps.map((step, idx) => {
            const isCompleted = !!completedMap[step.id];
            const isCurrent = !isCompleted && idx === firstIncompleteIndex;
            const isPending = !isCompleted && !isCurrent;

            // Visual style variants
            let cardClasses = 'border-slate-200 bg-slate-50/60 hover:border-slate-300 text-slate-600';
            let badgeClasses = 'bg-slate-200 text-slate-600';
            let statusBadge = (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                {t.statusPending}
              </span>
            );

            if (isCompleted) {
              cardClasses = 'border-emerald-300/80 bg-emerald-50/40 text-slate-800 shadow-2xs';
              badgeClasses = 'bg-emerald-600 text-white font-bold';
              statusBadge = (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200/80 flex items-center gap-1">
                  ✓ {t.statusCompleted}
                </span>
              );
            } else if (isCurrent) {
              cardClasses = 'border-orange-500 bg-orange-50/70 text-slate-900 shadow-sm ring-2 ring-orange-200/80';
              badgeClasses = 'bg-orange-600 text-white font-bold ring-2 ring-orange-300';
              statusBadge = (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-600 text-white shadow-2xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  {t.statusCurrent}
                </span>
              );
            }

            return (
              <div
                key={step.id}
                className={`p-3.5 rounded-2xl border transition-all select-none ${cardClasses}`}
              >
                <div className="flex items-start gap-3">
                  {/* Interactive Checkbox */}
                  <button
                    type="button"
                    onClick={() => toggleStep(step.id)}
                    aria-label={`Mark step ${idx + 1} ${isCompleted ? 'incomplete' : 'complete'}`}
                    className="mt-0.5 flex-shrink-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500 rounded"
                  >
                    {isCompleted ? (
                      <CheckSquare className="w-5 h-5 fill-emerald-600 text-white transition-transform active:scale-95" />
                    ) : (
                      <Square className={`w-5 h-5 ${isCurrent ? 'text-orange-500' : 'text-slate-400'} transition-transform active:scale-95 hover:text-orange-600`} />
                    )}
                  </button>

                  {/* Step Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1">
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-md text-[11px] flex items-center justify-center flex-shrink-0 ${badgeClasses}`}>
                          {idx + 1}
                        </span>
                        <h4 className={`text-xs sm:text-sm font-bold leading-snug ${
                          isCompleted ? 'line-through text-slate-500' : isCurrent ? 'text-slate-900' : 'text-slate-700'
                        }`}>
                          {step.title}
                        </h4>
                      </div>
                      <div>
                        {statusBadge}
                      </div>
                    </div>

                    <p className={`text-xs leading-relaxed mt-1 ${
                      isCompleted ? 'text-slate-400' : isCurrent ? 'text-slate-700' : 'text-slate-500'
                    }`}>
                      {step.desc}
                    </p>

                    {/* Venue tag & Official portal link */}
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                        🏛️ {t.officialActionBadge}
                      </span>

                      {step.portalUrl && (
                        <a
                          href={step.portalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-600 hover:text-orange-800 underline hover:no-underline"
                        >
                          <span>Portal</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Guidance-Only Disclaimer */}
        <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-600 text-[11px] flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {t.trackerGuidanceNote}
          </p>
        </div>

      </div>
    </div>
  );
}
