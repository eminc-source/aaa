import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { technologiesReports, getTechnologiesSummary } from '../../data/technologiesReports';
import { formatCurrency, formatAlgo } from '../../utils/formatters';
import WalletConnect from '../../components/WalletConnect/WalletConnect';
import MemberStatus from '../../components/MemberStatus/MemberStatus';
import './Technologies.css';

type TabType = 'summary' | 'data' | 'charts' | 'flags' | 'observations';

const Technologies: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('summary');
  const [reportSortDirection, setReportSortDirection] = useState<'asc' | 'desc'>('desc');
  const [expandedReports, setExpandedReports] = useState<Set<number>>(new Set());

  const summary = getTechnologiesSummary();

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
          className={`tab-btn ${activeTab === 'observations' ? 'active' : ''}`}
          onClick={() => setActiveTab('observations')}
        >
          <span className="tab-icon">▥</span> KEY OBSERVATIONS
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
              <h3 className="card-title">TOTAL ALGO</h3>
              <p className="card-value">{formatAlgo(summary.totalAlgo)}</p>
              <p className="card-label">Distributed</p>
            </div>

            <div className="summary-card">
              <h3 className="card-title">TOTAL FIAT</h3>
              <p className="card-value">${formatCurrency(summary.totalFiat)}</p>
              <p className="card-label">USD Reported</p>
            </div>

            <div className="summary-card">
              <h3 className="card-title">LATEST REPORT</h3>
              <p className="card-value">{summary.latestReport}</p>
              <p className="card-label">Most Recent</p>
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
                        <td className="col-fiat">
                          {report.fiatUSD ? `$${formatCurrency(report.fiatUSD)}` : '-'}
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
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '40px' }}>
              Data view coming soon...
            </p>
          </div>
        )}

        {activeTab === 'charts' && (
          <div className="charts-tab">
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '40px' }}>
              Charts view coming soon...
            </p>
          </div>
        )}

        {activeTab === 'flags' && (
          <div className="flags-tab">
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '40px' }}>
              Flags view coming soon...
            </p>
          </div>
        )}

        {activeTab === 'observations' && (
          <div className="observations-tab">
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '40px' }}>
              Key Observations view coming soon...
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Technologies;
