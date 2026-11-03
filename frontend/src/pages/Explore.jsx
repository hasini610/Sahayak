import React, { useEffect, useState } from 'react';
import SourcesPanel from '../components/SourcesPanel';
import CentreFinder from '../components/CentreFinder';

export default function Explore({ language }) {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // TODO: replace the endpoint with the actual backend route that returns official sources
    fetch('/api/sources')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        // Prefer specific source lists; fall back to generic 'sources' array if present
        const srcList = data.panCardSources || data.sources || [];
        setSources(srcList);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {loading && <p>Loading official sources…</p>}
      {error && <p className="text-red-600">Error: {error}</p>}
      <SourcesPanel language={language} sources={sources} />
      <CentreFinder language={language} />
    </div>
  );
}
