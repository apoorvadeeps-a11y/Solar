import React, { useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle, HelpCircle, ArrowRight, Layers } from 'lucide-react';

interface DecisionNode {
  id: string;
  stage: string;
  question: string;
  criteria: string;
  options: {
    label: string;
    condition: string;
    next: string;
    outcome?: 'pass' | 'fail' | 'warn' | 'terminal';
  }[];
  explanation: string;
}

const TREE_NODES: DecisionNode[] = [
  {
    id: 'stage1-legal',
    stage: 'Stage 1: Legal Ownership & Permissions',
    question: 'Does the resident possess legal authorization or ownership of the rooftop terrace?',
    criteria: 'Solar modules require permanent anchor drilling or heavy concrete ballast. Tenancy rules without NOC disqualify installation.',
    options: [
      { label: 'Sole Individual Owner', condition: 'Self-owned house/bungalow', next: 'stage2-structural', outcome: 'pass' },
      { label: 'Apartment Society / Shared Terrace', condition: 'Flat owner with shared access', next: 'stage2-structural', outcome: 'warn' },
      { label: 'Tenant without written Landlord NOC', condition: 'Rented premises', next: 'terminal-legal-fail', outcome: 'terminal' }
    ],
    explanation: 'DISCOM net metering applications and PM Surya Ghar subsidy disbursement strictly require proof of ownership (electricity bill + property tax/deed) or a formal Society Resolution.'
  },
  {
    id: 'stage2-structural',
    stage: 'Stage 2: Structural Integrity & Material Check',
    question: 'Is the roof structurally sound to bear dead loads and wind uplift forces?',
    criteria: 'Solar arrays add 15-20 kg/m² dead load and must withstand wind speeds up to 150 km/h under MNRE guidelines.',
    options: [
      { label: 'Solid RCC Concrete / Industrial Tin', condition: 'Healthy slab or steel rafters', next: 'stage3-space', outcome: 'pass' },
      { label: 'Active Seepage / Surface Cracks', condition: 'Aged slab or weathering', next: 'terminal-structural-survey', outcome: 'terminal' },
      { label: 'Asbestos Cement / Temporary Thatch', condition: 'Brittle or hazardous material', next: 'terminal-structural-fail', outcome: 'terminal' }
    ],
    explanation: 'Asbestos cement sheets crack dangerously during installation and cannot sustain wind load anchors. Severe water seepage will deteriorate the slab if drilling occurs without prior waterproofing.'
  },
  {
    id: 'stage3-space',
    stage: 'Stage 3: Minimum Usable Shadow-Free Area',
    question: 'Is there at least 100 sq ft of contiguous, usable shadow-free terrace space?',
    criteria: '1 kWp of monocrystalline panels needs ~100 sq ft (including inter-row spacing to avoid self-shading).',
    options: [
      { label: 'Area >= 100 sq ft', condition: 'Capacity for at least 1 kW array', next: 'stage4-shading', outcome: 'pass' },
      { label: 'Area < 100 sq ft', condition: 'Restricted space (< 9.3 sq m)', next: 'terminal-space-fail', outcome: 'terminal' }
    ],
    explanation: '1 kW is the minimum standardized grid-tied inverter capacity approved by DISCOMs under PM Surya Ghar. Rooftops below 100 sq ft cannot accommodate a viable grid-tied plant.'
  },
  {
    id: 'stage4-shading',
    stage: 'Stage 4: Shading Analysis (9:00 AM – 4:00 PM)',
    question: 'How much shadow falls on the prospective solar zone during the prime 7-hour window?',
    criteria: 'Over 80% of daily energy generation occurs between 9 AM and 4 PM. Shadows trigger module hot-spots and drag string voltage down.',
    options: [
      { label: 'Negligible / Minor (< 20%)', condition: 'Clear southern exposure', next: 'stage5-demand', outcome: 'pass' },
      { label: 'Heavy Obstruction (30% - 60%)', condition: 'Water tank, trees, parapet', next: 'stage5-demand', outcome: 'warn' },
      { label: 'Severe Obstruction (> 60%)', condition: 'Adjacent high-rise towers', next: 'terminal-shade-fail', outcome: 'terminal' }
    ],
    explanation: 'Moderate or heavy shade can be mitigated using an elevated galvanized iron superstructure (6 to 8 feet above parapets) or microinverters with independent MPPT tracking.'
  },
  {
    id: 'stage5-demand',
    stage: 'Stage 5: Electricity Consumption & Sizing Match',
    question: 'Does the household consume enough electricity to justify net-metering capital investment?',
    criteria: '1 kW generates ~120-140 kWh/month. Low consumption leads to prolonged payback unless favorable export tariffs exist.',
    options: [
      { label: 'Consumption >= 100 kWh/month', condition: 'Healthy load offset opportunity', next: 'terminal-highly-suitable', outcome: 'pass' },
      { label: 'Consumption < 100 kWh/month', condition: 'Minimal electric load', next: 'terminal-marginal', outcome: 'warn' }
    ],
    explanation: 'Under PM Surya Ghar Muft Bijli Yojana, households consuming up to 300 units/month can reduce their net electricity bill to nearly zero with a 2 to 3 kW system.'
  }
];

