import React, { useState } from 'react';
import {
  Home,
  Mic,
  Compass,
  FileText,
  MapPin,
  BookOpen,
  FileCheck,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { UI_STRINGS } from '../translations/content';

/**
 * Persistent left sidebar navigation with hierarchical sections and mobile drawer support.
 * Props:
 *   language – locale key (en/hi/te)
 *   currentPage – currently active page identifier
 *   setCurrentPage – function to switch pages (from App state)
 *   mobileOpen – boolean from App state
 *   setMobileOpen – function to toggle mobile drawer
 */
export default function Sidebar({
  language,
  currentPage,
  setCurrentPage,
  mobileOpen = false,
  setMobileOpen = () => {}
}) {
  const t = UI_STRINGS[language] || UI_STRINGS.en;
  const [collapsed, setCollapsed] = useState(false);
  const [expandExplore, setExpandExplore] = useState(true);
  const [expandMy, setExpandMy] = useState(true);

  const sections = [
    {
      key: 'home',
      label: 'HOME',
      icon: <Home size={20} />,
      children: [
        { key: 'home', label: t.appTitle || 'Home', icon: <Home size={16} /> },
        { key: 'voice', label: t.voiceFirst || 'Voice Assistant', icon: <Mic size={16} /> },
      ],
    },
    {
      key: 'explore',
      label: 'EXPLORE SERVICES',
      icon: <Compass size={20} />,
      children: [
        { key: 'doc-translator', label: t.docTranslatorTitle || 'Translate Documents', icon: <FileText size={16} /> },
        { key: 'centre-finder', label: t.centreFinderNavBtn || 'Find Service Centres', icon: <MapPin size={16} /> },
        { key: 'verified-sources', label: t.sourcesHeaderTitle || 'Verified Sources', icon: <BookOpen size={16} /> },
      ],
    },
    {
      key: 'myservices',
      label: 'MY SERVICES',
      icon: <FileCheck size={20} />,
      children: [
        { key: 'checklist', label: t.checklistHeaderTitle || 'Document Checklist', icon: <CheckCircle size={16} /> },
        { key: 'tracker', label: t.trackerTitle || 'Application Tracker', icon: <Calendar size={16} /> },
      ],
    },
  ];

  const sidebarWidth = collapsed ? 'w-20' : 'w-64';
  const activeStyle = 'bg-orange-600 text-white font-semibold shadow-xs';
  const hoverStyle = 'hover:bg-gray-800 text-slate-300 hover:text-white';

  const isItemActive = (itemKey) => {
    if (currentPage === itemKey) return true;
    if (currentPage === 'explore' && itemKey === 'verified-sources') return true;
    if (currentPage === 'myservices' && itemKey === 'checklist') return true;
    return false;
  };

  const handleItemClick = (targetPage) => {
    setCurrentPage(targetPage);
    if (setMobileOpen) setMobileOpen(false);
  };

  const renderSection = (section) => (
    <div key={section.key} className="mb-3">
      {/* Parent section header */}
      <button
        type="button"
        className={`flex items-center w-full px-4 py-2 text-xs font-bold tracking-wider text-slate-400 hover:text-white ${hoverStyle} ${
          collapsed ? 'justify-center' : ''
        }`}
        onClick={() => {
          if (section.key === 'explore') setExpandExplore(!expandExplore);
          else if (section.key === 'myservices') setExpandMy(!expandMy);
          else handleItemClick('home');
        }}
        title={collapsed ? section.label : undefined}
      >
        <span className="mr-2 text-slate-400">{section.icon}</span>
        {!collapsed && <span className="flex-1 text-left uppercase">{section.label}</span>}
        {!collapsed && (
          <span className="ml-2">
            {section.key === 'explore' ? (
              expandExplore ? <ChevronDown size={14} /> : <ChevronRight size={14} />
            ) : section.key === 'myservices' ? (
              expandMy ? <ChevronDown size={14} /> : <ChevronRight size={14} />
            ) : null}
          </span>
        )}
      </button>

      {/* Child navigation items */}
      {((section.key === 'explore' && expandExplore) ||
        (section.key === 'myservices' && expandMy) ||
        section.key === 'home') && (
        <div className={collapsed ? 'space-y-1 mt-1' : 'ml-3 space-y-1 mt-1 border-l border-gray-800 pl-2'}>
          {section.children.map((item) => {
            const active = isItemActive(item.key);
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => handleItemClick(item.key)}
                className={`flex items-center w-full px-3 py-2 text-xs rounded-xl transition-all duration-150 ${
                  active ? activeStyle : hoverStyle
                } ${collapsed ? 'justify-center' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <span className={`mr-2.5 ${active ? 'text-white' : 'text-slate-400'}`}>
                  {item.icon}
                </span>
                {!collapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderSidebarContent = (isMobile = false) => (
    <aside className={`${isMobile ? 'w-64' : sidebarWidth} bg-[#111827] text-white h-full transition-width duration-200 flex flex-col shadow-lg`}>
      {/* Header with brand and collapse/close button */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-800">
        {(!collapsed || isMobile) && (
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base tracking-tight text-white">
              {t.appTitle || 'SAHAYAK'}
            </span>
          </div>
        )}
        {isMobile ? (
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="p-1.5 hover:bg-gray-800 rounded-lg text-slate-400 hover:text-white"
            aria-label="Close sidebar drawer"
          >
            <X size={20} />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 hover:bg-gray-800 rounded-lg text-slate-400 hover:text-white"
            aria-label="Toggle sidebar collapse"
          >
            <Menu size={18} />
          </button>
        )}
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto p-2 scrollbar-thin">
        {sections.map(renderSection)}
      </nav>
    </aside>
  );

  return (
    <>
      {/* Mobile Drawer Overlay */}
      <div className="md:hidden">
        {mobileOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
        )}
        <div
          className={`fixed inset-y-0 left-0 z-50 transform ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          } transition-transform duration-200 ease-in-out`}
        >
          {renderSidebarContent(true)}
        </div>
      </div>

      {/* Desktop Persistent Sidebar */}
      <div className="hidden md:block h-screen sticky top-0">
        {renderSidebarContent(false)}
      </div>
    </>
  );
}
