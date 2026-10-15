import { StateSolarProfile, SolarAssessmentInput, AssessmentResult } from '../types/solar';

export const INDIAN_STATES: StateSolarProfile[] = [
  {
    id: 'rajasthan',
    name: 'Rajasthan (e.g., Jaipur, Jodhpur)',
    avgGhi: 5.7,
    avgSunHours: 5.4,
    tariffPerUnitInr: 7.2,
    netMeteringType: 'Net',
    regionDescription: 'Highest solar insolation in India (>300 clear sunny days/year).'
  },
  {
    id: 'gujarat',
    name: 'Gujarat (e.g., Ahmedabad, Surat)',
    avgGhi: 5.6,
    avgSunHours: 5.3,
    tariffPerUnitInr: 6.8,
    netMeteringType: 'Net',
    regionDescription: 'Pioneer state in rooftop solar with streamlined DISCOM interconnection.'
  },
  {
    id: 'delhi',
    name: 'Delhi NCR',
    avgGhi: 5.1,
    avgSunHours: 4.8,
    tariffPerUnitInr: 7.5,
    netMeteringType: 'Virtual Net Metering',
    regionDescription: 'High urban air conditioning demand; solar reduces peak slab billing.'
  },
  {
    id: 'karnataka',
    name: 'Karnataka (e.g., Bengaluru, Mysuru)',
    avgGhi: 5.3,
    avgSunHours: 4.9,
    tariffPerUnitInr: 7.4,
    netMeteringType: 'Net',
    regionDescription: 'Good insolation year-round; moderate monsoon dip in July-August.'
  },
  {
    id: 'maharashtra',
    name: 'Maharashtra (e.g., Mumbai, Pune)',
    avgGhi: 5.2,
    avgSunHours: 4.8,
    tariffPerUnitInr: 8.5,
    netMeteringType: 'Net',
    regionDescription: 'High tier electricity tariffs make solar payback exceptionally fast.'
  },
  {
    id: 'tamil_nadu',
    name: 'Tamil Nadu (e.g., Chennai, Coimbatore)',
    avgGhi: 5.4,
    avgSunHours: 5.0,
    tariffPerUnitInr: 6.5,
    netMeteringType: 'Net',
    regionDescription: 'Consistent coastal and inland sunlight with active solar policy.'
  },
  {
    id: 'uttar_pradesh',
    name: 'Uttar Pradesh (e.g., Lucknow, Noida)',
    avgGhi: 5.0,
    avgSunHours: 4.6,
    tariffPerUnitInr: 6.9,
    netMeteringType: 'Net',
    regionDescription: 'Vast residential potential under PM Surya Ghar Muft Bijli Yojana.'
  },
  {
    id: 'kerala',
    name: 'Kerala (e.g., Kochi, Thiruvananthapuram)',
    avgGhi: 4.7,
    avgSunHours: 4.3,
    tariffPerUnitInr: 6.2,
    netMeteringType: 'Net',
    regionDescription: 'Moderate insolation due to dual monsoons; heavy vegetation tree shading factor.'
  },
  {
    id: 'west_bengal',
    name: 'West Bengal (e.g., Kolkata)',
    avgGhi: 4.8,
    avgSunHours: 4.4,
    tariffPerUnitInr: 7.6,
    netMeteringType: 'Net',
    regionDescription: 'Dense urban housing, grid-tied rooftop solar with WBSEDCL/CESC.'
  }
];

export interface ArchetypePreset {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  data: SolarAssessmentInput;
}

