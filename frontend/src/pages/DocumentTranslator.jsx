import React, { useState } from 'react';
import { AlertCircle, FileText, Info, CheckCircle2, ShieldCheck } from 'lucide-react';
import UploadArea from '../components/UploadArea';
import ResultTabs from '../components/ResultTabs';
import KeyInfoPanel from '../components/KeyInfoPanel';
import { UI_STRINGS } from '../translations/content';
import { processDocumentUpload } from '../services/api';

/**
 * Page for the Government Document Translator feature.
 * Props:
 *   language: 'en' | 'hi' | 'te'
 */
export default function DocumentTranslator({ language }) {
  const t = UI_STRINGS[language] || UI_STRINGS.en;
  const TRANSLATOR_ENABLED = true;
  const [file, setFile] = useState(null);
  const [targetLang, setTargetLang] = useState('en');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('translation');

  const handleFileSelect = (selected) => {
    setFile(selected);
    // When a file is changed or removed, clear stale results and errors
    setResult(null);
    setError('');
  };

  const handleTranslate = async () => {
    if (!TRANSLATOR_ENABLED) {
      setError(t.backendPending || 'Backend integration pending. Document translation is currently unavailable.');
      return;
    }
    if (!file) {
      setError(t.fileTypeError || 'Please select a file to translate.');
      return;
    }
    if (loading) {
      return; // Prevent duplicate submissions
    }

    // Clear previous results and errors before beginning a new request
    setLoading(true);
    setResult(null);
    setError('');

    try {
      const data = await processDocumentUpload(file, targetLang);

      // Validate that the returned data is truly successful and contains translation
      if (!data || !data.success || !data.translation) {
        throw new Error(data?.error || 'Document processing returned an incomplete response. Please try again.');
      }

      setResult(data);
      setActiveTab('translation');
    } catch (e) {
      console.error('Translation failed:', e);
      // Ensure result is strictly cleared on any failure
      setResult(null);
      setError(e.message || t.uploadFailed);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { key: 'translation', label: t.translationTab },
    { key: 'explanation', label: t.explanationTab },
    { key: 'keyInfo', label: t.keyInfoTab },
    { key: 'original', label: t.originalTab },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Title & Description */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          {t.docTranslatorTitle}
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          {t.docTranslatorDesc}
        </p>
      </div>

      {/* Official Privacy & Verification Notice (Non-duplicated) */}
      <div className="p-4 rounded-2xl bg-orange-50/80 border border-orange-200 text-orange-950 text-sm space-y-1.5 shadow-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-orange-600 flex-shrink-0" />
          <span className="font-bold text-xs uppercase tracking-wide bg-orange-100 text-orange-800 px-2.5 py-0.5 rounded-full border border-orange-300">
            {t.groundedInOfficialBadge || 'Grounded in Official Sources'}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-orange-900 leading-relaxed font-medium pl-7">
          {t.docPrivacyNotice || 'Privacy & Accuracy Notice: Uploaded files are processed in-memory and never saved to disk. AI translations and summaries are for citizen guidance—always verify statutory details with the official document.'}
        </p>
      </div>

      {/* Upload Area */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <UploadArea
          onFileSelect={handleFileSelect}
          language={language}
          selectedFile={file}
        />

        {/* Target language selector */}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <label htmlFor="targetLang" className="text-xs sm:text-sm font-semibold text-slate-700">
            {t.chooseLanguage}:
          </label>
          <select
            id="targetLang"
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            disabled={loading}
            className={`border border-slate-300 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-xs cursor-pointer ${
              loading ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी (Hindi)</option>
            <option value="te">తెలుగు (Telugu)</option>
          </select>
        </div>

        {/* Translate Action Button */}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleTranslate}
            disabled={!file || loading}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all ${
              !file || loading
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                : 'bg-orange-600 hover:bg-orange-700 active:scale-98 text-white shadow-orange-600/20 cursor-pointer'
            }`}
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{t.processing}</span>
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                <span>{t.translateBtn}</span>
              </>
            )}
          </button>
          {loading && (
            <span className="text-xs text-slate-500 animate-pulse font-medium">
              {t.processing}
            </span>
          )}
        </div>

        {/* Error message (only displayed when error exists) */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs sm:text-sm text-red-700 font-medium">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Results (Only displayed after receiving and validating a successful response) */}
      {!loading && result && result.success && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span className="font-bold text-sm text-slate-800">
                Document Processed Successfully
              </span>
            </div>
            {result.detectedLanguage && (
              <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full border border-slate-200">
                Detected: {result.detectedLanguage}
              </span>
            )}
          </div>

          <ResultTabs tabs={tabs} activeKey={activeTab} onChange={setActiveTab} language={language} />

          <div className="p-4 border border-slate-200 rounded-xl bg-slate-50 min-h-[200px]">
            {activeTab === 'translation' && (
              <pre className="whitespace-pre-wrap text-xs sm:text-sm text-slate-800 font-sans leading-relaxed">
                {result.translation}
              </pre>
            )}
            {activeTab === 'explanation' && (
              <div className="whitespace-pre-wrap text-xs sm:text-sm text-slate-800 font-sans leading-relaxed">
                {result.explanation}
              </div>
            )}
            {activeTab === 'keyInfo' && (
              <KeyInfoPanel keyInfo={result.keyInfo} />
            )}
            {activeTab === 'original' && (
              <pre className="whitespace-pre-wrap text-xs sm:text-sm text-slate-800 font-sans leading-relaxed">
                {result.original}
              </pre>
            )}
          </div>

          {/* Legibility / Quality Warnings if any */}
          {result.warnings && result.warnings.length > 0 && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Notice on Document Legibility</span>
              </div>
              <ul className="list-disc list-inside pl-1 space-y-0.5">
                {result.warnings.map((w, idx) => (
                  <li key={idx}>{w}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Statutory Disclaimer */}
          {result.disclaimer && (
            <p className="text-[11px] text-slate-400 italic">
              {result.disclaimer}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
