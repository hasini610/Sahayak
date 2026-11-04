import React, { useRef, useState, useEffect } from 'react';
import { AlertTriangle, FileText, CheckCircle2, RefreshCw, Trash2, FileCheck } from 'lucide-react';
import { UI_STRINGS } from '../translations/content';

/**
 * Drag‑and‑drop + file input component.
 * Props:
 *   onFileSelect(file: File | null) – called when a valid file is chosen or removed.
 *   language – locale key (en/hi/te).
 *   selectedFile – optional controlled file from parent.
 */
export default function UploadArea({ onFileSelect, language, selectedFile: controlledFile }) {
  const t = UI_STRINGS[language] || UI_STRINGS.en;
  const inputRef = useRef(null);
  const [internalFile, setInternalFile] = useState(null);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  // Use controlled file if passed, otherwise internal state
  const activeFile = controlledFile !== undefined ? controlledFile : internalFile;

  const maxSize = 10 * 1024 * 1024; // 10 MiB
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  // Clean up object URL when previewUrl changes or component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Sync preview when activeFile changes
  useEffect(() => {
    if (!activeFile) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl('');
      }
      return;
    }

    if (activeFile.type && activeFile.type.startsWith('image/')) {
      const url = URL.createObjectURL(activeFile);
      setPreviewUrl(url);
    } else {
      setPreviewUrl('');
    }
  }, [activeFile]);

  const validate = (file) => {
    if (!allowedTypes.includes(file.type)) {
      setError(t.fileTypeError || 'Unsupported file type. Please upload PDF, JPG, JPEG, PNG, or WebP.');
      return false;
    }
    if (file.size > maxSize) {
      setError(t.sizeError || 'File is too large. Maximum allowed size is 10 MB.');
      return false;
    }
    setError('');
    return true;
  };

  const handleFiles = (files) => {
    const file = files[0];
    if (!file) return;
    if (!validate(file)) return;

    setInternalFile(file);
    if (onFileSelect) {
      onFileSelect(file);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
    }
    setInternalFile(null);
    setError('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    if (onFileSelect) {
      onFileSelect(null);
    }
  };

  const handleReplace = (e) => {
    e.stopPropagation();
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleFiles(e.dataTransfer.files);
  };

  const onChange = (e) => {
    handleFiles(e.target.files);
  };

  // Helper to format file size
  const formatFileSize = (bytes) => {
    if (!bytes && bytes !== 0) return '';
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Helper to format user-friendly file type
  const formatFileType = (mime) => {
    switch (mime) {
      case 'application/pdf':
        return 'PDF Document';
      case 'image/png':
        return 'PNG Image';
      case 'image/jpeg':
      case 'image/jpg':
        return 'JPEG Image';
      case 'image/webp':
        return 'WebP Image';
      default:
        return mime || 'Document';
    }
  };

  return (
    <div className="space-y-3">
      {/* Hidden file input */}
      <input
        type="file"
        accept={allowedTypes.join(',')}
        ref={inputRef}
        style={{ display: 'none' }}
        onChange={onChange}
      />

      {activeFile ? (
        /* FILE SELECTED STATE */
        <div className="border-2 border-emerald-300 bg-emerald-50/40 rounded-2xl p-5 transition-all shadow-xs">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
            {/* Thumbnail / Icon & File Details */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left min-w-0">
              {previewUrl ? (
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl border border-emerald-200 overflow-hidden bg-white shadow-2xs flex-shrink-0">
                  <img
                    src={previewUrl}
                    alt="Document preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-orange-100 text-orange-600 border border-orange-200 flex items-center justify-center flex-shrink-0 shadow-2xs">
                  <FileCheck className="w-8 h-8 sm:w-10 sm:h-10 text-orange-600" />
                </div>
              )}

              <div className="min-w-0 space-y-1">
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{t.selectedFileLabel || 'Selected Document'}</span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate max-w-xs sm:max-w-md md:max-w-lg">
                  {activeFile.name}
                </h3>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs font-semibold text-slate-600">
                  <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 shadow-2xs">
                    {formatFileType(activeFile.type)}
                  </span>
                  <span>•</span>
                  <span>{formatFileSize(activeFile.size)}</span>
                </div>
              </div>
            </div>

            {/* Actions: Replace & Remove */}
            <div className="flex items-center gap-2 self-center sm:self-start flex-shrink-0">
              <button
                type="button"
                onClick={handleReplace}
                className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs hover:border-orange-500 transition-colors"
                title={t.replaceFile || 'Replace file'}
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                <span>{t.replaceFile || 'Replace'}</span>
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="px-3 py-1.5 rounded-lg border border-red-200 bg-white hover:bg-red-50 text-red-600 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
                title={t.removeFile || 'Remove file'}
              >
                <Trash2 className="w-3.5 h-3.5 text-red-500" />
                <span>{t.removeFile || 'Remove'}</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* DEFAULT DRAG-AND-DROP STATE (NO FILE SELECTED) */
        <div
          className="border-2 border-dashed border-slate-300 rounded-2xl p-6 sm:p-8 text-center cursor-pointer hover:border-orange-500 hover:bg-orange-50/20 transition-all group"
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          onClick={() => inputRef.current && inputRef.current.click()}
          role="button"
          tabIndex={0}
          aria-label="Upload document area"
        >
          <div className="w-14 h-14 mx-auto rounded-2xl bg-orange-50 text-orange-500 border border-orange-100 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-2xs">
            <FileText className="w-7 h-7 text-orange-600" />
          </div>
          <p className="text-sm font-semibold text-slate-800 mb-1">
            {t.uploadPrompt}
          </p>
          <p className="text-xs text-slate-500">
            Supported formats: PDF, JPEG, PNG, WebP (Max 10 MB)
          </p>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs sm:text-sm text-red-700 font-medium">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
