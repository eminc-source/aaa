// Algorand Technologies Inc - All Reported Outflows by Report
// Based on transparency reports R1-R7

export interface TechOutflowItem {
  name: string;
  values: { [reportKey: string]: number | null };
  total: number;
}

export interface TechOutflowCategory {
  name: string;
  items: TechOutflowItem[];
}

export interface TechOutflowsData {
  title: string;
  note: string;
  categories: TechOutflowCategory[];
  grandTotal: { [reportKey: string]: number };
  grandTotalAll: number;
}

export const techOutflowReportColumns = ['R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7'];

export const techOutflowsData: TechOutflowsData = {
  title: "ALL REPORTED OUTFLOWS BY REPORT",
  note: "R7 changed reporting structure significantly",

  categories: [
    {
      name: "INCENTIVES & DEVELOPMENT",
      items: [
        {
          name: "Venture Funds (NEW R7)",
          values: { R1: null, R2: null, R3: null, R4: null, R5: null, R6: null, R7: 1150000000 },
          total: 1150000000
        },
        {
          name: "Algo Capital / Borderless Capital",
          values: { R1: 100000000, R2: 100000000, R3: 103000000, R4: 113000000, R5: 115000000, R6: 159100000, R7: null },
          total: 159100000
        },
        {
          name: "Equity / Other Investments",
          values: { R1: 8400000, R2: 52000000, R3: 56000000, R4: 65000000, R5: 69000000, R6: 70800000, R7: 131000000 },
          total: 131000000
        },
        {
          name: "Market Development",
          values: { R1: 2200000, R2: 2200000, R3: 4000000, R4: 5000000, R5: 6000000, R6: 6000000, R7: 213000000 },
          total: 213000000
        },
        {
          name: "Application Development",
          values: { R1: 570000, R2: 570000, R3: 1000000, R4: 1000000, R5: 2000000, R6: 4600000, R7: 15000000 },
          total: 15000000
        }
      ]
    },
    {
      name: "FINANCIAL ECOSYSTEM",
      items: [
        {
          name: "Lending",
          values: { R1: 52500000, R2: 116000000, R3: 165600000, R4: 165600000, R5: 165600000, R6: 159100000, R7: 50000000 },
          total: 50000000
        },
        {
          name: "Market Making",
          values: { R1: 18500000, R2: 18700000, R3: 18700000, R4: 18700000, R5: 18700000, R6: 41300000, R7: 75000000 },
          total: 75000000
        },
        {
          name: "Miscellaneous",
          values: { R1: 80000, R2: 80000, R3: 80000, R4: 80000, R5: 80000, R6: 84000, R7: 77000 },
          total: 77000
        }
      ]
    },
    {
      name: "SECONDARY MARKET SALES",
      items: [
        {
          name: "Sales (Period)",
          values: { R1: 0, R2: 0, R3: 21000000, R4: 19600000, R5: 26000000, R6: 72000000, R7: 150000000 },
          total: 288600000
        },
        {
          name: "Sales (Cumulative)",
          values: { R1: 0, R2: 0, R3: 21000000, R4: 40600000, R5: 66600000, R6: 138600000, R7: 288600000 },
          total: 288600000
        }
      ]
    }
  ],

  grandTotal: {
    R1: 182250000,
    R2: 289550000,
    R3: 348380000,
    R4: 368380000,
    R5: 376380000,
    R6: 440984000,
    R7: 1634077000
  },
  grandTotalAll: 1793177000
};

// Helper functions
export const getTechIncentivesSubtotal = (reportKey: string): number => {
  let total = 0;
  const category = techOutflowsData.categories.find(c => c.name === "INCENTIVES & DEVELOPMENT");
  if (category) {
    category.items.forEach(item => {
      const val = item.values[reportKey];
      if (typeof val === 'number') total += val;
    });
  }
  return total;
};

export const getTechFinancialSubtotal = (reportKey: string): number => {
  let total = 0;
  const category = techOutflowsData.categories.find(c => c.name === "FINANCIAL ECOSYSTEM");
  if (category) {
    category.items.forEach(item => {
      const val = item.values[reportKey];
      if (typeof val === 'number') total += val;
    });
  }
  return total;
};

export const getTechIncentivesTotalAll = (): number => {
  const category = techOutflowsData.categories.find(c => c.name === "INCENTIVES & DEVELOPMENT");
  if (category) {
    return category.items.reduce((sum, item) => sum + item.total, 0);
  }
  return 0;
};

export const getTechFinancialTotalAll = (): number => {
  const category = techOutflowsData.categories.find(c => c.name === "FINANCIAL ECOSYSTEM");
  if (category) {
    return category.items.reduce((sum, item) => sum + item.total, 0);
  }
  return 0;
};
