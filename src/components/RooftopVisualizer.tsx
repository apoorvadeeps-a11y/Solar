import React from 'react';
import { SolarAssessmentInput, AssessmentResult } from '../types/solar';
import { Sun, AlertTriangle, ShieldCheck, Info } from 'lucide-react';

interface RooftopVisualizerProps {
  input: SolarAssessmentInput;
  result: AssessmentResult;
}

export const RooftopVisualizer: React.FC<RooftopVisualizerProps> = ({ input, result }) => {
  // Calculate visual metrics
  const effectiveArea = result.effectiveUsableAreaSqFt;
  const recommendedKw = result.recommendedCapacityKw;
  // Standard solar panel is ~550W (approx 2 panels per 1.1 kW)
  const panelCount = Math.max(2, Math.round(recommendedKw * 2));
  
  // Shading visual percentage
  const shadePercent = input.shadingLevel === 'severe' ? 65 : input.shadingLevel === 'heavy' ? 40 : input.shadingLevel === 'moderate' ? 20 : 5;

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-lg relative overflow-hidden">
      {/* Visual Canvas Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-mono tracking-wide">
            <span>SUN PATH & SHADOW PROJECTION</span>
            <span aria-hidden="true">·</span>
            <span>9:00 AM — 4:00 PM WINDOW</span>
          </div>
          <h4 className="text-base font-semibold text-slate-100 mt-0.5">
            Rooftop Solar Geometry Model
          </h4>
        </div>
        <div className="text-right font-mono text-xs text-slate-400">
          <div>Usable: <span className="text-white font-semibold">{effectiveArea} sq ft</span></div>
          <div>Array: <span className="text-amber-400 font-semibold">{recommendedKw} kWp (~{panelCount} panels)</span></div>
        </div>
      </div>

      {/* Sun Trajectory Arc Diagram */}
      <div className="relative h-48 w-full bg-slate-950/80 rounded-xl border border-slate-800/80 p-3 overflow-hidden flex flex-col justify-between">
        {/* Sky Celestial Background Grid */}
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="sky-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-slate-600" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#sky-grid)" />
          </svg>
        </div>

        {/* Sun Path Arc */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 180" preserveAspectRatio="none">
          {/* Optimal Solar Window Arc (9am - 4pm) */}
          <path
            d="M 60 140 Q 250 20 440 140"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2"
            strokeDasharray="4 4"
            className="opacity-70"
          />
          {/* Prime Zone highlight */}
          <path
            d="M 120 100 Q 250 25 380 100 L 380 150 L 120 150 Z"
            fill="rgba(245, 158, 11, 0.08)"
          />
        </svg>

        {/* Sun Markers */}
        <div className="relative z-10 flex justify-between items-start text-[10px] text-slate-400 font-mono px-2">
          <div className="flex flex-col items-center">
            <span className="text-amber-500/80">9:00 AM</span>
            <div className="w-4 h-4 rounded-full bg-amber-500/30 border border-amber-400 flex items-center justify-center mt-1">
              <div className="w-2 h-2 rounded-full bg-amber-400" />
            </div>
            <span className="text-slate-500 mt-1">East Rise</span>
          </div>

          <div className="flex flex-col items-center -mt-1">
            <span className="text-amber-300 font-bold">12:00 PM (Solar Noon)</span>
            <div className="w-6 h-6 rounded-full bg-amber-400/20 border border-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/20 mt-0.5">
              <Sun className="w-4 h-4 text-amber-300 animate-spin-slow" />
            </div>
            <span className="text-amber-200/80 text-[11px] mt-0.5 font-semibold">Peak Irradiance</span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-amber-500/80">4:00 PM</span>
            <div className="w-4 h-4 rounded-full bg-amber-500/30 border border-amber-400 flex items-center justify-center mt-1">
              <div className="w-2 h-2 rounded-full bg-amber-400" />
            </div>
            <span className="text-slate-500 mt-1">West Set</span>
          </div>
        </div>

        {/* Terrace Slab Simulation Box */}
        <div className="relative z-10 mt-auto bg-slate-900 border border-slate-700/80 rounded-lg p-2.5 shadow-inner">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5 pb-1 border-b border-slate-800">
            <span className="font-medium text-slate-300">
              Roof: {input.roofType.replace(/_/g, ' ').toUpperCase()} ({input.totalRoofAreaSqFt} sq ft)
            </span>
            <span className="font-mono text-slate-400">
              Facing: <strong className="text-amber-300">{input.roofOrientation.toUpperCase()}</strong>
            </span>
          </div>

          {/* Roof Surface with Solar Panels & Shading Projection */}
          <div className="relative h-20 bg-slate-950 rounded border border-slate-800 p-2 overflow-hidden flex items-center justify-center">
            {/* Shading Overlay */}
            <div 
              className="absolute left-0 top-0 bottom-0 bg-slate-900/90 border-r border-dashed border-red-400/60 transition-all duration-300 z-20 flex items-center justify-center"
              style={{ width: `${shadePercent}%` }}
            >
              <div className="text-[10px] text-red-300/90 font-mono px-2 text-center flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-red-400 shrink-0" />
                <span className="truncate">{shadePercent}% Shaded / Restricted</span>
              </div>
            </div>

            {/* Solar Panel Array Grid Representation */}
            {recommendedKw > 0 ? (
              <div className="grid grid-cols-6 gap-1 w-full max-w-sm ml-auto z-10">
                {Array.from({ length: Math.min(12, panelCount) }).map((_, i) => (
                  <div 
                    key={i}
                    className="h-7 bg-blue-900/80 border border-blue-500/50 rounded-xs flex flex-col justify-between p-0.5 hover:bg-blue-800 transition-colors shadow-xs"
                    title={`Monocrystalline Panel #${i + 1} (~540W)`}
                  >
                    <div className="w-full h-0.5 bg-blue-400/30" />
                    <div className="w-full h-0.5 bg-blue-400/30" />
                    <div className="w-full h-0.5 bg-blue-400/30" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-500 font-mono text-center">
                No viable panel layout due to constraints
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Footnote & Rules Citation */}
      <div className="mt-3 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2 pt-2 border-t border-slate-800/80">
        <div className="flex items-center gap-1.5 text-slate-300">
          <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Calculated at <strong>~100 sq ft shadow-free area per 1 kWp</strong> including maintenance walkways</span>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
          <span>Optimal Tilt: 15°–25° True South</span>
        </div>
      </div>
    </div>
  );
};
