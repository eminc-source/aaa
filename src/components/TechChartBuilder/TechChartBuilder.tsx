import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  getTechAllDataSeries,
  prepareTechChartData,
  prepareTechPieChartData,
  techAllReports,
  TechDataSeries,
  TechDataCategory,
  TechSubCategory
} from '../../data/techChartDataSources';
import { formatCompact } from '../../utils/formatters';
import '../ChartBuilder/ChartBuilder.css';

type ChartType = 'line' | 'bar' | 'pie';
type FormulaOperator = '+' | '-' | '*' | '/';

interface CalculatedSeries {
  id: string;
  name: string;
  color: string;
  operandA: string;
  operandB: string;
  operator: FormulaOperator;
}

interface TechChartBuilderProps {
  onDownloadChart?: () => void;
}

// Color palette for calculated series
const calculatedColors = ['#ff6b9d', '#c084fc', '#22d3ee', '#fbbf24', '#a3e635', '#fb7185'];

const TechChartBuilder: React.FC<TechChartBuilderProps> = ({
  onDownloadChart
}) => {
  const [chartType, setChartType] = useState<ChartType>('line');
  const [selectedSeriesIds, setSelectedSeriesIds] = useState<Set<string>>(new Set());
  const [reportRange, setReportRange] = useState({ start: 'R1', end: 'R7' });
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [expandedSubCategories, setExpandedSubCategories] = useState<Set<string>>(new Set());

  // Formula builder state
  const [showFormulaBuilder, setShowFormulaBuilder] = useState(false);
  const [formulaName, setFormulaName] = useState('');
  const [formulaOperandA, setFormulaOperandA] = useState('');
  const [formulaOperandB, setFormulaOperandB] = useState('');
  const [formulaOperator, setFormulaOperator] = useState<FormulaOperator>('+');
  const [calculatedSeriesList, setCalculatedSeriesList] = useState<CalculatedSeries[]>([]);

  const dataCategories = useMemo(() => getTechAllDataSeries(), []);

  const allSeries = useMemo(() => {
    const series: TechDataSeries[] = [];
    for (const cat of dataCategories) {
      series.push(...cat.series);
      if (cat.subCategories) {
        for (const subCat of cat.subCategories) {
          series.push(...subCat.series);
        }
      }
    }
    return series;
  }, [dataCategories]);

  const selectedSeries = useMemo(() => {
    return allSeries.filter(s => selectedSeriesIds.has(s.id));
  }, [allSeries, selectedSeriesIds]);

  // Create calculated series data
  const calculatedSeriesData = useMemo((): TechDataSeries[] => {
    return calculatedSeriesList.map(calc => {
      const seriesA = allSeries.find(s => s.id === calc.operandA);
      const seriesB = allSeries.find(s => s.id === calc.operandB);

      if (!seriesA || !seriesB) {
        return {
          id: calc.id,
          name: calc.name,
          category: 'Calculated',
          color: calc.color,
          data: []
        };
      }

      // Compute the formula for each report
      const data: { report: string; value: number }[] = [];
      for (const report of techAllReports) {
        const valueA = seriesA.data.find(d => d.report === report)?.value ?? 0;
        const valueB = seriesB.data.find(d => d.report === report)?.value ?? 0;

        let result = 0;
        switch (calc.operator) {
          case '+': result = valueA + valueB; break;
          case '-': result = valueA - valueB; break;
          case '*': result = valueA * valueB; break;
          case '/': result = valueB !== 0 ? valueA / valueB : 0; break;
        }

        if (result !== 0 || (valueA !== 0 || valueB !== 0)) {
          data.push({ report, value: result });
        }
      }

      return {
        id: calc.id,
        name: calc.name,
        category: 'Calculated',
        color: calc.color,
        data
      };
    });
  }, [calculatedSeriesList, allSeries]);

  // Combine selected series with calculated series
  const allActiveSeries = useMemo(() => {
    return [...selectedSeries, ...calculatedSeriesData];
  }, [selectedSeries, calculatedSeriesData]);

  const chartData = useMemo(() => {
    if (allActiveSeries.length === 0) return [];
    return prepareTechChartData(allActiveSeries, reportRange);
  }, [allActiveSeries, reportRange]);

  const pieData = useMemo(() => {
    if (allActiveSeries.length === 0) return [];
    return prepareTechPieChartData(allActiveSeries, reportRange);
  }, [allActiveSeries, reportRange]);

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryName)) {
        newSet.delete(categoryName);
      } else {
        newSet.add(categoryName);
      }
      return newSet;
    });
  };

  const toggleSubCategory = (subCategoryKey: string) => {
    setExpandedSubCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(subCategoryKey)) {
        newSet.delete(subCategoryKey);
      } else {
        newSet.add(subCategoryKey);
      }
      return newSet;
    });
  };

  const toggleSeries = (seriesId: string) => {
    setSelectedSeriesIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(seriesId)) {
        newSet.delete(seriesId);
      } else {
        newSet.add(seriesId);
      }
      return newSet;
    });
  };

  const selectAllInCategory = (category: TechDataCategory) => {
    setSelectedSeriesIds(prev => {
      const newSet = new Set(prev);
      category.series.forEach(s => newSet.add(s.id));
      if (category.subCategories) {
        category.subCategories.forEach(sub => {
          sub.series.forEach(s => newSet.add(s.id));
        });
      }
      return newSet;
    });
  };

  const deselectAllInCategory = (category: TechDataCategory) => {
    setSelectedSeriesIds(prev => {
      const newSet = new Set(prev);
      category.series.forEach(s => newSet.delete(s.id));
      if (category.subCategories) {
        category.subCategories.forEach(sub => {
          sub.series.forEach(s => newSet.delete(s.id));
        });
      }
      return newSet;
    });
  };

  const selectAllInSubCategory = (subCategory: TechSubCategory) => {
    setSelectedSeriesIds(prev => {
      const newSet = new Set(prev);
      subCategory.series.forEach(s => newSet.add(s.id));
      return newSet;
    });
  };

  const deselectAllInSubCategory = (subCategory: TechSubCategory) => {
    setSelectedSeriesIds(prev => {
      const newSet = new Set(prev);
      subCategory.series.forEach(s => newSet.delete(s.id));
      return newSet;
    });
  };

  // Get count of selected series in a category (including subcategories)
  const getSelectedCountInCategory = (category: TechDataCategory): number => {
    let count = category.series.filter(s => selectedSeriesIds.has(s.id)).length;
    if (category.subCategories) {
      category.subCategories.forEach(sub => {
        count += sub.series.filter(s => selectedSeriesIds.has(s.id)).length;
      });
    }
    return count;
  };

  const clearAllSelections = () => {
    setSelectedSeriesIds(new Set());
    setCalculatedSeriesList([]);
  };

  // Formula builder functions
  const openFormulaBuilder = () => {
    setFormulaName('');
    setFormulaOperandA(selectedSeries[0]?.id || '');
    setFormulaOperandB(selectedSeries[1]?.id || selectedSeries[0]?.id || '');
    setFormulaOperator('+');
    setShowFormulaBuilder(true);
  };

  const createCalculatedSeries = () => {
    if (!formulaName.trim() || !formulaOperandA || !formulaOperandB) return;

    const newCalc: CalculatedSeries = {
      id: `calc-${Date.now()}`,
      name: formulaName.trim(),
      color: calculatedColors[calculatedSeriesList.length % calculatedColors.length],
      operandA: formulaOperandA,
      operandB: formulaOperandB,
      operator: formulaOperator
    };

    setCalculatedSeriesList(prev => [...prev, newCalc]);
    setShowFormulaBuilder(false);
    setFormulaName('');
  };

  const removeCalculatedSeries = (id: string) => {
    setCalculatedSeriesList(prev => prev.filter(c => c.id !== id));
  };

  const getOperatorSymbol = (op: FormulaOperator): string => {
    switch (op) {
      case '+': return '+';
      case '-': return '−';
      case '*': return '×';
      case '/': return '÷';
    }
  };

  const getSeriesNameById = (id: string): string => {
    const series = allSeries.find(s => s.id === id);
    return series?.name || id;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="tooltip-value" style={{ color: entry.color }}>
              {entry.name}: {formatCompact(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    if (allActiveSeries.length === 0) {
      return (
        <div className="no-data-message">
          <span className="no-data-icon">📊</span>
          <p>Select data series from the left panel to generate a chart</p>
        </div>
      );
    }

    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={500}>
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 0, 255, 0.1)" />
              <XAxis
                dataKey="report"
                stroke="#ff00ff"
                tick={{ fill: '#ff00ff', fontSize: 12 }}
              />
              <YAxis
                stroke="#ff00ff"
                tick={{ fill: '#ff00ff', fontSize: 12 }}
                tickFormatter={(value) => formatCompact(value)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                formatter={(value) => {
                  const series = allActiveSeries.find(s => s.id === value);
                  return series?.name || value;
                }}
              />
              {allActiveSeries.map(series => (
                <Line
                  key={series.id}
                  type="monotone"
                  dataKey={series.id}
                  name={series.id}
                  stroke={series.color}
                  strokeWidth={2}
                  dot={{ fill: series.color, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: series.color, strokeWidth: 2 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 0, 255, 0.1)" />
              <XAxis
                dataKey="report"
                stroke="#ff00ff"
                tick={{ fill: '#ff00ff', fontSize: 12 }}
              />
              <YAxis
                stroke="#ff00ff"
                tick={{ fill: '#ff00ff', fontSize: 12 }}
                tickFormatter={(value) => formatCompact(value)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                formatter={(value) => {
                  const series = allActiveSeries.find(s => s.id === value);
                  return series?.name || value;
                }}
              />
              {allActiveSeries.map(series => (
                <Bar
                  key={series.id}
                  dataKey={series.id}
                  name={series.id}
                  fill={series.color}
                  opacity={0.8}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={500}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={180}
                innerRadius={60}
                paddingAngle={2}
                label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(1)}%`}
                labelLine={{ stroke: 'rgba(255, 255, 255, 0.5)' }}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0, 0, 0, 0.3)" />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => formatCompact(value as number)}
                contentStyle={{
                  background: 'rgba(0, 20, 30, 0.95)',
                  border: '1px solid #ff00ff',
                  borderRadius: '4px',
                  color: '#fff'
                }}
              />
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                formatter={(value) => <span style={{ color: '#fff' }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="chart-builder tech-chart-builder">
      {/* Left Panel - Data Selection */}
      <div className="chart-sidebar">
        <div className="sidebar-header">
          <h3>📊 DATA SERIES</h3>
          <button className="clear-btn" onClick={clearAllSelections}>
            Clear All
          </button>
        </div>

        <div className="series-list">
          {dataCategories.map(category => {
            const isExpanded = expandedCategories.has(category.name);
            const selectedCount = getSelectedCountInCategory(category);
            const hasSubCategories = category.subCategories && category.subCategories.length > 0;

            return (
              <div key={category.name} className="category-section">
                <div
                  className="category-header"
                  onClick={() => toggleCategory(category.name)}
                >
                  <span className="expand-icon">{isExpanded ? '▼' : '▶'}</span>
                  <span className="category-name">{category.name}</span>
                  {selectedCount > 0 && (
                    <span className="selected-count">({selectedCount})</span>
                  )}
                </div>

                {isExpanded && (
                  <div className="category-items">
                    <div className="category-actions">
                      <button onClick={() => selectAllInCategory(category)}>Select All</button>
                      <button onClick={() => deselectAllInCategory(category)}>Deselect All</button>
                    </div>

                    {/* Direct series (no sub-category) */}
                    {category.series.map(series => (
                      <label key={series.id} className="series-item">
                        <input
                          type="checkbox"
                          checked={selectedSeriesIds.has(series.id)}
                          onChange={() => toggleSeries(series.id)}
                        />
                        <span
                          className="series-color"
                          style={{ backgroundColor: series.color }}
                        />
                        <span className="series-name">{series.name}</span>
                      </label>
                    ))}

                    {/* Sub-categories */}
                    {hasSubCategories && category.subCategories!.map(subCategory => {
                      const subKey = `${category.name}::${subCategory.name}`;
                      const isSubExpanded = expandedSubCategories.has(subKey);
                      const subSelectedCount = subCategory.series.filter(s => selectedSeriesIds.has(s.id)).length;

                      return (
                        <div key={subKey} className="subcategory-section">
                          <div
                            className="subcategory-header"
                            onClick={() => toggleSubCategory(subKey)}
                          >
                            <span className="expand-icon sub">{isSubExpanded ? '▾' : '▸'}</span>
                            <span className="subcategory-name">{subCategory.name}</span>
                            {subSelectedCount > 0 && (
                              <span className="selected-count sub">({subSelectedCount})</span>
                            )}
                          </div>

                          {isSubExpanded && (
                            <div className="subcategory-items">
                              <div className="subcategory-actions">
                                <button onClick={() => selectAllInSubCategory(subCategory)}>All</button>
                                <button onClick={() => deselectAllInSubCategory(subCategory)}>None</button>
                              </div>
                              {subCategory.series.map(series => (
                                <label key={series.id} className="series-item sub-item">
                                  <input
                                    type="checkbox"
                                    checked={selectedSeriesIds.has(series.id)}
                                    onChange={() => toggleSeries(series.id)}
                                  />
                                  <span
                                    className="series-color"
                                    style={{ backgroundColor: series.color }}
                                  />
                                  <span className="series-name">{series.name}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="chart-main">
        {/* Controls */}
        <div className="chart-controls">
          <div className="control-group">
            <label>CHART TYPE</label>
            <div className="chart-type-buttons">
              <button
                className={`type-btn ${chartType === 'line' ? 'active' : ''}`}
                onClick={() => setChartType('line')}
              >
                📈 LINE
              </button>
              <button
                className={`type-btn ${chartType === 'bar' ? 'active' : ''}`}
                onClick={() => setChartType('bar')}
              >
                📊 BAR
              </button>
              <button
                className={`type-btn ${chartType === 'pie' ? 'active' : ''}`}
                onClick={() => setChartType('pie')}
              >
                🥧 PIE
              </button>
            </div>
          </div>

          <div className="control-group">
            <label>REPORT RANGE</label>
            <div className="range-selectors">
              <select
                value={reportRange.start}
                onChange={(e) => setReportRange(prev => ({ ...prev, start: e.target.value }))}
              >
                {techAllReports.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <span className="range-separator">to</span>
              <select
                value={reportRange.end}
                onChange={(e) => setReportRange(prev => ({ ...prev, end: e.target.value }))}
              >
                {techAllReports.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="selection-info">
            <span className="info-label">Selected:</span>
            <span className="info-value">{allActiveSeries.length} series</span>
          </div>

          {onDownloadChart && (
            <div className="control-group download-control">
              <label>DOWNLOAD</label>
              <button
                className="download-chart-btn"
                onClick={onDownloadChart}
              >
                PNG
              </button>
            </div>
          )}
        </div>

        {/* Chart Display */}
        <div className="chart-container">
          <div className="chart-wrapper">
            {renderChart()}
          </div>
        </div>

        {/* Selected Series Legend */}
        {allActiveSeries.length > 0 && (
          <div className="selected-legend">
            <div className="legend-header">
              <h4>ACTIVE SERIES</h4>
              {selectedSeries.length >= 2 && (
                <button className="formula-btn" onClick={openFormulaBuilder}>
                  ƒx CREATE FORMULA
                </button>
              )}
            </div>
            <div className="legend-items">
              {selectedSeries.map(series => (
                <div key={series.id} className="legend-item">
                  <span
                    className="legend-color"
                    style={{ backgroundColor: series.color }}
                  />
                  <span className="legend-name">{series.name}</span>
                  <button
                    className="remove-btn"
                    onClick={() => toggleSeries(series.id)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* Calculated Series */}
            {calculatedSeriesData.length > 0 && (
              <div className="calculated-series-section">
                <h5 className="calculated-header">CALCULATED SERIES</h5>
                <div className="legend-items calculated-items">
                  {calculatedSeriesList.map(calc => (
                    <div key={calc.id} className="legend-item calculated-item">
                      <span
                        className="legend-color"
                        style={{ backgroundColor: calc.color }}
                      />
                      <div className="calculated-info">
                        <span className="legend-name">{calc.name}</span>
                        <span className="formula-display">
                          {getSeriesNameById(calc.operandA)} {getOperatorSymbol(calc.operator)} {getSeriesNameById(calc.operandB)}
                        </span>
                      </div>
                      <button
                        className="remove-btn"
                        onClick={() => removeCalculatedSeries(calc.id)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Formula Builder Modal */}
        {showFormulaBuilder && (
          <div className="formula-modal-overlay" onClick={() => setShowFormulaBuilder(false)}>
            <div className="formula-modal" onClick={e => e.stopPropagation()}>
              <div className="formula-modal-header">
                <h3>ƒx CREATE FORMULA</h3>
                <button className="close-btn" onClick={() => setShowFormulaBuilder(false)}>×</button>
              </div>

              <div className="formula-modal-body">
                <div className="formula-row">
                  <label>CUSTOM LABEL</label>
                  <input
                    type="text"
                    value={formulaName}
                    onChange={e => setFormulaName(e.target.value)}
                    placeholder="e.g., Total Loans"
                    className="formula-input"
                  />
                </div>

                <div className="formula-equation">
                  <div className="formula-operand">
                    <label>SERIES A</label>
                    <select
                      value={formulaOperandA}
                      onChange={e => setFormulaOperandA(e.target.value)}
                      className="formula-select"
                    >
                      <option value="">Select series...</option>
                      {allSeries.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="formula-operator">
                    <label>OPERATOR</label>
                    <div className="operator-buttons">
                      {(['+', '-', '*', '/'] as FormulaOperator[]).map(op => (
                        <button
                          key={op}
                          className={`op-btn ${formulaOperator === op ? 'active' : ''}`}
                          onClick={() => setFormulaOperator(op)}
                        >
                          {getOperatorSymbol(op)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="formula-operand">
                    <label>SERIES B</label>
                    <select
                      value={formulaOperandB}
                      onChange={e => setFormulaOperandB(e.target.value)}
                      className="formula-select"
                    >
                      <option value="">Select series...</option>
                      {allSeries.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="formula-preview">
                  <span className="preview-label">PREVIEW:</span>
                  <span className="preview-formula">
                    {formulaName || '(Label)'} = {getSeriesNameById(formulaOperandA) || '(A)'} {getOperatorSymbol(formulaOperator)} {getSeriesNameById(formulaOperandB) || '(B)'}
                  </span>
                </div>
              </div>

              <div className="formula-modal-footer">
                <button className="cancel-btn" onClick={() => setShowFormulaBuilder(false)}>
                  CANCEL
                </button>
                <button
                  className="create-btn"
                  onClick={createCalculatedSeries}
                  disabled={!formulaName.trim() || !formulaOperandA || !formulaOperandB}
                >
                  CREATE SERIES
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TechChartBuilder;
