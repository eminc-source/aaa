// FIAT/USD EXPENSE TRACKING
// Note: Fiat expenses first disclosed in R4. R1-R3 had NO fiat disclosure. R8 changed format.

export interface FiatExpenseItem {
  name: string;
  values: { [reportKey: string]: number | string | null };
  total: number | string;
  notes?: string;
}

export interface CryptoLoss {
  name: string;
  amount: number;
  description: string;
}

export interface ArringtonDetails {
  originalInvestment: { amount: number; description: string };
  returnedToFoundation: { amount: number; description: string };
  illiquidSAFEs: { amount: number; description: string };
  totalWriteOff: { amount: number; description: string };
  cfoStatement: string;
  action: string;
  ndaReleased: string;
}

export interface USDInvestmentTracking {
  period: string;
  amount: number;
  notes: string;
  isWarning?: boolean;
}

export interface FiatExpenseData {
  title: string;
  note: string;
  oldFormat: FiatExpenseItem[];
  oldFormatSubtotal: { [reportKey: string]: number | null };
  newFormat: FiatExpenseItem[];
  newFormatSubtotal: { [reportKey: string]: number | null };
  cumulativeTotal: { [reportKey: string]: number | null };
  cryptoLosses: CryptoLoss[];
  totalCryptoLosses: number;
  arringtonCollapse: ArringtonDetails;
  usdInvestmentsTracking: USDInvestmentTracking[];
  changeR17R18: number;
}

export const fiatReportColumns = ['R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8', 'R9', 'R10', 'R11', 'R12', 'R13', 'R14', 'R15', 'R16', 'R17', 'R18'];

