import { User } from '../types/auth';
import { AssessmentData } from '../types/assessment';
import { FeasibilityReport } from '../types/business';
import { ActivityItem } from '../types/activity';

export const DEMO_USER: User = {
  id: 'usr_demo_lakshmi',
  fullName: 'Lakshmi Narayana Rao',
  mobile: '+919876543210',
  email: 'lakshmi.entrepreneur@ruralempower.org',
  state: 'Andhra Pradesh',
  district: 'Sri Sathya Sai',
  village: 'Penukonda Gram Panchayat',
  preferredLanguage: 'en',
  createdAt: '2026-03-01T10:00:00Z',
  marginCapital: 100000,
  experienceLevel: '1-2_years',
  skills: ['Dairy Management', 'Cattle Care', 'Basic Bookkeeping', 'Local Customer Network']
};

export const DEMO_ASSESSMENT: AssessmentData = {
  id: 'asm_demo_dairy',
  userId: 'usr_demo_lakshmi',
  location: {
    state: 'Andhra Pradesh',
    district: 'Sri Sathya Sai',
    block: 'Penukonda',
    gramPanchayat: 'Penukonda GP',
    village: 'Kottapalli Ward 4',
    pinCode: '515110',
    latitude: 14.0833,
    longitude: 77.5936
  },
  marginCapital: 100000, // ₹1 Lakh
  category: 'Dairy & Milk Products',
  subCategory: 'Milch Animal Unit & Fresh Milk Distribution',
  experienceLevel: '1-2_years',
  skills: ['Cattle Care', 'Milking Hygiene', 'Fodder Cultivation', 'Digital Payments'],
  existingAssets: ['0.5 Acre Fodder Land', 'Semi-pucca Cattle Shed', 'Two-wheeler with milk crates'],
  familyWorkforce: 2,
  targetMarket: 'cluster_5km',
  status: 'completed',
  updatedAt: new Date().toISOString(),
  progressPercent: 100
};

export const DEMO_FEASIBILITY_REPORT: FeasibilityReport = {
  id: 'rep_demo_dairy_01',
  businessName: 'Dairy & Milk Products Enterprise',
  category: 'Agriculture & FoodTech',
  overallScore: 82,
  status: 'Promising Opportunity',
  dateGenerated: new Date().toISOString(),
  metrics: {
    localDemand: 88,
    competition: 65,
    capitalFit: 91,
    marketReach: 84,
    supplyAvailability: 78,
    riskScore: 35 // Low-Medium
  },
  swot: {
    strengths: [
      'Daily non-cyclical cashflow from morning and evening residential sales.',
      'Existing 0.5 acre green fodder plot significantly cuts feed cost by 35%.',
      'Established trust and personal relationships within the village community.'
    ],
    weaknesses: [
      'Perishable product requiring reliable morning cold storage or instant distribution.',
      'Heavy initial physical labor requirements demanding dependable family support.'
    ],
    opportunities: [
      'Unfulfilled local appetite for farm-fresh buffalo curd, paneer, and pure desi ghee.',
      'Bulk institutional supply agreements with local residential schools and tea stalls.',
      'Government fodder seed subsidies and animal insurance under MoSJE schemes.'
    ],
    threats: [
      'Seasonal green fodder scarcity during peak summer months (April - June).',
      'Sudden localized milk price fluctuations by private commercial dairies.'
    ]
  },
  riskRadar: [
    {
      category: 'Market',
      severity: 'Low',
      score: 25,
      mitigation: 'Lock in 60% of daily milk output via advance monthly subscriptions to 25 local households.'
    },
    {
      category: 'Financial',
      severity: 'Medium',
      score: 45,
      mitigation: 'Maintain a 3-month emergency operating buffer of ₹35,000 for unexpected veterinary costs.'
    },
    {
      category: 'Supply',
      severity: 'Medium',
      score: 48,
      mitigation: 'Stock dry silage bags and concentrate cattle feed before seasonal summer dry spells.'
    },
    {
      category: 'Seasonal',
      severity: 'Medium',
      score: 42,
      mitigation: 'Diversify revenue in summer by converting unsold milk into shelf-stable clarified ghee.'
    },
    {
      category: 'Competition',
      severity: 'Low',
      score: 30,
      mitigation: 'Guarantee farm-to-door hygiene and pure unadulterated quality with lactometer demonstrations.'
    },
    {
      category: 'Operational',
      severity: 'Low',
      score: 28,
      mitigation: 'Enroll in local veterinary department monthly health checkup and vaccination calendar.'
    }
  ],
  pricing: {
    entryPrice: '₹52 / liter',
    competitivePrice: '₹56 - ₹58 / liter',
    premiumPrice: '₹65 / liter (Desi A2 / Curd & Paneer pack)',
    unit: 'Per Liter / Kg',
    notes: 'Indicative local rates verified against Penukonda Mandi and town retail prices.'
  },
  opportunities: [
    {
      title: 'Morning Doorstep Delivery Cluster',
      description: '35 households within 1.5 km willing to pay ₹58/L for verified pure unadulterated milk.',
      targetAudience: 'Semi-urban families and health-conscious households',
      potentialGrowth: '₹42,000 / month additional gross revenue'
    },
    {
      title: 'Value-Added Cottage Cheese (Paneer)',
      description: 'Supplying 15kg weekly paneer to 4 highway dhabas at ₹340/kg margin.',
      targetAudience: 'Local restaurants, banquet caterers, and sweets shops',
      potentialGrowth: '35% higher profit margin than raw milk'
    },
    {
      title: 'Organic Cow Dung Slurry & Vermicompost',
      description: 'Packaging cow dung and urine as organic natural manure for local horticulturists.',
      targetAudience: 'Mango orchard farmers and kitchen garden owners',
      potentialGrowth: '₹4,500 monthly passive income'
    }
  ],
  aiExecutiveSummary: {
    verdict: 'Highly feasible for Penukonda GP with controlled 4-milch animal initial deployment.',
    startingScale: 'Phase 1: 4 high-yield Murrah/Graded Buffaloes producing ~45-50 Liters/day.',
    targetCustomers: 'Morning residential door-to-door + evening tea-shop bulk delivery.',
    suggestedPricing: '₹56/L for raw milk; ₹70/kg for pure curd.',
    resourceNeeds: 'Pucca shed renovation, solar mini-chilling can, automated chaff cutter.',
    criticalRisks: 'Summer feed price inflation and mastitis infection prevention.',
    immediateNextSteps: [
      'Finalize beneficiary margin deposit of ₹1,00,000 in dedicated bank account.',
      'Submit DPR under MoSJE Term Loan Scheme for ₹9,00,000 financing.',
      'Collect formal quotations for 4 vaccinated milch cattle from certified livestock market.'
    ]
  }
};

