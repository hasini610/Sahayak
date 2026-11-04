import React, { useState, useEffect } from 'react';
import SmartDocumentChecklist from '../components/SmartDocumentChecklist';
import ApplicationJourneyTracker from '../components/ApplicationJourneyTracker';

export default function MyServices({ language, initialSection = 'myservices' }) {
  const [currentWorkflow, setCurrentWorkflow] = useState('pan');

  useEffect(() => {
    if (initialSection === 'checklist') {
      const el = document.getElementById('document-checklist-section');
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
      }
    } else if (initialSection === 'tracker') {
      const el = document.getElementById('journey-tracker-section');
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
      }
    }
  }, [initialSection]);

  return (
    <div className="space-y-6">
      <div id="document-checklist-section">
        <SmartDocumentChecklist
          language={language}
          activeService={currentWorkflow}
          onServiceChange={setCurrentWorkflow}
        />
      </div>
      <div id="journey-tracker-section">
        <ApplicationJourneyTracker
          language={language}
          activeService={currentWorkflow}
          onServiceChange={setCurrentWorkflow}
        />
      </div>
    </div>
  );
}
