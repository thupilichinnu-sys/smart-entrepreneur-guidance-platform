import { MICRO_FINANCE_SCHEME, TERM_LOAN_SCHEME } from '../data/schemeRules';
import { SchemeMatchResult } from '../types/scheme';
import { RepaymentPlan, RepaymentInstallment, OperatingCostBreakdown, WorkingCapitalResult } from '../types/financial';

/**
 * 1. Margin Rule: Beneficiary 10%, Financing 90%
 * Project Cost = Margin Capital / 0.10
 */
export function calculateProjectCost(marginCapital: number): number {
  if (marginCapital <= 0) return 0;
  return Math.round(marginCapital / 0.10);
}

/**
 * Theoretical 90% loan amount before scheme capping
 */
export function calculateTheoreticalLoan(projectCost: number): number {
  if (projectCost <= 0) return 0;
  return Math.round(projectCost * 0.90);
}

/**
 * Scheme Routing and Cap Logic:
 * Micro Finance: <= 1.40L, max loan 1.25L, 6.5% interest, 3 yrs, 3 mo moratorium
 * Term Loan: > 1.40L and <= 50L, max loan 45L, 8.0% interest, 7 yrs, 6 mo moratorium
 * > 50L: Exceeds supported scheme limit
 */
export function selectScheme(marginCapital: number): SchemeMatchResult {
  const projectCost = calculateProjectCost(marginCapital);
  const potential90PercentLoan = calculateTheoreticalLoan(projectCost);

  if (projectCost <= 0) {
    return {
      isEligible: false,
      scheme: null,
      calculatedProjectCost: 0,
      marginAmount: 0,
      beneficiaryPercentage: 10,
      loanPercentage: 90,
      potentialLoan: 0,
      schemeMaxLoan: 0,
      applicableLoan: 0,
      reasons: ['Please enter an initial margin capital.']
    };
  }

  // Case 1: Micro Finance Scheme (<= 1.40 Lakh)
  if (projectCost <= MICRO_FINANCE_SCHEME.maxProjectCost) {
    const schemeMax = MICRO_FINANCE_SCHEME.maxLoanAmount;
    const applicableLoan = Math.min(potential90PercentLoan, schemeMax);
    const isCapped = potential90PercentLoan > schemeMax;

    return {
      isEligible: true,
      scheme: MICRO_FINANCE_SCHEME,
      calculatedProjectCost: projectCost,
      marginAmount: marginCapital,
      beneficiaryPercentage: 10,
      loanPercentage: 90,
      potentialLoan: potential90PercentLoan,
      schemeMaxLoan: schemeMax,
      applicableLoan,
      cappedNotice: isCapped 
        ? `90% of project outlay (₹${potential90PercentLoan.toLocaleString('en-IN')}) exceeds the Micro Finance Scheme ceiling. Loan is capped at ₹${schemeMax.toLocaleString('en-IN')}.`
        : undefined,
      reasons: [
        'Project cost is within the Micro Finance threshold (≤ ₹1.40 Lakh).',
        'Eligible for concessional 6.5% p.a. interest with 3 months initial moratorium.'
      ]
    };
  }

  // Case 2: Term Loan Scheme (> 1.40 Lakh and <= 50 Lakh)
  if (projectCost <= TERM_LOAN_SCHEME.maxProjectCost) {
    const schemeMax = TERM_LOAN_SCHEME.maxLoanAmount;
    const applicableLoan = Math.min(potential90PercentLoan, schemeMax);
    const isCapped = potential90PercentLoan > schemeMax;

    return {
      isEligible: true,
      scheme: TERM_LOAN_SCHEME,
      calculatedProjectCost: projectCost,
      marginAmount: marginCapital,
      beneficiaryPercentage: 10,
      loanPercentage: 90,
      potentialLoan: potential90PercentLoan,
      schemeMaxLoan: schemeMax,
      applicableLoan,
      cappedNotice: isCapped 
        ? `90% of project outlay (₹${potential90PercentLoan.toLocaleString('en-IN')}) exceeds the Term Loan Scheme ceiling. Loan is capped at ₹${schemeMax.toLocaleString('en-IN')}.`
        : undefined,
      reasons: [
        'Project cost falls in the medium capital range (> ₹1.40 Lakh to ₹50 Lakh).',
        'Eligible for 8.0% p.a. interest rate over a 7-year horizon with 6 months moratorium.'
      ]
    };
  }

  // Case 3: Above ₹50 Lakh
  return {
    isEligible: false,
    scheme: null,
    calculatedProjectCost: projectCost,
    marginAmount: marginCapital,
    beneficiaryPercentage: 10,
    loanPercentage: 90,
    potentialLoan: potential90PercentLoan,
    schemeMaxLoan: 5000000,
    applicableLoan: 0,
    exceedsNotice: 'PROJECT SIZE EXCEEDS SUPPORTED SCHEME LIMIT. Maximum eligible project outlay under standard MoSJE credit schemes is ₹50 Lakh. Reduce the project size or explore consortium/commercial financing.',
    reasons: [
      'Project cost exceeds the statutory maximum limit of ₹50.00 Lakh for supported concessional schemes.'
    ]
  };
}

