import React, { useState } from 'react'
import Card from '../components/Card'

interface KPIMetric {
  label: string;
  value: string | number;
  unit?: string;
  trend?: { value: number; isPositive: boolean };
  color: 'primary' | 'success' | 'warning' | 'danger' | 'accent';
}

const Reports: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const kpiMetrics: KPIMetric[] = [
    {
      label: 'Total Tests Completed',
      value: 2847,
      trend: { value: 12, isPositive: true },
      color: 'primary',
    },
    {
      label: 'Pending Tests',
      value: 342,
      trend: { value: 8, isPositive: false },
      color: 'warning',
    },
    {
      label: 'Average Turnaround Time',
      value: '4.2',
      unit: 'hours',
      trend: { value: 5, isPositive: true },
      color: 'success',
    },
    {
      label: 'Accuracy Rate',
      value: 99.2,
      unit: '%',
      trend: { value: 0.3, isPositive: true },
      color: 'accent',
    },
    {
      label: 'Failed/Retest',
      value: 23,
      trend: { value: 2, isPositive: true },
      color: 'danger',
    },
    {
      label: 'Technician Efficiency',
      value: 94.5,
      unit: '%',
      trend: { value: 4.2, isPositive: true },
      color: 'primary',
    },
  ];

  const colorMap = {
    primary: { bg: '#e8ebf8', text: '#3b5bdb', icon: '#3b5bdb' },
    success: { bg: '#d1fae5', text: '#10b981', icon: '#10b981' },
    warning: { bg: '#fef3c7', text: '#f59e0b', icon: '#f59e0b' },
    danger: { bg: '#fee2e2', text: '#ef4444', icon: '#ef4444' },
    accent: { bg: '#f3e8ff', text: '#7c3aed', icon: '#7c3aed' },
  };

  const getMetricIcon = (color: string) => {
    const iconMap: { [key: string]: JSX.Element } = {
      primary: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>,
      success: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>,
      warning: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3.05h16.94a2 2 0 0 0 1.71-3.05L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>,
      danger: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>,
      accent: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path><path d="M3 21v-5h5"></path></svg>,
    };
    return iconMap[color] || iconMap.primary;
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-title">KPI Dashboard</h2>
          <p className="page-subtitle">Real-time laboratory performance metrics and analytics</p>
        </div>
        <div className="page-actions">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--surface-color)',
              color: 'var(--text-main)',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid-cols-3 mb-6">
        {kpiMetrics.map((metric, index) => {
          const colors = colorMap[metric.color];
          return (
            <Card key={index} style={{ position: 'relative', overflow: 'hidden' }}>
              {/* Background accent */}
              <div
                style={{
                  position: 'absolute',
                  top: -20,
                  right: -20,
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  opacity: 0.1,
                  backgroundColor: colors.text,
                }}
              />
              
              {/* Content */}
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '0.5rem' }}>
                      {metric.label}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                      <span style={{ fontSize: '2rem', fontWeight: 700, color: colors.text }}>
                        {metric.value}
                      </span>
                      {metric.unit && (
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                          {metric.unit}
                        </span>
                      )}
                    </div>
                  </div>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: '0.75rem',
                      backgroundColor: colors.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: colors.icon,
                    }}
                  >
                    {getMetricIcon(metric.color)}
                  </div>
                </div>

                {/* Trend */}
                {metric.trend && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: metric.trend.isPositive ? '#10b981' : '#ef4444',
                        backgroundColor: metric.trend.isPositive ? '#d1fae5' : '#fee2e2',
                        padding: '0.25rem 0.5rem',
                        borderRadius: 'var(--radius-full)',
                      }}
                    >
                      {metric.trend.isPositive ? '↑' : '↓'} {Math.abs(metric.trend.value)}%
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      vs last period
                    </span>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Detailed Analytics Section */}
      <div className="grid-cols-2">
        <Card>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              Turnaround Time Trend
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Average processing time over {selectedPeriod}
            </p>
          </div>
          <div
            style={{
              height: 240,
              background: 'linear-gradient(135deg, #e8ebf8 0%, #f3e8ff 100%)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px dashed var(--border-color)',
              color: 'var(--text-muted)',
              fontSize: '0.875rem',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: '0.75rem', opacity: 0.5, margin: '0 auto' }}>
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline>
              </svg>
              <p>Turnaround Time Analytics</p>
            </div>
          </div>
        </Card>

        <Card>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              Test Distribution by Type
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Volume breakdown across all test categories
            </p>
          </div>
          <div
            style={{
              height: 240,
              background: 'linear-gradient(135deg, #fef3c7 0%, #d1fae5 100%)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px dashed var(--border-color)',
              color: 'var(--text-muted)',
              fontSize: '0.875rem',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: '0.75rem', opacity: 0.5, margin: '0 auto' }}>
                <rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              <p>Test Distribution Chart</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Summary Stats */}
      <div style={{ marginTop: '2rem' }}>
        <Card>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.5rem' }}>
            Performance Summary
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
            <div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 500 }}>
                Tests/Day Average
              </p>
              <p style={{ fontSize: '1.75rem', fontWeight: 700, color: '#3b5bdb' }}>
                284
              </p>
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 500 }}>
                Quality Score
              </p>
              <p style={{ fontSize: '1.75rem', fontWeight: 700, color: '#10b981' }}>
                96.8%
              </p>
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 500 }}>
                Peak Hour
              </p>
              <p style={{ fontSize: '1.75rem', fontWeight: 700, color: '#7c3aed' }}>
                10AM
              </p>
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 500 }}>
                Resource Util.
              </p>
              <p style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f59e0b' }}>
                87.3%
              </p>
            </div>
          </div>
        </Card>
      </div>
    </>
  )
}

export default Reports
