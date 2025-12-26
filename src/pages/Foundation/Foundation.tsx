import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
import './Foundation.css';

type TabType = 'summary' | 'data' | 'flags' | 'charts' | 'timeline';
type DataSubTab = 'balance-sheet' | 'outflows' | 'fiat-expense' | 'loans' | 'pool-tracking';

const Foundation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('summary');
  const [activeDataSubTab, setActiveDataSubTab] = useState<DataSubTab>('balance-sheet');
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [flagSortColumn, setFlagSortColumn] = useState<'issueNum' | 'category' | 'severity'>('severity');
  const [flagSortDirection, setFlagSortDirection] = useState<'asc' | 'desc'>('asc');
  const [reportSortDirection, setReportSortDirection] = useState<'asc' | 'desc'>('desc'); // desc = newest first
  const summary = getFoundationSummary();

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
  const sortedFlags = [...flagsData].sort((a, b) => {
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
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-label">TOTAL REPORTS</span>
            <span className="stat-value">{summary.totalReports}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">LATEST</span>
            <span className="stat-value">{summary.latestReportDate}</span>
          </div>
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
          className={`tab-btn ${activeTab === 'data' ? 'active' : ''}`}
          onClick={() => setActiveTab('data')}
        >
          <span className="tab-icon">▦</span> DATA
        </button>
        <button 
          className={`tab-btn ${activeTab === 'charts' ? 'active' : ''}`}
          onClick={() => setActiveTab('charts')}
        >
          <span className="tab-icon">▤</span> CHARTS
        </button>
        <button 
          className={`tab-btn ${activeTab === 'flags' ? 'active' : ''}`}
          onClick={() => setActiveTab('flags')}
        >
          <span className="tab-icon">⚑</span> FLAGS
        </button>
        <button 
          className={`tab-btn ${activeTab === 'timeline' ? 'active' : ''}`}
          onClick={() => setActiveTab('timeline')}
        >
          <span className="tab-icon">▥</span> KEY OBSERVATIONS
        </button>
      </nav>

      {/* Main Content */}
      <main className="page-content">
        {activeTab === 'summary' && (
          <div className="summary-tab">
            {/* Summary Cards */}
            <div className="summary-cards">
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
              <div className="summary-card holdings-card">
                <div className="card-icon">Ⱥ</div>
                <div className="card-content">
                  <span className="card-label">TOTAL FOUNDATION ALGO HOLDINGS</span>
                  <span className="card-value">{formatAlgo(1175000000)}</span>
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
                                <h4 className="details-title">
                                  REPORT #{report.reportNumber}: {report.period}
                                </h4>
                                <span className="details-subtitle">
                                  {report.duration} • {report.reportDate}
                                </span>
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
                
                <div className="data-note">
                  <span className="note-icon">⚠</span>
                  <p>{balanceSheetData.note}</p>
                </div>

                {/* Unified Balance Sheet Table */}
                <div className="data-table-container">
                  <div className="table-scroll-wrapper">
                    <table className="data-table balance-table unified-balance-table">
                      <thead>
                        <tr>
                          <th className="col-pool-name">Pool/Fund Name</th>
                          {reportColumns.map(col => (
                            <th key={col} className="col-report-value">{col}</th>
                          ))}
                          <th className="col-notes">Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Old Structure Section Header */}
                        <tr className="section-header-row old-structure-header">
                          <td className="col-pool-name section-header-cell">OLD STRUCTURE (R4-R5)</td>
                          {reportColumns.map(col => (
                            <td key={col} className="section-header-cell"></td>
                          ))}
                          <td className="section-header-cell"></td>
                        </tr>
                        {/* Old Structure Items */}
                        {balanceSheetData.oldStructure.map((pool, idx) => (
                          <tr key={`old-${idx}`} className="pool-row">
                            <td className="col-pool-name">{pool.name}</td>
                            {reportColumns.map(col => (
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
                          {reportColumns.map(col => {
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
                          {reportColumns.map(col => (
                            <td key={col}></td>
                          ))}
                          <td></td>
                        </tr>

                        {/* New Structure Section Header */}
                        <tr className="section-header-row new-structure-header">
                          <td className="col-pool-name section-header-cell">NEW STRUCTURE (R6-R7)</td>
                          {reportColumns.map(col => (
                            <td key={col} className="section-header-cell"></td>
                          ))}
                          <td className="section-header-cell"></td>
                        </tr>
                        {/* New Structure Items */}
                        {balanceSheetData.newStructure.map((pool, idx) => (
                          <tr key={`new-${idx}`} className="pool-row">
                            <td className="col-pool-name">{pool.name}</td>
                            {reportColumns.map(col => (
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
                          {reportColumns.map(col => {
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
                          {reportColumns.map(col => (
                            <td key={col}></td>
                          ))}
                          <td></td>
                        </tr>

                        {/* R8+ Format Section Header */}
                        <tr className="section-header-row r8plus-header">
                          <td className="col-pool-name section-header-cell">R8+ FORMAT (Single Total)</td>
                          {reportColumns.map(col => (
                            <td key={col} className="section-header-cell"></td>
                          ))}
                          <td className="section-header-cell"></td>
                        </tr>
                        {/* R8+ Format Items */}
                        {balanceSheetData.singleFormat.map((pool, idx) => (
                          <tr key={`r8-${idx}`} className={`pool-row ${pool.name.includes('Holdings') ? 'holdings-row' : 'usd-row'}`}>
                            <td className="col-pool-name">{pool.name}</td>
                            {reportColumns.map(col => (
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
                          {reportColumns.map(col => (
                            <td key={col}></td>
                          ))}
                          <td></td>
                        </tr>

                        {/* Grand Total Row */}
                        <tr className="totals-row grand-total-row">
                          <td className="col-pool-name totals-label">CURRENT HOLDINGS (R18)</td>
                          {reportColumns.map(col => {
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
              </div>
            )}

            {/* All Outflows by Report Sub-Tab */}
            {activeDataSubTab === 'outflows' && (
              <div className="outflows-section">
                <div className="section-header">
                  <h2 className="section-title">{outflowsData.title}</h2>
                </div>

                <div className="data-table-container">
                  <div className="table-scroll-wrapper">
                    <table className="data-table outflows-table unified-outflows-table">
                      <thead>
                        <tr>
                          <th className="col-line-item">Line Item</th>
                          {outflowReportColumns.map(col => (
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
                              {outflowReportColumns.map(col => (
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
                                {outflowReportColumns.map(col => {
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
                              {outflowReportColumns.map(col => {
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
                                {outflowReportColumns.map(col => (
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
                                  {outflowReportColumns.map(col => {
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
                          {outflowReportColumns.map(col => (
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
              </div>
            )}

            {/* Fiat/USD Expense Sub-Tab */}
            {activeDataSubTab === 'fiat-expense' && (
              <div className="fiat-expense-section">
                <div className="section-header">
                  <h2 className="section-title">{fiatExpenseData.title}</h2>
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
                          {fiatReportColumns.map(col => (
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
                          {fiatReportColumns.map(col => (
                            <td key={col} className="section-header-cell"></td>
                          ))}
                          <td className="section-header-cell"></td>
                          <td className="section-header-cell"></td>
                        </tr>
                        {/* Old Format Items */}
                        {fiatExpenseData.oldFormat.map((item, idx) => (
                          <tr key={`old-${idx}`} className="fiat-row">
                            <td className="col-category">{item.name}</td>
                            {fiatReportColumns.map(col => {
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
                          {fiatReportColumns.map(col => {
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
                          {fiatReportColumns.map(col => (
                            <td key={col}></td>
                          ))}
                          <td></td>
                          <td></td>
                        </tr>

                        {/* New Format Section Header */}
                        <tr className="section-header-row new-format-header">
                          <td className="col-category section-header-cell">NEW FORMAT (R8+)</td>
                          {fiatReportColumns.map(col => (
                            <td key={col} className="section-header-cell"></td>
                          ))}
                          <td className="section-header-cell"></td>
                          <td className="section-header-cell"></td>
                        </tr>
                        {/* New Format Items */}
                        {fiatExpenseData.newFormat.map((item, idx) => (
                          <tr key={`new-${idx}`} className="fiat-row">
                            <td className="col-category">{item.name}</td>
                            {fiatReportColumns.map(col => {
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
                          {fiatReportColumns.map(col => {
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
                          {fiatReportColumns.map(col => (
                            <td key={col}></td>
                          ))}
                          <td></td>
                          <td></td>
                        </tr>

                        {/* Cumulative Total */}
                        <tr className="totals-row cumulative-row">
                          <td className="col-category totals-label">CUMULATIVE TOTAL</td>
                          {fiatReportColumns.map(col => {
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
          <div className="flags-tab">
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
          <div className="charts-tab">
            <ChartBuilder />
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="timeline-tab key-observations-tab">
            <div className="section-header">
              <h2 className="section-title">KEY OBSERVATIONS BY REPORT</h2>
              <p className="section-description">Detailed analysis and notable events from each transparency report</p>
            </div>

            <div className="observations-container">
              {keyObservationsData.map((report) => (
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
    </div>
  );
};

export default Foundation;
