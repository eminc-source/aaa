// Loans Tracking Data
// R8 is FIRST report to disclose loan details

export interface LoanEntry {
  borrower: string;
  originalAmount: string;
  whenMade: string;
  whenRepaid: string;
  repaidAmt: string;
  outstanding: string;
  status: 'REPAID' | 'FULLY REPAID' | 'ACTIVE' | 'CONVERTIBLE' | 'MATURED' | 'CLAIM ONLY' | 'NO UPDATE';
  statusReport?: string;
  notes: string;
}

export const loansData: LoanEntry[] = [
  {
    borrower: "Algorand Inc - Loan 1",
    originalAmount: "~62.5M ALGO",
    whenMade: "Unknown",
    whenRepaid: "R8 (Oct 22-Mar 23)",
    repaidAmt: "62.5M",
    outstanding: "0",
    status: "REPAID",
    statusReport: "R8",
    notes: ""
  },
  {
    borrower: "Algorand Inc - Loan 2",
    originalAmount: "~62.5M ALGO",
    whenMade: "Unknown",
    whenRepaid: "R8 (Oct 22-Mar 23)",
    repaidAmt: "62.5M",
    outstanding: "0",
    status: "REPAID",
    statusReport: "R8",
    notes: ""
  },
  {
    borrower: "Astronaut",
    originalAmount: "50M ALGO",
    whenMade: "Unknown",
    whenRepaid: "R9 (Apr-Jun 23)",
    repaidAmt: "50M",
    outstanding: "0",
    status: "FULLY REPAID",
    statusReport: "R9",
    notes: "No loss incurred"
  },
  {
    borrower: "Strategic Partners (R6)",
    originalAmount: "50M ALGO",
    whenMade: "R6 (Oct 21-Mar 22)",
    whenRepaid: "???",
    repaidAmt: "Unknown",
    outstanding: "Unknown",
    status: "NO UPDATE",
    statusReport: "R18",
    notes: "DeFi 1-year horizon - 3+ YEARS!"
  },
  {
    borrower: "Strategic Partners (R7)",
    originalAmount: "120M ALGO",
    whenMade: "R7 (Apr-Sep 22)",
    whenRepaid: "???",
    repaidAmt: "Unknown",
    outstanding: "Unknown",
    status: "NO UPDATE",
    statusReport: "R18",
    notes: "Who are these? 3+ YEARS!"
  },
  {
    borrower: "3AC (OTC breach)",
    originalAmount: ">$50M USD",
    whenMade: "Q4 2021",
    whenRepaid: "N/A - CLAIM",
    repaidAmt: "$0",
    outstanding: ">$50M",
    status: "CLAIM ONLY",
    notes: "Marked to zero"
  },
  {
    borrower: "Napster Foundation",
    originalAmount: "574K ALGO",
    whenMade: "R9 (Q2 2023)",
    whenRepaid: "R16 (Q1 2025)",
    repaidAmt: "FULL (in USDC)",
    outstanding: "0",
    status: "REPAID",
    statusReport: "R16",
    notes: "Loan was 574K ALGO, repaid in USDC (amt not specified)"
  },
  {
    borrower: "Pera Wallet - Loan 1 (ALGO)",
    originalAmount: "~1M ALGO",
    whenMade: "R10 (Q3 2023)",
    whenRepaid: "-",
    repaidAmt: "0",
    outstanding: "~1M ALGO",
    status: "ACTIVE",
    notes: "Part of support package"
  },
  {
    borrower: "Pera Wallet - Loan 2 (ALGO)",
    originalAmount: "~1.26M ALGO",
    whenMade: "R13 (Q2 2024)",
    whenRepaid: "-",
    repaidAmt: "0",
    outstanding: "~1.26M ALGO",
    status: "ACTIVE",
    notes: "Additional support"
  },
  {
    borrower: "Pera Wallet - Loan 3 (ALGO)",
    originalAmount: "~1.1M ALGO",
    whenMade: "R14 (Q3 2024)",
    whenRepaid: "-",
    repaidAmt: "0",
    outstanding: "~1.1M ALGO",
    status: "ACTIVE",
    notes: "Ongoing support"
  },
  {
    borrower: "Pera Wallet - Loan 4 (USD)",
    originalAmount: "$297K USD",
    whenMade: "R14 (Q3 2024)",
    whenRepaid: "-",
    repaidAmt: "0",
    outstanding: "$297K USD",
    status: "ACTIVE",
    notes: "USD support"
  },
  {
    borrower: "Pera Wallet - Loan 5 (USD)",
    originalAmount: "$245K USD",
    whenMade: "R16 (Q1 2025)",
    whenRepaid: "-",
    repaidAmt: "0",
    outstanding: "$245K USD",
    status: "ACTIVE",
    notes: "Increase to existing"
  },
  {
    borrower: "Pera Wallet - Loan 6 (USD)",
    originalAmount: "$325K USD",
    whenMade: "R17 (Q2 2025)",
    whenRepaid: "-",
    repaidAmt: "0",
    outstanding: "$325K USD",
    status: "ACTIVE",
    notes: "Pera Card development"
  },
  {
    borrower: "ANote Music",
    originalAmount: "~0.5M ALGO",
    whenMade: "R10 (Q3 2023)",
    whenRepaid: "-",
    repaidAmt: "0",
    outstanding: "~0.5M ALGO",
    status: "CONVERTIBLE",
    notes: "May convert to equity"
  },
  {
    borrower: "PlanetWatch",
    originalAmount: "~0.5M ALGO",
    whenMade: "R10 (Q3 2023)",
    whenRepaid: "R12 (Q1 2024)",
    repaidAmt: "FULL",
    outstanding: "0",
    status: "REPAID",
    statusReport: "R12",
    notes: "Par + accrued interest"
  },
  {
    borrower: "DWF Labs",
    originalAmount: "75M ALGO",
    whenMade: "R11 (Q4 2023)",
    whenRepaid: "R15 (Q4 2024)",
    repaidAmt: "75M ALGO",
    outstanding: "0",
    status: "FULLY REPAID",
    statusReport: "R15",
    notes: "Matured after 1 year"
  },
  {
    borrower: "CoinShares ETP",
    originalAmount: "15M ALGO",
    whenMade: "R7 (2022)",
    whenRepaid: "R15 (Q4 2024)",
    repaidAmt: "15M ALGO",
    outstanding: "0",
    status: "MATURED",
    statusReport: "R15",
    notes: "Investment returned"
  },
  {
    borrower: "Lofty",
    originalAmount: "500K USDC",
    whenMade: "R16 (Q1 2025)",
    whenRepaid: "-",
    repaidAmt: "0",
    outstanding: "500K USDC",
    status: "ACTIVE",
    notes: "Secondary market liquidity"
  },
  {
    borrower: "XBTO Market Maker",
    originalAmount: "25M ALGO",
    whenMade: "R18 (Q3 2025)",
    whenRepaid: "-",
    repaidAmt: "0",
    outstanding: "25M ALGO",
    status: "ACTIVE",
    notes: "Market-making liquidity"
  },
  {
    borrower: "Folks Finance Liquidity",
    originalAmount: "25M ALGO",
    whenMade: "R18 (Q3 2025)",
    whenRepaid: "-",
    repaidAmt: "0",
    outstanding: "25M ALGO",
    status: "ACTIVE",
    notes: "Lending pool addition"
  }
];

// Status color mapping
export const statusColors: Record<LoanEntry['status'], string> = {
  'REPAID': '#90EE90',        // Light green
  'FULLY REPAID': '#32CD32',  // Lime green
  'ACTIVE': '#87CEEB',        // Light blue
  'CONVERTIBLE': '#FFD700',   // Gold
  'MATURED': '#98FB98',       // Pale green
  'CLAIM ONLY': '#FFB6C1',    // Light pink
  'NO UPDATE': '#FFA07A'      // Light salmon/orange
};
