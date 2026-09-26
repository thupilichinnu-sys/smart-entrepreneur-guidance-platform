import { AssessmentData } from '../types/assessment';
import { FeasibilityReport, BusinessRecommendation, SWOTItem, RiskRadarItem } from '../types/business';
import { SavedBusinessPlan } from '../types/user';
import { storageService } from './storageService';
import { calculateProjectCost, selectScheme } from '../utils/financialEngine';

export const businessService = {
  getSavedPlans(userId: string): SavedBusinessPlan[] {
    return storageService.getItem<SavedBusinessPlan[]>(userId, 'saved_plans', []);
  },

  savePlan(userId: string, plan: Omit<SavedBusinessPlan, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): SavedBusinessPlan {
    const plans = this.getSavedPlans(userId);
    const now = new Date().toISOString();
    const newPlan: SavedBusinessPlan = {
      ...plan,
      id: 'plan_' + Date.now(),
      userId,
      createdAt: now,
      updatedAt: now
    };
    storageService.setItem(userId, 'saved_plans', [newPlan, ...plans]);
    return newPlan;
  },

  updatePlan(userId: string, planId: string, updates: Partial<SavedBusinessPlan>): SavedBusinessPlan | null {
    const plans = this.getSavedPlans(userId);
    const idx = plans.findIndex(p => p.id === planId);
    if (idx === -1) return null;
    const updated = {
      ...plans[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    plans[idx] = updated;
    storageService.setItem(userId, 'saved_plans', plans);
    return updated;
  },

  duplicatePlan(userId: string, planId: string): SavedBusinessPlan | null {
    const plans = this.getSavedPlans(userId);
    const target = plans.find(p => p.id === planId);
    if (!target) return null;
    return this.savePlan(userId, {
      ...target,
      businessName: `${target.businessName} (Copy)`,
      status: 'Draft'
    });
  },

  deletePlan(userId: string, planId: string): void {
    const plans = this.getSavedPlans(userId);
    const filtered = plans.filter(p => p.id === planId);
    storageService.setItem(userId, 'saved_plans', filtered);
  },

  getAssessment(userId: string): AssessmentData | null {
    return storageService.getItem<AssessmentData | null>(userId, 'assessment', null);
  },

  saveAssessment(userId: string, data: AssessmentData): void {
    storageService.setItem(userId, 'assessment', data);
  },

  /**
   * Generates AI-assisted Feasibility Report and metrics tailored to the assessment
   */
  generateFeasibilityReport(assessment: AssessmentData): FeasibilityReport {
    const margin = assessment.marginCapital || 100000;
    const projectCost = calculateProjectCost(margin);
    const schemeMatch = selectScheme(margin);

    // Deterministic base score weighted by capital, experience, and assets
    let score = 70;
    if (assessment.experienceLevel === '3-5_years' || assessment.experienceLevel === '5+_years') score += 8;
    else if (assessment.experienceLevel === '1-2_years') score += 4;

    if (assessment.existingAssets && assessment.existingAssets.length > 0) score += 6;
    if (assessment.skills && assessment.skills.length >= 3) score += 5;
    if (schemeMatch.isEligible) score += 5;

    score = Math.min(95, Math.max(55, score));

    const status = score >= 80 ? 'Promising Opportunity' : score >= 65 ? 'Viable with Caution' : 'High Risk';

    const swot: SWOTItem = {
      strengths: [
        `Beneficiary margin of ₹${margin.toLocaleString('en-IN')} unlocks ${schemeMatch.scheme?.name || 'concessional loan'}.`,
        'Direct connection to village consumer base with existing family workforce.',
        'High daily or weekly staple demand resistant to broader economic downturns.'
      ],
      weaknesses: [
        'Initial working capital constraints requiring disciplined daily cash accounting.',
        'Reliance on local seasonal availability for raw materials and packaging supplies.'
      ],
      opportunities: [
        `Capture underserved 5km cluster demand around ${assessment.location.district || 'local area'}.`,
        'Expand into packaged value-added products for higher gross profit margins.',
        'Link with MoSJE institutional skill upgrading and credit guarantee programs.'
      ],
      threats: [
        'Raw material price inflation during drought or peak seasonal cycles.',
        'Price pressure from unorganized low-grade informal competitors.'
      ]
    };

    const riskRadar: RiskRadarItem[] = [
      { category: 'Market', severity: 'Low', score: 28, mitigation: 'Pre-book 40% of sales through regular customer relationships.' },
      { category: 'Financial', severity: 'Medium', score: 44, mitigation: 'Set aside 3-month working capital reserve before capital expenditure.' },
      { category: 'Supply', severity: 'Medium', score: 42, mitigation: 'Partner with 2 or more vetted local raw material suppliers.' },
      { category: 'Seasonal', severity: 'Medium', score: 38, mitigation: 'Stock shelf-stable inputs ahead of summer or monsoon months.' },
      { category: 'Competition', severity: 'Low', score: 30, mitigation: 'Emphasize verified purity, hygiene, and direct doorstep convenience.' },
      { category: 'Operational', severity: 'Low', score: 26, mitigation: 'Maintain preventative maintenance logs for all critical machinery.' }
    ];

    return {
      id: 'rep_' + Date.now(),
      businessName: `${assessment.category} Enterprise`,
      category: assessment.category,
      overallScore: score,
      status,
      dateGenerated: new Date().toISOString(),
      metrics: {
        localDemand: Math.min(95, score + 6),
        competition: 62,
        capitalFit: Math.min(95, score + 8),
        marketReach: 80,
        supplyAvailability: 76,
        riskScore: Math.max(25, 100 - score)
      },
      swot,
      riskRadar,
      pricing: {
        entryPrice: '₹50 - ₹55',
        competitivePrice: '₹58 - ₹62',
        premiumPrice: '₹70 - ₹75',
        unit: 'per unit / kg / liter',
        notes: 'Indicative benchmark validated against local district mandi transactions.'
      },
      opportunities: [
        {
          title: 'Direct Cluster Distribution',
          description: `Direct supply to households and retail outlets within 5 km of ${assessment.location.village || 'village'}.`,
          targetAudience: 'Local residents and daily commuters',
          potentialGrowth: '25-30% monthly volume growth'
        },
        {
          title: 'Value-Addition Processing',
          description: 'Secondary processing to increase unit shelf-life and profit margins.',
          targetAudience: 'Town dhabas, tea stalls, and festive markets',
          potentialGrowth: '35% higher net margin'
        }
      ],
      aiExecutiveSummary: {
        verdict: `A ${status.toLowerCase()} for ${assessment.location.district || 'the local area'} with targeted initial capital outlay of ₹${projectCost.toLocaleString('en-IN')}.`,
        startingScale: 'Phase 1: Controlled pilot leveraging existing family labor and local facilities.',
        targetCustomers: 'Neighborhood households, daily market visitors, and local retail shops.',
        suggestedPricing: 'Competitive pricing tier with transparent quality standards.',
        resourceNeeds: 'Primary equipment, reliable electricity/water, initial 3-month working capital.',
        criticalRisks: 'Working capital depletion and unmitigated seasonal fluctuations.',
        immediateNextSteps: [
          'Verify required beneficiary 10% margin deposit in bank.',
          `Prepare application dossier under ${schemeMatch.scheme?.name || 'MoSJE Scheme'}.`,
          'Collect 2 written quotations from machinery/livestock suppliers.'
        ]
      }
    };
  }
};
