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
          <p className="page-subtitle">Overview of laboratory operations and alerts</p>
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
        <Card>
          <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.125rem' }}>Recent Activity</h3>
            <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>View All</button>
          </div>
          <DataTable data={mockActivity} columns={activityCols} keyExtractor={r => r.id} />
        </Card>

        <Card>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Workload Overview</h3>
          <div style={{ height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--surface-hover)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-color)', color: 'var(--text-muted)' }}>
            [ Chart Placeholder: Workload by Department ]
          </div>
        </Card>
      </div>
    </>
  )
}

export default Dashboard
