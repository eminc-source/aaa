import { TransparencyReport } from '../types/foundation';

export const foundationReports: TransparencyReport[] = [
  {
    reportNumber: 1,
    period: "Jun 19 - Nov 1, 2019",
    duration: "4.5 mo",
    reportDate: "Nov 2019",
    algoDistributed: 440000000,
    fiatUSD: null,
    balanceSheet: "NO",
    keyChanges: "First report",
    details: {
      distributions: [
        { category: "Participation Rewards", amount: "96M ALGO", notes: "All holders proportional" },
        { category: "Node Runner Vesting", amount: "330M ALGO", notes: "~3.2M/day for 102 days" },
        { category: "Auction Sales", amount: "25M ALGO", notes: "First auction" },
        { category: "Early Redemption Returns", amount: "-19.9M ALGO", notes: "Returned by buyers" },
        { category: "Tokens Burnt", amount: "20.5M ALGO", notes: "Redeemed + rewards" },
        { category: "Board Compensation", amount: "75K ALGO", notes: "Baseline" }
      ],
      disclosures: [
        { label: "Fiat Expenses", value: "NOT REPORTED" },
        { label: "Balance Sheet", value: "NOT PROVIDED" }
      ],
      keyEvents: [
        "Foundation stake: 500M ALGO participating in consensus",
        "Foundation has NOT SOLD any of its 500M endowment",
        "Node vesting SUSPENDED Oct 1, 2019 per EIP vote"
      ]
    }
  },
  {
    reportNumber: 2,
    period: "Nov 2, 2019 - Feb 10, 2020",
    duration: "3 mo",
    reportDate: "Feb 2020",
    algoDistributed: 126000000,
    fiatUSD: null,
    balanceSheet: "NO",
    keyChanges: "Node vesting suspended",
    details: {
      distributions: [
        { category: "Participation Rewards", amount: "101M ALGO", notes: "Up from 96M" },
        { category: "Node Runner Vesting", amount: "7.4M ALGO", notes: "DOWN 98% - suspended" },
        { category: "Structured Selling", amount: "17M ALGO", notes: "NEW - replaced auctions" },
        { category: "Board Compensation", amount: "125K ALGO", notes: "Up 67%" },
        { category: "Ambassadors", amount: "312K ALGO", notes: "NEW - split from Other" }
      ],
      disclosures: [
        { label: "Fiat Expenses", value: "NOT REPORTED" },
        { label: "Balance Sheet", value: "NOT PROVIDED" }
      ],
      keyEvents: [
        "Auction program ENDED",
        "Node vesting SUSPENDED Nov 2 - Dec 31, 2019",
        "Node vesting RESTARTED Jan 1, 2020 at 3% rate",
        "Forward commitment: Max 150M ALGO sales in 2020"
      ]
    }
  },
  {
    reportNumber: 3,
    period: "Feb 11 - Sep 30, 2020",
    duration: "7.5 mo",
    reportDate: "Oct 2020",
    algoDistributed: 549100000,
    fiatUSD: null,
    balanceSheet: "NO",
    keyChanges: "Added grants, R&D",
    details: {
      distributions: [
        { category: "Participation Rewards", amount: "124.7M ALGO", notes: "Up from 101M" },
        { category: "Node Runner Vesting", amount: "191.4M ALGO", notes: "Resumed" },
        { category: "200M Staking Program", amount: "100M ALGO", notes: "NEW" },
        { category: "Structured Selling", amount: "69.4M ALGO", notes: "Up from 17M" },
        { category: "Algorand Inc R&D", amount: "50.2M ALGO", notes: "NEW - 2019 work" },
        { category: "AlgoGrant Program", amount: "7.8M ALGO", notes: "NEW" },
        { category: "Board Compensation", amount: "200K ALGO", notes: "Up 60%" },
        { category: "Ambassadors", amount: "5.4M ALGO", notes: "Up from 312K" }
      ],
      disclosures: [
        { label: "Fiat Expenses", value: "NOT REPORTED" },
        { label: "Balance Sheet", value: "NOT PROVIDED" }
      ],
      keyEvents: [
        "COVID-19 'Black Thursday' impact noted",
        "Category structure changed - harder to compare"
      ]
    }
  },
  {
    reportNumber: 4,
    period: "Oct 1, 2020 - Mar 31, 2021",
    duration: "6 mo",
    reportDate: "Apr 2021",
    algoDistributed: 1640000000,
    fiatUSD: 17200000,
    balanceSheet: "YES - First",
    keyChanges: "1B accelerated vesting",
    details: {
      distributions: [
        { category: "Participation Rewards", amount: "135.49M ALGO" },
        { category: "EB/RN Base Vesting", amount: "64.68M ALGO", notes: "Per EIP schedule" },
        { category: "EB/RN Accelerated Vesting", amount: "1.003B ALGO", notes: "NEW - Price surge triggered" },
        { category: "200M Staking", amount: "50M ALGO" },
        { category: "Algorand Inc R&D", amount: "30M ALGO", notes: "H2 2020" },
        { category: "Algorand Inc 8-Year", amount: "300M ALGO", notes: "NEW - One-time transfer" },
        { category: "Structured Selling", amount: "45.3M ALGO", notes: "Down from 69.4M" },
        { category: "Grants & Awards", amount: "16.68M ALGO", notes: "Up from 7.8M" },
        { category: "Board Compensation", amount: "395K ALGO", notes: "Up 98%" }
      ],
      disclosures: [
        { label: "Fiat Expenses", value: "$17.2M - FIRST TIME DISCLOSED" },
        { label: "- Grants", value: "$2.5M" },
        { label: "- Marketing", value: "$0.4M" },
        { label: "- Operations", value: "$14.3M" },
        { label: "Balance Sheet", value: "YES - FIRST TIME (8 separate pools)" }
      ],
      keyEvents: [
        "LTAD published Dec 9, 2020",
        "Market cap increased 5x"
      ]
    }
  },
  {
    reportNumber: 5,
    period: "Apr 1 - Sep 30, 2021",
    duration: "6 mo",
    reportDate: "Oct 2021",
    algoDistributed: 1410000000,
    fiatUSD: 27300000,
    balanceSheet: "YES",
    keyChanges: "Vesting completed",
    details: {
      distributions: [
        { category: "Participation Rewards", amount: "154.9M ALGO", notes: "Up from 135.5M" },
        { category: "EB/RN Base Vesting", amount: "94.55M ALGO" },
        { category: "EB/RN Accelerated Vesting", amount: "973M ALGO", notes: "FINAL" },
        { category: "200M Staking - FINAL", amount: "55.3M ALGO", notes: "Program ended" },
        { category: "Structured Selling", amount: "47M ALGO" },
        { category: "OTC Sales", amount: "76.45M ALGO", notes: "NEW - Only appearance" },
        { category: "Grants", amount: "7.5M ALGO" },
        { category: "University Program", amount: "38M ALGO", notes: "NEW" },
        { category: "Board Compensation", amount: "960K ALGO", notes: "Up 143%" }
      ],
      disclosures: [
        { label: "Fiat Expenses", value: "$27.3M (Up 59%)" },
        { label: "- Grants", value: "$5.9M" },
        { label: "- Marketing", value: "$0.6M" },
        { label: "- Operations", value: "$20.8M" },
        { label: "Balance Sheet", value: "YES" },
        { label: "- Endowment", value: "500M → 406M (94M decrease)" }
      ],
      keyEvents: [
        "Algorithmic Vesting COMPLETED Sep 30, 2021",
        "200M Staking Program ENDED",
        "Governance Referendum APPROVED",
        "Circulating supply definition CHANGED"
      ]
    }
  },
  {
    reportNumber: 6,
    period: "Oct 1, 2021 - Mar 31, 2022",
    duration: "6 mo",
    reportDate: "Apr 2022",
    algoDistributed: 502000000,
    fiatUSD: 54500000,
    balanceSheet: "YES - Restructured",
    keyChanges: "EB vesting ended",
    details: {
      distributions: [
        { category: "Participation Rewards", amount: "84.67M ALGO", notes: "Down 45% - ending" },
        { category: "Governance Rewards", amount: "60M ALGO", notes: "NEW - Q3 2021" },
        { category: "EB/RN Final Distributions", amount: "314M ALGO", notes: "Weekly Nov-Feb" },
        { category: "Innovation Fund", amount: "60M ALGO", notes: "NEW" },
        { category: "⚠️ LOAN: Strategic Partners (DeFi)", amount: "-50M ALGO", notes: "1yr horizon - NEVER REPAID/UPDATED" },
        { category: "Structured Selling", amount: "42.2M ALGO" },
        { category: "Grants", amount: "6.9M ALGO" },
        { category: "Board Compensation", amount: "1.227M ALGO", notes: "Up 28%" }
      ],
      disclosures: [
        { label: "Fiat Expenses", value: "$54.5M (DOUBLED)" },
        { label: "- Grants", value: "$17.4M (+195%)" },
        { label: "- Marketing", value: "$9.2M (+1,433%)" },
        { label: "- Operations", value: "$27.9M (+34%)" },
        { label: "Balance Sheet", value: "RESTRUCTURED (8 pools → 3 pools)" },
        { label: "- Endowment", value: "406M → 363M (43M decrease unexplained)" }
      ],
      keyEvents: [
        "EB vesting FULLY COMPLETED Feb 2022",
        "Participation Rewards ending May 14, 2022",
        "AlgoGrants SUNSETTED end of March",
        "Balance sheet consolidated - LESS TRANSPARENT"
      ]
    }
  },
  {
    reportNumber: 7,
    period: "Apr 1 - Sep 30, 2022",
    duration: "6 mo",
    reportDate: "Oct 2022",
    algoDistributed: 335000000,
    fiatUSD: 71000000,
    balanceSheet: "YES - Simplified",
    keyChanges: "Participation ended; Crypto crisis",
    details: {
      distributions: [
        { category: "Participation Rewards", amount: "500K ALGO", notes: "FINAL" },
        { category: "Governance Rewards", amount: "141M ALGO", notes: "Q1+Q2 2022" },
        { category: "EB/RN Final Residual", amount: "14M ALGO", notes: "Truly final" },
        { category: "⚠️ LOAN: Strategic Partners", amount: "-120M ALGO", notes: "Who are these? NEVER REPAID/UPDATED" },
        { category: "DeFi Liquidity Rewards", amount: "4M ALGO", notes: "Aeneas ending" },
        { category: "Grants", amount: "18M ALGO", notes: "Up from 6.9M" },
        { category: "Structured Selling", amount: "16.5M ALGO", notes: "Down - price halts" },
        { category: "LOAN: ETP Liquidity (CoinShares)", amount: "-15M ALGO", notes: "✓ RETURNED R15" },
        { category: "Relay Node Pilot", amount: "2.3M ALGO" },
        { category: "Board Compensation", amount: "1.072M ALGO", notes: "Slight decrease" },
        { category: "University Program", amount: "27.3M ALGO", notes: "Down from 38M" }
      ],
      disclosures: [
        { label: "Fiat Expenses", value: "$71M (Up 30%)" },
        { label: "- Grants", value: "$30.9M (+77%)" },
        { label: "- Marketing", value: "$22.2M (+141%)" },
        { label: "- Operations", value: "$17.9M (-36%)" },
        { label: "Balance Sheet - Total Holdings", value: "2,993M ALGO" },
        { label: "- Endowment", value: "363M → 375.38M (INCREASED? Unexplained)" },
        { label: "CRYPTO CRISIS - Hodlnaut", value: "~$35M (Marked to zero)" },
        { label: "CRYPTO CRISIS - 3AC Claim", value: ">$50M (OTC breach Q4 2021)" },
        { label: "CRYPTO CRISIS - FTX", value: "$1M (Post-period)" }
      ],
      keyEvents: [
        "Participation Rewards ENDED May 15",
        "Governance commitment grew 250%",
        "808 new dApps launched",
        "DeFi TVL grew 3.3x"
      ]
    }
  },
  {
    reportNumber: 8,
    period: "Oct 1, 2022 - Mar 31, 2023",
    duration: "6 mo",
    reportDate: "Apr 2023",
    algoDistributed: 242000000,
    fiatUSD: 14700000,
    balanceSheet: "NEW FORMAT",
    keyChanges: "New CFO; Complete restructure",
    details: {
      distributions: [
        { category: "Structured Selling", amount: "-101M ALGO", notes: "Via public wallets" },
        { category: "Governance Rewards (GP4+GP5)", amount: "-141M ALGO" },
        { category: "Ecosystem/xGov/DeFi/NFT", amount: "-0.2M ALGO", notes: "Small" },
        { category: "Investments (Borderless VC)", amount: "-37.5M ALGO" },
        { category: "Loan Repayment: Algorand Inc", amount: "+125M ALGO", notes: "2 loans REPAID" },
        { category: "Loan Repayment: Astronaut", amount: "+11.5M ALGO", notes: "Partial of 50M" }
      ],
      disclosures: [
        { label: "Fiat Expenses", value: "$14.7M (DOWN 79% - methodology?)" },
        { label: "- Investments & Income", value: "$0.6M" },
        { label: "- Grants/Bursaries/Bounties", value: "$7.7M" },
        { label: "- Algorand Ventures Ops", value: "$0.3M (NEW)" },
        { label: "- Business Dev & Access", value: "$0.9M (NEW)" },
        { label: "- Ecosystem Support", value: "$1.9M (NEW)" },
        { label: "- Communities", value: "$0.5M (NEW)" },
        { label: "- Marketing/Events/Partners", value: "$1.5M (Down 93%)" },
        { label: "- R&D/Education/Platform", value: "$0.6M (NEW)" },
        { label: "- Core Foundation Ops", value: "$0.7M (NEW)" },
        { label: "USD Investments", value: "$35.4M (FIRST TIME DISCLOSED)" },
        { label: "Balance Sheet - Total Holdings", value: "2,791M ALGO (Down 202M)" }
      ],
      keyEvents: [
        "New CFO joined Oct 2022",
        "Admits previous format 'not well delineated'",
        "Admits 'not transparent expenditure windows'",
        "Will be QUARTERLY going forward",
        "AlgoGrants closed end 2022",
        "Algorand Inc loans (125M) REPAID",
        "SailGP sponsorship TERMINATED",
        "ClimateRide reduced 80%",
        "100+ relay nodes renegotiated (35% savings)",
        "AlgoKit developer toolkit launched",
        "AlgoBharat India initiative launched"
      ]
    }
  },
  {
    reportNumber: 9,
    period: "Apr 1 - Jun 30, 2023",
    duration: "3 mo",
    reportDate: "Jul 2023",
    algoDistributed: 249000000,
    fiatUSD: 14100000,
    balanceSheet: "QUARTERLY",
    keyChanges: "First quarterly; DWF Labs deal",
    details: {
      distributions: [
        { category: "Structured Selling", amount: "-31M ALGO", notes: "Paused Jun 6" },
        { category: "DWF Labs OTC Sale", amount: "-132.2M ALGO", notes: "$15M received" },
        { category: "Governance Rewards (GP6)", amount: "-68.2M ALGO" },
        { category: "- General Governance", amount: "-53.2M ALGO" },
        { category: "- General DeFi Rewards", amount: "-15M ALGO" },
        { category: "Targeted DeFi Rewards", amount: "-3.75M ALGO", notes: "To 7 protocols" },
        { category: "Investments & Income", amount: "-33.1M ALGO" },
        { category: "Grants/Bursaries/Bounties", amount: "-1.9M ALGO" },
        { category: "Foundation Operations", amount: "-10.4M ALGO", notes: "Various depts" },
        { category: "DeFi Protocol Deployments", amount: "-42M ALGO", notes: "NEW - Treasury into DeFi" },
        { category: "ETP Unwind", amount: "+50M ALGO", notes: "Product unwound" },
        { category: "Loan Repayment: Astronaut", amount: "+32.9M ALGO", notes: "FULLY REPAID" },
        { category: "New Loan: Napster", amount: "-0.574M ALGO", notes: "Setup costs" }
      ],
      disclosures: [
        { label: "Fiat Expenses", value: "$14.1M (Similar to R8)" },
        { label: "- Investments & Income", value: "$0.6M" },
        { label: "- Grants/Bursaries/Bounties", value: "$0.8M" },
        { label: "- Algorand Ventures Ops", value: "$0.2M" },
        { label: "- Business Dev & Access", value: "$0.8M" },
        { label: "- Ecosystem Support", value: "$0.7M" },
        { label: "- Communities", value: "$0.6M" },
        { label: "- Marketing/Events/Partners", value: "$1.9M (Up from $1.5M)" },
        { label: "- R&D/Education/Platform", value: "$5.2M (UP significantly)" },
        { label: "- Core Foundation Ops", value: "$3.4M (UP significantly)" },
        { label: "USD Investments", value: "$97.9M (Down from $118.9M)" },
        { label: "Balance Sheet - Total Holdings", value: "2,542M ALGO (Down 249M)" }
      ],
      keyEvents: [
        "DWF Labs deal: 50M USD for ALGO",
        "Wallet consolidation: 180 → 55",
        "Foundation deployed 42M into DeFi",
        "Astronaut loan FULLY REPAID",
        "New loan to Napster Foundation",
        "xGov program launched: 4.8K xGovs, 2.1M ALGO",
        "Targeted DeFi Rewards first distributed",
        "NFT Council established",
        "Foundation increased consensus stake for security",
        "AlgoRun node software released",
        "130 community events, 14K attendees",
        "TVL up 20% to 1.1B ALGO",
        "1.2M new wallets opened"
      ]
    }
  },
  {
    reportNumber: 10,
    period: "Jul 1 - Sep 30, 2023",
    duration: "3 mo",
    reportDate: "Oct 2023",
    algoDistributed: 434000000,
    fiatUSD: 10900000,
    balanceSheet: "QUARTERLY",
    keyChanges: "DWF deal completed; Pera investment",
    details: {
      distributions: [
        { category: "DWF Labs OTC (completing deal)", amount: "-341.5M ALGO", notes: "$35M received" },
        { category: "Governance Rewards (GP7)", amount: "-54.1M ALGO" },
        { category: "- Governance", amount: "-37.9M ALGO" },
        { category: "- DeFi", amount: "-16.25M ALGO" },
        { category: "Targeted DeFi Rewards (GP8)", amount: "-7.5M ALGO", notes: "11 protocols" },
        { category: "NFT Rewards (GP8)", amount: "-0.5M ALGO", notes: "3 marketplaces" },
        { category: "Ecosystem/xGov", amount: "-8M ALGO" },
        { category: "Investments", amount: "-9.9M ALGO", notes: "8 projects" },
        { category: "Legacy Grants", amount: "-5.5M ALGO" },
        { category: "Loans Made", amount: "-2M ALGO", notes: "Pera, ANote, PlanetWatch" },
        { category: "Foundation Operations", amount: "-17.4M ALGO", notes: "Various depts" }
      ],
      disclosures: [
        { label: "Fiat Expenses", value: "$10.9M (DOWN from $14.1M)" },
        { label: "- Investments & Income", value: "$0.3M" },
        { label: "- Grants/Bursaries/Bounties", value: "$0.05M (Minimal)" },
        { label: "- Loan Originations", value: "$0.24M (NEW - Pera, ANote, PlanetWatch)" },
        { label: "- Algorand Ventures Ops", value: "$0.16M" },
        { label: "- Business Dev & Access", value: "$0.7M" },
        { label: "- Ecosystem Support", value: "$0.7M" },
        { label: "- Communities", value: "$0.5M" },
        { label: "- Marketing/Events/Partners", value: "$1.8M" },
        { label: "- R&D/Education/Platform", value: "$3.1M (Down from $5.2M)" },
        { label: "- Core Foundation Ops", value: "$3.3M" },
        { label: "USD Investments", value: "$99.2M (Up from $97.9M)" },
        { label: "Balance Sheet - Total Holdings", value: "2,108M ALGO (Down 434M)" }
      ],
      keyEvents: [
        "DWF Labs deal COMPLETED: total 473.7M ALGO for $50M",
        "Pera Wallet investment (DWF, Borderless, Arrington)",
        "New loans: Pera, ANote Music (convertible), PlanetWatch",
        "AlgoKit 2.0 announced - native Python support",
        "Revolut Learn & Earn: 613K completions",
        "xGov Term Pool 1: 2.139M segregated",
        "NFT Rewards Program launched",
        "Wallet Council formed",
        "OpenWallet Foundation membership",
        "India Advisory Committee formed",
        "TOKEN2049 Singapore presence",
        "100+ meetups, 9K attendees",
        "32.3M total wallets; 1.2B transactions"
      ]
    }
  },
  {
    reportNumber: 11,
    period: "Oct 1 - Dec 31, 2023",
    duration: "3 mo",
    reportDate: "Jan 2024",
    algoDistributed: 136000000,
    fiatUSD: 11700000,
    balanceSheet: "QUARTERLY",
    keyChanges: "Arrington Fund COLLAPSED; DWF loan",
    details: {
      distributions: [
        { category: "⚠️ ARRINGTON CAPITAL COLLAPSE", amount: "", notes: "" },
        { category: "- Original Investment", amount: "50M ALGO", notes: "@ $1.27/ALGO = $63.5M USD" },
        { category: "- Returned", amount: "2.737M ALGO + $22K", notes: "ONLY 5.5% recovered!" },
        { category: "- Illiquid SAFEs/SAFTs", amount: "$744K", notes: "To be distributed later" },
        { category: "- TOTAL WRITE-OFF", amount: "$62.8M USD", notes: "From USD Investments" },
        { category: "Governance Rewards (GP8)", amount: "-40.9M ALGO" },
        { category: "- Governance", amount: "-23.4M ALGO" },
        { category: "- DeFi", amount: "-17.5M ALGO" },
        { category: "Targeted DeFi Rewards (GP9)", amount: "-7.5M ALGO", notes: "10 protocols" },
        { category: "NFT Rewards (GP9)", amount: "-0.5M ALGO", notes: "4 marketplaces" },
        { category: "Ecosystem/xGov", amount: "-8M ALGO" },
        { category: "xGov Voting Session 1", amount: "-54K ALGO", notes: "First xGov distributions" },
        { category: "Investments", amount: "-4.6M ALGO", notes: "4 projects" },
        { category: "Investment Returns", amount: "+0.9M ALGO" },
        { category: "Legacy Grants", amount: "-3.8M ALGO" },
        { category: "DWF Labs Loan", amount: "-75M ALGO", notes: "NEW - 1 year, interest-bearing" },
        { category: "Foundation Operations", amount: "-9.5M ALGO", notes: "Various depts" }
      ],
      disclosures: [
        { label: "Fiat Expenses", value: "$11.7M (Similar to R10)" },
        { label: "- Investments & Income", value: "$0.1M" },
        { label: "- Grants/Bursaries/Bounties", value: "$0.06M (Minimal)" },
        { label: "- Loan Interest", value: "+$2K (Interest earned)" },
        { label: "- Algorand Ventures Ops", value: "$0.44M (UP from $0.16M)" },
        { label: "- Business Dev & Access", value: "$0.72M" },
        { label: "- Ecosystem Support", value: "$0.22M (DOWN from $0.7M)" },
        { label: "- Communities", value: "$0.83M (UP)" },
        { label: "- Marketing/Events/Partners", value: "$3.35M (UP - events)" },
        { label: "- R&D/Education/Platform", value: "$2.75M" },
        { label: "- Core Foundation Ops", value: "$3.19M" },
        { label: "USD Investments", value: "$37.3M (DOWN $62M from $99.2M - Arrington)" },
        { label: "Balance Sheet - Total Holdings", value: "1,972M ALGO (Down 136M)" }
      ],
      keyEvents: [
        "⚠️ Arrington Capital fund LIQUIDATED",
        "⚠️ Foundation will 'reduce or eliminate' 3rd party funds",
        "CFO Statement: 'Deeply disappointing' - 'Did not make meaningful investments'",
        "75M ALGO loan to DWF Labs drawn down",
        "Build-A-Bull hackathon: 178 projects, $200K prizes",
        "Algorand Impact Summit Delhi: UNDP partnership",
        "Python on Algorand developer preview",
        "MyAlgo Wallet shutdown Jan 30, 2024",
        "AlgoExplorer shutdown Jan 31, 2024",
        "TravelX: 1.5M NFT plane tickets this period",
        "Transactions +50% QoQ; New accounts +75% QoQ",
        "34.2M total accounts; 1.3B transactions"
      ]
    }
  },
  {
    reportNumber: 12,
    period: "Jan 1 - Mar 31, 2024",
    duration: "3 mo",
    reportDate: "Apr 2024",
    algoDistributed: 81000000,
    fiatUSD: 8600000,
    balanceSheet: "QUARTERLY",
    keyChanges: "AlgoKit 2.0 + Python; Structured selling resumed",
    details: {
      distributions: [
        { category: "Structured Selling RESUMED", amount: "-31M ALGO", notes: "First since Q2 2023" },
        { category: "Governance Rewards (GP9)", amount: "-31.2M ALGO" },
        { category: "- Governance", amount: "-13.7M ALGO" },
        { category: "- DeFi", amount: "-17.5M ALGO" },
        { category: "Targeted DeFi Rewards (GP10)", amount: "-7.5M ALGO" },
        { category: "NFT Rewards (GP10)", amount: "-0.65M ALGO", notes: "Up from 500K" },
        { category: "xGov Voting Session 2", amount: "-0.7M ALGO", notes: "Of 1.422M approved" },
        { category: "xGov Term Pool 3", amount: "-0.83M ALGO", notes: "Segregated" },
        { category: "Investments", amount: "-2.5M ALGO", notes: "Vestige, Messina, Defly" },
        { category: "Foundation Operations", amount: "-6.6M ALGO", notes: "Various depts" },
        { category: "✓ PlanetWatch Loan", amount: "FULL REPAYMENT", notes: "Par + accrued interest" }
      ],
      disclosures: [
        { label: "Fiat Expenses", value: "$8.6M (DOWN 26% from $11.7M)" },
        { label: "- Investments & Income", value: "$0.06M" },
        { label: "- Grants/Bursaries/Bounties", value: "$0.25M" },
        { label: "- Business Dev & Access", value: "$0.42M (DOWN)" },
        { label: "- Ecosystem Support", value: "$0.28M" },
        { label: "- Communities", value: "$0.47M (DOWN)" },
        { label: "- Marketing/Events/Partners", value: "$2.06M (DOWN from $3.35M)" },
        { label: "- R&D/Education/Platform", value: "$1.88M (DOWN from $2.75M)" },
        { label: "- Core Foundation Ops", value: "$3.17M (Includes AV ops now)" },
        { label: "USD Investments", value: "$37.6M (Up slightly from $37.3M)" },
        { label: "Balance Sheet - Total Holdings", value: "1,891M ALGO (Down 81M)" },
        { label: "COST REDUCTION - Relay nodes", value: "-50%" },
        { label: "COST REDUCTION - Randomness beacon", value: "-99% (brought in-house)" },
        { label: "COST REDUCTION - AlgoExplorer", value: "Ended contract (saved $65K/qtr)" }
      ],
      keyEvents: [
        "AlgoKit 2.0 + Python PRODUCTION release",
        "New CMO: Marc Vanlerberghe (ex-Google)",
        "Ryan Terribilini left; AV moved under CFO",
        "UNDP Blockchain Academy beta launched",
        "Algorand Startup Lab: 20 startups from 100+ applicants",
        "DeRec Alliance formed with Hedera",
        "Plateau State Nigeria partnership",
        "ORA project: 44M transactions in 24 hours",
        "Transactions +290% QoQ",
        "35.2M total accounts; 1.7B transactions"
      ]
    }
  },
  {
    reportNumber: 13,
    period: "Apr 1 - Jun 30, 2024",
    duration: "3 mo",
    reportDate: "Jul 2024",
    algoDistributed: 101000000,
    fiatUSD: 12500000,
    balanceSheet: "QUARTERLY",
    keyChanges: "5-YEAR ANNIVERSARY; Decipher; USDCa on Coinbase",
    details: {
      distributions: [
        { category: "🎉 5-YEAR MILESTONES", amount: "", notes: "" },
        { category: "- Total Transactions", amount: "2 BILLION", notes: "All-time" },
        { category: "- Max TPS", amount: "5,716", notes: "Top 3 blockchains" },
        { category: "- Monthly Transactions", amount: "240M", notes: "All-time high" },
        { category: "Structured Selling", amount: "-58M ALGO", notes: "Up from 31M" },
        { category: "Governance Rewards (GP10)", amount: "-21.3M ALGO" },
        { category: "Targeted DeFi (GP11)", amount: "-5.4M ALGO" },
        { category: "NFT Rewards (GP11)", amount: "-0.18M ALGO" },
        { category: "xGov Voting Session 3", amount: "-0.59M ALGO" },
        { category: "xGov Term Pool 4", amount: "-0.53M ALGO", notes: "Segregated" },
        { category: "Decipher NFT commissions", amount: "-50K ALGO", notes: "10 artists" },
        { category: "Grants/Bounties", amount: "-0.22M ALGO" },
        { category: "Loans Made", amount: "-1.26M ALGO", notes: "Pera additional" },
        { category: "Foundation Operations", amount: "-13.2M ALGO", notes: "Various depts" }
      ],
      disclosures: [
        { label: "Fiat Expenses", value: "$12.5M (UP from $8.6M - Decipher)" },
        { label: "- Investments & Income", value: "$1K" },
        { label: "- Grants/Bursaries/Bounties", value: "$0.25M" },
        { label: "- Loans", value: "$0.13M" },
        { label: "- Business Dev & Access", value: "$0.41M" },
        { label: "- Ecosystem Support", value: "$0.35M" },
        { label: "- Communities", value: "$0.26M" },
        { label: "- Marketing/Events/Partners", value: "$5.2M (Decipher)" },
        { label: "- R&D/Education/Platform", value: "$0.5M" },
        { label: "- Core Foundation Ops", value: "$5.4M" },
        { label: "USD Investments", value: "$37.8M (Unchanged)" },
        { label: "Balance Sheet - Total Holdings", value: "1,789M ALGO (Down 101M)" }
      ],
      keyEvents: [
        "🎉 Algorand 5-year anniversary",
        "Decipher Barcelona: 95% satisfaction",
        "USDCa on Coinbase (deposit/withdraw)",
        "Tether: END of new USDTa minting",
        "Nansen partnership announced",
        "New website + brand refresh",
        "Global Hackathon: IgoProtect winner",
        "Labtrace: GSK, Gates Foundation contracts",
        "xHD Wallets, Liquid Auth, DID Method released",
        "Purchased 1M EURD (Abrdn money market)",
        "MAU +11%; RWA TVL +55%",
        "Stablecoin value +15%",
        "2.1B total transactions"
      ]
    }
  },
  {
    reportNumber: 14,
    period: "Jul 1 - Sep 30, 2024",
    duration: "3 mo",
    reportDate: "Oct 2024",
    algoDistributed: 87000000,
    fiatUSD: 11200000,
    balanceSheet: "QUARTERLY",
    keyChanges: "Coinbase Learning Rewards; FNet launch; Staking prep",
    details: {
      distributions: [
        { category: "Structured Selling", amount: "-21M ALGO", notes: "Down from 58M" },
        { category: "Governance Rewards (GP11)", amount: "-21.3M ALGO" },
        { category: "Ecosystem/xGov/DeFi/NFT", amount: "-9.3M ALGO" },
        { category: "Investments", amount: "-15M ALGO" },
        { category: "Grants/Bounties", amount: "-0.3M ALGO" },
        { category: "Loans (ALGO)", amount: "-1.1M ALGO" },
        { category: "Foundation Operations", amount: "-20.8M ALGO", notes: "Various depts" },
        { category: "INVESTMENTS:", amount: "" },
        { category: "- HesabPay", amount: "+$300K", notes: "Follow-on" },
        { category: "- Cosmic Champs", amount: "$25K" },
        { category: "- 1M EURD", amount: "", notes: "Into Abrdn money market" },
        { category: "NEW LOAN: Pera", amount: "$297K USD" }
      ],
      disclosures: [
        { label: "Fiat Expenses", value: "$11.2M (Down from $12.5M)" },
        { label: "- Investments & Income", value: "$4K" },
        { label: "- Grants/Bursaries/Bounties", value: "$27K" },
        { label: "- Loans (USD)", value: "$297K (Pera)" },
        { label: "- Business Dev & Access", value: "$721K" },
        { label: "- Ecosystem Support", value: "$1.75M" },
        { label: "- Communities", value: "$338K" },
        { label: "- Marketing/Events/Partners", value: "$2.75M" },
        { label: "- R&D/Education/Platform", value: "$2.9M" },
        { label: "- Core Foundation Ops", value: "$2.4M" },
        { label: "USD Investments", value: "$38.1M (+$300K)" },
        { label: "Balance Sheet - Total Holdings", value: "1,702M ALGO (Down 87M)" }
      ],
      keyEvents: [
        "Coinbase Learning Rewards LAUNCHED",
        "- 101K+ new wallets",
        "- 3.2M on-chain transactions",
        "- 99K+ new USDC opt-ins",
        "USDCa +65% to 110M+",
        "FNet launched for Staking Rewards testing",
        "Startup Program + Incubator (14 startups)",
        "xGov Term Pool 1: 2.11M ALGO released",
        "World Chess partnership renewed",
        "Archax tokenized Abrdn EUR fund",
        "Taraba State Nigeria MoU",
        "MAU +26%; 1.3M new accounts",
        "RWA TVL +16%",
        "2.3B total transactions"
      ]
    }
  },
  {
    reportNumber: 15,
    period: "Oct 1 - Dec 31, 2024",
    duration: "3 mo",
    reportDate: "Jan 2025",
    algoDistributed: 57000000,
    fiatUSD: 10800000,
    balanceSheet: "QUARTERLY",
    keyChanges: "DWF loan REPAID; India Summit; Staking Rewards prep",
    details: {
      distributions: [
        { category: "Structured Selling", amount: "-110M ALGO", notes: "Highest since R8" },
        { category: "Governance Rewards (GP12)", amount: "-17M ALGO" },
        { category: "GP13 Targeted DeFi", amount: "-5.26M ALGO" },
        { category: "xGov distributions", amount: "-0.35M ALGO" },
        { category: "xGov Term Pools 1,2,3", amount: "-2.5M ALGO", notes: "Released" },
        { category: "AlgoGems Return", amount: "+0.1M ALGO", notes: "Unallocated NFT rewards" },
        { category: "✓ MAJOR INFLOWS:", amount: "" },
        { category: "- DWF Labs Loan Repaid", amount: "+75M ALGO", notes: "FULL REPAYMENT" },
        { category: "- CoinShares ETP Return", amount: "+15M ALGO", notes: "Investment matured" },
        { category: "- Total Returned", amount: "+90M ALGO" }
      ],
      disclosures: [
        { label: "Fiat Expenses", value: "$10.8M (Down from $11.2M)" },
        { label: "USD Investments", value: "$38.2M (+$75K)" },
        { label: "Balance Sheet - Total Holdings", value: "1,645M ALGO (Down 57M net)" },
        { label: "INVESTMENTS:", value: "" },
        { label: "- Blockshake", value: "$35K" },
        { label: "- L3 (Algo Bharat)", value: "$10K" },
        { label: "- ARVO (Algo Bharat)", value: "$10K" },
        { label: "- Automaxis (Algo Bharat)", value: "$10K" },
        { label: "- Astrix (Algo Bharat)", value: "$10K" }
      ],
      keyEvents: [
        "🎉 ALGO on ALL TOP 20 EXCHANGES - BitGet added",
        "Algorand India Summit: 300 attendees",
        "5 startups invested at Summit",
        "'Algorand Can' brand campaign",
        "74K microsite visitors; 7.5M impressions",
        "Kare Survivor Wallet pilot COMPLETED",
        "UNDP Blockchain Academy: 24K personnel",
        "Staking Rewards announced",
        "AlgoKit v3 + TypeScript released",
        "World Chess: 3K participants, 175K visitors",
        "Regional hackathons: 650 participants",
        "Pera: Downloads doubled YoY",
        "2.65B total transactions",
        "40.2M total accounts"
      ]
    }
  },
  {
    reportNumber: 16,
    period: "Jan 1 - Mar 31, 2025",
    duration: "3 mo",
    reportDate: "Apr 2025",
    algoDistributed: 211000000,
    fiatUSD: 11429000,
    balanceSheet: "QUARTERLY",
    keyChanges: "STAKING REWARDS LAUNCHED; AlgoKit 3.0; Napster repaid",
    details: {
      distributions: [
        { category: "Structured Selling", amount: "-174M ALGO", notes: "HIGHEST EVER!" },
        { category: "Governance Rewards (GP13)", amount: "-17.24M ALGO" },
        { category: "🆕 STAKING REWARDS", amount: "-10.54M ALGO", notes: "FIRST DISTRIBUTION!" },
        { category: "Business Dev & Access", amount: "-0.45M ALGO" },
        { category: "Ecosystem Support", amount: "-0.53M ALGO" },
        { category: "Communities", amount: "-0.24M ALGO" },
        { category: "Marketing/Events", amount: "-1.8M ALGO" },
        { category: "R&D/Education/Platform", amount: "-0.72M ALGO" },
        { category: "Core Foundation Ops", amount: "-5.44M ALGO" },
        { category: "Investments", amount: "-0.2M ALGO" },
        { category: "Grants/Bounties", amount: "-0.08M ALGO" },
        { category: "Ecosystem/xGov/DeFi Return", amount: "+0.27M ALGO" },
        { category: "C3 DeFi Rewards Return", amount: "+0.36M ALGO", notes: "Unallocated GP12" },
        { category: "LOANS THIS PERIOD:", amount: "" },
        { category: "- NEW: Lofty", amount: "500K USDC", notes: "Secondary market liquidity" },
        { category: "- NEW: Pera increase", amount: "$245K USD", notes: "Added to existing" },
        { category: "- ✓ NAPSTER REPAID", amount: "574K ALGO", notes: "Full repayment in USDC" }
      ],
      disclosures: [
        { label: "Fiat Expenses", value: "$11.3M (Up from $10.8M)" },
        { label: "USD Investments", value: "$38.3M (+$85K)" },
        { label: "Balance Sheet - Total Holdings", value: "1,434M ALGO (Down 211M)" },
        { label: "INVESTMENTS:", value: "" },
        { label: "- Valar Solutions", value: "$75K (P2P staking platform)" },
        { label: "- Filmlance", value: "$10K (AlgoBharat Startup Lab)" },
        { label: "- Arrington redemption", value: "+$89K (Continued drip)" }
      ],
      keyEvents: [
        "🎉 STAKING REWARDS LAUNCHED",
        "- Online validators +155%",
        "- Community stake: 460M → 1.02B ALGO (+121%)",
        "- Highest decentralization ever",
        "AlgoKit 3.0 + TypeScript released",
        "New Developer Portal launched",
        "Developer Retreat: 55 devs, 500K lines",
        "Pera Wallet NOW FULLY OPEN SOURCE",
        "Pera all-time high swap: $25M+",
        "Pera Staking Portal: 175K views",
        "NEW INTEGRATIONS: Nansen DeFi dashboard, Kiln enterprise staking, Gate.io staking, SwissBorg listing (650K users)",
        "IMPACT: HesabPay World's largest humanitarian on public blockchain, MercyCorps Syria pilot complete, UNHCR joined Humanitarian Council",
        "'Algorand Can' complete: 429K users, 250M+ X impressions",
        "Staking campaign: 87M impressions",
        "YouTube subs +66K (+828%!)",
        "2.88B total transactions; 43M total accounts"
      ]
    }
  },
  {
    reportNumber: 17,
    period: "Apr 1 - Jun 30, 2025",
    duration: "3 mo",
    reportDate: "Jul 2025",
    algoDistributed: 105000000,
    fiatUSD: 10750000,
    balanceSheet: "QUARTERLY",
    keyChanges: "3B transactions; Pera Card beta; Binance soft staking",
    details: {
      distributions: [
        { category: "Structured Selling", amount: "-63M ALGO", notes: "Down from 174M" },
        { category: "Governance Rewards (GP14)", amount: "-20.03M ALGO" },
        { category: "Staking Rewards", amount: "-18.78M ALGO", notes: "UP from 10.5M!" },
        { category: "Investments (ALGO)", amount: "-3.76M ALGO" },
        { category: "Business Dev & Access", amount: "-0.79M ALGO" },
        { category: "Ecosystem Support", amount: "-0.7M ALGO" },
        { category: "Communities", amount: "-0.27M ALGO" },
        { category: "Marketing/Events", amount: "-2.95M ALGO" },
        { category: "R&D/Education/Platform", amount: "-1.07M ALGO" },
        { category: "Core Foundation Ops", amount: "-0.98M ALGO" },
        { category: "Grants/Bounties", amount: "-0.19M ALGO" },
        { category: "xGov/DeFi", amount: "-0.06M ALGO" },
        { category: "LOANS THIS PERIOD:", amount: "" },
        { category: "- Pera increase", amount: "+$325K USD", notes: "Added to existing" },
        { category: "- Arrington redemption", amount: "+$17K", notes: "Drip continues" },
        { category: "- Tikitin returned", amount: "+$10K", notes: "Investment not completed" }
      ],
      disclosures: [
        { label: "Fiat Expenses", value: "$10.75M (Down from $11.3M)" },
        { label: "USD Investments", value: "$38.25M (-$27K)" },
        { label: "Balance Sheet - Total Holdings", value: "1,329M ALGO (Down 105M)" }
      ],
      keyEvents: [
        "🎉 STAKING MILESTONES: 1.95B ALGO staked (+28.7%), Community stake +51.0%, Foundation stake -17.0% (Decentralization!)",
        "🎉 3B TRANSACTIONS MILESTONE - Hit in May 2025",
        "Transaction volume +7.5% QoQ; 45.4M total accounts",
        "PERA CARD BETA: Live in 5 countries (UK, DE, IT, ES, NZ), Spend USDC at MasterCard merchants",
        "Universal Wallets (HD standard), Discover V3 launched",
        "On-ramp: Revolut, Blockchain.com, Coinbase",
        "NEW INTEGRATIONS: Wormhole NTT support (Native multichain), Binance soft staking (Only 10 assets!), Crypto.com USDC + staking, Bitrue USDC + staking, AeonPay: 20M+ merchants (McDonald's, Uniqlo), Midas mTBILL (Tokenized US Treasury ETF)",
        "DEVELOPER: xGov feature complete, Chess Passport whitepaper (Decentralized ID), 4-hour Python/TS workshops (797 attendees), PyCon, JSNation, React Summit (523 new contacts)",
        "EDUCATION: Blockchain Academy: 200 UN staff (3 agencies), Web3 Masterclass: 4K registrations (80% new to Algo), Algorand 2025 Accelerator (118 apps, 8 onboarded)",
        "ALGOBHARAT: Hack Series finals: 400 devs, $13K prize money, AlgoGitSquad launched",
        "MARKETING: AlgoKit campaign: 105M impressions, 21,160 AlgoKit downloads, Galxe Quest: Telegram +74%, TikTok +847%"
      ]
    }
  },
  {
    reportNumber: 18,
    period: "Jul 1 - Sep 30, 2025",
    duration: "3 mo",
    reportDate: "Oct 2025",
    algoDistributed: 154000000,
    fiatUSD: 10500000,
    balanceSheet: "QUARTERLY",
    keyChanges: "Algoland launch; XBTO 25M loan; Intermezzo live",
    details: {
      distributions: [
        { category: "Structured Selling", amount: "-78M ALGO", notes: "Up from 63M" },
        { category: "Staking Rewards", amount: "-19.98M ALGO", notes: "Stable" },
        { category: "Folks Finance Liquidity", amount: "-25M ALGO", notes: "NEW lending pool" },
        { category: "XBTO Market Maker Loan", amount: "-25M ALGO", notes: "NEW for liquidity" },
        { category: "xGov Community Funding", amount: "-149K ALGO" },
        { category: "INVESTMENTS THIS PERIOD:", amount: "" },
        { category: "- Alpha Arcade", amount: "$50K USD", notes: "Prediction market" },
        { category: "- Carret", amount: "$50K USD", notes: "Digital asset mgmt" },
        { category: "- Infrastructure sale", amount: "+$94K USD", notes: "Position sold" },
        { category: "- Tinyman/Defly write-down", amount: "-$105K USD", notes: "Token adjustments" },
        { category: "LOANS THIS PERIOD:", amount: "" },
        { category: "- XBTO Market Maker", amount: "25M ALGO", notes: "NEW - liquidity" },
        { category: "- Folks Finance", amount: "25M ALGO", notes: "Lending pool add" }
      ],
      disclosures: [
        { label: "Fiat Expenses", value: "~$10.5M (Down from $10.75M)" },
        { label: "USD Investments", value: "~$38.2M (Net -$11K)" },
        { label: "Balance Sheet - Total Holdings", value: "1,175M ALGO (Down 154M)" }
      ],
      keyEvents: [
        "🎉 ALGOLAND CAMPAIGN: 287K on-chain transactions, 34.6K wallets opted in, 25.2K referrals, 650% wallet downloads increase, 1,500% new wallet creation (First week)",
        "🎉 INTERMEZZO LAUNCHED: Enterprise KMS integration, World Chess first customer, 350K transactions first month",
        "🎉 POST-QUANTUM: Falcon signatures Go bindings, Proof-of-Concept Lsig released, Post-quantum resistant accounts",
        "🎉 INTEGRATIONS: Allbridge: USDC to 14 chains, BitGP + LCX exchanges, Uphold + Crypto.com staking",
        "PERA: Lucky Spin: +262% weekly txns, +583% downloads, Discover v3 launched, Deflex Router integrated",
        "DEVELOPER: 390+ open-source devs (ATH!), 1,200+ direct engagements, AlgoKit 3.0 workshops: 400 devs, TypeScript 1.0 preview",
        "HACKATHONS: 1,016 registrants, 527 on-site attendees, 139 projects submitted, Bolt.new sponsor: 500+ teams ($25K prizes)",
        "INDIA: NASSCOM course: 1,600 enrolled, 87 Blockchain Clubs total (+5 new), Web3 Masterclass: 1,600 signups, 300+ dev teams, 50 startups (Road to Impact)",
        "IMPACT: HesabPay: 56K refugee families (350K people), $16M+ aid distributed (Afghanistan), Syria: $500K+ payments, SEWA Health Passport: 1,500 households, Mann Deshi: First loans approved",
        "ECOSYSTEM: TVL +18.4% to $167M, RWA TVL +16.5% to $106M, 3.25B total transactions, 47.1M total accounts, Community stake: 80% / Foundation: 20%"
      ]
    }
  }
];

// Calculate cumulative totals
export const getFoundationSummary = () => {
  const totalAlgoDistributed = foundationReports.reduce(
    (sum, report) => sum + report.algoDistributed, 0
  );
  
  const totalFiatUSD = foundationReports.reduce(
    (sum, report) => sum + (report.fiatUSD || 0), 0
  );

  return {
    totalReports: foundationReports.length,
    totalAlgoDistributed,
    totalFiatUSD,
    latestReportDate: foundationReports[foundationReports.length - 1].reportDate,
    reports: foundationReports
  };
};
