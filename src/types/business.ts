export interface BusinessRecommendation {
  id: string;
  title: string;
  category: string;
  indicativeScore: number;
  minCapital: number;
  demandRating: 'High' | 'Medium' | 'Emerging';
  riskLevel: 'Low' | 'Medium' | 'High';
  summary: string;
  keyAdvantages: string[];
}

export interface SWOTItem {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface RiskRadarItem {
  category: 'Market' | 'Financial' | 'Supply' | 'Seasonal' | 'Competition' | 'Operational';
  severity: 'Low' | 'Medium' | 'High';
  score: number; // 0 - 100
  mitigation: string;
}

export interface PricingTier {
  entryPrice: string;
  competitivePrice: string;
  premiumPrice: string;
  unit: string;
  notes: string;
}

export interface MarketOpportunity {
  title: string;
  description: string;
  targetAudience: string;
  potentialGrowth: string;
}

export interface FeasibilityReport {
  id: string;
  businessName: string;
  category: string;
  overallScore: number;
  status: 'Promising Opportunity' | 'Viable with Caution' | 'High Risk';
  dateGenerated: string;
  metrics: {
    localDemand: number;
    competition: number;
    capitalFit: number;
    marketReach: number;
    supplyAvailability: number;
    riskScore: number;
  };
  swot: SWOTItem;
  riskRadar: RiskRadarItem[];
  pricing: PricingTier;
  opportunities: MarketOpportunity[];
  aiExecutiveSummary: {
    verdict: string;
    startingScale: string;
    targetCustomers: string;
    suggestedPricing: string;
    resourceNeeds: string;
    criticalRisks: string;
    immediateNextSteps: string[];
  };
}

export interface CompetitorData {
  id: string;
  name: string;
  category: string;
  distanceKm: number;
  estimatedVolume: string;
  priceLevel: 'Budget' | 'Competitive' | 'Premium';
  coordinates: [number, number];
  address: string;
  keyGaps: string;
}
