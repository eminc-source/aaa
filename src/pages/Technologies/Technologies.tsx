import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '@txnlab/use-wallet-react';
import algosdk from 'algosdk';
import { technologiesReports } from '../../data/technologiesReports';
import { techBalanceSheetData, techReportColumns, getTechSubtotalIncentives, getTechSubtotalFinancial, getTechTotalDeployed } from '../../data/techBalanceSheetData';
import { techOutflowsData, techOutflowReportColumns, getTechIncentivesSubtotal, getTechFinancialSubtotal, getTechIncentivesTotalAll, getTechFinancialTotalAll } from '../../data/techOutflowsData';
import { techLoansData } from '../../data/techLoansData';
import { techFlagsData, getTechFlagStats, TechSeverity } from '../../data/techFlagsData';
import { techPoolTrackingData, getTechPoolTrackingSummary } from '../../data/techPoolTrackingData';
import { formatAlgo, formatCompact } from '../../utils/formatters';
import { exportToCSV, exportToExcel, exportToPDF, exportToPNG } from '../../utils/exportUtils';
import WalletConnect from '../../components/WalletConnect/WalletConnect';
import MemberStatus from '../../components/MemberStatus/MemberStatus';
import TechChartBuilder from '../../components/TechChartBuilder/TechChartBuilder';
import './Technologies.css';

type TabType = 'summary' | 'data' | 'charts' | 'flags';
type DataSubTabType = 'holdings' | 'outflows' | 'loans' | 'pool-tracking';

const IGA_ASA_ID = 2635992378;

// Official Technologies report URLs by report number
const techReportUrls: Record<number, string> = {
  1: 'https://algorand.com/resources/algorand-announcements/algorand-transparency-report',
  2: 'https://algorand.com/resources/algorand-announcements/algorand-transparency-report-january-9-2020',
  3: 'https://algorandtechnologies.com/news/transparency-report-april30-2020',
  4: 'https://algorand.com/resources/algorand-announcements/transparency-report-july31-2020',
  5: 'https://algorand.com/resources/algorand-announcements/transparency-oct2020',
  6: 'https://algorand.com/resources/algorand-announcements/transparency_april2021',
  7: 'https://www.algorand.com/resources/algorand-announcements/transparency-report-june-2022',
};

