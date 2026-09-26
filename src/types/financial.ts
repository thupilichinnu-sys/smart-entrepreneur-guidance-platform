export interface RepaymentInstallment {
  installmentNumber: number;
  month: number;
  year: number;
  openingBalance: number;
  emi: number;
  principal: number;
  interest: number;
  closingBalance: number;
  isMoratorium: boolean;
}

export interface RepaymentPlan {
  principalLoan: number;
  interestRateAnnual: number;
  tenureMonths: number;
  moratoriumMonths: number;
  monthlyEMI: number;
  totalInterest: number;
  totalRepayment: number;
  effectiveSchedule: RepaymentInstallment[];
}

export interface OperatingCostBreakdown {
  rawMaterials: number;
  labour: number;
  electricityFuel: number;
  rent: number;
  transportLogistics: number;
  packaging: number;
  marketingSales: number;
  maintenanceRepairs: number;
  emergencyReserve: number;
}

export interface WorkingCapitalResult {
  monthlyOperatingCost: number;
  recommendedBufferMonths: number;
  recommendedWorkingCapital: number;
  estimatedBreakEvenMonths: number;
  breakEvenUnitsMonthly: number;
  projectedMonthlyRevenue: number;
  projectedNetMargin: number;
}