export const DEMO_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act_1',
    userId: 'usr_demo_lakshmi',
    type: 'FEASIBILITY_GENERATED',
    title: 'Feasibility Report Generated',
    description: 'Dairy & Milk Products Enterprise (Score: 82/100)',
    timestamp: '2026-03-09T18:42:00Z',
    relatedBusiness: 'Dairy & Milk Products',
    relatedId: 'rep_demo_dairy_01',
    actionUrl: '/feasibility',
    actionLabel: 'View Report →'
  },
  {
    id: 'act_2',
    userId: 'usr_demo_lakshmi',
    type: 'FINANCIAL_PLAN_CREATED',
    title: 'Financial Plan Structured',
    description: '₹10,00,000 Project with ₹9,00,000 Term Loan at 8% p.a.',
    timestamp: '2026-03-09T18:31:00Z',
    relatedBusiness: 'Dairy & Milk Products',
    actionUrl: '/financial-planner',
    actionLabel: 'Open Financials →'
  },
  {
    id: 'act_3',
    userId: 'usr_demo_lakshmi',
    type: 'SCHEME_CHECKED',
    title: 'Scheme Matched: Term Loan Scheme',
    description: 'MoSJE Term Loan matched for ₹9.00L (7-year tenure, 6-mo moratorium)',
    timestamp: '2026-03-09T18:20:00Z',
    relatedBusiness: 'Term Loan Scheme',
    actionUrl: '/scheme-router',
    actionLabel: 'Check Scheme →'
  },
  {
    id: 'act_4',
    userId: 'usr_demo_lakshmi',
    type: 'BUSINESS_COMPARED',
    title: 'Business Compared',
    description: 'Compared Dairy & Milk Products vs Food Processing Mill',
    timestamp: '2026-03-08T17:15:00Z',
    actionUrl: '/compare',
    actionLabel: 'View Comparison →'
  },
  {
    id: 'act_5',
    userId: 'usr_demo_lakshmi',
    type: 'AI_ADVISOR_USED',
    title: 'SmartGuide AI Consulted',
    description: 'Inquired about summer fodder mitigation & monthly EMI breakdown',
    timestamp: '2026-03-08T16:45:00Z',
    actionUrl: '/ai-advisor',
    actionLabel: 'Resume Chat →'
  }
];
