export interface EducationalSection {
  id: string;
  questionNumber: number;
  title: string;
  summary: string;
  badge: string;
  points: {
    heading: string;
    detail: string;
    iconName?: string;
  }[];
  tableData?: {
    headers: string[];
    rows: (string | number)[][];
  };
  callout?: string;
  sources?: string[];
}

export const PRESENTATION_QUESTIONS: EducationalSection[] = [
  {
    id: 'q1-indian-context',
    questionNumber: 1,
    title: 'Why This Problem Matters in the Indian Context',
    badge: 'Socio-Economic & Urban Context',
    summary: 'India has over 300 million households and aggressive national targets under the PM Surya Ghar: Muft Bijli Yojana (1 Crore solar rooftops). Yet, millions of consumers remain hesitant or misinformed about whether their specific roof can generate clean energy.',
    points: [
      {
        heading: 'Household vs. Building-Level Disconnect',
        detail: 'In Indian cities (Delhi, Mumbai, Bengaluru), multi-story apartments and cooperative housing societies (CHSs) make up a vast share of residences. While an individual flat resident pays high monthly electricity bills, the terrace is commonly owned property requiring Resident Welfare Association (RWA) consensus, dispute resolution, and virtual net-metering norms.'
      },
      {
        heading: 'Rooftop Utilization & Cultural Habitation',
        detail: 'Indian rooftops are active living spaces — used for drying spices and clothes, water overhead tanks (Sintex/RCC), satellite dishes, mumty/staircase rooms, solar water heaters, and family gatherings. Calculating raw roof area without subtracting these active obstructions leads to failed installations.'
      },
      {
        heading: 'Information Asymmetry & Vendor Mistrust',
        detail: 'Homeowners are overwhelmed by technical jargon (kW vs kWh, mono-PERC vs poly, net vs gross metering, string vs microinverters). Many fear being cheated by unverified contractors or fear structural slab damage and roof leakage.'
      },
      {
        heading: 'Who is Affected?',
        detail: 'Middle-income homeowners facing escalating tiered power bills, elderly residents struggling with complex subsidy paperwork, housing society presidents needing consensus-building facts, and DISCOMs trying to reduce peak distribution stress.'
      }
    ],
    callout: 'Bridging the awareness gap through a transparent preliminary checker prevents consumer exploitation and accelerates the adoption of SDG 7 (Affordable and Clean Energy).'
  },
  {
    id: 'q2-information-needed',
    questionNumber: 2,
    title: 'Required Information & Decision Factors',
    badge: 'Physics & Engineering Factors',
    summary: 'To assess solar feasibility without costly instruments, four primary factors govern the physical and financial viability of the rooftop.',
    points: [
      {
        heading: '1. Usable Shadow-Free Roof Space (Area & Geometry)',
        detail: 'Every 1 kWp of solar capacity requires approximately 100 sq. ft. (~9.3 m²) of contiguous, unshaded area. The shape matters: narrow corridors or roofs sliced by clotheslines and water pipes restrict module strings. In India, panels must face South (or South-South-East) tilted at the local latitude (typically 12° to 28°) for maximum annual yield.'
      },
      {
        heading: '2. Shading & Sunlight Obstruction (The 9 AM - 4 PM Rule)',
        detail: 'Solar arrays generate 80% to 85% of their energy between 9:00 AM and 4:00 PM. Even a thin shadow from a parapet wall, television antenna, or neighbor’s water tank can trigger bypass diodes or cause localized module heating (hot-spots), dragging down the generation of the entire connected string.'
      },
      {
        heading: '3. Solar Insolation / Sunlight Resource (GHI)',
        detail: 'India receives abundant sunlight — averaging 4.5 to 5.8 kWh/m²/day and 250 to 300 sunny days annually. Northern desert states (Rajasthan, Gujarat) receive higher irradiation than high-precipitation or coastal regions (Kerala, Assam) that encounter prolonged monsoon cloud cover.'
      },
      {
        heading: '4. Electricity Needs & Sanctioned Load',
        detail: 'A system sized too large risks unused energy sold at lower average power purchase cost (APPC) export rates; a system sized too small will not meaningfully offset tiered tariffs. DISCOMs in India mandate that rooftop solar capacity cannot exceed 80% to 100% of the household’s sanctioned electricity load.'
      }
    ],
    tableData: {
      headers: ['Parameter', 'Ideal Requirement', 'Impact on Suitability'],
      rows: [
        ['Roof Area', '>= 100 sq ft per 1 kW', 'Determines maximum plant capacity physically mountable.'],
        ['Shadow-Free Window', 'Unobstructed 9:00 AM – 4:00 PM', 'Crucial for system efficiency and payback feasibility.'],
        ['Roof Structure', 'Reinforced Concrete (RCC) or Tin shed', 'Must sustain 150 km/h wind thrust and 15-20 kg/m² load.'],
        ['Electric Load', 'Sanctioned load >= Planned solar kW', 'Required for DISCOM net-metering connectivity approval.'],
        ['Roof Ownership', 'Sole Owner or RWA NOC', 'Legal prerequisite for government subsidy disbursement.']
      ]
    }
  },
  {
    id: 'q3-decision-tree-schematic',
    questionNumber: 3,
    title: 'Decision Tree Architecture & Branch Logic',
    badge: 'Algorithm & Flowchart Logic',
    summary: 'The simulator employs a deterministic multi-stage decision tree that filters disqualifiers early, quantifies constraints, and concludes with one of five distinct outcome states.',
    points: [
      {
        heading: 'Stage 1: Gatekeeper / Legal Rights Filter',
        detail: 'Question: "Do you own the terrace, or do you have formal RWA/Society NOC?" If Rented/No NOC → Terminal Node: Not Suitable (Legal barrier). If Shared Society → Branch to Conditionally Suitable with RWA resolution flag.'
      },
      {
        heading: 'Stage 2: Structural Integrity & Material Filter',
        detail: 'Question: "What is the roof constructed of, and is the slab healthy?" If Asbestos/Temporary Tin → Terminal Node: Not Suitable (Civil Safety Hazard). If Severe Seepage/Cracks → Terminal Node: Needs Structural Civil Audit before mounting.'
      },
      {
        heading: 'Stage 3: Spatial Dimensioning Filter',
        detail: 'Question: "Is effective shadow-free area >= 100 sq ft?" If No → Terminal Node: Not Suitable (Insufficient space for standard 1 kW array). If Yes → Calculate Max Space Capacity = Floor(Effective Area / 100).'
      },
      {
        heading: 'Stage 4: Shading & Obstruction Filter',
        detail: 'Question: "Is the roof shaded during 9 AM - 4 PM?" If Severe (>60% shade) → Terminal Node: Not Suitable (Poor ROI). If Heavy (30-60%) → Branch to Conditionally Suitable (Recommends elevated 7ft GI structure or microinverters). If Minimal (<10%) → Proceed to Stage 5.'
      },
      {
        heading: 'Stage 5: Demand & Sizing Synthesis',
        detail: 'Match monthly consumption (kWh) with sanctioned load. If Monthly units < 90 kWh → Economically Marginal. If consumption is normal and space is clear → Terminal Node: Highly Suitable (Prime Candidate).'
      }
    ],
    callout: 'Branch outcomes ensure that users receive honest, conservative guidance rather than an aggressive commercial sales pitch.'
  },
  {
    id: 'q4-assumptions-thresholds',
    questionNumber: 4,
    title: 'Assumptions, Thresholds & Technical Justification',
    badge: 'Standards & Formulas',
    summary: 'Every numerical benchmark in this tool is derived directly from Ministry of New & Renewable Energy (MNRE), National Institute of Solar Energy (NISE), and Central Electricity Authority (CEA) guidelines.',
    points: [
      {
        heading: '100 sq ft per 1 kWp (Area Rule)',
        detail: 'Modern monocrystalline PERC solar panels deliver 540W to 580W with ~21% efficiency, occupying ~28 sq ft per panel. Two panels yield ~1.1 kW in ~56 sq ft. An additional 40-45 sq ft is mandatory for inter-row spacing to prevent self-shading during low winter sun angles and to provide cleaning walkways.'
      },
      {
        heading: '9:00 AM to 4:00 PM Shadow-Free Threshold',
        detail: 'In tropical latitudes (8°N to 37°N across India), 80-85% of diurnal solar irradiance is concentrated in this 7-hour window. Shadow analysis outside this window (early dawn/dusk) has negligible impact on annual generation.'
      },
      {
        heading: '1 kW = ~120 to 140 Units/Month (Generation Benchmark)',
        detail: 'Given an average Performance Ratio (PR) of 75-78% (accounting for inverter losses, dust soiling, cable impedance, and temperature derating) and GHI of 4.5 to 5.5 kWh/m²/day, 1 kW generates ~4 to 4.5 units per day or ~120-140 units/month.'
      },
      {
        heading: 'PM Surya Ghar Central Financial Assistance (CFA) Rules',
        detail: 'Under the 2024-2026 scheme: ₹30,000 for 1 kW; ₹60,000 for 2 kW; ₹78,000 for 3 kW and above. Residential housing society common areas get ₹18,000/kW up to 500 kW.'
      }
    ],
    tableData: {
      headers: ['Capacity (kW)', 'Usable Area Req.', 'Monthly Generation', 'Govt Subsidy (CFA)', 'Estimated Net Cost'],
      rows: [
        ['1 kW', '~100 sq ft', '~120 - 135 units', '₹30,000', '₹35,000'],
        ['2 kW', '~200 sq ft', '~240 - 270 units', '₹60,000', '₹70,000'],
        ['3 kW', '~300 sq ft', '~360 - 410 units', '₹78,000', '₹1,17,000'],
        ['5 kW', '~500 sq ft', '~600 - 680 units', '₹78,000 (Capped)', '₹2,47,000']
      ]
    }
  },
  {
    id: 'q5-limitations',
    questionNumber: 5,
    title: 'Realistic Limitations of a Preliminary Non-Professional Checker',
    badge: 'Disclaimer & System Boundaries',
    summary: 'A self-service digital prototype provides fast, preliminary triage. It intentionally does not replace a stamped professional solar engineering assessment.',
    points: [
      {
        heading: '1. No 3D Horizonal Shading Horizon (Sun-Eye / LiDAR)',
        detail: 'This simulator relies on user-estimated shading percentage. It cannot compute high-resolution 3D shadow matrices caused by distant seasonal obstructions or winter sun trajectories without drone photogrammetry or a Solar Pathfinder.'
      },
      {
        heading: '2. Slab Core Load-Bearing Structural Testing',
        detail: 'The app checks user-reported roof type (RCC vs sheet), but cannot inspect concrete compressive strength, rebar corrosion, or dead-weight bearing capacity for high-wind seismic zones.'
      },
      {
        heading: '3. Transformer Margin & DISCOM Feeder Hosting Capacity',
        detail: 'In India, DISCOM regulations limit total connected rooftop solar on any local distribution transformer (DT) to 75%-80% of rated capacity. Even if a roof is perfect, the local transformer may already be saturated.'
      },
      {
        heading: '4. Micro-Climate & Soiling Factors',
        detail: 'Urban dust, industrial soot, heavy seasonal monsoons, and extreme summer temperatures (>45°C in North India, which causes panel voltage drop) require specialized on-site cleaning schedules and inverter sizing.'
      }
    ],
    callout: 'Always treat this result as an empowering pre-qualification tool. Final financial and procurement contracts require a physical on-site DISCOM-empanelled vendor survey.'
  },
  {
    id: 'q6-reliable-sources',
    questionNumber: 6,
    title: 'Reliable Official Sources & Verification Guidelines',
    badge: 'Institutional Citations',
    summary: 'All solar policies, irradiation data, and subsidy rules must be cross-verified against official Indian government and scientific repositories.',
    points: [
      {
        heading: 'Ministry of New & Renewable Energy (MNRE)',
        detail: 'URL: mnre.gov.in — The apex ministry issuing national benchmark costs, technical specifications for solar PV modules (ALMM list), and inverters.'
      },
      {
        heading: 'PM Surya Ghar: Muft Bijli Yojana National Portal',
        detail: 'URL: pmsuryaghar.gov.in — Official government single-window portal for online subsidy applications, empanelled vendor lists, and consumer grievance tracking.'
      },
      {
        heading: 'National Institute of Solar Energy (NISE)',
        detail: 'URL: nise.res.in — Autonomous apex R&D institution under MNRE that maintains the National Solar Radiation Data and test laboratories in Gurugram, Haryana.'
      },
      {
        heading: 'Global Solar Atlas (World Bank / Solargis)',
        detail: 'URL: globalsolaratlas.info — Open-access, high-precision GIS database for Global Horizontal Irradiance (GHI) and Direct Normal Irradiance (DNI) across every Indian district.'
      },
      {
        heading: 'State Electricity Regulatory Commissions (SERCs) & DISCOMs',
        detail: 'E.g., DERC (Delhi), KERC/BESCOM (Karnataka), MERC (Maharashtra), TNERC (Tamil Nadu) — for state-specific Net Metering, Gross Metering, and Banking settlement regulations.'
      }
    ]
  }
];

