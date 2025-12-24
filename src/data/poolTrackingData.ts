// Pool Tracking Data - Tracking Foundation ALGO Holdings
// Opening → Distributions → Inflows → Closing → Discrepancy Analysis

export interface PoolTrackingPeriod {
  period: string;
  opening: number | null;
  distributions: number;
  inflows: number;
  closing: number | null;
  calculated: number | null;
  difference: number | null;
  notes: string;
  flag?: 'warning' | 'error' | 'success';
}

export const poolTrackingData: PoolTrackingPeriod[] = [
  {
    period: 'R1 (Jun-Sep 19)',
    opening: null,
    distributions: 440000000,
    inflows: 0,
    closing: null,
    calculated: null,
    difference: null,
    notes: 'PRE-BALANCE SHEET - Dutch Auction & Early Rewards',
  },
  {
    period: 'R2 (Oct 19-Mar 20)',
    opening: null,
    distributions: 126000000,
    inflows: 0,
    closing: null,
    calculated: null,
    difference: null,
    notes: 'PRE-BALANCE SHEET - Node Running Rewards',
  },
  {
    period: 'R3 (Apr-Sep 20)',
    opening: null,
    distributions: 549100000,
    inflows: 0,
    closing: null,
    calculated: null,
    difference: null,
    notes: 'PRE-BALANCE SHEET - Participation Rewards',
  },
  {
    period: 'R4 End (Mar 31, 2021)',
    opening: null,
    distributions: 1640000000,
    inflows: 0,
    closing: 5347960000,
    calculated: null,
    difference: null,
    notes: 'BASELINE - First balance sheet (8 pools)',
  },
  {
    period: 'R5 (Apr-Sep 21)',
    opening: 5347960000,
    distributions: 1410000000,
    inflows: 0,
    closing: 3929290000,
    calculated: 3937960000,
    difference: -8670000,
    notes: '9M less than expected',
  },
  {
    period: 'R6 (Oct 21-Mar 22)',
    opening: 3929290000,
    distributions: 502000000,
    inflows: 0,
    closing: 3296310000,
    calculated: 3427290000,
    difference: -130980000,
    notes: '131M LESS - Pool consolidation',
    flag: 'error',
  },
  {
    period: 'R7 (Apr-Sep 22)',
    opening: 3296310000,
    distributions: 335000000,
    inflows: 0,
    closing: 2993160000,
    calculated: 2961310000,
    difference: 31850000,
    notes: '32M more than expected',
  },
  {
    period: 'R8 (Oct 22-Mar 23)',
    opening: 2993160000,
    distributions: 242000000,
    inflows: 136500000,
    closing: 2791000000,
    calculated: 2887660000,
    difference: -96660000,
    notes: '97M LESS than expected',
    flag: 'error',
  },
  {
    period: 'R9 (Apr-Jun 23)',
    opening: 2791000000,
    distributions: 249000000,
    inflows: 83000000,
    closing: 2542000000,
    calculated: 2625000000,
    difference: -83000000,
    notes: '83M LESS than expected',
    flag: 'error',
  },
  {
    period: 'R10 (Jul-Sep 23)',
    opening: 2542000000,
    distributions: 434000000,
    inflows: 0,
    closing: 2108000000,
    calculated: 2108000000,
    difference: 0,
    notes: 'Matches!',
    flag: 'success',
  },
  {
    period: 'R11 (Oct-Dec 23)',
    opening: 2108000000,
    distributions: 136000000,
    inflows: 3000000,
    closing: 1972000000,
    calculated: 1975000000,
    difference: -3000000,
    notes: 'Close match',
    flag: 'success',
  },
  {
    period: 'R12 (Jan-Mar 24)',
    opening: 1972000000,
    distributions: 81000000,
    inflows: 0,
    closing: 1891000000,
    calculated: 1891000000,
    difference: 0,
    notes: 'Matches!',
    flag: 'success',
  },
  {
    period: 'R13 (Apr-Jun 24)',
    opening: 1891000000,
    distributions: 101000000,
    inflows: 0,
    closing: 1789000000,
    calculated: 1790000000,
    difference: -1000000,
    notes: 'Close match',
    flag: 'success',
  },
  {
    period: 'R14 (Jul-Sep 24)',
    opening: 1789000000,
    distributions: 87000000,
    inflows: 0,
    closing: 1702000000,
    calculated: 1702000000,
    difference: 0,
    notes: 'Matches!',
    flag: 'success',
  },
  {
    period: 'R15 (Oct-Dec 24)',
    opening: 1702000000,
    distributions: 147000000,
    inflows: 90000000,
    closing: 1645000000,
    calculated: 1645000000,
    difference: 0,
    notes: 'Matches! (75M DWF + 15M ETP returned)',
    flag: 'success',
  },
  {
    period: 'R16 (Jan-Mar 25)',
    opening: 1645000000,
    distributions: 211000000,
    inflows: 0,
    closing: 1434000000,
    calculated: 1434000000,
    difference: 0,
    notes: 'Matches! (Staking Rewards launched)',
    flag: 'success',
  },
  {
    period: 'R17 (Apr-Jun 25)',
    opening: 1434000000,
    distributions: 105000000,
    inflows: 0,
    closing: 1329000000,
    calculated: 1329000000,
    difference: 0,
    notes: 'Matches! (3B transactions milestone)',
    flag: 'success',
  },
  {
    period: 'R18 (Jul-Sep 25)',
    opening: 1329000000,
    distributions: 154000000,
    inflows: 0,
    closing: 1175000000,
    calculated: 1175000000,
    difference: 0,
    notes: 'Matches! (Algoland launch)',
    flag: 'success',
  },
];

// Calculate summary statistics
export const getPoolTrackingSummary = () => {
  const matchingPeriods = poolTrackingData.filter(p => p.difference === 0).length;
  const closeMatchPeriods = poolTrackingData.filter(p => p.difference !== null && p.difference !== 0 && Math.abs(p.difference) <= 10000000).length;
  const discrepancyPeriods = poolTrackingData.filter(p => p.difference !== null && Math.abs(p.difference!) > 10000000).length;
  
  const totalDistributions = poolTrackingData.reduce((sum, p) => sum + p.distributions, 0);
  const totalInflows = poolTrackingData.reduce((sum, p) => sum + p.inflows, 0);
  const totalDiscrepancy = poolTrackingData
    .filter(p => p.difference !== null)
    .reduce((sum, p) => sum + (p.difference || 0), 0);
  
  return {
    matchingPeriods,
    closeMatchPeriods,
    discrepancyPeriods,
    totalDistributions,
    totalInflows,
    totalDiscrepancy,
    latestClosing: poolTrackingData[poolTrackingData.length - 1].closing,
  };
};
