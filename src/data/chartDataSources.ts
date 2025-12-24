// Chart Data Sources - Aggregates all available data for charting
import { outflowsData, outflowReportColumns } from './outflowsData';
import { balanceSheetData, reportColumns } from './balanceSheetData';
import { foundationReports } from './foundationReports';
import { fiatExpenseData, fiatReportColumns } from './fiatExpenseData';

export interface DataSeries {
  id: string;
  name: string;
  category: string;
  color: string;
  data: { report: string; value: number }[];
}

export interface SubCategory {
  name: string;
  series: DataSeries[];
}

export interface DataCategory {
  name: string;
  series: DataSeries[];
  subCategories?: SubCategory[];
}

// Color palette for charts (retro neon theme)
const chartColors = [
  '#00ffff', // cyan
  '#ff00ff', // magenta
  '#39ff14', // green
  '#ffff00', // yellow
  '#ff6600', // orange
  '#ff4444', // red
  '#00ff88', // mint
  '#ff88ff', // pink
  '#88ffff', // light cyan
  '#ffff88', // light yellow
  '#ff8844', // light orange
  '#44ff44', // light green
  '#8888ff', // light purple
  '#ff8888', // light red
  '#88ff88', // pale green
  '#ff44ff', // bright pink
  '#44ffff', // bright cyan
  '#ffaa00', // amber
  '#aa00ff', // purple
  '#00ffaa', // teal
];

let colorIndex = 0;
const getNextColor = () => {
  const color = chartColors[colorIndex % chartColors.length];
  colorIndex++;
  return color;
};

