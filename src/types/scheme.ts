export interface SchemeRule {
  id: string;
  name: string;
  code: string;
  ministry: string;
  department: string;
  minProjectCost: number;
  maxProjectCost: number;
  maxLoanAmount: number;
  fundingPercentage: number; // e.g. 90
  interestRate: number; // e.g. 6.5 or 8.0
  tenureYears: number;
  moratoriumMonths: number;
  description: string;
  eligibilityConditions: string[];
  documentsRequired: string[];
}

export interface SchemeMatchResult {
  isEligible: boolean;
  scheme: SchemeRule | null;
  calculatedProjectCost: number;
  marginAmount: number;
  beneficiaryPercentage: number;
  loanPercentage: number;
  potentialLoan: number;
  schemeMaxLoan: number;
  applicableLoan: number;
  cappedNotice?: string;
  exceedsNotice?: string;
  reasons: string[];
}
