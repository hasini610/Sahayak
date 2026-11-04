import React, { useEffect, useState } from 'react';
import SourcesPanel from '../components/SourcesPanel';
import CentreFinder from '../components/CentreFinder';

export default function Explore({ language, initialSection = 'explore' }) {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialSection === 'centre-finder') {
      const el = document.getElementById('centre-finder-section');
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
      }
    } else if (initialSection === 'verified-sources') {
      const el = document.getElementById('verified-sources-section');
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
      }
    }
  }, [initialSection]);

  useEffect(() => {
    fetch('/api/sources')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const srcList = [];
        if (Array.isArray(data.panCardSources)) srcList.push(...data.panCardSources);
        if (Array.isArray(data.ayushmanSources)) srcList.push(...data.ayushmanSources);
        if (Array.isArray(data.boundarySources)) srcList.push(...data.boundarySources);
        if (srcList.length === 0 && Array.isArray(data.sources)) srcList.push(...data.sources);
        setSources(srcList);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {loading && <p className="text-xs text-slate-500 font-medium">Loading official sources…</p>}
      {error && <p className="text-red-600 text-xs font-medium">Error: {error}</p>}
      <div id="verified-sources-section">
        <SourcesPanel language={language} sources={sources} />
      </div>
      <div id="centre-finder-section">
        <CentreFinder language={language} />
      </div>
    </div>
  );
}
