// Types for Algorand Foundation data

export interface TransparencyReport {
  reportNumber: number;
  period: string;
  duration: string;
  reportDate: string;
  algoDistributed: number;
  incentivesTotal?: number;
  totalHoldings?: number;
  fiatUSD: number | null;
  balanceSheet: BalanceSheetStatus;
  keyChanges: string;
  details?: ReportDetails;
}

export interface ReportDetails {
  distributions: Distribution[];
  disclosures: Disclosure[];
  keyEvents: string[];
}

export interface Distribution {
  category: string;
  amount: string;
  notes?: string;
}

export interface Disclosure {
  label: string;
  value: string;
}

export type BalanceSheetStatus = 
  | 'NO' 
  | 'YES' 
  | 'YES - First' 
  | 'YES - Restructured' 
  | 'YES - Simplified' 
  | 'NEW FORMAT' 
  | 'QUARTERLY';

export interface FoundationSummary {
  totalReports: number;
  totalAlgoDistributed: number;
  totalFiatUSD: number;
  latestReportDate: string;
  reports: TransparencyReport[];
}
