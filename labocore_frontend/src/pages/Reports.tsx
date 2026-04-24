import React from 'react'
import Card from '../components/Card'

const Reports: React.FC = () => {
  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-title">Analytics & Reports</h2>
          <p className="page-subtitle">Generate insights into laboratory performance</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary">Generate Report</button>
        </div>
      </div>
      <div className="grid-cols-2">
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem' }}>Turnaround Time Analysis</h3>
            <span className="badge info">Monthly</span>
          </div>
          <div style={{ height: '180px', background: 'var(--surface-hover)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', border: '1px dashed var(--border-color)' }}>
            [ Line Chart: Avg. TAT over 30 days ]
          </div>
        </Card>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem' }}>Test Volume by Type</h3>
            <span className="badge info">Weekly</span>
          </div>
          <div style={{ height: '180px', background: 'var(--surface-hover)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', border: '1px dashed var(--border-color)' }}>
            [ Bar Chart: Tests segmented by dept ]
          </div>
        </Card>
      </div>
    </>
  )
}

export default Reports
