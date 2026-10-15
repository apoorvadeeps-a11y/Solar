/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { SuitabilitySimulator } from './components/SuitabilitySimulator';
import { ThreeSolarRooftopScene } from './components/ThreeSolarRooftopScene';
import { DecisionTreeViewer } from './components/DecisionTreeViewer';
import { PresentationHub } from './components/PresentationHub';
import { NationalStandardsGuide } from './components/NationalStandardsGuide';
import { PrintReportModal } from './components/PrintReportModal';
import { SavedAssessmentsModal } from './components/SavedAssessmentsModal';
import { SolarAssessmentInput } from './types/solar';
import { ARCHETYPE_PRESETS, evaluateSolarSuitability } from './data/solarData';
import { testConnection, SavedAssessmentRecord } from './lib/firebase';
import { Rotate3d, Sparkles, Cloud, Sliders, Layers } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'threejs' | 'tree' | 'presentation' | 'standards'>('simulator');
  const [input, setInput] = useState<SolarAssessmentInput>(ARCHETYPE_PRESETS[0].data);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState<boolean>(false);

  // Validate connection to Firestore on initial boot
  useEffect(() => {
    testConnection();
  }, []);

  // Compute assessment dynamically on any input change
  const result = useMemo(() => {
    return evaluateSolarSuitability(input);
  }, [input]);

  const handleLoadSavedAssessment = (record: SavedAssessmentRecord) => {
    setInput(record.input);
    setActiveTab('simulator');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Top Bar Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onPrintReport={() => setIsPrintModalOpen(true)}
        onOpenSavedModal={() => setIsSavedModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Project Header Banner: Challenge Card 26 Context */}
        <section className="bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent rounded-2xl p-6 border border-amber-200/80">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-amber-700 font-mono font-semibold">
                <span>AI FOR A SUSTAINABLE INDIA</span>
                <span aria-hidden="true">·</span>
                <span>CHALLENGE CARD 26</span>
                <span aria-hidden="true">·</span>
                <span>SDG 7 PROTOTYPE</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-950">
                Solar Suitability Checker & 3D Rooftop Twin
              </h2>
              <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
                Empowering Indian citizens to evaluate rooftop solar feasibility considering roof space, shading, sunlight, and electricity bills. Built as preliminary, non-professional guidance aligned with PM Surya Ghar: Muft Bijli Yojana.
              </p>
            </div>

            {/* Quick Interactive Badges & Mode Switcher */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setActiveTab('threejs')}
                className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl border transition-all ${
                  activeTab === 'threejs'
                    ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-sm'
                    : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Rotate3d className="w-4 h-4 text-amber-600" />
                <span>Launch 3D Twin</span>
              </button>

              <button
                onClick={() => setIsSavedModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 rounded-xl transition-all"
              >
                <Cloud className="w-4 h-4 text-amber-600" />
                <span>Save Assessment</span>
              </button>
            </div>
          </div>
        </section>

        {/* Tab 1: Interactive Suitability Simulator */}
        {activeTab === 'simulator' && (
          <SuitabilitySimulator
            input={input}
            setInput={setInput}
            result={result}
            onViewTree={() => setActiveTab('tree')}
            onPrintReport={() => setIsPrintModalOpen(true)}
          />
        )}

        {/* Tab 2: Three.js 3D Rooftop Digital Twin */}
        {activeTab === 'threejs' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                  <span>Three.js Spatial Simulation</span>
                  <span aria-hidden="true">·</span>
                  <span>Photorealistic Procedural Model</span>
                  <span aria-hidden="true">·</span>
                  <span>Sun Arc & Shadow Motion</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  3D Rooftop Solar Digital Twin & Shading Simulation
                </h3>
                <p className="text-sm text-slate-600 mt-0.5">
                  Drag with mouse/touch to orbit, scroll to zoom. Scrub the time slider in the bottom dock to observe real-time shadow trajectories cast by the water tank and mumty room across the {result.recommendedCapacityKw} kWp module array.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setActiveTab('simulator')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition-colors"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Adjust Dimensions</span>
                </button>
                <button
                  onClick={() => setActiveTab('tree')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition-colors"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>View Decision Rules</span>
                </button>
              </div>
            </div>

            <ThreeSolarRooftopScene input={input} result={result} />
          </div>
        )}

        {/* Tab 3: Decision Tree Visualizer */}
        {activeTab === 'tree' && (
          <DecisionTreeViewer />
        )}

        {/* Tab 4: 2-Minute Pitch & Research Q&A */}
        {activeTab === 'presentation' && (
          <PresentationHub />
        )}

        {/* Tab 5: National Standards & Subsidy Blueprint */}
        {activeTab === 'standards' && (
          <NationalStandardsGuide />
        )}
      </main>

      {/* Printable Report Modal */}
      {isPrintModalOpen && (
        <PrintReportModal
          input={input}
          result={result}
          onClose={() => setIsPrintModalOpen(false)}
        />
      )}

      {/* Saved Assessments Cloud Modal */}
      {isSavedModalOpen && (
        <SavedAssessmentsModal
          currentInput={input}
          currentResult={result}
          onLoadAssessment={handleLoadSavedAssessment}
          onClose={() => setIsSavedModalOpen(false)}
        />
      )}

      {/* Clean Footer */}
      <footer className="no-print mt-auto bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-slate-500 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-md bg-amber-500 text-white flex items-center justify-center font-bold text-xs">
              S
            </div>
            <span>
              SuryaCheck · AI for a Sustainable India Challenge Card 26 (SDG 7)
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <a 
              href="https://pmsuryaghar.gov.in" 
              target="_blank" 
              rel="noreferrer"
              className="hover:text-slate-900 transition-colors"
            >
              pmsuryaghar.gov.in
            </a>
            <span aria-hidden="true">·</span>
            <a 
              href="https://mnre.gov.in" 
              target="_blank" 
              rel="noreferrer"
              className="hover:text-slate-900 transition-colors"
            >
              mnre.gov.in
            </a>
            <span aria-hidden="true">·</span>
            <span>Cloud Persistence: Firestore & Google Auth</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
