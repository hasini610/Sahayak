import React from 'react';
import { languages, UI_STRINGS } from '../translations/content';
import { Globe, Menu } from 'lucide-react';

export default function Navbar({
  language,
  setLanguage,
  onReset,
  currentPage,
  setCurrentPage,
  onToggleSidebar,
}) {
  const t = UI_STRINGS[language] || UI_STRINGS.en;

  const isHomeActive = currentPage === 'home' || currentPage === 'voice';
  const isMyServicesActive = currentPage === 'myservices' || currentPage === 'checklist' || currentPage === 'tracker';
  const isExploreActive = currentPage === 'explore' || currentPage === 'centre-finder' || currentPage === 'verified-sources';

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Left section: Mobile hamburger + Logo & Identity */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Sidebar Hamburger Toggle */}
            {onToggleSidebar && (
              <button
                type="button"
                onClick={onToggleSidebar}
                className="md:hidden p-2 -ml-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                aria-label="Open navigation sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            {/* Logo & Identity */}
            <div
              onClick={onReset}
              className="flex items-center gap-2 sm:gap-3 cursor-pointer group focus:outline-none"
              role="button"
              tabIndex={0}
              aria-label="Sahayak Home"
            >
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-orange-600 via-amber-500 to-emerald-600 p-[2px] shadow-sm group-hover:scale-105 transition-transform flex-shrink-0">
                <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center font-black text-lg sm:text-xl text-orange-600">
                  स
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="font-extrabold text-lg sm:text-2xl tracking-tight text-slate-900 group-hover:text-orange-600 transition-colors truncate">
                    {t.appTitle}
                  </span>
                  <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 hidden sm:inline-block">
                    Gov MVP
                  </span>
                </div>
                <p className="text-xs text-slate-500 hidden lg:block">
                  {t.appSubtitle}
                </p>
              </div>
            </div>
          </div>

          {/* Center: Primary Navigation (Desktop) */}
          <nav className="hidden sm:flex gap-1.5 md:gap-3 items-center text-xs md:text-sm font-semibold">
            <button
              type="button"
              onClick={() => setCurrentPage('home')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                isHomeActive
                  ? 'bg-orange-100 text-orange-800 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('myservices')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                isMyServicesActive
                  ? 'bg-orange-100 text-orange-800 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              My Services
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('explore')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                isExploreActive
                  ? 'bg-orange-100 text-orange-800 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Explore
            </button>
          </nav>

          {/* Right section: Language Selector */}
          <div className="flex items-center">
            <div className="relative inline-flex items-center">
              <Globe className="w-4 h-4 text-slate-500 absolute left-3 pointer-events-none" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                aria-label="Select Assistant Language"
                className="pl-9 pr-4 py-2 text-xs sm:text-sm font-semibold rounded-xl border border-slate-300 bg-white text-slate-800 hover:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-2xs cursor-pointer transition-colors"
              >
                {languages.map((lang) => (
                  <option key={lang.id} value={lang.id}>
                    {lang.native} ({lang.name})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
