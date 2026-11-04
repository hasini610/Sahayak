import React, { useState, useEffect } from 'react';
import AssistantInterface from '../components/AssistantInterface';
import LandingPage from '../components/LandingPage';

export default function Home({
  language,
  fontSize,
  isAudioMuted,
  setLanguage,
  setCurrentPage,
  initialShowLanding = true
}) {
  const [showLanding, setShowLanding] = useState(initialShowLanding);

  useEffect(() => {
    setShowLanding(initialShowLanding);
  }, [initialShowLanding]);

  const handleStart = () => {
    setShowLanding(false);
    setCurrentPage('voice');
  };

  const handleExplore = () => {
    setShowLanding(false);
    setCurrentPage('explore');
  };

  return showLanding ? (
    <LandingPage
      language={language}
      setLanguage={setLanguage}
      onStart={handleStart}
      onExplore={handleExplore}
    />
  ) : (
    <AssistantInterface
      language={language}
      fontSize={fontSize}
      isAudioMuted={isAudioMuted}
    />
  );
}