const TERMINAL_OUTCOMES: Record<string, {
  title: string;
  badge: string;
  color: string;
  description: string;
  recommendation: string;
}> = {
  'terminal-highly-suitable': {
    title: 'Highly Suitable (Prime Candidate)',
    badge: 'Green / High Viability',
    color: 'emerald',
    description: 'Rooftop meets all spatial, structural, legal, and irradiance thresholds. Ready for 1-5 kW grid-tied solar under PM Surya Ghar.',
    recommendation: 'Proceed to register on pmsuryaghar.gov.in and schedule DISCOM-empanelled vendor feasibility survey.'
  },
  'terminal-marginal': {
    title: 'Economically Marginal (Low Consumption)',
    badge: 'Yellow / Low Payback',
    color: 'amber',
    description: 'Technically suitable, but low monthly energy usage limits monthly savings, extending payback beyond 7-8 years.',
    recommendation: 'Consider a minimal 1 kW system or verify DISCOM fixed monthly meter charges before purchase.'
  },
  'terminal-shade-fail': {
    title: 'Not Suitable (Severe Shading)',
    badge: 'Red / Solar Deficit',
    color: 'rose',
    description: 'Persistent shadows from surrounding multi-story buildings or dense trees block >60% of prime sunlight.',
    recommendation: 'Explore community solar, virtual net-metering, or balcony DC kits; rooftop solar PV is unviable.'
  },
  'terminal-space-fail': {
    title: 'Not Suitable (Insufficient Usable Space)',
    badge: 'Red / Area Deficit',
    color: 'rose',
    description: 'Available unshaded rooftop area is less than the 100 sq ft minimum needed for a standard 1 kW array.',
    recommendation: 'Consider a solar water heater (requires only 30-40 sq ft) or solar tubular skylights instead of solar PV.'
  },
  'terminal-structural-survey': {
    title: 'Needs Structural Civil Audit',
    badge: 'Orange / Structural Caution',
    color: 'amber',
    description: 'Active water seepage, cracks, or aging slab must be certified and waterproofed before mounting modules.',
    recommendation: 'Have a licensed civil engineer test slab dead load; apply elastomeric waterproofing prior to solar installation.'
  },
  'terminal-structural-fail': {
    title: 'Not Suitable (Safety & Material Hazard)',
    badge: 'Red / Structural Risk',
    color: 'rose',
    description: 'Asbestos sheets or temporary shed framing cannot sustain 150 km/h wind loads and pose severe safety hazards.',
    recommendation: 'Replace roof with structural steel sheet or reinforced RCC before planning solar installation.'
  },
  'terminal-legal-fail': {
    title: 'Not Currently Suitable (Tenancy Barrier)',
    badge: 'Red / Legal Barrier',
    color: 'rose',
    description: 'Absence of landlord NOC or property ownership prevents DISCOM net-metering connectivity and subsidy approval.',
    recommendation: 'Obtain formal written NOC from property owner or pursue community solar initiatives.'
  }
};

