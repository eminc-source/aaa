// Algorand Technologies Inc - Loans Tracking Data
// Based on transparency reports R1-R7

export interface TechLoanEntry {
  borrower: string;
  originalAmount: string | null;
  whenMade: string;
  whenRepaid: string | null;
  repaidAmt: number;
  outstanding: string;
  status: string;
  notes: string;
}

export interface TechLoansData {
  title: string;
  note: string;
  lendingEntries: TechLoanEntry[];
  marketMakingEntries: TechLoanEntry[];
  totals: {
    totalLending: string;
    totalMarketMaking: string;
    lendingStatus: string;
    marketMakingStatus: string;
    lendingNotes: string;
    marketMakingNotes: string;
  };
  transparencyGaps: string[];
}

export const techLoansData: TechLoansData = {
  title: "LOANS TRACKING",
  note: "Algorand Inc does NOT disclose individual borrower names",

  lendingEntries: [
    {
      borrower: "3rd Party Lending (unspecified)",
      originalAmount: "52.5M ALGO",
      whenMade: "R1 (Nov 2019)",
      whenRepaid: null,
      repaidAmt: 0,
      outstanding: "52.5M ALGO",
      status: "ACTIVE R1",
      notes: "Initial lending; counterparties not disclosed"
    },
    {
      borrower: "3rd Party Lending - Increase",
      originalAmount: "+63.5M ALGO",
      whenMade: "R2 (Jan 2020)",
      whenRepaid: null,
      repaidAmt: 0,
      outstanding: "116M ALGO total",
      status: "ACTIVE R2",
      notes: "Cumulative now 116M"
    },
    {
      borrower: "3rd Party Lending - Increase",
      originalAmount: "+49.6M ALGO",
      whenMade: "R3 (Apr 2020)",
      whenRepaid: null,
      repaidAmt: 0,
      outstanding: "165.6M ALGO total",
      status: "ACTIVE R3",
      notes: "Cumulative now 165.6M"
    },
    {
      borrower: "3rd Party Lending (no change)",
      originalAmount: null,
      whenMade: "R4 (Jul 2020)",
      whenRepaid: null,
      repaidAmt: 0,
      outstanding: "165.6M ALGO total",
      status: "ACTIVE R4",
      notes: "No change from R3"
    },
    {
      borrower: "3rd Party Lending (no change)",
      originalAmount: null,
      whenMade: "R5 (Oct 2020)",
      whenRepaid: null,
      repaidAmt: 0,
      outstanding: "165.6M ALGO total",
      status: "ACTIVE R5",
      notes: "No change - FLAT for 3 reports"
    },
    {
      borrower: "3rd Party Lending - DECREASE",
      originalAmount: "-6.5M ALGO",
      whenMade: "R6 (Apr 2021)",
      whenRepaid: null,
      repaidAmt: 0,
      outstanding: "159.1M ALGO total",
      status: "ACTIVE R6",
      notes: "First decrease - partial repayment?"
    },
    {
      borrower: "3rd Party Lending - MAJOR DROP",
      originalAmount: "-109.1M ALGO",
      whenMade: "R7 (Jun 2022)",
      whenRepaid: null,
      repaidAmt: 0,
      outstanding: "50M ALGO total",
      status: "ACTIVE R7",
      notes: "MASSIVE decrease - 109M repaid/written off?"
    }
  ],

  marketMakingEntries: [
    {
      borrower: "Market Makers (unspecified)",
      originalAmount: "18.5M ALGO",
      whenMade: "R1 (Nov 2019)",
      whenRepaid: null,
      repaidAmt: 0,
      outstanding: "18.5M ALGO",
      status: "ACTIVE R1",
      notes: "27 exchanges, 60 pairs"
    },
    {
      borrower: "Market Makers - Increase",
      originalAmount: "+0.2M ALGO",
      whenMade: "R2 (Jan 2020)",
      whenRepaid: null,
      repaidAmt: 0,
      outstanding: "18.7M ALGO total",
      status: "ACTIVE R2",
      notes: "29 exchanges, 63 pairs"
    },
    {
      borrower: "Market Makers (no change)",
      originalAmount: null,
      whenMade: "R3 (Apr 2020)",
      whenRepaid: null,
      repaidAmt: 0,
      outstanding: "18.7M ALGO total",
      status: "ACTIVE R3",
      notes: "37 exchanges, 80 pairs"
    },
    {
      borrower: "Market Makers (no change)",
      originalAmount: null,
      whenMade: "R4 (Jul 2020)",
      whenRepaid: null,
      repaidAmt: 0,
      outstanding: "18.7M ALGO total",
      status: "ACTIVE R4",
      notes: "47 exchanges, 100 pairs"
    },
    {
      borrower: "Market Makers (no change)",
      originalAmount: null,
      whenMade: "R5 (Oct 2020)",
      whenRepaid: null,
      repaidAmt: 0,
      outstanding: "18.7M ALGO total",
      status: "ACTIVE R5",
      notes: "58 exchanges, 120 pairs"
    },
    {
      borrower: "Market Makers - INCREASE",
      originalAmount: "+22.6M ALGO",
      whenMade: "R6 (Apr 2021)",
      whenRepaid: null,
      repaidAmt: 0,
      outstanding: "41.3M ALGO total",
      status: "ACTIVE R6",
      notes: "More than doubled; 50+ exchanges"
    },
    {
      borrower: "Market Makers - INCREASE",
      originalAmount: "+33.7M ALGO",
      whenMade: "R7 (Jun 2022)",
      whenRepaid: null,
      repaidAmt: 0,
      outstanding: "75M ALGO total",
      status: "ACTIVE R7",
      notes: "50+ exchanges, 100+ pairs"
    }
  ],

  totals: {
    totalLending: "165.6M ALGO",
    totalMarketMaking: "18.7M ALGO",
    lendingStatus: "ACTIVE",
    marketMakingStatus: "ACTIVE",
    lendingNotes: "No repayments reported",
    marketMakingNotes: "Will be returned at engagement completion"
  },

  transparencyGaps: [
    "NO individual borrower names disclosed",
    "NO loan terms disclosed (duration, interest, collateral)",
    "NO breakdown of how many separate loans",
    "Only aggregate totals provided"
  ]
};

// Helper functions
export const getTotalLendingOutstanding = (): number => {
  return 50000000; // 50M ALGO as of R7
};

export const getTotalMarketMakingOutstanding = (): number => {
  return 75000000; // 75M ALGO as of R7
};

export const getTotalLoansOutstanding = (): number => {
  return getTotalLendingOutstanding() + getTotalMarketMakingOutstanding();
};
