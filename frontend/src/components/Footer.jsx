import React from 'react';
// Removed unused react-router-dom import

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 py-6 px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-500">
      <p>© 2026 Sahayak. All rights reserved.</p>
      <nav className="mt-2 flex justify-center gap-4">
        <a href="https://github.com/moksha013/Sahayak" target="_blank" rel="noopener noreferrer" className="hover:underline">GitHub</a>
        <a href="/privacy" className="hover:underline">Privacy</a>
        <a href="/terms" className="hover:underline">Terms</a>
      </nav>
    </footer>
  );
}