export const DecisionTreeViewer: React.FC = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('stage1-legal');

  const selectedNode = TREE_NODES.find(n => n.id === selectedNodeId) || TREE_NODES[0];

  return (
    <div className="space-y-8">
      {/* Overview & Context Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>Challenge Card 26</span>
              <span aria-hidden="true">·</span>
              <span>Simulation Logic Specification</span>
              <span aria-hidden="true">·</span>
              <span>Preliminary Assessment</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              Interactive Solar Decision Tree Model
            </h3>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              This flowchart simulates the engineering triage used by solar auditors in India. It systematically checks legal rights, structural safety, spatial availability, shadow-free hours, and electricity consumption.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-mono text-slate-700 shrink-0">
            <Layers className="w-4 h-4 text-amber-500" />
            <span>5 Decision Stages · 7 Terminal Outcomes</span>
          </div>
        </div>
      </div>

      {/* Main Flow Visualizer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Flowchart Stage Stepper */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-1">
            Decision Pipeline Stages
          </div>

          {TREE_NODES.map((node, index) => {
            const isSelected = node.id === selectedNodeId;
            return (
              <button
                key={node.id}
                onClick={() => setSelectedNodeId(node.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  isSelected 
                    ? 'bg-amber-50/70 border-amber-400 shadow-sm ring-1 ring-amber-300' 
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-1">
                      <span className="font-bold text-amber-600">0{index + 1}.</span>
                      <span>{node.stage.split(':')[0]}</span>
                    </div>
                    <div className="text-sm font-semibold text-slate-900 leading-snug">
                      {node.question}
                    </div>
                  </div>
                  <ArrowRight className={`w-4 h-4 mt-1 shrink-0 transition-transform ${isSelected ? 'text-amber-600 translate-x-1' : 'text-slate-400'}`} />
                </div>
              </button>
            );
          })}

          {/* Quick Terminal Outcomes Reference */}
          <div className="pt-4 border-t border-slate-200">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-1 mb-2">
              Possible Final Determinations
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-medium">
              <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                Highly Suitable
              </div>
              <div className="p-2.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200">
                Conditionally Suitable
              </div>
              <div className="p-2.5 rounded-lg bg-orange-50 text-orange-800 border border-orange-200">
                Needs Structural Audit
              </div>
              <div className="p-2.5 rounded-lg bg-rose-50 text-rose-800 border border-rose-200">
                Not Suitable (Space/Shade)
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Node Deep Dive & Branch Inspection */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-amber-600 font-mono font-semibold">
              <span>ACTIVE STAGE INSPECTION</span>
              <span aria-hidden="true">·</span>
              <span>BRANCH SPECIFICATION</span>
            </div>
            <h4 className="text-lg font-bold text-slate-900 mt-1">
              {selectedNode.stage}
            </h4>
            <p className="text-sm text-slate-600 mt-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
              <strong>Evaluation Question:</strong> {selectedNode.question}
            </p>
          </div>

          {/* Criteria & Engineering Justification */}
          <div>
            <h5 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Engineering Criterion & Physics Rationale
            </h5>
            <p className="text-sm text-slate-600 leading-relaxed">
              {selectedNode.criteria}
            </p>
            <p className="text-xs text-slate-500 mt-2 italic">
              {selectedNode.explanation}
            </p>
          </div>

          {/* Branches & Outcomes */}
          <div>
            <h5 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
              Branch Pathways From This Node
            </h5>
            <div className="space-y-3">
              {selectedNode.options.map((opt, i) => {
                const terminalData = opt.next.startsWith('terminal-') ? TERMINAL_OUTCOMES[opt.next] : null;

                return (
                  <div 
                    key={i}
                    className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        {opt.outcome === 'pass' && <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />}
                        {opt.outcome === 'warn' && <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />}
                        {opt.outcome === 'terminal' && <XCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />}
                        <div>
                          <div className="text-sm font-semibold text-slate-900">
                            {opt.label}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            Condition: {opt.condition}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        {terminalData ? (
                          <span className={`inline-block px-2 py-0.5 text-[11px] font-semibold rounded-md ${
                            terminalData.color === 'emerald' ? 'bg-emerald-100 text-emerald-800' :
                            terminalData.color === 'amber' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            Outcome: {terminalData.title}
                          </span>
                        ) : (
                          <button 
                            onClick={() => setSelectedNodeId(opt.next)}
                            className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 hover:text-amber-700 hover:underline"
                          >
                            <span>Advances to next stage</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>

                    {terminalData && (
                      <div className="mt-2.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                        <p>{terminalData.description}</p>
                        <p className="mt-1 font-medium text-slate-700">
                          Guidance: {terminalData.recommendation}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pedagogical Note for Students */}
          <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/60 text-xs text-amber-900 flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>Presentation Tip for Judges:</strong> Emphasize that a decision tree ensures complete transparency. Unlike black-box neural networks, every branch can be verified against Indian Standards (IS/IEC 61215 for modules, IS 875 for wind loads).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
