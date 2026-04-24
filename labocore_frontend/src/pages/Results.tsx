import React from 'react'
import Card from '../components/Card'

const Results: React.FC = () => {
  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-title">Results Review</h2>
          <p className="page-subtitle">Validate and approve analytical outcomes</p>
        </div>
      </div>
      <Card>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ marginBottom: '1rem', color: 'var(--border-color)' }}>
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <h3 style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>No Results Pending Review</h3>
          <p>All laboratory results have been validated and released.</p>
        </div>
      </Card>
    </>
  )
}

export default Results
