// Flags Data - Issues identified that need explanation or further investigation

export type Severity = 'HIGH' | 'MEDIUM' | 'LOW' | 'RESOLVED';

export interface FlagEntry {
  issueNum: number;
  category: string;
  description: string;
  severity: Severity;
}

export const flagsData: FlagEntry[] = [
  // RED FLAGS (HIGH severity - unresolved)
  { issueNum: 1, category: "R8 Reconciliation", description: "~46-97M ALGO discrepancy between calculated and reported closing balance", severity: "HIGH" },
  { issueNum: 2, category: "Loans", description: "170M 'strategic partner loans' (R6+R7) - NO UPDATE IN 3+ YEARS (R16)", severity: "HIGH" },
  { issueNum: 3, category: "Loans", description: "Algorand Inc loans (125M) - when made? Why did Inc need Foundation loans?", severity: "MEDIUM" },
  { issueNum: 4, category: "Loans RESOLVED", description: "Astronaut loan (50M) - FULLY REPAID in R9, no loss incurred ✓", severity: "RESOLVED" },
  { issueNum: 5, category: "Format Change", description: "CFO admits previous categories 'not well delineated' and not 'transparent expenditure windows'", severity: "HIGH" },
  { issueNum: 6, category: "Fiat Spending", description: "R8 fiat ($14.7M) is 79% lower than R7 ($71M) - real reduction or accounting change?", severity: "MEDIUM" },
  { issueNum: 7, category: "Marketing", description: "Marketing collapsed 93%: $22.2M (R7) → $1.5M (R8) - what changed?", severity: "MEDIUM" },
  { issueNum: 8, category: "Crypto Losses", description: "Hodlnaut ($35M) + 3AC ($50M+) + FTX ($1M) = $86M+ still unresolved", severity: "HIGH" },
  { issueNum: 9, category: "Balance Sheet", description: "R5: Endowment dropped 94M but only 76.45M OTC reported. 17.55M missing.", severity: "HIGH" },
  { issueNum: 10, category: "Balance Sheet", description: "R6: Endowment dropped 43M with no explained distribution", severity: "HIGH" },
  { issueNum: 11, category: "Balance Sheet", description: "R7: Endowment INCREASED 12.38M despite 16.5M selling", severity: "HIGH" },
  { issueNum: 12, category: "Balance Sheet", description: "R8+: No longer reports individual pool balances - just total holdings", severity: "MEDIUM" },
  { issueNum: 13, category: "Transparency", description: "Research and Social Good (200M) - NEVER distributed, merged and hidden", severity: "HIGH" },
  { issueNum: 14, category: "Transparency", description: "R6+ consolidated 8 pools into 3, R8 shows only total - harder to track", severity: "HIGH" },
  { issueNum: 15, category: "Fiat", description: "R1-R3 had NO fiat disclosure - unknown costs during those periods", severity: "MEDIUM" },
  { issueNum: 16, category: "Line Items RESOLVED", description: "OTC Sales returned R9+R10 via DWF Labs deal (473.7M total) ✓", severity: "RESOLVED" },
  { issueNum: 17, category: "Line Items", description: "Ambassadors reported R2-R4 then disappeared", severity: "LOW" },
  { issueNum: 18, category: "R11 ARRINGTON", description: "Arrington Capital fund COLLAPSED - 50M ALGO invested, only 2.7M returned!", severity: "HIGH" },
  { issueNum: 19, category: "R11 ARRINGTON", description: "$62.8M USD WRITE-OFF - 'Fund did not make meaningful investments'", severity: "HIGH" },
  { issueNum: 20, category: "R11 Borderless", description: "37.5M ALGO in Borderless Capital fund - same risk as Arrington?", severity: "HIGH" },
  { issueNum: 21, category: "R12 POSITIVE", description: "PlanetWatch loan FULLY REPAID at par + interest ✓", severity: "RESOLVED" },
  { issueNum: 22, category: "R13 POSITIVE", description: "5-year anniversary: 2B transactions, 5,716 TPS record ✓", severity: "RESOLVED" },
  { issueNum: 23, category: "R15 POSITIVE", description: "✓ DWF Labs 75M ALGO loan FULLY REPAID", severity: "RESOLVED" },
  { issueNum: 24, category: "R15 POSITIVE", description: "✓ CoinShares ETP 15M ALGO investment RETURNED", severity: "RESOLVED" },
  { issueNum: 25, category: "🎯 R16 STAKING", description: "STAKING REWARDS LAUNCHED - First 10.5M ALGO distributed", severity: "RESOLVED" },
  { issueNum: 26, category: "🎯 R16 STAKING", description: "Online validators +155%; Community stake 460M→1.02B (+121%)", severity: "RESOLVED" },
  { issueNum: 27, category: "🎯 R16 STAKING", description: "Highest level of decentralization in Algorand history", severity: "RESOLVED" },
  { issueNum: 28, category: "R16 POSITIVE", description: "✓ Napster 574K ALGO loan FULLY REPAID (in USDC)", severity: "RESOLVED" },
  { issueNum: 29, category: "R16 POSITIVE", description: "AlgoKit 3.0 + TypeScript + New Developer Portal ✓", severity: "RESOLVED" },
  { issueNum: 30, category: "R16 POSITIVE", description: "Pera Wallet NOW FULLY OPEN SOURCE ✓", severity: "RESOLVED" },
  { issueNum: 31, category: "R16 POSITIVE", description: "HesabPay: World's largest humanitarian platform on public blockchain ✓", severity: "RESOLVED" },
  { issueNum: 32, category: "R16 POSITIVE", description: "YouTube subs +66K (+828%) ✓", severity: "RESOLVED" },
  { issueNum: 33, category: "R16 Selling", description: "174M ALGO structured selling - HIGHEST EVER", severity: "MEDIUM" },
  { issueNum: 34, category: "R16 Loans", description: "Pera total exposure now ~3.36M ALGO + $542K USD (5 loans)", severity: "MEDIUM" },
  { issueNum: 35, category: "R16 Loans", description: "NEW: Lofty 500K USDC loan for secondary market liquidity", severity: "MEDIUM" },
  { issueNum: 36, category: "🎯 R17 MILESTONE", description: "3 BILLION TRANSACTIONS milestone reached (May 2025)", severity: "RESOLVED" },
  { issueNum: 37, category: "🎯 R17 STAKING", description: "Staking rewards +79%: 18.8M ALGO (up from 10.5M in R16)", severity: "RESOLVED" },
  { issueNum: 38, category: "🎯 R17 STAKING", description: "1.95B ALGO staked (+28.7%); Community stake +51%", severity: "RESOLVED" },
  { issueNum: 39, category: "🎯 R17 STAKING", description: "Foundation stake -17% = Decentralization accelerating", severity: "RESOLVED" },
  { issueNum: 40, category: "🎯 R17 PERA CARD", description: "Pera Card beta LIVE in 5 countries (UK, DE, IT, ES, NZ)", severity: "RESOLVED" },
  { issueNum: 41, category: "🎯 R17 BINANCE", description: "Binance soft staking - only 10 assets supported globally!", severity: "RESOLVED" },
  { issueNum: 42, category: "🎯 R17 INTEGRATION", description: "Wormhole NTT, Crypto.com, Bitrue, AeonPay (20M merchants)", severity: "RESOLVED" },
  { issueNum: 43, category: "🎯 R17 TOKENIZATION", description: "Midas mTBILL: Tokenized US Treasury ETF launched", severity: "RESOLVED" },
  { issueNum: 44, category: "R17 Selling", description: "Structured selling DOWN to 63M (from 174M in R16)", severity: "MEDIUM" },
  { issueNum: 45, category: "R17 Loans", description: "Pera +$325K USD - now 6 loans totaling ~3.36M ALGO + $867K USD", severity: "MEDIUM" },
  { issueNum: 46, category: "🎯 R18 ALGOLAND", description: "Algoland campaign: 650% wallet downloads, 1,500% new wallets first week", severity: "RESOLVED" },
  { issueNum: 47, category: "🎯 R18 INTERMEZZO", description: "Enterprise KMS launched with World Chess - 350K transactions first month", severity: "RESOLVED" },
  { issueNum: 48, category: "🎯 R18 POST-QUANTUM", description: "Falcon signature Go bindings + PoC Lsig for quantum-resistant accounts", severity: "RESOLVED" },
  { issueNum: 49, category: "🎯 R18 ALLBRIDGE", description: "Allbridge integration: Native USDC bridging to 14 chains", severity: "RESOLVED" },
  { issueNum: 50, category: "🎯 R18 DEVS", description: "390+ open-source developers - ALL-TIME HIGH", severity: "RESOLVED" },
  { issueNum: 51, category: "🎯 R18 TVL", description: "TVL +18.4% to $167M; RWA TVL +16.5% to $106M", severity: "RESOLVED" },
  { issueNum: 52, category: "🎯 R18 HACKATHONS", description: "1,016 registrants, 139 projects, Bolt.new sponsor", severity: "RESOLVED" },
  { issueNum: 53, category: "🎯 R18 INDIA", description: "NASSCOM course: 1,600 devs; 87 Blockchain Clubs", severity: "RESOLVED" },
  { issueNum: 54, category: "🎯 R18 IMPACT", description: "HesabPay: 56K refugee families, $16M+ aid; Syria $500K+", severity: "RESOLVED" },
  { issueNum: 55, category: "R18 Selling", description: "Structured selling UP to 78M (from 63M in R17)", severity: "MEDIUM" },
  { issueNum: 56, category: "R18 Loans", description: "XBTO 25M ALGO + Folks Finance 25M ALGO = 50M ALGO new loans", severity: "MEDIUM" },
  { issueNum: 57, category: "R18 Staking", description: "Community stake now 80%, Foundation 20% = Strong decentralization", severity: "RESOLVED" }
];

// Separate flags by severity
export const redFlags = flagsData.filter(f => f.severity === 'HIGH');
export const yellowFlags = flagsData.filter(f => f.severity === 'MEDIUM');
export const greenFlags = flagsData.filter(f => f.severity === 'RESOLVED');
export const lowFlags = flagsData.filter(f => f.severity === 'LOW');

// Severity colors
export const severityColors: Record<Severity, string> = {
  'HIGH': '#ff6b6b',      // Red
  'MEDIUM': '#ffd93d',    // Yellow
  'LOW': '#6bcfff',       // Light blue
  'RESOLVED': '#6bff8e'   // Green
};

// Stats
export const flagStats = {
  total: flagsData.length,
  high: redFlags.length,
  medium: yellowFlags.length,
  low: lowFlags.length,
  resolved: greenFlags.length
};
