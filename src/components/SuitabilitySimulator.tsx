import React from 'react';
import { 
  BuildingType, 
  RoofOwnership, 
  RoofType, 
  RoofCondition, 
  ShadingLevel, 
  RoofOrientation, 
  SolarAssessmentInput, 
  AssessmentResult 
} from '../types/solar';
import { INDIAN_STATES, ARCHETYPE_PRESETS, ArchetypePreset } from '../data/solarData';
import { RooftopVisualizer } from './RooftopVisualizer';
import { 
  Sun, 
  Zap, 
  IndianRupee, 
  Trees, 
  Sparkles, 
  RotateCcw, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  HelpCircle,
  FileText,
  Sliders
} from 'lucide-react';

interface SuitabilitySimulatorProps {
  input: SolarAssessmentInput;
  setInput: React.Dispatch<React.SetStateAction<SolarAssessmentInput>>;
  result: AssessmentResult;
  onViewTree: () => void;
  onPrintReport: () => void;
}

export const SuitabilitySimulator: React.FC<SuitabilitySimulatorProps> = ({
  input,
  setInput,
  result,
  onViewTree,
  onPrintReport
}) => {
  const handlePresetSelect = (preset: ArchetypePreset) => {
    setInput(preset.data);
  };

  const handleReset = () => {
    setInput(ARCHETYPE_PRESETS[0].data);
  };

  const getOutcomeTheme = (outcome: AssessmentResult['outcome']) => {
    switch (outcome) {
      case 'highly_suitable':
        return {
          bg: 'bg-emerald-50 border-emerald-300 text-emerald-900',
          badge: 'bg-emerald-600 text-white',
          icon: <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
        };
      case 'conditionally_suitable':
        return {
          bg: 'bg-amber-50 border-amber-300 text-amber-900',
          badge: 'bg-amber-600 text-white',
          icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
        };
      case 'economically_marginal':
      case 'needs_structural_survey':
        return {
          bg: 'bg-orange-50 border-orange-300 text-orange-900',
          badge: 'bg-orange-600 text-white',
          icon: <HelpCircle className="w-5 h-5 text-orange-600 shrink-0" />
        };
      case 'not_suitable':
      default:
        return {
          bg: 'bg-rose-50 border-rose-300 text-rose-900',
          badge: 'bg-rose-600 text-white',
          icon: <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
        };
    }
  };

  const outcomeTheme = getOutcomeTheme(result.outcome);

  return (
    <div className="space-y-8">
      {/* Archetype Quick Selectors */}
      <section className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <span className="text-xs font-mono font-semibold text-slate-500 uppercase">
              Benchmark Archetypes · Indian Context
            </span>
            <h3 className="text-sm font-bold text-slate-900">
              Load Realistic Case Studies
            </h3>
          </div>
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Standard</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {ARCHETYPE_PRESETS.map(preset => {
            const isMatch = preset.data.totalRoofAreaSqFt === input.totalRoofAreaSqFt && 
                            preset.data.stateId === input.stateId &&
                            preset.data.shadingLevel === input.shadingLevel;
            return (
              <button
                key={preset.id}
                onClick={() => handlePresetSelect(preset)}
                className={`text-left p-3 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                  isMatch 
                    ? 'border-amber-500 bg-amber-50/70 shadow-xs ring-1 ring-amber-400' 
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <div className="font-semibold text-slate-900 leading-snug">
                  {preset.name}
                </div>
                <div className="text-[11px] text-slate-500 line-clamp-1 mt-1">
                  {preset.subtitle}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Main 2-Column Split: Controls Deck (Left) & Live Stage + Evaluation (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Parameter Input Form Deck */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-amber-600 font-semibold">
                <span>INPUT CONTROLS</span>
                <span aria-hidden="true">·</span>
                <span>STEP-BY-STEP PARAMETERS</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                Rooftop & Consumption Audit
              </h3>
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-1 font-mono">
              <Sliders className="w-3.5 h-3.5 text-slate-400" />
              <span>Real-Time Feedback</span>
            </div>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-5 text-xs">
            {/* 1. State / Location */}
            <div>
              <label htmlFor="state-select" className="block font-semibold text-slate-800 mb-1.5">
                Location / Indian State (Solar Insolation Tier)
              </label>
              <select
                id="state-select"
                value={input.stateId}
                onChange={(e) => setInput(prev => ({ ...prev, stateId: e.target.value }))}
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {INDIAN_STATES.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} — {s.avgGhi} kWh/m²/day avg (Tariff: ~₹{s.tariffPerUnitInr}/unit)
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500 mt-1">
                {INDIAN_STATES.find(s => s.id === input.stateId)?.regionDescription}
              </p>
            </div>

            {/* 2. Roof Ownership & Tenancy */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="ownership-select" className="block font-semibold text-slate-800 mb-1.5">
                  Roof Ownership & Tenancy Rights
                </label>
                <select
                  id="ownership-select"
                  value={input.roofOwnership}
                  onChange={(e) => setInput(prev => ({ ...prev, roofOwnership: e.target.value as RoofOwnership }))}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="sole_owner">Sole Individual Owner (Full Rights)</option>
                  <option value="joint_family">Joint Family Property (Consensus)</option>
                  <option value="society_shared">Apartment Society (Shared Terrace / RWA NOC)</option>
                  <option value="tenant_no_noc">Tenant (No written owner NOC)</option>
                </select>
              </div>

              <div>
                <label htmlFor="building-type-select" className="block font-semibold text-slate-800 mb-1.5">
                  Building Type
                </label>
                <select
                  id="building-type-select"
                  value={input.buildingType}
                  onChange={(e) => setInput(prev => ({ ...prev, buildingType: e.target.value as BuildingType }))}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="independent_house">Independent House / Row House</option>
                  <option value="duplex_villa">Bungalow / Duplex Villa</option>
                  <option value="apartment_society">Multi-Story Cooperative Society</option>
                  <option value="commercial_small">Small Commercial Shop / Clinic</option>
                </select>
              </div>
            </div>

            {/* 3. Roof Material & Physical Condition */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="roof-type-select" className="block font-semibold text-slate-800 mb-1.5">
                  Roof Slab Material
                </label>
                <select
                  id="roof-type-select"
                  value={input.roofType}
                  onChange={(e) => setInput(prev => ({ ...prev, roofType: e.target.value as RoofType }))}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="rcc_flat">Flat Concrete Slab (RCC Terrace)</option>
                  <option value="tin_metal_sheet">Industrial Metal / Tin Sheet Shed</option>
                  <option value="clay_mangalore_tile">Sloped Clay / Mangalore Tile</option>
                  <option value="asbestos_cement">Asbestos Cement Sheets (Disallowed)</option>
                  <option value="weak_temporary">Temporary Bamboo / Canvas Shed</option>
                </select>
              </div>

              <div>
                <label htmlFor="roof-condition-select" className="block font-semibold text-slate-800 mb-1.5">
                  Surface & Slab Health
                </label>
                <select
                  id="roof-condition-select"
                  value={input.roofCondition}
                  onChange={(e) => setInput(prev => ({ ...prev, roofCondition: e.target.value as RoofCondition }))}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="excellent">Excellent (Newly built / Waterproofed)</option>
                  <option value="good">Good (Normal wear, sound concrete)</option>
                  <option value="fair_minor_repair">Fair (Minor surface weathering)</option>
                  <option value="poor_seepage_cracks">Poor (Active water seepage / cracks)</option>
                </select>
              </div>
            </div>

            {/* 4. Roof Area & Usable Percentage */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label htmlFor="total-area-input" className="font-semibold text-slate-800">
                  Total Roof Area: <span className="font-mono text-amber-600 font-bold">{input.totalRoofAreaSqFt} sq ft</span>
                </label>
                <span className="text-[11px] text-slate-500">
                  {(input.totalRoofAreaSqFt * 0.0929).toFixed(1)} m²
                </span>
              </div>
              <input
                id="total-area-input"
                type="range"
                min="100"
                max="2500"
                step="50"
                value={input.totalRoofAreaSqFt}
                onChange={(e) => setInput(prev => ({ ...prev, totalRoofAreaSqFt: Number(e.target.value) }))}
                className="w-full accent-amber-500 cursor-pointer"
              />

              <div className="flex items-center justify-between pt-1">
                <label htmlFor="usable-area-input" className="font-semibold text-slate-800">
                  Usable Unobstructed Area: <span className="font-mono text-amber-600 font-bold">{input.usableAreaPercent}%</span>
                </label>
                <span className="text-[11px] text-slate-500 font-mono">
                  Effective: {Math.round(input.totalRoofAreaSqFt * (input.usableAreaPercent / 100))} sq ft
                </span>
              </div>
              <input
                id="usable-area-input"
                type="range"
                min="20"
                max="90"
                step="5"
                value={input.usableAreaPercent}
                onChange={(e) => setInput(prev => ({ ...prev, usableAreaPercent: Number(e.target.value) }))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500">
                Tip: Indian rooftops typically lose 20-40% of area to overhead water tanks, staircases, parapet walls, and clotheslines.
              </p>
            </div>

            {/* 5. Shading Level & Orientation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label htmlFor="shading-select" className="block font-semibold text-slate-800 mb-1.5">
                  Shading (9:00 AM – 4:00 PM)
                </label>
                <select
                  id="shading-select"
                  value={input.shadingLevel}
                  onChange={(e) => setInput(prev => ({ ...prev, shadingLevel: e.target.value as ShadingLevel }))}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="none_minimal">Negligible (&lt;10% shadow in prime window)</option>
                  <option value="moderate">Moderate (10% - 30% morning/evening shade)</option>
                  <option value="heavy">Heavy (30% - 60% shadow from trees/tanks)</option>
                  <option value="severe">Severe (&gt;60% shade from tall adjacent towers)</option>
                </select>
              </div>

              <div>
                <label htmlFor="orientation-select" className="block font-semibold text-slate-800 mb-1.5">
                  Roof Orientation / Direction
                </label>
                <select
                  id="orientation-select"
                  value={input.roofOrientation}
                  onChange={(e) => setInput(prev => ({ ...prev, roofOrientation: e.target.value as RoofOrientation }))}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="south">True South (Ideal for India / Northern Hemisphere)</option>
                  <option value="south_east">South-East (Very Good)</option>
                  <option value="south_west">South-West (Very Good)</option>
                  <option value="east_west">East / West Tilt (Moderate Yield)</option>
                  <option value="north">North Facing (Sub-optimal, ~20-30% loss)</option>
                </select>
              </div>
            </div>

            {/* 6. Electricity Bill & Units */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
              <div>
                <label htmlFor="monthly-units-input" className="block font-semibold text-slate-800 mb-1.5">
                  Monthly Consumption
                </label>
                <div className="relative">
                  <input
                    id="monthly-units-input"
                    type="number"
                    min="30"
                    max="3000"
                    step="10"
                    value={input.monthlyUnitsKwh}
                    onChange={(e) => setInput(prev => ({ ...prev, monthlyUnitsKwh: Number(e.target.value) }))}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white text-slate-900 font-mono focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="absolute right-2 top-2 text-[10px] text-slate-400 font-mono">kWh</span>
                </div>
              </div>

              <div>
                <label htmlFor="monthly-bill-input" className="block font-semibold text-slate-800 mb-1.5">
                  Avg. Monthly Bill
                </label>
                <div className="relative">
                  <input
                    id="monthly-bill-input"
                    type="number"
                    min="200"
                    max="50000"
                    step="100"
                    value={input.monthlyBillInr}
                    onChange={(e) => setInput(prev => ({ ...prev, monthlyBillInr: Number(e.target.value) }))}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white text-slate-900 font-mono focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="absolute right-2 top-2 text-[10px] text-slate-400 font-mono">INR</span>
                </div>
              </div>

              <div>
                <label htmlFor="sanctioned-load-input" className="block font-semibold text-slate-800 mb-1.5">
                  Sanctioned Load
                </label>
                <div className="relative">
                  <input
                    id="sanctioned-load-input"
                    type="number"
                    min="1"
                    max="20"
                    step="1"
                    value={input.sanctionedLoadKw}
                    onChange={(e) => setInput(prev => ({ ...prev, sanctionedLoadKw: Number(e.target.value) }))}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white text-slate-900 font-mono focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="absolute right-2 top-2 text-[10px] text-slate-400 font-mono">kW</span>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Right Column: Visual Rooftop Stage & Preliminary Determination */}
        <div className="lg:col-span-6 space-y-6">
          {/* Visual Model */}
          <RooftopVisualizer input={input} result={result} />

          {/* Preliminary Determination Result Card */}
          <div className={`rounded-2xl p-6 border shadow-xs transition-all ${outcomeTheme.bg}`}>
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-current/15">
              <div className="flex items-start gap-3">
                {outcomeTheme.icon}
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider font-semibold opacity-75">
                    Preliminary Decision Outcome
                  </div>
                  <h3 className="text-xl font-bold tracking-tight mt-0.5">
                    {result.outcomeLabel}
                  </h3>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className={`px-2.5 py-1 text-xs font-bold rounded-md font-mono ${outcomeTheme.badge}`}>
                  Score: {result.suitabilityScore}/100
                </span>
              </div>
            </div>

            <p className="text-sm mt-3 leading-relaxed opacity-90">
              {result.headlineSummary}
            </p>

            {/* Numerical KPI Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-current/15 text-slate-900">
              <div className="bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-current/10">
                <div className="text-[11px] text-slate-500 font-medium">System Sizing</div>
                <div className="text-lg font-bold font-mono text-slate-900 mt-0.5">
                  {result.recommendedCapacityKw} kWp
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                  Max Space: {result.maxFeasibleCapacityKw} kW
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-current/10">
                <div className="text-[11px] text-slate-500 font-medium">Govt Subsidy (CFA)</div>
                <div className="text-lg font-bold font-mono text-emerald-700 mt-0.5">
                  ₹{result.pmSuryaGharSubsidyInr.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  PM Surya Ghar Slabs
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-current/10">
                <div className="text-[11px] text-slate-500 font-medium">Est. Net Cost</div>
                <div className="text-lg font-bold font-mono text-slate-900 mt-0.5">
                  ₹{result.netInvestmentInr.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                  Gross: ₹{result.estimatedGrossCostInr.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-current/10">
                <div className="text-[11px] text-slate-500 font-medium">Payback Period</div>
                <div className="text-lg font-bold font-mono text-amber-700 mt-0.5">
                  {result.paybackPeriodYears < 90 ? `${result.paybackPeriodYears} Years` : 'N/A'}
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                  Saves ~₹{result.annualSavingsInr.toLocaleString('en-IN')}/yr
                </div>
              </div>
            </div>

            {/* Environmental & Generation Highlights */}
            <div className="flex flex-wrap items-center justify-between text-xs mt-4 pt-3 border-t border-current/15 gap-3">
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Est. Generation: <strong>~{result.monthlyEstimatedGenerationKwh} kWh/month</strong> ({result.annualGenerationKwh} units/year)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Trees className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>CO₂ Offset: <strong>~{result.co2OffsetTonnesAnnual} Tonnes/year</strong></span>
              </div>
            </div>

            {/* Critical Flags or Blockers */}
            {result.criticalFlags.length > 0 && (
              <div className="mt-4 pt-3 border-t border-current/15">
                <div className="text-xs font-bold uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Important Attention Flags:</span>
                </div>
                <ul className="space-y-1 text-xs list-disc list-inside">
                  {result.criticalFlags.map((flag, idx) => (
                    <li key={idx}>{flag}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Next Steps Guidance */}
            <div className="mt-4 pt-3 border-t border-current/15">
              <div className="text-xs font-bold uppercase tracking-wide mb-1.5">
                Recommended Next Step:
              </div>
              <ul className="space-y-1 text-xs">
                {result.nextSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="font-mono text-amber-600 font-bold shrink-0">{idx + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions: View Tree Logic & Print Report */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-current/15 gap-3">
              <button
                onClick={onViewTree}
                className="inline-flex items-center gap-1.5 text-xs font-semibold hover:underline"
              >
                <span>Inspect Full Decision Tree Path ({result.decisionTreePath.length} Rules Checked)</span>
              </button>

              <button
                onClick={onPrintReport}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800 transition-colors shadow-xs"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Generate PDF Dossier</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
