import React, { useState } from 'react'
import Card from '../components/Card'
import DataTable, { Column } from '../components/DataTable'
import Badge from '../components/Badge'

interface Sample {
  id: string;
  patientId: string;
  type: string;
  priority: 'Routine' | 'Urgent' | 'Stat';
  collectionDate: string;
  status: 'Pending' | 'Processing' | 'Completed' | 'Rejected';
  owner: string;
}

const initialSamples: Sample[] = [
  { id: 'SMP-2023-1101', patientId: 'PT-8832', type: 'Blood', priority: 'Routine', collectionDate: '2023-10-24 08:30', status: 'Completed', owner: 'J. Smith' },
  { id: 'SMP-2023-1102', patientId: 'PT-4491', type: 'Urine', priority: 'Urgent', collectionDate: '2023-10-24 09:15', status: 'Processing', owner: 'M. Chen' },
  { id: 'SMP-2023-1103', patientId: 'PT-1002', type: 'Blood', priority: 'Stat', collectionDate: '2023-10-24 10:05', status: 'Pending', owner: 'Unassigned' },
  { id: 'SMP-2023-1104', patientId: 'PT-5561', type: 'Swab', priority: 'Routine', collectionDate: '2023-10-24 11:20', status: 'Pending', owner: 'J. Smith' },
  { id: 'SMP-2023-1105', patientId: 'PT-8832', type: 'Tissue', priority: 'Routine', collectionDate: '2023-10-23 14:00', status: 'Rejected', owner: 'System' },
]

const Samples: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredSamples = initialSamples.filter(s => 
    s.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.patientId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const columns: Column<Sample>[] = [
    { 
      header: 'Sample ID', 
      accessor: (row) => <span style={{ fontWeight: 600, color: 'var(--primary-color)' }}>{row.id}</span> 
    },
    { header: 'Patient', accessor: 'patientId', className: 'table-desktop-only' },
    { header: 'Type', accessor: 'type' },
    { 
      header: 'Priority', 
      accessor: (row) => {
        const color = row.priority === 'Stat' ? 'var(--danger)' : row.priority === 'Urgent' ? 'var(--warning)' : 'var(--text-muted)'
        return <span style={{ color, fontWeight: 500 }}>{row.priority}</span>
      }
    },
    { header: 'Date', accessor: 'collectionDate', className: 'table-desktop-only' },
    { 
      header: 'Status', 
      accessor: (row) => {
        const variantMap: Record<string, any> = {
          'Completed': 'success',
          'Processing': 'info',
          'Pending': 'warning',
          'Rejected': 'danger'
        }
        return <Badge variant={variantMap[row.status] || 'default'}>{row.status}</Badge>
      }
    },
    { 
      header: 'Actions', 
      accessor: () => <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>View</button> 
    }
  ]

  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-title">Samples</h2>
          <p className="page-subtitle">Manage and track sample collections and processing</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-outline">Export</button>
          <button className="btn btn-primary">Register Sample</button>
        </div>
      </div>

      <Card noPadding>
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className="search-input" style={{ width: '320px', border: '1px solid var(--border-color)', display: 'flex', background: 'var(--surface-color)' }}>
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" color="var(--text-muted)"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
             <input type="text" placeholder="Search by Sample or Patient ID..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <select className="form-control" style={{ width: '160px', borderRadius: 'var(--radius-full)' }}>
            <option>All Statuses</option>
            <option>Pending</option>
            <option>Processing</option>
            <option>Completed</option>
          </select>
        </div>
        <DataTable data={filteredSamples} columns={columns} keyExtractor={r => r.id} />
      </Card>
    </>
  )
}

export default Samples
