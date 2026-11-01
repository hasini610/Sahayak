import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import AssistantInterface from './components/AssistantInterface';
import { checkBackendHealth } from './services/api';

export default function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'assistant'
  const [language, setLanguage] = useState('hi'); // Default to Hindi for Sahayak
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [backendStatus, setBackendStatus] = useState(null);

  useEffect(() => {
    checkBackendHealth().then((res) => {
      setBackendStatus(res?.status || 'mock_mode');
    });
  }, []);

  return (
    <div className={`min-h-screen flex flex-col bg-slate-50 transition-colors ${highContrast ? 'high-contrast bg-neutral-900 text-yellow-300' : ''}`}>
      {/* Navigation Header */}
      <Navbar
        language={language}
        setLanguage={setLanguage}
        fontSize={fontSize}
        setFontSize={setFontSize}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
        isAudioMuted={isAudioMuted}
        setIsAudioMuted={setIsAudioMuted}
        onReset={() => setCurrentView('landing')}
      />

      {/* Main View Area */}
      <main className="flex-1 pb-12">
        {currentView === 'landing' ? (
          <LandingPage
            language={language}
            setLanguage={setLanguage}
            onStart={() => setCurrentView('assistant')}
          />
        ) : (
          <AssistantInterface
            language={language}
            fontSize={fontSize}
            isAudioMuted={isAudioMuted}
          />
        )}
      </main>

      {/* Footer & Status Bar */}
      <footer className="border-t border-slate-200/80 bg-white/60 py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-semibold text-slate-700">Sahayak Voice Assistant</span>
            <span>• Hackathon Frontend (Moksha)</span>
          </div>
          <div className="text-slate-400">
            Node / Express Backend Status:{' '}
            <span className="font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              {backendStatus === 'ok' ? 'Online (Express :5000)' : 'Standalone Ready'}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
