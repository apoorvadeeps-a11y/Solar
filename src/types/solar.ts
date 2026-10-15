export type BuildingType = 
  | 'independent_house' 
  | 'duplex_villa' 
  | 'apartment_society' 
  | 'commercial_small';

export type RoofOwnership = 
  | 'sole_owner' 
  | 'joint_family' 
  | 'society_shared' 
  | 'tenant_no_noc';

export type RoofType = 
  | 'rcc_flat' 
  | 'tin_metal_sheet' 
  | 'clay_mangalore_tile' 
  | 'asbestos_cement' 
  | 'weak_temporary';

export type RoofCondition = 
  | 'excellent' 
  | 'good' 
  | 'fair_minor_repair' 
  | 'poor_seepage_cracks';

export type ShadingLevel = 
  | 'none_minimal'   // < 10% shadow between 9 AM - 4 PM
  | 'moderate'       // 10% - 30% morning/evening partial shadow
  | 'heavy'          // 30% - 60% shadow from water tank / trees / adjacent floors
  | 'severe';        // > 60% obstruction

export type RoofOrientation = 
  | 'south' 
  | 'south_east' 
  | 'south_west' 
  | 'east_west' 
  | 'north';

export interface StateSolarProfile {
  id: string;
  name: string;
  avgGhi: number; // kWh/m²/day
  avgSunHours: number;
  tariffPerUnitInr: number;
  netMeteringType: 'Gross' | 'Net' | 'Virtual Net Metering';
  regionDescription: string;
}

export interface SolarAssessmentInput {
  buildingType: BuildingType;
  roofOwnership: RoofOwnership;
  roofType: RoofType;
  roofCondition: RoofCondition;
  totalRoofAreaSqFt: number;
  usableAreaPercent: number;
  shadingLevel: ShadingLevel;
  roofOrientation: RoofOrientation;
  stateId: string;
  monthlyUnitsKwh: number;
  monthlyBillInr: number;
  sanctionedLoadKw: number;
}

export type SuitabilityOutcome = 
  | 'highly_suitable'
  | 'conditionally_suitable'
  | 'economically_marginal'
  | 'not_suitable'
  | 'needs_structural_survey';

export interface AssessmentResult {
  outcome: SuitabilityOutcome;
  outcomeLabel: string;
  headlineSummary: string;
  suitabilityScore: number; // 0 - 100
  effectiveUsableAreaSqFt: number;
  maxFeasibleCapacityKw: number;
  recommendedCapacityKw: number;
  monthlyEstimatedGenerationKwh: number;
  annualGenerationKwh: number;
  annualSavingsInr: number;
  pmSuryaGharSubsidyInr: number;
  estimatedGrossCostInr: number;
  netInvestmentInr: number;
  paybackPeriodYears: number;
  co2OffsetTonnesAnnual: number;
  decisionTreePath: {
    step: string;
    conditionEvaluated: string;
    passed: boolean;
    note: string;
  }[];
  criticalFlags: string[];
  recommendations: string[];
  nextSteps: string[];
}
