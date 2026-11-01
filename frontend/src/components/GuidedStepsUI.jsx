import React, { useState } from 'react';
import { CheckSquare, Square, ListOrdered, CheckCircle2 } from 'lucide-react';
import { UI_STRINGS } from '../translations/content';

export default function GuidedStepsUI({ steps = [], checklist = [], language = 'en' }) {
  const t = UI_STRINGS[language] || UI_STRINGS.en;
  const [checkedItems, setCheckedItems] = useState({});

  const toggleCheck = (id) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const totalChecklist = checklist.length;
  const completedChecklist = checklist.filter((item) => checkedItems[item.id]).length;
  const progressPercent = totalChecklist > 0 ? Math.round((completedChecklist / totalChecklist) * 100) : 0;

  if (steps.length === 0 && checklist.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Document Checklist Panel */}
      {checklist.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                {t.checklistTitle}
              </h3>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              {completedChecklist} of {totalChecklist} Ready
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Checklist Items */}
          <div className="mt-3 space-y-2">
            {checklist.map((item) => {
              const isChecked = !!checkedItems[item.id];
              return (
                <label
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={`flex items-start gap-3 p-2.5 rounded-xl border cursor-pointer select-none transition-all ${
                    isChecked
                      ? 'bg-emerald-50/60 border-emerald-300 text-slate-900'
                      : 'bg-slate-50/70 border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="mt-0.5 text-emerald-600 flex-shrink-0">
                    {isChecked ? (
                      <CheckSquare className="w-5 h-5 fill-emerald-600 text-white" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                  <div className="text-xs sm:text-sm font-medium leading-snug">
                    <span className={isChecked ? 'line-through text-slate-500' : ''}>
                      {item.label}
                    </span>
                    {item.required && (
                      <span className="ml-1.5 text-[10px] uppercase font-bold text-orange-600 bg-orange-50 px-1.5 py-0.2 rounded border border-orange-200">
                        Mandatory
                      </span>
                    )}
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Step by Step Guidance */}
      {steps.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <ListOrdered className="w-5 h-5 text-orange-600" />
            <h3 className="font-bold text-slate-800 text-sm sm:text-base">
              {t.stepsTitle}
            </h3>
          </div>

          <div className="mt-4 space-y-3">
            {steps.map((step, idx) => (
              <div
                key={step.id || idx}
                className="flex items-start gap-3 p-3 rounded-xl bg-orange-50/40 border border-orange-100 hover:bg-orange-50/70 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-orange-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
                  {idx + 1}
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                    {step.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
