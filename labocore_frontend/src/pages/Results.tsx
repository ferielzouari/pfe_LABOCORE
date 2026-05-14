import React, { useState, useEffect, useCallback } from 'react'
import Card from '../components/Card'
import DataTable, { Column } from '../components/DataTable'
import Badge from '../components/Badge'
import { analysesApi, DemandeAnalyseDto } from '../services/api'

const PAGE_SIZE = 20

const Results: React.FC = () => {
  const [data, setData] = useState<DemandeAnalyseDto[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [famille, setFamille] = useState('')
  const [actif, setActif] = useState<boolean | undefined>(undefined)
  const [families, setFamilies] = useState<string[]>([])
  const [exporting, setExporting] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await analysesApi.getAll(page, PAGE_SIZE, search, famille, actif)
      setData(res.items)
      setTotal(res.total)
    } catch (err) {
      console.error('Failed to fetch analyses', err)
    } finally {
      setLoading(false)
    }
  }, [page, search, famille, actif])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    analysesApi.getFamilies().then(setFamilies).catch(console.error)
  }, [])

  const handleExport = async () => {
    setExporting(true)
    try {
      // Fetch matching records without pagination for export
      const res = await analysesApi.getAll(1, 5000, search, famille, actif)
      const analyses = res.items

      if (analyses.length === 0) {
        alert('No data available to export.')
        return
      }

      const headers = ['Code', 'Designation (FR)', 'Designation (EN)', 'Family', 'Type', 'Constituents', 'Status']
      const rows = analyses.map(a => [
        a.codeDemande,
        a.designation,
        a.designationAnglais || '',
        a.codeFamille || '',
        a.type || '',
        a.nbrAnalyseConst || '',
        a.actif ? 'Active' : 'Inactive'
      ])

      // Add BOM for Excel UTF-8 compatibility
      const BOM = '\uFEFF'
      const csvContent = BOM + [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
      ].join('\r\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      const date = new Date().toISOString().split('T')[0]
      
      link.setAttribute('href', url)
      link.setAttribute('download', `analyses_export_${date}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (err: any) {
      console.error('Export failed', err)
      alert('Export failed: ' + (err?.message || 'Unknown error'))
    } finally {
      setExporting(false)
    }
  }

  const columns: Column<DemandeAnalyseDto>[] = [
    {
      header: 'Code',
      accessor: (row) => <span style={{ fontWeight: 700, color: 'var(--primary-color)' }}>{row.codeDemande}</span>
    },
    { header: 'Designation (FR)', accessor: 'designation' },
    { header: 'Designation (EN)', accessor: 'designationAnglais' },
    { header: 'Family', accessor: 'codeFamille' },
    { header: 'Type', accessor: 'type' },
    { header: 'Constituents', accessor: 'nbrAnalyseConst' },
    {
      header: 'Status',
      accessor: (row) => (
        <Badge variant={row.actif ? 'success' : 'danger'}>
          {row.actif ? 'Active' : 'Inactive'}
        </Badge>
      )
    }
  ]

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-title">Analysis Catalogue</h2>
          <p className="page-subtitle">Browse and search available laboratory analyses</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={handleExport} disabled={exporting} style={{ paddingLeft: '1.25rem', paddingRight: '1.25rem' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '0.5rem' }}>
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            {exporting ? 'Exporting...' : 'Export CSV'}
          </button>
        </div>
      </div>

      <Card noPadding>
        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="search-input-modern" style={{ maxWidth: '400px', flex: 1 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="search-icon">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search by code or designation..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <select
              className="btn btn-outline"
              style={{ padding: '0.625rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', height: '42px', minWidth: '160px' }}
              value={famille}
              onChange={(e) => { setFamille(e.target.value); setPage(1) }}
            >
              <option value="">All Families</option>
              {families.map(f => <option key={f} value={f}>{f}</option>)}
            </select>

            <select
              className="btn btn-outline"
              style={{ padding: '0.625rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', height: '42px', minWidth: '140px' }}
              value={actif === undefined ? '' : String(actif)}
              onChange={(e) => {
                const val = e.target.value
                setActif(val === '' ? undefined : val === 'true')
                setPage(1)
              }}
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>

        <div className="table-container">
          {loading ? (
            <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading analyses...</div>
          ) : (
            <DataTable
              data={data}
              columns={columns}
              keyExtractor={(row) => row.codeDemande}
            />
          )}
        </div>

        <div style={{ padding: '1.25rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          <span>Showing <strong>{data.length}</strong> of <strong>{total}</strong> analyses</span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8125rem' }} disabled={page === 1 || loading} onClick={() => setPage(p => p - 1)}>Previous</button>
            <div style={{ display: 'flex', alignItems: 'center', padding: '0 1rem', fontWeight: 600, color: 'var(--text-main)' }}>{page} / {totalPages || 1}</div>
            <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8125rem' }} disabled={page === totalPages || totalPages === 0 || loading} onClick={() => setPage(p => p + 1)}>Next</button>
          </div>
        </div>
      </Card>
    </>
  )
}

export default Results
