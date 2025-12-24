// Balance Sheet Pool Reconciliation Data
// Tracking reported pool balances vs distributions to find discrepancies

export interface PoolData {
  name: string;
  values: { [reportKey: string]: number | string | null };
  change?: number | null;
  notes: string;
}

export interface TransitionCheck {
  name: string;
  fromReport: string;
  toReport: string;
  fromValue: number | null;
  toValue: number | null;
  difference: number | null;
  notes: string;
  status: 'match' | 'discrepancy' | 'info';
}

export interface BalanceSheetReconciliation {
  title: string;
  description: string;
  note: string;
  oldStructure: PoolData[];
  newStructure: PoolData[];
  singleFormat: PoolData[];
  transitionChecks: TransitionCheck[];
}

// Report columns for the data
export const reportColumns = ['R4', 'R5', 'R6', 'R7', 'R8', 'R9', 'R10', 'R11', 'R12', 'R13', 'R14', 'R15', 'R16', 'R17', 'R18'];
export const changeColumn = 'R17→R18 Chg';

export const balanceSheetData: BalanceSheetReconciliation = {
  title: "BALANCE SHEET POOL RECONCILIATION",
  description: "Tracking reported pool balances vs distributions to find discrepancies",
  note: "Balance sheet first appeared in R4. R1-R3 had NO balance sheet. R6+ consolidated into 3 pools. R8 new format.",
  
  oldStructure: [
    {
      name: "Participation/Governance Rewards",
      values: { R4: 2042410000, R5: 1887940000, R6: null, R7: null, R8: null, R9: null, R10: null, R11: null, R12: null, R13: null, R14: null, R15: null, R16: null, R17: null, R18: null },
      notes: "Merged R6+"
    },
    {
      name: "Early Backers/Relay Nodes",
      values: { R4: 1434360000, R5: 328000000, R6: null, R7: null, R8: null, R9: null, R10: null, R11: null, R12: null, R13: null, R14: null, R15: null, R16: null, R17: null, R18: null },
      notes: "Completed"
    },
    {
      name: "200M Staking Contingent",
      values: { R4: 55340000, R5: 0, R6: null, R7: null, R8: null, R9: null, R10: null, R11: null, R12: null, R13: null, R14: null, R15: null, R16: null, R17: null, R18: null },
      notes: "Completed"
    },
    {
      name: "Contingent Incentives",
      values: { R4: 495350000, R5: 495350000, R6: null, R7: null, R8: null, R9: null, R10: null, R11: null, R12: null, R13: null, R14: null, R15: null, R16: null, R17: null, R18: null },
      notes: "Merged R6+"
    },
    {
      name: "Innovation Fund",
      values: { R4: 400000000, R5: 400000000, R6: null, R7: null, R8: null, R9: null, R10: null, R11: null, R12: null, R13: null, R14: null, R15: null, R16: null, R17: null, R18: null },
      notes: "Merged R6+"
    },
    {
      name: "Foundation Grant Program",
      values: { R4: 219500000, R5: 212000000, R6: null, R7: null, R8: null, R9: null, R10: null, R11: null, R12: null, R13: null, R14: null, R15: null, R16: null, R17: null, R18: null },
      notes: "Merged R6+"
    },
    {
      name: "Research and Social Good",
      values: { R4: 200000000, R5: 200000000, R6: null, R7: null, R8: null, R9: null, R10: null, R11: null, R12: null, R13: null, R14: null, R15: null, R16: null, R17: null, R18: null },
      notes: "NEVER USED"
    },
    {
      name: "Foundation Endowment (old)",
      values: { R4: 500000000, R5: 406000000, R6: null, R7: null, R8: null, R9: null, R10: null, R11: null, R12: null, R13: null, R14: null, R15: null, R16: null, R17: null, R18: null },
      notes: "Continued"
    }
  ],

  newStructure: [
    {
      name: "Community & Governance Rewards",
      values: { R4: null, R5: null, R6: 1757260000, R7: 1628160000, R8: null, R9: null, R10: null, R11: null, R12: null, R13: null, R14: null, R15: null, R16: null, R17: null, R18: null },
      notes: "Merged R8+"
    },
    {
      name: "Ecosystem Support",
      values: { R4: null, R5: null, R6: 1176050000, R7: 989620000, R8: null, R9: null, R10: null, R11: null, R12: null, R13: null, R14: null, R15: null, R16: null, R17: null, R18: null },
      notes: "Merged R8+"
    },
    {
      name: "Foundation Endowment",
      values: { R4: null, R5: null, R6: 363000000, R7: 375380000, R8: null, R9: null, R10: null, R11: null, R12: null, R13: null, R14: null, R15: null, R16: null, R17: null, R18: null },
      notes: "Merged R8+"
    }
  ],

  singleFormat: [
    {
      name: "Total Foundation Holdings (ALGO)",
      values: { 
        R4: null, 
        R5: null, 
        R6: null, 
        R7: null, 
        R8: 2791000000, 
        R9: 2542000000, 
        R10: 2109000000, 
        R11: 1972000000, 
        R12: 1891000000, 
        R13: 1789000000, 
        R14: 1702000000, 
        R15: 1645000000, 
        R16: 1434000000, 
        R17: 1329000000, 
        R18: 1175000000 
      },
      change: -154000000,
      notes: "Quarterly format"
    }
  ],

  transitionChecks: [
    {
      name: "R5→R6 Transition Check",
      fromReport: "R5",
      toReport: "R6",
      fromValue: 3929290000,
      toValue: 3296310000,
      difference: -632980000,
      notes: "633M less - where did it go?",
      status: "discrepancy"
    },
    {
      name: "R7→R8 Transition Check",
      fromReport: "R7",
      toReport: "R8",
      fromValue: 2993160000,
      toValue: 2791000000,
      difference: -202160000,
      notes: "Matches reported change",
      status: "match"
    },
    {
      name: "R17→R18 Transition Check",
      fromReport: "R17",
      toReport: "R18",
      fromValue: 1329000000,
      toValue: 1175000000,
      difference: -154000000,
      notes: "Matches reported change",
      status: "match"
    }
  ]
};

// Helper function to get pool totals for a specific report
export const getOldStructureTotal = (report: string): number => {
  return balanceSheetData.oldStructure.reduce((sum, pool) => {
    const value = pool.values[report];
    return sum + (typeof value === 'number' ? value : 0);
  }, 0);
};

export const getNewStructureTotal = (report: string): number => {
  return balanceSheetData.newStructure.reduce((sum, pool) => {
    const value = pool.values[report];
    return sum + (typeof value === 'number' ? value : 0);
  }, 0);
};

// Get all data points for charting
export const getChartDataForPool = (poolName: string): { report: string; value: number }[] => {
  const allPools = [...balanceSheetData.oldStructure, ...balanceSheetData.newStructure, ...balanceSheetData.singleFormat];
  const pool = allPools.find(p => p.name === poolName);
  
  if (!pool) return [];
  
  return reportColumns
    .filter(report => typeof pool.values[report] === 'number')
    .map(report => ({
      report,
      value: pool.values[report] as number
    }));
};

// Get total holdings over time for charting
export const getTotalHoldingsTimeSeries = (): { report: string; value: number }[] => {
  const holdingsPool = balanceSheetData.singleFormat.find(p => p.name === "Total Foundation Holdings (ALGO)");
  if (!holdingsPool) return [];
  
  return reportColumns
    .filter(report => typeof holdingsPool.values[report] === 'number')
    .map(report => ({
      report,
      value: holdingsPool.values[report] as number
    }));
};
