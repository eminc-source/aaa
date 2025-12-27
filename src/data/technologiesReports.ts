import { TransparencyReport } from '../types/foundation';

export const technologiesReports: TransparencyReport[] = [
  {
    reportNumber: 1,
    period: "Jun 19 - Nov 1, 2019",
    duration: "4.5 mo",
    reportDate: "Nov 2019",
    totalHoldings: 2027000000,
    incentivesTotal: 111200000,
    algoDistributed: 111200000,
    fiatUSD: 71000000,
    balanceSheet: "NO",
    keyChanges: "Network launch; Algo Capital 100M investment"
  },
  {
    reportNumber: 2,
    period: "Nov 7, 2019 - Jan 9, 2020",
    duration: "2 mo",
    reportDate: "Jan 2020",
    totalHoldings: 2016000000,
    incentivesTotal: 155000000,
    algoDistributed: 155000000,
    fiatUSD: 135000000,
    balanceSheet: "NO",
    keyChanges: "Equity investments +43.6M; Lending +63.5M"
  },
  {
    reportNumber: 3,
    period: "Jan 10 - Apr 30, 2020",
    duration: "4 mo",
    reportDate: "Apr 2020",
    totalHoldings: 2024000000,
    incentivesTotal: 164000000,
    algoDistributed: 164000000,
    fiatUSD: 184400000,
    balanceSheet: "NO",
    keyChanges: "Algo Capital → Borderless Capital; FIRST SALES 21M ALGO; 0.55% of exchange volume"
  },
  {
    reportNumber: 4,
    period: "May 1 - Jul 31, 2020",
    duration: "3 mo",
    reportDate: "Jul 2020",
    totalHoldings: 2019000000,
    incentivesTotal: 184000000,
    algoDistributed: 184000000,
    fiatUSD: 184400000,
    balanceSheet: "NO",
    keyChanges: "Borderless +10M; Equity 0M; Sales 36M; Initial ecosystem FLAT; 0.24% volume"
  },
  {
    reportNumber: 5,
    period: "Aug 1 - Oct 31, 2020",
    duration: "3 mo",
    reportDate: "Oct 2020",
    totalHoldings: 2009000000,
    incentivesTotal: 192000000,
    algoDistributed: 192000000,
    fiatUSD: 184400000,
    balanceSheet: "NO",
    keyChanges: "Sales 26M; Borderless +2M; Equity +4M; Initial ecosystem FLAT; 0.24% volume"
  },
  {
    reportNumber: 6,
    period: "Nov 1, 2020 - Apr 30, 2021",
    duration: "6 mo",
    reportDate: "Apr 2021",
    totalHoldings: 2047000000,
    incentivesTotal: 240500000,
    algoDistributed: 240500000,
    fiatUSD: 201000000,
    balanceSheet: "NO",
    keyChanges: "Borderless +44M; MM +22.6M; Lending -6.5M; Sales 72M; BIGGEST sales period; MM doubled"
  },
  {
    reportNumber: 7,
    period: "May 1, 2021 - Jun 30, 2022",
    duration: "14 mo",
    reportDate: "Jun 2022",
    totalHoldings: 1691000000,
    incentivesTotal: 1509000000,
    algoDistributed: 1509000000,
    fiatUSD: 130000000,
    balanceSheet: "NO",
    keyChanges: "Venture Funds 1.15B; Lending -109M; Sales 150M; FINAL REPORT; Structure changed"
  }
];

export const getTechnologiesSummary = () => {
  const totalAlgo = technologiesReports.reduce((sum, report) => sum + report.algoDistributed, 0);
  const totalFiat = technologiesReports.reduce((sum, report) => sum + (report.fiatUSD || 0), 0);
  const reportCount = technologiesReports.length;
  const latestReport = technologiesReports[technologiesReports.length - 1];

  return {
    totalAlgo,
    totalFiat,
    reportCount,
    latestReport: latestReport.reportDate,
    avgAlgoPerReport: totalAlgo / reportCount,
    avgFiatPerReport: totalFiat / reportCount
  };
};