export interface PitchSlide {
  step: 'Problem' | 'Solution' | 'Impact' | 'Technology Used' | 'Limitation';
  timeSeconds: number;
  speechScript: string;
  keyBullets: string[];
  sdgGoal: string;
}

export const TWO_MINUTE_PITCH: PitchSlide[] = [
  {
    step: 'Problem',
    timeSeconds: 30,
    speechScript: `Respected judges and teachers: Rooftop solar is vital for clean energy, yet in India, millions of citizens are held back by one fundamental question: "Is my roof actually suitable?" Most people are confused by technical jargon like shadow windows, dead load, and net metering. Apartment dwellers struggle with shared terrace rules, while vendors often oversell unviable systems. This lack of preliminary clarity stalls India's clean energy transition.`,
    keyBullets: [
      'Over 300 million Indian households face confusing solar jargon and vendor distrust',
      'Terraces are congested with water tanks, clotheslines, and seasonal shadows',
      'Apartment residents lack clear consensus mechanisms for shared roofs',
      'SDG 7 barrier: Millions stall before ever contacting a vendor'
    ],
    sdgGoal: 'SDG 7: Affordable & Clean Energy'
  },
  {
    step: 'Solution',
    timeSeconds: 30,
    speechScript: `To solve this, we created SuryaCheck — an intelligent, interactive Decision-Tree Simulation. In under two minutes, any resident can enter their roof dimensions, shadow conditions, and monthly electric bill. Our algorithm transparently traces engineering rules from MNRE and PM Surya Ghar, categorizing the property into clear outcomes: Highly Suitable, Conditionally Suitable, or requiring structural repairs, complete with subsidy calculations.`,
    keyBullets: [
      'Interactive, transparent 5-stage decision-tree simulation',
      'Calculates usable shadow-free area (100 sq ft / kW) and 9 AM - 4 PM exposure',
      'Provides preliminary guidance with PM Surya Ghar subsidy estimations',
      'Simulates real Indian archetypes (villas, cooperative societies, dense chawls)'
    ],
    sdgGoal: 'SDG 7.2: Renewable Energy Acceleration'
  },
  {
    step: 'Impact',
    timeSeconds: 30,
    speechScript: `The impact is transformative. By demystifying suitability at the household level, SuryaCheck empowers families to save up to 80% on their electricity bills under the PM Surya Ghar Muft Bijli Yojana. For every 3 kW system adopted, we eliminate roughly 3.6 tonnes of CO2 emissions annually — equivalent to planting 160 trees. It converts rooftop solar from an intimidating engineering chore into an accessible civic movement.`,
    keyBullets: [
      'Empowers citizens to capture ₹30,000 - ₹78,000 in Central Financial Assistance',
      'Average 3 kW installation cuts ~3.6 Tonnes of CO2 emissions every year',
      'Reduces peak load strain on regional Indian DISCOMs',
      'Directly supports India\'s 500 GW non-fossil capacity target by 2030'
    ],
    sdgGoal: 'SDG 7: Clean Energy & Climate Action'
  },
  {
    step: 'Technology Used',
    timeSeconds: 15,
    speechScript: `We engineered this lightweight, accessible digital prototype using a deterministic rule engine in TypeScript and React. It incorporates state-level solar insolation databases from NISE and NASA POWER, paired with an interactive visual decision tree that teaches students and residents the exact logic behind each recommendation.`,
    keyBullets: [
      'TypeScript & React deterministic decision-tree logic engine',
      'Grounded in MNRE, NISE & Global Solar Atlas solar radiation datasets',
      'Zero-tracking, privacy-first: no personal or sensitive data stored',
      'Instant printable PDF solar suitability briefing report'
    ],
    sdgGoal: 'Accessible Citizen Science'
  },
  {
    step: 'Limitation',
    timeSeconds: 15,
    speechScript: `SuryaCheck is an advisory first-step tool, not a professional stamp. Its primary limitation is that it cannot perform physical 3D obstacle horizon scanning or test concrete slab compressive load-bearing limits. It guides the citizen forward, but must be validated with an on-site DISCOM-empanelled vendor survey before procurement. Thank you!`,
    keyBullets: [
      'Preliminary guidance only — not a substitute for stamped civil engineering',
      'Cannot measure seasonal 3D shadow horizons without LiDAR / on-site tools',
      'Local transformer hosting capacity must be verified with the DISCOM',
      'Always mandates a final physical on-site vendor inspection'
    ],
    sdgGoal: 'Responsible Preliminary AI Guidance'
  }
];
