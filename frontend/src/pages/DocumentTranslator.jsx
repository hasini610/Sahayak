import React, { useState } from 'react';
import { AlertCircle, FileText, Info } from 'lucide-react';
import UploadArea from '../components/UploadArea';
import ResultTabs from '../components/ResultTabs';
import KeyInfoPanel from '../components/KeyInfoPanel';
import { UI_STRINGS } from '../translations/content';

/**
 * Page for the Government Document Translator feature.
 * Props:
 *   language: 'en' | 'hi' | 'te'
 */
export default function DocumentTranslator({ language }) {
  const t = UI_STRINGS[language] || UI_STRINGS.en;
  const TRANSLATOR_ENABLED = false; // Safeguard: backend endpoint /api/document/process is not implemented
  const [file, setFile] = useState(null);
  const [targetLang, setTargetLang] = useState('en');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('original');

  const handleFileSelect = (selected) => {
    setFile(selected);
    setResult(null);
    setError('');
  };

  // Translate handler – strictly guarded; backend is not yet implemented
  const handleTranslate = async () => {
    if (!TRANSLATOR_ENABLED) {
      setError(t.backendPending || 'Backend integration pending. Document translation is currently unavailable.');
      return;
    }
    if (!file) {
      setError(t.fileTypeError);
      return;
    }
    setLoading(true);
    setError('');
    const form = new FormData();
    form.append('file', file);
    form.append('language', targetLang);
    try {
      const resp = await fetch('/api/document/process', {
        method: 'POST',
        body: form,
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      setResult(data);
      setActiveTab('original');
    } catch (e) {
      console.error(e);
      setError(t.uploadFailed);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { key: 'original', label: t.originalTab },
    { key: 'translation', label: t.translationTab },
    { key: 'explanation', label: t.explanationTab },
    { key: 'keyInfo', label: t.keyInfoTab },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Title & Description */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          {t.docTranslatorTitle}
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          {t.docTranslatorDesc}
        </p>
      </div>

      {/* Prominent Service Availability Notice */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-sm space-y-2 shadow-xs">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <span className="font-bold text-xs uppercase tracking-wide bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full border border-amber-300">
            {t.serviceUnavailableBadge || 'Feature in Development / Service Unavailable'}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-amber-800 leading-relaxed font-medium pl-7">
          {t.translatorUnavailableNotice || t.backendPending}
        </p>
      </div>

      {/* Upload Area for client-side preview testing */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <UploadArea onFileSelect={handleFileSelect} language={language} />

        {/* Target language selector */}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <label htmlFor="targetLang" className="text-xs sm:text-sm font-semibold text-slate-700">
            {t.chooseLanguage}:
          </label>
          <select
            id="targetLang"
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-xs cursor-pointer"
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
            <option value="te">తెలుగు</option>
          </select>
        </div>

        {/* Translate Action Button - Explicitly Disabled with Transparent Notice */}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleTranslate}
            disabled={true}
            className="px-5 py-2.5 bg-slate-200 text-slate-500 rounded-xl font-bold text-xs sm:text-sm cursor-not-allowed opacity-80 flex items-center gap-2 border border-slate-300 shadow-2xs"
            title={t.backendPending}
          >
            <span>{t.translateBtn}</span>
            <span className="text-[10px] bg-slate-300 text-slate-700 px-2 py-0.5 rounded-full font-semibold">
              Unavailable
            </span>
          </button>
          <span className="text-xs text-slate-500">
            {t.backendPending}
          </span>
        </div>

        {error && (
          <p className="mt-3 text-xs sm:text-sm text-red-600 font-medium">
            {error}
          </p>
        )}
      </div>

      {/* Results (Only displayed if result object is present) */}
      {result && (
        <div className="mt-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <ResultTabs tabs={tabs} activeKey={activeTab} onChange={setActiveTab} language={language} />
          <div className="p-4 border border-slate-200 rounded-xl bg-slate-50 mt-2 min-h-[200px]">
            {activeTab === 'original' && <pre className="whitespace-pre-wrap text-xs text-slate-800 font-mono">{result.original}</pre>}
            {activeTab === 'translation' && <pre className="whitespace-pre-wrap text-xs text-slate-800 font-mono">{result.translation}</pre>}
            {activeTab === 'explanation' && <pre className="whitespace-pre-wrap text-xs text-slate-800 font-mono">{result.explanation}</pre>}
            {activeTab === 'keyInfo' && <KeyInfoPanel keyInfo={result.keyInfo} />}
          </div>
        </div>
      )}
    </div>
  );
}