export const fiatExpenseData: FiatExpenseData = {
  title: "FIAT/USD EXPENSE TRACKING",
  note: "Fiat expenses first disclosed in R4. R1-R3 had NO fiat disclosure. R8 changed format.",

  oldFormat: [
    {
      name: "Grants & Awards",
      values: { R1: "N/R", R2: "N/R", R3: "N/R", R4: 2500000, R5: 5900000, R6: 17400000, R7: 30900000, R8: null, R9: null, R10: null, R11: null, R12: null, R13: null, R14: null, R15: null, R16: null, R17: null, R18: null },
      total: 56700000
    },
    {
      name: "Marketing & Promotion",
      values: { R1: "N/R", R2: "N/R", R3: "N/R", R4: 400000, R5: 600000, R6: 9200000, R7: 22200000, R8: null, R9: null, R10: null, R11: null, R12: null, R13: null, R14: null, R15: null, R16: null, R17: null, R18: null },
      total: 32400000
    },
    {
      name: "Operations & Staff",
      values: { R1: "N/R", R2: "N/R", R3: "N/R", R4: 14300000, R5: 20800000, R6: 27900000, R7: 17900000, R8: null, R9: null, R10: null, R11: null, R12: null, R13: null, R14: null, R15: null, R16: null, R17: null, R18: null },
      total: 80900000
    }
  ],

  oldFormatSubtotal: {
    R1: null, R2: null, R3: null, R4: 17200000, R5: 27300000, R6: 54500000, R7: 71000000, R8: null, R9: null, R10: null, R11: null, R12: null, R13: null, R14: null, R15: null, R16: null, R17: null, R18: null
  },

  newFormat: [
    {
      name: "Investments & Income",
      values: { R1: null, R2: null, R3: null, R4: null, R5: null, R6: null, R7: null, R8: 600000, R9: 600000, R10: 300000, R11: 100000, R12: 60000, R13: 1000, R14: 4000, R15: 75000, R16: -105000, R17: 42000, R18: -11000 },
      total: 1666000,
      notes: "Infra +$94K, write-downs -$105K"
    },
    {
      name: "Grants/Bursaries/Bounties",
      values: { R1: null, R2: null, R3: null, R4: null, R5: null, R6: null, R7: null, R8: 7700000, R9: 800000, R10: 50000, R11: 60000, R12: 250000, R13: 250000, R14: 27000, R15: 40000, R16: 20000, R17: 23000, R18: 100000 },
      total: 9320000,
      notes: "Alpha $50K, Carret $50K"
    },
    {
      name: "Loans (USD)",
      values: { R1: null, R2: null, R3: null, R4: null, R5: null, R6: null, R7: null, R8: 0, R9: 0, R10: 0, R11: 0, R12: 0, R13: 130000, R14: 297000, R15: 0, R16: 745000, R17: 325000, R18: 0 },
      total: 1497000,
      notes: "No new USD loans R18"
    },
    {
      name: "Business Dev & Access",
      values: { R1: null, R2: null, R3: null, R4: null, R5: null, R6: null, R7: null, R8: 900000, R9: 800000, R10: 700000, R11: 720000, R12: 420000, R13: 410000, R14: 721000, R15: 850000, R16: 1200000, R17: 867000, R18: 900000 },
      total: 8488000
    },
    {
      name: "Ecosystem Support",
      values: { R1: null, R2: null, R3: null, R4: null, R5: null, R6: null, R7: null, R8: 1900000, R9: 700000, R10: 700000, R11: 220000, R12: 280000, R13: 350000, R14: 1753000, R15: 1650000, R16: 755000, R17: 856000, R18: 800000 },
      total: 9964000
    },
    {
      name: "Communities",
      values: { R1: null, R2: null, R3: null, R4: null, R5: null, R6: null, R7: null, R8: 500000, R9: 600000, R10: 500000, R11: 830000, R12: 470000, R13: 260000, R14: 338000, R15: 420000, R16: 282000, R17: 249000, R18: 300000 },
      total: 4749000
    },
    {
      name: "Marketing/Events/Partners",
      values: { R1: null, R2: null, R3: null, R4: null, R5: null, R6: null, R7: null, R8: 1500000, R9: 1900000, R10: 1800000, R11: 3350000, R12: 2060000, R13: 5200000, R14: 2750000, R15: 3100000, R16: 2435000, R17: 3092000, R18: 3500000 },
      total: 30687000,
      notes: "Token2049 Singapore, AlgoCan[nes]"
    },
    {
      name: "R&D/Education/Platform",
      values: { R1: null, R2: null, R3: null, R4: null, R5: null, R6: null, R7: null, R8: 600000, R9: 5200000, R10: 3100000, R11: 2750000, R12: 1880000, R13: 500000, R14: 2904000, R15: 2200000, R16: 3346000, R17: 2693000, R18: 2400000 },
      total: 27573000,
      notes: "Intermezzo, TypeScript 1.0"
    },
    {
      name: "Core Foundation Ops",
      values: { R1: null, R2: null, R3: null, R4: null, R5: null, R6: null, R7: null, R8: 700000, R9: 3400000, R10: 3300000, R11: 3190000, R12: 3170000, R13: 5400000, R14: 2408000, R15: 2465000, R16: 2751000, R17: 2686000, R18: 2500000 },
      total: 31970000
    }
  ],

  newFormatSubtotal: {
    R1: null, R2: null, R3: null, R4: null, R5: null, R6: null, R7: null, R8: 14700000, R9: 14100000, R10: 10900000, R11: 11700000, R12: 8600000, R13: 12500000, R14: 11200000, R15: 10800000, R16: 11429000, R17: 10749000, R18: 10489000
  },

  cumulativeTotal: {
    R1: null, R2: null, R3: null, R4: 17200000, R5: 44500000, R6: 99000000, R7: 170000000, R8: 184700000, R9: 198800000, R10: 209700000, R11: 221400000, R12: 230000000, R13: 242500000, R14: 253700000, R15: 264500000, R16: 275929000, R17: 286678000, R18: 297167000
  },

  cryptoLosses: [
    { name: "Hodlnaut Exposure", amount: 35000000, description: "Under judicial management in Singapore" },
    { name: "3AC Contractual Claim", amount: 50000000, description: "Breach of OTC locking agreement Q4 2021" },
    { name: "FTX Exposure", amount: 1000000, description: "Disclosed post-period" }
  ],
  totalCryptoLosses: 86000000,

  arringtonCollapse: {
    originalInvestment: { amount: 63500000, description: "50M ALGO @ $1.27/ALGO" },
    returnedToFoundation: { amount: 2759000, description: "2.737M ALGO + $22K USD" },
    illiquidSAFEs: { amount: 744000, description: "To be distributed later" },
    totalWriteOff: { amount: 62756000, description: "REMOVED from USD Investments" },
    cfoStatement: "Deeply disappointing... fund did not make meaningful investments in our ecosystem",
    action: "Will dramatically reduce or eliminate reliance on third-party investment funds",
    ndaReleased: "We encourage community members to reach out to Arrington Capital directly"
  },

  usdInvestmentsTracking: [
    { period: "R8 Start (Mar 2023)", amount: 35400000, notes: "First disclosure" },
    { period: "R8 End / R9 Start", amount: 118900000, notes: "Increased significantly" },
    { period: "R9 End (Jun 2023)", amount: 97900000, notes: "Decreased $21M" },
    { period: "R10 End (Sep 2023)", amount: 99200000, notes: "Up slightly" },
    { period: "R11 End (Dec 2023)", amount: 37300000, notes: "DOWN $62M - ARRINGTON WRITE-OFF", isWarning: true },
    { period: "R12 End (Mar 2024)", amount: 37600000, notes: "Stable" },
    { period: "R13 End (Jun 2024)", amount: 37800000, notes: "Stable" },
    { period: "R14 End (Sep 2024)", amount: 38100000, notes: "Stable (+$300K)" },
    { period: "R15 End (Dec 2024)", amount: 38200000, notes: "Stable (+$75K)" },
    { period: "R16 End (Mar 2025)", amount: 38300000, notes: "Stable (+$85K)" },
    { period: "R17 End (Jun 2025)", amount: 38250000, notes: "Down $27K (Arrington +$17K, Tikitin -$10K)" },
    { period: "R18 End (Sep 2025)", amount: 38239000, notes: "Down $11K (Alpha $50K, Carret $50K, Infra +$94K, Write-downs -$105K)" }
  ],

  changeR17R18: -11000
};

// Helper to format USD
export const formatUSD = (value: number): string => {
  if (value < 0) {
    return `-$${Math.abs(value).toLocaleString()}`;
  }
  return `$${value.toLocaleString()}`;
};
