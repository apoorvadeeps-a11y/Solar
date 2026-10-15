import React from 'react';
import { INDIAN_STATES } from '../data/solarData';
import { ExternalLink, CheckCircle2, ShieldCheck, Sun, HelpCircle, FileCheck } from 'lucide-react';

export const NationalStandardsGuide: React.FC = () => {
  return (
    <div className="space-y-10">
      {/* Visual Showcase Banner */}
      <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs text-amber-600 font-mono font-semibold mb-2">
                <span>NATIONAL POLICY & TECHNICAL FRAMEWORK</span>
                <span aria-hidden="true">·</span>
                <span>PM SURYA GHAR</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-950 tracking-tight">
                India's Rooftop Solar Standards & Subsidy Blueprint
              </h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                The Government of India has committed ₹75,021 Crore to the <strong>PM Surya Ghar: Muft Bijli Yojana</strong> to provide up to 300 units of free clean electricity per month to 1 crore residential households. Understanding the standardized benchmarks prevents overpaying and ensures grid safety.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-100 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-slate-500 text-[10px]">National Target</div>
                <div className="text-base font-bold text-slate-900 mt-0.5">1 Crore Homes</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-slate-500 text-[10px]">Max Subsidy (CFA)</div>
                <div className="text-base font-bold text-emerald-700 mt-0.5">₹78,000</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-slate-500 text-[10px]">Free Monthly Units</div>
                <div className="text-base font-bold text-amber-600 mt-0.5">Up to 300 kWh</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative min-h-64 bg-slate-900">
            <img 
              src="/src/assets/images/hero_solar_rooftop_india_1792039016832.jpg" 
              alt="Grid-tied solar rooftop installation on urban Indian terrace"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
              <span className="text-[11px] text-white/90 font-mono">
                Standard RCC Terrace Installation with Elevated Galvanized Framing
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Shading Analysis Deep Dive with Diagram */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>Scientific Principle</span>
              <span aria-hidden="true">·</span>
              <span>Photovoltaic Solar Window</span>
            </div>
            <h4 className="text-xl font-bold text-slate-900">
              The Critical 9:00 AM – 4:00 PM Shadow-Free Window
            </h4>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              Solar panels in India generate over 80% of their daily energy output between 9 AM and 4 PM. Shadows during this window reduce string voltage and can trigger damaging hot-spots.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 rounded-xl overflow-hidden border border-slate-800 shadow-md">
            <img 
              src="/src/assets/images/diagram_solar_shading_concept_1792039017623.jpg" 
              alt="Diagram showing sun trajectory arc and prime shadow-free window"
              className="w-full h-auto object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="lg:col-span-5 space-y-4 text-xs text-slate-700">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-amber-500" />
                <span>1. Peak Insolation at Solar Noon</span>
              </div>
              <p className="leading-relaxed">
                Between 11:30 AM and 1:30 PM, the sun reaches its zenith. Shading at noon can drop system generation by up to 60-70% even if only one panel corner is shadowed.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>2. Parapet & Water Tank Clearance</span>
              </div>
              <p className="leading-relaxed">
                To prevent shadows from rooftop overhead water tanks (Sintex/RCC), panels must either be elevated on a 6–8 ft high elevated galvanized iron superstructure or set back at a distance equal to at least 2.5× the obstacle height.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-blue-600" />
                <span>3. True South Tilt Orientation</span>
              </div>
              <p className="leading-relaxed">
                In India (Northern Hemisphere), solar arrays should face True South tilted at an angle approximately equal to the local city’s latitude (e.g., 28° in Delhi, 13° in Bengaluru, 19° in Mumbai).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* State Solar Insolation Comparison Table */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div>
          <span className="text-xs font-mono font-semibold text-slate-500 uppercase">
            Baseline Radiation Data
          </span>
          <h4 className="text-lg font-bold text-slate-900">
            State-Wise Solar Radiation (GHI) & Net-Metering Policies
          </h4>
          <p className="text-xs text-slate-600 mt-1">
            Data sourced from National Institute of Solar Energy (NISE) and State Electricity Regulatory Commissions (SERCs).
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">State / Region</th>
                <th className="p-3 font-mono">Avg GHI (kWh/m²/day)</th>
                <th className="p-3 font-mono">Sun Hours</th>
                <th className="p-3 font-mono">Tariff Tier (~INR/kWh)</th>
                <th className="p-3">Metering Mode</th>
                <th className="p-3">Key Solar Characteristic</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-slate-800">
              {INDIAN_STATES.map(s => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-semibold text-slate-900 font-sans">{s.name}</td>
                  <td className="p-3 font-bold text-amber-700">{s.avgGhi}</td>
                  <td className="p-3">{s.avgSunHours} hrs</td>
                  <td className="p-3">₹{s.tariffPerUnitInr}</td>
                  <td className="p-3 font-sans text-xs">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                      {s.netMeteringType}
                    </span>
                  </td>
                  <td className="p-3 font-sans text-[11px] text-slate-600">{s.regionDescription}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Mandatory Homeowner Checklist Before Signing Contracts */}
      <section className="bg-amber-50/60 rounded-2xl p-6 sm:p-8 border border-amber-200 space-y-4">
        <div className="flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-amber-700" />
          <h4 className="text-base font-bold text-amber-950">
            Consumer Protection Checklist: 5 Questions to Ask Any Solar Vendor
          </h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-amber-900">
          <div className="p-3.5 rounded-xl bg-white/90 border border-amber-200/80">
            <strong>1. Are the modules on the ALMM List?</strong>
            <p className="mt-1 text-slate-600">
              Under MNRE rules, only modules listed on the Approved List of Models and Manufacturers (ALMM) qualify for central government subsidies.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-white/90 border border-amber-200/80">
            <strong>2. What is the Hot-Dip Galvanization rating?</strong>
            <p className="mt-1 text-slate-600">
              Mounting structures must have minimum 80-micron hot-dip galvanizing to resist rust over the 25-year lifespan of solar panels.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-white/90 border border-amber-200/80">
            <strong>3. Is the earthing resistance &lt; 5 Ohms?</strong>
            <p className="mt-1 text-slate-600">
              Mandatory separate chemical earthing pits for DC lightning protection, AC inverter casing, and structure earthing are essential for home safety.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-white/90 border border-amber-200/80">
            <strong>4. Who handles DISCOM Net-Meter Liaisoning?</strong>
            <p className="mt-1 text-slate-600">
              Ensure the vendor contract includes bi-directional meter testing, DISCOM inspection charges, and final commissioning certificates.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