/**
 * Standard Amortization Formula:
 * EMI = P * r * (1+r)^n / ((1+r)^n - 1)
 */
export function calculateEMI(principal: number, annualInterestRate: number, tenureMonths: number): number {
  if (principal <= 0 || annualInterestRate <= 0 || tenureMonths <= 0) return 0;
  const monthlyRate = annualInterestRate / 12 / 100;
  const numerator = principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths);
  const denominator = Math.pow(1 + monthlyRate, tenureMonths) - 1;
  return Math.round(numerator / denominator);
}

/**
 * Repayment Lifecycle Generator with Moratorium Handling
 */
export function generateRepaymentPlan(
  principalLoan: number,
  annualInterestRate: number,
  tenureYears: number,
  moratoriumMonths: number
): RepaymentPlan {
  const totalMonths = tenureYears * 12;
  const repaymentMonths = Math.max(1, totalMonths - moratoriumMonths);
  const monthlyRate = annualInterestRate / 12 / 100;

  const monthlyEMI = calculateEMI(principalLoan, annualInterestRate, repaymentMonths);

  let balance = principalLoan;
  let totalInterest = 0;
  const schedule: RepaymentInstallment[] = [];

  // Moratorium Months: Simple interest accrues or is serviced
  for (let m = 1; m <= moratoriumMonths; m++) {
    const interest = Math.round(balance * monthlyRate);
    totalInterest += interest;
    schedule.push({
      installmentNumber: m,
      month: m,
      year: Math.ceil(m / 12),
      openingBalance: balance,
      emi: interest, // Simple interest servicing during moratorium
      principal: 0,
      interest,
      closingBalance: balance,
      isMoratorium: true
    });
  }

  // Active Repayment Months
  for (let m = moratoriumMonths + 1; m <= totalMonths; m++) {
    if (balance <= 0) break;
    const interest = Math.round(balance * monthlyRate);
    let principal = monthlyEMI - interest;
    if (m === totalMonths || principal > balance) {
      principal = balance;
    }
    const emi = principal + interest;
    const closingBalance = Math.max(0, balance - principal);
    totalInterest += interest;

    schedule.push({
      installmentNumber: m,
      month: m,
      year: Math.ceil(m / 12),
      openingBalance: balance,
      emi,
      principal,
      interest,
      closingBalance,
      isMoratorium: false
    });

    balance = closingBalance;
  }

  const totalRepayment = principalLoan + totalInterest;

  return {
    principalLoan,
    interestRateAnnual: annualInterestRate,
    tenureMonths: totalMonths,
    moratoriumMonths,
    monthlyEMI,
    totalInterest,
    totalRepayment,
    effectiveSchedule: schedule
  };
}

/**
 * Working Capital and Break-Even Planning
 */
export function calculateWorkingCapital(
  costs: OperatingCostBreakdown,
  projectedMonthlyRevenue: number,
  bufferMonths: number = 3
): WorkingCapitalResult {
  const monthlyOperatingCost = 
    costs.rawMaterials +
    costs.labour +
    costs.electricityFuel +
    costs.rent +
    costs.transportLogistics +
    costs.packaging +
    costs.marketingSales +
    costs.maintenanceRepairs +
    costs.emergencyReserve;

  const recommendedWorkingCapital = monthlyOperatingCost * bufferMonths;
  const monthlyProfit = projectedMonthlyRevenue - monthlyOperatingCost;
  const projectedNetMargin = projectedMonthlyRevenue > 0 
    ? Math.round((monthlyProfit / projectedMonthlyRevenue) * 100) 
    : 0;

  // Indicative break-even unit estimation
  const fixedOverheads = costs.rent + costs.electricityFuel + costs.maintenanceRepairs + costs.emergencyReserve;
  const variableCostUnitRatio = 0.60;
  const estimatedBreakEvenRevenue = fixedOverheads / (1 - variableCostUnitRatio);
  const estimatedBreakEvenMonths = monthlyProfit > 0 
    ? Math.max(2, Math.min(18, Math.round(recommendedWorkingCapital / Math.max(1, monthlyProfit))))
    : 12;

  return {
    monthlyOperatingCost,
    recommendedBufferMonths: bufferMonths,
    recommendedWorkingCapital,
    estimatedBreakEvenMonths,
    breakEvenUnitsMonthly: Math.round(estimatedBreakEvenRevenue / 55), // benchmarked per unit cost
    projectedMonthlyRevenue,
    projectedNetMargin
  };
}
