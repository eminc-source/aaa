// All Reported Outflows by Report Data
// Comprehensive tracking of all ALGO outflows and inflows by report

export interface OutflowItem {
  name: string;
  values: { [reportKey: string]: number | string | null };
  total: number | string;
  isNew?: boolean;
  isCompleted?: boolean;
}

export interface OutflowCategory {
  name: string;
  items: OutflowItem[];
}

export interface OutflowsData {
  title: string;
  categories: OutflowCategory[];
  reportedTotals: { [reportKey: string]: number };
  grandTotal: number;
}

// Report columns R1-R18
export const outflowReportColumns = ['R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8', 'R9', 'R10', 'R11', 'R12', 'R13', 'R14', 'R15', 'R16', 'R17', 'R18'];

export const outflowsData: OutflowsData = {
  title: "ALL REPORTED OUTFLOWS BY REPORT",
  
  categories: [
    {
      name: "PARTICIPATION/GOVERNANCE",
      items: [
        {
          name: "Participation Rewards",
          values: { R1: 96000000, R2: 101000000, R3: 124700000, R4: 135490000, R5: 154900000, R6: 84670000, R7: 500000, R8: 0, R9: 0, R10: 0, R11: 0, R12: 0, R13: 0, R14: 0, R15: 0, R16: 0, R17: 0, R18: 0 },
          total: 697260000
        },
        {
          name: "Governance Rewards",
          values: { R1: 0, R2: 0, R3: 0, R4: 0, R5: 0, R6: 60000000, R7: 141000000, R8: 141000000, R9: 68200000, R10: 54100000, R11: 40900000, R12: 31200000, R13: 21300000, R14: 21300000, R15: 17000000, R16: 17242000, R17: 20028000, R18: 0 },
          total: 633270000
        },
        {
          name: "DeFi/xGov/NFT Rewards",
          values: { R1: 0, R2: 0, R3: 0, R4: 0, R5: 0, R6: 0, R7: 4000000, R8: 200000, R9: 3800000, R10: 8000000, R11: 8000000, R12: 9700000, R13: 6200000, R14: 9300000, R15: 8100000, R16: 0, R17: 60000, R18: 149000 },
          total: 57509000
        },
        {
          name: "Staking Rewards",
          values: { R1: 0, R2: 0, R3: 0, R4: 0, R5: 0, R6: 0, R7: 0, R8: 0, R9: 0, R10: 0, R11: 0, R12: 0, R13: 0, R14: 0, R15: 0, R16: 10535000, R17: 18776000, R18: 19980000 },
          total: 49291000,
          isNew: true
        }
      ]
    },
    {
      name: "EARLY BACKER / NODE VESTING",
      items: [
        {
          name: "EB/RN All Vesting",
          values: { R1: 330000000, R2: 7400000, R3: 191400000, R4: 1067680000, R5: 1067550000, R6: 314010000, R7: 14000000, R8: 0, R9: 0, R10: 0, R11: 0, R12: 0, R13: 0, R14: 0, R15: 0, R16: 0, R17: 0, R18: 0 },
          total: 2992040000
        }
      ]
    },
    {
      name: "STAKING / DEFI",
      items: [
        {
          name: "200M Staking Program",
          values: { R1: 0, R2: 0, R3: 100000000, R4: 50000000, R5: 55300000, R6: 0, R7: 0, R8: 0, R9: 0, R10: 0, R11: 0, R12: 0, R13: 0, R14: 0, R15: 0, R16: 0, R17: 0, R18: 0 },
          total: 205300000
        },
        {
          name: "DeFi/Contingent Loans",
          values: { R1: 0, R2: 0, R3: 0, R4: 0, R5: 0, R6: 50000000, R7: 120000000, R8: 0, R9: 0, R10: 0, R11: 0, R12: 0, R13: 0, R14: 0, R15: 0, R16: 0, R17: 0, R18: 0 },
          total: 170000000
        },
        {
          name: "DeFi Protocol Deployments",
          values: { R1: 0, R2: 0, R3: 0, R4: 0, R5: 0, R6: 0, R7: 0, R8: 0, R9: 42000000, R10: 0, R11: 0, R12: 0, R13: 0, R14: 0, R15: 0, R16: 0, R17: 0, R18: 25000000 },
          total: 67000000
        }
      ]
    },
    {
      name: "ALGORAND INC",
      items: [
        {
          name: "Algorand Inc Payments",
          values: { R1: 0, R2: 0, R3: 50200000, R4: 330000000, R5: 0, R6: 0, R7: 0, R8: 0, R9: 0, R10: 0, R11: 0, R12: 0, R13: 0, R14: 0, R15: 0, R16: 0, R17: 0, R18: 0 },
          total: 380200000
        }
      ]
    },
    {
      name: "ECOSYSTEM / GRANTS / INVESTMENTS",
      items: [
        {
          name: "Grants / Awards (ALGO)",
          values: { R1: 0, R2: 0, R3: 7800000, R4: 16680000, R5: 7500000, R6: 6900000, R7: 18000000, R8: 0, R9: 1900000, R10: 5500000, R11: 3800000, R12: 250000, R13: 220000, R14: 292000, R15: 346000, R16: 80000, R17: 191000, R18: 0 },
          total: 69459000
        },
        {
          name: "Innovation Fund",
          values: { R1: 0, R2: 0, R3: 0, R4: 0, R5: 0, R6: 60000000, R7: 0, R8: 0, R9: 0, R10: 0, R11: 0, R12: 0, R13: 0, R14: 0, R15: 0, R16: 0, R17: 0, R18: 0 },
          total: 60000000
        },
        {
          name: "VC Fund Investments",
          values: { R1: 0, R2: 0, R3: 0, R4: 0, R5: 0, R6: 0, R7: 0, R8: 37500000, R9: 0, R10: 0, R11: 0, R12: 0, R13: 0, R14: 0, R15: 0, R16: 0, R17: 0, R18: 0 },
          total: 37500000
        },
        {
          name: "Direct Investments",
          values: { R1: 0, R2: 0, R3: 0, R4: 0, R5: 0, R6: 0, R7: 0, R8: 13000000, R9: 33100000, R10: 9900000, R11: 4600000, R12: 2500000, R13: 0, R14: 15037000, R15: 0, R16: 202000, R17: 3764000, R18: 0 },
          total: 82103000
        },
        {
          name: "Ambassadors / Community",
          values: { R1: 0, R2: 312000, R3: 5400000, R4: 1170000, R5: 0, R6: 0, R7: 0, R8: 0, R9: 0, R10: 0, R11: 0, R12: 0, R13: 0, R14: 0, R15: 0, R16: 0, R17: 0, R18: 0 },
          total: 6882000
        }
      ]
    },
    {
      name: "SALES / DISTRIBUTION",
      items: [
        {
          name: "Auction (Net)",
          values: { R1: 5100000, R2: 0, R3: 0, R4: 0, R5: 0, R6: 0, R7: 0, R8: 0, R9: 0, R10: 0, R11: 0, R12: 0, R13: 0, R14: 0, R15: 0, R16: 0, R17: 0, R18: 0 },
          total: 5100000
        },
        {
          name: "Structured Selling",
          values: { R1: 0, R2: 17000000, R3: 69400000, R4: 45300000, R5: 47000000, R6: 42200000, R7: 16500000, R8: 101000000, R9: 31000000, R10: 0, R11: 0, R12: 31000000, R13: 58000000, R14: 21000000, R15: 110000000, R16: 174000000, R17: 63000000, R18: 78000000 },
          total: 904400000
        },
        {
          name: "OTC Sales (DWF Labs)",
          values: { R1: 0, R2: 0, R3: 0, R4: 0, R5: 76450000, R6: 0, R7: 0, R8: 0, R9: 132200000, R10: 341500000, R11: 0, R12: 0, R13: 0, R14: 0, R15: 0, R16: 0, R17: 0, R18: 0 },
          total: 550150000
        }
      ]
    },
    {
      name: "OTHER",
      items: [
        {
          name: "Board & Advisor Compensation",
          values: { R1: 75000, R2: 125000, R3: 200000, R4: 395000, R5: 960000, R6: 1227000, R7: 1072000, R8: 0, R9: 0, R10: 0, R11: 0, R12: 0, R13: 0, R14: 0, R15: 0, R16: 0, R17: 0, R18: 0 },
          total: 4054000
        },
        {
          name: "Token Burns",
          values: { R1: 20500000, R2: 0, R3: 0, R4: 0, R5: 0, R6: 0, R7: 0, R8: 0, R9: 0, R10: 0, R11: 0, R12: 0, R13: 0, R14: 0, R15: 0, R16: 0, R17: 0, R18: 0 },
          total: 20500000
        },
        {
          name: "University Program",
          values: { R1: 0, R2: 0, R3: 0, R4: 0, R5: 38000000, R6: 38000000, R7: 27300000, R8: 0, R9: 0, R10: 0, R11: 0, R12: 0, R13: 0, R14: 0, R15: 0, R16: 0, R17: 0, R18: 0 },
          total: 103300000
        },
        {
          name: "Relay Node Programs",
          values: { R1: 0, R2: 0, R3: 0, R4: 0, R5: 0, R6: 0, R7: 2300000, R8: 0, R9: 0, R10: 0, R11: 0, R12: 0, R13: 0, R14: 0, R15: 0, R16: 0, R17: 0, R18: 0 },
          total: 2300000
        },
        {
          name: "ETP Liquidity",
          values: { R1: 0, R2: 0, R3: 0, R4: 0, R5: 0, R6: 0, R7: 15000000, R8: 0, R9: 0, R10: 0, R11: 0, R12: 0, R13: 0, R14: 0, R15: 0, R16: 0, R17: 0, R18: 0 },
          total: 15000000
        },
        {
          name: "Foundation Operations",
          values: { R1: 0, R2: 0, R3: 0, R4: 0, R5: 0, R6: 0, R7: 0, R8: 0, R9: 10400000, R10: 17400000, R11: 9500000, R12: 6600000, R13: 13200000, R14: 20800000, R15: 0, R16: 8950000, R17: 5752000, R18: 6000000 },
          total: 98602000
        }
      ]
    },
    {
      name: "NEW LOANS",
      items: [
        {
          name: "Napster Foundation Loan",
          values: { R1: 0, R2: 0, R3: 0, R4: 0, R5: 0, R6: 0, R7: 0, R8: 0, R9: 574000, R10: 0, R11: 0, R12: 0, R13: 0, R14: 0, R15: 0, R16: 0, R17: 0, R18: 0 },
          total: 574000
        },
        {
          name: "Pera/ANote/PlanetWatch Loans",
          values: { R1: 0, R2: 0, R3: 0, R4: 0, R5: 0, R6: 0, R7: 0, R8: 0, R9: 0, R10: 2000000, R11: 0, R12: 0, R13: 0, R14: 0, R15: 0, R16: 0, R17: 0, R18: 0 },
          total: 2000000
        },
        {
          name: "DWF Labs Loan",
          values: { R1: 0, R2: 0, R3: 0, R4: 0, R5: 0, R6: 0, R7: 0, R8: 0, R9: 0, R10: 0, R11: 75000000, R12: 0, R13: 0, R14: 0, R15: 0, R16: 0, R17: 0, R18: 0 },
          total: 75000000
        },
        {
          name: "Pera Wallet Loan 2 (ALGO)",
          values: { R1: 0, R2: 0, R3: 0, R4: 0, R5: 0, R6: 0, R7: 0, R8: 0, R9: 0, R10: 0, R11: 0, R12: 0, R13: 1262000, R14: 1097000, R15: 0, R16: 0, R17: 0, R18: 0 },
          total: 2359000
        },
        {
          name: "Pera Wallet Loan 3 (USD)",
          values: { R1: 0, R2: 0, R3: 0, R4: 0, R5: 0, R6: 0, R7: 0, R8: 0, R9: 0, R10: 0, R11: 0, R12: 0, R13: 0, R14: "297K USD", R15: 0, R16: "245K USD", R17: "325K USD", R18: 0 },
          total: "867K USD"
        },
        {
          name: "Lofty Loan (USDC)",
          values: { R1: 0, R2: 0, R3: 0, R4: 0, R5: 0, R6: 0, R7: 0, R8: 0, R9: 0, R10: 0, R11: 0, R12: 0, R13: 0, R14: 0, R15: 0, R16: "500K USDC", R17: 0, R18: 0 },
          total: "500K USDC"
        },
        {
          name: "XBTO Market Maker Loan",
          values: { R1: 0, R2: 0, R3: 0, R4: 0, R5: 0, R6: 0, R7: 0, R8: 0, R9: 0, R10: 0, R11: 0, R12: 0, R13: 0, R14: 0, R15: 0, R16: 0, R17: 0, R18: 25000000 },
          total: 25000000
        },
        {
          name: "Folks Finance Liquidity",
          values: { R1: 0, R2: 0, R3: 0, R4: 0, R5: 0, R6: 0, R7: 0, R8: 0, R9: 0, R10: 0, R11: 0, R12: 0, R13: 0, R14: 0, R15: 0, R16: 0, R17: 0, R18: 25000000 },
          total: 25000000
        }
      ]
    },
    {
      name: "LOAN REPAYMENTS",
      items: [
        {
          name: "Algorand Inc Loan Repayment",
          values: { R1: 0, R2: 0, R3: 0, R4: 0, R5: 0, R6: 0, R7: 0, R8: -125000000, R9: 0, R10: 0, R11: 0, R12: 0, R13: 0, R14: 0, R15: 0, R16: 0, R17: 0, R18: 0 },
          total: -125000000
        },
        {
          name: "Astronaut Loan Repayment",
          values: { R1: 0, R2: 0, R3: 0, R4: 0, R5: 0, R6: 0, R7: 0, R8: -11500000, R9: -32900000, R10: 0, R11: 0, R12: 0, R13: 0, R14: 0, R15: 0, R16: 0, R17: 0, R18: 0 },
          total: -44400000
        },
        {
          name: "PlanetWatch Loan Repayment",
          values: { R1: 0, R2: 0, R3: 0, R4: 0, R5: 0, R6: 0, R7: 0, R8: 0, R9: 0, R10: 0, R11: 0, R12: -500000, R13: 0, R14: 0, R15: 0, R16: 0, R17: 0, R18: 0 },
          total: -500000
        },
        {
          name: "DWF Labs Loan Repaid",
          values: { R1: 0, R2: 0, R3: 0, R4: 0, R5: 0, R6: 0, R7: 0, R8: 0, R9: 0, R10: 0, R11: 0, R12: 0, R13: 0, R14: 0, R15: -75000000, R16: 0, R17: 0, R18: 0 },
          total: -75000000
        },
        {
          name: "Napster Loan Repaid (USDC)",
          values: { R1: 0, R2: 0, R3: 0, R4: 0, R5: 0, R6: 0, R7: 0, R8: 0, R9: 0, R10: 0, R11: 0, R12: 0, R13: 0, R14: 0, R15: 0, R16: -574000, R17: 0, R18: 0 },
          total: -574000
        }
      ]
    },
    {
      name: "OTHER INFLOWS",
      items: [
        {
          name: "ETP Unwind",
          values: { R1: 0, R2: 0, R3: 0, R4: 0, R5: 0, R6: 0, R7: 0, R8: 0, R9: -50000000, R10: 0, R11: 0, R12: 0, R13: 0, R14: 0, R15: 0, R16: 0, R17: 0, R18: 0 },
          total: -50000000
        },
        {
          name: "Arrington Fund Return",
          values: { R1: 0, R2: 0, R3: 0, R4: 0, R5: 0, R6: 0, R7: 0, R8: 0, R9: 0, R10: 0, R11: -2737000, R12: 0, R13: 0, R14: 0, R15: 0, R16: 0, R17: 0, R18: 0 },
          total: -2737000
        },
        {
          name: "CoinShares ETP Return",
          values: { R1: 0, R2: 0, R3: 0, R4: 0, R5: 0, R6: 0, R7: 0, R8: 0, R9: 0, R10: 0, R11: 0, R12: 0, R13: 0, R14: 0, R15: -15000000, R16: 0, R17: 0, R18: 0 },
          total: -15000000
        },
        {
          name: "AlgoGems NFT Return",
          values: { R1: 0, R2: 0, R3: 0, R4: 0, R5: 0, R6: 0, R7: 0, R8: 0, R9: 0, R10: 0, R11: 0, R12: 0, R13: 0, R14: 0, R15: -109000, R16: 0, R17: 0, R18: 0 },
          total: -109000
        },
        {
          name: "C3 DeFi Return",
          values: { R1: 0, R2: 0, R3: 0, R4: 0, R5: 0, R6: 0, R7: 0, R8: 0, R9: 0, R10: 0, R11: 0, R12: 0, R13: 0, R14: 0, R15: 0, R16: -363000, R17: 0, R18: 0 },
          total: -363000
        },
        {
          name: "Ecosystem/xGov Return",
          values: { R1: 0, R2: 0, R3: 0, R4: 0, R5: 0, R6: 0, R7: 0, R8: 0, R9: 0, R10: 0, R11: 0, R12: 0, R13: 0, R14: 0, R15: 0, R16: -269000, R17: 0, R18: 0 },
          total: -269000
        }
      ]
    }
  ],

  reportedTotals: {
    R1: 440000000,
    R2: 126000000,
    R3: 549100000,
    R4: 1640000000,
    R5: 1410000000,
    R6: 502000000,
    R7: 335000000,
    R8: 156200000,
    R9: 249000000,
    R10: 434000000,
    R11: 136000000,
    R12: 81000000,
    R13: 101000000,
    R14: 87000000,
    R15: 57000000,
    R16: 211000000,
    R17: 105000000,
    R18: 154000000
  },

  grandTotal: 6773300000
};

// Helper function to get category total for a specific report
export const getCategoryTotal = (category: OutflowCategory, report: string): number => {
  return category.items.reduce((sum, item) => {
    const value = item.values[report];
    return sum + (typeof value === 'number' ? value : 0);
  }, 0);
};

// Helper function to get all data for charting
export const getOutflowChartData = (itemName: string): { report: string; value: number }[] => {
  for (const category of outflowsData.categories) {
    const item = category.items.find(i => i.name === itemName);
    if (item) {
      return outflowReportColumns
        .filter(report => typeof item.values[report] === 'number' && item.values[report] !== 0)
        .map(report => ({
          report,
          value: item.values[report] as number
        }));
    }
  }
  return [];
};

// Get totals time series for charting
export const getReportedTotalsTimeSeries = (): { report: string; value: number }[] => {
  return outflowReportColumns.map(report => ({
    report,
    value: outflowsData.reportedTotals[report]
  }));
};
