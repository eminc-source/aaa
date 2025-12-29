import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '@txnlab/use-wallet-react';
import algosdk from 'algosdk';
import { foundationReports, getFoundationSummary } from '../../data/foundationReports';
import { formatCurrency, formatAlgo, formatCompact } from '../../utils/formatters';
import { balanceSheetData, reportColumns, getOldStructureTotal, getNewStructureTotal } from '../../data/balanceSheetData';
import { outflowsData, outflowReportColumns, getCategoryTotal } from '../../data/outflowsData';
import { fiatExpenseData, fiatReportColumns, formatUSD } from '../../data/fiatExpenseData';
import { loansData, statusColors } from '../../data/loansData';
import { poolTrackingData, getPoolTrackingSummary } from '../../data/poolTrackingData';
import { flagStats, severityColors, flagsData, Severity } from '../../data/flagsData';
import { keyObservationsData } from '../../data/keyObservationsData';
import ChartBuilder from '../../components/ChartBuilder/ChartBuilder';
import WalletConnect from '../../components/WalletConnect/WalletConnect';
import MemberStatus from '../../components/MemberStatus/MemberStatus';
import SEO from '../../components/SEO/SEO';
import { exportToCSV, exportToExcel, exportToPDF, exportToPNG, formatSummaryReportsForExport, formatFlagsForExport, formatKeyObservationsForExport } from '../../utils/exportUtils';
import './Foundation.css';

type TabType = 'summary' | 'data' | 'flags' | 'charts' | 'timeline';
type DataSubTab = 'balance-sheet' | 'outflows' | 'fiat-expense' | 'loans' | 'pool-tracking';

const IGA_ASA_ID = 2635992378;

// Official report URLs by report number
const reportUrls: Record<number, string> = {
  1: 'https://web.archive.org/web/20240518233209/https://www.algorand.foundation/news/october2020',
  2: 'https://web.archive.org/web/20240518233209/https://www.algorand.foundation/news/october2020',
  3: 'https://web.archive.org/web/20240518233209/https://www.algorand.foundation/news/october2020',
  4: 'https://web.archive.org/web/20210511225859/https://algorand.foundation/the-algo/transparency-report-march-2021',
  5: 'https://web.archive.org/web/20211105153147/https://algorand.foundation/the-algo/transparency-report-september-2021',
  6: 'https://web.archive.org/web/20220519181326/https://algorand.foundation/the-algo/transparency-report-march-2022',
  7: 'https://web.archive.org/web/20221210080455/https://algorand.foundation/transparency-report-oct-2022',
  8: 'https://algorand.co/hubfs/Website-2024/Transparency%20Reports/Algorand%20Foundation%20H1%202023%20Transparency%20Report.pdf',
  9: 'https://algorand.co/hubfs/Website-2024/Transparency%20Reports/Algorand%20Foundation%20Quarterly%20Transparency%20Report%20Q2%202023%20vFinal.pdf',
  10: 'https://algorand.co/hubfs/Website-2024/Transparency%20Reports/Algorand%20Foundation%20Quarterly%20Transparency%20Report%20Q3%202023_Final.pdf',
  11: 'https://algorand.co/hubfs/Website-2024/Transparency%20Reports/Algorand%20Foundation%20Quarterly%20Transparency%20Report%20Q4%202023_Final.pdf',
  12: 'https://algorand.co/hubfs/Website-2024/Transparency%20Reports/Algorand%20Foundation%20-%20Q1%202024%20Report-v7.pdf',
  13: 'https://algorand.co/hubfs/Website-2024/Transparency%20Reports/Algorand%20Transparency%20Report%20Q2%202024%20-%20Final.pdf',
  14: 'https://algorand.co/hubfs/Website-2024/Transparency%20Reports/Algorand%20Foundation%20Q3%202024%20Transparency%20Report%20Final.pdf',
  15: 'https://algorand.co/hubfs/Website-2024/Transparency%20Reports/Algorand%20Transparency%20Report%20Q4%202024_Final.pdf',
  16: 'https://algorand.co/hubfs/Website-2024/Transparency%20Reports/Algorand%20Foundation-Transparency%20Report%20Q1%202025-3.pdf',
  17: 'https://algorand.co/hubfs/Algorand%20Foundation-Transparency%20Report%20Q2%202025-v3.pdf',
  18: 'https://algorand.co/hubfs/Algorand%20Transparency%20Report-Q3-2025_V3%20Final.pdf',
};

