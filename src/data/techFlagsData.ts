// Algorand Technologies Inc - Flags Data
// Issues identified from transparency reports R1-R7

export type TechSeverity = 'HIGH' | 'INFO';

export interface TechFlagEntry {
  issueNum: number;
  category: string;
  observation: string;
  severity: TechSeverity;
}

export const techFlagsData: TechFlagEntry[] = [
  { issueNum: 1, category: "R1 Holdings", observation: "Started with 2B ALGO, earned to 2.027B from rewards", severity: "INFO" },
  { issueNum: 2, category: "R1-R7 Transparency", observation: "NEVER disclosed individual loan counterparties", severity: "HIGH" },
  { issueNum: 3, category: "R2 Equity", observation: "Equity investments jumped 8.4M → 52M (+43.6M)", severity: "INFO" },
  { issueNum: 4, category: "R2 Lending", observation: "Lending more than doubled: 52.5M → 116M (+63.5M)", severity: "HIGH" },
  { issueNum: 5, category: "R3 FIRST SALES", observation: "FIRST SALES: 21M ALGO sold (0.55% volume)", severity: "HIGH" },
  { issueNum: 6, category: "R3-R5 Pattern", observation: "Financial ecosystem FLAT at 184.4M for 3 reports", severity: "INFO" },
  { issueNum: 7, category: "R6 Market Making", observation: "MM more than doubled: 18.7M → 41.3M (+22.6M)", severity: "HIGH" },
  { issueNum: 8, category: "R6 Rules Change", observation: "Selling rules tightened: 5%→1.5% vol, 10%→5% trigger", severity: "INFO" },
  { issueNum: 9, category: "R7 Venture Funds", observation: "NEW: 1.15B ALGO to Borderless, Hivemind, Arrington, Skybridge", severity: "HIGH" },
  { issueNum: 10, category: "R7 TRANSPARENCY GAP", observation: "Source of 1.15B venture funds NOT EXPLAINED - where did it come from?", severity: "HIGH" },
  { issueNum: 11, category: "R7 Math Problem", observation: "Holdings dropped 356M but claimed 1.15B to VCs + 150M sales - doesn't add up", severity: "HIGH" },
  { issueNum: 12, category: "R7 Borderless ?", observation: "Is Borderless 159.1M from R6 part of 1.15B or separate? Not clarified", severity: "HIGH" },
  { issueNum: 13, category: "R7 Lending DROP", observation: "Lending CRASHED: 159.1M → 50M (-109.1M) - no explanation", severity: "HIGH" },
  { issueNum: 14, category: "R7 Market Making", observation: "MM increased again: 41.3M → 75M (+33.7M)", severity: "INFO" },
  { issueNum: 15, category: "R7 Mkt Development", observation: "Market Development exploded: 6M → 213M (+207M)", severity: "HIGH" },
  { issueNum: 16, category: "R7 Sales", observation: "Sales: 150M ALGO over 14 months (0.18% volume)", severity: "HIGH" },
  { issueNum: 17, category: "R7 FINAL", observation: "This is the FINAL Algorand Inc transparency report", severity: "HIGH" },
  { issueNum: 18, category: "Total Sales", observation: "Cumulative sales R1-R7: 288.6M ALGO", severity: "INFO" },
  { issueNum: 19, category: "Holdings Change", observation: "Holdings: 2.027B → 1.691B (-336M over 3 years)", severity: "INFO" },
  { issueNum: 20, category: "Structure Change", observation: "R7 completely restructured reporting - hard to trace token flows", severity: "HIGH" },
];

// Calculate flag stats
export const getTechFlagStats = () => {
  const high = techFlagsData.filter(f => f.severity === 'HIGH').length;
  const info = techFlagsData.filter(f => f.severity === 'INFO').length;
  return {
    high,
    info,
    total: techFlagsData.length
  };
};
