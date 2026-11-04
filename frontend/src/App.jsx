import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MyServices from './pages/MyServices';
import Explore from './pages/Explore';
import DocumentTranslator from './pages/DocumentTranslator';
import Sidebar from './components/Sidebar';
import { checkBackendHealth } from './services/api';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home' | 'voice' | 'myservices' | 'checklist' | 'tracker' | 'explore' | 'centre-finder' | 'verified-sources' | 'doc-translator'
  const [language, setLanguage] = useState('hi');
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [backendStatus, setBackendStatus] = useState(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    checkBackendHealth().then((res) => setBackendStatus(res?.status || 'mock_mode'));
  }, []);

  const handleReset = () => setCurrentPage('home');

  return (
    <div className={`min-h-screen flex bg-[#F8FAFC] transition-colors ${highContrast ? 'high-contrast bg-neutral-900 text-yellow-300' : ''}`}>
      {/* Sidebar (desktop persistent & mobile drawer) */}
      <Sidebar
        language={language}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Main app layout area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Navigation Header */}
        <Navbar
          language={language}
          setLanguage={setLanguage}
          onReset={handleReset}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onToggleSidebar={() => setMobileSidebarOpen((prev) => !prev)}
        />

        {/* Main View Area */}
        <main className="flex-1 pb-12 p-4 sm:p-6 max-w-7xl w-full mx-auto">
          {(currentPage === 'home' || currentPage === 'voice') && (
            <Home
              language={language}
              fontSize={fontSize}
              isAudioMuted={isAudioMuted}
              setLanguage={setLanguage}
              setCurrentPage={setCurrentPage}
              initialShowLanding={currentPage !== 'voice'}
            />
          )}

          {(currentPage === 'myservices' || currentPage === 'checklist' || currentPage === 'tracker') && (
            <MyServices language={language} initialSection={currentPage} />
          )}

          {(currentPage === 'explore' || currentPage === 'centre-finder' || currentPage === 'verified-sources') && (
            <Explore language={language} setCurrentPage={setCurrentPage} initialSection={currentPage} />
          )}

          {currentPage === 'doc-translator' && (
            <DocumentTranslator language={language} />
          )}
        </main>

        {/* Footer & Status Bar */}
        <footer className="border-t border-slate-200/80 bg-white/60 py-4 px-4 text-center text-xs text-slate-500 mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-semibold text-slate-700">Sahayak Voice Assistant</span>
            </div>
            <div className="text-slate-400">
              Backend Status:{' '}
              <span className="font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {backendStatus === 'ok' ? 'Online (Express :5000)' : 'Standalone Ready'}
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