// Build all available data series from our data sources
export const getAllDataSeries = (): DataCategory[] => {
  colorIndex = 0; // Reset color index
  const categories: DataCategory[] = [];

  // === SUMMARY DATA (CONSOLIDATED) ===
  const summaryAlgoData: { report: string; value: number }[] = foundationReports.map(r => ({
    report: `R${r.reportNumber}`,
    value: r.algoDistributed
  }));

  const summaryFiatData: { report: string; value: number }[] = foundationReports
    .filter(r => r.fiatUSD !== null)
    .map(r => ({
      report: `R${r.reportNumber}`,
      value: r.fiatUSD as number
    }));

  let cumulativeAlgo = 0;
  const cumulativeAlgoData: { report: string; value: number }[] = foundationReports.map(r => {
    cumulativeAlgo += r.algoDistributed;
    return { report: `R${r.reportNumber}`, value: cumulativeAlgo };
  });

  let cumulativeFiat = 0;
  const cumulativeFiatData: { report: string; value: number }[] = foundationReports
    .filter(r => r.fiatUSD !== null)
    .map(r => {
      cumulativeFiat += r.fiatUSD as number;
      return { report: `R${r.reportNumber}`, value: cumulativeFiat };
    });

  categories.push({
    name: 'Summary',
    series: [],
    subCategories: [
      {
        name: 'Per Report',
        series: [
          {
            id: 'summary-algo-distributed',
            name: 'ALGO Distributed per Report',
            category: 'Summary',
            color: getNextColor(),
            data: summaryAlgoData
          },
          {
            id: 'summary-fiat-usd',
            name: 'Fiat USD per Report',
            category: 'Summary',
            color: getNextColor(),
            data: summaryFiatData
          }
        ]
      },
      {
        name: 'Cumulative',
        series: [
          {
            id: 'cumulative-algo-distributed',
            name: 'Cumulative ALGO Distributed',
            category: 'Summary',
            color: getNextColor(),
            data: cumulativeAlgoData
          },
          {
            id: 'cumulative-fiat-usd',
            name: 'Cumulative Fiat USD',
            category: 'Summary',
            color: getNextColor(),
            data: cumulativeFiatData
          }
        ]
      }
    ]
  });

  // === FIAT EXPENSES (CONSOLIDATED) ===
  const oldFiatSeries: DataSeries[] = [];
  for (const item of fiatExpenseData.oldFormat) {
    const data: { report: string; value: number }[] = [];
    for (const report of fiatReportColumns) {
      const value = item.values[report];
      if (typeof value === 'number') {
        data.push({ report, value });
      }
    }
    if (data.length > 0) {
      oldFiatSeries.push({
        id: `fiat-old-${item.name}`.replace(/\s+/g, '-').replace(/[&/]/g, '').toLowerCase(),
        name: item.name,
        category: 'Fiat Expenses',
        color: getNextColor(),
        data
      });
    }
  }

  const newFiatSeries: DataSeries[] = [];
  for (const item of fiatExpenseData.newFormat) {
    const data: { report: string; value: number }[] = [];
    for (const report of fiatReportColumns) {
      const value = item.values[report];
      if (typeof value === 'number') {
        data.push({ report, value });
      }
    }
    if (data.length > 0) {
      newFiatSeries.push({
        id: `fiat-new-${item.name}`.replace(/\s+/g, '-').replace(/[&/]/g, '').toLowerCase(),
        name: item.name,
        category: 'Fiat Expenses',
        color: getNextColor(),
        data
      });
    }
  }

  // Fiat Totals
  const fiatSubtotalOld: { report: string; value: number }[] = [];
  const fiatSubtotalNew: { report: string; value: number }[] = [];
  const fiatCumulative: { report: string; value: number }[] = [];

  for (const report of fiatReportColumns) {
    const oldVal = fiatExpenseData.oldFormatSubtotal[report];
    if (typeof oldVal === 'number') {
      fiatSubtotalOld.push({ report, value: oldVal });
    }
    const newVal = fiatExpenseData.newFormatSubtotal[report];
    if (typeof newVal === 'number') {
      fiatSubtotalNew.push({ report, value: newVal });
    }
    const cumVal = fiatExpenseData.cumulativeTotal[report];
    if (typeof cumVal === 'number') {
      fiatCumulative.push({ report, value: cumVal });
    }
  }

  const fiatTotalsSeries: DataSeries[] = [];
  if (fiatSubtotalOld.length > 0) {
    fiatTotalsSeries.push({
      id: 'fiat-subtotal-old-format',
      name: 'Old Format Total (R4-R7)',
      category: 'Fiat Expenses',
      color: getNextColor(),
      data: fiatSubtotalOld
    });
  }
  if (fiatSubtotalNew.length > 0) {
    fiatTotalsSeries.push({
      id: 'fiat-subtotal-new-format',
      name: 'New Format Total (R8+)',
      category: 'Fiat Expenses',
      color: getNextColor(),
      data: fiatSubtotalNew
    });
  }
  if (fiatCumulative.length > 0) {
    fiatTotalsSeries.push({
      id: 'fiat-cumulative-total',
      name: 'Cumulative Fiat Total',
      category: 'Fiat Expenses',
      color: getNextColor(),
      data: fiatCumulative
    });
  }

  categories.push({
    name: 'Fiat Expenses',
    series: [],
    subCategories: [
      ...(oldFiatSeries.length > 0 ? [{ name: 'Old Format (R4-R7)', series: oldFiatSeries }] : []),
      ...(newFiatSeries.length > 0 ? [{ name: 'New Format (R8+)', series: newFiatSeries }] : []),
      ...(fiatTotalsSeries.length > 0 ? [{ name: 'Totals', series: fiatTotalsSeries }] : [])
    ]
  });

  // === USD INVESTMENTS ===
  const usdInvestmentsData: { report: string; value: number }[] = [
    { report: 'R8', value: 35400000 },
    { report: 'R9', value: 97900000 },
    { report: 'R10', value: 99200000 },
    { report: 'R11', value: 37300000 },
    { report: 'R12', value: 37600000 },
    { report: 'R13', value: 37800000 },
    { report: 'R14', value: 38100000 },
    { report: 'R15', value: 38200000 },
    { report: 'R16', value: 38300000 },
    { report: 'R17', value: 38250000 },
    { report: 'R18', value: 38239000 }
  ];

  categories.push({
    name: 'USD Investments',
    series: [{
      id: 'usd-investments-balance',
      name: 'USD Investments Balance',
      category: 'USD Investments',
      color: getNextColor(),
      data: usdInvestmentsData
    }]
  });

  // === FOUNDATION HOLDINGS ===
  const holdingsData: { report: string; value: number }[] = [
    { report: 'R4', value: 3200000000 },
    { report: 'R5', value: 2800000000 },
    { report: 'R6', value: 2600000000 },
    { report: 'R7', value: 2993000000 },
    { report: 'R8', value: 2791000000 },
    { report: 'R9', value: 2542000000 },
    { report: 'R10', value: 2108000000 },
    { report: 'R11', value: 1972000000 },
    { report: 'R12', value: 1891000000 },
    { report: 'R13', value: 1789000000 },
    { report: 'R14', value: 1702000000 },
    { report: 'R15', value: 1645000000 },
    { report: 'R16', value: 1434000000 },
    { report: 'R17', value: 1329000000 },
    { report: 'R18', value: 1175000000 }
  ];

  categories.push({
    name: 'Foundation Holdings',
    series: [{
      id: 'foundation-algo-holdings',
      name: 'Foundation ALGO Holdings',
      category: 'Holdings',
      color: getNextColor(),
      data: holdingsData
    }]
  });

  // === OUTFLOWS (CONSOLIDATED) ===
  const outflowSubCategories: SubCategory[] = [];
  
  for (const category of outflowsData.categories) {
    const seriesList: DataSeries[] = [];
    
    for (const item of category.items) {
      const data: { report: string; value: number }[] = [];
      
      for (const report of outflowReportColumns) {
        const value = item.values[report];
        if (typeof value === 'number') {
          data.push({ report, value });
        }
      }
      
      if (data.some(d => d.value !== 0)) {
        seriesList.push({
          id: `outflow-${category.name}-${item.name}`.replace(/\s+/g, '-').replace(/[()]/g, '').toLowerCase(),
          name: item.name,
          category: 'Outflows',
          color: getNextColor(),
          data
        });
      }
    }
    
    if (seriesList.length > 0) {
      outflowSubCategories.push({
        name: category.name,
        series: seriesList
      });
    }
  }

  // Add Reported Totals to outflows
  const reportedTotalsData: { report: string; value: number }[] = outflowReportColumns.map(report => ({
    report,
    value: outflowsData.reportedTotals[report]
  }));
  
  outflowSubCategories.push({
    name: 'REPORTED TOTALS',
    series: [{
      id: 'reported-totals',
      name: 'Reported Totals by Report',
      category: 'Outflows',
      color: getNextColor(),
      data: reportedTotalsData
    }]
  });

  // Add Combined Inflows Total
  const loanRepaymentsCat = outflowsData.categories.find(c => c.name === 'LOAN REPAYMENTS');
  const otherInflowsCat = outflowsData.categories.find(c => c.name === 'OTHER INFLOWS');
  
  const totalInflowsData: { report: string; value: number }[] = outflowReportColumns.map(report => {
    let total = 0;
    if (loanRepaymentsCat) {
      total += loanRepaymentsCat.items.reduce((sum, item) => {
        const val = item.values[report];
        return sum + (typeof val === 'number' ? val : 0);
      }, 0);
    }
    if (otherInflowsCat) {
      total += otherInflowsCat.items.reduce((sum, item) => {
        const val = item.values[report];
        return sum + (typeof val === 'number' ? val : 0);
      }, 0);
    }
    return { report, value: total };
  }).filter(d => d.value !== 0);

  outflowSubCategories.push({
    name: 'TOTAL INFLOWS',
    series: [{
      id: 'total-inflows',
      name: 'Total Inflows (All Repayments + Returns)',
      category: 'Outflows',
      color: getNextColor(),
      data: totalInflowsData
    }]
  });

  categories.push({
    name: 'Outflows',
    series: [],
    subCategories: outflowSubCategories
  });

  // === BALANCE SHEET (CONSOLIDATED) ===
  const balanceSubCategories: SubCategory[] = [];

  // Old Structure Pools
  const oldStructureSeries: DataSeries[] = [];
  for (const pool of balanceSheetData.oldStructure) {
    const data: { report: string; value: number }[] = [];
    for (const report of reportColumns) {
      const value = pool.values[report];
      if (typeof value === 'number') {
        data.push({ report, value });
      }
    }
    if (data.length > 0) {
      oldStructureSeries.push({
        id: `balance-old-${pool.name}`.replace(/\s+/g, '-').replace(/[()]/g, '').toLowerCase(),
        name: pool.name,
        category: 'Balance Sheet',
        color: getNextColor(),
        data
      });
    }
  }
  if (oldStructureSeries.length > 0) {
    balanceSubCategories.push({ name: 'Old Structure (R4-R5)', series: oldStructureSeries });
  }

  // New Structure Pools
  const newStructureSeries: DataSeries[] = [];
  for (const pool of balanceSheetData.newStructure) {
    const data: { report: string; value: number }[] = [];
    for (const report of reportColumns) {
      const value = pool.values[report];
      if (typeof value === 'number') {
        data.push({ report, value });
      }
    }
    if (data.length > 0) {
      newStructureSeries.push({
        id: `balance-new-${pool.name}`.replace(/\s+/g, '-').replace(/[()]/g, '').toLowerCase(),
        name: pool.name,
        category: 'Balance Sheet',
        color: getNextColor(),
        data
      });
    }
  }
  if (newStructureSeries.length > 0) {
    balanceSubCategories.push({ name: 'New Structure (R6-R7)', series: newStructureSeries });
  }

  // R8+ Single Format
  const singleFormatSeries: DataSeries[] = [];
  for (const pool of balanceSheetData.singleFormat) {
    const data: { report: string; value: number }[] = [];
    for (const report of reportColumns) {
      const value = pool.values[report];
      if (typeof value === 'number') {
        data.push({ report, value });
      }
    }
    if (data.length > 0) {
      singleFormatSeries.push({
        id: `balance-r8-${pool.name}`.replace(/\s+/g, '-').replace(/[()]/g, '').toLowerCase(),
        name: pool.name,
        category: 'Balance Sheet',
        color: getNextColor(),
        data
      });
    }
  }
  if (singleFormatSeries.length > 0) {
    balanceSubCategories.push({ name: 'R8+ Format', series: singleFormatSeries });
  }

  if (balanceSubCategories.length > 0) {
    categories.push({
      name: 'Balance Sheet',
      series: [],
      subCategories: balanceSubCategories
    });
  }

  // === REWARDS PROGRAMS ===
  const governanceData: { report: string; value: number }[] = [
    { report: 'R6', value: 60000000 },
    { report: 'R7', value: 141000000 },
    { report: 'R8', value: 141000000 },
    { report: 'R9', value: 68200000 },
    { report: 'R10', value: 54100000 },
    { report: 'R11', value: 40900000 },
    { report: 'R12', value: 31200000 },
    { report: 'R13', value: 21300000 },
    { report: 'R14', value: 21300000 },
    { report: 'R15', value: 17000000 },
    { report: 'R16', value: 17240000 },
    { report: 'R17', value: 20030000 },
    { report: 'R18', value: 0 }
  ];

  const stakingRewardsData: { report: string; value: number }[] = [
    { report: 'R16', value: 10540000 },
    { report: 'R17', value: 18780000 },
    { report: 'R18', value: 19980000 }
  ];

  const participationRewardsData: { report: string; value: number }[] = [
    { report: 'R1', value: 96000000 },
    { report: 'R2', value: 101000000 },
    { report: 'R3', value: 124700000 },
    { report: 'R4', value: 135490000 },
    { report: 'R5', value: 154900000 },
    { report: 'R6', value: 84670000 },
    { report: 'R7', value: 500000 }
  ];

  categories.push({
    name: 'Rewards Programs',
    series: [
      {
        id: 'participation-rewards',
        name: 'Participation Rewards (R1-R7)',
        category: 'Rewards',
        color: getNextColor(),
        data: participationRewardsData
      },
      {
        id: 'governance-rewards',
        name: 'Governance Rewards (R6-R17)',
        category: 'Rewards',
        color: getNextColor(),
        data: governanceData
      },
      {
        id: 'staking-rewards',
        name: 'Staking Rewards (R16+)',
        category: 'Rewards',
        color: getNextColor(),
        data: stakingRewardsData
      }
    ]
  });

  // === STRUCTURED SELLING ===
  const structuredSellingData: { report: string; value: number }[] = [
    { report: 'R2', value: 17000000 },
    { report: 'R3', value: 69400000 },
    { report: 'R4', value: 45300000 },
    { report: 'R5', value: 47000000 },
    { report: 'R6', value: 42200000 },
    { report: 'R7', value: 16500000 },
    { report: 'R8', value: 101000000 },
    { report: 'R9', value: 31000000 },
    { report: 'R10', value: 0 },
    { report: 'R11', value: 0 },
    { report: 'R12', value: 31000000 },
    { report: 'R13', value: 58000000 },
    { report: 'R14', value: 21000000 },
    { report: 'R15', value: 110000000 },
    { report: 'R16', value: 174000000 },
    { report: 'R17', value: 63000000 },
    { report: 'R18', value: 78000000 }
  ];

  categories.push({
    name: 'Structured Selling',
    series: [{
      id: 'structured-selling',
      name: 'Structured Selling (ALGO)',
      category: 'Selling',
      color: getNextColor(),
      data: structuredSellingData
    }]
  });

  // === NETWORK METRICS ===
  const totalTransactionsData: { report: string; value: number }[] = [
    { report: 'R9', value: 1100000000 },
    { report: 'R10', value: 1200000000 },
    { report: 'R11', value: 1300000000 },
    { report: 'R12', value: 1700000000 },
    { report: 'R13', value: 2100000000 },
    { report: 'R14', value: 2300000000 },
    { report: 'R15', value: 2650000000 },
    { report: 'R16', value: 2880000000 },
    { report: 'R17', value: 3000000000 },
    { report: 'R18', value: 3250000000 }
  ];

  const totalAccountsData: { report: string; value: number }[] = [
    { report: 'R9', value: 31300000 },
    { report: 'R10', value: 32300000 },
    { report: 'R11', value: 34200000 },
    { report: 'R12', value: 35200000 },
    { report: 'R13', value: 36000000 },
    { report: 'R14', value: 37300000 },
    { report: 'R15', value: 40200000 },
    { report: 'R16', value: 43000000 },
    { report: 'R17', value: 45400000 },
    { report: 'R18', value: 47100000 }
  ];

  categories.push({
    name: 'Network Metrics',
    series: [
      {
        id: 'total-transactions',
        name: 'Total Transactions',
        category: 'Network',
        color: getNextColor(),
        data: totalTransactionsData
      },
      {
        id: 'total-accounts',
        name: 'Total Accounts',
        category: 'Network',
        color: getNextColor(),
        data: totalAccountsData
      }
    ]
  });

  // === COMPENSATION ===
  const boardCompData: { report: string; value: number }[] = [
    { report: 'R1', value: 75000 },
    { report: 'R2', value: 125000 },
    { report: 'R3', value: 200000 },
    { report: 'R4', value: 395000 },
    { report: 'R5', value: 960000 },
    { report: 'R6', value: 1227000 },
    { report: 'R7', value: 1072000 }
  ];

  categories.push({
    name: 'Compensation',
    series: [{
      id: 'board-compensation',
      name: 'Board Compensation (ALGO)',
      category: 'Compensation',
      color: getNextColor(),
      data: boardCompData
    }]
  });

  return categories;
};

