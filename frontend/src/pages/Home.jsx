import React, { useState } from 'react';
import AssistantInterface from '../components/AssistantInterface';
import LandingPage from '../components/LandingPage';

export default function Home({ language, fontSize, isAudioMuted, setLanguage, setCurrentPage }) {
  const [showLanding, setShowLanding] = useState(true);

  const handleStart = () => setShowLanding(false);
  const handleExplore = () => {
    setShowLanding(false);
    setCurrentPage('explore');
  };

  return (
    showLanding ? (
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
    )
  );
}