export const ARCHETYPE_PRESETS: ArchetypePreset[] = [
  {
    id: 'bengaluru_villa',
    name: 'Bengaluru Independent Villa',
    subtitle: 'Prime RCC terrace, individual owner, moderate load',
    description: 'A 2-story family house in Bengaluru with 650 sq ft flat RCC roof and low tree shade. Excellent candidate for a 3 kW solar array.',
    data: {
      buildingType: 'duplex_villa',
      roofOwnership: 'sole_owner',
      roofType: 'rcc_flat',
      roofCondition: 'excellent',
      totalRoofAreaSqFt: 650,
      usableAreaPercent: 75,
      shadingLevel: 'none_minimal',
      roofOrientation: 'south',
      stateId: 'karnataka',
      monthlyUnitsKwh: 320,
      monthlyBillInr: 2450,
      sanctionedLoadKw: 4
    }
  },
  {
    id: 'delhi_apartment',
    name: 'Delhi NCR Cooperative Apartment',
    subtitle: 'Shared terrace, multi-tenant consensus required',
    description: 'Top floor resident in an East Delhi apartment society. Needs RWA/Society NOC and shares terrace access with water tanks and cooling towers.',
    data: {
      buildingType: 'apartment_society',
      roofOwnership: 'society_shared',
      roofType: 'rcc_flat',
      roofCondition: 'good',
      totalRoofAreaSqFt: 1200,
      usableAreaPercent: 40,
      shadingLevel: 'moderate',
      roofOrientation: 'south_east',
      stateId: 'delhi',
      monthlyUnitsKwh: 450,
      monthlyBillInr: 3400,
      sanctionedLoadKw: 5
    }
  },
  {
    id: 'jaipur_rowhouse',
    name: 'Jaipur Sunny Row House',
    subtitle: 'High insolation, clear southern sky, quick payback',
    description: 'An independent residential terrace in Jaipur with clear unshaded southern sky and high GHI. Qualifies for high energy offset.',
    data: {
      buildingType: 'independent_house',
      roofOwnership: 'sole_owner',
      roofType: 'rcc_flat',
      roofCondition: 'good',
      totalRoofAreaSqFt: 500,
      usableAreaPercent: 80,
      shadingLevel: 'none_minimal',
      roofOrientation: 'south',
      stateId: 'rajasthan',
      monthlyUnitsKwh: 280,
      monthlyBillInr: 2100,
      sanctionedLoadKw: 3
    }
  },
  {
    id: 'mumbai_shaded_chawl',
    name: 'Mumbai Urban Building (High Shading)',
    subtitle: 'Surrounded by high-rise towers, heavy shadow',
    description: 'A ground + 1 structure surrounded by 15-floor modern towers. Severe shadow (>65%) blocks direct sunlight during prime generating hours.',
    data: {
      buildingType: 'independent_house',
      roofOwnership: 'sole_owner',
      roofType: 'tin_metal_sheet',
      roofCondition: 'fair_minor_repair',
      totalRoofAreaSqFt: 400,
      usableAreaPercent: 50,
      shadingLevel: 'severe',
      roofOrientation: 'north',
      stateId: 'maharashtra',
      monthlyUnitsKwh: 220,
      monthlyBillInr: 1850,
      sanctionedLoadKw: 3
    }
  },
  {
    id: 'kerala_tiled_home',
    name: 'Kerala Traditional Tiled Roof',
    subtitle: 'Sloped clay tile, coconut tree shade, monsoon impact',
    description: 'Sloped clay tiled roof with high moisture and coconut palm shade. Requires specialized clamp mounting or an elevated substructure.',
    data: {
      buildingType: 'independent_house',
      roofOwnership: 'sole_owner',
      roofType: 'clay_mangalore_tile',
      roofCondition: 'fair_minor_repair',
      totalRoofAreaSqFt: 550,
      usableAreaPercent: 55,
      shadingLevel: 'heavy',
      roofOrientation: 'south_west',
      stateId: 'kerala',
      monthlyUnitsKwh: 190,
      monthlyBillInr: 1200,
      sanctionedLoadKw: 2
    }
  }
];

/**
 * PM Surya Ghar Muft Bijli Yojana (Central Financial Assistance / CFA) Slabs:
 * - Up to 2 kW: ₹30,000 per kW (i.e. ₹30,000 for 1 kW, ₹60,000 for 2 kW)
 * - Above 2 kW and up to 3 kW: ₹18,000 for the additional kW (Total ₹78,000 for 3 kW)
 * - Above 3 kW: Capped at maximum ₹78,000 for residential single household
 */
