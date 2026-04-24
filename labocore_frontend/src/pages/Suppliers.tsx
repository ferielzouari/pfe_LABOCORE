import React from 'react'
import Card from '../components/Card'

const Suppliers: React.FC = () => {
  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-title">Suppliers Directory</h2>
          <p className="page-subtitle">Manage vendors and procurements</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary">Add Supplier</button>
        </div>
      </div>
      <div className="grid-cols-2">
        <Card>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>ChemSupply Ltd</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Reagents and general laboratory chemicals</p>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
            <span className="badge success">Active</span>
            <span className="badge default">SLA: 48h</span>
          </div>
        </Card>
        <Card>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>BioPlast Co</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Consumables, tubes, and safety equipment</p>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
            <span className="badge success">Active</span>
            <span className="badge default">SLA: 72h</span>
          </div>
        </Card>
      </div>
    </>
  )
}

export default Suppliers
