import React from 'react'
import Card from '../components/Card'

const Technicians: React.FC = () => {
  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-title">Lab Staff</h2>
          <p className="page-subtitle">Manage technicians and roles</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary">Add Staff</button>
        </div>
      </div>
      <div className="grid-cols-4">
        {[1,2,3,4].map(id => (
          <Card key={id} style={{ textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 600, margin: '0 auto 1rem' }}>
              T{id}
            </div>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Tech {id}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>General Lab</p>
            <button className="btn btn-outline" style={{width: '100%', padding: '0.35rem'}}>View Profile</button>
          </Card>
        ))}
      </div>
    </>
  )
}

export default Technicians
