import React from 'react';
import { SolarAssessmentInput, AssessmentResult } from '../types/solar';
import { INDIAN_STATES } from '../data/solarData';
import { Printer, X, ShieldAlert, Award } from 'lucide-react';

interface PrintReportModalProps {
  input: SolarAssessmentInput;
  result: AssessmentResult;
  onClose: () => void;
}

export const PrintReportModal: React.FC<PrintReportModalProps> = ({ input, result, onClose }) => {
  const selectedState = INDIAN_STATES.find(s => s.id === input.stateId) || INDIAN_STATES[0];
  const reportDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full border border-slate-300 shadow-2xl overflow-hidden my-8 print:m-0 print:border-none print:shadow-none">
        {/* Top Control Bar (Hidden during print) */}
        <div className="no-print bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="font-semibold text-sm">Solar Suitability Assessment Dossier</span>
            <span className="text-xs text-slate-400 font-mono">· SDG 7 AI for a Sustainable India</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white transition-colors rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Document Body */}
        <div className="p-8 sm:p-10 space-y-6 text-slate-900 text-xs sm:text-sm">
          {/* Header Title & Metadata */}
          <div className="border-b-2 border-slate-900 pb-5">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xs font-mono font-bold uppercase tracking-widest text-amber-700">
                  Preliminary Engineering Briefing · Non-Professional Assessment
                </div>
                <h1 className="text-2xl font-bold text-slate-950 tracking-tight mt-1">
                  SuryaCheck: Rooftop Solar Suitability Report
                </h1>
                <p className="text-slate-600 text-xs mt-1">
                  Aligned with Ministry of New and Renewable Energy (MNRE) & PM Surya Ghar Muft Bijli Yojana
                </p>
              </div>
              <div className="text-right text-xs font-mono text-slate-600">
                <div>Date: {reportDate}</div>
                <div>Status: <span className="font-bold text-slate-900">{result.outcomeLabel}</span></div>
                <div>Score: <span className="font-bold text-amber-700">{result.suitabilityScore}/100</span></div>
              </div>
            </div>
          </div>

          {/* Section 1: Property & Solar Profile */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <div className="text-[11px] font-mono text-slate-500 uppercase">Location</div>
              <div className="font-bold text-slate-900 mt-0.5">{selectedState.name.split('(')[0]}</div>
              <div className="text-[11px] text-slate-500 font-mono">GHI: {selectedState.avgGhi} kWh/m²</div>
            </div>

            <div>
              <div className="text-[11px] font-mono text-slate-500 uppercase">Roof & Area</div>
              <div className="font-bold text-slate-900 mt-0.5">{input.totalRoofAreaSqFt} sq ft ({input.roofType.replace(/_/g, ' ')})</div>
              <div className="text-[11px] text-slate-500 font-mono">Usable: {result.effectiveUsableAreaSqFt} sq ft ({input.usableAreaPercent}%)</div>
            </div>

            <div>
              <div className="text-[11px] font-mono text-slate-500 uppercase">Shade & Facing</div>
              <div className="font-bold text-slate-900 mt-0.5">{input.shadingLevel.replace(/_/g, ' ')}</div>
              <div className="text-[11px] text-slate-500 font-mono">Orientation: {input.roofOrientation.toUpperCase()}</div>
            </div>

            <div>
              <div className="text-[11px] font-mono text-slate-500 uppercase">Electricity Demand</div>
              <div className="font-bold text-slate-900 mt-0.5">{input.monthlyUnitsKwh} kWh / month</div>
              <div className="text-[11px] text-slate-500 font-mono">Sanctioned: {input.sanctionedLoadKw} kW</div>
            </div>
          </div>

          {/* Section 2: Technical & Financial Summary */}
          <div>
            <h3 className="font-bold text-slate-950 uppercase text-xs tracking-wider mb-3">
              1. Technical Sizing & Financial Projections
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
              <div className="p-3 border border-slate-200 rounded-lg">
                <div className="text-[10px] text-slate-500 uppercase">Recommended Plant</div>
                <div className="text-lg font-bold text-slate-900 mt-0.5">{result.recommendedCapacityKw} kWp</div>
                <div className="text-[10px] text-slate-500">~{Math.round(result.recommendedCapacityKw * 2)} Monocrystalline Panels</div>
              </div>

              <div className="p-3 border border-slate-200 rounded-lg">
                <div className="text-[10px] text-slate-500 uppercase">Annual Generation</div>
                <div className="text-lg font-bold text-slate-900 mt-0.5">~{result.annualGenerationKwh} kWh</div>
                <div className="text-[10px] text-slate-500">~{result.monthlyEstimatedGenerationKwh} kWh/month</div>
              </div>

              <div className="p-3 border border-slate-200 rounded-lg">
                <div className="text-[10px] text-slate-500 uppercase">PM Surya Ghar Subsidy</div>
                <div className="text-lg font-bold text-emerald-700 mt-0.5">₹{result.pmSuryaGharSubsidyInr.toLocaleString('en-IN')}</div>
                <div className="text-[10px] text-slate-500">Central Financial Assistance</div>
              </div>

              <div className="p-3 border border-slate-200 rounded-lg">
                <div className="text-[10px] text-slate-500 uppercase">Estimated Net Cost</div>
                <div className="text-lg font-bold text-slate-900 mt-0.5">₹{result.netInvestmentInr.toLocaleString('en-IN')}</div>
                <div className="text-[10px] text-slate-500">Payback: ~{result.paybackPeriodYears} Years</div>
              </div>
            </div>
          </div>

          {/* Section 3: Decision Tree Audit Trail */}
          <div>
            <h3 className="font-bold text-slate-950 uppercase text-xs tracking-wider mb-3">
              2. Algorithmic Decision Tree Audit Trail
            </h3>
            <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 text-xs">
              {result.decisionTreePath.map((step, idx) => (
                <div key={idx} className="p-3 flex items-start justify-between gap-4">
                  <div>
                    <div className="font-semibold text-slate-900">{step.step}</div>
                    <div className="text-slate-500 text-[11px] mt-0.5">Evaluated: {step.conditionEvaluated}</div>
                    <div className="text-slate-700 mt-1">{step.note}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 ${
                    step.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {step.passed ? 'PASSED' : 'FLAGGED'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Mandatory Limitations & Disclaimer */}
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-900 uppercase">
              <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Mandatory Preliminary Guidance Disclaimer (Challenge Card 26)</span>
            </div>
            <p className="leading-relaxed">
              This digital assessment is an indicative simulation generated for educational and preliminary screening purposes under UN Sustainable Development Goal 7 (Affordable and Clean Energy). It does <strong>not</strong> constitute a professional engineering, civil structural, or DISCOM-sanctioned grid feasibility assessment. 
            </p>
            <p className="leading-relaxed">
              Prior to purchasing equipment or executing civil works, property owners must have a physical on-site shadow analysis (using a Solar Pathfinder or digital 3D LiDAR) and structural slab load-bearing inspection conducted by an empanelled solar installer registered on <strong>pmsuryaghar.gov.in</strong>.
            </p>
          </div>

          {/* Footer Sign-off */}
          <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-500 font-mono">
            <div>SuryaCheck Prototype · AI for a Sustainable India Challenge Card 26</div>
            <div>Source Norms: MNRE / NISE / CEA India (2024–2026)</div>
          </div>
        </div>
      </div>
    </div>
  );
};
