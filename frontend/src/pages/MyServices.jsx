import React, { useState } from 'react';
import SmartDocumentChecklist from '../components/SmartDocumentChecklist';
import ApplicationJourneyTracker from '../components/ApplicationJourneyTracker';

export default function MyServices({ language }) {
  const [currentWorkflow, setCurrentWorkflow] = useState('pan'); // default workflow

  return (
    <div className="space-y-6">
      <SmartDocumentChecklist
        language={language}
        activeService={currentWorkflow}
        onServiceChange={setCurrentWorkflow}
      />
      <ApplicationJourneyTracker
        language={language}
        activeService={currentWorkflow}
        onServiceChange={setCurrentWorkflow}
      />
    </div>
  );
}
