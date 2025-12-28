// Technologies Pool Tracking Data - Tracking Algorand Technologies Inc ALGO Holdings
// Opening → Distributions → Sales → Closing → Discrepancy Analysis

export interface TechPoolTrackingPeriod {
  period: string;
  opening: number | null;
  distributions: number;
  sales: number;
  closing: number | null;
  calculated: number | null;
  difference: number | null;
  notes: string;
  flag?: 'warning' | 'error' | 'success';
}

export const techPoolTrackingData: TechPoolTrackingPeriod[] = [
  {
    period: 'R1 (Jun-Nov 2019)',
    opening: null,
    distributions: 111200000,
    sales: 0,
    closing: 2027000000,
    calculated: null,
    difference: null,
    notes: 'BASELINE - First report, Algo Capital 100M investment',
  },
  {
    period: 'R2 (Nov 2019-Jan 2020)',
    opening: 2027000000,
    distributions: 43800000,
    sales: 0,
    closing: 2016000000,
    calculated: 1983200000,
    difference: 32800000,
    notes: '33M MORE than expected - Equity +43.6M, Lending +63.5M',
    flag: 'warning',
  },
  {
    period: 'R3 (Jan-Apr 2020)',
    opening: 2016000000,
    distributions: 9000000,
    sales: 21000000,
    closing: 2024000000,
    calculated: 1986000000,
    difference: 38000000,
    notes: '38M MORE - First sales 21M, Borderless Capital formed',
    flag: 'warning',
  },
  {
    period: 'R4 (May-Jul 2020)',
    opening: 2024000000,
    distributions: 20000000,
    sales: 19600000,
    closing: 2019000000,
    calculated: 1984400000,
    difference: 34600000,
    notes: '35M MORE - Financial ecosystem FLAT',
    flag: 'warning',
  },
  {
    period: 'R5 (Aug-Oct 2020)',
    opening: 2019000000,
    distributions: 8000000,
    sales: 26000000,
    closing: 2009000000,
    calculated: 1985000000,
    difference: 24000000,
    notes: '24M MORE - Borderless +2M, Equity +4M',
  },
  {
    period: 'R6 (Nov 2020-Apr 2021)',
    opening: 2009000000,
    distributions: 48500000,
    sales: 72000000,
    closing: 2047000000,
    calculated: 1888500000,
    difference: 158500000,
    notes: '159M MORE - PEAK holdings, MM doubled, biggest sales period',
    flag: 'error',
  },
  {
    period: 'R7 (May 2021-Jun 2022)',
    opening: 2047000000,
    distributions: 1268800000,
    sales: 150000000,
    closing: 1691000000,
    calculated: 628200000,
    difference: 1062800000,
    notes: '1.06B MORE - Venture Funds 1.15B, FINAL REPORT',
    flag: 'error',
  },
];

// Calculate summary statistics
export const getTechPoolTrackingSummary = () => {
  const matchingPeriods = techPoolTrackingData.filter(p => p.difference === 0).length;
  const closeMatchPeriods = techPoolTrackingData.filter(p => p.difference !== null && p.difference !== 0 && Math.abs(p.difference) <= 50000000).length;
  const discrepancyPeriods = techPoolTrackingData.filter(p => p.difference !== null && Math.abs(p.difference!) > 50000000).length;

  const totalDistributions = techPoolTrackingData.reduce((sum, p) => sum + p.distributions, 0);
  const totalSales = techPoolTrackingData.reduce((sum, p) => sum + p.sales, 0);
  const totalDiscrepancy = techPoolTrackingData
    .filter(p => p.difference !== null)
    .reduce((sum, p) => sum + (p.difference || 0), 0);

  return {
    matchingPeriods,
    closeMatchPeriods,
    discrepancyPeriods,
    totalDistributions,
    totalSales,
    totalDiscrepancy,
    latestClosing: techPoolTrackingData[techPoolTrackingData.length - 1].closing,
    peakHoldings: 2047000000,
  };
};
