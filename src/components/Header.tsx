import React, { useState, useEffect } from 'react';
import { SunMedium, Printer, Cloud, User as UserIcon } from 'lucide-react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

interface HeaderProps {
  activeTab: 'simulator' | 'threejs' | 'tree' | 'presentation' | 'standards';
  setActiveTab: (tab: 'simulator' | 'threejs' | 'tree' | 'presentation' | 'standards') => void;
  onPrintReport: () => void;
  onOpenSavedModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  setActiveTab, 
  onPrintReport, 
  onOpenSavedModal 
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setCurrentUser(u));
    return () => unsub();
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Brand Wordmark (Single text element) */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center text-white shadow-sm">
              <SunMedium className="w-5 h-5 stroke-[2.2]" />
            </div>
            <a 
              href="#top" 
              onClick={(e) => { e.preventDefault(); setActiveTab('simulator'); }}
              className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap"
            >
              SuryaCheck
            </a>
          </div>

          {/* Zone 2: 5 Clean Single-Line Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('simulator')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
                activeTab === 'simulator' ? 'border-amber-500 text-slate-900 font-semibold' : 'border-transparent'
              }`}
            >
              Suitability Simulator
            </button>
            <button
              onClick={() => setActiveTab('threejs')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
                activeTab === 'threejs' ? 'border-amber-500 text-slate-900 font-semibold' : 'border-transparent'
              }`}
            >
              3D Rooftop Twin
            </button>
            <button
              onClick={() => setActiveTab('tree')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
                activeTab === 'tree' ? 'border-amber-500 text-slate-900 font-semibold' : 'border-transparent'
              }`}
            >
              Decision Tree Map
            </button>
            <button
              onClick={() => setActiveTab('presentation')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
                activeTab === 'presentation' ? 'border-amber-500 text-slate-900 font-semibold' : 'border-transparent'
              }`}
            >
              2-Min Pitch & SDG 7
            </button>
            <button
              onClick={() => setActiveTab('standards')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
                activeTab === 'standards' ? 'border-amber-500 text-slate-900 font-semibold' : 'border-transparent'
              }`}
            >
              National Norms
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action Group */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenSavedModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
              title="Saved Plans in Cloud Firestore"
            >
              <Cloud className="w-3.5 h-3.5 text-amber-600" />
              <span>{currentUser ? (currentUser.displayName?.split(' ')[0] || 'My Plans') : 'Saved Plans'}</span>
            </button>

            <button
              onClick={onPrintReport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-xs"
              title="Print or export current assessment as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Report</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
