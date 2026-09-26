import { SchemeRule } from '../types/scheme';

export const MICRO_FINANCE_SCHEME: SchemeRule = {
  id: 'scheme_micro_finance',
  name: 'Micro Finance Scheme',
  code: 'MoSJE-MFS-01',
  ministry: 'Ministry of Social Justice and Empowerment (MoSJE)',
  department: 'Department of Social Justice and Empowerment',
  minProjectCost: 10000,
  maxProjectCost: 140000,
  maxLoanAmount: 125000,
  fundingPercentage: 90,
  interestRate: 6.5,
  tenureYears: 3,
  moratoriumMonths: 3,
  description: 'Concessional credit scheme designed for micro-enterprises, rural artisans, and small scale food/trade units with project cost up to ₹1.40 Lakh.',
  eligibilityConditions: [
    'Target beneficiaries under MoSJE guidelines (SC/OBC/EBC/DNT/Safai Karamcharis).',
    'Annual family income within prescribed limits for rural/semi-urban areas.',
    'Beneficiary margin contribution of minimum 10% of total project cost.',
    'Applicant should not be a defaulter with any financial institution.'
  ],
  documentsRequired: [
    'Aadhaar Card & Proof of Identity',
    'Community / Category Certificate from competent Revenue Authority',
    'Income Certificate issued by Revenue Authority',
    'Bank Account Details (Passbook copy / Cancelled Cheque)',
    'Simple Business Quotation or Asset Estimate'
  ]
};

export const TERM_LOAN_SCHEME: SchemeRule = {
  id: 'scheme_term_loan',
  name: 'Term Loan Scheme',
  code: 'MoSJE-TLS-02',
  ministry: 'Ministry of Social Justice and Empowerment (MoSJE)',
  department: 'Department of Social Justice and Empowerment',
  minProjectCost: 140001,
  maxProjectCost: 5000000,
  maxLoanAmount: 4500000,
  fundingPercentage: 90,
  interestRate: 8.0,
  tenureYears: 7,
  moratoriumMonths: 6,
  description: 'Flagship medium-term capital investment facility for setting up viable income-generating enterprises in agriculture, processing, transport, services and trade.',
  eligibilityConditions: [
    'Eligible target group beneficiaries as per MoSJE developmental corporation criteria.',
    'Project cost between ₹1.40 Lakh and ₹50.00 Lakh.',
    'Beneficiary minimum equity/margin capital of 10% of project outlay.',
    'Feasible project proposal with adequate debt-service coverage ability.'
  ],
  documentsRequired: [
    'Identity and Address Proof (Aadhaar, Voter ID, Ration Card)',
    'Valid Caste/Community Certificate',
    'Annual Family Income Declaration / Certificate',
    'Detailed Project Report (DPR) or Project Profile',
    'Land ownership / lease agreement / trade premise occupancy proof',
    'Equipment supplier quotations & valid bank account statements'
  ]
};

export const ALL_SCHEMES: SchemeRule[] = [MICRO_FINANCE_SCHEME, TERM_LOAN_SCHEME];
