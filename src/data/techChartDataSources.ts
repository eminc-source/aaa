// Technologies Chart Data Sources - Aggregates all available data for charting
import { techBalanceSheetData, techReportColumns } from './techBalanceSheetData';
import { techOutflowsData, techOutflowReportColumns } from './techOutflowsData';
import { techLoansData } from './techLoansData';

export interface TechDataSeries {
  id: string;
  name: string;
  category: string;
  color: string;
  data: { report: string; value: number }[];
}

export interface TechSubCategory {
  name: string;
  series: TechDataSeries[];
}

export interface TechDataCategory {
  name: string;
  series: TechDataSeries[];
  subCategories?: TechSubCategory[];
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

// Build all available data series from Technologies data sources
export const getTechAllDataSeries = (): TechDataCategory[] => {
  colorIndex = 0; // Reset color index
  const categories: TechDataCategory[] = [];

  // === HOLDINGS ===
  const holdingsSeries: TechDataSeries[] = [];

  for (const item of techBalanceSheetData.holdings) {
    const data: { report: string; value: number }[] = [];
    for (const report of techReportColumns) {
      const value = item.values[report];
      if (typeof value === 'number') {
        data.push({ report, value });
      }
    }
    if (data.length > 0) {
      holdingsSeries.push({
        id: `holdings-${item.name}`.replace(/\s+/g, '-').replace(/[()]/g, '').toLowerCase(),
        name: item.name,
        category: 'Holdings',
        color: getNextColor(),
        data
      });
    }
  }

  categories.push({
    name: 'Holdings',
    series: holdingsSeries
  });

  // === INCENTIVES & DEVELOPMENT ===
  const incentivesSeries: TechDataSeries[] = [];

  for (const item of techBalanceSheetData.incentivesDevelopment) {
    const data: { report: string; value: number }[] = [];
    for (const report of techReportColumns) {
      const value = item.values[report];
      if (typeof value === 'number') {
        data.push({ report, value });
      }
    }
    if (data.length > 0) {
      incentivesSeries.push({
        id: `incentives-${item.name}`.replace(/\s+/g, '-').replace(/[()&/]/g, '').toLowerCase(),
        name: item.name,
        category: 'Incentives & Development',
        color: getNextColor(),
        data
      });
    }
  }

  categories.push({
    name: 'Incentives & Development',
    series: incentivesSeries
  });

  // === FINANCIAL ECOSYSTEM ===
  const financialSeries: TechDataSeries[] = [];

  for (const item of techBalanceSheetData.financialEcosystem) {
    const data: { report: string; value: number }[] = [];
    for (const report of techReportColumns) {
      const value = item.values[report];
      if (typeof value === 'number') {
        data.push({ report, value });
      }
    }
    if (data.length > 0) {
      financialSeries.push({
        id: `financial-${item.name}`.replace(/\s+/g, '-').replace(/[()]/g, '').toLowerCase(),
        name: item.name,
        category: 'Financial Ecosystem',
        color: getNextColor(),
        data
      });
    }
  }

  categories.push({
    name: 'Financial Ecosystem',
    series: financialSeries
  });

  // === SECONDARY MARKET SALES ===
  const salesSeries: TechDataSeries[] = [];

  for (const item of techBalanceSheetData.sales) {
    const data: { report: string; value: number }[] = [];
    for (const report of techReportColumns) {
      const value = item.values[report];
      if (typeof value === 'number') {
        data.push({ report, value });
      }
    }
    if (data.length > 0) {
      salesSeries.push({
        id: `sales-${item.name}`.replace(/\s+/g, '-').replace(/[()%]/g, '').toLowerCase(),
        name: item.name,
        category: 'Sales',
        color: getNextColor(),
        data
      });
    }
  }

  categories.push({
    name: 'Secondary Market Sales',
    series: salesSeries
  });

  // === NETWORK METRICS ===
  const networkSeries: TechDataSeries[] = [];

  for (const item of techBalanceSheetData.networkMetrics) {
    const data: { report: string; value: number }[] = [];
    for (const report of techReportColumns) {
      const value = item.values[report];
      if (typeof value === 'number') {
        data.push({ report, value });
      }
    }
    if (data.length > 0) {
      networkSeries.push({
        id: `network-${item.name}`.replace(/\s+/g, '-').replace(/[()]/g, '').toLowerCase(),
        name: item.name,
        category: 'Network Metrics',
        color: getNextColor(),
        data
      });
    }
  }

  categories.push({
    name: 'Network Metrics',
    series: networkSeries
  });

  // === OUTFLOWS BY CATEGORY ===
  const outflowSubCategories: TechSubCategory[] = [];

  for (const category of techOutflowsData.categories) {
    const seriesList: TechDataSeries[] = [];

    for (const item of category.items) {
      const data: { report: string; value: number }[] = [];

      for (const report of techOutflowReportColumns) {
        const value = item.values[report];
        if (typeof value === 'number') {
          data.push({ report, value });
        }
      }

      if (data.some(d => d.value !== 0)) {
        seriesList.push({
          id: `outflow-${category.name}-${item.name}`.replace(/\s+/g, '-').replace(/[()&]/g, '').toLowerCase(),
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

  // Add Grand Totals to outflows
  const grandTotalsData: { report: string; value: number }[] = techOutflowReportColumns.map(report => ({
    report,
    value: techOutflowsData.grandTotal[report]
  }));

  outflowSubCategories.push({
    name: 'GRAND TOTALS',
    series: [{
      id: 'outflows-grand-total',
      name: 'Grand Total Deployed by Report',
      category: 'Outflows',
      color: getNextColor(),
      data: grandTotalsData
    }]
  });

  categories.push({
    name: 'Outflows',
    series: [],
    subCategories: outflowSubCategories
  });

  // === LOANS TRACKING ===
  // Lending outstanding by report
  const lendingData: { report: string; value: number }[] = [
    { report: 'R1', value: 52500000 },
    { report: 'R2', value: 116000000 },
    { report: 'R3', value: 165600000 },
    { report: 'R4', value: 165600000 },
    { report: 'R5', value: 165600000 },
    { report: 'R6', value: 159100000 },
    { report: 'R7', value: 50000000 }
  ];

  const marketMakingData: { report: string; value: number }[] = [
    { report: 'R1', value: 18500000 },
    { report: 'R2', value: 18700000 },
    { report: 'R3', value: 18700000 },
    { report: 'R4', value: 18700000 },
    { report: 'R5', value: 18700000 },
    { report: 'R6', value: 41300000 },
    { report: 'R7', value: 75000000 }
  ];

  const totalLoansData: { report: string; value: number }[] = techReportColumns.map((report, idx) => ({
    report,
    value: lendingData[idx].value + marketMakingData[idx].value
  }));

  categories.push({
    name: 'Loans',
    series: [
      {
        id: 'loans-lending',
        name: '3rd Party Lending Outstanding',
        category: 'Loans',
        color: getNextColor(),
        data: lendingData
      },
      {
        id: 'loans-market-making',
        name: 'Market Making Outstanding',
        category: 'Loans',
        color: getNextColor(),
        data: marketMakingData
      },
      {
        id: 'loans-total',
        name: 'Total Loans Outstanding',
        category: 'Loans',
        color: getNextColor(),
        data: totalLoansData
      }
    ]
  });

  // === SUMMARY METRICS ===
  // Total ALGO Owned over time
  const totalAlgoOwned: { report: string; value: number }[] = [
    { report: 'R1', value: 2027000000 },
    { report: 'R2', value: 2016000000 },
    { report: 'R3', value: 2024000000 },
    { report: 'R4', value: 2019000000 },
    { report: 'R5', value: 2009000000 },
    { report: 'R6', value: 2047000000 },
    { report: 'R7', value: 1691000000 }
  ];

  // Cumulative Sales
  const cumulativeSales: { report: string; value: number }[] = [
    { report: 'R1', value: 0 },
    { report: 'R2', value: 0 },
    { report: 'R3', value: 21000000 },
    { report: 'R4', value: 40600000 },
    { report: 'R5', value: 66600000 },
    { report: 'R6', value: 138600000 },
    { report: 'R7', value: 288600000 }
  ];

  // Total Deployed (Incentives + Financial)
  const totalDeployed: { report: string; value: number }[] = techReportColumns.map(report => {
    let incentivesTotal = 0;
    let financialTotal = 0;

    techBalanceSheetData.incentivesDevelopment.forEach(item => {
      const val = item.values[report];
      if (typeof val === 'number') incentivesTotal += val;
    });

    techBalanceSheetData.financialEcosystem.forEach(item => {
      const val = item.values[report];
      if (typeof val === 'number') financialTotal += val;
    });

    return { report, value: incentivesTotal + financialTotal };
  });

  categories.push({
    name: 'Summary',
    series: [
      {
        id: 'summary-total-algo-owned',
        name: 'Total ALGO Owned',
        category: 'Summary',
        color: getNextColor(),
        data: totalAlgoOwned
      },
      {
        id: 'summary-cumulative-sales',
        name: 'Cumulative Secondary Sales',
        category: 'Summary',
        color: getNextColor(),
        data: cumulativeSales
      },
      {
        id: 'summary-total-deployed',
        name: 'Total Deployed (Incentives + Financial)',
        category: 'Summary',
        color: getNextColor(),
        data: totalDeployed
      }
    ]
  });

  return categories;
};

// All reports for Technologies (R1-R7)
export const techAllReports = ['R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7'];

// Prepare data for chart consumption
export const prepareTechChartData = (
  selectedSeries: TechDataSeries[],
  reportRange: { start: string; end: string }
): { report: string; [key: string]: number | string }[] => {
  const startIdx = techAllReports.indexOf(reportRange.start);
  const endIdx = techAllReports.indexOf(reportRange.end);
  const reportsInRange = techAllReports.slice(startIdx, endIdx + 1);

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
export const prepareTechPieChartData = (
  selectedSeries: TechDataSeries[],
  reportRange: { start: string; end: string }
): { name: string; value: number; color: string }[] => {
  const startIdx = techAllReports.indexOf(reportRange.start);
  const endIdx = techAllReports.indexOf(reportRange.end);
  const reportsInRange = techAllReports.slice(startIdx, endIdx + 1);

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
export const getTechTotalDataSeriesCount = (): number => {
  const categories = getTechAllDataSeries();
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
