import React from 'react'
import StatCard from '../components/StatCard'
import Card from '../components/Card'
import Badge from '../components/Badge'
import DataTable, { Column } from '../components/DataTable'

interface Activity {
  id: string;
  action: string;
  target: string;
  time: string;
  user: string;
  status: 'success' | 'warning' | 'info';
}

const mockActivity: Activity[] = [
  { id: '1', action: 'Sample Validated', target: 'SMP-2023-0891', time: '10 mins ago', user: 'Dr. Smith', status: 'success' },
  { id: '2', action: 'Low Stock Alert', target: 'Reagent A', time: '1 hour ago', user: 'System', status: 'warning' },
  { id: '3', action: 'New Supplier Added', target: 'BioGenics Inc', time: '3 hours ago', user: 'Alice', status: 'info' },
  { id: '4', action: 'Results Pending', target: 'Batch 44B', time: '5 hours ago', user: 'System', status: 'warning' },
]

const Dashboard: React.FC = () => {
  const activityCols: Column<Activity>[] = [
    { 
      header: 'Event', 
      accessor: (row) => (
        <div>
          <span style={{ fontWeight: 500, display: 'block', marginBottom: '2px' }}>{row.action}</span>
          <span style={{ color: 'var(--text-muted)' }}>{row.target}</span>
        </div>
      ) 
    },
    { header: 'User', accessor: 'user' },
    { header: 'Time', accessor: 'time' },
    { 
      header: 'Status', 
      accessor: (row) => <Badge variant={row.status}>{row.status}</Badge> 
    }
  ]

  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-title">Dashboard</h2>
          <p className="page-subtitle">Welcome back! Here's your laboratory overview.</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
             New Sample
          </button>
        </div>
      </div>

      <div className="grid-cols-4 mb-6">
        <StatCard 
          title="Pending Samples" 
          value="142" 
          trend={{ value: '12%', isPositive: false }}
          variant="warning"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
        />
        <StatCard 
          title="Completed Results" 
          value="89" 
          trend={{ value: '5%', isPositive: true }}
          variant="success"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>}
        />
        <StatCard 
          title="Delayed Items" 
          value="12" 
          trend={{ value: '2', isPositive: false }}
          variant="danger"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
        />
        <StatCard 
          title="Active Techs" 
          value="8" 
          variant="primary"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
        />
      </div>

      <div className="grid-cols-2">
        <Card noPadding>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, #e8ebf8 0%, #f3e8ff 100%)' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#0f172a' }}>Recent Activity</h3>
            <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', fontWeight: 600 }}>View All</button>
          </div>
          <div className="table-container">
            <DataTable data={mockActivity} columns={activityCols} keyExtractor={r => r.id} />
          </div>
        </Card>

        <Card>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.25rem', color: '#0f172a' }}>Lab Performance</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { label: 'Sample Processing Rate', value: 92, color: '#3b5bdb' },
              { label: 'Quality Assurance', value: 98, color: '#10b981' },
              { label: 'Equipment Status', value: 87, color: '#f59e0b' },
            ].map((metric, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)' }}>{metric.label}</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: metric.color }}>{metric.value}%</span>
                </div>
                <div style={{ height: '8px', backgroundColor: 'var(--surface-hover)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      backgroundColor: metric.color,
                      width: `${metric.value}%`,
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  )
}

export default Dashboard