const Foundation: React.FC = () => {
  const { activeAccount } = useWallet();
  const [activeTab, setActiveTab] = useState<TabType>('summary');
  const [activeDataSubTab, setActiveDataSubTab] = useState<DataSubTab>('balance-sheet');
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [flagSortColumn, setFlagSortColumn] = useState<'issueNum' | 'category' | 'severity'>('severity');
  const [flagSortDirection, setFlagSortDirection] = useState<'asc' | 'desc'>('asc');
  const [reportSortDirection, setReportSortDirection] = useState<'asc' | 'desc'>('desc'); // desc = newest first
  const [igaBalance, setIgaBalance] = useState<number>(0);
  const [showAccessModal, setShowAccessModal] = useState(false);
  
  // Key Observations filter state
  const [obsFilterMode, setObsFilterMode] = useState<'all' | 'range' | 'specific'>('all');
  const [obsRangeFrom, setObsRangeFrom] = useState<number>(1);
  const [obsRangeTo, setObsRangeTo] = useState<number>(18);
  const [obsSelectedReports, setObsSelectedReports] = useState<Set<number>>(new Set());
  
  // Flags severity filter state
  const [flagsSeverityFilter, setFlagsSeverityFilter] = useState<Set<string>>(new Set(['HIGH', 'MEDIUM', 'LOW', 'RESOLVED']));
  
  // Balance Sheet filter state
  const [bsFilterMode, setBsFilterMode] = useState<'all' | 'range' | 'specific'>('all');
  const [bsRangeFrom, setBsRangeFrom] = useState<string>('R4');
  const [bsRangeTo, setBsRangeTo] = useState<string>('R18');
  const [bsSelectedReports, setBsSelectedReports] = useState<Set<string>>(new Set());
  
  // Outflows filter state
  const [outflowFilterMode, setOutflowFilterMode] = useState<'all' | 'range' | 'specific'>('all');
  const [outflowRangeFrom, setOutflowRangeFrom] = useState<string>('R1');
  const [outflowRangeTo, setOutflowRangeTo] = useState<string>('R18');
  const [outflowSelectedReports, setOutflowSelectedReports] = useState<Set<string>>(new Set());
  
  // Fiat Expense filter state
  const [fiatFilterMode, setFiatFilterMode] = useState<'all' | 'range' | 'specific'>('all');
  const [fiatRangeFrom, setFiatRangeFrom] = useState<string>('R1');
  const [fiatRangeTo, setFiatRangeTo] = useState<string>('R18');
  const [fiatSelectedReports, setFiatSelectedReports] = useState<Set<string>>(new Set());
  
  const summary = getFoundationSummary();

  // Check if user has iGA MEMBER status or higher (any iGA balance > 0)
  const hasIgaMemberAccess = igaBalance > 0;
  
  // Check if user has iGA 333 status or higher (iGA balance >= 0.333)
  const hasIga333Access = igaBalance >= 333000; // 0.333 iGA in micro units

  // Handle locked tab click - show access modal
  const handleLockedTabClick = () => {
    if (!hasIgaMemberAccess) {
      setShowAccessModal(true);
    }
  };

  // Handle locked download click - show download access modal
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const handleLockedDownload = () => {
    setShowDownloadModal(true);
  };

  // Filter key observations based on filter mode
  const filteredObservations = React.useMemo(() => {
    if (obsFilterMode === 'all') {
      return keyObservationsData;
    } else if (obsFilterMode === 'range') {
      return keyObservationsData.filter(
        r => r.reportNumber >= obsRangeFrom && r.reportNumber <= obsRangeTo
      );
    } else {
      return keyObservationsData.filter(r => obsSelectedReports.has(r.reportNumber));
    }
  }, [obsFilterMode, obsRangeFrom, obsRangeTo, obsSelectedReports]);

  // Toggle report selection for specific filter
  const toggleReportSelection = (reportNum: number) => {
    setObsSelectedReports(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reportNum)) {
        newSet.delete(reportNum);
      } else {
        newSet.add(reportNum);
      }
      return newSet;
    });
  };

  // Select all reports
  const selectAllReports = () => {
    setObsSelectedReports(new Set(keyObservationsData.map(r => r.reportNumber)));
  };

  // Clear all report selections
  const clearAllReports = () => {
    setObsSelectedReports(new Set());
  };

  // Filter balance sheet columns
  const filteredBsColumns = React.useMemo(() => {
    if (bsFilterMode === 'all') return reportColumns;
    if (bsFilterMode === 'range') {
      const fromIdx = reportColumns.indexOf(bsRangeFrom);
      const toIdx = reportColumns.indexOf(bsRangeTo);
      return reportColumns.slice(Math.min(fromIdx, toIdx), Math.max(fromIdx, toIdx) + 1);
    }
    return reportColumns.filter(col => bsSelectedReports.has(col));
  }, [bsFilterMode, bsRangeFrom, bsRangeTo, bsSelectedReports]);

  // Filter outflow columns
  const filteredOutflowColumns = React.useMemo(() => {
    if (outflowFilterMode === 'all') return outflowReportColumns;
    if (outflowFilterMode === 'range') {
      const fromIdx = outflowReportColumns.indexOf(outflowRangeFrom);
      const toIdx = outflowReportColumns.indexOf(outflowRangeTo);
      return outflowReportColumns.slice(Math.min(fromIdx, toIdx), Math.max(fromIdx, toIdx) + 1);
    }
    return outflowReportColumns.filter(col => outflowSelectedReports.has(col));
  }, [outflowFilterMode, outflowRangeFrom, outflowRangeTo, outflowSelectedReports]);

  // Filter fiat expense columns
  const filteredFiatColumns = React.useMemo(() => {
    if (fiatFilterMode === 'all') return fiatReportColumns;
    if (fiatFilterMode === 'range') {
      const fromIdx = fiatReportColumns.indexOf(fiatRangeFrom);
      const toIdx = fiatReportColumns.indexOf(fiatRangeTo);
      return fiatReportColumns.slice(Math.min(fromIdx, toIdx), Math.max(fromIdx, toIdx) + 1);
    }
    return fiatReportColumns.filter(col => fiatSelectedReports.has(col));
  }, [fiatFilterMode, fiatRangeFrom, fiatRangeTo, fiatSelectedReports]);

  // Helper to toggle string-based report selection
  const toggleStringReportSelection = (
    report: string, 
    setSelected: React.Dispatch<React.SetStateAction<Set<string>>>
  ) => {
    setSelected(prev => {
      const newSet = new Set(prev);
      if (newSet.has(report)) {
        newSet.delete(report);
      } else {
        newSet.add(report);
      }
      return newSet;
    });
  };

  // Fetch iGA balance when wallet connects
  useEffect(() => {
    const fetchIgaBalance = async () => {
      if (!activeAccount?.address) {
        setIgaBalance(0);
        return;
      }

      try {
        const algodClient = new algosdk.Algodv2('', 'https://mainnet-api.algonode.cloud', '');
        const accountInfo = await algodClient.accountInformation(activeAccount.address).do();
        const assets = accountInfo.assets ?? accountInfo['assets'] ?? [];

        const igaAsset = assets.find((asset: any) => {
          const assetId = asset['asset-id'] ?? asset['assetId'] ?? asset.assetId;
          return Number(assetId) === IGA_ASA_ID;
        });
        
        const igaAmount = igaAsset ? (igaAsset.amount ?? igaAsset['amount']) : 0;
        setIgaBalance(Number(igaAmount));
      } catch (error) {
        console.error('Failed to fetch iGA balance:', error);
        setIgaBalance(0);
      }
    };

    fetchIgaBalance();
    const interval = setInterval(fetchIgaBalance, 30000);
    return () => clearInterval(interval);
  }, [activeAccount?.address]);

  // Sort reports by date
  const sortedReports = [...foundationReports].sort((a, b) => {
    // Parse dates like "Mar 2020", "Jul 2019", etc.
    const parseDate = (dateStr: string): Date => {
      const months: Record<string, number> = {
        'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
        'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
      };
      const parts = dateStr.split(' ');
      const month = months[parts[0]] || 0;
      const year = parseInt(parts[1]) || 2019;
      return new Date(year, month);
    };
    const dateA = parseDate(a.reportDate);
    const dateB = parseDate(b.reportDate);
    const comparison = dateA.getTime() - dateB.getTime();
    return reportSortDirection === 'asc' ? comparison : -comparison;
  });

  const toggleReportSort = () => {
    setReportSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  // Sort flags
  const severityOrder: Record<Severity, number> = { 'HIGH': 1, 'MEDIUM': 2, 'LOW': 3, 'RESOLVED': 4 };
  
  // Filter flags by severity
  const filteredFlags = flagsData.filter(flag => flagsSeverityFilter.has(flag.severity));
  
  const sortedFlags = [...filteredFlags].sort((a, b) => {
    let comparison = 0;
    if (flagSortColumn === 'issueNum') {
      comparison = a.issueNum - b.issueNum;
    } else if (flagSortColumn === 'category') {
      comparison = a.category.localeCompare(b.category);
    } else if (flagSortColumn === 'severity') {
      comparison = severityOrder[a.severity] - severityOrder[b.severity];
    }
    return flagSortDirection === 'asc' ? comparison : -comparison;
  });

  const handleFlagSort = (column: 'issueNum' | 'category' | 'severity') => {
    if (flagSortColumn === column) {
      setFlagSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setFlagSortColumn(column);
      setFlagSortDirection('asc');
    }
  };

  const getSeverityClass = (severity: Severity): string => {
    switch (severity) {
      case 'HIGH': return 'severity-high';
      case 'MEDIUM': return 'severity-medium';
      case 'LOW': return 'severity-low';
      case 'RESOLVED': return 'severity-resolved';
      default: return '';
    }
  };

  // Toggle severity filter
  const toggleSeverityFilter = (severity: string) => {
    setFlagsSeverityFilter(prev => {
      const newSet = new Set(prev);
      if (newSet.has(severity)) {
        newSet.delete(severity);
      } else {
        newSet.add(severity);
      }
      return newSet;
    });
  };

  // Select all severities
  const selectAllSeverities = () => {
    setFlagsSeverityFilter(new Set(['HIGH', 'MEDIUM', 'LOW', 'RESOLVED']));
  };

  // Clear all severity filters
  const clearAllSeverities = () => {
    setFlagsSeverityFilter(new Set());
  };

  const toggleRow = (reportNumber: number) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reportNumber)) {
        newSet.delete(reportNumber);
      } else {
        newSet.add(reportNumber);
      }
      return newSet;
    });
  };

  const getBalanceSheetClass = (status: string): string => {
    if (status === 'NO') return 'status-no';
    if (status === 'NEW FORMAT') return 'status-new';
    if (status.includes('YES')) return 'status-yes';
    if (status === 'QUARTERLY') return 'status-quarterly';
    return '';
  };

  return (
    <div className="foundation-page">
      <SEO
        title="Algorand Foundation Transparency"
        description="Track Algorand Foundation ALGO distributions across 18 transparency reports. Analyze balance sheets, outflows, loans, and pool tracking data."
        path="/foundation"
      />
      <div className="scanlines"></div>

      {/* Header */}
      <header className="page-header foundation-header">
        <Link to="/" className="back-link">
          <span className="back-arrow">◄</span>
          <span>BACK TO DASHBOARD</span>
        </Link>
        <div className="page-title-container">
          <h1 className="page-title">ALGORAND FOUNDATION</h1>
          <p className="page-subtitle">TRANSPARENCY REPORT - FORENSIC TRACKER</p>
        </div>
        <div className="header-wallet">
          <MemberStatus />
          <WalletConnect />
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'summary' ? 'active' : ''}`}
          onClick={() => setActiveTab('summary')}
        >
          <span className="tab-icon">▣</span> SUMMARY
        </button>
        <button 
          className={`tab-btn ${activeTab === 'data' ? 'active' : ''} ${!hasIgaMemberAccess ? 'locked' : ''}`}
          onClick={() => hasIgaMemberAccess ? setActiveTab('data') : handleLockedTabClick()}
        >
          <span className="tab-icon">{!hasIgaMemberAccess ? '🔒' : '▦'}</span> DATA
        </button>
        <button 
          className={`tab-btn ${activeTab === 'charts' ? 'active' : ''} ${!hasIgaMemberAccess ? 'locked' : ''}`}
          onClick={() => hasIgaMemberAccess ? setActiveTab('charts') : handleLockedTabClick()}
        >
          <span className="tab-icon">{!hasIgaMemberAccess ? '🔒' : '▤'}</span> CHARTS
        </button>
        <button 
          className={`tab-btn ${activeTab === 'flags' ? 'active' : ''} ${!hasIgaMemberAccess ? 'locked' : ''}`}
          onClick={() => hasIgaMemberAccess ? setActiveTab('flags') : handleLockedTabClick()}
        >
          <span className="tab-icon">{!hasIgaMemberAccess ? '🔒' : '⚑'}</span> FLAGS
        </button>
        <button 
          className={`tab-btn ${activeTab === 'timeline' ? 'active' : ''} ${!hasIgaMemberAccess ? 'locked' : ''}`}
          onClick={() => hasIgaMemberAccess ? setActiveTab('timeline') : handleLockedTabClick()}
        >
          <span className="tab-icon">{!hasIgaMemberAccess ? '🔒' : '▥'}</span> KEY OBSERVATIONS
        </button>
      </nav>

      {/* Main Content */}
      <main className="page-content">
        {activeTab === 'summary' && (
          <div className="summary-tab" id="summary-content">
            {/* Title for PNG export (hidden on screen) */}
            <div className="png-export-title">
              <h1>ALGORAND FOUNDATION</h1>
              <p>TRANSPARENCY REPORT - FORENSIC TRACKER</p>
            </div>

            {/* Summary Cards */}
            <div className="summary-cards">
              <div className="summary-card holdings-card">
                <div className="card-icon">Ⱥ</div>
                <div className="card-content">
                  <span className="card-label">TOTAL FOUNDATION ALGO HOLDINGS</span>
                  <span className="card-value">{formatAlgo(1175000000)}</span>
                </div>
              </div>
              <div className="summary-card algo-card">
                <div className="card-icon">Ⱥ</div>
                <div className="card-content">
                  <span className="card-label">TOTAL ALGO DISTRIBUTED</span>
                  <span className="card-value">{formatAlgo(summary.totalAlgoDistributed)}</span>
                </div>
              </div>
              <div className="summary-card fiat-card">
                <div className="card-icon">$</div>
                <div className="card-content">
                  <span className="card-label">TOTAL FIAT EXPENSES (USD)</span>
                  <span className="card-value">{formatCurrency(summary.totalFiatUSD)}</span>
                </div>
              </div>
            </div>

            {/* Data Purpose Banner */}
            <div className="purpose-banner">
              <span className="purpose-icon">⚠</span>
              <p className="purpose-text">
                Purpose: Track funds across reports to identify discrepancies, hidden movements, or misappropriation
              </p>
            </div>

            {/* Download Options */}
            <div className="download-bar">
              <span className="download-label">DOWNLOAD:</span>
              <button 
                className="download-btn csv-btn"
                onClick={() => exportToCSV(formatSummaryReportsForExport(sortedReports), 'algorand-foundation-summary')}
              >
                CSV
              </button>
              <button 
                className="download-btn xls-btn"
                onClick={() => exportToExcel(formatSummaryReportsForExport(sortedReports), 'algorand-foundation-summary', 'Summary')}
              >
                XLS
              </button>
              <button 
                className="download-btn pdf-btn"
                onClick={() => exportToPDF(
                  formatSummaryReportsForExport(sortedReports), 
                  'algorand-foundation-summary',
                  'ALGORAND FOUNDATION - TRANSPARENCY REPORTS',
                  `Generated ${new Date().toLocaleDateString()}`
                )}
              >
                PDF
              </button>
              <button 
                className="download-btn png-btn"
                onClick={() => exportToPNG('summary-content', 'algorand-foundation-summary')}
              >
                PNG
              </button>
            </div>

            {/* Data Table */}
            <div className="table-container">
              <table className="retro-table">
                <thead>
                  <tr>
                    <th className="col-expand"></th>
                    <th className="col-report">#</th>
                    <th className="col-period">PERIOD</th>
                    <th className="col-duration">DURATION</th>
                    <th className="col-date sortable" onClick={toggleReportSort} style={{ cursor: 'pointer' }}>
                      REPORT DATE {reportSortDirection === 'desc' ? '▼' : '▲'}
                    </th>
                    <th className="col-algo">ALGO DISTRIBUTED</th>
                    <th className="col-fiat">FIAT (USD)</th>
                    <th className="col-balance">BALANCE SHEET?</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedReports.map((report) => (
                    <React.Fragment key={report.reportNumber}>
                      <tr 
                        className={`report-row ${report.details ? 'expandable' : ''} ${expandedRows.has(report.reportNumber) ? 'expanded' : ''}`}
                        onClick={() => report.details && toggleRow(report.reportNumber)}
                      >
                        <td className="col-expand">
                          {report.details ? (
                            <span className={`expand-icon ${expandedRows.has(report.reportNumber) ? 'open' : ''}`}>
                              ▶
                            </span>
                          ) : (
                            <span className="expand-icon disabled">○</span>
                          )}
                        </td>
                        <td className="col-report">{report.reportNumber}</td>
                        <td className="col-period">{report.period}</td>
                        <td className="col-duration">{report.duration}</td>
                        <td className="col-date">{report.reportDate}</td>
                        <td className="col-algo">{formatAlgo(report.algoDistributed)}</td>
                        <td className={`col-fiat ${(report.reportNumber === 6 || report.reportNumber === 7) ? 'fiat-highlight' : ''}`}>
                          {report.fiatUSD ? formatCurrency(report.fiatUSD) : 'N/R'}
                        </td>
                        <td className={`col-balance ${getBalanceSheetClass(report.balanceSheet)}`}>
                          {report.balanceSheet}
                        </td>
                      </tr>
                      {/* Expanded Details Row */}
                      {report.details && expandedRows.has(report.reportNumber) && (
                        <tr className="details-row">
                          <td colSpan={8}>
                            <div className="report-details">
                              <div className="details-header">
                                <div className="details-header-top">
                                  <div className="details-header-text">
                                    <h4 className="details-title">
                                      REPORT #{report.reportNumber}: {report.period}
                                    </h4>
                                    <span className="details-subtitle">
                                      {report.duration} • {report.reportDate}
                                    </span>
                                  </div>
                                  {reportUrls[report.reportNumber] && (
                                    <a 
                                      href={reportUrls[report.reportNumber]} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="view-report-btn"
                                    >
                                      📄 VIEW OFFICIAL REPORT
                                    </a>
                                  )}
                                </div>
                              </div>
                              
                              <div className="details-grid">
                                {/* Distributions Section */}
                                <div className="details-section">
                                  <h5 className="section-label">DISTRIBUTIONS:</h5>
                                  <div className="distribution-list">
                                    {report.details.distributions.map((dist, idx) => (
                                      <div key={idx} className="distribution-item">
                                        <span className="dist-category">{dist.category}</span>
                                        <span className="dist-amount">{dist.amount}</span>
                                        {dist.notes && <span className="dist-notes">{dist.notes}</span>}
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Disclosures Section */}
                                <div className="details-section">
                                  <h5 className="section-label">DISCLOSURES:</h5>
                                  <div className="disclosure-list">
                                    {report.details.disclosures.map((disc, idx) => (
                                      <div key={idx} className="disclosure-item">
                                        <span className="disc-label">{disc.label}</span>
                                        <span className="disc-value">{disc.value}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Key Events Section */}
                                <div className="details-section events-section">
                                  <h5 className="section-label">KEY EVENTS:</h5>
                                  <ul className="events-list">
                                    {report.details.keyEvents.map((event, idx) => (
                                      <li key={idx} className="event-item">
                                        <span className="event-bullet">▸</span>
                                        {event}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="totals-row">
                    <td className="col-expand"></td>
                    <td colSpan={4} className="totals-label">CUMULATIVE TOTAL</td>
                    <td className="col-algo total-value">{formatAlgo(summary.totalAlgoDistributed)}</td>
                    <td className="col-fiat total-value">{formatCurrency(summary.totalFiatUSD)}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'data' && (
          <div className="data-tab">
            {/* Data Sub-Navigation */}
            <nav className="sub-tab-navigation">
              <button 
                className={`sub-tab-btn ${activeDataSubTab === 'balance-sheet' ? 'active' : ''}`}
                onClick={() => setActiveDataSubTab('balance-sheet')}
              >
                BALANCE SHEET RECONCILIATION
              </button>
              <button 
                className={`sub-tab-btn ${activeDataSubTab === 'outflows' ? 'active' : ''}`}
                onClick={() => setActiveDataSubTab('outflows')}
              >
                ALL OUTFLOWS BY REPORT
              </button>
              <button 
                className={`sub-tab-btn ${activeDataSubTab === 'fiat-expense' ? 'active' : ''}`}
                onClick={() => setActiveDataSubTab('fiat-expense')}
              >
                FIAT/USD EXPENSE
              </button>
              <button 
                className={`sub-tab-btn ${activeDataSubTab === 'loans' ? 'active' : ''}`}
                onClick={() => setActiveDataSubTab('loans')}
              >
                LOANS
              </button>
              <button 
                className={`sub-tab-btn ${activeDataSubTab === 'pool-tracking' ? 'active' : ''}`}
                onClick={() => setActiveDataSubTab('pool-tracking')}
              >
                POOL TRACKING
              </button>
            </nav>

            {/* Balance Sheet Reconciliation */}
            {activeDataSubTab === 'balance-sheet' && (
              <div className="balance-sheet-section">
                <div className="section-header">
                  <h2 className="section-title">{balanceSheetData.title}</h2>
                  <p className="section-description">{balanceSheetData.description}</p>
                </div>

                {/* Wrapper for PNG export - starts here to include summary boxes and table but exclude download/filter */}
                <div id="data-content">
                  {/* PNG Export Title (hidden by default, shown during export) */}
                  <div className="png-export-title">
                    <h1 style={{ textAlign: 'center', margin: '20px 0', color: 'var(--neon-cyan)' }}>
                      ALGORAND FOUNDATION - BALANCE SHEET RECONCILIATION
                    </h1>
                  </div>

                  {/* Summary Boxes */}
                  <div className="bs-summary-cards">
                    <div className="summary-card bs-green-card">
                      <div className="card-icon">Ⱥ</div>
                      <div className="card-content">
                        <span className="card-label">STARTING BALANCE (R4)</span>
                        <span className="card-value">Ⱥ{(5347960000).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="summary-card bs-yellow-card">
                      <div className="card-icon">Ⱥ</div>
                      <div className="card-content">
                        <span className="card-label">CURRENT HOLDINGS (R18)</span>
                        <span className="card-value">Ⱥ{(balanceSheetData.singleFormat.find(p => p.name.includes('Holdings'))?.values.R18 || 0).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="summary-card bs-red-card">
                      <div className="card-icon">Ⱥ</div>
                      <div className="card-content">
                        <span className="card-label">HOLDINGS + DISTRIBUTED</span>
                        <span className="card-value">Ⱥ{((Number(balanceSheetData.singleFormat.find(p => p.name.includes('Holdings'))?.values.R18) || 0) + summary.totalAlgoDistributed).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="data-note">
                    <span className="note-icon">⚠</span>
                    <p>{balanceSheetData.note}</p>
                  </div>

                {/* Report Filter */}
                <div className="obs-filter-bar">
                  <span className="filter-label">FILTER:</span>
                  <div className="filter-mode-buttons">
                    <button 
                      className={`filter-mode-btn ${bsFilterMode === 'all' ? 'active' : ''}`}
                      onClick={() => setBsFilterMode('all')}
                    >
                      ALL
                    </button>
                    <button 
                      className={`filter-mode-btn ${bsFilterMode === 'range' ? 'active' : ''}`}
                      onClick={() => setBsFilterMode('range')}
                    >
                      RANGE
                    </button>
                    <button 
                      className={`filter-mode-btn ${bsFilterMode === 'specific' ? 'active' : ''}`}
                      onClick={() => setBsFilterMode('specific')}
                    >
                      SELECT
                    </button>
                  </div>
                  {bsFilterMode === 'range' && (
                    <div className="filter-range-controls">
                      <span className="filter-range-label">FROM</span>
                      <select className="filter-select" value={bsRangeFrom} onChange={(e) => setBsRangeFrom(e.target.value)}>
                        {reportColumns.map(col => <option key={col} value={col}>{col}</option>)}
                      </select>
                      <span className="filter-range-label">TO</span>
                      <select className="filter-select" value={bsRangeTo} onChange={(e) => setBsRangeTo(e.target.value)}>
                        {reportColumns.map(col => <option key={col} value={col}>{col}</option>)}
                      </select>
                    </div>
                  )}
                  {bsFilterMode === 'specific' && (
                    <div className="filter-specific-controls">
                      <div className="filter-quick-actions">
                        <button className="filter-quick-btn" onClick={() => setBsSelectedReports(new Set(reportColumns))}>ALL</button>
                        <button className="filter-quick-btn" onClick={() => setBsSelectedReports(new Set())}>NONE</button>
                      </div>
                      <div className="filter-report-checkboxes">
                        {reportColumns.map(col => (
                          <label key={col} className="filter-checkbox-label">
                            <input type="checkbox" checked={bsSelectedReports.has(col)} onChange={() => toggleStringReportSelection(col, setBsSelectedReports)} />
                            <span>{col}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Download Options */}
                <div className="download-bar">
                  <span className="download-label">DOWNLOAD:</span>
                  <button
                    className={`download-btn csv-btn ${!hasIga333Access ? 'locked' : ''}`}
                    onClick={() => hasIga333Access ? exportToCSV(balanceSheetData.singleFormat.map(pool => ({
                      'Pool/Fund Name': pool.name,
                      ...Object.fromEntries(filteredBsColumns.map(col => [col, pool.values[col]])),
                      'Notes': pool.notes
                    })), 'algorand-foundation-balance-sheet') : handleLockedDownload()}
                  >
                    {!hasIga333Access && '🔒 '}CSV
                  </button>
                  <button
                    className={`download-btn xls-btn ${!hasIga333Access ? 'locked' : ''}`}
                    onClick={() => hasIga333Access ? exportToExcel(balanceSheetData.singleFormat.map(pool => ({
                      'Pool/Fund Name': pool.name,
                      ...Object.fromEntries(filteredBsColumns.map(col => [col, pool.values[col]])),
                      'Notes': pool.notes
                    })), 'algorand-foundation-balance-sheet', 'Balance Sheet') : handleLockedDownload()}
                  >
                    {!hasIga333Access && '🔒 '}XLS
                  </button>
                  <button
                    className={`download-btn pdf-btn ${!hasIga333Access ? 'locked' : ''}`}
                    onClick={() => hasIga333Access ? exportToPDF(
                      balanceSheetData.singleFormat.map(pool => ({
                        'Pool/Fund Name': pool.name,
                        ...Object.fromEntries(filteredBsColumns.map(col => [col, pool.values[col]])),
                        'Notes': pool.notes
                      })),
                      'algorand-foundation-balance-sheet',
                      'ALGORAND FOUNDATION - BALANCE SHEET RECONCILIATION',
                      `Generated ${new Date().toLocaleDateString()}`
                    ) : handleLockedDownload()}
                  >
                    {!hasIga333Access && '🔒 '}PDF
                  </button>
                  <button
                    className={`download-btn png-btn ${!hasIga333Access ? 'locked' : ''}`}
                    onClick={() => hasIga333Access ? exportToPNG('data-content', 'algorand-foundation-balance-sheet') : handleLockedDownload()}
                  >
                    {!hasIga333Access && '🔒 '}PNG
                  </button>
                </div>

                  {/* Unified Balance Sheet Table */}
                  <div className="data-table-container">
                  <div className="table-scroll-wrapper">
                    <table className="data-table balance-table unified-balance-table">
                      <thead>
                        <tr>
                          <th className="col-pool-name">Pool/Fund Name</th>
                          {filteredBsColumns.map(col => (
                            <th key={col} className="col-report-value">{col}</th>
                          ))}
                          <th className="col-notes">Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Old Structure Section Header */}
                        <tr className="section-header-row old-structure-header">
                          <td className="col-pool-name section-header-cell">OLD STRUCTURE (R4-R5)</td>
                          {filteredBsColumns.map(col => (
                            <td key={col} className="section-header-cell"></td>
                          ))}
                          <td className="section-header-cell"></td>
                        </tr>
                        {/* Old Structure Items */}
                        {balanceSheetData.oldStructure.map((pool, idx) => (
                          <tr key={`old-${idx}`} className="pool-row">
                            <td className="col-pool-name">{pool.name}</td>
                            {filteredBsColumns.map(col => (
                              <td key={col} className="col-report-value">
                                {pool.values[col] === null ? (
                                  <span className="arrow-continue">→</span>
                                ) : typeof pool.values[col] === 'number' ? (
                                  formatCompact(pool.values[col] as number)
                                ) : pool.values[col]}
                              </td>
                            ))}
                            <td className={`col-notes ${pool.notes.includes('Merged') ? 'note-merged' : pool.notes === 'Completed' ? 'note-completed' : pool.notes === 'NEVER USED' ? 'note-never' : 'note-continued'}`}>
                              {pool.notes}
                            </td>
                          </tr>
                        ))}
                        {/* Old Structure Subtotal */}
                        <tr className="totals-row subtotal-row old-structure-total">
                          <td className="col-pool-name totals-label">TOTAL OLD STRUCTURE</td>
                          {filteredBsColumns.map(col => {
                            const total = getOldStructureTotal(col);
                            return (
                              <td key={col} className="col-report-value">
                                {total > 0 ? formatCompact(total) : <span className="arrow-continue">→</span>}
                              </td>
                            );
                          })}
                          <td className="col-notes">Sum of 8 pools</td>
                        </tr>

                        {/* Spacer Row */}
                        <tr className="spacer-row">
                          <td className="col-pool-name"></td>
                          {filteredBsColumns.map(col => (
                            <td key={col}></td>
                          ))}
                          <td></td>
                        </tr>

                        {/* New Structure Section Header */}
                        <tr className="section-header-row new-structure-header">
                          <td className="col-pool-name section-header-cell">NEW STRUCTURE (R6-R7)</td>
                          {filteredBsColumns.map(col => (
                            <td key={col} className="section-header-cell"></td>
                          ))}
                          <td className="section-header-cell"></td>
                        </tr>
                        {/* New Structure Items */}
                        {balanceSheetData.newStructure.map((pool, idx) => (
                          <tr key={`new-${idx}`} className="pool-row">
                            <td className="col-pool-name">{pool.name}</td>
                            {filteredBsColumns.map(col => (
                              <td key={col} className="col-report-value">
                                {pool.values[col] === null ? (
                                  <span className="arrow-continue">→</span>
                                ) : typeof pool.values[col] === 'number' ? (
                                  formatCompact(pool.values[col] as number)
                                ) : pool.values[col]}
                              </td>
                            ))}
                            <td className={`col-notes ${pool.notes.includes('Merged') ? 'note-merged' : ''}`}>
                              {pool.notes}
                            </td>
                          </tr>
                        ))}
                        {/* New Structure Subtotal */}
                        <tr className="totals-row subtotal-row new-structure-total">
                          <td className="col-pool-name totals-label">TOTAL NEW STRUCTURE</td>
                          {filteredBsColumns.map(col => {
                            const total = getNewStructureTotal(col);
                            return (
                              <td key={col} className="col-report-value">
                                {total > 0 ? formatCompact(total) : <span className="arrow-continue">→</span>}
                              </td>
                            );
                          })}
                          <td className="col-notes">Sum of 3 pools</td>
                        </tr>

                        {/* Spacer Row */}
                        <tr className="spacer-row">
                          <td className="col-pool-name"></td>
                          {filteredBsColumns.map(col => (
                            <td key={col}></td>
                          ))}
                          <td></td>
                        </tr>

                        {/* R8+ Format Section Header */}
                        <tr className="section-header-row r8plus-header">
                          <td className="col-pool-name section-header-cell">R8+ FORMAT (Single Total)</td>
                          {filteredBsColumns.map(col => (
                            <td key={col} className="section-header-cell"></td>
                          ))}
                          <td className="section-header-cell"></td>
                        </tr>
                        {/* R8+ Format Items */}
                        {balanceSheetData.singleFormat.map((pool, idx) => (
                          <tr key={`r8-${idx}`} className={`pool-row ${pool.name.includes('Holdings') ? 'holdings-row' : 'usd-row'}`}>
                            <td className="col-pool-name">{pool.name}</td>
                            {filteredBsColumns.map(col => (
                              <td key={col} className="col-report-value">
                                {pool.values[col] === null ? (
                                  pool.name.includes('USD') ? 'N/R' : <span className="arrow-continue">→</span>
                                ) : typeof pool.values[col] === 'number' ? (
                                  pool.name.includes('USD') 
                                    ? formatCurrency(pool.values[col] as number)
                                    : formatCompact(pool.values[col] as number)
                                ) : pool.values[col]}
                              </td>
                            ))}
                            <td className="col-notes">{pool.notes}</td>
                          </tr>
                        ))}

                        {/* Spacer Row */}
                        <tr className="spacer-row">
                          <td className="col-pool-name"></td>
                          {filteredBsColumns.map(col => (
                            <td key={col}></td>
                          ))}
                          <td></td>
                        </tr>

                        {/* Grand Total Row */}
                        <tr className="totals-row grand-total-row">
                          <td className="col-pool-name totals-label">CURRENT HOLDINGS (R18)</td>
                          {filteredBsColumns.map(col => {
                            // Show the value from singleFormat for R8+, otherwise show old/new structure totals
                            const holdingsRow = balanceSheetData.singleFormat.find(p => p.name.includes('Holdings'));
                            const holdingsValue = holdingsRow?.values[col];
                            const oldTotal = getOldStructureTotal(col);
                            const newTotal = getNewStructureTotal(col);
                            
                            // R8+ uses singleFormat, R6-R7 uses newStructure, R4-R5 uses oldStructure
                            let displayValue: number | null = null;
                            if (holdingsValue && typeof holdingsValue === 'number') {
                              displayValue = holdingsValue;
                            } else if (newTotal > 0) {
                              displayValue = newTotal;
                            } else if (oldTotal > 0) {
                              displayValue = oldTotal;
                            }
                            
                            return (
                              <td key={col} className="col-report-value">
                                {displayValue ? formatCompact(displayValue) : ''}
                              </td>
                            );
                          })}
                          <td className="col-notes">1.175B ALGO remaining</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Cross-Check Analysis */}
                <div className="data-table-container cross-check-section">
                  <h3 className="table-section-title cross-check-title">CROSS-CHECK ANALYSIS</h3>
                  <div className="transition-checks">
                    {balanceSheetData.transitionChecks.map((check, idx) => (
                      <div key={idx} className={`transition-check ${check.status}`}>
                        <div className="check-header">
                          <span className="check-name">{check.name}</span>
                          <span className={`check-status ${check.status}`}>
                            {check.status === 'match' ? '✓' : check.status === 'discrepancy' ? '⚠' : 'ℹ'}
                          </span>
                        </div>
                        <div className="check-values">
                          <div className="check-from">
                            <span className="check-label">{check.fromReport} Total:</span>
                            <span className="check-value">{check.fromValue ? formatCompact(check.fromValue) : 'N/A'}</span>
                          </div>
                          <span className="check-arrow">→</span>
                          <div className="check-to">
                            <span className="check-label">{check.toReport} Total:</span>
                            <span className="check-value">{check.toValue ? formatCompact(check.toValue) : 'N/A'}</span>
                          </div>
                          <div className="check-diff">
                            <span className="check-label">DIFFERENCE:</span>
                            <span className={`check-value ${check.difference && check.difference < 0 ? 'negative' : 'positive'}`}>
                              {check.difference ? formatCompact(check.difference) : 'N/A'}
                            </span>
                          </div>
                        </div>
                        <div className={`check-notes ${check.status}`}>
                          {check.notes}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                </div> {/* Close data-content wrapper */}
              </div>
            )}

            {/* All Outflows by Report Sub-Tab */}
            {activeDataSubTab === 'outflows' && (() => {
              // Calculate total inflows grand total for summary cards
              const loanRepaymentsCat = outflowsData.categories.find(c => c.name === 'LOAN REPAYMENTS');
              const otherInflowsCat = outflowsData.categories.find(c => c.name === 'OTHER INFLOWS');
              const totalInflowsGrand = (loanRepaymentsCat?.items.reduce((sum, item) => sum + (typeof item.total === 'number' ? item.total : 0), 0) || 0) +
                (otherInflowsCat?.items.reduce((sum, item) => sum + (typeof item.total === 'number' ? item.total : 0), 0) || 0);

              return (
              <div className="outflows-section">
                <div className="section-header">
                  <h2 className="section-title">{outflowsData.title}</h2>
                </div>

                {/* Wrapper for PNG export - includes summary cards and table */}
                <div id="outflows-content">
                  {/* PNG Export Title (hidden by default, shown during export) */}
                  <div className="png-export-title">
                    <h1 style={{ textAlign: 'center', margin: '20px 0', color: 'var(--neon-cyan)' }}>
                      ALGORAND FOUNDATION - ALL REPORTED OUTFLOWS
                    </h1>
                  </div>

                {/* Outflows Grand Total Summary Box (matching summary page style) */}
                <div className="summary-cards outflows-summary-cards">
                  <div className="summary-card algo-card">
                    <div className="card-icon">Ⱥ</div>
                    <div className="card-content">
                      <span className="card-label">TOTAL ALGO DISTRIBUTED</span>
                      <span className="card-value">Ⱥ{summary.totalAlgoDistributed.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="summary-card fiat-card">
                    <div className="card-icon">Ⱥ</div>
                    <div className="card-content">
                      <span className="card-label">TOTAL INFLOWS</span>
                      <span className="card-value">Ⱥ{totalInflowsGrand.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="summary-card bs-yellow-card">
                    <div className="card-icon">Ⱥ</div>
                    <div className="card-content">
                      <span className="card-label">NET OUTFLOWS</span>
                      <span className="card-value">Ⱥ{(summary.totalAlgoDistributed - totalInflowsGrand).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Report Filter */}
                <div className="obs-filter-bar">
                  <span className="filter-label">FILTER:</span>
                  <div className="filter-mode-buttons">
                    <button className={`filter-mode-btn ${outflowFilterMode === 'all' ? 'active' : ''}`} onClick={() => setOutflowFilterMode('all')}>ALL</button>
                    <button className={`filter-mode-btn ${outflowFilterMode === 'range' ? 'active' : ''}`} onClick={() => setOutflowFilterMode('range')}>RANGE</button>
                    <button className={`filter-mode-btn ${outflowFilterMode === 'specific' ? 'active' : ''}`} onClick={() => setOutflowFilterMode('specific')}>SELECT</button>
                  </div>
                  {outflowFilterMode === 'range' && (
                    <div className="filter-range-controls">
                      <span className="filter-range-label">FROM</span>
                      <select className="filter-select" value={outflowRangeFrom} onChange={(e) => setOutflowRangeFrom(e.target.value)}>
                        {outflowReportColumns.map(col => <option key={col} value={col}>{col}</option>)}
                      </select>
                      <span className="filter-range-label">TO</span>
                      <select className="filter-select" value={outflowRangeTo} onChange={(e) => setOutflowRangeTo(e.target.value)}>
                        {outflowReportColumns.map(col => <option key={col} value={col}>{col}</option>)}
                      </select>
                    </div>
                  )}
                  {outflowFilterMode === 'specific' && (
                    <div className="filter-specific-controls">
                      <div className="filter-quick-actions">
                        <button className="filter-quick-btn" onClick={() => setOutflowSelectedReports(new Set(outflowReportColumns))}>ALL</button>
                        <button className="filter-quick-btn" onClick={() => setOutflowSelectedReports(new Set())}>NONE</button>
                      </div>
                      <div className="filter-report-checkboxes">
                        {outflowReportColumns.map(col => (
                          <label key={col} className="filter-checkbox-label">
                            <input type="checkbox" checked={outflowSelectedReports.has(col)} onChange={() => toggleStringReportSelection(col, setOutflowSelectedReports)} />
                            <span>{col}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Download Options */}
                <div className="download-bar">
                  <span className="download-label">DOWNLOAD:</span>
                  <button
                    className={`download-btn csv-btn ${!hasIga333Access ? 'locked' : ''}`}
                    onClick={() => hasIga333Access ? exportToCSV(outflowsData.categories.flatMap(cat =>
                      cat.items.map(item => ({
                        'Category': cat.name,
                        'Line Item': item.name,
                        ...Object.fromEntries(filteredOutflowColumns.map(col => [col, item.values[col]])),
                        'Total': item.total
                      }))
                    ), 'algorand-foundation-outflows') : handleLockedDownload()}
                  >
                    {!hasIga333Access && '🔒 '}CSV
                  </button>
                  <button
                    className={`download-btn xls-btn ${!hasIga333Access ? 'locked' : ''}`}
                    onClick={() => hasIga333Access ? exportToExcel(outflowsData.categories.flatMap(cat =>
                      cat.items.map(item => ({
                        'Category': cat.name,
                        'Line Item': item.name,
                        ...Object.fromEntries(filteredOutflowColumns.map(col => [col, item.values[col]])),
                        'Total': item.total
                      }))
                    ), 'algorand-foundation-outflows', 'Outflows') : handleLockedDownload()}
                  >
                    {!hasIga333Access && '🔒 '}XLS
                  </button>
                  <button
                    className={`download-btn pdf-btn ${!hasIga333Access ? 'locked' : ''}`}
                    onClick={() => hasIga333Access ? exportToPDF(
                      outflowsData.categories.flatMap(cat =>
                        cat.items.map(item => ({
                          'Category': cat.name,
                          'Line Item': item.name,
                          ...Object.fromEntries(filteredOutflowColumns.map(col => [col, item.values[col]])),
                          'Total': item.total
                        }))
                      ),
                      'algorand-foundation-outflows',
                      'ALGORAND FOUNDATION - ALL REPORTED OUTFLOWS',
                      `Generated ${new Date().toLocaleDateString()}`
                    ) : handleLockedDownload()}
                  >
                    {!hasIga333Access && '🔒 '}PDF
                  </button>
                  <button
                    className={`download-btn png-btn ${!hasIga333Access ? 'locked' : ''}`}
                    onClick={() => hasIga333Access ? exportToPNG('outflows-content', 'algorand-foundation-outflows') : handleLockedDownload()}
                  >
                    {!hasIga333Access && '🔒 '}PNG
                  </button>
                </div>

                <div className="data-table-container">
                  <div className="table-scroll-wrapper">
                    <table className="data-table outflows-table unified-outflows-table">
                      <thead>
                        <tr>
                          <th className="col-line-item">Line Item</th>
                          {filteredOutflowColumns.map(col => (
                            <th key={col} className="col-report-value">{col}</th>
                          ))}
                          <th className="col-total">TOTAL</th>
                        </tr>
                      </thead>
                      <tbody>
                        {outflowsData.categories.map((category, catIdx) => (
                          <React.Fragment key={catIdx}>
                            {/* Category Header Row */}
                            <tr className={`section-header-row category-header-row category-${catIdx}`}>
                              <td className="col-line-item section-header-cell">{category.name}</td>
                              {filteredOutflowColumns.map(col => (
                                <td key={col} className="section-header-cell"></td>
                              ))}
                              <td className="section-header-cell"></td>
                            </tr>
                            {/* Category Items */}
                            {category.items.map((item, itemIdx) => (
                              <tr key={itemIdx} className={`outflow-row ${item.isNew ? 'new-item' : ''} ${item.isCompleted ? 'completed-item' : ''} ${typeof item.total === 'number' && item.total < 0 ? 'inflow-row' : ''}`}>
                                <td className="col-line-item">
                                  {item.isNew && <span className="new-badge">🆕</span>}
                                  {item.isCompleted && <span className="completed-badge">✓</span>}
                                  {item.name}
                                </td>
                                {filteredOutflowColumns.map(col => {
                                  const value = item.values[col];
                                  const isNegative = typeof value === 'number' && value < 0;
                                  return (
                                    <td key={col} className={`col-report-value ${isNegative ? 'negative' : ''}`}>
                                      {value === 0 ? (
                                        <span className="zero-value">0</span>
                                      ) : typeof value === 'number' ? (
                                        formatCompact(value)
                                      ) : value}
                                    </td>
                                  );
                                })}
                                <td className={`col-total ${typeof item.total === 'number' && item.total < 0 ? 'negative' : ''}`}>
                                  {typeof item.total === 'number' ? formatCompact(item.total) : item.total}
                                </td>
                              </tr>
                            ))}
                            {/* Category Subtotal */}
                            <tr className="totals-row subtotal-row category-subtotal">
                              <td className="col-line-item totals-label">SUBTOTAL: {category.name}</td>
                              {filteredOutflowColumns.map(col => {
                                const catTotal = getCategoryTotal(category, col);
                                return (
                                  <td key={col} className="col-report-value">
                                    {catTotal !== 0 ? formatCompact(catTotal) : ''}
                                  </td>
                                );
                              })}
                              <td className="col-total">
                                {formatCompact(category.items.reduce((sum, item) => sum + (typeof item.total === 'number' ? item.total : 0), 0))}
                              </td>
                            </tr>
                            {/* Spacer Row */}
                            {catIdx < outflowsData.categories.length - 1 && (
                              <tr className="spacer-row">
                                <td className="col-line-item"></td>
                                {filteredOutflowColumns.map(col => (
                                  <td key={col}></td>
                                ))}
                                <td></td>
                              </tr>
                            )}
                            {/* Combined Inflows Total - after OTHER INFLOWS */}
                            {category.name === 'OTHER INFLOWS' && (() => {
                              const loanRepaymentsCat = outflowsData.categories.find(c => c.name === 'LOAN REPAYMENTS');
                              const otherInflowsCat = outflowsData.categories.find(c => c.name === 'OTHER INFLOWS');
                              
                              const getCombinedInflowTotal = (col: string) => {
                                let total = 0;
                                if (loanRepaymentsCat) {
                                  total += loanRepaymentsCat.items.reduce((sum, item) => {
                                    const val = item.values[col];
                                    return sum + (typeof val === 'number' ? val : 0);
                                  }, 0);
                                }
                                if (otherInflowsCat) {
                                  total += otherInflowsCat.items.reduce((sum, item) => {
                                    const val = item.values[col];
                                    return sum + (typeof val === 'number' ? val : 0);
                                  }, 0);
                                }
                                return total;
                              };
                              
                              const totalInflowsGrand = (loanRepaymentsCat?.items.reduce((sum, item) => sum + (typeof item.total === 'number' ? item.total : 0), 0) || 0) +
                                (otherInflowsCat?.items.reduce((sum, item) => sum + (typeof item.total === 'number' ? item.total : 0), 0) || 0);
                              
                              return (
                                <tr className="totals-row inflows-total-row">
                                  <td className="col-line-item totals-label inflows-total-label">TOTAL: ALL INFLOWS</td>
                                  {filteredOutflowColumns.map(col => {
                                    const total = getCombinedInflowTotal(col);
                                    return (
                                      <td key={col} className="col-report-value inflows-total-value">
                                        {total !== 0 ? formatCompact(total) : ''}
                                      </td>
                                    );
                                  })}
                                  <td className="col-total inflows-total-value">
                                    {formatCompact(totalInflowsGrand)}
                                  </td>
                                </tr>
                              );
                            })()}
                          </React.Fragment>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="totals-row grand-total-row">
                          <td className="col-line-item totals-label">GRAND TOTAL</td>
                          {filteredOutflowColumns.map(col => (
                            <td key={col} className="col-report-value">
                              {formatCompact(outflowsData.reportedTotals[col])}
                            </td>
                          ))}
                          <td className="col-total grand-total">
                            {formatCompact(outflowsData.grandTotal)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
                </div> {/* Close outflows-content wrapper */}
              </div>
            );
            })()}

            {/* Fiat/USD Expense Sub-Tab */}
            {activeDataSubTab === 'fiat-expense' && (
              <div className="fiat-expense-section">
                <div className="section-header">
                  <h2 className="section-title">{fiatExpenseData.title}</h2>
                </div>

                {/* Wrapper for PNG export - includes summary cards, note, and main table */}
                <div id="fiat-content">
                  {/* PNG Export Title (hidden by default, shown during export) */}
                  <div className="png-export-title">
                    <h1 style={{ textAlign: 'center', margin: '20px 0', color: 'var(--neon-cyan)' }}>
                      ALGORAND FOUNDATION - FIAT/USD EXPENSES
                    </h1>
                  </div>

                {/* Summary Boxes */}
                <div className="fiat-summary-cards">
                  <div className="summary-card yellow-card">
                    <div className="card-icon">$</div>
                    <div className="card-content">
                      <span className="card-label">CUMULATIVE FIAT EXPENSES</span>
                      <span className="card-value">{formatUSD(fiatExpenseData.cumulativeTotal.R18 || 0)}</span>
                    </div>
                  </div>
                  <div className="summary-card green-card">
                    <div className="card-icon">$</div>
                    <div className="card-content">
                      <span className="card-label">USD INVESTMENTS (CURRENT)</span>
                      <span className="card-value">{formatUSD(fiatExpenseData.usdInvestmentsTracking[fiatExpenseData.usdInvestmentsTracking.length - 1].amount)}</span>
                    </div>
                  </div>
                  <div className="summary-card red-card">
                    <div className="card-icon">$</div>
                    <div className="card-content">
                      <span className="card-label">CHANGE R17 → R18</span>
                      <span className="card-value">{formatUSD(fiatExpenseData.changeR17R18)}</span>
                    </div>
                  </div>
                </div>

                {/* Report Filter */}
                <div className="obs-filter-bar">
                  <span className="filter-label">FILTER:</span>
                  <div className="filter-mode-buttons">
                    <button className={`filter-mode-btn ${fiatFilterMode === 'all' ? 'active' : ''}`} onClick={() => setFiatFilterMode('all')}>ALL</button>
                    <button className={`filter-mode-btn ${fiatFilterMode === 'range' ? 'active' : ''}`} onClick={() => setFiatFilterMode('range')}>RANGE</button>
                    <button className={`filter-mode-btn ${fiatFilterMode === 'specific' ? 'active' : ''}`} onClick={() => setFiatFilterMode('specific')}>SELECT</button>
                  </div>
                  {fiatFilterMode === 'range' && (
                    <div className="filter-range-controls">
                      <span className="filter-range-label">FROM</span>
                      <select className="filter-select" value={fiatRangeFrom} onChange={(e) => setFiatRangeFrom(e.target.value)}>
                        {fiatReportColumns.map(col => <option key={col} value={col}>{col}</option>)}
                      </select>
                      <span className="filter-range-label">TO</span>
                      <select className="filter-select" value={fiatRangeTo} onChange={(e) => setFiatRangeTo(e.target.value)}>
                        {fiatReportColumns.map(col => <option key={col} value={col}>{col}</option>)}
                      </select>
                    </div>
                  )}
                  {fiatFilterMode === 'specific' && (
                    <div className="filter-specific-controls">
                      <div className="filter-quick-actions">
                        <button className="filter-quick-btn" onClick={() => setFiatSelectedReports(new Set(fiatReportColumns))}>ALL</button>
                        <button className="filter-quick-btn" onClick={() => setFiatSelectedReports(new Set())}>NONE</button>
                      </div>
                      <div className="filter-report-checkboxes">
                        {fiatReportColumns.map(col => (
                          <label key={col} className="filter-checkbox-label">
                            <input type="checkbox" checked={fiatSelectedReports.has(col)} onChange={() => toggleStringReportSelection(col, setFiatSelectedReports)} />
                            <span>{col}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Download Options */}
                <div className="download-bar">
                  <span className="download-label">DOWNLOAD:</span>
                  <button
                    className={`download-btn csv-btn ${!hasIga333Access ? 'locked' : ''}`}
                    onClick={() => hasIga333Access ? exportToCSV([
                      ...fiatExpenseData.oldFormat.map(item => ({
                        'Category': 'OLD FORMAT',
                        'Line Item': item.name,
                        ...Object.fromEntries(filteredFiatColumns.map(col => [col, item.values[col]])),
                        'Total': item.total
                      })),
                      ...fiatExpenseData.newFormat.map(item => ({
                        'Category': 'NEW FORMAT',
                        'Line Item': item.name,
                        ...Object.fromEntries(filteredFiatColumns.map(col => [col, item.values[col]])),
                        'Total': item.total
                      }))
                    ], 'algorand-foundation-fiat-expense') : handleLockedDownload()}
                  >
                    {!hasIga333Access && '🔒 '}CSV
                  </button>
                  <button
                    className={`download-btn xls-btn ${!hasIga333Access ? 'locked' : ''}`}
                    onClick={() => hasIga333Access ? exportToExcel([
                      ...fiatExpenseData.oldFormat.map(item => ({
                        'Category': 'OLD FORMAT',
                        'Line Item': item.name,
                        ...Object.fromEntries(filteredFiatColumns.map(col => [col, item.values[col]])),
                        'Total': item.total
                      })),
                      ...fiatExpenseData.newFormat.map(item => ({
                        'Category': 'NEW FORMAT',
                        'Line Item': item.name,
                        ...Object.fromEntries(filteredFiatColumns.map(col => [col, item.values[col]])),
                        'Total': item.total
                      }))
                    ], 'algorand-foundation-fiat-expense', 'Fiat Expense') : handleLockedDownload()}
                  >
                    {!hasIga333Access && '🔒 '}XLS
                  </button>
                  <button
                    className={`download-btn pdf-btn ${!hasIga333Access ? 'locked' : ''}`}
                    onClick={() => hasIga333Access ? exportToPDF(
                      [
                        ...fiatExpenseData.oldFormat.map(item => ({
                          'Category': 'OLD FORMAT',
                          'Line Item': item.name,
                          ...Object.fromEntries(filteredFiatColumns.map(col => [col, item.values[col]])),
                          'Total': item.total
                        })),
                        ...fiatExpenseData.newFormat.map(item => ({
                          'Category': 'NEW FORMAT',
                          'Line Item': item.name,
                          ...Object.fromEntries(filteredFiatColumns.map(col => [col, item.values[col]])),
                          'Total': item.total
                        }))
                      ],
                      'algorand-foundation-fiat-expense',
                      'ALGORAND FOUNDATION - FIAT/USD EXPENSES',
                      `Generated ${new Date().toLocaleDateString()}`
                    ) : handleLockedDownload()}
                  >
                    {!hasIga333Access && '🔒 '}PDF
                  </button>
                  <button
                    className={`download-btn png-btn ${!hasIga333Access ? 'locked' : ''}`}
                    onClick={() => hasIga333Access ? exportToPNG('fiat-content', 'algorand-foundation-fiat-expense') : handleLockedDownload()}
                  >
                    {!hasIga333Access && '🔒 '}PNG
                  </button>
                </div>

                <div className="data-note">
                  <span className="note-icon">⚠</span>
                  <p>{fiatExpenseData.note}</p>
                </div>

                {/* Unified Fiat Expense Table */}
                <div className="data-table-container">
                  <div className="table-scroll-wrapper">
                    <table className="data-table fiat-table unified-fiat-table">
                      <thead>
                        <tr>
                          <th className="col-category">Category</th>
                          {filteredFiatColumns.map(col => (
                            <th key={col} className="col-report-value">{col}</th>
                          ))}
                          <th className="col-total">TOTAL</th>
                          <th className="col-notes">Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Old Format Section Header */}
                        <tr className="section-header-row old-format-header">
                          <td className="col-category section-header-cell">OLD FORMAT (R4-R7)</td>
                          {filteredFiatColumns.map(col => (
                            <td key={col} className="section-header-cell"></td>
                          ))}
                          <td className="section-header-cell"></td>
                          <td className="section-header-cell"></td>
                        </tr>
                        {/* Old Format Items */}
                        {fiatExpenseData.oldFormat.map((item, idx) => (
                          <tr key={`old-${idx}`} className="fiat-row">
                            <td className="col-category">{item.name}</td>
                            {filteredFiatColumns.map(col => {
                              const value = item.values[col];
                              return (
                                <td key={col} className="col-report-value">
                                  {value === null ? (
                                    <span className="arrow-continue">→</span>
                                  ) : value === "N/R" ? (
                                    <span className="not-reported">N/R</span>
                                  ) : typeof value === 'number' ? (
                                    formatUSD(value)
                                  ) : value}
                                </td>
                              );
                            })}
                            <td className="col-total">{typeof item.total === 'number' ? formatUSD(item.total) : item.total}</td>
                            <td className="col-notes"></td>
                          </tr>
                        ))}
                        {/* Old Format Subtotal */}
                        <tr className="totals-row subtotal-row">
                          <td className="col-category totals-label">SUBTOTAL OLD FORMAT</td>
                          {filteredFiatColumns.map(col => {
                            const value = fiatExpenseData.oldFormatSubtotal[col];
                            return (
                              <td key={col} className="col-report-value">
                                {value === null ? '' : formatUSD(value)}
                              </td>
                            );
                          })}
                          <td className="col-total">{formatUSD(170000000)}</td>
                          <td className="col-notes"></td>
                        </tr>

                        {/* Spacer Row */}
                        <tr className="spacer-row">
                          <td className="col-category"></td>
                          {filteredFiatColumns.map(col => (
                            <td key={col}></td>
                          ))}
                          <td></td>
                          <td></td>
                        </tr>

                        {/* New Format Section Header */}
                        <tr className="section-header-row new-format-header">
                          <td className="col-category section-header-cell">NEW FORMAT (R8+)</td>
                          {filteredFiatColumns.map(col => (
                            <td key={col} className="section-header-cell"></td>
                          ))}
                          <td className="section-header-cell"></td>
                          <td className="section-header-cell"></td>
                        </tr>
                        {/* New Format Items */}
                        {fiatExpenseData.newFormat.map((item, idx) => (
                          <tr key={`new-${idx}`} className="fiat-row">
                            <td className="col-category">{item.name}</td>
                            {filteredFiatColumns.map(col => {
                              const value = item.values[col];
                              const isNegative = typeof value === 'number' && value < 0;
                              return (
                                <td key={col} className={`col-report-value ${isNegative ? 'negative' : ''}`}>
                                  {value === null ? '' : typeof value === 'number' ? formatUSD(value) : value}
                                </td>
                              );
                            })}
                            <td className="col-total">{typeof item.total === 'number' ? formatUSD(item.total) : item.total}</td>
                            <td className="col-notes">{item.notes || ''}</td>
                          </tr>
                        ))}
                        {/* New Format Subtotal */}
                        <tr className="totals-row subtotal-row new-format-subtotal">
                          <td className="col-category totals-label">SUBTOTAL NEW FORMAT</td>
                          {filteredFiatColumns.map(col => {
                            const value = fiatExpenseData.newFormatSubtotal[col];
                            return (
                              <td key={col} className="col-report-value">
                                {value === null ? '' : formatUSD(value)}
                              </td>
                            );
                          })}
                          <td className="col-total">{formatUSD(127167000)}</td>
                          <td className="col-notes trend-down">DOWN 2.4%</td>
                        </tr>

                        {/* Spacer Row */}
                        <tr className="spacer-row">
                          <td className="col-category"></td>
                          {filteredFiatColumns.map(col => (
                            <td key={col}></td>
                          ))}
                          <td></td>
                          <td></td>
                        </tr>

                        {/* Cumulative Total */}
                        <tr className="totals-row cumulative-row">
                          <td className="col-category totals-label">CUMULATIVE TOTAL</td>
                          {filteredFiatColumns.map(col => {
                            const value = fiatExpenseData.cumulativeTotal[col];
                            return (
                              <td key={col} className="col-report-value">
                                {value === null ? '' : formatUSD(value)}
                              </td>
                            );
                          })}
                          <td className="col-total grand-total">{formatUSD(297167000)}</td>
                          <td className="col-notes"></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                </div> {/* Close fiat-content wrapper */}

                {/* Crypto Crisis Losses */}
                <div className="data-table-container crisis-section">
                  <h3 className="table-section-title crisis-title">CRYPTO CRISIS LOSSES (Marked to Zero)</h3>
                  <div className="crisis-cards">
                    {fiatExpenseData.cryptoLosses.map((loss, idx) => (
                      <div key={idx} className="crisis-card">
                        <div className="crisis-name">{loss.name}</div>
                        <div className="crisis-amount">{formatUSD(loss.amount)}</div>
                        <div className="crisis-desc">{loss.description}</div>
                      </div>
                    ))}
                    <div className="crisis-card total-card">
                      <div className="crisis-name">TOTAL CRYPTO LOSSES</div>
                      <div className="crisis-amount">{formatUSD(fiatExpenseData.totalCryptoLosses)}</div>
                      <div className="crisis-desc">All marked to zero - recovery = windfall</div>
                    </div>
                  </div>
                </div>

                {/* Arrington Capital Fund Collapse */}
                <div className="data-table-container arrington-section">
                  <h3 className="table-section-title arrington-title">⚠️ ARRINGTON CAPITAL FUND COLLAPSE (R11)</h3>
                  <div className="arrington-details">
                    <div className="arrington-row">
                      <span className="arrington-label">Original Investment (Early 2022)</span>
                      <span className="arrington-value">{formatUSD(fiatExpenseData.arringtonCollapse.originalInvestment.amount)}</span>
                      <span className="arrington-desc">{fiatExpenseData.arringtonCollapse.originalInvestment.description}</span>
                    </div>
                    <div className="arrington-row returned">
                      <span className="arrington-label">Returned to Foundation</span>
                      <span className="arrington-value">{formatUSD(fiatExpenseData.arringtonCollapse.returnedToFoundation.amount)}</span>
                      <span className="arrington-desc">{fiatExpenseData.arringtonCollapse.returnedToFoundation.description}</span>
                    </div>
                    <div className="arrington-row">
                      <span className="arrington-label">Illiquid SAFEs/SAFTs (pending)</span>
                      <span className="arrington-value">{formatUSD(fiatExpenseData.arringtonCollapse.illiquidSAFEs.amount)}</span>
                      <span className="arrington-desc">{fiatExpenseData.arringtonCollapse.illiquidSAFEs.description}</span>
                    </div>
                    <div className="arrington-row write-off">
                      <span className="arrington-label">⚠️ TOTAL WRITE-OFF</span>
                      <span className="arrington-value">{formatUSD(fiatExpenseData.arringtonCollapse.totalWriteOff.amount)}</span>
                      <span className="arrington-desc">{fiatExpenseData.arringtonCollapse.totalWriteOff.description}</span>
                    </div>
                    <div className="arrington-statements">
                      <div className="statement">
                        <strong>CFO Statement:</strong> "{fiatExpenseData.arringtonCollapse.cfoStatement}"
                      </div>
                      <div className="statement">
                        <strong>Action:</strong> "{fiatExpenseData.arringtonCollapse.action}"
                      </div>
                      <div className="statement">
                        <strong>NDA Released:</strong> "{fiatExpenseData.arringtonCollapse.ndaReleased}"
                      </div>
                    </div>
                  </div>
                </div>

                {/* USD Investments Tracking */}
                <div className="data-table-container investments-section">
                  <h3 className="table-section-title">USD INVESTMENTS TRACKING</h3>
                  <div className="investments-timeline">
                    {fiatExpenseData.usdInvestmentsTracking.map((item, idx) => (
                      <div key={idx} className={`investment-item ${item.isWarning ? 'warning' : ''}`}>
                        <span className="investment-period">{item.period}</span>
                        <span className="investment-amount">{formatUSD(item.amount)}</span>
                        <span className="investment-notes">{item.isWarning && '⚠️ '}{item.notes}</span>
                      </div>
                    ))}
                    <div className="investment-item change-row">
                      <span className="investment-period">CHANGE R17→R18</span>
                      <span className="investment-amount negative">{formatUSD(fiatExpenseData.changeR17R18)}</span>
                      <span className="investment-notes">Stable post-Arrington ✓</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Loans Sub-Tab */}
            {activeDataSubTab === 'loans' && (
              <div className="loans-section">
                <div className="section-header">
                  <h2 className="section-title">LOANS TRACKING</h2>
                  <p className="section-description">All known loans issued by the Algorand Foundation</p>
                </div>

                {/* Wrapper for PNG export - includes stats cards, table, and legend */}
                <div id="loans-content">
                  {/* PNG Export Title (hidden by default, shown during export) */}
                  <div className="png-export-title">
                    <h1 style={{ textAlign: 'center', margin: '20px 0', color: 'var(--neon-cyan)' }}>
                      ALGORAND FOUNDATION - LOANS TRACKING
                    </h1>
                  </div>

                {/* Loans Stats Cards */}
                {(() => {
                  // Calculate active loan statistics
                  const activeLoans = loansData.filter(l => l.status === 'ACTIVE');
                  const noUpdateLoans = loansData.filter(l => l.status === 'NO UPDATE');
                  const convertibleLoans = loansData.filter(l => l.status === 'CONVERTIBLE');
                  const claimLoans = loansData.filter(l => l.status === 'CLAIM ONLY');
                  
                  // Parse ALGO amounts from active loans
                  let totalActiveAlgo = 0;
                  let totalActiveUsd = 0;
                  
                  activeLoans.forEach(loan => {
                    const amt = loan.outstanding;
                    // Check for ALGO
                    if (amt.includes('ALGO')) {
                      const num = parseFloat(amt.replace(/[^0-9.]/g, '')) || 0;
                      if (amt.includes('M')) totalActiveAlgo += num * 1000000;
                      else if (amt.includes('K')) totalActiveAlgo += num * 1000;
                      else totalActiveAlgo += num;
                    } 
                    // Check for USD or USDC (combine both)
                    else if (amt.includes('USD') || amt.includes('$') || amt.includes('USDC')) {
                      const num = parseFloat(amt.replace(/[^0-9.]/g, '')) || 0;
                      if (amt.includes('M')) totalActiveUsd += num * 1000000;
                      else if (amt.includes('K')) totalActiveUsd += num * 1000;
                      else totalActiveUsd += num;
                    }
                  });
                  
                  // No Update loans (Strategic Partners)
                  let noUpdateAlgo = 0;
                  noUpdateLoans.forEach(loan => {
                    const amt = loan.originalAmount;
                    const num = parseFloat(amt.replace(/[^0-9.]/g, '')) || 0;
                    if (amt.includes('M')) noUpdateAlgo += num * 1000000;
                    else if (amt.includes('K')) noUpdateAlgo += num * 1000;
                    else noUpdateAlgo += num;
                  });

                  // Format USD in millions
                  const formatUsdMillions = (amount: number) => {
                    if (amount >= 1000000) {
                      return `$${(amount / 1000000).toFixed(2)}M`;
                    } else if (amount >= 1000) {
                      return `$${(amount / 1000000).toFixed(2)}M`;
                    }
                    return `$${amount.toLocaleString()}`;
                  };

                  return (
                    <div className="loans-stats-grid">
                      <div className="loan-stat-card active-card">
                        <div className="stat-icon">📋</div>
                        <div className="stat-content">
                          <span className="stat-label">ACTIVE LOANS</span>
                          <span className="stat-value">{activeLoans.length}</span>
                          <span className="stat-detail">{formatAlgo(totalActiveAlgo)} ALGO + {formatUsdMillions(totalActiveUsd)} USD</span>
                        </div>
                      </div>
                      
                      <div className="loan-stat-card warning-card">
                        <div className="stat-icon">⚠️</div>
                        <div className="stat-content">
                          <span className="stat-label">NO UPDATE (3+ YRS)</span>
                          <span className="stat-value">{noUpdateLoans.length}</span>
                          <span className="stat-detail">{formatAlgo(noUpdateAlgo)} ALGO unknown status</span>
                        </div>
                      </div>
                      
                      <div className="loan-stat-card convertible-card">
                        <div className="stat-icon">🔄</div>
                        <div className="stat-content">
                          <span className="stat-label">CONVERTIBLE</span>
                          <span className="stat-value">{convertibleLoans.length}</span>
                          <span className="stat-detail">May convert to equity</span>
                        </div>
                      </div>
                      
                      <div className="loan-stat-card claim-card">
                        <div className="stat-icon">💀</div>
                        <div className="stat-content">
                          <span className="stat-label">CLAIM ONLY (LOSS)</span>
                          <span className="stat-value">{claimLoans.length}</span>
                          <span className="stat-detail">&gt;$50M written off (3AC)</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Download Options */}
                <div className="download-bar">
                  <span className="download-label">DOWNLOAD:</span>
                  <button
                    className={`download-btn csv-btn ${!hasIga333Access ? 'locked' : ''}`}
                    onClick={() => hasIga333Access ? exportToCSV(loansData.map(loan => ({
                      'Borrower': loan.borrower,
                      'Original Amount': loan.originalAmount,
                      'When Made': loan.whenMade,
                      'When Repaid': loan.whenRepaid,
                      'Repaid Amount': loan.repaidAmt,
                      'Outstanding': loan.outstanding,
                      'Status': loan.status,
                      'Notes': loan.notes
                    })), 'algorand-foundation-loans') : handleLockedDownload()}
                  >
                    {!hasIga333Access && '🔒 '}CSV
                  </button>
                  <button
                    className={`download-btn xls-btn ${!hasIga333Access ? 'locked' : ''}`}
                    onClick={() => hasIga333Access ? exportToExcel(loansData.map(loan => ({
                      'Borrower': loan.borrower,
                      'Original Amount': loan.originalAmount,
                      'When Made': loan.whenMade,
                      'When Repaid': loan.whenRepaid,
                      'Repaid Amount': loan.repaidAmt,
                      'Outstanding': loan.outstanding,
                      'Status': loan.status,
                      'Notes': loan.notes
                    })), 'algorand-foundation-loans', 'Loans') : handleLockedDownload()}
                  >
                    {!hasIga333Access && '🔒 '}XLS
                  </button>
                  <button
                    className={`download-btn pdf-btn ${!hasIga333Access ? 'locked' : ''}`}
                    onClick={() => hasIga333Access ? exportToPDF(
                      loansData.map(loan => ({
                        'Borrower': loan.borrower,
                        'Original Amount': loan.originalAmount,
                        'When Made': loan.whenMade,
                        'When Repaid': loan.whenRepaid,
                        'Repaid Amount': loan.repaidAmt,
                        'Outstanding': loan.outstanding,
                        'Status': loan.status,
                        'Notes': loan.notes
                      })),
                      'algorand-foundation-loans',
                      'ALGORAND FOUNDATION - LOANS TRACKING',
                      `Generated ${new Date().toLocaleDateString()}`
                    ) : handleLockedDownload()}
                  >
                    {!hasIga333Access && '🔒 '}PDF
                  </button>
                  <button
                    className={`download-btn png-btn ${!hasIga333Access ? 'locked' : ''}`}
                    onClick={() => hasIga333Access ? exportToPNG('loans-content', 'algorand-foundation-loans') : handleLockedDownload()}
                  >
                    {!hasIga333Access && '🔒 '}PNG
                  </button>
                </div>

                <div className="data-note">
                  <span className="note-icon">ℹ</span>
                  <p>R8 is FIRST report to disclose loan details</p>
                </div>

                <div className="data-table-container">
                  <div className="table-scroll-wrapper">
                    <table className="data-table loans-table">
                      <thead>
                        <tr>
                          <th className="col-borrower">Borrower</th>
                          <th className="col-amount">Original Amount</th>
                          <th className="col-when">When Made</th>
                          <th className="col-when">When Repaid</th>
                          <th className="col-amount">Repaid Amt</th>
                          <th className="col-amount">Outstanding</th>
                          <th className="col-status">Status</th>
                          <th className="col-notes">Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loansData.map((loan, idx) => (
                          <tr key={idx} className="loan-row">
                            <td className="col-borrower">{loan.borrower}</td>
                            <td className="col-amount">{loan.originalAmount}</td>
                            <td className="col-when">{loan.whenMade}</td>
                            <td className="col-when">
                              {loan.whenRepaid === '???' ? (
                                <span className="unknown-value">???</span>
                              ) : loan.whenRepaid}
                            </td>
                            <td className="col-amount">{loan.repaidAmt}</td>
                            <td className="col-amount">{loan.outstanding}</td>
                            <td className="col-status">
                              <span 
                                className="status-badge"
                                style={{ 
                                  backgroundColor: statusColors[loan.status],
                                  color: '#000'
                                }}
                              >
                                {loan.status}{loan.statusReport ? ` ${loan.statusReport}` : ''}
                              </span>
                            </td>
                            <td className="col-notes">{loan.notes}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Loans Legend */}
                <div className="loans-legend">
                  <h4 className="legend-title">STATUS KEY:</h4>
                  <div className="legend-items">
                    <div className="legend-item">
                      <span className="legend-color" style={{ backgroundColor: statusColors['REPAID'] }}></span>
                      <span>REPAID</span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-color" style={{ backgroundColor: statusColors['FULLY REPAID'] }}></span>
                      <span>FULLY REPAID</span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-color" style={{ backgroundColor: statusColors['ACTIVE'] }}></span>
                      <span>ACTIVE</span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-color" style={{ backgroundColor: statusColors['CONVERTIBLE'] }}></span>
                      <span>CONVERTIBLE</span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-color" style={{ backgroundColor: statusColors['MATURED'] }}></span>
                      <span>MATURED</span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-color" style={{ backgroundColor: statusColors['CLAIM ONLY'] }}></span>
                      <span>CLAIM ONLY</span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-color" style={{ backgroundColor: statusColors['NO UPDATE'] }}></span>
                      <span>NO UPDATE</span>
                    </div>
                  </div>
                </div>
                </div> {/* Close loans-content wrapper */}
              </div>
            )}

            {/* Pool Tracking Sub-Tab */}
            {activeDataSubTab === 'pool-tracking' && (
              <div className="pool-tracking-section">
                <div className="section-header">
                  <h2 className="section-title">FOUNDATION ALGO POOL TRACKING</h2>
                  <p className="section-description">Opening → Distributions → Inflows → Closing → Discrepancy Analysis</p>
                </div>

                {/* Pool Tracking Stats */}
                {(() => {
                  const summary = getPoolTrackingSummary();
                  return (
                    <div className="pool-stats-grid">
                      <div className="pool-stat-box">
                        <span className="pool-stat-value">{summary.latestClosing !== null ? formatCompact(summary.latestClosing) : 'N/A'}</span>
                        <span className="pool-stat-label">CURRENT HOLDINGS</span>
                      </div>
                      <div className="pool-stat-box">
                        <span className="pool-stat-value">{formatCompact(summary.totalDistributions)}</span>
                        <span className="pool-stat-label">TOTAL DISTRIBUTED</span>
                      </div>
                      <div className="pool-stat-box">
                        <span className="pool-stat-value">{formatCompact(summary.totalInflows)}</span>
                        <span className="pool-stat-label">TOTAL INFLOWS</span>
                      </div>
                      <div className="pool-stat-box match-box">
                        <span className="pool-stat-value">{summary.matchingPeriods}</span>
                        <span className="pool-stat-label">EXACT MATCHES</span>
                      </div>
                      <div className="pool-stat-box close-box">
                        <span className="pool-stat-value">{summary.closeMatchPeriods}</span>
                        <span className="pool-stat-label">CLOSE MATCHES</span>
                      </div>
                      <div className="pool-stat-box discrepancy-box">
                        <span className="pool-stat-value">{summary.discrepancyPeriods}</span>
                        <span className="pool-stat-label">DISCREPANCIES</span>
                      </div>
                    </div>
                  );
                })()}

                {/* Download Options */}
                <div className="download-bar">
                  <span className="download-label">DOWNLOAD:</span>
                  <button
                    className={`download-btn csv-btn ${!hasIga333Access ? 'locked' : ''}`}
                    onClick={() => hasIga333Access ? exportToCSV(poolTrackingData.map(period => ({
                      'Period': period.period,
                      'Opening': period.opening,
                      'Distributions': period.distributions,
                      'Inflows': period.inflows,
                      'Closing': period.closing,
                      'Calculated': period.calculated,
                      'Difference': period.difference,
                      'Notes': period.notes
                    })), 'algorand-foundation-pool-tracking') : handleLockedDownload()}
                  >
                    {!hasIga333Access && '🔒 '}CSV
                  </button>
                  <button
                    className={`download-btn xls-btn ${!hasIga333Access ? 'locked' : ''}`}
                    onClick={() => hasIga333Access ? exportToExcel(poolTrackingData.map(period => ({
                      'Period': period.period,
                      'Opening': period.opening,
                      'Distributions': period.distributions,
                      'Inflows': period.inflows,
                      'Closing': period.closing,
                      'Calculated': period.calculated,
                      'Difference': period.difference,
                      'Notes': period.notes
                    })), 'algorand-foundation-pool-tracking', 'Pool Tracking') : handleLockedDownload()}
                  >
                    {!hasIga333Access && '🔒 '}XLS
                  </button>
                  <button
                    className={`download-btn pdf-btn ${!hasIga333Access ? 'locked' : ''}`}
                    onClick={() => hasIga333Access ? exportToPDF(
                      poolTrackingData.map(period => ({
                        'Period': period.period,
                        'Opening': period.opening,
                        'Distributions': period.distributions,
                        'Inflows': period.inflows,
                        'Closing': period.closing,
                        'Calculated': period.calculated,
                        'Difference': period.difference,
                        'Notes': period.notes
                      })),
                      'algorand-foundation-pool-tracking',
                      'ALGORAND FOUNDATION - POOL TRACKING',
                      `Generated ${new Date().toLocaleDateString()}`
                    ) : handleLockedDownload()}
                  >
                    {!hasIga333Access && '🔒 '}PDF
                  </button>
                  <button
                    className={`download-btn png-btn ${!hasIga333Access ? 'locked' : ''}`}
                    onClick={() => hasIga333Access ? exportToPNG('data-content', 'algorand-foundation-pool-tracking') : handleLockedDownload()}
                  >
                    {!hasIga333Access && '🔒 '}PNG
                  </button>
                </div>

                {/* Pool Tracking Table */}
                <div className="data-table-container pool-table-container">
                  <div className="table-scroll-wrapper">
                    <table className="data-table pool-tracking-table">
                      <thead>
                        <tr>
                          <th className="period-col">PERIOD</th>
                          <th className="num-col">OPENING</th>
                          <th className="num-col">DISTRIBUTIONS</th>
                          <th className="num-col">INFLOWS</th>
                          <th className="num-col">CLOSING</th>
                          <th className="num-col">CALCULATED</th>
                          <th className="num-col">DIFFERENCE</th>
                          <th className="notes-col">NOTES</th>
                        </tr>
                      </thead>
                      <tbody>
                        {poolTrackingData.map((row, idx) => (
                          <tr key={idx} className={row.flag ? `row-${row.flag}` : ''}>
                            <td className="period-col">{row.period}</td>
                            <td className="num-col">{row.opening !== null ? formatCompact(row.opening) : 'N/A'}</td>
                            <td className="num-col outflow-val">{formatCompact(row.distributions)}</td>
                            <td className="num-col inflow-val">{row.inflows > 0 ? formatCompact(row.inflows) : '—'}</td>
                            <td className="num-col">{row.closing !== null ? formatCompact(row.closing) : 'N/A'}</td>
                            <td className="num-col">{row.calculated !== null ? formatCompact(row.calculated) : 'N/A'}</td>
                            <td className={`num-col diff-col ${row.difference === 0 ? 'match' : row.difference !== null && row.difference < 0 ? 'negative' : ''}`}>
                              {row.difference !== null ? (row.difference === 0 ? '✓' : formatCompact(row.difference)) : 'N/A'}
                            </td>
                            <td className="notes-col">
                              {row.flag === 'success' && <span className="note-icon">✓</span>}
                              {row.flag === 'error' && <span className="note-icon warning">⚠</span>}
                              {row.notes}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Formula Explanation */}
                <div className="formula-box">
                  <div className="formula-title">CALCULATION FORMULA</div>
                  <div className="formula-content">
                    <span className="formula-text">CALCULATED = OPENING - DISTRIBUTIONS + INFLOWS</span>
                    <span className="formula-text">DIFFERENCE = CLOSING - CALCULATED</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {activeTab === 'flags' && (
          <div className="flags-tab" id="flags-content">
            {/* Title for PNG export (hidden on screen) */}
            <div className="png-export-title">
              <h1>ALGORAND FOUNDATION</h1>
              <p>FLAGS & ISSUES TRACKER</p>
            </div>

            <div className="section-header">
              <h2 className="section-title">FLAGS & ISSUES TRACKER</h2>
              <p className="section-description">Issues identified that need explanation or further investigation</p>
            </div>

            {/* Stats Overview */}
            <div className="flags-stats">
              <div className="flag-stat red-stat">
                <span className="stat-count">{flagStats.high}</span>
                <span className="stat-label">RED FLAGS</span>
              </div>
              <div className="flag-stat yellow-stat">
                <span className="stat-count">{flagStats.medium}</span>
                <span className="stat-label">YELLOW FLAGS</span>
              </div>
              <div className="flag-stat green-stat">
                <span className="stat-count">{flagStats.resolved}</span>
                <span className="stat-label">GREEN FLAGS</span>
              </div>
              <div className="flag-stat total-stat">
                <span className="stat-count">{flagStats.total}</span>
                <span className="stat-label">TOTAL TRACKED</span>
              </div>
            </div>

            {/* Severity Filter */}
            <div className="flags-filter-bar">
              <span className="filter-label">FILTER BY SEVERITY:</span>
              <div className="severity-filter-buttons">
                <button 
                  className={`severity-filter-btn high ${flagsSeverityFilter.has('HIGH') ? 'active' : ''}`}
                  onClick={() => toggleSeverityFilter('HIGH')}
                >
                  🔴 RED
                </button>
                <button 
                  className={`severity-filter-btn medium ${flagsSeverityFilter.has('MEDIUM') ? 'active' : ''}`}
                  onClick={() => toggleSeverityFilter('MEDIUM')}
                >
                  🟡 YELLOW
                </button>
                <button 
                  className={`severity-filter-btn low ${flagsSeverityFilter.has('LOW') ? 'active' : ''}`}
                  onClick={() => toggleSeverityFilter('LOW')}
                >
                  🟠 LOW
                </button>
                <button 
                  className={`severity-filter-btn resolved ${flagsSeverityFilter.has('RESOLVED') ? 'active' : ''}`}
                  onClick={() => toggleSeverityFilter('RESOLVED')}
                >
                  🟢 RESOLVED
                </button>
              </div>
              <div className="filter-quick-actions">
                <button className="filter-quick-btn" onClick={selectAllSeverities}>ALL</button>
                <button className="filter-quick-btn" onClick={clearAllSeverities}>NONE</button>
              </div>
              <span className="filter-result-count">
                {filteredFlags.length} of {flagsData.length} flags
              </span>
            </div>

            {/* Download Options */}
            <div className="download-bar">
              <span className="download-label">DOWNLOAD:</span>
              <button 
                className={`download-btn csv-btn ${!hasIga333Access ? 'locked' : ''}`}
                onClick={() => hasIga333Access ? exportToCSV(formatFlagsForExport(sortedFlags), 'algorand-foundation-flags') : handleLockedDownload()}
              >
                {!hasIga333Access && '🔒 '}CSV
              </button>
              <button 
                className={`download-btn xls-btn ${!hasIga333Access ? 'locked' : ''}`}
                onClick={() => hasIga333Access ? exportToExcel(formatFlagsForExport(sortedFlags), 'algorand-foundation-flags', 'Flags') : handleLockedDownload()}
              >
                {!hasIga333Access && '🔒 '}XLS
              </button>
              <button 
                className={`download-btn pdf-btn ${!hasIga333Access ? 'locked' : ''}`}
                onClick={() => hasIga333Access ? exportToPDF(
                  formatFlagsForExport(sortedFlags), 
                  'algorand-foundation-flags',
                  'ALGORAND FOUNDATION - FLAGS & ISSUES',
                  `Generated ${new Date().toLocaleDateString()}`
                ) : handleLockedDownload()}
              >
                {!hasIga333Access && '🔒 '}PDF
              </button>
              <button 
                className={`download-btn png-btn ${!hasIga333Access ? 'locked' : ''}`}
                onClick={() => hasIga333Access ? exportToPNG('flags-content', 'algorand-foundation-flags') : handleLockedDownload()}
              >
                {!hasIga333Access && '🔒 '}PNG
              </button>
            </div>

            {/* Unified Flags Table */}
            <div className="data-table-container flags-table-container">
              <div className="table-scroll-wrapper">
                <table className="data-table flags-table">
                  <thead>
                    <tr>
                      <th 
                        className="col-issue sortable" 
                        onClick={() => handleFlagSort('issueNum')}
                      >
                        Issue # {flagSortColumn === 'issueNum' && (flagSortDirection === 'asc' ? '▲' : '▼')}
                      </th>
                      <th 
                        className="col-category sortable" 
                        onClick={() => handleFlagSort('category')}
                      >
                        Category {flagSortColumn === 'category' && (flagSortDirection === 'asc' ? '▲' : '▼')}
                      </th>
                      <th className="col-description">Description</th>
                      <th 
                        className="col-severity sortable" 
                        onClick={() => handleFlagSort('severity')}
                      >
                        Severity {flagSortColumn === 'severity' && (flagSortDirection === 'asc' ? '▲' : '▼')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedFlags.map((flag) => (
                      <tr key={flag.issueNum} className={`flag-row ${getSeverityClass(flag.severity)}`}>
                        <td className="col-issue">{flag.issueNum}</td>
                        <td className="col-category">{flag.category}</td>
                        <td className="col-description">{flag.description}</td>
                        <td className="col-severity">
                          <span 
                            className="severity-badge"
                            style={{ backgroundColor: severityColors[flag.severity] }}
                          >
                            {flag.severity}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'charts' && (
          <div className="charts-tab" id="charts-content">
            <ChartBuilder
              hasIga333Access={hasIga333Access}
              onDownloadChart={() => exportToPNG('chart-export-content', 'algorand-foundation-chart')}
              onLockedDownload={handleLockedDownload}
            />
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="timeline-tab key-observations-tab" id="observations-content">
            {/* Title for PNG export (hidden on screen) */}
            <div className="png-export-title">
              <h1>ALGORAND FOUNDATION</h1>
              <p>KEY OBSERVATIONS BY REPORT</p>
            </div>

            <div className="section-header">
              <h2 className="section-title">KEY OBSERVATIONS BY REPORT</h2>
              <p className="section-description">Detailed analysis and notable events from each transparency report</p>
            </div>

            {/* Filter Options */}
            <div className="obs-filter-bar">
              <span className="filter-label">FILTER:</span>
              <div className="filter-mode-buttons">
                <button 
                  className={`filter-mode-btn ${obsFilterMode === 'all' ? 'active' : ''}`}
                  onClick={() => setObsFilterMode('all')}
                >
                  ALL
                </button>
                <button 
                  className={`filter-mode-btn ${obsFilterMode === 'range' ? 'active' : ''}`}
                  onClick={() => setObsFilterMode('range')}
                >
                  RANGE
                </button>
                <button 
                  className={`filter-mode-btn ${obsFilterMode === 'specific' ? 'active' : ''}`}
                  onClick={() => setObsFilterMode('specific')}
                >
                  SELECT
                </button>
              </div>

              {obsFilterMode === 'range' && (
                <div className="filter-range-controls">
                  <span className="filter-range-label">FROM</span>
                  <select 
                    className="filter-select"
                    value={obsRangeFrom}
                    onChange={(e) => setObsRangeFrom(Number(e.target.value))}
                  >
                    {keyObservationsData.map(r => (
                      <option key={r.reportNumber} value={r.reportNumber}>R{r.reportNumber}</option>
                    ))}
                  </select>
                  <span className="filter-range-label">TO</span>
                  <select 
                    className="filter-select"
                    value={obsRangeTo}
                    onChange={(e) => setObsRangeTo(Number(e.target.value))}
                  >
                    {keyObservationsData.map(r => (
                      <option key={r.reportNumber} value={r.reportNumber}>R{r.reportNumber}</option>
                    ))}
                  </select>
                </div>
              )}

              {obsFilterMode === 'specific' && (
                <div className="filter-specific-controls">
                  <div className="filter-quick-actions">
                    <button className="filter-quick-btn" onClick={selectAllReports}>ALL</button>
                    <button className="filter-quick-btn" onClick={clearAllReports}>NONE</button>
                  </div>
                  <div className="filter-report-checkboxes">
                    {keyObservationsData.map(r => (
                      <label key={r.reportNumber} className="filter-checkbox-label">
                        <input 
                          type="checkbox" 
                          checked={obsSelectedReports.has(r.reportNumber)}
                          onChange={() => toggleReportSelection(r.reportNumber)}
                        />
                        <span>R{r.reportNumber}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <span className="filter-result-count">
                {filteredObservations.length} of {keyObservationsData.length} reports
              </span>
            </div>

            {/* Download Options */}
            <div className="download-bar">
              <span className="download-label">DOWNLOAD:</span>
              <button 
                className={`download-btn csv-btn ${!hasIga333Access ? 'locked' : ''}`}
                onClick={() => hasIga333Access ? exportToCSV(formatKeyObservationsForExport(filteredObservations), 'algorand-foundation-observations') : handleLockedDownload()}
              >
                {!hasIga333Access && '🔒 '}CSV
              </button>
              <button 
                className={`download-btn xls-btn ${!hasIga333Access ? 'locked' : ''}`}
                onClick={() => hasIga333Access ? exportToExcel(formatKeyObservationsForExport(filteredObservations), 'algorand-foundation-observations', 'Observations') : handleLockedDownload()}
              >
                {!hasIga333Access && '🔒 '}XLS
              </button>
              <button 
                className={`download-btn pdf-btn ${!hasIga333Access ? 'locked' : ''}`}
                onClick={() => hasIga333Access ? exportToPDF(
                  formatKeyObservationsForExport(filteredObservations), 
                  'algorand-foundation-observations',
                  'ALGORAND FOUNDATION - KEY OBSERVATIONS',
                  `Generated ${new Date().toLocaleDateString()}`
                ) : handleLockedDownload()}
              >
                {!hasIga333Access && '🔒 '}PDF
              </button>
              <button 
                className={`download-btn png-btn ${!hasIga333Access ? 'locked' : ''}`}
                onClick={() => hasIga333Access ? exportToPNG('observations-content', 'algorand-foundation-observations') : handleLockedDownload()}
              >
                {!hasIga333Access && '🔒 '}PNG
              </button>
            </div>

            <div className="observations-container">
              {filteredObservations.map((report) => (
                <div key={report.reportNumber} className="report-observations">
                  <div className="observation-header">
                    <span className="observation-report-num">R{report.reportNumber}</span>
                    <span className="observation-period">{report.period}</span>
                  </div>
                  <ol className="observations-list">
                    {report.observations.map((obs, idx) => (
                      <li 
                        key={idx} 
                        className={`observation-item ${obs.isHighlight ? 'highlight' : ''} ${obs.isWarning ? 'warning' : ''} ${obs.isNew ? 'new-item' : ''}`}
                      >
                        {obs.isNew && <span className="new-badge">NEW</span>}
                        {obs.text}
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Access Required Modal */}
      {showAccessModal && (
        <div className="access-modal-overlay" onClick={() => setShowAccessModal(false)}>
          <div className="access-modal" onClick={e => e.stopPropagation()}>
            <button className="access-modal-close" onClick={() => setShowAccessModal(false)}>✕</button>
            <div className="access-modal-icon">🔒</div>
            <h3 className="access-modal-title">ACCESS RESTRICTED</h3>
            <p className="access-modal-text">
              This content requires <span className="highlight">iGA MEMBER</span> status or higher.
            </p>
            <p className="access-modal-subtext">
              Hold any amount of $iGA tokens to unlock full access to all data, charts, flags, and observations.
            </p>
            <a 
              href="https://hay.app/swap?asset_in=0&asset_out=2635992378&amount=1&referrer=VMSQFMHV4KGDTDQYT5YGZGCRV6VM7VQMDO2QM7DACMIXBYIJV2O474VQO4" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="access-modal-btn"
            >
              GET $iGA TOKENS →
            </a>
          </div>
        </div>
      )}

      {/* Download Access Required Modal */}
      {showDownloadModal && (
        <div className="access-modal-overlay" onClick={() => setShowDownloadModal(false)}>
          <div className="access-modal" onClick={e => e.stopPropagation()}>
            <button className="access-modal-close" onClick={() => setShowDownloadModal(false)}>✕</button>
            <div className="access-modal-icon">📥</div>
            <h3 className="access-modal-title">DOWNLOAD RESTRICTED</h3>
            <p className="access-modal-text">
              Downloads require <span className="highlight">iGA 333</span> status or higher.
            </p>
            <p className="access-modal-subtext">
              Hold at least 0.333 $iGA tokens to unlock download access for flags and detailed reports.
            </p>
            <a 
              href="https://hay.app/swap?asset_in=0&asset_out=2635992378&amount=1&referrer=VMSQFMHV4KGDTDQYT5YGZGCRV6VM7VQMDO2QM7DACMIXBYIJV2O474VQO4" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="access-modal-btn"
            >
              GET $iGA TOKENS →
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Foundation;
