// Algorand Technologies Inc Holdings Tracking Data
// Based on reported transparency reports R1-R7

export interface TechMetricData {
  name: string;
  values: { [reportKey: string]: number | string | null };
  changeR6R7?: number | string | null;
  notes?: string;
}

export interface TechBalanceSheetData {
  title: string;
  description: string;
  note: string;
  holdings: TechMetricData[];
  incentivesDevelopment: TechMetricData[];
  financialEcosystem: TechMetricData[];
  sales: TechMetricData[];
  networkMetrics: TechMetricData[];
}

// Report columns for Technologies data
export const techReportColumns = ['R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7'];

export const techBalanceSheetData: TechBalanceSheetData = {
  title: "ALGORAND INC HOLDINGS TRACKING",
  description: "Tracking Algorand Technologies Inc reported holdings, incentives, and ecosystem metrics",
  note: "R1 (Nov 19), R2 (Jan 20), R3 (Apr 20), R4 (Jul 20), R5 (Oct 20), R6 (Apr 21), R7 (Jun 22). No reports since R7.",

  holdings: [
    {
      name: "Total ALGO Owned",
      values: { R1: 2027000000, R2: 2016000000, R3: 2024000000, R4: 2019000000, R5: 2009000000, R6: 2047000000, R7: 1691000000 },
      changeR6R7: -356000000,
      notes: "Peak R6"
    },
    {
      name: "In Public Wallets",
      values: { R1: 1866000000, R2: 1792000000, R3: 1745000000, R4: 1728000000, R5: 1716000000, R6: 1765000000, R7: null },
      changeR6R7: "N/A",
      notes: "Not reported R7"
    },
    {
      name: "Legal Ownership (not custody)",
      values: { R1: 161000000, R2: 224000000, R3: 279000000, R4: 291000000, R5: 293000000, R6: 282000000, R7: null },
      changeR6R7: "N/A",
      notes: "Not reported R7"
    }
  ],

  incentivesDevelopment: [
    {
      name: "Venture Funds (NEW in R7)",
      values: { R1: null, R2: null, R3: null, R4: null, R5: null, R6: null, R7: 1150000000 },
      changeR6R7: "NEW",
      notes: "New category R7 - moved from Venture"
    },
    {
      name: "Algo Capital / Borderless Capital",
      values: { R1: 100000000, R2: 100000000, R3: 103000000, R4: 113000000, R5: 115000000, R6: 159100000, R7: null },
      changeR6R7: "→ Venture",
      notes: "Moved to Venture Funds in R7"
    },
    {
      name: "Equity / Other Investments",
      values: { R1: 8400000, R2: 52000000, R3: 56000000, R4: 65000000, R5: 69000000, R6: 70800000, R7: 131000000 },
      changeR6R7: -159100000,
      notes: "Increased significantly R7"
    },
    {
      name: "Market Development",
      values: { R1: 2200000, R2: 2200000, R3: 4000000, R4: 5000000, R5: 6000000, R6: 6000000, R7: 213000000 },
      changeR6R7: 60200000,
      notes: "Major increase R7"
    },
    {
      name: "Application Development",
      values: { R1: 570000, R2: 570000, R3: 1000000, R4: 1000000, R5: 2000000, R6: 4600000, R7: 15000000 },
      changeR6R7: 207000000,
      notes: "Grew steadily"
    }
  ],

  financialEcosystem: [
    {
      name: "Lending",
      values: { R1: 52500000, R2: 116000000, R3: 165600000, R4: 165600000, R5: 165600000, R6: 159100000, R7: 50000000 },
      changeR6R7: -109100000,
      notes: "Decreased R7"
    },
    {
      name: "Market Making",
      values: { R1: 18500000, R2: 18700000, R3: 18700000, R4: 18700000, R5: 18700000, R6: 41300000, R7: 75000000 },
      changeR6R7: 33700000,
      notes: "Increased R7"
    },
    {
      name: "Miscellaneous",
      values: { R1: 80000, R2: 80000, R3: 80000, R4: 80000, R5: 80000, R6: 84000, R7: 77000 },
      changeR6R7: -7000,
      notes: "Stable"
    }
  ],

  sales: [
    {
      name: "Secondary Market Sales (Period)",
      values: { R1: 0, R2: 0, R3: 21000000, R4: 19600000, R5: 26000000, R6: 72000000, R7: 150000000 },
      changeR6R7: 78000000,
      notes: "Increasing sales"
    },
    {
      name: "Secondary Market Sales (Cumulative)",
      values: { R1: 0, R2: 0, R3: 21000000, R4: 40600000, R5: 66600000, R6: 138600000, R7: 288600000 },
      changeR6R7: 150000000,
      notes: "Total sold to date"
    },
    {
      name: "% of Exchange Volume",
      values: { R1: null, R2: null, R3: "0.55%", R4: "0.32%", R5: "0.24%", R6: "0.21%", R7: "0.18%" },
      changeR6R7: null,
      notes: "Decreasing %"
    }
  ],

  networkMetrics: [
    {
      name: "Exchanges",
      values: { R1: 27, R2: 29, R3: 37, R4: 47, R5: 58, R6: 50, R7: 50 },
      changeR6R7: 0,
      notes: "Stable"
    },
    {
      name: "Trading Pairs",
      values: { R1: 60, R2: 63, R3: 80, R4: 100, R5: 120, R6: 100, R7: 100 },
      changeR6R7: 0,
      notes: "Stable"
    }
  ]
};

// Helper functions
export const getTechSubtotalIncentives = (reportKey: string): number => {
  let total = 0;
  techBalanceSheetData.incentivesDevelopment.forEach(item => {
    const val = item.values[reportKey];
    if (typeof val === 'number') total += val;
  });
  return total;
};

export const getTechSubtotalFinancial = (reportKey: string): number => {
  let total = 0;
  techBalanceSheetData.financialEcosystem.forEach(item => {
    const val = item.values[reportKey];
    if (typeof val === 'number') total += val;
  });
  return total;
};

export const getTechTotalDeployed = (reportKey: string): number => {
  return getTechSubtotalIncentives(reportKey) + getTechSubtotalFinancial(reportKey);
};