// Get all reports from R1 to R18
export const allReports = ['R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8', 'R9', 'R10', 'R11', 'R12', 'R13', 'R14', 'R15', 'R16', 'R17', 'R18'];

// Prepare data for chart consumption
export const prepareChartData = (
  selectedSeries: DataSeries[],
  reportRange: { start: string; end: string }
): { report: string; [key: string]: number | string }[] => {
  const startIdx = allReports.indexOf(reportRange.start);
  const endIdx = allReports.indexOf(reportRange.end);
  const reportsInRange = allReports.slice(startIdx, endIdx + 1);
  
  const chartData: { report: string; [key: string]: number | string }[] = [];
  
  for (const report of reportsInRange) {
    const dataPoint: { report: string; [key: string]: number | string } = { report };
    
    for (const series of selectedSeries) {
      const seriesDataPoint = series.data.find(d => d.report === report);
      dataPoint[series.id] = seriesDataPoint?.value ?? 0;
    }
    
    chartData.push(dataPoint);
  }
  
  return chartData;
};

// Prepare pie chart data (aggregates values across selected range)
export const preparePieChartData = (
  selectedSeries: DataSeries[],
  reportRange: { start: string; end: string }
): { name: string; value: number; color: string }[] => {
  const startIdx = allReports.indexOf(reportRange.start);
  const endIdx = allReports.indexOf(reportRange.end);
  const reportsInRange = allReports.slice(startIdx, endIdx + 1);
  
  return selectedSeries.map(series => {
    const total = series.data
      .filter(d => reportsInRange.includes(d.report))
      .reduce((sum, d) => sum + Math.abs(d.value), 0);
    
    return {
      name: series.name,
      value: total,
      color: series.color
    };
  }).filter(d => d.value > 0);
};

// Count total available data series
export const getTotalDataSeriesCount = (): number => {
  const categories = getAllDataSeries();
  let count = 0;
  
  for (const category of categories) {
    count += category.series.length;
    if (category.subCategories) {
      for (const subCat of category.subCategories) {
        count += subCat.series.length;
      }
    }
  }
  
  return count;
};