export function calculatePmSuryaGharSubsidy(capacityKw: number): number {
  if (capacityKw < 1) return 0;
  if (capacityKw <= 1) return 30000;
  if (capacityKw <= 2) return 30000 + (capacityKw - 1) * 30000;
  if (capacityKw <= 3) return 60000 + (capacityKw - 2) * 18000;
  return 78000; // Capped at ₹78,000 for residential individual meters
}

/**
 * Evaluates the Decision Tree logic step-by-step
 */
export function evaluateSolarSuitability(input: SolarAssessmentInput): AssessmentResult {
  const selectedState = INDIAN_STATES.find(s => s.id === input.stateId) || INDIAN_STATES[0];
  
  const path: AssessmentResult['decisionTreePath'] = [];
  const flags: string[] = [];
  const recommendations: string[] = [];
  const nextSteps: string[] = [];

  // Step 1: Legal / Roof Access Rights Check
  let legalOk = true;
  if (input.roofOwnership === 'tenant_no_noc') {
    legalOk = false;
    flags.push('Rented premises without landlord/owner NOC. Tenancy rights prohibit permanent mounting.');
    path.push({
      step: 'Step 1: Legal & Roof Access Verification',
      conditionEvaluated: 'Sole owner OR written NOC/Society Resolution present',
      passed: false,
      note: 'Rejected: No legal rights to install permanent capital infrastructure on roof.'
    });
  } else if (input.roofOwnership === 'society_shared') {
    path.push({
      step: 'Step 1: Legal & Roof Access Verification',
      conditionEvaluated: 'Shared Society / Apartment Terrace requires formal RWA resolution / NOC',
      passed: true,
      note: 'Conditional: Needs General Body RWA Resolution or Virtual Net Metering permission.'
    });
    flags.push('Requires formal RWA (Resident Welfare Association) NOC or Society Resolution.');
    recommendations.push('Approach society management committee for either dedicated terrace demarcation or a common-area metering solar setup.');
  } else {
    path.push({
      step: 'Step 1: Legal & Roof Access Verification',
      conditionEvaluated: 'Sole or Joint family owner with clear terrace access',
      passed: true,
      note: 'Passed: Clear legal ownership rights.'
    });
  }

  // Step 2: Structural Integrity & Roof Material Check
  let structuralOk = true;
  let structuralSurveyNeeded = false;
  if (input.roofType === 'weak_temporary' || input.roofType === 'asbestos_cement') {
    structuralOk = false;
    flags.push(
      input.roofType === 'asbestos_cement' 
        ? 'Asbestos cement sheets are brittle, hazardous to drill into, and disallowed by most DISCOMs for solar ballast/drilling.' 
        : 'Temporary shed/structure cannot withstand 150 km/h wind loads required by MNRE norms.'
    );
    path.push({
      step: 'Step 2: Structural Feasibility & Roof Type',
      conditionEvaluated: 'Roof material can sustain wind load (130-150 km/h) & dead load (~15-20 kg/m²)',
      passed: false,
      note: `Failed: ${input.roofType.replace(/_/g, ' ')} is structurally unviable or hazardous.`
    });
  } else if (input.roofCondition === 'poor_seepage_cracks') {
    structuralSurveyNeeded = true;
    flags.push('Active water seepage, cracks, or aging slab detected. Drilling or ballast may worsen leakage.');
    path.push({
      step: 'Step 2: Structural Feasibility & Roof Type',
      conditionEvaluated: 'Roof slab free from deep cracks or severe weathering',
      passed: false,
      note: 'Needs Structural Audit: Waterproofing and civil repair must precede solar mounting.'
    });
    recommendations.push('Complete elastomeric waterproofing and structural civil reinforcement before contractor visits.');
  } else {
    path.push({
      step: 'Step 2: Structural Feasibility & Roof Type',
      conditionEvaluated: 'Solid RCC or industrial metal sheet capable of holding certified mounting structure',
      passed: true,
      note: `Passed: ${input.roofType.replace(/_/g, ' ')} with ${input.roofCondition} condition.`
    });
  }

  // Step 3: Usable Area Calculation
  // Standard benchmark: ~100 sq ft per 1 kWp of modern monocrystalline solar panels (includes inter-row spacing for cleaning access)
  const effectiveUsableArea = Math.round(input.totalRoofAreaSqFt * (input.usableAreaPercent / 100));
  const minRequiredArea = 100; // Minimum 1 kW system requires ~100 sq ft
  let spaceOk = true;

  if (effectiveUsableArea < minRequiredArea) {
    spaceOk = false;
    flags.push(`Usable shadow-free area (${effectiveUsableArea} sq ft) is below the minimum 1 kW benchmark (100 sq ft).`);
    path.push({
      step: 'Step 3: Minimum Usable Shadow-Free Area',
      conditionEvaluated: 'Effective usable area >= 100 sq ft (minimum 1 kWp array)',
      passed: false,
      note: `Failed: Only ${effectiveUsableArea} sq ft available (${input.usableAreaPercent}% of ${input.totalRoofAreaSqFt} sq ft).`
    });
  } else {
    path.push({
      step: 'Step 3: Minimum Usable Shadow-Free Area',
      conditionEvaluated: 'Effective usable area >= 100 sq ft',
      passed: true,
      note: `Passed: ${effectiveUsableArea} sq ft available (supports up to ${(effectiveUsableArea / 100).toFixed(1)} kWp).`
    });
  }

  // Step 4: Shading & Solar Exposure Window
  // Solar PV in India yields 80% of daily power between 9:00 AM and 4:00 PM
  let shadingOk = true;
  let heavyShadeDiscount = 1.0;

  if (input.shadingLevel === 'severe') {
    shadingOk = false;
    flags.push('Severe shading (>60%) from high-rise buildings or dense canopy. Solar generation will be severely curtailed.');
    path.push({
      step: 'Step 4: Solar Window & Shading Obstruction',
      conditionEvaluated: 'Obstruction-free sunlight for minimum 5-6 hours during 9:00 AM - 4:00 PM',
      passed: false,
      note: 'Failed: Severe shade causes hot-spotting, inverter under-voltage, and unviable ROI.'
    });
  } else if (input.shadingLevel === 'heavy') {
    heavyShadeDiscount = 0.65; // 35% loss
    flags.push('Heavy partial shading from water overhead tank, parapet, or trees. Microinverters or solar optimizers needed.');
    recommendations.push('Use elevated galvanized iron super-structures (6-8 ft high) or module-level power optimizers to bypass shadows.');
    path.push({
      step: 'Step 4: Solar Window & Shading Obstruction',
      conditionEvaluated: 'Obstruction-free sunlight between 9:00 AM - 4:00 PM',
      passed: true,
      note: 'Passed with caveat: Heavy shade incurs ~35% derating unless elevated structure is used.'
    });
  } else if (input.shadingLevel === 'moderate') {
    heavyShadeDiscount = 0.85; // 15% loss
    path.push({
      step: 'Step 4: Solar Window & Shading Obstruction',
      conditionEvaluated: 'Obstruction-free sunlight between 9:00 AM - 4:00 PM',
      passed: true,
      note: 'Passed: Minor early morning or late evening shading.'
    });
  } else {
    path.push({
      step: 'Step 4: Solar Window & Shading Obstruction',
      conditionEvaluated: 'Unobstructed southern/south-facing exposure',
      passed: true,
      note: 'Passed: Prime unshaded solar window available.'
    });
  }

  // Step 5: Energy Demand & Sanctioned Load Match
  // 1 kW in India produces ~110-140 units (kWh) per month depending on region
  const monthlyGenPerKw = Math.round(selectedState.avgGhi * 30 * 0.78 * heavyShadeDiscount); // PR ~78%
  const maxSpaceKw = Math.floor(effectiveUsableArea / 100);
  
  // Rule: Size system to meet ~80% - 100% of consumption, capped by sanctioned load (DISCOM rules) and roof area
  const demandBasedKw = Math.ceil(input.monthlyUnitsKwh / (selectedState.avgGhi * 30 * 0.78));
  
  // Recommended capacity: min of space limit, demand need, and sanctioned load (or sanctioned load + 1 under recent policies)
  let recommendedKw = Math.max(1, Math.min(demandBasedKw, maxSpaceKw, Math.max(1, input.sanctionedLoadKw)));
  if (maxSpaceKw < 1) recommendedKw = 0;

  if (input.monthlyUnitsKwh < 90) {
    flags.push('Very low monthly consumption (< 90 units). Payback period will be long unless export tariffs are favorable.');
    recommendations.push('Check DISCOM minimum fixed meter charges; a minimal 1 kW system is the smallest viable entry point.');
  }

  path.push({
    step: 'Step 5: Electricity Demand & Sanctioned Load Match',
    conditionEvaluated: `Sanctioned load (${input.sanctionedLoadKw} kW) and monthly need (${input.monthlyUnitsKwh} kWh)`,
    passed: true,
    note: `Calculated ideal capacity: ${recommendedKw} kW based on ${input.monthlyUnitsKwh} kWh/mo demand and ${effectiveUsableArea} sq ft space.`
  });

  // Calculate Final Suitability Outcome
  let outcome: AssessmentResult['outcome'] = 'highly_suitable';
  let outcomeLabel = 'Highly Suitable (Prime Candidate)';
  let headlineSummary = 'Your building possesses exceptional solar conditions with high generation potential and rapid financial payback.';
  let score = 92;

  if (!legalOk) {
    outcome = 'not_suitable';
    outcomeLabel = 'Not Currently Suitable (Legal / Tenancy Barrier)';
    headlineSummary = 'Rooftop solar requires registered ownership or explicit written authorization from the property owner/society.';
    score = 15;
  } else if (!structuralOk) {
    outcome = 'not_suitable';
    outcomeLabel = 'Not Suitable (Structural Safety / Hazard)';
    headlineSummary = 'The current roof material (temporary shed / asbestos) cannot safely support certified solar framing against severe wind loads.';
    score = 22;
  } else if (structuralSurveyNeeded) {
    outcome = 'needs_structural_survey';
    outcomeLabel = 'Needs Structural Civil Audit';
    headlineSummary = 'Your roof exhibits water seepage or surface weathering. Civil repair and slab load-bearing certification must occur prior to installation.';
    score = 52;
  } else if (!spaceOk) {
    outcome = 'not_suitable';
    outcomeLabel = 'Not Suitable (Insufficient Shadow-Free Space)';
    headlineSummary = `Your usable roof space (${effectiveUsableArea} sq ft) is below the minimum threshold (100 sq ft) for a 1 kW grid-tied array.`;
    score = 30;
  } else if (!shadingOk) {
    outcome = 'not_suitable';
    outcomeLabel = 'Not Suitable (Severe Shading Obstruction)';
    headlineSummary = 'Persistent tall building or tree shadows block more than 60% of daily solar irradiance, rendering payback economically unviable.';
    score = 35;
  } else if (input.shadingLevel === 'heavy' || input.roofOwnership === 'society_shared' || input.roofType === 'clay_mangalore_tile' || input.roofOrientation === 'north') {
    outcome = 'conditionally_suitable';
    outcomeLabel = 'Conditionally Suitable (Mitigations Required)';
    headlineSummary = 'Solar is viable and beneficial, but requires specific structural designs, RWA clearance, or elevated superstructures to mitigate constraints.';
    score = 68;
  } else if (input.monthlyUnitsKwh < 100) {
    outcome = 'economically_marginal';
    outcomeLabel = 'Economically Marginal (Low Consumption)';
    headlineSummary = 'Technically feasible, but your low electricity consumption means financial savings from net-metering will take longer to offset capital costs.';
    score = 60;
  }

  // Financial & Environmental Metrics (2025-2026 Indian Market Estimates)
  // Average benchmark cost in India: ~₹65,000 / kW for 1-3 kW residential
  const estimatedGrossCost = recommendedKw * 65000;
  const pmSuryaGharSubsidy = calculatePmSuryaGharSubsidy(recommendedKw);
  const netInvestment = Math.max(0, estimatedGrossCost - pmSuryaGharSubsidy);

  const monthlyEstimatedGen = Math.round(recommendedKw * monthlyGenPerKw);
  const annualGen = Math.round(monthlyEstimatedGen * 12);
  
  // Annual financial savings = Units generated * average tariff
  // Cap savings to monthly bill if net-metering banked
  const annualSavings = Math.round(Math.min(annualGen * selectedState.tariffPerUnitInr, input.monthlyBillInr * 12 * 1.05));
  
  // Payback period
  const paybackYears = annualSavings > 0 ? Number((netInvestment / annualSavings).toFixed(1)) : 99;

  // CO2 offset: Central Electricity Authority (CEA) grid emission factor for India is ~0.82 kg CO2 / kWh
  const co2OffsetTonnesAnnual = Number(((annualGen * 0.82) / 1000).toFixed(2));

  // Build Next Steps based on outcome
  if (outcome === 'highly_suitable' || outcome === 'conditionally_suitable') {
    nextSteps.push('Register on the National Portal for Rooftop Solar (pmsuryaghar.gov.in) with your consumer electricity account number.');
    nextSteps.push('Request an on-site feasibility verification from a DISCOM-empanelled solar vendor.');
    nextSteps.push('Verify that your sanctioned load matches the intended plant capacity (apply for load enhancement if needed).');
    nextSteps.push('Inspect the electrical distribution box to ensure earthing (< 5 ohms) and space for a bi-directional net meter.');
  } else if (outcome === 'needs_structural_survey') {
    nextSteps.push('Hire a civil engineer or licensed contractor to evaluate roof slab dead-weight capacity and water seepage.');
    nextSteps.push('Carry out elastomeric waterproofing membrane treatment before installing any mounting legs.');
    nextSteps.push('Re-run this checker once roof civil rehabilitation is completed.');
  } else {
    nextSteps.push('Explore community solar or virtual net metering if supported by your regional DISCOM.');
    nextSteps.push('Look into solar water heaters or small DC plug-in emergency balcony solar lighting kits as alternatives.');
    nextSteps.push('Re-evaluate if surrounding trees can be pruned or if an elevated canopy structure can clear parapet shadows.');
  }

  return {
    outcome,
    outcomeLabel,
    headlineSummary,
    suitabilityScore: score,
    effectiveUsableAreaSqFt: effectiveUsableArea,
    maxFeasibleCapacityKw: maxSpaceKw,
    recommendedCapacityKw: recommendedKw,
    monthlyEstimatedGenerationKwh: monthlyEstimatedGen,
    annualGenerationKwh: annualGen,
    annualSavingsInr: annualSavings,
    pmSuryaGharSubsidyInr: pmSuryaGharSubsidy,
    estimatedGrossCostInr: estimatedGrossCost,
    netInvestmentInr: netInvestment,
    paybackPeriodYears: paybackYears,
    co2OffsetTonnesAnnual,
    decisionTreePath: path,
    criticalFlags: flags,
    recommendations,
    nextSteps
  };
}

export const SDG_7_INFO = {
  title: 'SDG 7: Affordable and Clean Energy',
  target: 'Target 7.2: Increase substantially the share of renewable energy in the global energy mix by 2030.',
  indiaContext: 'India has pledged to achieve 500 GW of non-fossil energy capacity by 2030 and net-zero emissions by 2070. The PM Surya Ghar Muft Bijli Yojana aims to power 1 crore (10 million) Indian households with rooftop solar, providing up to 300 free units of electricity each month while decentralizing clean power distribution.',
  challengeRelation: 'A non-technical household owner cannot easily decipher tilt angles, azimuths, or DISCOM net-metering regulations. This tool democratizes the first mile of decision-making, removing confusion and inertia.'
};