const Technologies: React.FC = () => {
  const { activeAccount } = useWallet();
  const [activeTab, setActiveTab] = useState<TabType>('summary');
  const [activeDataSubTab, setActiveDataSubTab] = useState<DataSubTabType>('holdings');
  const [reportSortDirection, setReportSortDirection] = useState<'asc' | 'desc'>('desc');
  const [expandedReports, setExpandedReports] = useState<Set<number>>(new Set());
  const [flagsSeverityFilter, setFlagsSeverityFilter] = useState<Set<TechSeverity>>(new Set(['HIGH', 'INFO']));
  const [flagSortColumn, setFlagSortColumn] = useState<'issueNum' | 'category' | 'severity'>('issueNum');
  const [flagSortDirection, setFlagSortDirection] = useState<'asc' | 'desc'>('asc');
  const [igaBalance, setIgaBalance] = useState<number>(0);
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  const flagStats = getTechFlagStats();

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
  const handleLockedDownload = () => {
    setShowDownloadModal(true);
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

  // Severity colors for badges
  const severityColors: Record<TechSeverity, string> = {
    HIGH: '#ff4444',
    INFO: '#4488ff'
  };

  // Filter and sort flags
  const filteredFlags = techFlagsData.filter(flag => flagsSeverityFilter.has(flag.severity));
  const sortedFlags = [...filteredFlags].sort((a, b) => {
    let comparison = 0;
    if (flagSortColumn === 'issueNum') {
      comparison = a.issueNum - b.issueNum;
    } else if (flagSortColumn === 'category') {
      comparison = a.category.localeCompare(b.category);
    } else if (flagSortColumn === 'severity') {
      const severityOrder: Record<TechSeverity, number> = { HIGH: 0, INFO: 1 };
      comparison = severityOrder[a.severity] - severityOrder[b.severity];
    }
    return flagSortDirection === 'asc' ? comparison : -comparison;
  });

  const toggleSeverityFilter = (severity: TechSeverity) => {
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

  const handleFlagSort = (column: 'issueNum' | 'category' | 'severity') => {
    if (flagSortColumn === column) {
      setFlagSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setFlagSortColumn(column);
      setFlagSortDirection('asc');
    }
  };

  const selectAllSeverities = () => setFlagsSeverityFilter(new Set(['HIGH', 'INFO']));
  const clearAllSeverities = () => setFlagsSeverityFilter(new Set());

  const getSeverityClass = (severity: TechSeverity) => {
    return severity === 'HIGH' ? 'severity-high' : 'severity-info';
  };

  // Sort reports
  const sortedReports = [...technologiesReports].sort((a, b) => {
    return reportSortDirection === 'desc'
      ? b.reportNumber - a.reportNumber
      : a.reportNumber - b.reportNumber;
  });

  const toggleReportSort = () => {
    setReportSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const toggleReportExpand = (reportNumber: number) => {
    setExpandedReports(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reportNumber)) {
        newSet.delete(reportNumber);
      } else {
        newSet.add(reportNumber);
      }
      return newSet;
    });
  };

  return (
    <div className="technologies-page">
      <header className="page-header technologies-header">
        <Link to="/" className="back-link">
          <span className="back-arrow">◄</span>
          <span>BACK TO DASHBOARD</span>
        </Link>
        <div className="page-title-container">
          <h1 className="page-title">ALGORAND TECHNOLOGIES</h1>
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
      </nav>

      <main className="page-content">
        {activeTab === 'summary' && (
          <div className="summary-tab" id="summary-content">
          {/* Title for PNG export (hidden on screen) */}
          <div className="png-export-title">
            <h1>ALGORAND TECHNOLOGIES</h1>
            <p>TRANSPARENCY REPORT - FORENSIC TRACKER</p>
          </div>

          {/* Summary Cards */}
          <div className="summary-cards">
            <div className="summary-card">
              <div className="card-icon">Ⱥ</div>
              <div className="card-content">
                <span className="card-label">PEAK HOLDINGS</span>
                <span className="card-value">Ⱥ{(2047000000).toLocaleString()}</span>
              </div>
            </div>

            <div className="summary-card">
              <div className="card-icon">Ⱥ</div>
              <div className="card-content">
                <span className="card-label">TOTAL DISTRIBUTED</span>
                <span className="card-value">Ⱥ{(techOutflowsData.grandTotalAll + 288600000).toLocaleString()}</span>
              </div>
            </div>

            <div className="summary-card">
              <div className="card-icon">📋</div>
              <div className="card-content">
                <span className="card-label">LATEST REPORT</span>
                <span className="card-value">R7 (Jun 2022)</span>
              </div>
            </div>
          </div>

          {/* Reports Table */}
          <div className="section-header">
            <h2 className="section-title">TRANSPARENCY REPORTS SUMMARY</h2>
          </div>

          <div className="data-table-container">
            <table className="retro-table summary-table">
              <thead>
                <tr>
                  <th className="col-expand"></th>
                  <th className="col-report">#</th>
                  <th className="col-period">PERIOD</th>
                  <th className="col-duration">DURATION</th>
                  <th
                    className="sortable col-date"
                    onClick={toggleReportSort}
                  >
                    REPORT DATE {reportSortDirection === 'desc' ? '▼' : '▲'}
                  </th>
                  <th className="col-algo">TOTAL HOLDINGS</th>
                  <th className="col-fiat">INCENTIVES TOTAL</th>
                  <th className="col-fiat">FINANCIAL ECOSYSTEM</th>
                </tr>
              </thead>
              <tbody>
                {sortedReports.map((report) => {
                  const isExpanded = expandedReports.has(report.reportNumber);
                  return (
                    <React.Fragment key={report.reportNumber}>
                      <tr
                        className={isExpanded ? 'expanded' : ''}
                        onClick={() => toggleReportExpand(report.reportNumber)}
                        style={{ cursor: 'pointer' }}
                      >
                        <td className="col-expand">
                          <span className="expand-arrow">{isExpanded ? '▼' : '▶'}</span>
                        </td>
                        <td className="col-report">{report.reportNumber}</td>
                        <td className="col-period">{report.period}</td>
                        <td className="col-duration">{report.duration}</td>
                        <td className="col-date">{report.reportDate}</td>
                        <td className="col-algo">
                          {report.totalHoldings ? formatAlgo(report.totalHoldings) : '-'}
                        </td>
                        <td className="col-algo">
                          {report.incentivesTotal ? formatAlgo(report.incentivesTotal) : '-'}
                        </td>
                        <td className="col-algo">
                          {report.fiatUSD ? formatAlgo(report.fiatUSD) : '-'}
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="details-row">
                          <td colSpan={8}>
                            <div className="report-details">
                              <div className="detail-section">
                                <h4 className="detail-title">KEY EVENTS</h4>
                                <p className="detail-content">{report.keyChanges}</p>
                              </div>
                              {report.notes && (
                                <div className="detail-section">
                                  <h4 className="detail-title">NOTES</h4>
                                  <p className="detail-content">{report.notes}</p>
                                </div>
                              )}
                              <div className="detail-actions">
                                {techReportUrls[report.reportNumber] && (
                                  <a
                                    href={techReportUrls[report.reportNumber]}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="view-report-btn"
                                  >
                                    📄 VIEW OFFICIAL REPORT
                                  </a>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        )}

        {activeTab === 'data' && (
          <div className="data-tab">
            {/* Data Sub-Navigation */}
            <nav className="sub-tab-navigation">
              <button
                className={`sub-tab-btn ${activeDataSubTab === 'holdings' ? 'active' : ''}`}
                onClick={() => setActiveDataSubTab('holdings')}
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
                className={`sub-tab-btn ${activeDataSubTab === 'loans' ? 'active' : ''}`}
                onClick={() => setActiveDataSubTab('loans')}
              >
                LOANS TRACKING
              </button>
              <button
                className={`sub-tab-btn ${activeDataSubTab === 'pool-tracking' ? 'active' : ''}`}
                onClick={() => setActiveDataSubTab('pool-tracking')}
              >
                POOL TRACKING
              </button>
            </nav>

            {/* Holdings Tracking Sub-Tab */}
            {activeDataSubTab === 'holdings' && (
              <>
                <div className="section-header">
                  <h2 className="section-title">{techBalanceSheetData.title}</h2>
                  <p className="section-description">{techBalanceSheetData.description}</p>
                </div>

                {/* Wrapper for PNG export */}
                <div id="tech-balance-content">
              {/* PNG Export Title (hidden by default, shown during export) */}
              <div className="png-export-title">
                <h1 style={{ textAlign: 'center', margin: '20px 0', color: 'var(--neon-cyan)' }}>
                  ALGORAND TECHNOLOGIES - HOLDINGS TRACKING
                </h1>
              </div>

              {/* Summary Cards */}
              <div className="bs-summary-cards">
                <div className="summary-card bs-green-card">
                  <div className="card-icon">Ⱥ</div>
                  <div className="card-content">
                    <span className="card-label">PEAK HOLDINGS (R6)</span>
                    <span className="card-value">Ⱥ{(2047000000).toLocaleString()}</span>
                  </div>
                </div>
                <div className="summary-card bs-yellow-card">
                  <div className="card-icon">Ⱥ</div>
                  <div className="card-content">
                    <span className="card-label">LATEST HOLDINGS (R7)</span>
                    <span className="card-value">Ⱥ{(1691000000).toLocaleString()}</span>
                  </div>
                </div>
                <div className="summary-card bs-red-card">
                  <div className="card-icon">Ⱥ</div>
                  <div className="card-content">
                    <span className="card-label">CUMULATIVE SALES (R7)</span>
                    <span className="card-value">Ⱥ{(288600000).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Download Options */}
              <div className="download-bar">
                <span className="download-label">DOWNLOAD:</span>
                <button
                  className={`download-btn csv-btn ${!hasIga333Access ? 'locked' : ''}`}
                  onClick={() => hasIga333Access ? exportToCSV([
                    ...techBalanceSheetData.holdings.map(item => ({
                      'Section': 'Holdings',
                      'Metric': item.name,
                      ...Object.fromEntries(techReportColumns.map(col => [col, item.values[col]])),
                      'Chg R6-R7': item.changeR6R7 ?? null,
                      'Notes': item.notes ?? ''
                    })),
                    ...techBalanceSheetData.incentivesDevelopment.map(item => ({
                      'Section': 'Incentives & Development',
                      'Metric': item.name,
                      ...Object.fromEntries(techReportColumns.map(col => [col, item.values[col]])),
                      'Chg R6-R7': item.changeR6R7 ?? null,
                      'Notes': item.notes ?? ''
                    })),
                    ...techBalanceSheetData.financialEcosystem.map(item => ({
                      'Section': 'Financial Ecosystem',
                      'Metric': item.name,
                      ...Object.fromEntries(techReportColumns.map(col => [col, item.values[col]])),
                      'Chg R6-R7': item.changeR6R7 ?? null,
                      'Notes': item.notes ?? ''
                    })),
                    ...techBalanceSheetData.sales.map(item => ({
                      'Section': 'Sales',
                      'Metric': item.name,
                      ...Object.fromEntries(techReportColumns.map(col => [col, item.values[col]])),
                      'Chg R6-R7': item.changeR6R7 ?? null,
                      'Notes': item.notes ?? ''
                    })),
                    ...techBalanceSheetData.networkMetrics.map(item => ({
                      'Section': 'Network Metrics',
                      'Metric': item.name,
                      ...Object.fromEntries(techReportColumns.map(col => [col, item.values[col]])),
                      'Chg R6-R7': item.changeR6R7 ?? null,
                      'Notes': item.notes ?? ''
                    }))
                  ], 'algorand-technologies-holdings') : handleLockedDownload()}
                >
                  {!hasIga333Access && '🔒 '}CSV
                </button>
                <button
                  className={`download-btn xls-btn ${!hasIga333Access ? 'locked' : ''}`}
                  onClick={() => hasIga333Access ? exportToExcel([
                    ...techBalanceSheetData.holdings.map(item => ({
                      'Section': 'Holdings',
                      'Metric': item.name,
                      ...Object.fromEntries(techReportColumns.map(col => [col, item.values[col]])),
                      'Chg R6-R7': item.changeR6R7 ?? null,
                      'Notes': item.notes ?? ''
                    })),
                    ...techBalanceSheetData.incentivesDevelopment.map(item => ({
                      'Section': 'Incentives & Development',
                      'Metric': item.name,
                      ...Object.fromEntries(techReportColumns.map(col => [col, item.values[col]])),
                      'Chg R6-R7': item.changeR6R7 ?? null,
                      'Notes': item.notes ?? ''
                    })),
                    ...techBalanceSheetData.financialEcosystem.map(item => ({
                      'Section': 'Financial Ecosystem',
                      'Metric': item.name,
                      ...Object.fromEntries(techReportColumns.map(col => [col, item.values[col]])),
                      'Chg R6-R7': item.changeR6R7 ?? null,
                      'Notes': item.notes ?? ''
                    })),
                    ...techBalanceSheetData.sales.map(item => ({
                      'Section': 'Sales',
                      'Metric': item.name,
                      ...Object.fromEntries(techReportColumns.map(col => [col, item.values[col]])),
                      'Chg R6-R7': item.changeR6R7 ?? null,
                      'Notes': item.notes ?? ''
                    })),
                    ...techBalanceSheetData.networkMetrics.map(item => ({
                      'Section': 'Network Metrics',
                      'Metric': item.name,
                      ...Object.fromEntries(techReportColumns.map(col => [col, item.values[col]])),
                      'Chg R6-R7': item.changeR6R7 ?? null,
                      'Notes': item.notes ?? ''
                    }))
                  ], 'algorand-technologies-holdings', 'Holdings') : handleLockedDownload()}
                >
                  {!hasIga333Access && '🔒 '}XLS
                </button>
                <button
                  className={`download-btn pdf-btn ${!hasIga333Access ? 'locked' : ''}`}
                  onClick={() => hasIga333Access ? exportToPDF([
                    ...techBalanceSheetData.holdings.map(item => ({
                      'Section': 'Holdings',
                      'Metric': item.name,
                      ...Object.fromEntries(techReportColumns.map(col => [col, item.values[col]])),
                      'Chg R6-R7': item.changeR6R7 ?? null
                    })),
                    ...techBalanceSheetData.incentivesDevelopment.map(item => ({
                      'Section': 'Incentives',
                      'Metric': item.name,
                      ...Object.fromEntries(techReportColumns.map(col => [col, item.values[col]])),
                      'Chg R6-R7': item.changeR6R7 ?? null
                    })),
                    ...techBalanceSheetData.financialEcosystem.map(item => ({
                      'Section': 'Financial',
                      'Metric': item.name,
                      ...Object.fromEntries(techReportColumns.map(col => [col, item.values[col]])),
                      'Chg R6-R7': item.changeR6R7 ?? null
                    }))
                  ], 'algorand-technologies-holdings', 'ALGORAND TECHNOLOGIES - HOLDINGS TRACKING', `Generated ${new Date().toLocaleDateString()}`) : handleLockedDownload()}
                >
                  {!hasIga333Access && '🔒 '}PDF
                </button>
                <button
                  className={`download-btn png-btn ${!hasIga333Access ? 'locked' : ''}`}
                  onClick={() => hasIga333Access ? exportToPNG('tech-balance-content', 'algorand-technologies-holdings') : handleLockedDownload()}
                >
                  {!hasIga333Access && '🔒 '}PNG
                </button>
              </div>

              <div className="data-note">
                <span className="note-icon">⚠</span>
                <p>{techBalanceSheetData.note}</p>
              </div>

              {/* Holdings Table */}
              <div className="data-table-container">
                <div className="table-scroll-wrapper">
                  <table className="data-table balance-table unified-balance-table">
                    <thead>
                      <tr>
                        <th className="col-pool-name">Metric</th>
                        {techReportColumns.map(col => (
                          <th key={col} className="col-report-value">{col}</th>
                        ))}
                        <th className="col-report-value">Chg R6→R7</th>
                        <th className="col-notes">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Holdings Section */}
                      <tr className="section-header-row old-structure-header">
                        <td className="col-pool-name section-header-cell" colSpan={techReportColumns.length + 3}>HOLDINGS</td>
                      </tr>
                      {techBalanceSheetData.holdings.map((item, idx) => (
                        <tr key={`holdings-${idx}`} className="pool-row">
                          <td className="col-pool-name">{item.name}</td>
                          {techReportColumns.map(col => (
                            <td key={col} className="col-report-value">
                              {item.values[col] === null ? (
                                <span className="not-reported">N/R</span>
                              ) : typeof item.values[col] === 'number' ? (
                                formatCompact(item.values[col] as number)
                              ) : item.values[col]}
                            </td>
                          ))}
                          <td className="col-report-value">
                            {item.changeR6R7 === null ? '' :
                             typeof item.changeR6R7 === 'number' ? (
                              <span className={item.changeR6R7 < 0 ? 'negative' : 'positive'}>
                                {formatCompact(item.changeR6R7)}
                              </span>
                             ) : item.changeR6R7}
                          </td>
                          <td className="col-notes">{item.notes}</td>
                        </tr>
                      ))}

                      {/* Spacer Row */}
                      <tr className="spacer-row"><td colSpan={techReportColumns.length + 3}></td></tr>

                      {/* Incentives & Development Section */}
                      <tr className="section-header-row r8plus-header">
                        <td className="col-pool-name section-header-cell" colSpan={techReportColumns.length + 3}>INCENTIVES & DEVELOPMENT</td>
                      </tr>
                      {techBalanceSheetData.incentivesDevelopment.map((item, idx) => (
                        <tr key={`incentives-${idx}`} className="pool-row">
                          <td className="col-pool-name">{item.name}</td>
                          {techReportColumns.map(col => (
                            <td key={col} className="col-report-value">
                              {item.values[col] === null ? (
                                <span className="arrow-continue">→</span>
                              ) : typeof item.values[col] === 'number' ? (
                                formatCompact(item.values[col] as number)
                              ) : item.values[col]}
                            </td>
                          ))}
                          <td className="col-report-value">
                            {item.changeR6R7 === null ? '' :
                             typeof item.changeR6R7 === 'number' ? (
                              <span className={item.changeR6R7 < 0 ? 'negative' : 'positive'}>
                                {formatCompact(item.changeR6R7)}
                              </span>
                             ) : item.changeR6R7}
                          </td>
                          <td className="col-notes">{item.notes}</td>
                        </tr>
                      ))}
                      {/* Subtotal Incentives */}
                      <tr className="totals-row subtotal-row">
                        <td className="col-pool-name totals-label">Subtotal Incentives</td>
                        {techReportColumns.map(col => (
                          <td key={col} className="col-report-value">
                            {formatCompact(getTechSubtotalIncentives(col))}
                          </td>
                        ))}
                        <td className="col-report-value"></td>
                        <td className="col-notes"></td>
                      </tr>

                      {/* Spacer Row */}
                      <tr className="spacer-row"><td colSpan={techReportColumns.length + 3}></td></tr>

                      {/* Financial Ecosystem Section */}
                      <tr className="section-header-row new-structure-header">
                        <td className="col-pool-name section-header-cell" colSpan={techReportColumns.length + 3}>FINANCIAL ECOSYSTEM</td>
                      </tr>
                      {techBalanceSheetData.financialEcosystem.map((item, idx) => (
                        <tr key={`financial-${idx}`} className="pool-row">
                          <td className="col-pool-name">{item.name}</td>
                          {techReportColumns.map(col => (
                            <td key={col} className="col-report-value">
                              {item.values[col] === null ? (
                                <span className="arrow-continue">→</span>
                              ) : typeof item.values[col] === 'number' ? (
                                formatCompact(item.values[col] as number)
                              ) : item.values[col]}
                            </td>
                          ))}
                          <td className="col-report-value">
                            {item.changeR6R7 === null ? '' :
                             typeof item.changeR6R7 === 'number' ? (
                              <span className={item.changeR6R7 < 0 ? 'negative' : 'positive'}>
                                {formatCompact(item.changeR6R7)}
                              </span>
                             ) : item.changeR6R7}
                          </td>
                          <td className="col-notes">{item.notes}</td>
                        </tr>
                      ))}
                      {/* Subtotal Financial */}
                      <tr className="totals-row subtotal-row">
                        <td className="col-pool-name totals-label">Subtotal Financial</td>
                        {techReportColumns.map(col => (
                          <td key={col} className="col-report-value">
                            {formatCompact(getTechSubtotalFinancial(col))}
                          </td>
                        ))}
                        <td className="col-report-value"></td>
                        <td className="col-notes"></td>
                      </tr>

                      {/* Spacer Row */}
                      <tr className="spacer-row"><td colSpan={techReportColumns.length + 3}></td></tr>

                      {/* Total Deployed */}
                      <tr className="totals-row grand-total-row">
                        <td className="col-pool-name totals-label">TOTAL DEPLOYED</td>
                        {techReportColumns.map(col => (
                          <td key={col} className="col-report-value">
                            {formatCompact(getTechTotalDeployed(col))}
                          </td>
                        ))}
                        <td className="col-report-value"></td>
                        <td className="col-notes"></td>
                      </tr>

                      {/* Spacer Row */}
                      <tr className="spacer-row"><td colSpan={techReportColumns.length + 3}></td></tr>

                      {/* Sales Section */}
                      <tr className="section-header-row">
                        <td className="col-pool-name section-header-cell" colSpan={techReportColumns.length + 3} style={{ backgroundColor: '#4a3000' }}>SALES</td>
                      </tr>
                      {techBalanceSheetData.sales.map((item, idx) => (
                        <tr key={`sales-${idx}`} className="pool-row">
                          <td className="col-pool-name">{item.name}</td>
                          {techReportColumns.map(col => (
                            <td key={col} className="col-report-value">
                              {item.values[col] === null ? (
                                <span className="arrow-continue">→</span>
                              ) : typeof item.values[col] === 'number' ? (
                                formatCompact(item.values[col] as number)
                              ) : item.values[col]}
                            </td>
                          ))}
                          <td className="col-report-value">
                            {item.changeR6R7 === null ? '' :
                             typeof item.changeR6R7 === 'number' ? (
                              <span className={item.changeR6R7 < 0 ? 'negative' : 'positive'}>
                                {formatCompact(item.changeR6R7)}
                              </span>
                             ) : item.changeR6R7}
                          </td>
                          <td className="col-notes">{item.notes}</td>
                        </tr>
                      ))}

                      {/* Spacer Row */}
                      <tr className="spacer-row"><td colSpan={techReportColumns.length + 3}></td></tr>

                      {/* Network Metrics Section */}
                      <tr className="section-header-row">
                        <td className="col-pool-name section-header-cell" colSpan={techReportColumns.length + 3} style={{ backgroundColor: '#003366' }}>NETWORK METRICS</td>
                      </tr>
                      {techBalanceSheetData.networkMetrics.map((item, idx) => (
                        <tr key={`network-${idx}`} className="pool-row">
                          <td className="col-pool-name">{item.name}</td>
                          {techReportColumns.map(col => (
                            <td key={col} className="col-report-value">
                              {item.values[col] === null ? (
                                <span className="arrow-continue">→</span>
                              ) : item.values[col]}
                            </td>
                          ))}
                          <td className="col-report-value">
                            {item.changeR6R7 === null ? '' :
                             typeof item.changeR6R7 === 'number' ? (
                              <span className={item.changeR6R7 < 0 ? 'negative' : item.changeR6R7 > 0 ? 'positive' : ''}>
                                {item.changeR6R7}
                              </span>
                             ) : item.changeR6R7}
                          </td>
                          <td className="col-notes">{item.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
              </>
            )}

            {/* All Outflows Sub-Tab */}
            {activeDataSubTab === 'outflows' && (
              <div className="outflows-section">
                <div className="section-header">
                  <h2 className="section-title">{techOutflowsData.title}</h2>
                </div>

                {/* Wrapper for PNG export */}
                <div id="tech-outflows-content">
                  {/* PNG Export Title (hidden by default, shown during export) */}
                  <div className="png-export-title">
                    <h1 style={{ textAlign: 'center', margin: '20px 0', color: 'var(--neon-cyan)' }}>
                      ALGORAND TECHNOLOGIES - ALL REPORTED OUTFLOWS
                    </h1>
                  </div>

                  {/* Summary Cards */}
                  <div className="bs-summary-cards">
                    <div className="summary-card bs-green-card">
                      <div className="card-icon">Ⱥ</div>
                      <div className="card-content">
                        <span className="card-label">INCENTIVES TOTAL</span>
                        <span className="card-value">Ⱥ{getTechIncentivesTotalAll().toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="summary-card bs-yellow-card">
                      <div className="card-icon">Ⱥ</div>
                      <div className="card-content">
                        <span className="card-label">FINANCIAL TOTAL</span>
                        <span className="card-value">Ⱥ{getTechFinancialTotalAll().toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="summary-card bs-red-card">
                      <div className="card-icon">Ⱥ</div>
                      <div className="card-content">
                        <span className="card-label">CUMULATIVE SALES</span>
                        <span className="card-value">Ⱥ{(288600000).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="summary-card bs-cyan-card">
                      <div className="card-icon">Ⱥ</div>
                      <div className="card-content">
                        <span className="card-label">OUTFLOWS TOTAL</span>
                        <span className="card-value">Ⱥ{(techOutflowsData.grandTotalAll + 288600000).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Download Options */}
                  <div className="download-bar">
                    <span className="download-label">DOWNLOAD:</span>
                    <button
                      className={`download-btn csv-btn ${!hasIga333Access ? 'locked' : ''}`}
                      onClick={() => hasIga333Access ? exportToCSV(
                        techOutflowsData.categories.flatMap(cat =>
                          cat.items.map(item => ({
                            'Category': cat.name,
                            'Line Item': item.name,
                            ...Object.fromEntries(techOutflowReportColumns.map(col => [col, item.values[col]])),
                            'Total': item.total
                          }))
                        ),
                        'algorand-technologies-outflows'
                      ) : handleLockedDownload()}
                    >
                      {!hasIga333Access && '🔒 '}CSV
                    </button>
                    <button
                      className={`download-btn xls-btn ${!hasIga333Access ? 'locked' : ''}`}
                      onClick={() => hasIga333Access ? exportToExcel(
                        techOutflowsData.categories.flatMap(cat =>
                          cat.items.map(item => ({
                            'Category': cat.name,
                            'Line Item': item.name,
                            ...Object.fromEntries(techOutflowReportColumns.map(col => [col, item.values[col]])),
                            'Total': item.total
                          }))
                        ),
                        'algorand-technologies-outflows',
                        'Outflows'
                      ) : handleLockedDownload()}
                    >
                      {!hasIga333Access && '🔒 '}XLS
                    </button>
                    <button
                      className={`download-btn pdf-btn ${!hasIga333Access ? 'locked' : ''}`}
                      onClick={() => hasIga333Access ? exportToPDF(
                        techOutflowsData.categories.flatMap(cat =>
                          cat.items.map(item => ({
                            'Category': cat.name,
                            'Line Item': item.name,
                            ...Object.fromEntries(techOutflowReportColumns.map(col => [col, item.values[col]])),
                            'Total': item.total
                          }))
                        ),
                        'algorand-technologies-outflows',
                        'ALGORAND TECHNOLOGIES - ALL REPORTED OUTFLOWS',
                        `Generated ${new Date().toLocaleDateString()}`
                      ) : handleLockedDownload()}
                    >
                      {!hasIga333Access && '🔒 '}PDF
                    </button>
                    <button
                      className={`download-btn png-btn ${!hasIga333Access ? 'locked' : ''}`}
                      onClick={() => hasIga333Access ? exportToPNG('tech-outflows-content', 'algorand-technologies-outflows') : handleLockedDownload()}
                    >
                      {!hasIga333Access && '🔒 '}PNG
                    </button>
                  </div>

                  <div className="data-note">
                    <span className="note-icon">⚠</span>
                    <p>{techOutflowsData.note}</p>
                  </div>

                  {/* Outflows Table */}
                  <div className="data-table-container">
                    <div className="table-scroll-wrapper">
                      <table className="data-table outflows-table unified-outflows-table">
                        <thead>
                          <tr>
                            <th className="col-pool-name">Line Item</th>
                            {techOutflowReportColumns.map(col => (
                              <th key={col} className="col-report-value">{col}</th>
                            ))}
                            <th className="col-total">TOTAL</th>
                          </tr>
                        </thead>
                        <tbody>
                          {techOutflowsData.categories.map((category, catIdx) => (
                            <React.Fragment key={catIdx}>
                              {/* Category Header */}
                              <tr className="section-header-row old-structure-header">
                                <td className="col-pool-name section-header-cell" colSpan={techOutflowReportColumns.length + 2}>
                                  {category.name}
                                </td>
                              </tr>
                              {/* Category Items */}
                              {category.items.map((item, itemIdx) => (
                                <tr key={`${catIdx}-${itemIdx}`} className="pool-row">
                                  <td className="col-pool-name">{item.name}</td>
                                  {techOutflowReportColumns.map(col => (
                                    <td key={col} className="col-report-value">
                                      {item.values[col] === null ? (
                                        <span className="arrow-continue">→</span>
                                      ) : (
                                        formatCompact(item.values[col] as number)
                                      )}
                                    </td>
                                  ))}
                                  <td className="col-total">{formatCompact(item.total)}</td>
                                </tr>
                              ))}
                              {/* Category Subtotal */}
                              {category.name === "INCENTIVES & DEVELOPMENT" && (
                                <tr className="totals-row subtotal-row">
                                  <td className="col-pool-name totals-label">SUBTOTAL INCENTIVES</td>
                                  {techOutflowReportColumns.map(col => (
                                    <td key={col} className="col-report-value">
                                      {formatCompact(getTechIncentivesSubtotal(col))}
                                    </td>
                                  ))}
                                  <td className="col-total">{formatCompact(getTechIncentivesTotalAll())}</td>
                                </tr>
                              )}
                              {category.name === "FINANCIAL ECOSYSTEM" && (
                                <tr className="totals-row subtotal-row">
                                  <td className="col-pool-name totals-label">SUBTOTAL FINANCIAL</td>
                                  {techOutflowReportColumns.map(col => (
                                    <td key={col} className="col-report-value">
                                      {formatCompact(getTechFinancialSubtotal(col))}
                                    </td>
                                  ))}
                                  <td className="col-total">{formatCompact(getTechFinancialTotalAll())}</td>
                                </tr>
                              )}
                              {/* Spacer */}
                              <tr className="spacer-row"><td colSpan={techOutflowReportColumns.length + 2}></td></tr>
                            </React.Fragment>
                          ))}
                          {/* Grand Total */}
                          <tr className="totals-row grand-total-row">
                            <td className="col-pool-name totals-label">GRAND TOTAL DEPLOYED</td>
                            {techOutflowReportColumns.map(col => (
                              <td key={col} className="col-report-value">
                                {formatCompact(techOutflowsData.grandTotal[col])}
                              </td>
                            ))}
                            <td className="col-total grand-total">{formatCompact(techOutflowsData.grandTotalAll)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Loans Tracking Sub-Tab */}
            {activeDataSubTab === 'loans' && (
              <div className="loans-section">
                <div className="section-header">
                  <h2 className="section-title">{techLoansData.title}</h2>
                  <p className="section-description" style={{ fontStyle: 'italic', color: 'var(--neon-yellow)' }}>{techLoansData.note}</p>
                </div>

                {/* Wrapper for PNG export */}
                <div id="tech-loans-content">
                  {/* PNG Export Title (hidden by default, shown during export) */}
                  <div className="png-export-title">
                    <h1 style={{ textAlign: 'center', margin: '20px 0', color: 'var(--neon-cyan)' }}>
                      ALGORAND TECHNOLOGIES - LOANS TRACKING
                    </h1>
                  </div>

                  {/* Summary Cards */}
                  <div className="bs-summary-cards">
                    <div className="summary-card bs-green-card">
                      <div className="card-icon">📋</div>
                      <div className="card-content">
                        <span className="card-label">ACTIVE LOANS</span>
                        <span className="card-value">14</span>
                        <span className="card-subtext">Ⱥ125,000,000 total</span>
                      </div>
                    </div>
                    <div className="summary-card bs-yellow-card">
                      <div className="card-icon">⚠</div>
                      <div className="card-content">
                        <span className="card-label">NO UPDATE (3+ YRS)</span>
                        <span className="card-value">14</span>
                        <span className="card-subtext">Ⱥ125,000,000 unknown status</span>
                      </div>
                    </div>
                    <div className="summary-card bs-cyan-card">
                      <div className="card-icon">🔄</div>
                      <div className="card-content">
                        <span className="card-label">MARKET MAKING</span>
                        <span className="card-value">7</span>
                        <span className="card-subtext">Returnable at completion</span>
                      </div>
                    </div>
                    <div className="summary-card bs-red-card">
                      <div className="card-icon">💀</div>
                      <div className="card-content">
                        <span className="card-label">POTENTIAL LOSSES</span>
                        <span className="card-value">?</span>
                        <span className="card-subtext">No repayments disclosed</span>
                      </div>
                    </div>
                  </div>

                  {/* Download Options */}
                  <div className="download-bar">
                    <span className="download-label">DOWNLOAD:</span>
                    <button
                      className={`download-btn csv-btn ${!hasIga333Access ? 'locked' : ''}`}
                      onClick={() => hasIga333Access ? exportToCSV([
                        ...techLoansData.lendingEntries.map(item => ({
                          'Category': '3rd Party Lending',
                          'Borrower': item.borrower,
                          'Original Amount': item.originalAmount ?? '-',
                          'When Made': item.whenMade,
                          'Outstanding': item.outstanding,
                          'Status': item.status,
                          'Notes': item.notes
                        })),
                        ...techLoansData.marketMakingEntries.map(item => ({
                          'Category': 'Market Making',
                          'Borrower': item.borrower,
                          'Original Amount': item.originalAmount ?? '-',
                          'When Made': item.whenMade,
                          'Outstanding': item.outstanding,
                          'Status': item.status,
                          'Notes': item.notes
                        }))
                      ], 'algorand-technologies-loans') : handleLockedDownload()}
                    >
                      {!hasIga333Access && '🔒 '}CSV
                    </button>
                    <button
                      className={`download-btn xls-btn ${!hasIga333Access ? 'locked' : ''}`}
                      onClick={() => hasIga333Access ? exportToExcel([
                        ...techLoansData.lendingEntries.map(item => ({
                          'Category': '3rd Party Lending',
                          'Borrower': item.borrower,
                          'Original Amount': item.originalAmount ?? '-',
                          'When Made': item.whenMade,
                          'Outstanding': item.outstanding,
                          'Status': item.status,
                          'Notes': item.notes
                        })),
                        ...techLoansData.marketMakingEntries.map(item => ({
                          'Category': 'Market Making',
                          'Borrower': item.borrower,
                          'Original Amount': item.originalAmount ?? '-',
                          'When Made': item.whenMade,
                          'Outstanding': item.outstanding,
                          'Status': item.status,
                          'Notes': item.notes
                        }))
                      ], 'algorand-technologies-loans', 'Loans') : handleLockedDownload()}
                    >
                      {!hasIga333Access && '🔒 '}XLS
                    </button>
                    <button
                      className={`download-btn pdf-btn ${!hasIga333Access ? 'locked' : ''}`}
                      onClick={() => hasIga333Access ? exportToPDF([
                        ...techLoansData.lendingEntries.map(item => ({
                          'Category': 'Lending',
                          'Borrower': item.borrower,
                          'Amount': item.originalAmount ?? '-',
                          'Outstanding': item.outstanding,
                          'Status': item.status
                        })),
                        ...techLoansData.marketMakingEntries.map(item => ({
                          'Category': 'Market Making',
                          'Borrower': item.borrower,
                          'Amount': item.originalAmount ?? '-',
                          'Outstanding': item.outstanding,
                          'Status': item.status
                        }))
                      ], 'algorand-technologies-loans', 'ALGORAND TECHNOLOGIES - LOANS TRACKING', `Generated ${new Date().toLocaleDateString()}`) : handleLockedDownload()}
                    >
                      {!hasIga333Access && '🔒 '}PDF
                    </button>
                    <button
                      className={`download-btn png-btn ${!hasIga333Access ? 'locked' : ''}`}
                      onClick={() => hasIga333Access ? exportToPNG('tech-loans-content', 'algorand-technologies-loans') : handleLockedDownload()}
                    >
                      {!hasIga333Access && '🔒 '}PNG
                    </button>
                  </div>

                  {/* Loans Table */}
                  <div className="table-scroll-wrapper">
                    <div className="data-table-container">
                      <table className="data-table balance-sheet-table">
                        <thead>
                          <tr>
                            <th className="col-pool-name">Borrower</th>
                            <th className="col-report-value">Original Amount</th>
                            <th className="col-report-value">When Made</th>
                            <th className="col-report-value">When Repaid</th>
                            <th className="col-report-value">Repaid Amt</th>
                            <th className="col-report-value">Outstanding</th>
                            <th className="col-report-value">Status</th>
                            <th className="col-notes">Notes</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* 3rd Party Lending Section */}
                          <tr className="section-header-row new-structure-header">
                            <td className="col-pool-name section-header-cell" colSpan={8}>3RD PARTY LENDING</td>
                          </tr>
                          {techLoansData.lendingEntries.map((item, idx) => (
                            <tr key={`lending-${idx}`} className="pool-row">
                              <td className="col-pool-name">{item.borrower}</td>
                              <td className="col-report-value">{item.originalAmount ?? '-'}</td>
                              <td className="col-report-value">{item.whenMade}</td>
                              <td className="col-report-value">{item.whenRepaid ?? '-'}</td>
                              <td className="col-report-value">{item.repaidAmt}</td>
                              <td className="col-report-value">{item.outstanding}</td>
                              <td className="col-report-value">
                                <span className="status-active">{item.status}</span>
                              </td>
                              <td className="col-notes">{item.notes}</td>
                            </tr>
                          ))}

                          {/* Spacer Row */}
                          <tr className="spacer-row"><td colSpan={8}></td></tr>

                          {/* Market Making Section */}
                          <tr className="section-header-row new-structure-header">
                            <td className="col-pool-name section-header-cell" colSpan={8}>MARKET MAKERS</td>
                          </tr>
                          {techLoansData.marketMakingEntries.map((item, idx) => (
                            <tr key={`mm-${idx}`} className="pool-row">
                              <td className="col-pool-name">{item.borrower}</td>
                              <td className="col-report-value">{item.originalAmount ?? '-'}</td>
                              <td className="col-report-value">{item.whenMade}</td>
                              <td className="col-report-value">{item.whenRepaid ?? '-'}</td>
                              <td className="col-report-value">{item.repaidAmt}</td>
                              <td className="col-report-value">{item.outstanding}</td>
                              <td className="col-report-value">
                                <span className="status-active">{item.status}</span>
                              </td>
                              <td className="col-notes">{item.notes}</td>
                            </tr>
                          ))}

                          {/* Spacer Row */}
                          <tr className="spacer-row"><td colSpan={8}></td></tr>

                          {/* Totals Section */}
                          <tr className="section-header-row new-structure-header">
                            <td className="col-pool-name section-header-cell" colSpan={8}>TOTALS AS OF R3</td>
                          </tr>
                          <tr className="totals-row">
                            <td className="col-pool-name totals-label">Total Lending</td>
                            <td className="col-report-value">{techLoansData.totals.totalLending}</td>
                            <td className="col-report-value"></td>
                            <td className="col-report-value"></td>
                            <td className="col-report-value"></td>
                            <td className="col-report-value">{techLoansData.totals.totalLending}</td>
                            <td className="col-report-value">
                              <span className="status-active">{techLoansData.totals.lendingStatus}</span>
                            </td>
                            <td className="col-notes">{techLoansData.totals.lendingNotes}</td>
                          </tr>
                          <tr className="totals-row">
                            <td className="col-pool-name totals-label">Total Market Making</td>
                            <td className="col-report-value">{techLoansData.totals.totalMarketMaking}</td>
                            <td className="col-report-value"></td>
                            <td className="col-report-value"></td>
                            <td className="col-report-value"></td>
                            <td className="col-report-value">{techLoansData.totals.totalMarketMaking}</td>
                            <td className="col-report-value">
                              <span className="status-active">{techLoansData.totals.marketMakingStatus}</span>
                            </td>
                            <td className="col-notes">{techLoansData.totals.marketMakingNotes}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Transparency Gaps */}
                  <div className="transparency-gaps-section" style={{ marginTop: '30px', padding: '20px', border: '1px solid var(--neon-yellow)', borderRadius: '8px', backgroundColor: 'rgba(255, 255, 0, 0.05)' }}>
                    <h3 style={{ color: 'var(--neon-yellow)', marginBottom: '15px', fontSize: '1.1rem' }}>TRANSPARENCY GAPS</h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {techLoansData.transparencyGaps.map((gap, idx) => (
                        <li key={idx} style={{ color: 'var(--text-secondary)', marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                          <span style={{ position: 'absolute', left: 0, color: 'var(--neon-yellow)' }}>•</span>
                          {gap}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Pool Tracking Sub-Tab */}
            {activeDataSubTab === 'pool-tracking' && (
              <div className="pool-tracking-section">
                <div className="section-header">
                  <h2 className="section-title">TECHNOLOGIES ALGO POOL TRACKING</h2>
                  <p className="section-description">Opening → Distributions → Sales → Closing → Discrepancy Analysis</p>
                </div>

                {/* Wrapper for PNG export */}
                <div id="tech-pool-tracking-content">
                  {/* PNG Export Title (hidden by default, shown during export) */}
                  <div className="png-export-title">
                    <h1 style={{ textAlign: 'center', margin: '20px 0', color: 'var(--neon-magenta)' }}>
                      ALGORAND TECHNOLOGIES - POOL TRACKING
                    </h1>
                  </div>

                  {/* Pool Tracking Stats */}
                  {(() => {
                    const poolSummary = getTechPoolTrackingSummary();
                    return (
                      <div className="pool-stats-grid">
                        <div className="pool-stat-box">
                          <span className="pool-stat-value">{poolSummary.latestClosing !== null ? formatCompact(poolSummary.latestClosing) : 'N/A'}</span>
                          <span className="pool-stat-label">LATEST HOLDINGS (R7)</span>
                        </div>
                        <div className="pool-stat-box">
                          <span className="pool-stat-value">{formatCompact(poolSummary.peakHoldings)}</span>
                          <span className="pool-stat-label">PEAK HOLDINGS (R6)</span>
                        </div>
                        <div className="pool-stat-box">
                          <span className="pool-stat-value">{formatCompact(poolSummary.totalDistributions)}</span>
                          <span className="pool-stat-label">TOTAL DISTRIBUTED</span>
                        </div>
                        <div className="pool-stat-box">
                          <span className="pool-stat-value">{formatCompact(poolSummary.totalSales)}</span>
                          <span className="pool-stat-label">TOTAL SALES</span>
                        </div>
                        <div className="pool-stat-box close-box">
                          <span className="pool-stat-value">{poolSummary.closeMatchPeriods}</span>
                          <span className="pool-stat-label">CLOSE MATCHES</span>
                        </div>
                        <div className="pool-stat-box discrepancy-box">
                          <span className="pool-stat-value">{poolSummary.discrepancyPeriods}</span>
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
                      onClick={() => hasIga333Access ? exportToCSV(techPoolTrackingData.map(period => ({
                        'Period': period.period,
                        'Opening': period.opening,
                        'Distributions': period.distributions,
                        'Sales': period.sales,
                        'Closing': period.closing,
                        'Calculated': period.calculated,
                        'Difference': period.difference,
                        'Notes': period.notes
                      })), 'algorand-technologies-pool-tracking') : handleLockedDownload()}
                    >
                      {!hasIga333Access && '🔒 '}CSV
                    </button>
                    <button
                      className={`download-btn xls-btn ${!hasIga333Access ? 'locked' : ''}`}
                      onClick={() => hasIga333Access ? exportToExcel(techPoolTrackingData.map(period => ({
                        'Period': period.period,
                        'Opening': period.opening,
                        'Distributions': period.distributions,
                        'Sales': period.sales,
                        'Closing': period.closing,
                        'Calculated': period.calculated,
                        'Difference': period.difference,
                        'Notes': period.notes
                      })), 'algorand-technologies-pool-tracking', 'Pool Tracking') : handleLockedDownload()}
                    >
                      {!hasIga333Access && '🔒 '}XLS
                    </button>
                    <button
                      className={`download-btn pdf-btn ${!hasIga333Access ? 'locked' : ''}`}
                      onClick={() => hasIga333Access ? exportToPDF(
                        techPoolTrackingData.map(period => ({
                          'Period': period.period,
                          'Opening': period.opening,
                          'Distributions': period.distributions,
                          'Sales': period.sales,
                          'Closing': period.closing,
                          'Calculated': period.calculated,
                          'Difference': period.difference,
                          'Notes': period.notes
                        })),
                        'algorand-technologies-pool-tracking',
                        'ALGORAND TECHNOLOGIES - POOL TRACKING',
                        `Generated ${new Date().toLocaleDateString()}`
                      ) : handleLockedDownload()}
                    >
                      {!hasIga333Access && '🔒 '}PDF
                    </button>
                    <button
                      className={`download-btn png-btn ${!hasIga333Access ? 'locked' : ''}`}
                      onClick={() => hasIga333Access ? exportToPNG('tech-pool-tracking-content', 'algorand-technologies-pool-tracking') : handleLockedDownload()}
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
                            <th className="num-col">SALES</th>
                            <th className="num-col">CLOSING</th>
                            <th className="num-col">CALCULATED</th>
                            <th className="num-col">DIFFERENCE</th>
                            <th className="notes-col">NOTES</th>
                          </tr>
                        </thead>
                        <tbody>
                          {techPoolTrackingData.map((row, idx) => (
                            <tr key={idx} className={row.flag ? `row-${row.flag}` : ''}>
                              <td className="period-col">{row.period}</td>
                              <td className="num-col">{row.opening !== null ? formatCompact(row.opening) : 'N/A'}</td>
                              <td className="num-col outflow-val">{formatCompact(row.distributions)}</td>
                              <td className="num-col outflow-val">{row.sales > 0 ? formatCompact(row.sales) : '—'}</td>
                              <td className="num-col">{row.closing !== null ? formatCompact(row.closing) : 'N/A'}</td>
                              <td className="num-col">{row.calculated !== null ? formatCompact(row.calculated) : 'N/A'}</td>
                              <td className={`num-col diff-col ${row.difference === 0 ? 'match' : row.difference !== null && row.difference > 0 ? 'positive' : ''}`}>
                                {row.difference !== null ? (row.difference === 0 ? '✓' : formatCompact(row.difference)) : 'N/A'}
                              </td>
                              <td className="notes-col">
                                {row.flag === 'success' && <span className="note-icon">✓</span>}
                                {row.flag === 'warning' && <span className="note-icon warning">⚠</span>}
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
                      <span className="formula-text">CALCULATED = OPENING - DISTRIBUTIONS - SALES</span>
                      <span className="formula-text">DIFFERENCE = CLOSING - CALCULATED</span>
                      <span className="formula-text" style={{ color: 'var(--neon-yellow)', marginTop: '10px' }}>⚠ Positive differences indicate unreported inflows or accounting discrepancies</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'charts' && (
          <div className="charts-tab" id="tech-charts-content">
            <TechChartBuilder
              onDownloadChart={() => exportToPNG('tech-chart-export-content', 'algorand-technologies-chart')}
            />
          </div>
        )}

        {activeTab === 'flags' && (
          <div className="flags-tab" id="tech-flags-content">
            {/* Title for PNG export (hidden on screen) */}
            <div className="png-export-title">
              <h1 style={{ textAlign: 'center', margin: '20px 0', color: 'var(--neon-cyan)' }}>
                ALGORAND TECHNOLOGIES - FLAGS & OBSERVATIONS
              </h1>
            </div>

            <div className="section-header">
              <h2 className="section-title">FLAGS & OBSERVATIONS TRACKER</h2>
              <p className="section-description">Key observations and issues from transparency reports R1-R7</p>
            </div>

            {/* Stats Overview */}
            <div className="flags-stats">
              <div className="flag-stat red-stat">
                <span className="stat-count">{flagStats.high}</span>
                <span className="stat-label">HIGH PRIORITY</span>
              </div>
              <div className="flag-stat info-stat">
                <span className="stat-count">{flagStats.info}</span>
                <span className="stat-label">INFO</span>
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
                  HIGH
                </button>
                <button
                  className={`severity-filter-btn info ${flagsSeverityFilter.has('INFO') ? 'active' : ''}`}
                  onClick={() => toggleSeverityFilter('INFO')}
                >
                  INFO
                </button>
              </div>
              <div className="filter-quick-actions">
                <button className="filter-quick-btn" onClick={selectAllSeverities}>ALL</button>
                <button className="filter-quick-btn" onClick={clearAllSeverities}>NONE</button>
              </div>
              <span className="filter-result-count">
                {filteredFlags.length} of {techFlagsData.length} flags
              </span>
            </div>

            {/* Download Options */}
            <div className="download-bar">
              <span className="download-label">DOWNLOAD:</span>
              <button
                className={`download-btn csv-btn ${!hasIga333Access ? 'locked' : ''}`}
                onClick={() => hasIga333Access ? exportToCSV(
                  sortedFlags.map(f => ({
                    '#': f.issueNum,
                    'Category': f.category,
                    'Observation': f.observation,
                    'Severity': f.severity
                  })),
                  'algorand-technologies-flags'
                ) : handleLockedDownload()}
              >
                {!hasIga333Access && '🔒 '}CSV
              </button>
              <button
                className={`download-btn xls-btn ${!hasIga333Access ? 'locked' : ''}`}
                onClick={() => hasIga333Access ? exportToExcel(
                  sortedFlags.map(f => ({
                    '#': f.issueNum,
                    'Category': f.category,
                    'Observation': f.observation,
                    'Severity': f.severity
                  })),
                  'algorand-technologies-flags',
                  'Flags'
                ) : handleLockedDownload()}
              >
                {!hasIga333Access && '🔒 '}XLS
              </button>
              <button
                className={`download-btn pdf-btn ${!hasIga333Access ? 'locked' : ''}`}
                onClick={() => hasIga333Access ? exportToPDF(
                  sortedFlags.map(f => ({
                    '#': f.issueNum,
                    'Category': f.category,
                    'Observation': f.observation,
                    'Severity': f.severity
                  })),
                  'algorand-technologies-flags',
                  'ALGORAND TECHNOLOGIES - FLAGS & OBSERVATIONS',
                  `Generated ${new Date().toLocaleDateString()}`
                ) : handleLockedDownload()}
              >
                {!hasIga333Access && '🔒 '}PDF
              </button>
              <button
                className={`download-btn png-btn ${!hasIga333Access ? 'locked' : ''}`}
                onClick={() => hasIga333Access ? exportToPNG('tech-flags-content', 'algorand-technologies-flags') : handleLockedDownload()}
              >
                {!hasIga333Access && '🔒 '}PNG
              </button>
            </div>

            {/* Flags Table */}
            <div className="data-table-container flags-table-container">
              <div className="table-scroll-wrapper">
                <table className="data-table flags-table">
                  <thead>
                    <tr>
                      <th
                        className="col-issue sortable"
                        onClick={() => handleFlagSort('issueNum')}
                      >
                        # {flagSortColumn === 'issueNum' && (flagSortDirection === 'asc' ? '▲' : '▼')}
                      </th>
                      <th
                        className="col-category sortable"
                        onClick={() => handleFlagSort('category')}
                      >
                        Category {flagSortColumn === 'category' && (flagSortDirection === 'asc' ? '▲' : '▼')}
                      </th>
                      <th className="col-description">Observation</th>
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
                        <td className="col-description">{flag.observation}</td>
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

export default Technologies;
